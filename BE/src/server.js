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
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: 'Connected'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
});