const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.get('/site/:siteId', mediaController.getMediaBySite);

router.get('/:id', mediaController.getMediaById);

router.post('/', mediaController.createMedia);

router.delete('/:id', mediaController.deleteMedia);

module.exports = router;