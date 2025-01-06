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

  const handleSubmit = async (e) => {
    e.preventDefault()
    let response = await verifyUser(user);
    
    if (response){
      sessionStorage.setItem("User", response)
      console.log(`Bearer ${response}`)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response}`
      navigate("/home")
    }
    else{
      alert('Wrong entry')
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value }); // name does not equal to user's name, rather the property
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="loginUser">
        <input
          type="text"
          placeholder="email"
          onChange={handleChange}
          name="email"
          required
          maxLength={40}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          name="password"
          required
          maxLength={10}
        />

        <button type="submit">Login</button>
      </form>
    </>
  );
}
