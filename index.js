import app from './server.js';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import MarkersDAO from './dao/markersDAO.js';
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 5000;

MongoClient.connect(process.env.MYTECHMAP_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500
})
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        await MarkersDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected successfully');
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const userModel = require('./models');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// const corsOptions = {
//     origin: 'https://mytechmap.netlify.app',
//     credentials: true,
// };
// app.use(cors(corsOptions));

// mongoose.connect(process.env.MONGO_DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', () => {
//     console.log('Connected successfully');
// });

// // // Configuring body parser middleware
// // app.use(bodyParser.urlencoded({ extended: false }));
// // app.use(bodyParser.json());

// app.get('/details', async (req, res) => {
//     // const user = await userModel.findOne({id: 123});
//     res.send({
//         employees: [
//             { firstName: 'John', lastName: 'Doe' },
//             { firstName: 'Anna', lastName: 'Smith' },
//             { firstName: 'Peter', lastName: 'Jones' },
//         ],
//     });
// });

// app.get('/', (req, res) => {
//     res.send('Hello from Express!');
// });

// app.listen(port, () => {
//     console.log(`Hello world app listening on port ${port}!`);
// });
