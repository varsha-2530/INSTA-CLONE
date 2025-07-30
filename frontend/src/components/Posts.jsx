import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  if (!Array.isArray(posts)) {
    console.warn("⚠️ `posts` is not an array:", posts);
    return <div className="text-white p-4">No posts available.</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
