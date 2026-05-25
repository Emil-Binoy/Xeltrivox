const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { sendMessage,getMessages,deleteMessage } = require("../controllers/messageController")

router.post("/",protect,sendMessage)
router.get("/:conversationId",protect,getMessages)
router.delete("/:messageId", protectRoute, deleteMessage);

module.exports=router
