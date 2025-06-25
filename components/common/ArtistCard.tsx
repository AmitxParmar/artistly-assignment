import React from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users } from "lucide-react";
import Image from "next/image";

type Props = {
  artist: {
    id: number;
    name: string;
    category: string;
    bio: string;
    priceRange: string;
    location: string;
    image: string;
    rating: number;
    completedEvents: number;
    languages: string[];
    verified: boolean;
  };
};

const ArtistCard = ({ artist }: Props) => {
  return (
    <Card
      key={artist.id}
      className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
    >
      <CardContent className="p-0">
        <div className="relative">
          <Image
            height={200}
            width={200}
            src={artist.image}
            alt={artist.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {artist.verified && (
            <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
              Verified
            </Badge>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {artist.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{artist.rating}</span>
            </div>
          </div>

          <Badge variant="secondary" className="mb-3">
            {artist.category}
          </Badge>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {artist.bio}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {artist.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {artist.completedEvents} events completed
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {artist.priceRange}
              </div>
              <div className="text-sm text-gray-500">per event</div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Ask for Quote
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Languages:</div>
            <div className="flex flex-wrap gap-1">
              {artist.languages.map((lang, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
