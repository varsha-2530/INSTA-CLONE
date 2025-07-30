import express from 'express'
import { signup, login, logout, getProfile, editProfile , getSuggestedUsers, deleteUser} from '../controllers/user.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { toggleFollow,getFollowers, getFollowing } from '../controllers/followController.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/getProfile/:id',verifyToken, getProfile)
router.get("/getSuggestedUsers", verifyToken, getSuggestedUsers)
router.put("/editprofile/:id", verifyToken, upload.single("profilePicture"), editProfile)

router.put("/toggleFollow/:id", verifyToken, toggleFollow);
router.get("/getfollowers/:id", getFollowers)
router.get("/getfollowing/:id", getFollowing)
router.delete("/deleteUser", verifyToken, deleteUser)

export default router
