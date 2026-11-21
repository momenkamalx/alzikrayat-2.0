const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { saveUpload, deleteStored } = require('../storage');

// GET /api/photos
const getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: -1 });
    res.json({ success: true, photos });
  } catch (err) {
    next(err);
  }
};

// GET /api/photos/:id  (photo + its comments)
const getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    const comments = await Comment.find({ photoId: photo._id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });
    res.json({ success: true, photo, comments });
  } catch (err) {
    next(err);
  }
};

// POST /api/photos  (multer already saved the file)
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please choose a JPEG or PNG file' });
    }
    const { title, description } = req.body;
    let fileName;
    try {
      fileName = await saveUpload(req.file); // disk: already saved. gridfs: store it in MongoDB
      const photo = await Photo.create({
        userId: req.user.id,
        fileName,
        title,
        description,
      });
      res.status(201).json({ success: true, photo });
    } catch (err) {
      await deleteStored(fileName); // don't leave an orphan file
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

// DELETE /api/photos/:id  (owner only)
const remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own photos' });
    }
    await deleteStored(photo.fileName);
    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    res.json({ success: true, message: 'Photo deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, remove };
