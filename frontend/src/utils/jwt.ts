export interface JwtPayload {
  sub: string;              // user id
  email: string;
  role: "INSTRUCTOR" | "STUDENT";
  full_name?: string;       // optional; may be supplied by backend
  iat: number;
  exp: number;
}

export const decodeJWT = (token: string): JwtPayload => {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
};