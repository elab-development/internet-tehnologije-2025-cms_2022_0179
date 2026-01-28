const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/page/:pageId', commentController.getCommentsByPage);
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);

router.delete('/:id', authMiddleware, isAdmin, commentController.deleteComment);

module.exports = router;