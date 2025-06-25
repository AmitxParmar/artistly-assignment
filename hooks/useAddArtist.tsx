import { useMutation } from "@tanstack/react-query";
import { addArtist } from "@/services/artists";

export function useAddArtist() {
  return useMutation({
    mutationFn: addArtist,
  });
}
