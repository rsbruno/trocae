import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

export default tseslint.config(
  {
    ignores: ["src/routes/**", "node_modules/**", "dist/**", "build/**", ".husky/**", ".vscode/**", "src/database/**"]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { destructuredArrayIgnorePattern: "^_" }],
      "perfectionist/sort-named-imports": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-interfaces": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-jsx-props": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-imports": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-exports": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-objects": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-enums": ["error", { type: "line-length", order: "desc" }],
      "perfectionist/sort-maps": ["error", { type: "line-length", order: "desc" }],
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-case-declarations": "off",
      "no-param-reassign": "off"
    },

    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
      ecmaVersion: 2022
    },

    plugins: {
      "react-hooks": reactHooks,
      perfectionist
    },

    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    files: ["**/*.{ts,tsx,js,jsx}"]
  }
);
