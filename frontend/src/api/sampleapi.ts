import  api from "./axios"; // axios instance with interceptor

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  user_role: "STUDENT" | "INSTRUCTOR";
}

export const getAllUsers = () => {
  return api.get<User[]>("/user");
};