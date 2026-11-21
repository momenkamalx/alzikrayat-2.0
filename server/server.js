require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { initSocket } = require('./socket');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Alzikrayat API running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/photos', require('./routes/photoRoutes'));

// Must stay LAST
app.use(notFound);
app.use(errorHandler);

// Socket.io needs the plain HTTP server that wraps Express
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
