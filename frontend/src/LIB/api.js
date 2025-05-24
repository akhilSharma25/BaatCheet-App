import { axiosInstance } from "./axios.js"


export const signup=async(signupData)=>{
    const res=await axiosInstance.post("/auth/signup",signupData)
    return res.data
  }
export const login=async(loginData)=>{
    const res=await axiosInstance.post("/auth/login",loginData)
    return res.data
  }
export const logOut=async()=>{
    const res=await axiosInstance.post("/auth/logout")
    return res.data
  }


export const getAuthUser=async()=>{
   try {
     const res=await axiosInstance.get("/auth/me");
      return res.data
   } catch (error) {
    console.log("Error",error);
    
    return null
    
   }
}
export const getUserFriends=async()=>{
    const res=await axiosInstance.get("/user/friends");
      return res.data
}
export const getRecommendedUsers=async()=>{
    const res=await axiosInstance.get("/user/");
      return res.data
}
export const getOutGoingFriendreq=async()=>{
    const res=await axiosInstance.get("/user/outgoing-friend-requests");
      return res.data
}
export const sendFriendRequest=async(userId)=>{
    const res=await axiosInstance.post(`/user/friend-request/${userId}`,{});
    console.log("Calling API:", `/user/friend-request/${userId}`);

      return res.data
}
export const getFriendRequests=async() =>{
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}
export const acceptFriendRequest=async(requestId) =>{
  const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
  return response.data;
}
export const getStreamToken=async(requestId) =>{
  const response = await axiosInstance.get(`/chat/token`);
  return response.data;
}

