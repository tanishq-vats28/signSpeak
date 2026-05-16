import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/user.css";

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
      ? `${import.meta.env.VITE_BACKEND_URL}/user/signup`
      : `${import.meta.env.VITE_BACKEND_URL}/user/login`;

    try {
      const { data } = await axios.post(
        url,
        {
          email,
          password,
          ...(isSignup && { username }),
        },
        { withCredentials: true }
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
          { expires: 1 }
        );
        handleSuccess(message);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="user-img">
          <img src="images/Designer (6).png" alt="SignSpeak Interface" />
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-card">
            <h3>{isSignup ? "Create Account" : "Welcome Back"}</h3>
            <p className="auth-subtitle">
              {isSignup
                ? "Sign up to start using SignSpeak"
                : "Sign in to continue to SignSpeak"}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="user-btn">
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="auth-switch">
              {isSignup ? (
                <p>
                  Already have an account?{" "}
                  <span onClick={handleSwitchMode} className="link-text">
                    Sign In
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <span onClick={handleSwitchMode} className="link-text">
                    Create Account
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default User;
