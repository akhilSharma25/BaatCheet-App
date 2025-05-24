import { FriendRequest } from "../models/FriendRequest.js";
import { User } from "../models/User.js";

export async function getRecommnededUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { _id: { $nin: currentUser.friends || [] } }, // exclude user's friends
        { isOnBoarded: true }, // only onboarded users
      ],
    }).select("-password")

    res.status(200).json(recommendedUsers)
  } catch (error) {

    console.log("Error in getRecommnededUsers",error);
    return res.status(500).json({message:"Internal Server Error"})
    
  }
}
export async function getMyFriend(req, res) {
    try {
        const user=await User.findById(req.user.id).select("friends").populate("friends","fullname profilePic nativeLanguage learningLanguage")
        
        res.status(200).json(user.friends)
    } catch (error) {
        
    console.log("Error in getMyFriend",error);
    return res.status(500).json({message:"Internal Server Error"})
    
    }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id.toString();  // String mein convert kar diya
    const { id: recipientId } = req.params;
    console.log("myId:", myId);
    console.log("recipientId:", recipientId);

    // Apne aap ko friend request na bhej paayein
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Recipient ke friends ke IDs ko string mein convert kar lo taaki includes sahi kaam kare
    const recipientFriendIds = recipient.friends.map(id => id.toString());
    console.log("recipientFriendIds:", recipientFriendIds);

    if (recipientFriendIds.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // Check karo agar already friend request bheja hua hai dono taraf se
    const existingReq = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    console.log("existingReq:", existingReq);

    if (existingReq) {
      return res.status(400).json({ message: "A friend request already exists between you and this user" });
    }

    // Friend request create karo
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);

  } catch (error) {
    console.log("Error in FriendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function acceptFriendRequest(req,res) {
  try {


    const {id:requestId}=req.params
    console.log("req",requestId);
    
    
    const friendRequest=await FriendRequest.findById(requestId)
      if(!friendRequest){
          return res.status(404).json({message:"Friend request not found "})

    }
    //verify the current user is the recipient

  if (!friendRequest.recipient.equals(req.user._id)) {
  return res.status(403).json({ message: "You are not authorized to accept this request" });
}


    friendRequest.status="accepted";
    await friendRequest.save()

    //add each user to the other friend array
    await User.findByIdAndUpdate(friendRequest.sender,{
      $addToSet:{friends:friendRequest.recipient}
    })
    await User.findByIdAndUpdate(friendRequest.recipient,{
      $addToSet:{friends:friendRequest.sender}
    })

        return res.status(201).json({message:"Friend request accepted"})

    
  } catch (error) {
     console.log("Error in AcceptFriendRequest",error);
    return res.status(500).json({message:"Internal Server Error"})
    
  }
}

export async function getFriendRequest(req,res) {
  try {
    
    const incomingReq=await FriendRequest.find({
      recipient:req.user._id,
      status:"pending",
    }).populate("sender","fullname profilePic nativeLanguage learningLanguage")

    const acceptReq=await FriendRequest.find({
      sender:req.user._id,
      status:"accepted",
    }).populate("recipient","fullname profilePic ")

    res.status(200).json({incomingReq,acceptReq})
  } catch (error) {
    console.log("Error in getFriendRequest",error);
    return res.status(500).json({message:"Internal Server Error"})
  }
}


export async function getOutgoingFriendRequest(req,res) {
  try {
    
    const outgoingReq=await FriendRequest.find({
      sender:req.user._id,
      status:"pending"
    }).populate("recipient","fullname profilePic nativeLanguage learningLangugae")

    res.status(200).json(outgoingReq)
  } catch (error) {
     console.log("Error in getOutgoingFriendRequest",error);
    return res.status(500).json({message:"Internal Server Error"})
    
  }
  
}