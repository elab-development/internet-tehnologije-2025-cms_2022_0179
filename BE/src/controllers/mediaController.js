const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');

exports.getMediaBySite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const media = await Media.getMediaBySiteId(siteId);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.getMediaById(id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        const { siteId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `cms/${siteId}`,
            resource_type: 'auto'
        });

        const mediaData = {
            site_id: siteId,
            uploaded_by: req.user.userId,
            filename: req.file.originalname,
            file_path: result.secure_url,
            mime_type: req.file.mimetype
        };

        const media = await Media.createMedia(mediaData);
        res.status(201).json(media);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.getMediaById(id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        const urlParts = media.file_path.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.split('.')[0];

        await cloudinary.uploader.destroy(publicId);

        await Media.deleteMedia(id);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;