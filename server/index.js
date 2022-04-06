const express = require("express");

const path = require('path');
const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.static('client/out'))
app.use(express.static('server/images'))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/out', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});