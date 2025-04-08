import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow `any` type
      "@typescript-eslint/no-explicit-any": "off",

      // Allow unused variables
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Allow empty object types
      "@typescript-eslint/no-empty-object-type": "off",

      // Allow unescaped characters in JSX
      "react/no-unescaped-entities": "off",

      // Skip exhaustive-deps warning
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
