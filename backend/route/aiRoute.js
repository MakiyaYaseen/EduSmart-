import express from "express";
import isAuth from "../middleware/isAuth.js";
import { chatWithAi } from "../controller/aiController.js";

const router = express.Router();

router.post("/chat", isAuth, chatWithAi);

export default router;
