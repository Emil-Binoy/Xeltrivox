const prisma = require("../prisma/client");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "message can't be empty",
      });
    }

    const message = await prisma.message.create({
      data: {
        text,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
    });

    // Send to everyone connected to this conversation loop
    participants.forEach((participant) => {
      const userSocketId = onlineUsers[participant.userId];
      if (userSocketId) {
        io.to(userSocketId).emit("receiveMessage", message);
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        status: { not: "READ" },
      },
      data: { status: "READ" },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    const recipient = conversation.participants.find(
      (p) => p.userId !== currentUserId,
    );
    if (recipient && onlineUsers[recipient.userId]) {
      io.to(onlineUsers[recipient.userId]).emit("messagesRead", {
        conversationId,
      });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user.id;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId !== currentUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message" });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    res.status(200).json({
      message: "Message deleted successfully",
      messageId,
      conversationId: message.conversationId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage };
