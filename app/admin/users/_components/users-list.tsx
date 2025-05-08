"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch {
        setError("Failed to fetch users");
      }
    }
    fetchUsers();
  }, []);
  return <div>UsersList</div>;
};

export default UsersList;
