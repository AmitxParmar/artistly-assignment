import { Artist } from "@/types/types";

const BASE_URL = "https://68597bc7138a18086dfe9612.mockapi.io/api/v1/artists";

export async function addArtist(artistData: Artist) {
  try {
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
  } catch (error) {
    console.log(error);
  }
}
