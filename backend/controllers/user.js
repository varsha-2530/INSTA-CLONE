// import { User } from "../model/user.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { SECRETKEY } from "../keys.js";
// import Post from "../model/post.js";
// import Comment from "../model/comment.js";
// import cloudinary from "../utils/cloudinary.js";
// import mongoose from "mongoose";

// //create account..
// export const signup = (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({
//       errorMsg: "Please fill all fields",
//     });
//   }

//   User.findOne({ $or: [{ email }, { username }] })
//     .then((existingUser) => {
//       if (existingUser) {
//         return res.status(400).json({
//           errorMsg: "Email or username already exists",
//         });
//       }

//       bcrypt
//         .hash(password, 10)
//         .then((hashedPassword) => {
//           // console.log(hashedPassword)
//           const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//           });

//           newUser
//             .save()
//             .then((savedUser) => {
//               res.status(201).json({
//                 message: "Account Signup successful",
//                 user: {
//                   id: savedUser._id,
//                   username: savedUser.username,
//                   email: savedUser.email,
//                 },
//               });
//             })
//             .catch((err) => {
//               console.error("Error while saving user:", err);
//               res.status(500).json({ error: "Error saving user" });
//             });
//         })
//         .catch((err) => {
//           console.error("Error while hashing password:", err);
//           res.status(500).json({ error: "Error hashing password" });
//         });
//     })
//     .catch((err) => {
//       console.error("Error finding user:", err);
//       res.status(500).json({ error: "Server error" });
//     });
// };

// //login...
// export const login = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(422).json({
//       errorMsg: "Please Enter All Details",
//     });
//   }

//   try {
//     const dbUser = await User.findOne({ username }).select("+password");

//     if (!dbUser) {
//       return res.status(402).json({
//         errorMsg: "No user exists with this username!",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, dbUser.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         errorMsg: "Incorrect password",
//       });
//     }

//     const token = jwt.sign({ id: dbUser._id }, SECRETKEY, {
//       expiresIn: "1d",
//     });

//     const populatedPosts = await Post.find({ _id: { $in: dbUser.posts } });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "Login Successfully!!",
//       user: {
//         id: dbUser._id,
//         username: dbUser.username,
//         email: dbUser.email,
//         profilePicture: dbUser.profilePicture,
//         bio: dbUser.bio,
//         followers: dbUser.followers,
//         following: dbUser.following,
//         posts: populatedPosts,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     return res.status(500).json({ errorMsg: "Something went wrong" });
//   }
// };

// //logout...
// export const logout = (_, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: false,
//     sameSite: "Lax",
//   });

//   return res.status(200).json({ message: "Logout successful!" });
// };

// //getProfile..
// export const getProfile = (req, res) => {
//   const userId = req.params.id;

//   User.findById(userId)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ errorMsg: "User not found." });
//       }

//       res.status(200).json(
//         { 
//           user ,
//           message:"User Get Successfully"
//         });
//     })
//     .catch((err) => {
//       console.error("DB error:", err);
//       res.status(500).json({ errorMsg: "Something went wrong." });
//     });
// };



// //EDITProfile..
// export const editProfile = (req, res) => {
//   const userId = req.id;
//   const { username, email, bio } = req.body;

//   // Image upload case  
//   if (req.file) {
//     cloudinary.uploader
//       .upload_stream({ folder: "profiles" }, (error, result) => {
//         if (error) {
//           console.error("Cloudinary error:", error);
//           return res.status(500).json({ error: "Image upload failed" });
//         }

//         User.findByIdAndUpdate(
//           userId,
//           {
//             username,
//             email,
//             bio,
//             profilePicture: result.secure_url,
//           },
//           { new: true }
//         )
//           .then((updatedUser) => {
//             res.status(200).json({
//               message: "Profile updated with image",
//               user:updatedUser,
//             });
//           })
//           .catch((err) => {
//             console.error("User update error:", err.message);
//             res.status(500).json({ error: "Failed to update user profile" });
//           });
//       })
//       .end(req.file.buffer);
//   } else {
//     // No image upload
//     User.findByIdAndUpdate(
//       userId,
//       {
//         username,
//         email,
//         bio,
//       },
//       { new: true }
//     )
//       .then((updatedUser) => {
//         res.status(200).json({
//           message: "Profile updated without image",
//           user:updatedUser,
//         });
//       })
//       .catch((err) => {
//         console.error("User update error:", err.message);
//         res.status(500).json({ error: "Failed to update user profile" });
//       });
//   }
// };


// //........................................................................

// export const getSuggestedUsers = async (req, res) => {
//   try {
//     const currentUserId = new mongoose.Types.ObjectId(req.id);

//     // Find current user
//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ errorMsg: "Current user not found." });
//     }

//     // Find users who are NOT current user and not followed
//     const suggestedUsers = await User.find({
//       _id: { $ne: currentUserId, $nin: currentUser.following || [] },
//     })
//       .select("-password")
//       .limit(5);

//     return res.status(200).json({
//       success: true,
//       users: suggestedUsers,
//     });
//   } catch (err) {
//     console.error("Error fetching suggested users:", err);
//     return res.status(500).json({ errorMsg: "Something went wrong." });
//   }
// };


// //..............................................................
// export const deleteUser = (req, res) => {
//   const userId = req.id;

//   User.findByIdAndDelete(userId)
//     .then(async (deletedUser) => {
//       if (!deletedUser) {
//         return res.status(404).json({ errorMsg: "User not found" });
//       }

//       // 1. Delete all posts by user
//       await Post.deleteMany({ author: userId });

//       // 2. Delete all comments by user
//       await Comment.deleteMany({ author: userId });

//       // 3. Remove userId from other users' followers/following lists
//       await User.updateMany(
//         { followers: userId },
//         { $pull: { followers: userId } }
//       );

//       await User.updateMany(
//         { following: userId },
//         { $pull: { following: userId } }
//       );

//       // 4. Remove user's likes from all posts
//       await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

//       res.status(200).json({
//         msg: "User and all related data (posts, comments, followers, likes) deleted successfully",
//       });
//     })
//     .catch((err) => {
//       console.error("Error deleting user:", err);
//       res.status(500).json({ errorMsg: "Something went wrong" });
//     });
// };





import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRETKEY } from "../keys.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

//create account..
export const signup = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      errorMsg: "Please fill all fields",
    });
  }

  User.findOne({ $or: [{ email }, { username }] })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          errorMsg: "Email or username already exists",
        });
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          // console.log(hashedPassword)
          const newUser = new User({
            username,
            email,
            password: hashedPassword,
          });

          newUser
            .save()
            .then((savedUser) => {
              res.status(201).json({
                message: "Account Signup successful",
                user: {
                  id: savedUser._id,
                  username: savedUser.username,
                  email: savedUser.email,
                },
              });
            })
            .catch((err) => {
              console.error("Error while saving user:", err);
              res.status(500).json({ error: "Error saving user" });
            });
        })
        .catch((err) => {
          console.error("Error while hashing password:", err);
          res.status(500).json({ error: "Error hashing password" });
        });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Server error" });
    });
};

//login...
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({
      errorMsg: "Please Enter All Details",
    });
  }

  try {
    const dbUser = await User.findOne({ username }).select("+password");

    if (!dbUser) {
      return res.status(402).json({
        errorMsg: "No user exists with this username!",
      });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);

    if (!isMatch) {
      return res.status(401).json({
        errorMsg: "Incorrect password",
      });
    }

    const token = jwt.sign({ id: dbUser._id }, SECRETKEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Post.find({ _id: { $in: dbUser.posts } });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successfully!!",
      user: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        profilePicture: dbUser.profilePicture,
        bio: dbUser.bio,
        followers: dbUser.followers,
        following: dbUser.following,
        posts: populatedPosts,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ errorMsg: "Something went wrong" });
  }
};

//logout...
export const logout = (_, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  return res.status(200).json({ message: "Logout successful!" });
};

//getProfile..
export const getProfile = async (req, res) => {
  const userId = req.params.id;

  // ✅ Validate ObjectId
  if (!userId || userId === "undefined" || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ errorMsg: "Invalid or missing user ID." });
  }

  try {
    const user = await User.findById(userId)
      .populate("posts") // optional
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture");

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found." });
    }

    res.status(200).json({ user, message: "User Get Successfully" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ errorMsg: "Something went wrong." });
  }
};




// EDIT Profile Controller
export const editProfile = (req, res) => {
  const userId = req.id;
  const { username, email, bio, gender } = req.body; 
  //console.log("Incoming body =>", req.body);
  const updateData = {
    username,
    email,
    bio,
    gender,
  };
  

  if (req.file) {
    cloudinary.uploader
      .upload_stream({ folder: "profiles" }, (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        updateData.profilePicture = result.secure_url;

        User.findByIdAndUpdate(userId, updateData, { new: true })
          .then((updatedUser) => {
            res.status(200).json({
              message: "Profile updated with image",
              user: updatedUser,
            });
            
          })
          .catch((err) => {
            console.error("User update error:", err.message);
            res.status(500).json({ error: "Failed to update user profile" });
          });
      })
      .end(req.file.buffer);
  } else {
    // No image uploaded
    User.findByIdAndUpdate(userId, updateData, { new: true })
      .then((updatedUser) => {
        // console.log("Updated user =>", updatedUser);
        res.status(200).json({
          message: "Profile updated without image",
          user: updatedUser,
        });
       
      })
      .catch((err) => {
        console.error("User update error:", err.message);
        res.status(500).json({ error: "Failed to update user profile" });
      });
  }
};


//........................................................................

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.id);

    // Find current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ errorMsg: "Current user not found." });
    }

    // Find users who are NOT current user and not followed
    const suggestedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.following || [] },
    })
      .select("-password")
      .limit(5);

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (err) {
    console.error("Error fetching suggested users:", err);
    return res.status(500).json({ errorMsg: "Something went wrong." });
  }
};


//..............................................................
export const deleteUser = (req, res) => {
  const userId = req.id;

  User.findByIdAndDelete(userId)
    .then(async (deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ errorMsg: "User not found" });
      }

      // 1. Delete all posts by user
      await Post.deleteMany({ author: userId });

      // 2. Delete all comments by user
      await Comment.deleteMany({ author: userId });

      // 3. Remove userId from other users' followers/following lists
      await User.updateMany(
        { followers: userId },
        { $pull: { followers: userId } }
      );

      await User.updateMany(
        { following: userId },
        { $pull: { following: userId } }
      );

      // 4. Remove user's likes from all posts
      await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

      res.status(200).json({
        msg: "User and all related data (posts, comments, followers, likes) deleted successfully",
      });
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).json({ errorMsg: "Something went wrong" });
    });
};
