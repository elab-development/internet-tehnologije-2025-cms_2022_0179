const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/site/:siteId', mediaController.getMediaBySite);
router.get('/:id', mediaController.getMediaById);

// Upload with multer middleware
router.post('/', authMiddleware, upload.single('file'), mediaController.uploadMedia);
router.delete('/:id', authMiddleware, mediaController.deleteMedia);

module.exports = router;