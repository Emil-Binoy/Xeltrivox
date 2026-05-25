const prisma = require("../prisma/client");

const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.body;

    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            OR: [{ userId: currentUserId }, { userId: userId }],
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: currentUserId }, { userId: userId }],
          },
        },
        include: {
          participants: true,
        },
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports={createOrGetConversation}