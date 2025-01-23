import { type Options, build } from "tsup"

const options: Options = {
  tsconfig: "./tsconfig.json",
  entry: ["src/index.ts"],
  sourcemap: false,
  minify: false,
  target: "es2020",
  dts: true,
  clean: true,
}

// ESM build
await build({
  ...options,
  format: "esm",
  outDir: "dist/esm",
})

// CJS build
await build({
  ...options,
  format: "cjs",
  outDir: "dist/cjs",
})
