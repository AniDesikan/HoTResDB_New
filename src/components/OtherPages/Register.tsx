import React, { useState, useEffect } from "react";

function Register() {
  const [uname, setUname] = useState<string>("");
  const [pword, setPword] = useState<string>("");
  const [pass2, setPass2] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  const checkPass = () => {
    console.log(pass2);
    console.log(pword);
    if (pass2 === pword) {
      setConfirmMessage("Passwords match");
    } else {
      setConfirmMessage("Passwords do not match");
    }
  };

  useEffect(() => {
    checkPass();
  }, [pass2, pword]); // Trigger checkPass whenever pass2 or pword changes

  const getAction = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = { uname, pword, fname, lname, email };
    // Add any logic needed for form submission here
    // e.g., check if fields are empty or validate inputs
    try {
      const response = await fetch("/api/register", {
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
    <form>
      <div className="search_data_outer_div">
        <div>Username:</div>
        <div className="search">
          <input
            type="text"
            id="uname"
            name="uname"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          />{" "}
          *
        </div>

        <div>Password:</div>
        <div className="search">
          <input
            type="password"
            id="pword"
            name="pword"
            value={pword}
            onChange={(e) => setPword(e.target.value)}
          />{" "}
          *
        </div>

        <div>Confirm Password:</div>
        <div className="search">
          <input
            type="password"
            id="pass2"
            name="pass2"
            value={pass2}
            onChange={(e) => {
              setPass2(e.target.value);
            }}
          />
          <span id="confirmMessage" className="confirmMessage">
            {confirmMessage}
          </span>
          *
        </div>

        <div>First name:</div>
        <div className="search">
          <input
            type="text"
            name="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>

        <div>Last name:</div>
        <div className="search">
          <input
            type="text"
            name="lname"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

        <div>E-mail:</div>
        <div className="search">
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          *
        </div>

        <br />
        <div
          className="g-recaptcha"
          id="rcaptcha"
          data-sitekey="6Lc-4M8pAAAAALFIg7EkzNwZZ4tQiXMmzrk8O2zL"
        ></div>
        <span id="captcha" style={{ color: "red" }}></span>
        <br />

        <div>
          <input
            type="submit"
            name="submit"
            onClick={getAction}
            value="Register"
            id="submit_button"
          />
        </div>

        <br />
        <i style={{ fontSize: "11px" }}>*Fields cannot be empty</i>
        <br />
      </div>
    </form>
  );
}

export default Register;
