import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Spinner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);
    //passing some info along when redirecting in state
    count === 0 && navigate("/login", { state: location.pathname });
    return () => clearInterval(interval);
  }, [count, navigate, location]);

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">
          Redirecting to in {count} seconds
        </h1>
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
