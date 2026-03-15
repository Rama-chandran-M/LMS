import api from "./axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto extends LoginDto {
  user_role: "INSTRUCTOR" | "STUDENT";
}

export const loginUser = (data: LoginDto) =>
  api.post<{ access_token: string }>("/auth/login", data);


export const signupUser = async (data: SignupDto) => {
  try {
    const response = await api.post("/user", data);
    // If it reaches here, the request was successful (200/201 OK)
    const userData = response.data;
    if (userData && userData.user_id) {
      localStorage.setItem('userId', userData.user_id.toString());
      return userData;
    }
  } catch (error) {
    // If it reaches here, the request failed (400/500 Error)
    console.error("SIGNUP ERROR:");
    throw error;
  }
}
