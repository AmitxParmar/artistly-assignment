export interface Artist {
  id?: number;
  name: string;
  category?: string;
  bio?: string;
  priceRange?: string;
  location?: string;
  image?: string;
  rating?: number;
  completedEvents?: number;
  languages?: string[];
  verified?: boolean;
}
