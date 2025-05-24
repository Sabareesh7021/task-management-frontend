import { useMutation } from "@tanstack/react-query";
import { authService } from "../Services/authService";

export const ApiHook = {
  useLogin: () => {
    return useMutation({
      mutationFn: (body) => authService.login(body)
    });
  },
};