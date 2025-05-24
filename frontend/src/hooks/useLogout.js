import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logOut } from '../LIB/api';

const useLogout = () => {
   const queryClient = useQueryClient();
  
    const { mutate: logoutMutation,isPending,error } = useMutation({
      mutationFn: logOut,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return {logoutMutation,isPending,error}
}

export default useLogout