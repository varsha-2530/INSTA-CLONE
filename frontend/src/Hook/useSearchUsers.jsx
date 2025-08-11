import axios from "axios";

const useSearchUsers = () => {
  const searchUsers = async (searchText) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/search?query=${searchText}`,
        {
          withCredentials: true,
        }
      );
      return data.users;
    } catch (error) {
      console.error("Search users error:", error?.response?.data || error.message);
      return [];
    }
  };

  return searchUsers;
};

export default useSearchUsers;
