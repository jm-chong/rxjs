module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "none",
        bracketSpacing: true,
        arrowParens: "avoid",
      },
    ],
  },
};
