// import React, { useEffect, useState } from "react";
// import {
//   UsersIcon,
//   MapPinIcon,
//   CheckCircleIcon,
//   UserPlus2Icon,
// } from "lucide-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getRecommendedUsers,
//   getUserFriends,
//   getOutGoingFriendreq,
//   sendFriendRequest,
// } from "../LIB/api";
// import { Link } from "react-router";
// import NofriendsFound from "./NofriendsFound";
// import FriendCard, { getLanguageFlag } from "./FriendCard";

// const HomePage = () => {
//   const queryClient = useQueryClient();
//   const [outGoingreqId, setOutGoingreqId] = useState(new Set());

//   const {
//     data: friends = [],
//     isLoading: loadingFriends,
//   } = useQuery({
//     queryKey: ["friends"],
//     queryFn: getUserFriends,
//   });

//   const {
//     data: recommendedUsers = [],
//     isLoading: loadingUsers,
//   } = useQuery({
//     queryKey: ["users"],
//     queryFn: getRecommendedUsers,
//   });

//   const {
//     data: outGoingFriendreq = [],
//   } = useQuery({
//     queryKey: ["outGoingFriendreq"],
//     queryFn: getOutGoingFriendreq,
//   });

//   const { mutate: sendRequestMutation, isPending } = useMutation({
//     mutationFn: sendFriendRequest,
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["outGoingFriendreq"] }),
//   });

//   useEffect(() => {
//     const outGoingIds = new Set();
//     if (outGoingFriendreq.length > 0) {
//       outGoingFriendreq.forEach((req) => {
//         if (req.recipient && req.recipient._id) {
//           outGoingIds.add(req.recipient._id);
//         }
//       });
//     }
//     setOutGoingreqId(outGoingIds);
//   }, [outGoingFriendreq]);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto space-y-10">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//             Your Friends
//           </h2>
//           <Link to="/notifications" className="btn btn-outline btn-sm">
//             <UsersIcon className="mr-2 size-4" />
//             Friend Requests
//           </Link>
//         </div>

//         {loadingFriends ? (
//           <div className="flex justify-center py-12">
//             <span className="loading loading-spinner loading-lg" />
//           </div>
//         ) : friends.length === 0 ? (
//           <NofriendsFound />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {friends.map((friend) => (
//               <FriendCard key={friend._id} friend={friend} />
//             ))}
//           </div>
//         )}

//         <section>
//           <div className="mb-6 sm:mb-8">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//                   Meet New Learners
//                 </h2>
//                 <p className="opacity-70">
//                   Discover perfect language exchange partners based on your
//                   profile
//                 </p>
//               </div>
//             </div>
//           </div>

//           {loadingUsers ? (
//             <div className="flex justify-center py-12">
//               <span className="loading loading-spinner loading-lg" />
//             </div>
//           ) : recommendedUsers.length === 0 ? (
//             <div className="card bg-base-200 p-6 text-center rounded-lg">
//               <h3 className="font-semibold text-lg mb-2">
//                 No recommendations available
//               </h3>
//               <p className="text-base-content opacity-70">
//                 Check back later for new friends!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recommendedUsers.map((user) => {
//                 const hasRequestBeenSent = outGoingreqId.has(user._id);

//                 return (
//                   <div
//                     key={user._id}
//                     className="card bg-base-200 hover:shadow-lg transition-all duration-300 rounded-lg"
//                   >
//                     <div className="card-body p-5 space-y-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
//                           <img
//                             src={user.profilePic}
//                             alt={user.fullname}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-lg">{user.fullname}</h3>
//                           {user.location && (
//                             <div className="flex items-center text-xs opacity-70 mt-1">
//                               <MapPinIcon className="size-3 mr-1" />
//                               {user.location}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Languages with flags */}
//                       <div className="flex flex-wrap gap-1.5">
//                         <span className="badge badge-secondary">
//                           {getLanguageFlag(user.nativeLanguage)}
//                           Native: {capitalize(user.nativeLanguage)}
//                         </span>
//                         <span className="badge badge-outline">
//                           {getLanguageFlag(user.learningLanguage)}
//                           Learning: {capitalize(user.learningLanguage)}
//                         </span>
//                       </div>

//                       {user.bio && (
//                         <p className="text-sm opacity-70">{user.bio}</p>
//                       )}

//                       {/* Action button */}
//                       <button
//                         className={`btn w-full mt-2 ${
//                           hasRequestBeenSent
//                             ? "btn-disabled cursor-not-allowed"
//                             : "btn-primary"
//                         }`}
//                         onClick={() => sendRequestMutation(user._id)}
//                         disabled={hasRequestBeenSent || isPending}
//                       >
//                         {hasRequestBeenSent ? (
//                           <>
//                             <CheckCircleIcon className="size-4 mr-2" />
//                             Request Sent
//                           </>
//                         ) : (
//                           <>
//                             <UserPlus2Icon className="size-4 mr-2" />
//                             Send Friend Request
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// // Helper function: capitalize first letter
// export const capitalize = (str) =>
//   str.charAt(0).toUpperCase() + str.slice(1);
import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserPlus2Icon,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecommendedUsers,
  getUserFriends,
  getOutGoingFriendreq,
  sendFriendRequest,
} from "../LIB/api";
import { Link } from "react-router";
import NofriendsFound from "./NofriendsFound";
import FriendCard, { getLanguageFlag } from "./FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingreqId, setOutGoingreqId] = useState(new Set());

  const {
    data: friends = [],
    isLoading: loadingFriends,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const {
    data: recommendedUsers = [],
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const {
    data: outGoingFriendreq = [],
  } = useQuery({
    queryKey: ["outGoingFriendreq"],
    queryFn: getOutGoingFriendreq,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outGoingFriendreq"] });
    },
  });

  useEffect(() => {
    const outGoingIds = new Set(outGoingFriendreq.map(req => req.recipient?._id).filter(id => id));
    setOutGoingreqId(outGoingIds);
  }, [outGoingFriendreq]);

  const handleSendFriendRequest = (userId) => {
    if (!outGoingreqId.has(userId) && !isPending) {
      sendRequestMutation(userId);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
      <div className="container mx-auto space-y-10">
        {/* Header */}
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

        {/* Friends Section */}
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

        {/* Recommended Users Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Meet New Learners
            </h2>
            <p className="text-base-content/70 mt-1">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-base-content">
                No recommendations available
              </h3>
              <p className="text-base-content/70 mt-2">
                Check back later for new friends!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outGoingreqId.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={user.profilePic}
                            alt={user.fullname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-base-content">
                            {user.fullname}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-base-content/70 mt-1">
                              <MapPinIcon className="w-3 h-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-xs">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm text-base-content/70 line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      {/* Action button */}
                      <button
                        key={`btn-${user._id}`}
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent
                            ? "btn-disabled cursor-not-allowed opacity-50"
                            : "btn-primary"
                        } flex items-center gap-2`}
                        onClick={() => handleSendFriendRequest(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus2Icon className="w-4 h-4" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

// Helper function: capitalize first letter
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);