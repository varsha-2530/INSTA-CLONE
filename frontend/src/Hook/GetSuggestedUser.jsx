// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setSuggestedUser } from "@/Redux/authSlice";

// const useSuggestedUsers = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchSuggestedUsers = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:2530/api/user/getSuggestedUsers",
//           { withCredentials: true }
//         );

//         if (Array.isArray(data?.users)) {
//           dispatch(setSuggestedUser(data.users));
//         } else {
//           dispatch(setSuggestedUser([]));
//         }
//       } catch (error) {
//         console.error("Get suggested users error:", error?.message, error);
//         dispatch(setSuggestedUser([]));
//       }
//     };

//     fetchSuggestedUsers();
//   }, [dispatch]);
// };

// export default useSuggestedUsers;


import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSuggestedUser } from "@/Redux/authSlice";

const GetSuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2530/api/user/getSuggestedUsers",
          { withCredentials: true }
        );

        // ✅ backend से { users: [...] } आता है
        if (Array.isArray(data?.users)) {
          dispatch(setSuggestedUser(data.users));
        } else {
          dispatch(setSuggestedUser([]));
        }
      } catch (error) {
        console.error("Get suggested users error:", error?.message, error);
        dispatch(setSuggestedUser([]));
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default GetSuggestedUser;
