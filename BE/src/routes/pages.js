const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/site/:siteId', pageController.getPagesBySite);

router.get('/public/:siteSlug', pageController.getPublishedPages);

router.get('/:id', pageController.getPageById);

router.get('/:siteSlug/:pageSlug', pageController.getPageBySlug);

router.post('/', pageController.createPage);

router.put('/:id', pageController.updatePage);

router.delete('/:id', pageController.deletePage);

router.post('/:id/publish', pageController.publishPage);

module.exports = router;