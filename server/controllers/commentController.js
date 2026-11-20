const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

// POST /api/photos/:id/comments
const add = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    const created = await Comment.create({
      photoId: photo._id,
      userId: req.user.id,
      comment: req.body.comment,
    });
    const comment = await Comment.findById(created._id).populate('userId', 'firstName lastName');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

module.exports = { add };
