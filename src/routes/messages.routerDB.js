import express from 'express';
const router = express.Router();
import { messagesDAO } from '../daos/messages.dao.js';

// Routes
router.get('/chat', async (req, res) => {
  const messages = messagesDAO.getALL();
  res.render('chat', { messages });
});

router.post('/messages', async (req, res) => {
  const { user, text } = req.body;
  messagesDAO.add(user, text);
  res.redirect('/chat');
});

export default router;
