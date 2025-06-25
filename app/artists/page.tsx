"use client";
import { memo, useMemo, Suspense } from "react";
import ArtistCard from "@/components/common/ArtistCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useArtists from "@/hooks/useArtists";

// Static options for filters
const categories = [
  "all",
  "Singer",
  "Band",
  "DJ",
  "Dancer",
  "Magician",
  "Comedian",
  "Painter",
  "Other",
];
const locations = [
  "all",
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Miami",
  "San Francisco",
  "Seattle",
  "Boston",
  "Other",
];

const priceRanges = [
  { slug: "all", value: "all", label: "All Price Ranges" },
  { value: "300", slug: "300-800", label: "$300-800" },
  { value: "350", slug: "350-700", label: "$350-700" },
  { value: "400", slug: "400-900", label: "$400-900" },
  { value: "500", slug: "500-1000", label: "$500-1000" },
  { value: "800", slug: "800-1500", label: "$800-1500" },
  { value: "1000", slug: "1000-2500", label: "$1000-2500" },
];

function ArtistsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read filters from URL params
  const searchTerm = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const locationFilter = searchParams.get("location") || "all";
  const priceSlug = searchParams.get("priceRange") || "all";
  const priceObj =
    priceRanges.find((p) => p.slug === priceSlug) || priceRanges[0];
  const priceFilter = priceObj.value;

  // Helper to update URL params
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Fetch artists using useArtists hook (filters except searchTerm)
  const { filteredArtists, loading, error } = useArtists({
    category: categoryFilter,
    location: locationFilter,
    priceRange: priceFilter,
  });

  // Filter by search term on client (since API doesn't support search)
  const visibleArtists = useMemo(() => {
    if (!searchTerm) return filteredArtists;
    const lower = searchTerm.toLowerCase();
    return filteredArtists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(lower) ||
        artist?.category?.toLowerCase().includes(lower) ||
        artist?.location?.toLowerCase().includes(lower)
    );
  }, [filteredArtists, searchTerm]);

  return (
    <div className="min-h-screen overflow-hidden max-w-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden lg:block">Back to Home</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Artistly
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign In</Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Artist
          </h1>
          <p className="text-gray-600">
            Browse through our curated collection of talented performers
          </p>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setParam("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(v) => setParam("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={locationFilter}
              onValueChange={(v) => setParam("location", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priceSlug}
              onValueChange={(v) => setParam("priceRange", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.slug} value={range.slug}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading
                ? "Loading artists..."
                : error
                ? "Error loading artists"
                : `${visibleArtists.length} artists found`}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {/* Artists Not Found */}
        {!loading && !error && visibleArtists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No artists found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

const Artists = () => (
  <Suspense
    fallback={
      <div className="text-center py-12 text-gray-400">Loading filters...</div>
    }
  >
    <ArtistsInner />
  </Suspense>
);

export default memo(Artists);
