// lib/redux-api.ts
import { getDecryptedItem, setEncryptedItem } from '@/utils/storageHelper';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const handleResponse = async (response: Response) => {
  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
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

// Create API client for Redux (no hooks)
export const reduxApiClient = {
  request: async (
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

    if ((response.status === 403 || response?.status === 401) && includeToken) {
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
  },

  get: (url: string, params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return reduxApiClient.request("GET", `${url}${queryString}`);
  },

  post: (url: string, body: any) => reduxApiClient.request("POST", url, body),
  put: (url: string, body: any) => reduxApiClient.request("PUT", url, body),
  patch: (url: string, body?: any) => reduxApiClient.request("PATCH", url, body),
  delete: (url: string) => reduxApiClient.request("DELETE", url),
  postFile: (url: string, formData: FormData) => reduxApiClient.request("POST", url, formData, true, true),
};
