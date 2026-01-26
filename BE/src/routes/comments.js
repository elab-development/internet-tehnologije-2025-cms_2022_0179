console.log("COMMENTS ROUTE FILE IS BEING READ");
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/page/:pageId', commentController.getCommentsByPage);

router.get('/:id', commentController.getCommentById);

router.post('/', commentController.createComment);

router.delete('/:id', commentController.deleteComment);

module.exports = router;