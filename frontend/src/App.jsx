// // import React, { useEffect } from "react";
// // import {
// //   BrowserRouter,
// //   Routes,
// //   Route,
// //   Navigate,
// //   useParams,
// // } from "react-router-dom";

// // import Login from "./components/Login.jsx";
// // import Signup from "./components/Signup.jsx";
// // import MainLayout from "./components/MainLayout.jsx";
// // import Profile from "./components/Profile.jsx";
// // import Home from "./components/Home.jsx";
// // import Message from "./components/Message.jsx";
// // import CreatePost from "./components/CreatePost.jsx";
// // import EditProfile from "./components/EditProfile.jsx";
// // import ChatTalkPage from "./components/ChatTalkPage.jsx";
// // import { io } from "socket.io-client";
// // import { useSelector } from "react-redux";

// // const App = () => (

// //   const {user} = useSelector(store=>store.auth)

// //   useEffect(()=>{
// //      if(user){
// //       const socketio =
// //      }
// //   },[])

// //   <BrowserRouter>
// //     <Routes>
// //       <Route path="/" element={<Navigate to="/login" />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/signup" element={<Signup />} />

// //       {/* ✅ Nested under /home */}
// //       <Route path="/home" element={<MainLayout />}>
// //         <Route index element={<Home />} />
// //         <Route path="profile/:id?" element={<Profile />} />
// //         <Route path="messages" element={<Message />} />
// //         <Route path="CreatePost" element={<CreatePost />} />
// //          <Route path="edit-profile" element={<EditProfile />} />
// //           <Route path="chat" element={<ChatTalkPage/>} />
// //       </Route>

// //     </Routes>
// //   </BrowserRouter>
// // );

// // export default App;

// // App.jsx

// import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./components/Login.jsx";
// import Signup from "./components/Signup.jsx";
// import MainLayout from "./components/MainLayout.jsx";
// import Profile from "./components/Profile.jsx";
// import Home from "./components/Home.jsx";
// import Message from "./components/Message.jsx";
// import CreatePost from "./components/CreatePost.jsx";
// import EditProfile from "./components/EditProfile.jsx";
// import ChatTalkPage from "./components/ChatTalkPage.jsx";

// import { useDispatch, useSelector } from "react-redux";
// import { io } from "socket.io-client";
// import { setSocket } from "./Redux/socketSlice.js";
// import { setOnlineUsers } from "./Redux/chatSlice.js";

// const App = () => {
//   const { user } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (user?._id) {
//       const socketio = io("http://localhost:2530", {
//         query: {
//           userId: user._id,
//         },
//         transports: ["websocket"],
//       });

//       dispatch(setSocket(socketio));

//       socketio.on("getOnlineUsers", (onlineUsers) => {
//         dispatch(setOnlineUsers(onlineUsers));
//         console.log("🌐 Online Users:", onlineUsers);
//       });

//       socketio.on("connect", () => {
//         console.log("✅ Connected to server, socket id:", socket.id);
//       });

//       return () => {
//         socketio.disconnect();
//         dispatch(setSocket(null));
//         console.log("❌ Disconnected from socket");
//       };
//     } else {
//       socketio.close();
//       dispatch(setSocket(null));
//     }
//   }, [user, dispatch]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route path="/home" element={<MainLayout />}>
//           <Route index element={<Home />} />
//           <Route path="profile/:id?" element={<Profile />} />
//           <Route path="messages" element={<Message />} />
//           <Route path="CreatePost" element={<CreatePost />} />
//           <Route path="edit-profile" element={<EditProfile />} />
//           <Route path="chat" element={<ChatTalkPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Profile from "./components/Profile.jsx";
import Home from "./components/Home.jsx";
import CreatePost from "./components/CreatePost.jsx";
import EditProfile from "./components/EditProfile.jsx";
import SearchPage from "./components/SearchPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main app routes */}
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile/:id?" element={<Profile />} />
          <Route path="CreatePost" element={<CreatePost />} />
          <Route path="edit-profile" element={<EditProfile />} />

                  <Route path="search" element={<SearchPage/>} />
          {/* Catch-all fallback route for invalid paths under /home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>

        {/* Fallback for unknown routes outside /home */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
