import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { decodeJWT, JwtPayload } from "../utils/jwt";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const storedToken = localStorage.getItem("access_token");
  const storedUser = storedToken ? decodeJWT(storedToken) : null;

  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<JwtPayload | null>(storedUser);

  const nav = useNavigate()
;
  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setUser(decodeJWT(newToken));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    // setToken(null);
    // setUser(null);
    localStorage.clear();
    nav('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};