const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Where uploaded photos live:
//   disk    (default) -> files in server/uploads/        (local development)
//   gridfs            -> files inside MongoDB (GridFS)   (hosts with no persistent disk)
// Switch with the STORAGE_MODE environment variable.
const isGridFs = () => process.env.STORAGE_MODE === 'gridfs';

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png' };
const NAME_PATTERN = /^[a-f0-9]{32}\.(jpg|png)$/;

// random file name, so files never clash or leak the original name
const makeFileName = (mimetype) =>
  `${crypto.randomUUID().replace(/-/g, '')}.${EXTENSIONS[mimetype]}`;

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'photos' });

// Called by the controller after multer. Returns the stored file name.
async function saveUpload(file) {
  if (!isGridFs()) return file.filename; // multer already wrote it to disk

  const fileName = makeFileName(file.mimetype);
  await new Promise((resolve, reject) => {
    const stream = getBucket().openUploadStream(fileName, { contentType: file.mimetype });
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(file.buffer);
  });
  return fileName;
}

// Remove a stored photo file (never throws: a missing file is fine)
async function deleteStored(fileName) {
  if (!fileName) return;
  try {
    if (!isGridFs()) {
      await fs.promises.unlink(path.join(UPLOAD_DIR, fileName));
      return;
    }
    const bucket = getBucket();
    const files = await bucket.find({ filename: fileName }).toArray();
    await Promise.all(files.map((f) => bucket.delete(f._id)));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('could not delete stored file:', err.message);
  }
}

// GET /uploads/:fileName when STORAGE_MODE=gridfs
function serveFromGridFs(req, res) {
  const { fileName } = req.params;
  if (!NAME_PATTERN.test(fileName)) return res.status(404).end();

  const stream = getBucket().openDownloadStreamByName(fileName);
  stream.on('error', () => {
    if (!res.headersSent) res.status(404).end();
  });
  stream.once('file', (file) => {
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // names are random, never reused
  });
  stream.pipe(res);
}

module.exports = { isGridFs, makeFileName, saveUpload, deleteStored, serveFromGridFs, UPLOAD_DIR };
