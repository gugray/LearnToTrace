import * as esbuild from "esbuild"
import {livereloadPlugin} from "@jgoz/esbuild-plugin-livereload"

const port = 8080;

async function run() {
  const entryPoints = [
    "src/app.css",
    "src/app.js",
    "src/index.html",
  ];
  const plugins = [
    livereloadPlugin({port: 53001}),
  ];
  const context = await esbuild.context({
    entryPoints: entryPoints,
    outdir: "public",
    bundle: true,
    format: "esm",
    sourcemap: true,
    loader: {
      ".html": "copy",
      ".css": "copy",
    },
    write: true,
    metafile: true,
    plugins: plugins,
  });

  await context.watch();
  await context.serve({port: port});
  console.log(`Serving on port ${port}`);
}

void run();

