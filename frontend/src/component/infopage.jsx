import React from "react";
import "./css/info.css";

function InfoPage() {
  return (
    <div className="info-page-wrapper">
      <h2>How It Works</h2>
      <p className="info-subtitle">
        SignSpeak bridges the communication gap for everyone
      </p>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon">
            <i className="fa-solid fa-hands"></i>
          </div>
          <h4>For Deaf/Mute Individuals</h4>
          <p>
            <b>Accurate Sign Language Recognition:</b> SignSpeak utilizes modern
            day technologies to recognize and interpret sign languages,
            converting them into readable text in real time.
          </p>
          <p>
            <b>Current Signs:</b> "call me", "good luck", "greetings", "hope",
            "i love you", "okay", "pointing down", "pointing up", "raised hand",
            "rock on", "stop", "thumbs down", "thumbs up", "victory", "wish to
            prosper".
          </p>
          <p>
            <b>Real-Time Video Calls:</b> Engage in live video calls where sign
            language is automatically translated for hearing users, enabling
            fluent and direct communication.
          </p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <h4>For Hearing/Speaking Individuals</h4>
          <p>
            <b>User-Friendly Interface:</b> SignSpeak is designed to be
            intuitive and easy to navigate, ensuring that anyone can use the
            platform to communicate without needing technical expertise.
          </p>
          <p>
            <b>Seamless Communication:</b> Real-time video calls allow hearing
            and speaking users to interact with deaf/mute individuals, with sign
            language automatically translated into text for easy understanding.
          </p>
          <p>
            <b>Sign Language Assistance:</b> For those unfamiliar with sign
            language, SignSpeak provides automatic sign-to-text conversion,
            facilitating communication without any prior knowledge of sign
            language.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
