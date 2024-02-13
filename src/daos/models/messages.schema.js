import mongoose from 'mongoose';
const messagesCollection = 'messages';

const MessageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Message', MessageSchema);
