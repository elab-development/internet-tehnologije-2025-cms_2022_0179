const Page = require('../models/Page');

exports.getPagesBySite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const pages = await Page.getPagesBySiteId(siteId);
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPublishedPages = async (req, res) => {
    try {
        const { siteSlug } = req.params;
        const pages = await Page.getPublishedPages(siteSlug);
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPageById = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Page.getPageById(id);
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPageBySlug = async (req, res) => {
    try {
        const { siteSlug, pageSlug } = req.params;
        const page = await Page.getPageBySlug(siteSlug, pageSlug);
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPage = async (req, res) => {
    try {
        const page = await Page.createPage(req.body);
        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Page.updatePage(id, req.body);
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        await Page.deletePage(id);
        res.json({ message: 'Page deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.publishPage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Page.publishPage(id);
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};