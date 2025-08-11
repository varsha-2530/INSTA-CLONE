// import React, { useState } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import { Link, useNavigate } from "react-router-dom";
// import insta from "../assets/insta.png";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { setAuthUser } from "@/Redux/authSlice";

// const Login = () => {
//   const [input, setInput] = useState({
//     username: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const EventHandle = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const handleError = (error) => {
//     const msg =
//       error?.response?.data?.errorMsg ||
//       error?.response?.data?.message ||
//       error?.message ||
//       "Something went wrong";
//     toast.error(msg);
//   };

//   const SignUpHandleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "/api/user/login",
//         input,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (res.data.message) {
//         dispatch(setAuthUser(res.data.user));
//         toast.success(res.data.message);
//         setInput({ username: "", password: "" });
//         navigate("/home");
//       }
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-black flex items-center justify-center px-4">
//       <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-8">
//         {/* Left Side Image */}
//         <div className="hidden md:flex justify-center">
//           <img
//             src={insta}
//             alt="Instagram mockup"
//             className="w-full max-w-[600px]" // Increased from max-w-md
//           />
//         </div>

//         {/* Right Side Login Box */}
//         <div className="flex justify-center w-full mb-6">
//           <div className="w-full max-w-xs flex flex-col gap-3 text-white">
//             {/* Instagram Logo */}
//             <div className="border border-[#000000] bg-[#000000] p-6 rounded-md">
//               <h1 className="text-5xl font-logo text-center mb-6 text-white tracking-wider">
//                 ChatTALK
//               </h1>

//               <form
//                 onSubmit={SignUpHandleSubmit}
//                 className="flex flex-col gap-3"
//               >
//                 <Input
//                   type="text"
//                   name="username"
//                   placeholder="username"
//                   value={input.username}
//                   onChange={EventHandle}
//                   className="bg-[#1e1e1e] border border-[#333] text-sm"
//                 />
//                 <Input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={input.password}
//                   onChange={EventHandle}
//                   className="bg-[#1e1e1e] border border-[#333] text-sm"
//                 />
//                 {loading ? (
//                   <Button>
//                     <Loader2 className="mr-2  h-4 w-4 animate-spin" />
//                     Please Wait
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     disabled={loading}
//                     className="text-sm mt-1 bg-[#0095f6] hover:bg-gradient-to-r hover:from-[#0095f6] hover:to-[#da60c8] transition-all duration-300"
//                   >
//                     Login
//                   </Button>
//                 )}
//               </form>

//               <div className="flex items-center my-4">
//                 <div className="flex-1 h-px bg-[#333]" />
//                 <span className="text-xs text-[#a8a8a8] px-2">OR</span>
//                 <div className="flex-1 h-px bg-[#333]" />
//               </div>

//               <div className="text-center text-xs">
//                 <a href="#" className="text-[#b3b3b3] hover:underline">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>

//             {/* Sign Up Box */}
//             <div className=" p-4 rounded-md text-center text-sm">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-[#ffffff] hover:bg-gradient-to-r hover:from-[#0095f6] hover:to-[#da60c8] font-medium px-2 py-1 rounded transition-all duration-300"
//               >
//                 Sign up
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import insta from "../assets/insta.png";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/Redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleError = (error) => {
    const msg =
      error?.response?.data?.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(msg);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/user/login",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.message) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({ username: "", password: "" });
        navigate("/home");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-8">
        {/* Left Side Image */}
        <div className="hidden md:flex justify-center">
          <img
            src={insta}
            alt="Instagram mockup"
            className="w-full max-w-[600px]"
          />
        </div>

        {/* Right Side Login Box */}
        <div className="flex justify-center w-full mb-6">
          <div className="w-full max-w-xs flex flex-col gap-3 text-white">
            <div className="border border-[#000000] bg-[#000000] p-6 rounded-md">
              <h1 className="text-5xl font-logo text-center mb-6 text-white tracking-wider">
                ChatTALK
              </h1>

              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={input.username}
                  onChange={handleChange}
                  className="bg-[#1e1e1e] border border-[#333] text-sm"
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={handleChange}
                  className="bg-[#1e1e1e] border border-[#333] text-sm"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="text-sm mt-1 bg-[#0095f6] hover:bg-gradient-to-r hover:from-[#0095f6] hover:to-[#da60c8] transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-[#333]" />
                <span className="text-xs text-[#a8a8a8] px-2">OR</span>
                <div className="flex-1 h-px bg-[#333]" />
              </div>

              <div className="text-center text-xs">
                <a href="#" className="text-[#b3b3b3] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="p-4 rounded-md text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#ffffff] hover:bg-gradient-to-r hover:from-[#0095f6] hover:to-[#da60c8] font-medium px-2 py-1 rounded transition-all duration-300"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
