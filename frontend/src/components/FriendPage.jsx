// src/pages/FriendsPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import FriendCard from "../pages/FriendCard";
import NofriendsFound from "../pages/NofriendsFound";
import { getUserFriends } from "../LIB/api";

const FriendsPage = () => {
  const {
    data: friends = [],
    isLoading: loadingFriends,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Your Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-outline btn-sm flex items-center gap-2 border-base-300 hover:bg-base-300 hover:text-base-content"
          >
            <UsersIcon className="w-4 h-4" />
            Friend Requests
          </Link>
        </div>
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <NofriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
