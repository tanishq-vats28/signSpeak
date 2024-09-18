import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function User() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setMessage("");
  };

  const validateForm = () => {
    let formErrors = {};

    if (isSignup && username.trim() === "") {
      formErrors.username = "Username is required.";
    }

    if (email.trim() === "") {
      formErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      formErrors.email = "Please enter a valid email.";
    }

    if (password.trim() === "") {
      formErrors.password = "Password is required.";
    } else if (password.length < 4) {
      formErrors.password = "Password must be at least 4 characters long.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const endpoint = isSignup ? "/signup" : "/login";
      const data = isSignup
        ? { username, email, password }
        : { email, password };

      try {
        // Signup process
        const response = await axios.post(
          `http://127.0.0.1:5000${endpoint}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setMessage(response.data.message);
        setErrors({});

        if (isSignup) {
          // Automatically login after signup
          const loginData = { email, password };
          const loginResponse = await axios.post(
            "http://127.0.0.1:5000/login",
            JSON.stringify(loginData),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          Cookies.set("user", JSON.stringify(loginResponse.data.user), {
            expires: 1,
            secure: true,
          });
          // Redirect to dashboard
          window.location.href = "http://localhost:5173/dashboard";
        } else {
          // If it's a login request
          Cookies.set("user", JSON.stringify(response.data.user), {
            expires: 1,
            secure: true,
          });
          // Redirect to dashboard
          window.location.href = "http://localhost:5173/dashboard";
        }
      } catch (error) {
        if (error.response) {
          setErrors({ server: error.response.data.error });
        } else {
          setErrors({ server: "Something went wrong!" });
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="row m-5">
        <div className="col-8 user-img">
          <img src="images/Designer (6).png" alt="login" />
        </div>
        <div className="col-4 mt-4 pt-4 text-start">
          <form className="mt-3" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <span className="text-danger">{errors.username}</span>
                )}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="text-danger">{errors.password}</span>
              )}
            </div>
            <button type="submit" className="btn mt-2 user-btn">
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>
          {message && <p className="text-success mt-3">{message}</p>}
          {errors.server && <p className="text-danger mt-3">{errors.server}</p>}
          <div className="mt-3">
            <div>
              {isSignup ? (
                <p>
                  <a href="#" onClick={handleSwitchMode} className="link-text">
                    Already have an account?
                  </a>
                </p>
              ) : (
                <p>
                  <a href="#" onClick={handleSwitchMode} className="link-text">
                    Create New Account
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
