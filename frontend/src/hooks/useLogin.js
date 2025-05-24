import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { login } from '../LIB/api'

const useLogin = () => {
  const queryClient=useQueryClient()

     const {isPending,mutate,error} =useMutation({
  mutationFn: login,
  
  onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
 })

 return {error,isPending,loginMutation:mutate}
  
}

export default useLogin