const Media = require('../models/Media');

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


exports.createMedia = async (req, res) => {
  try {
    const media = await Media.createMedia(req.body);
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    await Media.deleteMedia(id);
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};