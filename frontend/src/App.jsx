// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import MainLayout from "./components/MainLayout";
// import Profile from "./components/Profile";
// import Home from "./components/Home";
// import Message from "./components/Message";
// import CreatePost from "./components/CreatePost";

// const App = () => (
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/home" element={<MainLayout />}>
//         <Route index element={<Home />} />
//        <Route path="profile" element={<Profile />} />
//         <Route path="messages" element={<Message />} />
//          <Route path="CreatePost" element={<CreatePost/>} />
//       </Route>
//     </Routes>
//   </BrowserRouter>
// );

// export default App;

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Message from "./components/Message";
import CreatePost from "./components/CreatePost";
import EditProfile from "./components/EditProfile";




const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Nested under /home */}
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/:id?" element={<Profile />} />
        <Route path="messages" element={<Message />} />
        <Route path="CreatePost" element={<CreatePost />} />
         <Route path="edit-profile" element={<EditProfile />} /> 
      </Route>

    
    </Routes>
  </BrowserRouter>
);

export default App;
