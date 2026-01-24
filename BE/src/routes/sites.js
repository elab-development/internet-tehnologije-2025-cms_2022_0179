const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.getAllSites);

router.get('/:slug', siteController.getSiteBySlug);

router.post('/', siteController.createSite);

router.put('/:id', siteController.updateSite);

router.delete('/:id', siteController.deleteSite);

module.exports = router;