import React from 'react'
import { getAuthUser } from '../LIB/api'
import { useQuery } from '@tanstack/react-query'

const useAuthUser = () => {
 
      const authUser=useQuery({
    queryKey:["authUser"],
    queryFn:getAuthUser,
    retry:false //
  })

  return {isLoading:authUser.isLoading,authUser:authUser.data?.user}
}

export default useAuthUser