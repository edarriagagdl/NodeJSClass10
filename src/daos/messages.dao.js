import Message from './models/messages.schema.js';

class MessagesDAO {
  static async getALL() {
    return await Message.find().lean();
  }

  static async add(user, text) {
    try {
      const message = new Message(user, text);
      await message.save();
      return message;
    } catch (error) {
      console.log(error);
    }
  }
}
export { MessagesDAO as messagesDAO };
