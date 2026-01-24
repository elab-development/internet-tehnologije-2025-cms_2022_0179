const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Backend is running!',
        endpoints: {
            sites: '/api/sites',
            pages: '/api/pages'
        }
    });
});

const siteRoutes = require('./routes/sites');
const pageRoutes = require('./routes/pages');

app.use('/api/sites', siteRoutes);
app.use('/api/pages', pageRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});