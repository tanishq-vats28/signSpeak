import React, { useState } from "react";

function User() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully");
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
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
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
