import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import jobRoutes from './src/routes/jobRoutes.js'
import { errorHandler, notFound } from './src/middleware/error.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = process.env.CLIENT_URL

app.use(cors({
    origin:allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running'});
});
app.use('/api/auth', authRoutes);
app.use('/api/jobs')
app.use(notFound);
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`);
})
