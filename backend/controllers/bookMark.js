import User from "../model/user.js";
import Comment from "../model/comment.js";
import Post from "../model/post.js";
import { verifyToken } from "../middleware/verifyToken.js";


export const toggleBookmark = (req, res) => {
  const userId = req.id;
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ errorMsg: "Post not found" });
      }

      return User.findById(userId).then((user) => {
        if (!user) {
          return res.status(404).json({ errorMsg: "User not found" });
        }

        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
          user.bookmarks.pull(postId);
        } else {
          user.bookmarks.push(postId);
        }

        return user.save().then(() => {
          res.status(200).json({
            type: isBookmarked ? "unsave" : "save",
            message: isBookmarked
              ? "Post removed from bookmarks"
              : "Post bookmarked successfully",
          });
        });
      })
    })
    .catch((error) => {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json({ errorMsg: "Server error", error });
      }
    });
};



export const getBookmarkedPosts = (req, res) => {
  const userId = req.id;

  User.findById(userId)
    .populate({
      path: "bookmarks",
      populate: {
        path: "author",
        select: "username profilePicture"
      }
    })
    .select("username profilePicture bookmarks") // logged in user info
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errorMsg: "User not found" });
      }

      return res.status(200).json({
        message: "Bookmarked posts fetched successfully",
        bookmarkedBy: {
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        bookmarks: user.bookmarks, // includes each post + post.author populated
      });
    })
    .catch((error) => {
      if (!res.headersSent) {
        return res.status(500).json({ errorMsg: "Server error", error });
      }
    });
};
