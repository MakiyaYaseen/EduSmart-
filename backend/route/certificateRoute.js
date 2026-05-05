import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCertificate } from "../controller/certificateController.js";

const router = express.Router();

router.get("/:courseId", isAuth, getCertificate);

export default router;
