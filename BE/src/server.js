const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.get('/', (req, res) => {
    res.json({
        message: 'CMS Backend API is running!',
        endpoints: {
            auth: '/api/auth (register, login, me)',
            sites: '/api/sites',
            pages: '/api/pages',
            media: '/api/media',
            comments: '/api/comments',
            admin: '/api/admin'
        }
    });
});

const authRoutes = require('./routes/auth');
const siteRoutes = require('./routes/sites');
const pageRoutes = require('./routes/pages');
const mediaRoutes = require('./routes/media');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

console.log('Auth:', typeof authRoutes);
console.log('Sites:', typeof siteRoutes);
console.log('Pages:', typeof pageRoutes);
console.log('Media:', typeof mediaRoutes);
console.log('Comments:', typeof commentRoutes);
console.log('Admin:', typeof adminRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - /api/auth');
  console.log('  - /api/sites');
  console.log('  - /api/pages');
  console.log('  - /api/media');
  console.log('  - /api/comments');
  console.log('  - /api/admin');
});