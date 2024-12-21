import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleError = (err) => toast.error(err, { position: "bottom-left" });
  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "http://localhost:4000/user/signup"
      : "http://localhost:4000/user/login";

    try {
      const { data } = await axios.post(
        url,
        {
          email,
          password,
          ...(isSignup && { username }),
        },
        {
          withCredentials: true,
        }
      );

      const { success, message, user } = data;
      if (success) {
        Cookies.set(
          "user",
          JSON.stringify({
            _id: user._id,
            username: user.username,
            email: user.email,
          }),
          {
            expires: 1,
          }
        );
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("An error occurred. Please try again later.");
      console.error("Error:", error);
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
                  placeholder="Enter your username"
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn mt-2 user-btn">
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>
          <div className="mt-3">
            {isSignup ? (
              <p>
                Already have an account? <br />
                <span
                  onClick={handleSwitchMode}
                  className="link-text text-decoration-none text-secondary-emphasis"
                  style={{ cursor: "pointer" }}
                >
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don’t have an account? <br />
                <span
                  onClick={handleSwitchMode}
                  className="link-text text-decoration-none text-secondary-emphasis"
                  style={{ cursor: "pointer" }}
                >
                  Create New Account
                </span>
              </p>
            )}
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default User;
