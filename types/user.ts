export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: Role;
}

export type Role = "admin" | "user";
