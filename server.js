import express from 'express';
import cors from 'cors';
import session from 'express-session';
import markers from './api/markers.route.js';
import users from './api/users.route.js';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import createError from 'http-errors';
import index from './azure/index.route.js';
import auth from './azure/auth.route.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
const corsOptions = {
    // origin: 'https://mytechmap.netlify.app',
    // origin: 'localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    AccessControlAllowOrigin: "*",
    // AccessControlAllowCredentials: false,

};

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production
    }
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/markers', markers);
app.use('/api/v1/index', index);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err });
});
// app.listen(port, () => console.log(`MyTechMapAPI is listenting on port ${port}`));

export default app;
