import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
    {
        ignores: [
            "**/dist/*",
            "**coverage/*",
            "**.github/*",
            "eslint.config.mjs",
            "jest.config.ts",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["./**/*.ts", "./**/*.tsx"],
    },
    {
        rules: {
            // Keep core TypeScript quality checks with low-noise defaults.
            "@typescript-eslint/explicit-function-return-type": "error", // Require return types on functions
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_", // allow intentionally unused args
                    caughtErrorsIgnorePattern: "^_", // allow intentionally unused caught errors
                },
            ],
            // Allow ES6 imports with CommonJS output
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-var-requires": "off",
        },
    }
);
