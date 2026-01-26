const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'CMS Backend API is running!',
    endpoints: {
      sites: '/api/sites',
      pages: '/api/pages',
      media: '/api/media',
      comments: '/api/comments'
    }
  });
});

const siteRoutes = require('./routes/sites');
const pageRoutes = require('./routes/pages');
const mediaRoutes = require('./routes/media');
const commentRoutes = require('./routes/comments');

console.log('Sites:', typeof siteRoutes);
console.log('Pages:', typeof pageRoutes);
console.log('Media:', typeof mediaRoutes);
console.log('Comments:', typeof commentRoutes);

app.use('/api/sites', siteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - /api/sites');
  console.log('  - /api/pages');
  console.log('  - /api/media');
  console.log('  - /api/comments');
});