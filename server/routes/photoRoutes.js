const express = require('express');
const { getAll, getOne, create, remove } = require('../controllers/photoController');
const { validate, photoSchema } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, upload.single('photo'), validate(photoSchema), create);
router.delete('/:id', protect, remove);

router.use('/:id/comments', commentRoutes);

module.exports = router;
