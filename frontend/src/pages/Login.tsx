import { FormEvent } from "react";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { decodeJWT } from "../utils/jwt";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await loginUser({ email, password });
    
    // Access token via res.data as requested
    const token = res.data.access_token;
    login(token);

    // Decode to get the user_id (stored in 'sub' field)
    const payload = decodeJWT(token);
    if (payload?.sub) {
      localStorage.setItem("userId", payload.sub.toString());
    }

    // Redirect based on role
    payload.role === "INSTRUCTOR"
      ? navigate("/instructor/manage-courses")
      : navigate("/student");

  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Login failed";
    alert(errorMsg);
  }
};

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Login</h2>

        <input name="email" placeholder="Email" required style={inputStyle} />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Login
        </button>

        <p style={textStyle}>
          Don’t have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ---------- reuse same styles ---------- */

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f8",
};

const formStyle: React.CSSProperties = {
  width: "300px",
  padding: "20px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginBottom: "12px",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const textStyle: React.CSSProperties = {
  marginTop: "10px",
  textAlign: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#007bff",
  textDecoration: "none",
};
