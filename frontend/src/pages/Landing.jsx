import React, { useState } from "react";
import { Login } from "../components/Login";
import { CreateUser } from "../components/CreateUser";

export function Landing() {
  const [view, setView] = useState(0);
  return (
    <>

    {/* {IMPORTANT!!} */}
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
            
          Register now
          </button>
        </>
      )}
    </>
  );
}
