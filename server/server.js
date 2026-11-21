require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { isGridFs, serveFromGridFs, UPLOAD_DIR } = require('./storage');

const app = express();

app.use(cors());
app.use(express.json());

// photos: from server/uploads/ (default) or from MongoDB when STORAGE_MODE=gridfs
if (isGridFs()) app.get('/uploads/:fileName', serveFromGridFs);
else app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Alzikrayat API running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/photos', require('./routes/photoRoutes'));

// Production: this one server also serves the built React app (client/dist),
// so the website and the API share a single address.
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));
  // any other page address (/gallery, /photos/123 ...) -> React Router handles it
  app.get(/^\/(?!api|uploads).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Must stay LAST
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
