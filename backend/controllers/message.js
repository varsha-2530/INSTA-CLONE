import Message from "../model/message.js";
import Conversation from "../model/conversation.js";

export const sendMessage = (req, res) => {
  const senderId = req.id;
  const receiverId = req.params.id;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ errorMsg: "All fields are required" });
  }

  Conversation.findOne({ participants: { $all: [senderId, receiverId] } })
    .then((existingConversation) => {
      if (existingConversation) {
        return { conversation: existingConversation };
      } else {
        const newConversation = new Conversation({
          participants: [senderId, receiverId],
          messages: [], // ✅ Yahan bhi 'messages'
        });

        return newConversation.save().then((conversation) => ({
          conversation,
        }));
      }
    })
    .then(({ conversation }) => {
      const newMsg = new Message({
        senderId,
        receiverId,
        message,
      });

      return newMsg.save().then((savedMsg) => {
        conversation.messages.push(savedMsg._id); // ✅ Push to 'messages'
        return conversation.save().then(() => {
          res.status(201).json({
            message: "Message sent successfully",
            data: savedMsg,
          });
        });
      });
    })
    .catch((err) => {
      console.error("Send Message Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ errorMsg: "Server error", err });
      }
    });
};



export const getMessages = (req, res) => {
  const userId = req.id;
  const receiverId = req.params.id;

  Conversation.findOne({
    participants: { $all: [userId, receiverId] }
  })
    .populate({
      path: "messages", 
      populate: {
        path: "senderId receiverId",
        select: "username profileImage"
      }
    })
    .then((conversation) => {
      if (!conversation) {
        return res.status(404).json({ errorMsg: "No conversation found" });
      }

      res.status(200).json({
        message: "Messages fetched successfully",
        data: conversation.messages // ✅ Correct usage
      });
    })
    .catch((error) => {
      console.error("Get Messages Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ errorMsg: "Server error", error });
      }
    });
};