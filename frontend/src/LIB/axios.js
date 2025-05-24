import axios from "axios"


const BASE_URL="https://baatcheet-app-aemv.onrender.com/api"
export const axiosInstance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})
