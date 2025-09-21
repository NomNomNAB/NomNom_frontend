import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { makeServer } from "./index";
import { Server } from "miragejs";
import data from "./temp.json";

let server: Server;

describe("MirageJS makeServer", () => {
  beforeAll(() => {
    server = makeServer({ environment: "test" });

    data.recipes.forEach((recipe) => server.db.recipes.insert(recipe));
    data.categories.forEach((category) => server.db.categories.insert(category));
    Object.entries(data.enums.IngredientUnit).forEach(([key, value]) => {
      server.db.ingredientUnits.insert({ id: key, label: value });
    });
    data.users.forEach((user) => server.db.users.insert(user));
    data.ratings.forEach((rating) => server.db.ratings.insert(rating));
  });

  afterAll(() => {
    server.shutdown();
  });

  it("should create server with seeded data", () => {
    expect(server.db.recipes.length).toBeGreaterThan(0);
    expect(server.db.categories.length).toBeGreaterThan(0);
    expect(server.db.users.length).toBeGreaterThan(0);
    expect(server.db.ratings.length).toBeGreaterThan(0);
    expect(server.db.ingredientUnits.length).toBeGreaterThan(0);
  });

  it("GET /api/recipes should return all recipes", async () => {
    const res = await fetch("/api/recipes");
    const json = await res.json();
    expect(json.length).toBe(server.db.recipes.length);
  });

  it("GET /api/categories should return categories", async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    expect(json.length).toBe(server.db.categories.length);
  });

  it("GET /api/ingredient-units should return ingredient units", async () => {
    const res = await fetch("/api/ingredient-units");
    const json = await res.json();
    expect(json.length).toBe(server.db.ingredientUnits.length);
  });
});

