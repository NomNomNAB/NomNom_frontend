import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login/index";
import { test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual<typeof import("firebase/auth")>(
    "firebase/auth"
  );
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(
      () => Promise.resolve({ user: { uid: "123" } }) // fake successful login
    ),
  };
});


test("renders login fields and button", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
});

test("submits valid email and password", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: "password123" },
  });

  expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

   await waitFor(() => {
     expect(mockNavigate).toHaveBeenCalledWith("/");
   });

});

test("submits invalid email and valid password", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "testexample.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: "password123" },
  });

  expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
});

test("submits valid email and invalid password", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: "12345" },
  });

  expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    await screen.findByText("Password must be at least 6 characters")
  ).toBeInTheDocument();
});

test("submits with no email", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: "password123" },
  });
  expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
});


test("submits with no password", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: "" },
  });
  expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
});







