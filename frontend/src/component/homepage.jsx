import React from "react";

function HomePage() {
  return (
    <div className="container">
      <div className="row mt-5 ms-5 ps-5">
        <div className="col-6 hero-first-col">
          <h3>Connect Beyond Boundaries.</h3>
          <h5>SignSpeak: Your Universal Communication Platform.</h5>
          <p className="mt-4">
            Bridge the communication gap and connect with the world. SignSpeak
            is a revolutionary platform that empowers deaf/mute individuals and
            facilitates seamless communication for everyone. Experience
            real-time video calls with accurate sign language recognition,
            enabling effortless interaction in American Sign Language (ASL).
            With SignSpeak, people can use ASL to communicate naturally, while
            others can view real-time translations, making conversation
            inclusive and accessible to everyone.
          </p>
          <p>
            Join the SignSpeak community today and make communication inclusive
            for all!
          </p>
        </div>
        <div className="col-5 hero-img">
          <img src="images/home2.webp" alt="SignSpeak Platform" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
