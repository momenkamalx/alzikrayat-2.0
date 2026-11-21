// Dev tool: pretends to be a browser that has a photo page open.
// Run:  node scripts/socketListen.js <photoId>
// Then post a comment (curl or the website) and watch it appear here.
const { io } = require('socket.io-client');

const photoId = process.argv[2];
if (!photoId) {
  console.log('Usage: node scripts/socketListen.js <photoId>');
  process.exit(1);
}

const socket = io(process.env.URL || 'http://localhost:5000');

socket.on('connect', () => {
  socket.emit('photo:join', photoId, (res) => {
    console.log(res.ok ? `Listening on ${res.room} ... (Ctrl+C to stop)` : `Join failed: ${res.message}`);
  });
});

socket.on('comment:new', (c) => {
  const who = c.userId && c.userId.firstName ? c.userId.firstName : 'Someone';
  console.log(`NEW COMMENT from ${who}: ${c.comment}`);
});

socket.on('connect_error', (err) => console.log('cannot connect:', err.message));
