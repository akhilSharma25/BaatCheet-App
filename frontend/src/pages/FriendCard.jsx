import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants/index.js";

const FriendCard = ({ friend }) => {
  // console.log(friend);
  
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow rounded-2xl">
      <div className="card-body p-4 space-y-3">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={friend.profilePic} alt={friend.fullname} />
            </div>
          </div>
          <h3 className="font-semibold text-base sm:text-lg truncate">{friend.fullname}</h3>
        </div>

        {/* LANGUAGE BADGES */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="badge badge-secondary badge-sm flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitalize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline badge-sm flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitalize(friend.learningLanguage)}
          </span>
        </div>

        {/* MESSAGE BUTTON */}
        <Link to={`/chat/${friend._id}`} className="btn btn-sm btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

function capitalize(str) {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="inline-block h-3 w-auto mr-1"
      />
    );
  }

  return null;
}
