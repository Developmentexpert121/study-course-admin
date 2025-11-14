// lib/api.ts
'use client';

import { getDecryptedItem, setEncryptedItem } from '@/utils/storageHelper';
import { useMemo } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const handleResponse = async (response: Response) => {
  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.log("❌ Failed to parse JSON. Raw response:", rawText);
    throw new Error("Failed to parse JSON response.");
  }

  return {
    success: response.ok,
    data: response.ok ? data : null,
    error: !response.ok ? data?.error || { message: 'Something went wrong' } : null,
  };
};

const refreshAccessToken = async () => {
  const refreshToken = getDecryptedItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}user/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json();

    if (res.ok && json?.data?.accessToken) {
      setEncryptedItem("token", json.data.accessToken);
      return json.data.accessToken;
    }

    return null;
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};

// Create a stable request function outside of the hook
const createRequest = () => {
  return async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    body?: any,
    includeToken: boolean = true,
    isFileUpload: boolean = false
  ) => {
    let token: any = getDecryptedItem("token");
    let headers: any = includeToken && token
      ? { Authorization: `Bearer ${token}` }
      : {};

    if (!isFileUpload) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(body && { body: isFileUpload ? body : JSON.stringify(body) }),
    };

    let response = await fetch(`${BASE_URL}${url}`, fetchOptions);
    if (response.status === 403 && includeToken) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setEncryptedItem("token", newToken);
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${BASE_URL}${url}`, fetchOptions);
      }
    }

    return handleResponse(response);
  };
};

export function useApiClient() {
  // Use useMemo to create a stable API object
  const api = useMemo(() => {
    const request = createRequest();

    return {
      get: (url: string) => request("GET", url),
      post: (url: string, body: any) => request("POST", url, body),
      put: (url: string, body: any) => request("PUT", url, body),
      patch: (url: string, body?: any) => request("PATCH", url, body),
      delete: (url: string) => request("DELETE", url),
      postFile: (url: string, formData: FormData) => request("POST", url, formData, true, true),
    };
  }, []); // Empty dependency array means this never changes

  return api;
}