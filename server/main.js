import express from 'express';
import taskRouter from './routes/taskRoutes.js';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.CLIENT_URL)

const app = express();
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With', 'Access-Control-Allow-Origin'],
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use('/tasks', taskRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});