// Dev tool: checks that the Socket.io server accepts connections and rooms.
// Run (while the server is running):  node scripts/socketCheck.js
const { io } = require('socket.io-client');

const url = process.env.URL || 'http://localhost:5000';
const socket = io(url);

socket.on('connect', () => {
  console.log('connected, my socket id is', socket.id);

  socket.emit('photo:join', '6aff3576486f4871cb995e33', (validResult) => {
    console.log('join with a valid photo id ->', validResult);

    socket.emit('photo:join', 'not-an-id', (badResult) => {
      console.log('join with a bad id         ->', badResult);
      socket.disconnect();
    });
  });
});

socket.on('connect_error', (err) => {
  console.log('cannot connect:', err.message);
  process.exit(1);
});

socket.on('disconnect', () => process.exit(0));
