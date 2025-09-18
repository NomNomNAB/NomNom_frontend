import { useEffect, useState } from "react";
import RecipeCardList from "../../../components/CardList";
import type { Category, Recipe } from "../../../types";
import type { RecipeCardProps } from "../../../components/Recipe/RecipeCard";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import CategoryFilter from "../../../components/CategoryFilter";
import CategoryMultiSelectFilter from "../../../components/CategoryMultiSelectFilter";


export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategroies] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);


  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((res) => setRecipes(res as Recipe[]));

    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategroies);
  }, []);
  
  // console.log("selectedchange on recipe comp:", fetch("api/categories"))

  const filteredRecipes =
    selectedCategory === "all"
      ? recipes
      : recipes.filter((r) => String((r).categoryId) === selectedCategory);

  // console.log("selectedchange on recipe comp:", filteredRecipes)

  const multiFilteredRecipes =
    selectedFilters.length === 0
      ? filteredRecipes // ✅ apply multi-select AFTER tab filtering
      : filteredRecipes.filter((r) => selectedFilters.includes(r.categoryId));

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
      <section className="px-6 md:px-20 xl:px-32 pt-8 space-y-4">
        <CategoryMultiSelectFilter
          categories={categories}
          selected={selectedFilters.map(String)} // convert number[] -> string[]
          onChange={(vals) => setSelectedFilters(vals.map(Number))}
        />
      </section>

      {/* Recipe List */}
      <section className="px-6 md:px-20 xl:px-32 py-8">
        <h2 className="md:text-2xl text-lg font-bold font-playfair mb-5">
          Recipe List
        </h2>

        {multiFilteredRecipes.length > 0 ? (
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
          ></RecipeCardList>
        ) : (
          <p className="text-black font-medium">No recipes found.</p>
        )}
      </section>
    </div>
  );
}
