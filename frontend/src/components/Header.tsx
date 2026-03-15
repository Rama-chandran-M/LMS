import React from "react";

import { colorPallette } from "../assets/colorPalette";

const Header = () => {
  return (
    <header className="border-b border-white/[0.07] bg-[#080c14]/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="">
          <span
            className="text-sm font-bold text-white/80 tracking-wide hidden sm:block"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            LMS
          </span>
        </div>
        <nav className="flex items-center gap-1">
          {["My Courses"].map((item) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${
                      item === "My Courses"
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
