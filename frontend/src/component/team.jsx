import React from "react";
import "./css/team.css";

function TeamPage() {
  return (
    <div className="team-container">
      <div className="team-page-header">
        <h2>Meet the Team</h2>
        <p>The minds behind SignSpeak</p>
      </div>

      <div className="team-grid">
        <div className="team-member-card">
          <div className="team-img-wrapper">
            <img src="images/tanishq.jpg" alt="Tanishq Vats" className="team-img" />
          </div>
          <div className="team-profile">
            <h4>Tanishq Vats</h4>
            <h6>Web Developer</h6>
            <p>
              Aspiring Full Stack Developer with expertise in the MERN stack,
              building scalable and dynamic web applications.
            </p>
            <div className="team-icon">
              <a href="https://www.linkedin.com/in/tanishq-vats-a76715253/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://github.com/tanishq-vats28" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
            <p className="team-email">tanishqvats620@gmail.com</p>
          </div>
        </div>

        <div className="team-member-card">
          <div className="team-img-wrapper">
            <img src="images/shikhar.jpg" alt="Shikhar Maheshwari" className="team-img" />
          </div>
          <div className="team-profile">
            <h4>Shikhar Maheshwari</h4>
            <h6>Machine Learning Developer</h6>
            <p>
              Machine learning enthusiast, passionate about building smart
              solutions and turning data into meaningful insights.
            </p>
            <div className="team-icon">
              <a href="https://www.linkedin.com/in/shikhar-maheshwari-8b2924319/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://github.com/S4M-0403" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
            <p className="team-email">shikharmaheshwari0403@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
