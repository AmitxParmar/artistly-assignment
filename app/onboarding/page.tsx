"use client";
import { memo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useAddArtist } from "@/hooks/useAddArtist";

interface OnboardingFormData {
  name: string;
  bio: string;
  category: string;
  languages: string[];
  priceRange: string;
  location: string;
  profileImage?: FileList;
  completeEvents?: number; // Added for completeEvents
}

const Onboarding = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingFormData>();

  const categories = [
    "Singer",
    "Dancer",
    "DJ",
    "Speaker",
    "Musician",
    "Comedian",
    "Magician",
    "Poet",
    "Band",
    "Solo Artist",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Mandarin",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Russian",
  ];

  const priceRange = [
    "$200-400",
    "$400-600",
    "$600-800",
    "$800-1200",
    "$1200-1800",
    "$1800-2500",
    "$2500+",
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategory: string;

    if (checked) {
      // If the user is checking a new category, set it as the only selected category
      newCategory = category;
    } else {
      // If the user is unchecking the selected category, clear the selection
      newCategory = "";
    }

    setSelectedCategory(newCategory);
    setValue("category", newCategory);
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    let newLanguages;
    if (checked) {
      newLanguages = [...selectedLanguages, language];
    } else {
      newLanguages = selectedLanguages.filter((l) => l !== language);
    }
    setSelectedLanguages(newLanguages);
    setValue("languages", newLanguages);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if the click is directly on the container, not on the input itself
    if (fileInputRef.current && e.target === e.currentTarget) {
      fileInputRef.current.click();
    }
  };

  // Use the useAddArtist hook
  const addArtistMutation = useAddArtist();

  // submit data to the json server
  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);

    // Generate a random numeric id for the artist
    const randomId = Math.floor(Math.random() * 1_000_000_000);

    // Prepare artist data with random numeric id
    const artistData = {
      ...data,
      id: randomId,
      category: selectedCategory,
      languages: selectedLanguages,
      profileImage: uploadedImage,
      completeEvents: data.completeEvents ?? 0, // Default to 0 if not provided
    };

    try {
      // Use the useAddArtist mutation
      const artist = await addArtistMutation.mutateAsync(artistData);
      console.log(artist);

      console.log("Artist Registration Data:", artistData);

      toast("Registration Successful! 🎉", {
        description:
          "Welcome to Artistly! Your profile has been created and is pending approval.",
      });

      setIsSubmitting(false);

      // Redirect to success page or home
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast("Registration Failed", {
        description:
          "There was an error creating your profile. Please try again.",
      });
      console.error("Error adding artist:", error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondarys mb-2">
            Join as an Artist
          </h1>
          <p className="text-muted-foreground">
            Create your profile and start receiving booking requests
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Artist Registration</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      {...register("location", {
                        required: "Location is required",
                      })}
                      className="mt-1"
                      placeholder="City, State"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    {...register("bio", {
                      required: "Bio is required",
                      minLength: {
                        value: 50,
                        message: "Bio must be at least 50 characters",
                      },
                    })}
                    className="mt-1"
                    placeholder="Tell us about your experience, style, and what makes you unique..."
                    rows={4}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bio.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Current length: {watch("bio")?.length || 0} characters
                    (minimum 50)
                  </p>
                </div>
              </div>

              {/* Complete Events */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Completed Events
                </h3>
                <div>
                  <Label htmlFor="completeEvents">
                    Number of Events Completed (Optional)
                  </Label>
                  <Input
                    id="completeEvents"
                    type="number"
                    min={0}
                    step={1}
                    {...register("completeEvents", {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Number of events cannot be negative",
                      },
                    })}
                    className="mt-1"
                    placeholder="e.g. 25"
                  />
                  {errors.completeEvents && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.completeEvents.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Let us know how many events you have completed so far.
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Performance Categories *
                </h3>
                <div>
                  <Label>Select your performance category</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category}
                          checked={selectedCategory === category}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={category}
                          className="text-sm font-normal"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategory.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      Please select at least one category
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      key={selectedCategory}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      {selectedCategory}
                      <button
                        type="button"
                        onClick={() =>
                          handleCategoryChange(selectedCategory, false)
                        }
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Languages Spoken *
                </h3>
                <div>
                  <Label>Select languages you can perform in</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                    {languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={language}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={(checked) =>
                            handleLanguageChange(language, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={language}
                          className="text-sm font-normal"
                        >
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedLanguages.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      Please select at least one language
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedLanguages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                        <button
                          type="button"
                          onClick={() => handleLanguageChange(language, false)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee Range */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Pricing
                </h3>
                <div>
                  <Label htmlFor="priceRange">Fee Range per Event *</Label>
                  <Select
                    onValueChange={(value) => setValue("priceRange", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your fee range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRange.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!watch("priceRange") && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a fee range
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Profile Image
                </h3>
                <div>
                  <Label htmlFor="profileImage">
                    Upload Profile Picture (Optional)
                  </Label>
                  <div className="mt-3">
                    {uploadedImage ? (
                      <div className="relative inline-block">
                        <Image
                          src={uploadedImage}
                          alt="Profile preview"
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative"
                        style={{ position: "relative" }}
                        onClick={handleImageContainerClick}
                        tabIndex={0}
                        role="button"
                        aria-label="Upload Profile Picture"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (fileInputRef.current)
                              fileInputRef.current.click();
                          }
                        }}
                      >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 pointer-events-none" />
                        <p className="text-gray-600 mb-2 pointer-events-none">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-400 text-sm pointer-events-none">
                          PNG, JPG up to 5MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          tabIndex={-1}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    selectedCategory.length === 0 ||
                    selectedLanguages.length === 0
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Your Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Complete Registration</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default memo(Onboarding);
