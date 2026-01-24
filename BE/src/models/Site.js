const pool = require('../config/database');

async function getAllSites() {
    const result = await pool.query('SELECT * FROM sites ORDER BY created_at DESC');
    return result.rows;
}

/*
async function getSiteById(id) {
    const result = await pool.query('SELECT * FROM sites WHERE id = $1', [id]);
    return result.rows[0];
}*/

async function getSiteBySlug(slug) {
    const result = await pool.query('SELECT * FROM sites WHERE slug = $1', [slug]);
    return result.rows[0];
}

async function createSite(owner_id, name, slug, template) {
    const result = await pool.query(
        'INSERT INTO sites (owner_id, name, slug, template) VALUES ($1, $2, $3, $4) RETURNING *',
        [owner_id, name, slug, template]
    );
    return result.rows[0];
}

async function updateSite(id, name, template) {
    const result = await pool.query(
        'UPDATE sites SET name = $1, template = $2 WHERE id = $3 RETURNING *',
        [name, template, id]
    );
    return result.rows[0];
}

async function deleteSite(id) {
    await pool.query('DELETE FROM sites WHERE id = $1', [id]);
}

module.exports = {
    getAllSites,
    /*getSiteById, */
    getSiteBySlug,
    createSite,
    updateSite,
    deleteSite
};