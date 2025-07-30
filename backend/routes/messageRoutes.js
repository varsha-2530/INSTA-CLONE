import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { getMessages, sendMessage } from "../controllers/message.js"


const router = express.Router()

router.post("/sendMessage/:id", verifyToken, sendMessage)
router.get("/getMessages/:id", verifyToken, getMessages)

export default router