"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

const Nav = () => {
  const router = useRouter();

  return (
    <nav className="bg-card/40 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Artistly
            </Button>
            <ThemeSwitcher />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/artists")}
              className="text-muted-foreground  hover:text-purple-600 transition-colors"
            >
              Browse Artists
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              className="text-muted-foreground hover:text-purple-600 transition-colors"
            >
              Join as Artist
            </Button>
            <Button variant="outline">Sign In</Button>
            <Button className="bg-gradient-to-r text-white from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
