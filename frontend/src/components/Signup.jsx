import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const EventHandle = (e) => {
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

  const SignUpHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/User/signup",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.message) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
           navigate("/login");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6">
      <div className="flex flex-col items-center w-full max-w-[400px]">
        {/* Main Signup Card */}
        <div className="border border-gray-700 bg-gray-900 p-6 sm:p-8 rounded-lg w-full shadow-md">
          <h1 className="text-center text-4xl sm:text-5xl font-bold font-logo mb-4 sm:mb-5 my-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600">
            Instagram
          </h1>

          <p className="text-center text-gray-300 text-sm mb-5 font-medium">
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={SignUpHandleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={EventHandle}
              placeholder="Email"
              className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none text-sm focus:ring-1 focus:ring-pink-400"
            />

            <input
              type="text"
              name="username"
              value={input.username}
              onChange={EventHandle}
              placeholder="Username"
              className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none text-sm focus:ring-1 focus:ring-pink-400"
            />

            <input
              type="password"
              name="password"
              value={input.password}
              onChange={EventHandle}
              placeholder="Password"
              className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none text-sm focus:ring-1 focus:ring-pink-400"
            />
            {loading ? (
              <Button>
                <Loader2  className="mr-2  h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <button
                type="submit"
                className="mt-4 w-full text-white py-2 rounded font-semibold text-sm bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 transition duration-300"
              >
                Sign Up
              </button>
            )}
          </form>
        </div>

        {/* Log in Box */}
        <div className="border border-gray-700 bg-gray-900 mt-4 p-4 sm:p-5 w-full text-center text-sm rounded-lg shadow-sm text-white">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-[#0095f6] font-medium hover:underline"
          >
            log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
