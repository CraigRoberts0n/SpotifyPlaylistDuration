const express = require('express');
const port = process.env.PORT || 5000;
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.redirect('/')
});

app.listen(port, () => console.log(`server started on port ${port}`));