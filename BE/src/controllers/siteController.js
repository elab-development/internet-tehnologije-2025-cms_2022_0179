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
        const { owner_id, name, slug, template } = req.body;
        const site = await Site.createSite(owner_id, name, slug, template);
        res.status(201).json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSite = async (req, res) => {
    try {
        const { name, template } = req.body;
        const site = await Site.updateSite(req.params.id.trim(), name, template);
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSite = async (req, res) => {
    try {
        await Site.deleteSite(req.params.id.trim());
        res.json({ message: 'Site deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};