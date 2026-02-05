const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Don't allow deleting yourself
        if (id === req.user.userId) {
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;