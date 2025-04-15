import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'
import brandRouter from './routes/brandRouter.js'
import { errorHandler } from './middleware/errorHandlingMiddleware.js';

dotenv.config();
connectDB()
const app = express()
const PORT = process.env.PORT || 5000;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

app.use(errorHandler)
app.use('/uploads', express.static('public'));

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/brand',brandRouter);


app.get('/', (req, res) => {
    res.send('API is running...');
});


app.listen(PORT, console.log(`Server is running on port ${PORT}`))