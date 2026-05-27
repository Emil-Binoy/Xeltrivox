const prisma = require("../prisma/client");
const webpush = require("web-push");

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:test@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID keys not found. Web push notifications are disabled.");
}

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, text, replyToId } = req.body;

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
        replyToId: replyToId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            text: true,
            senderId: true,
            sender: {
              select: { name: true }
            }
          }
        }
      },
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
    });

    for (const participant of participants) {
      const userSocketId = onlineUsers[participant.userId];
      if (userSocketId) {
        io.to(userSocketId).emit("receiveMessage", message);
      }

      if (participant.userId !== senderId) {
        try {
          const recipient = await prisma.user.findUnique({
            where: { id: participant.userId },
            select: { pushSubscription: true }
          });
          
          if (recipient && recipient.pushSubscription && process.env.VAPID_PUBLIC_KEY) {
            const payload = JSON.stringify({
              title: message.sender.name,
              body: message.text,
              icon: message.sender.profilePic || "/favicon.ico",
              url: "/"
            });
            await webpush.sendNotification(recipient.pushSubscription, payload);
          }
        } catch (pushErr) {
          console.log("Push notification error:", pushErr.message);
        }
      }
    }

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
        replyTo: {
          select: {
            id: true,
            text: true,
            senderId: true,
            sender: {
              select: { name: true }
            }
          }
        }
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
