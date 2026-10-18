import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Colours come only from the design tokens in app/globals.css (see docs/DESIGN.md).
// Tailwind's default palette is removed there; this blocks the remaining escape hatch,
// arbitrary hex values such as `bg-[#1e40c0]` or `text-[#333]`.
const noRawColours = {
  message: "Use a design token (docs/DESIGN.md) instead of a raw hex colour.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "Literal[value=/\\[#[0-9a-fA-F]{3,8}\\]/]", ...noRawColours },
        { selector: "TemplateElement[value.raw=/\\[#[0-9a-fA-F]{3,8}\\]/]", ...noRawColours },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
