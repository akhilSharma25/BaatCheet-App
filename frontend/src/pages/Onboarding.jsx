import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../LIB/api.js";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    profilePic: authUser?.profilePic || "",
    location: authUser?.location || "",
  });

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const id = Math.floor(Math.random() * 100) + 1;
    const url = `https://avatar.iran.liara.run/public/${id}.png`;
    setFormState({ ...formState, profilePic: url });
    toast.success("Random avatar generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="bg-base-200 rounded-2xl shadow-lg w-full max-w-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-base-content">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-base-300 overflow-hidden">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="text-base-content opacity-40 size-10" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-accent btn-sm"
            >
              <ShuffleIcon className="size-4 mr-1" />
              Generate Avatar
            </button>
          </div>

          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={formState.fullname}
              onChange={(e) =>
                setFormState({ ...formState, fullname: e.target.value })
              }
              placeholder="Your full name"
              className="input input-bordered w-full"
            />
          </div>

          {/* Bio */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
              placeholder="Tell something about yourself"
              className="textarea textarea-bordered w-full h-24"
            />
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Native Language</span>
              </label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    nativeLanguage: e.target.value,
                  })
                }
                className="select select-bordered w-full"
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`n-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Learning Language</span>
              </label>
              <select
                value={formState.learningLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    learningLanguage: e.target.value,
                  })
                }
                className="select select-bordered w-full"
              >
                <option value="">Select a learning language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`l-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <MapPinIcon className="absolute top-[50%] left-3 -translate-y-1/2 size-5 text-base-content opacity-70" />
            <input
              type="text"
              value={formState.location}
              onChange={(e) =>
                setFormState({ ...formState, location: e.target.value })
              }
              placeholder="City, Country"
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {!isPending ? (
              <>
                <ShipWheelIcon className="size-5" />
                Complete Onboarding
              </>
            ) : (
              <>
                <LoaderIcon className="size-5 animate-spin" />
                Onboarding...
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
