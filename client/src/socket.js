import { io } from 'socket.io-client';

// ONE shared real-time connection for the whole app.
// - no URL given -> connects to the same address as the website
//   (in development Vite forwards /socket.io to the Express server)
// - autoConnect:false -> pages connect only when they need it
const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false });

export default socket;
