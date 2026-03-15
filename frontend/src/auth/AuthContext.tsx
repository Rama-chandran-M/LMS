import { createContext } from "react";
import { JwtPayload } from "../utils/jwt";

export interface AuthContextType {
  token: string | null;
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);