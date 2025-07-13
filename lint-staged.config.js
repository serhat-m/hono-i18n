/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*": ["biome check --write", "biome check"],
  // https://github.com/lint-staged/lint-staged/issues/468
  // https://github.com/lint-staged/lint-staged/blob/main/README.md#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
  "**/*.ts?(x)": () => "tsc -p tsconfig.json",
}
