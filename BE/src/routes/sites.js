const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', siteController.getAllSites);
router.get('/:slug', siteController.getSiteBySlug);

router.post('/', authMiddleware, siteController.createSite);
router.put('/:id', authMiddleware, siteController.updateSite);
router.delete('/:id', authMiddleware, siteController.deleteSite);

module.exports = router;