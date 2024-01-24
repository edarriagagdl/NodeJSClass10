import express from 'express';
const router = express.Router();
import { productManager } from '../ProductManager.js';

router.get('/', (req, res) => {
  res.render('index', {
    product: productManager.getProducts(),
    style: 'index.css',
  });
});

router.get('/realtimeproducts', (req, res) => {
  // Send all messages to the client
  res.render('realtimeproducts', {
    product: productManager.getProducts(),
    style: 'index.css',
  });
});

export default router;
