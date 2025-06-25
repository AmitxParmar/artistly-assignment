import { Artist } from "@/types/types";

export async function registerArtist(artistData: Artist) {
  try {
    const response = await fetch("http://localhost:3001/artists", {
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
