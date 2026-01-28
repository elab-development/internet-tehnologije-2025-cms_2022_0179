const Site = require('../models/Site');

exports.getAllSites = async (req, res) => {
    try {
        const sites = await Site.getAllSites();
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSiteBySlug = async (req, res) => {
    try {
        const site = await Site.getSiteBySlug(req.params.slug);
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSite = async (req, res) => {
    try {
        const { name, slug, template } = req.body;

        const owner_id = req.user.userId;

        const site = await Site.createSite(owner_id, name, slug, template);
        res.status(201).json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSite = async (req, res) => {
    try {
        const { name, template } = req.body;
        const { id } = req.params;

        const existingSite = await Site.getSiteById(id);
        if (!existingSite) {
            return res.status(404).json({ error: 'Site not found' });
        }

        if (existingSite.owner_id !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this site' });
        }

        const site = await Site.updateSite(id, name, template);
        res.json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSite = async (req, res) => {
    try {
        const { id } = req.params;

        const existingSite = await Site.getSiteById(id);
        if (!existingSite) {
            return res.status(404).json({ error: 'Site not found' });
        }

        if (existingSite.owner_id !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this site' });
        }

        await Site.deleteSite(id);
        res.json({ message: 'Site deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};