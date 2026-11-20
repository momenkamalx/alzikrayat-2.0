const express = require('express');
const { add } = require('../controllers/commentController');
const { validate, commentSchema } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// mergeParams lets this router see :id from /api/photos/:id/comments
const router = express.Router({ mergeParams: true });

router.post('/', protect, validate(commentSchema), add);

module.exports = router;
