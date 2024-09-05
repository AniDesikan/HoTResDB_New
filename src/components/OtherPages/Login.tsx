import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const Login: React.FC = () => {
  const [uname, setUname] = useState<string>("");
  const [pword, setPword] = useState<string>("");
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { uname, pword };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle the response
      console.log("Server Response:", result);

      if (response.ok) {
        // Process success scenario (e.g., redirect, show success message)
        alert(result.response);
        if (
          result.response == "Successfully Logged In" ||
          result.response ==
            "You have logged in, but you do not have approval to see unpublished results."
        ) {
          Cookies.set("username", uname); // Expires in 7 days
          Cookies.set("approval", result.approval);
          Cookies.set("admin", result.admin);
          navigate("/Queries");
        }
      } else {
        // Handle error scenario (e.g., show error message)
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="uname">Username:</label>
        <input
          type="text"
          className="form-control"
          id="uname"
          name="uname"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="pword">Password:</label>
        <input
          type="password"
          className="form-control"
          id="pword"
          name="pword"
          value={pword}
          onChange={(e) => setPword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default Login;
