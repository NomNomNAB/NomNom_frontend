import { useEffect, useState } from "react";
import RecipeCardList from "../../../components/CardList";
import type { Category, Recipe } from "../../../types";
import type { RecipeCardProps } from "../../../components/Recipe/RecipeCard";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import CategoryFilter from "../../../components/CategoryFilter";
import CategoryMultiSelectFilter from "../../../components/CategoryMultiSelectFilter";
import { useFavouriteList } from "../../../hooks/useFavourite";

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategroies] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const { favId } = useFavouriteList();


  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((res) => setRecipes(res as Recipe[]));

    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategroies);
  }, []);

  // console.log("selectedchange on recipe comp:", fetch("api/categories"))

  const filteredRecipes = (() => {
    if (selectedCategory === "all") {
      return recipes;
    } else if (selectedCategory === "fav") {
      return recipes.filter((r) => favId.includes(String(r.id)));
    } else {
      return recipes.filter((r) => String(r.categoryId) === selectedCategory);
    }
  })();

  // console.log("selectedchange on recipe comp:", filteredRecipes)

  const multiFilteredRecipes =
    selectedFilters.length === 0
      ? filteredRecipes
      : filteredRecipes.filter((r) => selectedFilters.includes(r.categoryId));

  const getDisplayTitle = () => {
    if (selectedCategory === "fav") {
      return "My Favourite Recipes";
    } else if (selectedCategory === "all") {
      return "Recipe List";
    } else {
      const category = categories.find(cat => String(cat.id) === selectedCategory);
      return category ? `${category.name} Recipes` : "Recipe List";
    }
  };

  return (
    <div className="font-worksans flex flex-col min-h-screen w-full">
      {/* Hero */}
      <section className="relative flex items-center justify-start px-10 md:px-20 py-16 min-h-[20px] sm:min-h-[200px]">
        <img
          src="/cooking2.JPG"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
        <div className="font-worksans w-full md:w-1/2 relative z-10">
          <h2 className="text-xl md:text-4xl font-playfair text-white font-extrabold mb-4 sm:mb-6">
            Share Your Story, <br /> Share Your Dish.
          </h2>

          {/* <p className="text-sm md:text-lg text-black font-medium">
            {" "}
            Every dish has a story - what's yours? <br /> Share your favorite
            recipes with our community of home cooks and inspire others.{" "}
          </p> */}

          <Link to="/recipes/add">
            <Button
              variant="primary"
              className="cursor-pointer uppercase font-semibold md:text-md text-sm mt-3"
            >
              Share Your Recipe
            </Button>
          </Link>
        </div>
      </section>

      {/* Search Bar */}
      {/* <SearchBar /> */}

      {/* Filter Bar */}
      <section className="px-6 md:px-20 xl:px-32 pt-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          allCategories={true}
          onChange={setSelectedCategory}
        />
      </section>

      {/* Multi-Select Filter */}
      {/* <section className="px-6 md:px-20 xl:px-32 pt-8 space-y-4">
        <CategoryMultiSelectFilter
          categories={categories}
          selected={selectedFilters.map(String)} // convert number[] -> string[]
          onChange={(vals) => setSelectedFilters(vals.map(Number))}
        />
      </section> */}

      {/* Recipe List */}
      <section className="px-6 md:px-20 xl:px-32 py-8">
        <div className="flex flex-row justify-between items-center mb-5">
          <h2 className="text-black md:text-2xl text-lg font-bold font-playfair">
            {/* Recipe List */}
            {getDisplayTitle()}
          </h2>
          {selectedCategory !== "fav" && (

            <CategoryMultiSelectFilter
              categories={categories}
              selected={selectedFilters.map(String)} // convert number[] -> string[]
              onChange={(vals) => setSelectedFilters(vals.map(Number))}
            />
          )}
        </div>
        {selectedCategory === "fav" && multiFilteredRecipes.length === 0 ? (
          <div className="text-center py-3 flex flex-col items-center gap-4">
            <p className="text-center text-black font-medium"> No favourite recipes yet.</p>
            <p className="text-gray-500 text-sm">
              Click the heart icon on any recipe to save it here.
            </p>
            <Link to="/">
              <button className="text-sm md:text-md bg-primary font-worksans uppercase text-white px-6 py-2 rounded-full font-semibold hover:bg-[#732c4e] transition">
                Back to home
              </button>
            </Link>
          </div>
        ) : multiFilteredRecipes.length > 0 ? (
          <RecipeCardList
            recipes={
              multiFilteredRecipes.map((recipe) => {
                return {
                  id: recipe.id,
                  image: recipe.image,
                  title: recipe.title,
                  description: recipe.description,
                  category: recipe.category,
                  cookingTime: recipe.cookingTime,
                  actions: "Read Recipe",
                };
              }) as unknown as RecipeCardProps[]
            }
          />
        ) : (
          <p className="text-center py-10 text-black font-medium">No recipes found.</p>
        )}
      </section>
    </div>
  );
}
