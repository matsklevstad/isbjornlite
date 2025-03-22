import express from 'express';
import { 
  getAllBeers, 
  getBeer, 
  createBeer, 
  deleteBeer 
} from '../controllers/beerController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllBeers);
router.get('/:id', getBeer);

// Protected routes
router.post('/', authMiddleware, createBeer);
router.delete('/:id', authMiddleware, deleteBeer);

export default router;