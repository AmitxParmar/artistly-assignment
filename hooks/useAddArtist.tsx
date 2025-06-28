import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addArtist } from "@/services/artists";

export function useAddArtist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });
}
