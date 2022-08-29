import express from 'express';
import DataRoutes from './routes/DataRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import dotenv from 'dotenv';

const app = express(); 
dotenv.config();

import cors from 'cors';
app.use(cors());

app.use(express.json());

app.use('/data', DataRoutes);
app.use('/users', UserRoutes);
app.use('/model', modelRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`listening at port : ${PORT}`);
})