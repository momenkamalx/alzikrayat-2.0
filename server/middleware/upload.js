const multer = require('multer');
const { isGridFs, makeFileName, UPLOAD_DIR } = require('../storage');

const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// disk mode: multer saves the file straight into server/uploads/
// gridfs mode: multer keeps it in memory; the controller then stores it in MongoDB
const storage = isGridFs()
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: (req, file, cb) => cb(null, makeFileName(file.mimetype)),
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
