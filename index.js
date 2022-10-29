import app from './server.js';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import MarkersDAO from './dao/markersDAO.js';
import UsersDAO from './dao/usersDAO.js';
import SavedMarkersDAO from './dao/savedMarkersDAO.js';

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
        await UsersDAO.injectDB(client);
        await SavedMarkersDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected successfully');
});
