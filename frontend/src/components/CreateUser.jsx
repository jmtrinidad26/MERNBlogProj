import React from "react";
import { createUser } from "../api";
import { useState } from "react";

export function CreateUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    } else if (user.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (user.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (user.password.length > 100) {
      newErrors.password = "Password must be less than 100 characters";
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const { confirmPassword, ...userData } = user;
      let response = await createUser(userData);
      
      if (response.status === 200 || response.status === 201) {
        alert("Account created successfully! Please login.");
        setUser({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("taken")) {
        setErrors({ submit: "This email is already registered. Please login instead." });
      } else {
        setErrors({ submit: "Failed to create account. Please try again." });
      }
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
      <h2>Create Account</h2>
      <form className="createUser" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            name="name"
            value={user.name}
            className={errors.name ? "error" : ""}
            required
            maxLength={50}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

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
            placeholder="Password (min. 6 characters)"
            onChange={handleChange}
            name="password"
            value={user.password}
            className={errors.password ? "error" : ""}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            name="confirmPassword"
            value={user.confirmPassword}
            className={errors.confirmPassword ? "error" : ""}
            required
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
