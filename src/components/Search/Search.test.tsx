import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SearchBar from ".";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../contexts/ThemeContext";

test("no keyword provided", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <SearchBar />
        </MemoryRouter>
      </ThemeProvider>
    );
    const searchInput = screen.getByPlaceholderText(/search recipes/i);
    expect(
      searchInput
    ).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
})

test("keyword with results provided", async () => {
  global.fetch = vi.fn(
    () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [
          { id: 1, title: "Bánh mì" },
          { id: 2, title: "Bánh khọt" },
          { id: 3, title: "Bánh bèo" },
          { id: 4, title: "Bánh cuốn" },
          { id: 5, title: "Bánh tráng trộn" },
        ],
      } as Response) // cast to Response so TS doesn’t complain
  );

  render(
    <ThemeProvider>
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    </ThemeProvider>
  );

  const searchInput = screen.getByPlaceholderText(/search recipes/i);
  expect(searchInput).toBeInTheDocument();

  await userEvent.type(searchInput, "bánh");
  expect(searchInput).toHaveValue("bánh");

  const results = await screen.findAllByText(/bánh/i, {}, { timeout: 2000 });
  expect(results).toHaveLength(5);

});

test("keyword with no results provided", async () => {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    </ThemeProvider>
  );

  const searchInput = screen.getByPlaceholderText("Search recipes...");
  expect(searchInput).toBeInTheDocument();

  await userEvent.type(searchInput, "asf");
  expect(searchInput).toHaveValue("asf");
  expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
});
