
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = Array.isArray(action.payload) ? action.payload : [];
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
   
});

export const { setPosts, setSelectedPost } = postSlice.actions; // ✅ Correct
export default postSlice.reducer;
