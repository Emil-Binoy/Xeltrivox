const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createOrGetConversation } = require("../controllers/chatController")

router.post("/",protect,createOrGetConversation)

module.exports=router
