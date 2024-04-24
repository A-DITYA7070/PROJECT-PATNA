import express from "express";
import { sendCSRFToken } from "../../utils/sendCsrfToken.js";

const router = express.Router();


router.route("/get-csrf").post(sendCSRFToken);