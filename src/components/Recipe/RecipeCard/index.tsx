import { Heart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavourite } from "../../../hooks/useFavourite";

export interface RecipeCardProps {
  id: string;
  image?: string;
  title: string;
  description?: string;
  category?: string[];
  cookingTime?: string[];
  actions?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  image,
  category,
  title,
  description,
  cookingTime,
  actions,
  className = "",
}) => {
  const navigate = useNavigate();
  const { isFav, toggleFav, canUse } = useFavourite(id);

  const handleClick = () => {
    if (!id) {
      console.error("RecipeCard: Missing 'id' prop.");
      return;
    }
    navigate(`/recipes/${id}`);
  };

  const handleFavouriteClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    if (!canUse) {
      navigate("/login");
      return;
    }
    toggleFav();
  };

  return (
    <div
      className={`bg-white border border-gray-300 overflow-hidden flex flex-col ${className} cursor-pointer`}
      onClick={handleClick}
    >
      {image && (
        <img src={image} alt={title} className="w-full h-62 object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col border-t border-gray-300">
        {category && (
          <span className="font-playfair font-bold text-sm text-black mb-2">
            {category}
          </span>
        )}
        <h2 className="text-black text-lg font-bold mb-2 font-worksans">{title}</h2>
        {description && (
          <p className="font-worksans font-medium text-black flex-1 mb-1">
            {description}
          </p>
        )}
        {cookingTime && (
          <p className="font-worksans font-medium text-black flex-1 mt-1 mb-4">
            Cooking Duration: {cookingTime}
          </p>
        )}
        <div className="flex justify-between items-center">
          {actions && (
            <div className="text-black font-worksans hover:font-bold text-sm mt-auto">
              {actions}
            </div>
          )}
          <Heart
            onClick={handleFavouriteClick}
            className={`cursor-pointer trasition duration-100 hover:text-[#732c4e] hover:scale-110 ${isFav ? "text-primary fill-current" : "text-primary"
              }`}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
