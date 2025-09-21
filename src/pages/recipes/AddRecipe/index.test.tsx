// // AddRecipe.test.tsx
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import '@testing-library/jest-dom';
// import { vi } from "vitest";
// import AddRecipe from ".";

// // Mock navigate
// vi.mock("react-router-dom", async () => {
//   const actual = await vi.importActual<any>("react-router-dom");
//   return {
//     ...actual,
//     useNavigate: () => vi.fn(),
//   };
// });

// // Mock fetch
// global.fetch = vi.fn((url) => {
//   if (url === "/api/categories") {
//     return Promise.resolve({
//       json: () =>
//         Promise.resolve([{ id: 1, name: "Vietnamese", type: "vietnamese" }]),
//     });
//   }
//   if (url === "/api/ingredient-units") {
//     return Promise.resolve({
//       json: () =>
//         Promise.resolve([
//           { id: "g", label: "grams" },
//           { id: "ml", label: "ml" },
//         ]),
//     });
//   }
//   return Promise.reject("Unknown API");
// }) as any;

// // Clear localStorage and mocks before each test
// beforeEach(() => {
//   localStorage.clear();
//   vi.clearAllMocks();
// });

// describe("AddRecipe Component", () => {
//   it("renders form fields", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     expect(await screen.findByText("Recipe General Information")).toBeInTheDocument();
//     expect(screen.getByText("+ Add Ingredient")).toBeInTheDocument();
//     expect(screen.getByText("+ Add Step")).toBeInTheDocument();
//     expect(screen.getByText("Tags")).toBeInTheDocument();
//   });

//   it("shows validation errors when submitting empty form", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Add Recipe"));

//     expect(await screen.findByText("Recipe image is required")).toBeInTheDocument();
//     expect(screen.getByText("Recipe name is required")).toBeInTheDocument();
//     expect(screen.getByText("Category is required")).toBeInTheDocument();
//   });

//   it("adds and removes ingredient", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("+ Add Ingredient"));

//     const inputs = await screen.findAllByPlaceholderText("Ingredient");
//     expect(inputs.length).toBe(2);

//     // Remove the first ingredient
//     const removeButtons = screen.getAllByRole("button", { name: /remove ingredient/i });
//     fireEvent.click(removeButtons[0]);
//     expect(screen.getAllByPlaceholderText("Ingredient").length).toBe(1);
//   });

//   it("adds and removes direction step", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("+ Add Step"));

//     const stepInputs = await screen.findAllByPlaceholderText(/Step/);
//     expect(stepInputs.length).toBe(2);

//     const removeButtons = screen.getAllByRole("button", { name: /remove direction/i });
//     fireEvent.click(removeButtons[0]);
//     await waitFor(() => expect(screen.getAllByPlaceholderText(/Step/).length).toBe(1));
//   });

//   it("adds and removes tags", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     const tagInput = screen.getByPlaceholderText("Add a tag...");
//     fireEvent.change(tagInput, { target: { value: "spicy" } });
//     fireEvent.click(screen.getByText("Add"));

//     expect(screen.getByText("spicy")).toBeInTheDocument();

//     const removeTagButton = screen.getByRole("button", { name: /remove tag spicy/i });
//     fireEvent.click(removeTagButton);

//     await waitFor(() => expect(screen.queryByText("spicy")).not.toBeInTheDocument());
//   });

//   it("successfully submits valid recipe", async () => {
//     render(
//       <MemoryRouter>
//         <AddRecipe />
//       </MemoryRouter>
//     );

//     // Upload fake image
//     const file = new File(["dummy"], "recipe.png", { type: "image/png" });
//     const fileInput = screen.getByLabelText("Image Upload");
//     fireEvent.change(fileInput, { target: { files: [file] } });

//     fireEvent.change(screen.getByPlaceholderText("Bún Bò"), { target: { value: "Pho" } });
//     fireEvent.change(screen.getByPlaceholderText("Add a tag..."), { target: { value: "vietnamese" } });
//     fireEvent.change(screen.getByLabelText("Number of Servings"), { target: { value: "2" } });
//     fireEvent.change(screen.getByLabelText("Cook Duration (minutes)"), { target: { value: "30" } });
//     fireEvent.change(screen.getByLabelText("Recipe Introduction"), { target: { value: "A tasty soup" } });
//     fireEvent.change(screen.getByLabelText("Recipe Description"), { target: { value: "Boil broth and add noodles" } });

//     // Fill ingredient
//     fireEvent.change(screen.getByPlaceholderText("225"), { target: { value: "200" } });
//     fireEvent.change(screen.getByPlaceholderText("Ingredient"), { target: { value: "Noodles" } });
//     fireEvent.change(screen.getByText("Unit").closest("select")!, { target: { value: "g" } });

//     // Fill direction
//     fireEvent.change(screen.getByPlaceholderText("Step 1..."), { target: { value: "Boil water" } });

//     fireEvent.click(screen.getByText("Add Recipe"));

//     await waitFor(() => expect(screen.getByTestId("success-message")).toBeInTheDocument());

//     const savedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
//     expect(savedRecipes.length).toBe(1);
//     expect(savedRecipes[0].title).toBe("Pho");
//   });
// });
