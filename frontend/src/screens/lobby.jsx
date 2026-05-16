import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";
import "../component/css/lobby.css";

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

  const handleRoomFull = useCallback((data) => {
    alert(data.message);
  }, []);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    socket.on("room:full", handleRoomFull);
    return () => {
      socket.off("room:join", handleJoinRoom);
      socket.off("room:full", handleRoomFull);
    };
  }, [socket, handleJoinRoom, handleRoomFull]);

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h3>Hello, {obj.username}</h3>
      </div>
      <div className="lobby-row">
        <div className="lobby-info">
          <p>Welcome back, {obj.username}!</p>
          <p>Enter your room code to start or join a session.</p>
          <div className="lobby-img">
            <img src="/images/room-img.webp" alt="Room" />
          </div>
        </div>
        <div className="lobby-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="lobby-email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="lobby-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="roomCode" className="form-label">
                Room Code
              </label>
              <input
                type="text"
                className="form-control"
                id="roomCode"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room code"
              />
              <div className="form-text">
                Enter code to create or join a room.
              </div>
            </div>

            <div className="join-btn">
              <button type="submit" className="user-btn">
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
