import React from "react";
function HomePage() {
  return (
    <div className="container">
      <div className="row mt-5 ms-5 ps-5">
        <div className="col-6 hero-first-col">
          <h3>Connect Beyond Boundaries.</h3>
          <h4>SignSpeak: Your Universal Communication Platform.</h4>
          <p className="mt-4">
            Bridge the communication gap and connect with the world. SignSpeak
            is a revolutionary platform that empowers deaf/mute individuals and
            facilitates seamless communication for everyone. Experience
            real-time video calls with accurate sign language recognition.
          </p>
          <br />
          <p>Join the SignSpeak community today!</p>
        </div>
        <div className="col-5 hero-img">
          <img src="images/home2.webp" alt="" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
