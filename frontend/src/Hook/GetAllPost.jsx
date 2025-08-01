import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {  setPosts } from "@/Redux/postSlice";

const GetAllPost = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get("/api/post/getAllPost", {
          withCredentials: true,
        });
        if (res.data.message) {
          //console.log("✅ POSTS: ", res.data.posts);
          dispatch(setPosts(res.data.posts))
        }
      } catch (error) {
       console.error("Get all posts error:", error?.message, error);

      }
    };
    fetchAllData();
  }, []);
};

export default GetAllPost;
