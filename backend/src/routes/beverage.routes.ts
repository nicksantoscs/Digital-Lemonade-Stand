import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all beverages
router.get('/', async (req, res) => {
  try {
    const beverages = await prisma.beverage.findMany();
    res.json(beverages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beverages' });
  }
});

export default router;