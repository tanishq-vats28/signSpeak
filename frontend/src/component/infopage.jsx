import React from "react";
function InfoPage() {
  return (
    <div className="container">
      <div className="row justify-content-between m-4">
        <div className="col-6 fs-5 mt-5 info-first-col">
          <h4>For Deaf/Mute Individuals:</h4>
          <p className="mt-4">
            <b>Accurate Sign Language Recognition:</b> SignSpeak utilizes modern
            day technologies to recognize and interpret sign languages,
            converting them into readable text or spoken words in real time.
          </p>
          <p className="mt-2">
            <b>Text-to-Speech Conversion:</b> Deaf/mute users can type their
            messages, which are then seamlessly converted into speech for
            hearing individuals.
          </p>
          <p className="mt-5">
            <b>Real-Time Video Calls:</b> Engage in live video calls where sign
            language is automatically translated for hearing users, enabling
            fluent and direct communication.
          </p>
        </div>
        <div className="col-6 fs-5 mt-5 info-second-col">
          <h4>For Hearing/Speaking Individuals:</h4>
          <p className="mt-4">
            <b>User-Friendly Interface:</b> SignSpeak is designed to be
            intuitive and easy to navigate, ensuring that anyone can use the
            platform to communicate without needing technical expertise.
          </p>
          <p className="mt-2">
            <b>Seamless Communication:</b> Real-time video calls allow hearing
            and speaking users to interact with deaf/mute individuals, with sign
            language automatically translated into speech or text for easy
            understanding.
          </p>
          <p className="mt-">
            <b>Sign Language Assistance:</b> For those unfamiliar with sign
            language, SignSpeak provides automatic sign-to-voice or text
            conversion, facilitating communication without any prior knowledge
            of sign language.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
