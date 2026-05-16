import React from "react";
import { Link } from "react-router-dom";
import "./css/home.css";

function HomePage() {
  return (
    <div className="home-container">
      <div className="content-row">
        <div className="hero-first-col">
          <div className="hero-badge">Communication for All</div>
          <h3>Connect Beyond Boundaries.</h3>
          <h5>SignSpeak — Your Universal Communication Platform.</h5>
          <p>
            Bridge the communication gap and connect with the world. SignSpeak
            is a revolutionary platform that empowers deaf/mute individuals and
            facilitates seamless communication for everyone. Experience
            real-time video calls with accurate sign language recognition,
            enabling effortless interaction in American Sign Language (ASL).
          </p>
          <div className="hero-cta">
            <Link to="/user" className="cta-button cta-primary">
              Get Started
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/info" className="cta-button cta-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-img">
          <img
            src="images/home2.webp"
            alt="SignSpeak Platform"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
