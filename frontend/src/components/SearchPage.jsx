import React, { useState } from "react";
import useSearchUsers from "@/Hook/useSearchUsers";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const searchUsers = useSearchUsers();

  const handleSearch = async () => {
    if (!search.trim()) return;
    const users = await searchUsers(search.trim());
    setResults(users);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
      >
        Search
      </button>

      <div className="mt-4">
        {results.map((user) => (
          <div key={user._id} className="border p-2 rounded mb-2">
            <p>👤 {user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
