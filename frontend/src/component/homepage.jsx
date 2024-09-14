import React from "react";
function HomePage() {
  return (
    <div className="container">
      <div className="row m-5">
        <div className="col-7 hero-first-col">
          <h1>Connect Beyond Boundaries.</h1>
          <h4 className="mt-4">
            SignSpeak: Your Universal Communication Platform.
          </h4>
          <p className="mt-4 fs-5">
            Bridge the communication gap and connect with the world. SignSpeak
            is a revolutionary platform that empowers deaf/mute individuals and
            facilitates seamless communication for everyone. Experience
            real-time video calls with sign language recognition and
            text-to-speech/speech-to-text conversion.
          </p>
          <p className="fs-5">Join the SignSpeak community today!</p>
        </div>
        <div className="col-5 hero-img">
          <img src="images/home2.webp" alt="hero" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
