const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB connection diagnostics...");
  try {
    // 1. Test basic connection and fetch a user
    const userCount = await prisma.user.count();
    console.log(`Database Connection: SUCCESS. Total users: ${userCount}`);

    // 2. Fetch users to get two valid user IDs
    const users = await prisma.user.findMany({ take: 2 });
    if (users.length < 2) {
      console.log("Not enough users to simulate conversation query.");
      return;
    }

    const currentUserId = users[0].id;
    const userId = users[1].id;
    console.log(`Simulating conversation query for users:\n  User A: ${users[0].username} (${currentUserId})\n  User B: ${users[1].username} (${userId})`);

    // 3. Test the exact Prisma query from chatController
    const conversation = await prisma.conversation.findFirst({
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

    console.log("Conversation Query: SUCCESS.", conversation ? "Found existing conversation." : "No existing conversation.");
  } catch (error) {
    console.error("DIAGNOSTICS FAILURE ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
