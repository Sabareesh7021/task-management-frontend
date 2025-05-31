import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "../Services/userService";

export const UserApiHook = {
  useGetUsers: (perPage, page, search, role = "", show=true) => {
      return useQuery({
        queryKey: ['get-users', perPage, page, search, role],
        queryFn: () => userService.getUsers({perPage, page, search, role}),
        enabled: show && !!perPage && !!page, 
      });
    },
  useGetUserById: (id) => {  
    return useQuery({
      queryKey: ['get-user', id],
      queryFn: () => userService.getUser(id)
    });
  },
  useCreateUser: () => {
    return useMutation({
      mutationFn: ({userData}) => userService.createUser(userData)
    });
  },
  
  useUpdateUser: () => {
    return useMutation({
      mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
    });
  },
  
  useDeleteUser: () => {
    return useMutation({
      mutationFn: ({id}) => userService.deleteUser(id)
    });
  }
};