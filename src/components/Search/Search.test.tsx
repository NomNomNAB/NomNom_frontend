import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import SearchBar from ".";
import { MemoryRouter } from "react-router-dom";

test("no keyword provided", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/search recipes/i);
    expect(
      searchInput
    ).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
})

test("keyword with results provided", async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/search recipes/i);
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, "bánh");

    expect(searchInput).toHaveValue("bánh");

    const result1 = await screen.findByText(/bánh mì/i);
    expect(result1).toBeInTheDocument();
    expect(result1).toHaveLength(1);

    const result2 = await screen.findByText(/bánh khọt/i);
    expect(result2).toBeInTheDocument();
    expect(result1).toHaveLength(2);

    const result3 = await screen.findByText(/bánh bèo/i);
    expect(result3).toBeInTheDocument();
    expect(result1).toHaveLength(3);

    const result4 = await screen.findByText(/bánh cuốn/i);
    expect(result4).toBeInTheDocument();
    expect(result1).toHaveLength(4);

    const result5 = await screen.findByText(/bánh tráng trộn/i);
    expect(result5).toBeInTheDocument();
    expect(result1).toHaveLength(5);
})

test("keyword with no results provided", async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText("Search recipes...");
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, "asf");
    expect(searchInput).toHaveValue("asf");

    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
})