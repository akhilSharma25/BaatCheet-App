import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest,getOutgoingFriendRequest, getFriendRequest,getMyFriend, getRecommnededUsers, sendFriendRequest } from "../controllers/user.controllers.js";

const router=express.Router()

//apply auth middleware to all routes
router.use(protectRoute)
router.get("/",getRecommnededUsers)
router.get("/friends",getMyFriend)
router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)

router.get("/friend-requests",getFriendRequest)
router.get("/outgoing-friend-requests",getOutgoingFriendRequest)
router.get("/:", (req, res) => { // Error: Missing parameter name
  res.send("Invalid route");
});
export default router