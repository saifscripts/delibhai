import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUser, removeAvatar } from "../services/profile.service";

export const useUser = (id) => {
  const result =  useQuery({
    queryKey: ["USER"],
    queryFn: async () => await getUser(id),
  });

  const user = result?.data?.data;

  return { ...result, user };
};

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["REMOVE_AVATAR"],
    mutationFn: removeAvatar,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["ME"] });
        queryClient.invalidateQueries({ queryKey: ["USER"] });
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
