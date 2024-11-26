module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "jest-esbuild"
  },
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.[jt]s?(x)"], // Matches test files
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"]
};
