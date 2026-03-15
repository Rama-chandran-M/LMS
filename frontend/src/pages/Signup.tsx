import { FormEvent } from "react";
import { signupUser } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      full_name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      user_role: formData.get("user_role") as "STUDENT" | "INSTRUCTOR",
    };

    try {
      await signupUser(data);
      navigate("/");
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Signup failed";
      alert(msg);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Signup</h2>

        {/* Full Name */}
        <input
          name="fullName"
          placeholder="Full Name"
          required
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email"
          required
          style={inputStyle}
        />
        <p>Min Length of 6 Chars</p>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={inputStyle}
        />

        <select name="user_role" style={inputStyle}>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Register
        </button>

        <p style={textStyle}>
          Already have an account?{" "}
          <Link to="/" style={linkStyle}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ---------- inline styles ---------- */

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