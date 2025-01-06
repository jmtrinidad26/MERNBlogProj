import React from "react";
import { createUser } from "../api";
import { useState } from "react";

export function CreateUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = await createUser(user);
    response.status !== 200 ? alert("user not created") : alert("user created");
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value }); // name does not equal to user's name, rather the property
  };

  return (
    <>
      <h2>Create User</h2>
      <form className="createUser" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          onChange={handleChange}
          name="name"
          required
          maxLength={20}
        />
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

        <button type="submit">Register</button>
      </form>
    </>
  );
}
