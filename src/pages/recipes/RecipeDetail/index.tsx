import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Rating, Recipe } from "../../../types";
//import Button from "../../../components/Button";
import {
  Beef,
  Flame,
  Heart,
  ChefHat,
  Sprout,
  Droplet,
  Users,
  Clock,
  Zap,
  Star,
} from "lucide-react";
import RatingForm from "../../../components/RatingForm";
import useAuth from "../../../hooks/useAuth";
import { useFavourite } from "../../../hooks/useFavourite";

// remove URLs and symbols
const textInput = (t: string) =>
  t
    .replace(/(https?:\/\/|www\.)\S+/gi, "")
    .replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export default function RecipeDetail() {
  const { id } = useParams();
  const recipeId = Number(id);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe>();
  //const [ratings, setRatings] = useState<Rating[]>([]);
  const { isFav, toggleFav, canUse } = useFavourite(recipeId);
  // const [ratings, setRatings] = useState<Rating[]>([]);
  const [serverRatings, setServerRatings] = useState<Rating[]>([]);
  const [localRatings, setLocalRatings] = useState<Rating[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res as Recipe);
        console.log(res);
      });
  }, [id]);

  useEffect(() => {
    if (!recipeId) return;
    fetch(`/api/recipes/${recipeId}/ratings`)
      .then((res) => res.json())
      .then((res) => setServerRatings(res as Rating[]))
      .catch(() => setServerRatings([]));
  }, [recipeId]);

  useEffect(() => {
    if (!recipeId) return;
    try {
      const raw = localStorage.getItem(`ratings:${recipeId}`);
      setLocalRatings(raw ? (JSON.parse(raw) as Rating[]) : []);
    } catch {
      setLocalRatings([]);
    }
  }, [recipeId]);

  const allRatings: Rating[] = useMemo(() => {
    return [...localRatings, ...serverRatings].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }, [localRatings, serverRatings]);

  const openForm = () => setShowForm(true);
  const cancelForm = () => {
    setShowForm(false);
    setStars(5);
    setComment("");
  };

  const handleSubmit = () => {
    const clean = textInput(comment);
    if (!clean) {
      alert("Please enter a valid comment (no links or special symbols).");
      return;
    }

    const newItem: Rating = {
      id: Date.now(),
      recipeId,
      userId: 0, 
      user: user?.email ? user.email : "Guest User",
      rating: stars,
      comment: clean,
      createdAt: new Date().toISOString(),
    };

    const next = [newItem, ...localRatings];
    setLocalRatings(next);
    localStorage.setItem(`ratings:${recipeId}`, JSON.stringify(next));

    cancelForm();
  };

  // Toggle favorite
  const handleFavToggle = () => {
    if (!canUse) {
      navigate("/login");
      return;
    }
    toggleFav();
  };

  return (
    <div className="text-black font-worksans w-full">
      {/* Recipe Part */}
      <section className="px-6 md:px-20 xl:px-32 bg-white pt-8">
        <p className="mb-2 text-sm md:text-base font-playfair font-bold text-black">
          {recipe?.category}
        </p>

        <div className="flex items-center justify-between gap-3">
          <h1 className="flex-1 font-playfair font-bold text-2xl sm:text-4xl md:text-5xl xl:text-6xl leading-tight break-words hyphens-auto">
            {recipe?.title}
          </h1>

          <Heart
            onClick={handleFavToggle}
            className={`w-7 h-7 sm:w-9 sm:h-9 shrink-0 transition duration-100 hover:text-[#732c4e] hover:scale-110 ${
              isFav ? "text-primary fill-current" : "text-primary"
            }`}
          />
        </div>

        {/* author */}
        <p className="mt-3 mb-3 flex items-center gap-2 text-gray">
          <ChefHat className="text-sm md:text-base text-primary" />
          <span className="text-sm md:text-base font-worksans italic">
            {recipe?.author}
          </span>
        </p>

        <div className="mb-3 flex flex-row space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 sm:w-7 sm:h-7 ${
                index < Math.round(recipe?.rating ?? 0)
                  ? "text-amber-300 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* description */}
        <p className="text-sm md:text-base text-gray">
          {recipe?.longDescription}
        </p>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe?.tags.map((tag, i) => (
            <span
              key={i}
              className="
          inline-flex items-center
          rounded-full bg-cream text-primary
          px-3 py-1
          text-xs md:text-sm font-medium
          hover:bg-dark-cream
          shadow-md
        "
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
      {/* serves, prep time, difficulty */}
      <section className="bg-cream">
        <section className="relative w-full mx-auto overflow-visible mt-3 bg-cream">
          <img
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full sm:h-90 md:h-140 object-cover"
          />
          <div className="flex justify-center gap-12 md:gap-15 xl:gap-35 font-worksans font-medium text-md md:text-sm lg:text-base absolute bottom-0 left-1/2 px-5 md:px-8  py-3 md:py-5 w-[95%] sm:w-[80%] md:w-[70%] xl:w-[50%] bg-primary text-white rounded-3xl mb-4 -translate-x-1/2 translate-y-1/2">
            <div className="flex flex-col items-center gap-2 justify-center">
              <Users className="font-medium" />
              <p className="font-medium ">Serves</p>
              <p className="font-light">{recipe?.servings} servings</p>
            </div>
            <div className="flex flex-col items-center gap-2 justify-center">
              <Clock className="font-medium" />
              <p className="font-medium">Prep Time</p>
              <p className="font-light">{recipe?.cookingTime}</p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Zap className="font-medium" />
              <p className="font-medium">Difficulty</p>
              <p className="font-light">{recipe?.difficulty}</p>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 xl:px-32 bg-cream shadow-md shadow-gray-100 pt-8 mt-18">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-20 gap-6">
            {/* Ingredients Card */}
            <div className="bg-white p-7 mb-15 rounded-2xl shadow-md transform hover:scale-110 transition duration-300">
              <h3 className="text-center font-playfair font-semibold md:text-2xl text-lg mb-4">
                Ingredients
              </h3>
              <ul className="list-disc list-inside mt-2">
                {recipe?.ingredients.map((ingredient, index) => (
                  <li key={index} className="font-worksans text-black">
                    <span className="font-semibold text-primary">
                      {ingredient.amount} {ingredient.unit.toLowerCase()}{" "}
                    </span>
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Card */}
            <div className="bg-white p-7 mb-15 rounded-2xl shadow-md transform hover:scale-110 transition duration-300">
              <h3 className="text-center font-playfair font-semibold md:text-2xl text-lg mb-4">
                Instructions
              </h3>
              <ul className="list-decimal list-inside mt-2">
                {recipe?.steps.map((step, index) => (
                  <li key={index} className="font-worksans text-black">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>

      {recipe?.nutrition &&
        (recipe.nutrition.calories !== null ||
          recipe.nutrition.protein !== null ||
          recipe.nutrition.carbs !== null ||
          recipe.nutrition.fat !== null) && (
          <section className="px-6 md:px-20 xl:px-32 mt-8">
            <div className="w-full gap-20 mb-6">
              <div className="sm:col-span-3 col-span-1 mb-0 md:mb-16">
                <h3 className="text-2xl md:text-xl font-playfair font-bold text-black mb-4">
                  Nutritions
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-4 font-worksans">
                  {recipe.nutrition.calories !== null && (
                    <div className="group flex items-center gap-3 text-md md:text-sm lg:text-base bg-light-primary p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300">
                      <Flame className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      <div>
                        <span className="font-medium">Calories:</span>
                        <span> {recipe.nutrition.calories} kcal</span>
                      </div>
                    </div>
                  )}

                  {recipe.nutrition.protein !== null && (
                    <div className="group flex items-center gap-3 bg-light-primary p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300">
                      <Beef className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      <div>
                        <span className="font-medium">Protein:</span>
                        <span> {recipe.nutrition.protein} g</span>
                      </div>
                    </div>
                  )}

                  {recipe.nutrition.carbs !== null && (
                    <div className="group flex items-center gap-3 bg-light-primary p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300">
                      <Sprout className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      <div>
                        <span className="font-medium">Carbs:</span>
                        <span> {recipe.nutrition.carbs} g</span>
                      </div>
                    </div>
                  )}

                  {recipe.nutrition.fat !== null && (
                    <div className="group flex items-center gap-3 bg-light-primary p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300">
                      <Droplet className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      <div>
                        <span className="font-medium">Fat:</span>
                        <span> {recipe.nutrition.fat} g</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-0 pb-8">
              <RatingForm
                ratings={allRatings}
                showForm={showForm}
                stars={stars}
                comment={comment}
                onOpenForm={openForm}
                onCancel={cancelForm}
                onStarsChange={setStars}
                onCommentChange={setComment}
                onSubmit={handleSubmit}
              />
            </div>
          </section>
        )}
    </div>
  );
}
