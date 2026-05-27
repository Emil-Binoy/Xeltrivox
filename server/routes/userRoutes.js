const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getProfile, getUsers, updateProfile, savePushSubscription } = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/", protect, getUsers);
router.post("/push-subscription", protect, savePushSubscription);

module.exports = router;
