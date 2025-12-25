import * as twgl from "twgl.js";
import * as G from "./geo.js";
import sSweepVert from "./shaders/sweep-vert.glsl";
import sFrag from "./shaders/frag.glsl";

const tileUrl = "img-tile-warm.jpg";

const animating = true;
// const dpr = 1;
const dpr = window.devicePixelRatio;
const elmCanv = document.getElementById("canv");
let gl, w, h;

const camUp = new G.Vec3(0, 1, 0).normalize();
const fov = (60 * Math.PI) / 180;
const camPos = new G.Vec3(0, 0, 2);
const lookAt = new G.Vec3(0, 0, 0);
const camMat = new G.Mat3();

let sweepArrays, sweepBufferInfo;
let txTile;
let progi;

setTimeout(async () => {
  initCanvas();
  await initGL();
  requestAnimationFrame(frame);
}, 0);

function initCanvas() {
  const rect = elmCanv.getBoundingClientRect();
  elmCanv.width = Math.round(rect.width * dpr);
  elmCanv.height = Math.round(rect.height * dpr);
  w = elmCanv.width;
  h = elmCanv.height;
}

async function initGL() {
  gl = elmCanv.getContext("webgl2");
  twgl.addExtensionsToContext(gl);
  sweepArrays = {
    position: {numComponents: 2, data: [-1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1]},
  };
  sweepBufferInfo = twgl.createBufferInfoFromArrays(gl, sweepArrays);
  progi = twgl.createProgramInfo(gl, [sSweepVert, sFrag]);

  const imgTile = await loadImage(tileUrl);
  // txTile = twgl.createTexture(gl, {src: imgTile});
  txTile = twgl.createTexture(gl, {
    src: imgTile,
    min: gl.LINEAR_MIPMAP_LINEAR,
    mag: gl.LINEAR,
    wrap: gl.REPEAT,
  });
}

async function loadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return await createImageBitmap(blob);
}

function makeCamMat(mat, camPos, lookAt, camUp, fov) {
  const g = 0.5 / Math.tan(fov / 2);
  const dir = lookAt.clone().sub(camPos).normalize();
  const right = dir.clone().cross(camUp);
  const up = right.clone().cross(dir);
  // prettier-ignore
  mat.set(
    right.x, up.x, dir.x * g,
    right.y, up.y, dir.y * g,
    right.z, up.z, dir.z * g,
  );
}

function frame(t) {
  t /= 1000;
  const dist = 10;
  camPos.set(0, 0, dist);
  // camPos.set(dist * Math.sin(t), 0, dist * Math.cos(t));
  // const angle = Math.sin(t * 0.3) * 0.4;
  // camPos.set(dist * Math.sin(angle), 0, dist * Math.cos(angle));
  makeCamMat(camMat, camPos, lookAt, camUp, fov);
  render(t);
  if (animating) requestAnimationFrame(frame);
}

function render(t) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(progi.program);
  twgl.setBuffersAndAttributes(gl, progi, sweepBufferInfo);
  twgl.setUniforms(progi, {
    resolution: [w, h],
    txTile: txTile,
    camPos: camPos.toGL(),
    camMat: camMat.toGL(),
    time: t,
  });
  twgl.drawBufferInfo(gl, sweepBufferInfo, gl.TRIANGLES);
}
