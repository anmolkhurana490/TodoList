import express from 'express';
import taskRouter from './routes/taskRoutes.js';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use('/tasks', taskRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});