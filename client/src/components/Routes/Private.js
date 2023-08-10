import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  console.log(auth);
  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/auth/user-auth");
      console.log(res.data);
      if (res.data.ok) setOk(true);
      else setOk(false);
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default Private;
