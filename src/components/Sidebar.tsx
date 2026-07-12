import React from "react";
import { Pin, Star, ShieldAlert, Sparkles, FolderPlus, ListFilter, Compass } from "lucide-react";
import { ToolDefinition, FavoriteItem } from "../types";
import * as Icons from "lucide-react";

interface SidebarProps {
  tools: ToolDefinition[];
  activeToolId: string | null;
  onSelectTool: (id: string | null) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (toolId: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function Sidebar({
  tools,
  activeToolId,
  onSelectTool,
  favorites,
  onToggleFavorite,
  selectedCategory,
  onSelectCategory
}: SidebarProps) {
  
  const categories = ["All", "AI", "PDF", "Image", "Developer", "Temp Mail", "URL", "Calculator"];

  // Helper to load dynamic icons safely
  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="w-4 h-4 shrink-0" /> : <ListFilter className="w-4 h-4 shrink-0" />;
  };

  const isFavorited = (toolId: string) => favorites.some((f) => f.toolId === toolId);

  return (
    <div id="navigation-rail" className="space-y-5">
      
      {/* Category selector pill grid */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2">
        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">Tool Categories</h4>
        <div className="flex flex-wrap lg:flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onSelectTool(null); // return to lists if switching categories
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition-all flex items-center justify-between gap-2 cursor-pointer w-full ${selectedCategory === cat && !activeToolId ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
            >
              <span className="flex items-center gap-1.5">
                {cat === "All" ? (
                  <>
                    <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    Explore All
                  </>
                ) : (
                  cat
                )}
              </span>
              <span className="text-[9px] font-mono opacity-60">
                {cat === "All" ? tools.length : tools.filter((t) => t.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned shortcuts panel */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500 shrink-0" />
          Pinned Collection
        </h4>

        <div className="space-y-1.5">
          {favorites.length > 0 ? (
            favorites.map((fav) => {
              const matchedTool = tools.find((t) => t.id === fav.toolId);
              if (!matchedTool) return null;

              return (
                <div
                  key={fav.id}
                  className={`group px-2.5 py-1.5 rounded-lg text-xs flex justify-between items-center transition-all ${activeToolId === matchedTool.id ? "bg-neutral-950 text-white" : "text-neutral-300 hover:bg-neutral-850"}`}
                >
                  <button
                    onClick={() => onSelectTool(matchedTool.id)}
                    className="flex items-center gap-2 text-left truncate flex-grow cursor-pointer"
                  >
                    {renderIcon(matchedTool.icon)}
                    <span className="truncate font-medium">{matchedTool.name}</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(matchedTool.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-neutral-900 text-amber-500 hover:text-neutral-400 transition-all cursor-pointer"
                    title="Remove shortcut"
                  >
                    <Pin className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-4 text-center text-[10px] text-neutral-600 font-sans">
              No pinned tools yet. Pinned favorites will group into collections here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
