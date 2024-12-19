import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const RoomPage = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatVisible, setChatVisible] = useState(true);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  useEffect(() => {
    if (!user) {
      navigate("/user");
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }
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
    socket.on("receiveMessage", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        user: user.username,
        text: message,
        room: roomId,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
    setChatVisible(true);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setChatVisible(true);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
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
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
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
    setMyStream(null);
    setRemoteStream(null);
    setChatMessages([]);
    setChatVisible(false);
    navigate("/");
  };

  const sendFrameToApi = async (frameBlob) => {
    const formData = new FormData();
    formData.append("frame", frameBlob);

    try {
      const response = await fetch("http://localhost:5000/detect", {
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
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } catch (error) {
      console.error("Error sending frame to API:", error);
    }
  };

  useEffect(() => {
    const captureFrame = () => {
      if (myStream) {
        const video = document.querySelector("video");
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
    <div className="room-container container">
      <div className="row">
        <div className="col-6 left-container">
          <h1 className="room-header">signSpeak</h1>
          <h4 className="room-status">
            {remoteSocketId ? "Connected" : "Waiting for someone to join..."}
          </h4>

          <div className="room-btn">
            {myStream && (
              <button className="btn room-btn-css" onClick={sendStreams}>
                Share Stream
              </button>
            )}
            {remoteSocketId && !myStream && (
              <button className="btn room-btn-css" onClick={handleCallUser}>
                Start Call
              </button>
            )}
            {myStream && (
              <button className="btn room-btn-css" onClick={endCall}>
                End Call
              </button>
            )}
          </div>

          {chatVisible && (
            <div className="chat-box">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="chat-message">
                    <strong>{msg.user}:</strong> {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>
              <div className="input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="message-input"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="btn room-btn-css"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-6 video-container">
          <div className="video-player">
            {myStream && (
              <ReactPlayer
                url={myStream}
                width="100%"
                height="100%"
                playing
                muted
              />
            )}
          </div>
          <div className="video-player">
            {remoteStream && (
              <ReactPlayer
                url={remoteStream}
                width="100%"
                height="100%"
                playing
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
