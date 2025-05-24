import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShipWheelIcon } from 'lucide-react'
import React, { useState } from 'react'
import { login } from "../LIB/api.js";
import { Link } from 'react-router' // ✅ correct package
import useLogin from '../hooks/useLogin.js'

const Login = () => {
   const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  // const queryClient=useQueryClient()
//  const {isPending,mutate:loginMutation,error} =useMutation({
//   mutationFn: login,
  
//   onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
//  })

 const {isPending,error,loginMutation}=useLogin()
  const handlelogin = (e) => {
    e.preventDefault()
    loginMutation(loginData)
  }

  return (
     <div className='h-screen flex items-center justify-center px-4 sm:px-6 md:px-8' data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden'>

        {/* Left Side - Signup Form */}
        <div className='w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center'>

          {/* Logo */}
          <div className='mb-6 flex items-center gap-2'>
            <ShipWheelIcon className="size-9 text-primary" />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>
              BaatCheet
            </span>
          </div>
          {
            // error messag

            error && (
              <di className="alert alert-error mb-4">
                <span>{error.response.data.message}</span>
              </di>
            )
          }

          {/* Form */}
          <form onSubmit={handlelogin} className='space-y-6'>
            <div>
              <h2 className='text-2xl font-semibold'>Welcome Back</h2>
              <p className='text-sm opacity-70 mt-1'>
                Login in to your account to continue your BaatCheet journey
              </p>
            </div>

            <div className='space-y-4'>

            
              <div className='form-control space-y-2'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type="email"
                  placeholder='example@gmail.com'
                  className='input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className='form-control w-full space-y-2'>
                <label className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input
                  type="password"
                  placeholder='********'
                  className='input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <p className='text-xs mt-1 text-gray-500'>Password must be at least 6 characters</p>
              </div>

            

              <button type='submit' className='btn btn-primary w-full'>
{isPending?<>
<span className='loading loading-spinner loading-xs'>Loading...</span>

</>:"Login In"}
              </button>

              <p className='text-sm'>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Image and Text */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-base-200 p-10 items-center justify-center flex-col text-center gap-6'>
          <img src="/videocall.png" alt="Video Call Illustration" className='w-3/4 max-w-sm' />
          <h2 className='text-2xl font-semibold'>Connect with Language Partners Worldwide</h2>
          <p className='text-sm opacity-70 max-w-md'>
            Practice conversations, make friends, and improve your language skills together.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login