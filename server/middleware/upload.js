const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  // random name so files never clash or leak the original name
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID().replace(/-/g, '')}.${ALLOWED[file.mimetype]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED[file.mimetype]) return cb(null, true);
  const err = new Error('Only JPEG or PNG files are allowed');
  err.status = 400;
  cb(err);
};

// Usage in a route:  upload.single('photo')   (field name = "photo")
const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = upload;
