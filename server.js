import express from 'express';
import cors from 'cors';
import markers from './api/markers.route.js';

const app = express();
const corsOptions = {
    origin: 'https://mytechmap.netlify.app',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/markers', markers);
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.use('*', (req, res) => {
    res.status(404).json({ error: 'not found' });
});

export default app;
