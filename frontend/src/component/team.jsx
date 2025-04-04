import React from "react";
import "./css/team.css";

function TeamPage() {
  return (
    <div className="container team-container">
      <div className="team-grid">
        <div className="team-profile">
          <h4>Tanishq Vats</h4>
          <h6>Web Developer</h6>
          <p>
            Aspiring Full Stack Developer with expertise in the MERN stack,
            building scalable and dynamic web applications.
          </p>
          <div className="team-icon">
            <a href="https://www.linkedin.com/in/tanishq-vats-a76715253/">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/tanishq-vats28" className="ms-3">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
          <p className="team-email mt-3">tanishqvats620@gmail.com</p>
        </div>

        <div>
          <img src="images/tanishq.jpg" alt="Tanishq" className="team-img" />
        </div>

        <div>
          <img src="images/shikhar.jpg" alt="Shikhar" className="team-img" />
        </div>

        <div className="team-profile">
          <h4>Shikhar Maheshwari</h4>
          <h6>Machine Learning Developer</h6>
          <p>
            Machine learning enthusiast, passionate about building smart
            solutions and turning data into meaningful insights.
          </p>
          <div className="team-icon">
            <a href="https://www.linkedin.com/in/shikhar-maheshwari-8b2924319/">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/S4M-0403" className="ms-3">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
          <p className="team-email mt-3">shikharmaheshwari0403@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
