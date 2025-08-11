import { User } from "../model/user.js";

// export const toggleFollow = (req, res) => {
//     const myId = req.id;
//     const targetId = req.params.id;
  
//     if (myId === targetId) {
//       return res.status(400).json({ errorMsg: "You cannot follow/unfollow yourself." });
//     }
  
//     User.findById(myId)
//       .then((me) => {
//         if (!me) {
//           return res.status(404).json({ errorMsg: "User not found." });
//         }
  
//         return User.findById(targetId)
//           .then((targetUser) => {
//             if (!targetUser) {
//               return res.status(404).json({ errorMsg: "Target user not found." });
//             }
  
//             const isFollowing = me.following.includes(targetId);
  
//             if (isFollowing) {
//               // UNFOLLOW
//               return Promise.all([
//                 User.findByIdAndUpdate(myId, { $pull: { following: targetId } }),
//                 User.findByIdAndUpdate(targetId, { $pull: { followers: myId } }),
//               ]).then(() => {
//                 res.status(200).json({ msg: "Unfollowed successfully." });
//               });
//             } else {
//               // FOLLOW
//               return Promise.all([
//                 User.findByIdAndUpdate(myId, { $addToSet: { following: targetId } }),
//                 User.findByIdAndUpdate(targetId, { $addToSet: { followers: myId } }),
//               ]).then(() => {
//                 res.status(200).json({ msg: "Followed successfully." });
//               });
//             }
//           });
//       })
//       .catch((err) => {
//         console.error("Toggle follow error:", err);
//         res.status(500).json({ errorMsg: "Something went wrong." });
//       });
//   };
  

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = targetUser.followers.includes(currentUserId);

    if (isFollowing) {
      // Unfollow
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetUserId);
    } else {
      // Follow
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
    }

    await targetUser.save();
    await currentUser.save();

    const updatedTargetUser = await User.findById(targetUserId)
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture")
      .populate("posts");

    res.status(200).json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      updatedUser: updatedTargetUser,
    });
  } catch (error) {
    console.error("Follow toggle error:", error);
    res.status(500).json({ message: "Server error while toggling follow" });
  }
};



// Get Followers
export const getFollowers = (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
        .populate("followers")
        .then(user => {
            if (!user) return res.status(404).json({ errorMsg: "User not found" });
            res.status(200).json({ followers: user.followers });
        })
        .catch(err => res.status(500).json({ errorMsg: "Server error" }));
};

// Get Following
export const getFollowing = (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
        .populate("following", "-password")
        .then(user => {
            if (!user) return res.status(404).json({ errorMsg: "User not found" });
            res.status(200).json({ following: user.following });
        })
        .catch(err => res.status(500).json({ errorMsg: "Server error" }));
};