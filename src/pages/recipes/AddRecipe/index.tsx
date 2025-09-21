import { useState, useEffect } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { Pencil, Plus, X, CheckCircle } from "lucide-react";
import TextArea from "../../../components/TextArea";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "../../../types";
import useAuth from "../../../hooks/useAuth";

export default function AddRecipe() {
  const navigate = useNavigate();
  const user = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [servings, setServings] = useState("");
  const [duration, setDuration] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState<{ id: string; label: string }[]>([]);
  const [ingredients, setIngredients] = useState([
    { amount: "", unit: "", name: "" },
  ]);
  const [nutrition, setNutrition] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [directions, setDirections] = useState([{ step: "" }]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("/api/ingredient-units")
      .then((res) => res.json())
      .then((data) => setUnits(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string" || reader.result === null) {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /** INGREDIENT HANDLERS */
  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", unit: "", name: "" }]);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...ingredients];
    updated[index][field as keyof (typeof updated)[number]] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  /** DIRECTION HANDLERS */

  const addDirection = () => {
    setDirections([...directions, { step: "" }]);
  };

  const updateDirection = (index: number, value: string) => {
    const updated = [...directions];
    updated[index].step = value;
    setDirections(updated);
  };

  const removeDirection = (index: number) => {
    const updated = directions.filter((_, i) => i !== index);
    setDirections(updated);
  };

  /** TAG HANDLERS */
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!imagePreview) newErrors.image = "Recipe image is required";
    if (!recipeName.trim()) newErrors.name = "Recipe name is required";
    if (!category) newErrors.category = "Category is required";

    // servings
    if (!servings) {
      newErrors.servings = "Number of servings is required";
    } else if (isNaN(Number(servings))) {
      newErrors.servings = "Servings must be a valid number";
    } else if (Number(servings) <= 0) {
      newErrors.servings = "Number of servings must be greater than 0";
    }

    // duration
    if (!duration) {
      newErrors.duration = "Cooking time is required";
    } else if (isNaN(Number(duration))) {
      newErrors.duration = "Cooking time must be a valid number";
    } else if (Number(duration) <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!intro.trim()) newErrors.intro = "Introduction is required";
    if (!description.trim()) newErrors.description = "Description is required";

    // ingredients
    ingredients.forEach((ing, i) => {
      if (!ing.amount) {
        newErrors[`ingredient-amount-${i}`] = "Amount is required";
      } else if (isNaN(Number(ing.amount))) {
        newErrors[`ingredient-amount-${i}`] = "Amount must be a number";
      } else if (Number(ing.amount) <= 0) {
        newErrors[`ingredient-amount-${i}`] = "Amount must be greater than 0";
      }

      if (!ing.unit) {
        newErrors[`ingredient-unit-${i}`] = "Unit is required";
      }
      if (!ing.name.trim()) {
        newErrors[`ingredient-name-${i}`] = "Ingredient name is required";
      }
    });

    // directions
    directions.forEach((dir, i) => {
      if (!dir.step.trim()) {
        newErrors[`direction-${i}`] = `Step ${i + 1} cannot be empty`;
      }
    });

    // difficulty
    if (!difficulty) {
      newErrors.difficulty = "Recipe difficulty is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateNutrition = (field: keyof typeof nutrition, value: string) => {
    if (/^\d*$/.test(value)) {
      // allow only numbers
      setNutrition({ ...nutrition, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedCategory = categories.find((c) => c.type === category);

    const newRecipe = {
      id: Date.now(),
      categoryId: selectedCategory?.id || null,
      categoryType: selectedCategory?.type || category,
      image: imagePreview,
      title: recipeName,
      authorId: 1,
      author: user.user?.email || "N/A",
      description: intro,
      longDescription: description,
      cookingTime: `${duration} minutes`,
      servings: Number(servings),
      difficulty: difficulty,
      category: selectedCategory?.name || "",
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: Number(ing.amount),
        unit: ing.unit,
      })),
      steps: directions.map((dir) => dir.step),
      tags: tags,
      nutrition: {
        calories: nutrition.calories ? Number(nutrition.calories) : null,
        protein: nutrition.protein ? Number(nutrition.protein) : null,
        carbs: nutrition.carbs ? Number(nutrition.carbs) : null,
        fat: nutrition.fat ? Number(nutrition.fat) : null,
      },
      rating: 0,
      totalRatings: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    storedRecipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(storedRecipes));

    console.log("✅ Recipe Created:", newRecipe);
    await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/recipes");
    }, 3000);
  };

  return (
    <div className="font-worksans flex flex-col gap-8 bg-white text-black min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center justify-start px-10 md:px-20 py-16 min-h-[20px] sm:min-h-[200px] w-[100dvw]">
        <img
          src="/cooking2.JPG"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
        <div className="font-worksans w-full md:w-1/2 relative z-10">
          <h2 className="text-xl md:text-4xl font-playfair text-white font-extrabold mb-4 sm:mb-6">
            Share Your Story, <br /> Share Your Dish.
          </h2>

          <p className="text-sm md:text-lg text-black font-medium">
            {" "}
            Every dish has a story - what's yours? <br /> Share your favorite
            recipes with our community of home cooks and inspire others.{" "}
          </p>
        </div>
      </section>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            //initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            //exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          >
            <div className="bg-white rounded-2xl p-6 flex flex-col space-y-2 items-center shadow-lg">
              <CheckCircle className="text-green-500 w-12 h-12 mb-2" />
              <h3 className="text-lg font-playfair font-semibold">
                Your Recipe Successfully Created!
              </h3>
              <p className="font-worksans text-gray text-sm">
                Redirecting to recipes...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <section className="px-6 md:px-20 xl:px-3">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-lg"
        >
          {/* General Info */}
          <section className="bg-form p-6 rounded-lg shadow-sm">
            <h2 className="md:text-2xl text-lg font-semibold font-playfair mb-5">
              Recipe General Information
            </h2>

            <div className="flex flex-col gap-4">
              {/* Image Upload */}
              <div>
                <label
                  htmlFor="image-upload"
                  className="font-medium text-sm sm:text-md text-black"
                >
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {!imagePreview ? (
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Plus className="w-6 h-6 text-gray-500" />
                    <span className="ml-2 text-gray-500">Add Image</span>
                  </label>
                ) : (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <label
                      htmlFor="image-upload"
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </label>
                  </div>
                )}
                {errors.image && (
                  <p className="text-xs text-red-500">{errors.image}</p>
                )}
              </div>

              <Input
                type="text"
                label="Recipe Name"
                placeholder="Bún Bò"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                error={errors.name}
              />

              <div>
                <label className="font-medium text-sm sm:text-md text-black">
                  Recipe Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.category ? "border-red-500" : "border-[#B3B3B3]"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.type}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="servings"
                  type="number"
                  label="Number of Servings"
                  value={servings}
                  min={1}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setServings(val);
                    }
                  }}
                  error={errors.servings}
                />

                <Input
                  id="duration"
                  type="number"
                  label="Cook Duration (minutes)"
                  value={duration}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setDuration(val);
                    }
                  }}
                  error={errors.duration}
                  min={1}
                />
              </div>

              <div>
                <label className="font-medium text-sm sm:text-md text-black">
                  Recipe Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.difficulty ? "border-red-500" : "border-[#B3B3B3]"
                  }`}
                >
                  <option value="">Select Difficulty</option>
                  {["Easy", "Medium", "Hard"].map((dif, index) => (
                    <option key={index} value={dif}>
                      {dif.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="text-xs text-red-500">{errors.difficulty}</p>
                )}
              </div>

              <TextArea
                id="recipe-intro"
                label="Recipe Introduction"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                error={errors.intro}
              />
              <TextArea
                id="recipe-description"
                label="Recipe Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
              />
            </div>
          </section>

          {/* Right side: Recipe Detail */}
          <section className="flex flex-col gap-6">
            {/* Ingredients */}
            <div className="bg-form p-6 rounded-lg shadow-sm">
              <h2 className="md:text-2xl text-lg font-semibold font-playfair mb-5">
                Ingredients
              </h2>
              <div className="flex flex-col gap-4">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      id={`ingredient-amount-${index}`}
                      type="number"
                      placeholder="225"
                      min={1}
                      value={ing.amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          updateIngredient(index, "amount", val);
                        }
                      }}
                      error={errors[`ingredient-amount-${index}`]}
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(index, "unit", e.target.value)
                      }
                      className={`px-3 py-2 border rounded-lg ${
                        errors[`ingredient-unit-${index}`]
                          ? "border-red-500"
                          : "border-[#B3B3B3]"
                      }`}
                    >
                      <option value="">Unit</option>
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      id={`ingredient-name-${index}`}
                      type="text"
                      placeholder="Ingredient"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(index, "name", e.target.value)
                      }
                      error={errors[`ingredient-name-${index}`]}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-sm rounded-lg border-2 bg-light-gray border-primary py-2 text-primary font-semibold hover:bg-primary hover:text-white transition"
                >
                  + Add Ingredient
                </button>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-form p-6 rounded-lg shadow-sm">
              <h2 className="md:text-2xl text-lg font-semibold font-playfair mb-5">
                Directions
              </h2>
              <div className="flex flex-col gap-4">
                {directions.map((dir, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-6 shrink-0 font-semibold text-gray-600 pt-2">
                      {index + 1}.
                    </span>
                    <TextArea
                      id={`direction-step-${index}`}
                      className="flex-1"
                      placeholder={`Step ${index + 1}...`}
                      value={dir.step}
                      onChange={(e) => updateDirection(index, e.target.value)}
                      error={errors[`direction-${index}`]}
                    />
                    <button
                      type="button"
                      aria-label={`remove direction ${index + 1}`}
                      onClick={() => removeDirection(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDirection}
                  className="text-sm rounded-lg border-2 bg-light-gray border-primary py-2 text-primary font-semibold hover:bg-primary hover:text-white transition"
                >
                  + Add Step
                </button>
              </div>
            </div>

            {/* Nutritions */}
            <div className="bg-form p-6 rounded-lg shadow-sm">
              <h2 className="md:text-2xl text-lg font-semibold font-playfair mb-5">
                Nutritions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="calories"
                  type="number"
                  label="Calories (kcal)"
                  value={nutrition.calories}
                  onChange={(e) => updateNutrition("calories", e.target.value)}
                />
                <Input
                  id="protein"
                  type="number"
                  label="Protein (g)"
                  value={nutrition.protein}
                  onChange={(e) => updateNutrition("protein", e.target.value)}
                />
                <Input
                  id="carbs"
                  type="number"
                  label="Carbs (g)"
                  value={nutrition.carbs}
                  onChange={(e) => updateNutrition("carbs", e.target.value)}
                />
                <Input
                  id="fat"
                  type="number"
                  label="Fat (g)"
                  value={nutrition.fat}
                  onChange={(e) => updateNutrition("fat", e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-form p-6 rounded-lg shadow-sm">
              <h2 className="md:text-2xl text-lg font-semibold font-playfair mb-5">
                Tags
              </h2>
              <div className="flex flex-row space-x-4 mb-3">
                <Input
                  id="tag-input"
                  className="w-full"
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`remove tag ${tag}`}
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Submit button full width */}
          <div className="md:col-span-2 flex justify-center">
            <Button type="submit">Add Recipe</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
