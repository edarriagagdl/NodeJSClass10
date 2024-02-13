import express from 'express';
const router = express.Router();
import { productManager } from '../daos/product.manager.js';
import { messagesDAO } from '../daos/messages.dao.js';

router.get('/products', (req, res) => {
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

router.get('/chat', (req, res) => {
  res.render('chat'),
    {
      message: messagesDAO.getALL(),
      style: 'index.css',
    };
});

export default router;
