"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface BannerProps {
  message: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  close: boolean;
}

export const Banner = ({
  message = "Introducing Aceternity UI Pro - 70+ premium component packs and templates to build amazing websites.",
  link = "/",
  backgroundColor = "bg-[#1D4ED8]",
  textColor = "text-white",
  close = true,
}: BannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`w-full ${backgroundColor} ${textColor}`}>
      <div className="flex items-center justify-center px-4 py-2 relative">
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left md:text-center text-sm font-medium hover:underline "
        >
          {message}
        </Link>
        {close && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 hover:opacity-75 transition-opacity"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
