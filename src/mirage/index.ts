import { createServer, Model } from "miragejs";
import data from "./temp.json";
import type { Recipe } from "../types";

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    models: {
      recipe: Model.extend({}),
      category: Model.extend({}),
      user: Model.extend({}),
      rating: Model.extend({}),
      ingredientUnit: Model.extend({}),
    },

    seeds(server) {
      const db = server.db;
      // Seed recipes
      data.recipes.forEach((recipe) => {
        const existing = db.recipes.find(recipe.id);
        if (existing) {
          db.recipes.update(recipe.id, recipe);
        } else {
          db.recipes.insert(recipe);
        }
      });

      const stored = localStorage.getItem("recipes");
      if (stored) {
        JSON.parse(stored).forEach((r: any) => server.create("recipe", r));
      }

      // Seed categories
      data.categories.forEach((category) => {
        db.categories.insert(category);
      });

      // Seed ingredients
      Object.entries(data.enums.IngredientUnit).forEach(([key, value]) => {
        db.ingredientUnits.insert({ id: key, label: value });
      });

      // Seed users
      data.users.forEach((user) => {
        db.users.insert(user);
      });

      // Seed ratings
      data.ratings.forEach((rating) => {
        db.ratings.insert(rating);
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/recipes", (schema, request) => {
        if (request.queryParams) {
          const title = request.queryParams.title?.toString() ?? "";
          const description = request.queryParams.description?.toString() ?? "";
          return schema.db.recipes.filter(
            (recipe) =>
              (recipe as Recipe).title.toLowerCase().includes(title.toLowerCase()) ||
              (recipe as Recipe).description.toLowerCase().includes(description.toLowerCase())
          );
        }
        return schema.db.recipes;
      });

      this.get("/recipes/:id", (schema, request) => {
        return schema.db.recipes.find(request.params.id);
      });

      this.get("/categories", (schema) => {
        return schema.db.categories;
      });

      this.get("/categories/:id", (schema, request) => {
        return schema.db.categories.find(request.params.id);
      });

      this.get("/users", (schema, request) => {
        const filters = request.queryParams;

        if (Object.keys(filters).length > 0) {
          return schema.db.users.where(filters);
        }

        return schema.db.users;
      });

      this.get("/ingredient-units", (schema) => schema.db.ingredientUnits);
      this.get("/ingredient-units/:id", (schema, request) =>
        schema.db.ingredientUnits.find(request.params.id)
      );

      // this.get("/users", (schema) => {
      //   return schema.db.users;
      // });

      this.get("/users/:id", (schema, request) => {
        return schema.db.users.find(request.params.id);
      });

      this.get("/ratings", (schema) => {
        return schema.db.ratings;
      });

      this.get("/ratings/:id", (schema, request) => {
        return schema.db.ratings.find(request.params.id);
      });

      this.post("/recipes", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const recipe = schema.create("recipe", attrs);
        localStorage.setItem("recipes", JSON.stringify(schema.db.recipes));
        return recipe;
      });

      this.get("/recipes/:id/ratings", (schema, request) => {
        const recipeId = Number(request.params.id);
        return schema.db.ratings.where({ recipeId });
      });

      this.passthrough("https://identitytoolkit.googleapis.com/**");
      this.passthrough("https://securetoken.googleapis.com/**");
    },
  });

  return server;
}
