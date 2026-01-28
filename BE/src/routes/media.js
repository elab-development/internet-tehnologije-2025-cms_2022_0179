const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authMiddleware } = require('../middleware/auth');

router.get('/site/:siteId', mediaController.getMediaBySite);
router.get('/:id', mediaController.getMediaById);

router.post('/', authMiddleware, mediaController.createMedia);
router.delete('/:id', authMiddleware, mediaController.deleteMedia);

module.exports = router;