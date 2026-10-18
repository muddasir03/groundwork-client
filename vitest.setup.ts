import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // Compare and shortlist selections persist in localStorage; start every test fresh.
  localStorage.clear();
});
