"use client";

import { useEffect, useState } from "react";
import { Users } from "@/components/Tables/users";
import { useApiClient } from "@/lib/api";

const UsersClient = () => {
  const [users, setUsers] = useState<any>([]);
  const [error, setError] = useState("");
  const api = useApiClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("user");
        setUsers(res.data?.data || []);
      } catch (err: any) {
        setError(
          "Failed to load users: " + (err.response?.status || err.message),
        );
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="">
        <div className="col-span-12">
          <Users users={users?.users} />
        </div>
      </div>
    </>
  );
};

export default UsersClient;
