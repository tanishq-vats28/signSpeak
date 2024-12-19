import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";
function Lobby({ obj }) {
  const [email, setEmail] = useState(obj.email);
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );
  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  return (
    <div className="container lobby">
      <div className="lobby-header">
        <h3>Hello, {obj.username}</h3>
      </div>

      <div className="row lobby-row">
        <div className="col lobby-info">
          <p>Welcome back, {obj.username}!</p>
          <p>Enter your room code to start or join a session.</p>
          <div className="lobby-img">
            <img src="\images\room-img.webp" />
          </div>
        </div>
        <div className="col lobby-form-container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="roomCode" className="form-label">
                Room code:
              </label>
              <input
                type="text"
                className="form-control"
                id="roomCode"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              />
              <div className="form-text">
                Enter code to create or join a room.
              </div>
            </div>

            <div className="join-btn">
              <button type="submit" className="btn mt-2 user-btn">
                Join
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
