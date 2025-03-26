import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs}"] },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
        rules: {
            "no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "next",
                },
            ],
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
]);
