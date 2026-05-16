import { useEffect, useCallback, useState, useRef } from "react";
import peer from "../service/peer";
import { useSocket } from "../context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../component/css/room.css";

const REQUIRED_STABLE_DETECTIONS = 3;
const DETECTION_WINDOW_SIZE = 5;
const SIGN_MESSAGE_COOLDOWN_MS = 5000;
const VALID_SIGNS = [
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

const RoomPage = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [detectionStatus, setDetectionStatus] = useState("Sign detection idle");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const detectionWindowRef = useRef([]);
  const lastSentSignRef = useRef(null);
  const lastSentAtRef = useRef(0);
  const isDetectingRef = useRef(false);

  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  useEffect(() => {
    if (!user) {
      navigate("/user");
    }
  }, [navigate, user]);

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

  const handleUserJoined = useCallback(({ id }) => {
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
    ({ ans }) => {
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
    setDetectionStatus("Sign detection idle");
    detectionWindowRef.current = [];
    lastSentSignRef.current = null;
    lastSentAtRef.current = 0;
    navigate("/");
  };

  const resetDetectionWindow = useCallback((status) => {
    detectionWindowRef.current = [];
    setDetectionStatus(status);
  }, []);

  const getStableSign = useCallback((normalizedText) => {
    const recentDetections = [
      ...detectionWindowRef.current,
      normalizedText,
    ].slice(-DETECTION_WINDOW_SIZE);

    detectionWindowRef.current = recentDetections;

    const matches = recentDetections.filter((sign) => sign === normalizedText)
      .length;

    if (matches >= REQUIRED_STABLE_DETECTIONS) {
      return normalizedText;
    }

    return null;
  }, []);

  const sendFrameToApi = useCallback(async (frameBlob) => {
    if (isDetectingRef.current) return;

    isDetectingRef.current = true;
    const formData = new FormData();
    formData.append("frame", frameBlob);
    try {
      const response = await fetch(`${import.meta.env.VITE_ML_URL}/detect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        resetDetectionWindow(`Detection request failed (${response.status})`);
        return;
      }

      const data = await response.json();
      const detectedText = data.text?.trim();
      const normalizedText = detectedText?.toLowerCase();
      const confidence = Number(data.confidence);
      const confidenceText = Number.isFinite(confidence)
        ? ` (${Math.round(confidence * 100)}%)`
        : "";

      if (!data.detected) {
        resetDetectionWindow(
          `${detectedText || "No sign detected"}${confidenceText}`
        );
        return;
      }

      if (normalizedText && VALID_SIGNS.includes(normalizedText)) {
        const stableSign = getStableSign(normalizedText);
        const stableCount = detectionWindowRef.current.filter(
          (sign) => sign === normalizedText
        ).length;

        if (!stableSign) {
          setDetectionStatus(
            `Hold sign steady: ${detectedText}${confidenceText} (${stableCount}/${REQUIRED_STABLE_DETECTIONS})`
          );
          return;
        }

        const now = Date.now();
        const isDuplicateCooldown =
          lastSentSignRef.current === stableSign &&
          now - lastSentAtRef.current < SIGN_MESSAGE_COOLDOWN_MS;

        if (isDuplicateCooldown) {
          setDetectionStatus(`Detected: ${detectedText}${confidenceText}`);
          return;
        }

        setDetectionStatus(`Sent: ${detectedText}${confidenceText}`);
        const newMessage = {
          user: user?.username || "Anonymous",
          text: detectedText,
          room: roomId,
        };
        socket.emit("sendMessage", newMessage);
        lastSentSignRef.current = stableSign;
        lastSentAtRef.current = now;
        detectionWindowRef.current = [];
        return;
      }

      resetDetectionWindow(detectedText || "No sign detected");
    } catch (error) {
      resetDetectionWindow("Detection service unavailable");
      console.error("Error sending frame to API:", error);
    } finally {
      isDetectingRef.current = false;
    }
  }, [getStableSign, resetDetectionWindow, roomId, socket, user?.username]);

  useEffect(() => {
    const captureFrame = () => {
      if (myStream) {
        const video = localVideoRef.current;
        if (video) {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          if (!canvas.width || !canvas.height) return;
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
  }, [myStream, sendFrameToApi]);

  if (!user) return null;

  return (
    <div className="room-container">
      <div className="room-content">
        <div className="left-panel">
          <h1 className="room-header">signSpeak</h1>
          <h4 className="room-status">
            {remoteSocketId ? "Connected" : "Waiting for someone to join..."}
          </h4>
          <div className="detection-status">{detectionStatus}</div>
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
