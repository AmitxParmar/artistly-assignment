import { useEffect, useMemo, useState } from "react";
import type { Artist } from "@/types/types";

const API_URL = "http://localhost:3001"; // Ensure this matches your json-server URL

interface UseArtistsFilters {
  category?: string; // e.g. "all", "Singer", etc.
  location?: string; // e.g. "all", "New York", etc.
  priceRange?: string; // e.g. "all", "budget", "mid", "premium"
}

function buildQueryParams(filters: UseArtistsFilters) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.location && filters.location !== "all") {
    params.append("location", filters.location);
  }
  if (filters.priceRange && filters.priceRange !== "all") {
    params.append("priceRange", filters.priceRange);
  }
  return params.toString();
}

const useArtists = (filters: UseArtistsFilters = {}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const query = buildQueryParams(filters);
    const url = query ? `${API_URL}/artists?${query}` : `${API_URL}/artists`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch artists: ${text}`);
        }
        // Try to parse as JSON, but handle unexpected content
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error(`Invalid JSON response from server: ${text}`);
        }
      })
      .then((data) => {
        // If the data is an object with an "artists" property, use that
        if (data && Array.isArray(data.artists)) {
          setArtists(data.artists);
        } else if (Array.isArray(data)) {
          setArtists(data);
        } else {
          setArtists([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching artists:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [filters.category, filters.location, filters.priceRange]);

  // If the API already filters, filteredArtists is just artists
  const filteredArtists = useMemo(() => artists, [artists]);

  return { artists, filteredArtists, loading, error };
};

export default useArtists;
