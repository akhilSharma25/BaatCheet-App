import React from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logOut } from '../LIB/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatpage = location.pathname?.startsWith("/chat");

//   const queryClient = useQueryClient();

//   const { mutate: logoutMutation } = useMutation({
//     mutationFn: logOut,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
//   });

const {logoutMutation}=useLogout()

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Show logo only on Chat Page */}
          {isChatpage ? (
            <div className="flex items-center gap-2.5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-8 text-primary" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  BaatCheet
                </span>
              </Link>
            </div>
          ) : (
            <div /> // Empty div to keep spacing same
          )}

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Button */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* User Avatar */}
            <div className="avatar tooltip tooltip-bottom" data-tip={authUser?.fullname}>
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
