import React, { useState } from "react";
import { Login } from "../components/Login";
import { CreateUser } from "../components/CreateUser";

export function Landing() {
  const [view, setView] = useState(0);
  return (
    <div className="landing-container">
      <div className="landing-card">
        {!view ? (
          <>
            <CreateUser />
            <button className="landingBut" onClick={() => setView(!view)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <Login />
            <button className="landingBut" onClick={() => setView(!view)}>
              Don't have an account? Register now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
