import express from "express";
import { register, login, getMe, logout, getAllUsers } from "../controller/authController.js";
import { protect, requireRole } from "../MiddleWares/auth.js";
import { registerRules, loginRules } from "../MiddleWares/validators.js";

const router = express.Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.get("/users", protect, requireRole("admin"), getAllUsers);

export default router;
