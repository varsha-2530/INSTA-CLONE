import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../model/post.js";
import User from "../model/user.js";
import Comment from "../model/comment.js";

export const addPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const author = req.id;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ errorMsg: "Image is required to create a post." });
    }

    // 1️⃣ Sharp se optimize
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // 2️⃣ Cloudinary upload
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "posts" });

    // 3️⃣ Post create
    const newPost = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: author,
    });

    // 4️⃣ User me post push karo
    const user = await User.findById(author);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    // 5️⃣ Nayi post ko populate karo (author ka username + profilePicture ke sath)
    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      });

    // 6️⃣ Response bhejo
    res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    console.error("Add post error:", error);
    res.status(500).json({ errorMsg: "Internal server error." });
  }
};


//get all post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "get all post successfully",
      posts,
    });
  } catch (error) {
    console.error("🔥 Error in getAllPost:", error);
    res.status(500).json({ errorMsg: "Internal server error." });
  }
};

export const getUserPost = (req, res) => {
  const authorId = req.id;
  Post.find({ author: authorId })
    .sort({ createdAt: -1 })
    .populate("author", "username profilePicture")
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .then((posts) => {
      res.status(200).json({
        msg: "User's posts fetched successfully",
        posts,
      });
    })
    .catch((error) => {
      console.error("Get user posts error:", error);
      res.status(500).json({ errorMsg: "Internal server error." });
    });
};

//likes
export const toggleLike = async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ errorMsg: "Post not found" });
    }

    let liked;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      liked = false;
    } else {
      // Like
      post.likes.push(userId);
      liked = true;
    }

    const updatedPost = await post.save();

    // ✅ Now populate likes
    const populatedPost = await Post.findById(updatedPost._id).populate(
      "likes",
      "username profilePicture"
    );

    res.status(200).json({
      message: liked ? "Post liked" : "Post unliked",
      liked,
      totalLikes: populatedPost.likes.length,
      updatedLikes: populatedPost.likes, // 👈 Full user objects
    });
  } catch (error) {
    console.error("Like/unlike error:", error);
    res.status(500).json({ errorMsg: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id; // verifyToken sets this

    const post = await Post.findById(postId).select("_id author image"); // image field adjust karo

    if (!post) {
      return res.status(404).json({ errorMsg: "Post not found" });
    }

    if (String(post.author) !== String(userId)) {
      return res
        .status(403)
        .json({ errorMsg: "You are not allowed to delete this post" });
    }

    // (Optional) image cleanup — agar Cloudinary use kar rahe ho aur public_id store karte ho
    // if (post.image?.public_id) {
    //   await cloudinary.uploader.destroy(post.image.public_id);
    // }

    // 1) Delete all comments belonging to this post
    await Comment.deleteMany({ post: postId });

    // 2) (Optional) Agar users ke document me likedPosts/savedPosts rakhte ho to wahan se bhi pull:
    // await User.updateMany({ likedPosts: postId }, { $pull: { likedPosts: postId } });
    // await User.updateMany({ savedPosts: postId }, { $pull: { savedPosts: postId } });

    // 3) Finally delete the post itself
    await Post.deleteOne({ _id: postId });

    return res
      .status(200)
      .json({ message: "Post & related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ errorMsg: "Something went wrong" });
  }
};

// export const deletePost = (req, res) => {
//   const postId = req.params.id;
//   const userId = req.id;
//   console.log("User ID from token:", userId);
//   console.log("Post ID from params:", postId);

//   Post.findById(postId)
//     .then((post) => {
//       console.log("Fetched post:", post);

//       if (!post) {
//         return res.status(404).json({ errorMsg: "Post not found" });
//       }

//       if (post.author.toString() !== userId) {
//         return res
//           .status(403)
//           .json({ errorMsg: "You are not allowed to delete this post" });
//       }

//       return Post.findByIdAndDelete(postId);
//     })
//     .then(() => {
//       res.status(200).json({ message: "Post deleted successfully" });
//     })
//     .catch((err) => {
//       console.error("Error deleting post:", err);
//       res.status(500).json({ errorMsg: "Something went wrong" });
//     });
// };
