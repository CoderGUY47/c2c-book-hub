import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookiesParser from 'cookie-parser';
import connectDb from './config/dbConnect';
import authRoutes from './routes/authRouter';
import productRoutes from './routes/productRoute';
import cartRoutes from './routes/cartRoute';
import wishListRoutes from './routes/wishlistRoute';
import addressRoutes from './routes/addressRoute';
import userRoutes from './routes/userRoute';
import orderRoutes from './routes/orderRoute';
import paymentRoutes from './routes/paymentRoute';
import passport from './controllers/strategy/googleStrategy'

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookiesParser());

connectDb();

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Corrected from /product to /products
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishListRoutes);
app.use('/api/user/address', addressRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payments', paymentRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;


// const store_id = process.env.SSLCOMMERZ_STORE_ID;          
// const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD 
// const is_live = false //true for live, false for sandbox  