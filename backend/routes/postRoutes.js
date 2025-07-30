import express from 'express'
import { addPost, getAllPost,getUserPost, toggleLike, deletePost } from '../controllers/post.js'
import {addComments,deleteComment,getAllComments, getUserPostComments} from "../controllers/comments.js"
import { verifyToken } from '../middleware/verifyToken.js'
import {toggleBookmark, getBookmarkedPosts} from "../controllers/bookMark.js"
import multer from 'multer'


const router = express.Router()


const storage = multer.memoryStorage()
const upload = multer({storage});

router.post("/addPost", verifyToken, upload.single('image'), addPost)
router.get("/getAllPost",verifyToken,getAllPost)
router.get("/getUserPost", verifyToken, getUserPost)

router.put("/toggleLike/:id", verifyToken, toggleLike)
router.delete("/deletePost/:id", verifyToken, deletePost)

router.post("/addComments/:id", verifyToken, addComments)
router.delete("/deleteComment/:commentId", verifyToken, deleteComment)
router.get("/getAllComments/:postId", verifyToken, getAllComments)
router.get("/getUserPostComments/:postId", verifyToken, getUserPostComments)
router.get("/toggleBookmark/:postId", verifyToken, toggleBookmark)
router.get("/getBookmarkedPosts", verifyToken, getBookmarkedPosts)
export default router;  