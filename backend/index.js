import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
 
import { initDB } from './database/db.js';

dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5174",
    credentials: true
}

app.use(cors(corsOptions));

app.use('/api/user', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/application', applicationRoutes);

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.end("Hello from home");
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port 8000");
    });
})

