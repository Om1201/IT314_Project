import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  useEffect(() => {
    const exchangeCode = async () => {
      try {
        console.log("Inside try");
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/oauth/google/callback`,
          { code },
          { withCredentials: true }
        );
        console.log(res);

        navigate("/"); // redirect after success
      } catch (err) {
        console.error("Error during token exchange:", err);
        alert(err.response?.data?.message || "Failed to exchange code");
        navigate("/signin"); 
      }
    };

    if (error) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }

    if (code) {
      exchangeCode();
    }
  }, [code, error, navigate]);

  if (error) return <h2>Permission denied from your end. Redirecting…</h2>;
  if (code) return <h2>Logging you in… Please wait.</h2>;
  return <h2>Invalid request. Redirecting…</h2>;
};

export default Callback;
