const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3000;
const db = require('./_configs/db.config');

mongoose.connect(db.developmentSrv).then((connection) => {
    console.log('Mongodb connected with success');
}).catch((error) => {
    console.log(error)
});
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

require('./_routes/user.route')(app);

const server = http.createServer(app);
app.get("/", (req, res) => {
    res.status(200).json(`Backend version 1.0.0 working `);
});
app.get("*", (req, res) => {
    res.status(404).json(`Page not found.`);
});
server.listen(PORT, () => {
    console.log(`Backend server listening at ${PORT}`);
});

