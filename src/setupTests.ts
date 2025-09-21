import "@testing-library/jest-dom";
import { beforeAll, afterEach, vi, beforeEach } from "vitest";
import { makeServer } from "./mirage";
// Vitest automatically supports import.meta.env,
// so you don’t need Object.defineProperty hacks anymore.
// But you can still add global mocks if needed:


// setupTests.ts
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, 
    removeListener: () => {}, 
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

let server: any;

beforeAll(() => {
  server = makeServer({ environment: "test" });
});

afterEach(() => {
  server?.shutdown();
});


