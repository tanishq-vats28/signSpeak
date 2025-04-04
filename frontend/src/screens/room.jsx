import React, { useEffect, useCallback, useState, useRef } from "react";
import peer from "../service/peer";
import { useSocket } from "../context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../component/css/room.css";

const RoomPage = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);

  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  useEffect(() => {
    if (!user) {
      navigate("/user");
    }
  }, [navigate, user]);

  if (!user) return null;

  const validSigns = [
    "call me",
    "good luck",
    "greetings",
    "hope",
    "i love you",
    "okay",
    "pointing down",
    "pointing up",
    "raised hand",
    "rock on",
    "stop",
    "thumbs down",
    "thumbs up",
    "victory",
    "wish to prosper",
  ];

  useEffect(() => {
    socket.on("receiveMessage", (incomingMsg) => {
      setChatMessages((prev) => [...prev, incomingMsg]);
    });
    return () => socket.off("receiveMessage");
  }, [socket]);

  useEffect(() => {
    const container = chatEndRef.current?.parentNode;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { user: user.username, text: message, room: roomId };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (err) {
        console.error("Error during incoming call:", err);
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        if (!peer.peer.getSenders().find((sender) => sender.track === track)) {
          peer.peer.addTrack(track, myStream);
        }
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    try {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } catch (err) {
      console.error("Negotiation error:", err);
    }
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      try {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      } catch (err) {
        console.error("Negotiation handling error:", err);
      }
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    try {
      await peer.setLocalDescription(ans);
    } catch (err) {
      console.error("Finalizing negotiation error:", err);
    }
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      setRemoteStream(ev.streams[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const endCall = () => {
    myStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    socket.emit("room:leave", { room: roomId, email: user.email });
    setMyStream(null);
    setRemoteStream(null);
    setChatMessages([]);
    navigate("/");
  };

  const sendFrameToApi = async (frameBlob) => {
    const formData = new FormData();
    formData.append("frame", frameBlob);
    try {
      const response = await fetch(`${import.meta.env.VITE_ML_URL}/detect`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const detectedText = data.text;
      if (detectedText && validSigns.includes(detectedText.toLowerCase())) {
        const newMessage = {
          user: user.username || "Anonymous",
          text: detectedText,
          room: roomId,
        };
        socket.emit("sendMessage", newMessage);
      }
    } catch (error) {
      console.error("Error sending frame to API:", error);
    }
  };

  useEffect(() => {
    const captureFrame = () => {
      if (myStream) {
        const video = localVideoRef.current;
        if (video) {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) sendFrameToApi(blob);
          }, "image/jpeg");
        }
      }
    };
    const intervalId = setInterval(captureFrame, 2000);
    return () => clearInterval(intervalId);
  }, [myStream]);

  return (
    <div className="room-container">
      <div className="room-content">
        <div className="left-panel">
          <h1 className="room-header">signSpeak</h1>
          <h4 className="room-status">
            {remoteSocketId ? "Connected" : "Waiting for someone to join..."}
          </h4>
          <div className="room-btn-group">
            {myStream && (
              <button className="room-btn" onClick={sendStreams}>
                Share Stream
              </button>
            )}
            {remoteSocketId && !myStream && (
              <button className="room-btn" onClick={handleCallUser}>
                Start Call
              </button>
            )}
            {myStream && (
              <button className="room-btn" onClick={endCall}>
                End Call
              </button>
            )}
          </div>
          <div className="chat-box">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>
            <div className="chat-input-group">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input"
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage} className="send-btn">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="video-container">
            <div className="video-player local-video">
              <video ref={localVideoRef} autoPlay muted />
            </div>
            <div className="video-player remote-video">
              <video ref={remoteVideoRef} autoPlay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
