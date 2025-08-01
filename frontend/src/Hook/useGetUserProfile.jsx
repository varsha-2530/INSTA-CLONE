import { setUserProfile } from "@/Redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function useGetUserProfile(userId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return; // current user ke liye skip karo (wo auth.user se aayega)

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `/api/user/getProfile/${userId}`,
          { withCredentials: true }
        );
        if (res.data.user) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        const msg =
          error?.response?.data?.errorMsg ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        toast.error(msg);
      }
    };
    fetchUserProfile();
  }, [userId, dispatch]);
}
