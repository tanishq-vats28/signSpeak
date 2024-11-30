import React from "react";

function TeamPage() {
  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center mt-5">Developers</h2>
      </div>
      <div className="row team-container d-flex justify-content-center mt-4">
        <div className="team-member col text-center mb-4">
          <img
            src="images/Account-User-PNG-Transparent.png"
            alt="Priyanshu Bansal"
            className="team-img"
          />
          <p className="team-member-name">Priyanshu Bansal</p>
          <p className="team-member-name">9922103013</p>
          <p>
            <a
              href="https://www.linkedin.com/in/priyanshubansal2004/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin fa-2x"></i>
            </a>
            <a
              href="https://github.com/priyanshubansal"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-3"
            >
              <i className="fa-brands fa-square-github fa-2x"></i>
            </a>
          </p>
        </div>
        <div className="team-member col text-center mb-4">
          <img
            src="images/Account-User-PNG-Transparent.png"
            alt="Tanishq Vats"
            className="team-img"
          />
          <p className="team-member-name">Tanishq Vats</p>
          <p className="team-member-name">9922103028</p>
          <p>
            <a
              href="https://www.linkedin.com/in/tanishq-vats-a76715253/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin fa-2x"></i>
            </a>
            <a
              href="https://github.com/tanishqvats"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-3"
            >
              <i className="fa-brands fa-square-github fa-2x"></i>
            </a>
          </p>
        </div>
        <div className="team-member col text-center mb-4">
          <img
            src="images/Account-User-PNG-Transparent.png"
            alt="Shikhar Maheshwari"
            className="team-img"
          />
          <p className="team-member-name">Shikhar Maheshwari</p>
          <p className="team-member-name">9922103029</p>
          <p>
            <a
              href="https://www.linkedin.com/in/shikhar-maheshwari-8b292431a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin fa-2x"></i>
            </a>
            <a
              href="https://github.com/shikharmaheshwari"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-3"
            >
              <i className="fa-brands fa-square-github fa-2x"></i>
            </a>
          </p>
        </div>
        <div className="team-member col text-center mb-4">
          <img
            src="images/Account-User-PNG-Transparent.png"
            alt="Shivam"
            className="team-img"
          />
          <p className="team-member-name">Shivam</p>
          <p className="team-member-name">9922103042</p>
          <p>
            <a
              href="https://www.linkedin.com/in/shivam/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin fa-2x"></i>
            </a>
            <a
              href="https://github.com/shivam"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-3"
            >
              <i className="fa-brands fa-square-github fa-2x"></i>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
