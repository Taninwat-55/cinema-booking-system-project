import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      const userData = {
        ...data.user, 
        token: data.token, 
        expiry: new Date().getTime() + 60 * 60 * 1000
      };

      localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
      setUser(userData); // Save to Context
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-inputs">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="login-field"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="login-field"
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
      <div className="login-bg"></div>
      <p>
        Need an account? <a href="/register">Register</a>
      </p>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </div>
  );
};

export default LoginPage;
