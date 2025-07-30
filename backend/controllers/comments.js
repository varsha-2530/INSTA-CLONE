import Post from "../model/post.js";
import Comment from "../model/comment.js";
import { verifyToken } from "../middleware/verifyToken.js";
import cloudinary from "../utils/cloudinary.js";


export const addComments = async (req, res) => {
 const postId = req.params.id;
  const commentUserId = req.id;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ errorMsg: "Write a comment first!" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ errorMsg: "Post not found!" });
    }

    const newComment = await Comment.create({
      text,
      author: commentUserId,
      post: postId,
    });

    post.comments.push(newComment._id);
    await post.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate({
        path: "author",
        select: "username profilePicture",
        model: "User",
      })
      .lean();

    populatedComment.user = populatedComment.author;
    delete populatedComment.author;

    res.status(201).json({
      message: "Comment added successfully!",
      newComment: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ errorMsg: "Internal server error." });
  }
};






export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.id; // verifyToken sets this

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ errorMsg: "Comment not found" });
    }

    if (String(comment.author) !== String(userId)) {
      return res.status(403).json({ errorMsg: "Unauthorized to delete comment" });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });

    // Pull comment ref from Post.comments
    await Post.updateOne(
      { _id: comment.post },
      { $pull: { comments: commentId } }
    );

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId, // frontend ko turant remove karne me asaani
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ errorMsg: "Internal server error" });
  }
};

export const getAllComments = (req, res) => {
  const { postId } = req.params;

  Post.findById(postId)
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }, // newest first
      populate: {
        path: "author",
        select: "username profilePicture",
      },
    })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ errorMsg: "Post not found" });
      }

      res.status(200).json({
        msg: "Comments fetched successfully",
        comments: post.comments,
      });
    })
    .catch((error) => {
      console.error("Get comments error:", error);
      res.status(500).json({ errorMsg: "Internal server error" });
    });
};


export const getUserPostComments = (req, res) => {
  const userId = req.id;
  const { postId } = req.params;

  // Step 1: Find the post (owned by this user)
  Post.findOne({ _id: postId, author: userId })
    .populate({
      path: "comments",
      populate: {
        path: "author", // nested populate
        select: "username profilePic", // only show these fields
      },
    })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ errorMsg: "Post not found or unauthorized" });
      }

      // Step 2: Send back comments with user details
      return res.status(200).json({
        message: "Comments fetched successfully",
        comments: post.comments, // array of { text, user: { username, profilePic } }
      });
    })
    .catch((error) => {
      if (!res.headersSent) {
        res.status(500).json({ errorMsg: "Server error", error });
      }
    });
};
