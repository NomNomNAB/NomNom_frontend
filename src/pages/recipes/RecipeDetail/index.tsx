import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Rating, Recipe } from "../../../types";
import SearchBar from "../../../components/Search";
//import Button from "../../../components/Button";
import { Beef, Droplet, Flame, Heart, Leaf } from "lucide-react";
import RatingForm from "../../../components/RatingForm";
import useAuth from "../../../hooks/useAuth";

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

  const [recipe, setRecipe] = useState<Recipe>();
  //const [ratings, setRatings] = useState<Rating[]>([]);
  const [isFav, setIsFav] = useState(false);
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
      userId: 0, // demo for gueest typing
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

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favRecipes") || "[]");
    setIsFav(favs.includes(id));
  }, [id]);

  // Toggle favorite
  const handleFavToggle = () => {
    const favs = JSON.parse(localStorage.getItem("favRecipes") || "[]");
    let updatedFavs;

    if (isFav) {
      // remove
      updatedFavs = favs.filter((favId: string) => favId !== id);
    } else {
      // add
      updatedFavs = [...favs, id];
    }

    localStorage.setItem("favRecipes", JSON.stringify(updatedFavs));
    setIsFav(!isFav);
  };

  return (
    <div className="font-worksans w-full">
      {/* Search Bar */}
      <SearchBar />

      {/* Recipe Part */}
      <section className="px-6 md:px-20 xl:px-32 bg-white pt-8">
        <p className="font-playfair font-bold text-base text-black mb-2">
          {recipe?.category}
        </p>
        <div className="flex flex-row justify-between items-start sm:items-center">
          <h2 className="md:text-6xl text-xl font-bold font-playfair mb-3">
            {recipe?.title}
          </h2>

          <button onClick={handleFavToggle}>
            <Heart
              className={`w-6 h-6 sm:w-10 sm:h-10 transition-colors ${
                isFav ? "text-primary fill-current" : "text-primary"
              }`}
            />
          </button>
        </div>

        <p className=" mb-7">
          <span className="text-base font-worksans italic text-gray-600">
            {recipe?.author}
          </span>
        </p>
        <p className="text-base font-worksans text-black">
          {recipe?.longDescription}
        </p>
        <p className="text-base font-worksans text-primary mb-4">
          {recipe?.tags.map((tag, index) => (
            <span key={index} className="text-sm mr-2">
              #{tag}
            </span>
          ))}
        </p>
      </section>

      <section className="relative w-full mx-auto overflow-visible">
        <img
          src={recipe?.image}
          alt={recipe?.title}
          className="w-full sm:h-90 md:h-140 object-cover mb-4"
        />
        <div className="flex justify-center gap-10 md:gap-12 xl:gap-30 font-worksans font-medium md:text-lg text-sm absolute bottom-0 left-1/2 px-6 md:px-10 w-[95%] sm:w-[80%] md:w-[70%] xl:w-[50%] bg-primary text-white rounded-3xl py-5 md:py-7 -translate-x-1/2 translate-y-1/2">
          <div className="flex flex-col items-center gap-2 justify-center">
            <p className="font-bold">Serving</p>
            <p>{recipe?.servings}</p>
          </div>
          <div className="flex flex-col items-center gap-2 justify-center">
            <p className="font-bold">Cooking Time</p>
            <p>{recipe?.cookingTime}</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="font-bold">Difficulty</p>
            <p>{recipe?.difficulty}</p>
          </div>
        </div>
      </section>
      <section className="px-6 md:px-20 xl:px-32 bg-light-gray pt-8 mt-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-20 gap-0">
          <div className="bg-white p-7 mb-15">
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
          <div className="bg-white p-7 mb-15">
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

      <section className="px-6 md:px-20 xl:px-32 mt-8 pb-8">
        <div className="grid sm:grid-cols-4 grid-cols-1 gap-20">
          <div className="sm:col-span-3 col-span-1 bg-light-gray px-4 py-7 mb-0 md:mb-16">
            <h3 className="text-center font-playfair font-semibold md:text-2xl text-lg mb-4">
              Nutritions
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-4 font-worksans">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[#A64F67]/10 shadow">
                {/* <span className="text-2xl">🔥</span> */}
                <Flame className="w-6 h-6 text-primary " />
                <div>
                  <span className="text-sm md:text-base lg:text-lg font-bold">
                    Calories:
                  </span>
                  <span className="text-sm md:text-base lg:text-lg font-semibold">
                    {" "}
                    {recipe?.nutrition.calories} kcal
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#A64F67]/10 rounded-lg shadow">
                <Beef className="w-6 h-6 text-primary" />
                <div>
                  <span className="text-sm md:text-base lg:text-lg font-bold">
                    Protein:
                  </span>
                  <span className="text-sm md:text-base lg:text-lg font-semibold">
                    {" "}
                    {recipe?.nutrition.protein}g
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#A64F67]/10 rounded-lg shadow">
                {/* <span className="text-2xl">🌾</span> */}
                <Leaf className="w-6 h-6 text-primary" />
                <div>
                  <span className="text-sm md:text-base lg:text-lg font-bold">Carbs:</span>
                  <span className="text-sm md:text-base lg:text-lg font-semibold">
                    {" "}
                    {recipe?.nutrition.carbs}g
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#A64F67]/10 rounded-lg shadow">
                {/* <span className="text-2xl">🥥</span> */}
                <Droplet className="w-6 h-6 text-primary" />
                <div>
                  <span className="text-sm md:text-base lg:text-lg font-bold">
                    Fat:{" "}
                  </span>
                  <span className="text-sm md:text-base lg:text-lg font-semibold">
                    {" "}
                    {recipe?.nutrition.fat}g
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center justify-center col-span-1 bg-primary rounded-xl sm:rounded-4xl mb-16">
            <p className="text-2xl sm:text-8xl text-white font-playfair">
              {recipe?.rating}
            </p>
            <p className="ml-2 sm:ml-0 text-2xl text-white py-6 font-playfair">
              Rating
            </p>
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
    </div>
  );
}
