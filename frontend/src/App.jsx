import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Profile from "./components/Profile.jsx";
import Home from "./components/Home.jsx";
import Message from "./components/Message.jsx";
import CreatePost from "./components/CreatePost.jsx";
import EditProfile from "./components/EditProfile.jsx";




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
