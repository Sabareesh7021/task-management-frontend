import { useMutation, useQuery } from "@tanstack/react-query";
import { taskervice } from "../Services/taskService";

export const  TaskApiHook = {
    useGetTasks: (perPage, page, status, assignedTo, search) => {
      return useQuery({
        queryKey: ['get-tasks', perPage, page, status, assignedTo, search],
        queryFn: () => taskervice.getTasks({perPage, page, status, assignedTo, search})
      });
    },
  useGetTaskById: (id) => {  
    return useQuery({
      queryKey: ['get-user', id],
      queryFn: () => taskervice.getTask(id),
      enabled: !!id 
    });
  },
  useCreateTask: () => {
    return useMutation({
      mutationFn: ({taskData}) => taskervice.createTask(taskData)
    });
  },
  
  useUpdateTask: () => {
    return useMutation({
      mutationFn: ({ id, taskData}) => taskervice.updateTask(id, taskData),
    });
  },
  
  useDeleteTask: () => {
    return useMutation({
      mutationFn: ({id}) => taskervice.deleteTask(id)
    });
  },
  useStartTask: (id) => {  
    return useMutation({
      mutationFn: ({id}) => taskervice.startTask(id)
    });
  },
};