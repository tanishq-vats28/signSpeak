const { Server } = require("socket.io");

module.exports.connectToSocket = (server) => {
  const io = new Server(server, {
    cors: true,
  });
  const emailToSocketIdMap = new Map();
  const socketidToEmailMap = new Map();

  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    socket.on("room:join", (data) => {
      const { email, room } = data;
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      io.to(room).emit("user:joined", { email, id: socket.id });
      socket.join(room);
      io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("sendMessage", (message) => {
      const { user, text, room } = message;
      console.log(`Message received: ${text} from ${user} in room ${room}`);

      socket.to(room).emit("receiveMessage", message);
      io.to(socket.id).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      const email = socketidToEmailMap.get(socket.id);
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
      console.log("Socket disconnected", socket.id);
    });
  });

  return io;
};
