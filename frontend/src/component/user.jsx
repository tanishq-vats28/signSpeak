import React, { useState } from "react";

function User() {
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="container">
      <div className="row m-5">
        <div className="col-8 user-img">
          <img src="images/Designer (6).png" alt="login" />
        </div>
        <div className="col-4 mt-5 pt-4 text-start">
          <form className="mt-3">
            {isSignup && (
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input type="text" className="form-control" id="username" />
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
              />
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
              />
            </div>
            <button type="submit" className="btn mt-2 user-btn">
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>
          <div className="mt-3">
            <p>
              {isSignup ? (
                <>
                  <a onClick={handleSwitchMode} className="link-text">
                    Already have an account?
                  </a>
                </>
              ) : (
                <>
                  <a onClick={handleSwitchMode} className="link-text">
                    Create New Account
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
