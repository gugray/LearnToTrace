import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import {livereloadPlugin} from "@jgoz/esbuild-plugin-livereload";

if (process.argv.length < 3) {
  console.log("Usage: node run.js <sktechid>");
  console.log("This executes app in src-<sketchid> folder");
  process.exit(-1);
}

const port = 8080;
const sketchid = process.argv[2];
const dir = `src-${sketchid}`;

const reInclude1 = /#include +\"([^\"]+)\"/dgis;
const reInclude2 = /#include +'([^']+)'/dgis;

function resolveIncludes(fn, resolvedFiles) {
  if (resolvedFiles.includes(fn)) return "";
  resolvedFiles.push(fn);

  const dir = path.dirname(fn);
  let cont = fs.readFileSync(fn, "utf8");
  while (true) {
    let m = reInclude1.exec(cont);
    if (!m) m = reInclude2.exec(cont);
    if (!m) break;
    let includeName = cont.substring(m.indices[1][0], m.indices[1][1]);
    includeName = path.join(dir, includeName);
    const includeCont = resolveIncludes(includeName, resolvedFiles);
    cont = cont.substring(0, m.indices[0][0]) + includeCont + cont.substring(m.indices[0][1]);
  }
  return cont;
}

function glsl(options = {}) {
  return {
    name: "glsl-plugin",
    setup(build) {
      build.onResolve({filter: /\.glsl$/}, (args) => ({
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: "glsl-plugin",
      }));

      build.onLoad({filter: /.*/, namespace: "glsl-plugin"}, (args) => {
        const files = [];
        const cont = resolveIncludes(args.path, files);
        return {
          contents: cont,
          loader: "text",
          watchFiles: files,
        };
      });
    },
  };
}

async function run() {
  const entryPoints = [`${dir}/app.css`, `${dir}/app.js`, `${dir}/index.html`, `${dir}/*.jpg`];
  const plugins = [livereloadPlugin({port: 53001}), glsl()];
  const context = await esbuild.context({
    entryPoints: entryPoints,
    outdir: "public",
    bundle: true,
    format: "esm",
    sourcemap: true,
    loader: {
      ".html": "copy",
      ".css": "copy",
      ".jpg": "copy",
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
