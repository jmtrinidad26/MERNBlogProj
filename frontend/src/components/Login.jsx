import React from "react";
import { verifyUser } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let response = await verifyUser(user);
      
      if (response) {
        sessionStorage.setItem("User", response);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response}`;
        navigate("/home");
      } else {
        setErrors({ submit: "Invalid email or password. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="loginUser">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            value={user.email}
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            value={user.password}
            className={errors.password ? "error" : ""}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
