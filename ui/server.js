const express = require('express');
require('dotenve').config();

const app = express();

app.get('/public', (req, res) => {
    res.json({
        message: "Hello from public API!"
    })
})

app.listen(3001);
console.log(`API Server listening on ${process.env.REACT_APP_AUTH0_AUDIENCE}`);