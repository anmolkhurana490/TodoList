import express from 'express';
import connectDB from './config/db.js';

import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();

// Routes
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});