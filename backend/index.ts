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
import passport from './controllers/strategy/googleStrategy';
import adminRoutes from './routes/adminRoute';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(passport.initialize());
app.use(cookiesParser());

// Connect to DB once. Mongoose buffers commands until connected automatically.
// Using .catch to log errors without blocking requests or killing the process.
connectDb().catch((err) => {
  console.error('[STARTUP] MongoDB connection failed:', err?.message);
});

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishListRoutes);
app.use('/api/user/address', addressRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[GLOBAL EXPRESS ERROR]', err?.message, err?.stack);
  return res.status(500).json({
    success: false,
    message: `GLOBAL ERROR: ${err?.message || 'Unknown Error'}`,
    data: null,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;