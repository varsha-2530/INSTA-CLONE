// // import { createSlice } from "@reduxjs/toolkit";

// // const authSlice = createSlice({
// //   name: "auth",
// //   initialState: {
// //     user: null,
// //     suggestedUsers: [],
// //     userProfile:null,
// //     selectedUser:null
// //   },
// //   reducers: {
// //     setAuthUser: (state, action) => {
// //       state.user = action.payload;
// //     },
// //     setSuggestedUser: (state, action) => {
// //       state.suggestedUsers = Array.isArray(action.payload) ? action.payload : [];
// //     },
// //      setUserProfile: (state, action) => {
// //       state.userProfile = action.payload; 
     
// //     },
// //   },
  
// // });

// // export const { setAuthUser, setSuggestedUser , setUserProfile} = authSlice.actions;
// // export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     suggestedUsers: [],
//     userProfile: null,
//     selectedUser: null,
//   },
//   reducers: {
//     setAuthUser: (state, action) => {
//       state.user = action.payload;
//     },
//     setSuggestedUser: (state, action) => {
//       state.suggestedUsers = Array.isArray(action.payload) ? action.payload : [];
//     },
//     setUserProfile: (state, action) => {
//       state.userProfile = action.payload;
//     },
//     setSelectedUser: (state, action) => {
//       state.selectedUser = action.payload;
//     },
//   },
// });

// export const { setAuthUser, setSuggestedUser, setUserProfile, setSelectedUser } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,             // Logged in user
    suggestedUsers: [],     // Also used to store all users in search
    userProfile: null,      // Visited user's profile (via /profile/:id)
    selectedUser: null,     // For chat or any user selection
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUser: (state, action) => {
      // used in both Suggested User block & All User search
      state.suggestedUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUser,
  setUserProfile,
  setSelectedUser,
} = authSlice.actions;

export default authSlice.reducer;
