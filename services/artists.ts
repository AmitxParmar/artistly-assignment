import { Artist } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://68597bc7138a18086dfe9612.mockapi.io/api/v1/artistss";

async function addArtist(artistData: Artist) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artistData),
  });
  if (!response.ok) {
    throw new Error("Failed to register artist");
  }
  return await response.json();
}

export function useAddArtist() {
  return useMutation({
    mutationFn: addArtist,
  });
}
