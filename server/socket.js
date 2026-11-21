const { Server } = require('socket.io');
const mongoose = require('mongoose');

let io = null; // the one Socket.io server, shared by the whole app

// Every photo page gets its own "room": photo:<photoId>
const roomName = (photoId) => `photo:${photoId}`;

// Called once from server.js. Attaches Socket.io to the HTTP server.
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
  });

  io.on('connection', (socket) => {
    console.log(`socket connected: ${socket.id}`);

    // Browser opened a photo page -> put it in that photo's room
    socket.on('photo:join', (photoId, ack) => {
      if (!mongoose.isValidObjectId(photoId)) {
        if (typeof ack === 'function') ack({ ok: false, message: 'Invalid photo id' });
        return;
      }
      socket.join(roomName(photoId));
      if (typeof ack === 'function') ack({ ok: true, room: roomName(photoId) });
    });

    // Browser left the photo page -> take it out of the room
    socket.on('photo:leave', (photoId) => {
      socket.leave(roomName(photoId));
    });

    socket.on('disconnect', () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Controllers call this to send messages to browsers
function getIO() {
  if (!io) throw new Error('Socket.io has not been initialised');
  return io;
}

module.exports = { initSocket, getIO, roomName };
