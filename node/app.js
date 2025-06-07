const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;
const app = express();

// Import routes
const filterRoutes = require('./routes/index');
// Middleware
app.use(cors());
app.use(bodyParser.json());

// define orgin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api', filterRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});