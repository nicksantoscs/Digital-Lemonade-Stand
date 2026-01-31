import express from 'express';
import cors from 'cors';
import beverageRoutes from './routes/beverage.routes';
import orderRoutes from './routes/order.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/beverages', beverageRoutes);
app.use('/api/orders', orderRoutes);

export default app;