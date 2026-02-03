const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { authMiddleware } = require('../middleware/auth');

router.get('/site/:siteId', authMiddleware, pageController.getPagesBySite);
router.get('/:id', authMiddleware, pageController.getPageById);
router.post('/', authMiddleware, pageController.createPage);
router.put('/:id', authMiddleware, pageController.updatePage);
router.delete('/:id', authMiddleware, pageController.deletePage);
router.post('/:id/publish', authMiddleware, pageController.publishPage);

router.get('/public/:siteSlug', pageController.getPublishedPages);
router.get('/:siteSlug/:pageSlug', pageController.getPageBySlug); // ← This goes LAST

module.exports = router;