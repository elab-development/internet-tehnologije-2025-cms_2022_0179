const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
    try {
        console.log('Admin fetching all users');
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        console.log(`Found ${result.rows.length} users`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Admin deleting user: ${id}`);

        if (id === req.user.userId) {
            console.log('User tried to delete themselves');
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        console.log('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/sites:
 *   get:
 *     tags: [Admin]
 *     summary: Get all sites (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sites
 */
router.get('/sites', authMiddleware, isAdmin, async (req, res) => {
    try {
        console.log('Admin fetching all sites');
        const result = await pool.query(
            `SELECT s.*, u.username as owner_name
             FROM sites s
                      LEFT JOIN users u ON s.owner_id = u.id
             ORDER BY s.created_at DESC`
        );
        console.log(`Found ${result.rows.length} sites`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/admin/sites/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete site (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/sites/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Admin deleting site: ${id}`);
        await pool.query('DELETE FROM sites WHERE id = $1', [id]);
        console.log('Site deleted successfully');
        res.json({ message: 'Site deleted successfully' });
    } catch (error) {
        console.error('Error deleting site:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;