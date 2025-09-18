import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "../../types";
import Button from "../Button";
import { useRef } from "react";

interface Props {
  categories: Category[];
  selected: string; //name
  allCategories?: boolean;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  allCategories = true,
  onChange,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Handle scroll button
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 240; // 240px for scrolling
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-black md:text-2xl text-lg font-bold font-playfair">
          Browse by <span className="text-primary">Category</span>
        </h2>
        
      </div>

      <div className="relative">
        {/* Turn left */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className= "text-black absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 transition duration-200 hover:scale-120"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto flex-nowrap scrollbar-hide px-8"
        >
          {/* category selected background */}
          {allCategories && (
            <Button
              variant={selected === "all" ? "primary" : "secondary"}
              onClick={() => onChange("all")}
              className={`shrink-0 whitespace-nowrap rounded-full ${selected === "all" ? "bg-pink-600 hover:bg-pink-700" : ""
                }`}
            >
              All
            </Button>
          )}

          {/* List category name takes form mock data */}
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selected === String(cat.id) ? "primary" : "secondary"}
              onClick={() => onChange(String(cat.id))}
              className={`shrink-0 whitespace-nowrap rounded-full ${selected === String(cat.id) ? "bg-pink-600 hover:bg-pink-700" : ""
                }`}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Turn right */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className= "text-black absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white transition duration-200 rounded-full p-1 hover:scale-120"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div >
  );
}
