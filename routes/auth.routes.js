const express = require("express");
const router = express.Router();
const { registerUser, loginUser, deleteAccount, updateProfile } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete-account",authenticateUser, deleteAccount);
router.put("/update-profile",authenticateUser, updateProfile); 

module.exports = router;

