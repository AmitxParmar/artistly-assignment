import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@/types/types";

const API_URL = "https://68597bc7138a18086dfe9612.mockapi.io/api/v1"; // Ensure this matches your json-server URL

interface UseArtistsFilters {
  category?: string; // e.g. "all", "Singer", etc.
  location?: string; // e.g. "all", "New York", etc.
  priceRange?: string;
  search?: string;
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
  if (filters.search) {
    params.append("search", filters.search);
  }
  return params.toString();
}

async function fetchArtists(filters: UseArtistsFilters = {}) {
  const query = buildQueryParams(filters);
  const url = query ? `${API_URL}/artistss?${query}` : `${API_URL}/artistss`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch artists: ${text}`);
  }
  // Try to parse as JSON, but handle unexpected content
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response from server: ${text}`);
  }
  // If the data is an object with an "artists" property, use that
  if (data && Array.isArray(data.artists)) {
    return data.artists as Artist[];
  } else if (Array.isArray(data)) {
    return data as Artist[];
  } else {
    return [];
  }
}

const useArtists = (filters: UseArtistsFilters = {}) => {
  const { data, isLoading, isError, error } = useQuery<Artist[], Error>({
    queryKey: ["artists", filters],
    queryFn: () => fetchArtists(filters),
    staleTime: 10 * (60 * 1000), // 10 mins
  });

  // If the API already filters, filteredArtists is just artists
  const filteredArtists = useMemo(() => data ?? [], [data]);

  return {
    artists: data ?? [],
    filteredArtists,
    loading: isLoading,
    error: isError ? error?.message || "Unknown error" : null,
  };
};

export default useArtists;
