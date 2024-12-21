import React from "react";

function TeamPage() {
  return (
    <div className="container team-container">
      <div className="row ms-3">
        {/* First Description */}
        <div className="col-3 mt-4">
          <h4>Tanishq Vats</h4>
          <h6>Web Developer</h6>
          <p>
            Aspiring Full Stack Developer with expertise in building dynamic web
            applications using the MERN stack <br /> add integrating scalable
            frontend and backend solutions.
          </p>
          <div className="team-icon">
            <a
              href="https://www.linkedin.com/in/tanishq-vats-a76715253/"
              className="p-icon"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/tanishq-vats28" className="p-icon">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
          <p className="team-email">tanishqvats620@gmail.com</p>
        </div>

        {/* Images Column */}
        <div className="col-6">
          <div className="team-img">
            <img
              src="images/tanishq.jpg"
              alt="Tanishq"
              className="img-fluid first-img"
            />
            <img
              src="images/shikhar.jpg"
              alt="Shikhar"
              className="img-fluid second-img"
            />
          </div>
        </div>

        {/* Second Description */}
        <div className="col-3 mt-4">
          <h4>Shikhar Maheshwari</h4>
          <h6>Machine Learning Developer</h6>
          <p>
            Machine learning enthusiast, passionate about building smart
            solutions and turning data into meaningful insights using machine
            learning.
          </p>
          <div className="team-icon">
            <a
              href="https://www.linkedin.com/in/shikhar-maheshwari-8b292431a/"
              className="p-icon"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/S4M-0403" className="p-icon">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
          <p className="team-email">shikharmaheshwari0403@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
