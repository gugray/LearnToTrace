import * as G from "./geo.js";

const dpr = 1;
const elmCanv = document.getElementById("canv");
let ctx, w, h;

const camPos = new G.Vec3(0, 0, 2);
const lookAt = new G.Vec3(0, 0, 0);
const camUp = new G.Vec3(0, 1, 0).normalize();
const fov = (28 * Math.PI) / 180;

setTimeout(() => {
  initCanvas();
  render();
}, 0);

function initCanvas() {
  ctx = elmCanv.getContext("2d");
  const rect = elmCanv.getBoundingClientRect();
  elmCanv.width = Math.round(rect.width * dpr);
  elmCanv.height = Math.round(rect.height * dpr);
  w = elmCanv.width;
  h = elmCanv.height;
}

function render() {
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const [r, g, b] = image(x, h - y - 1);
      data[i] = Math.round(r * 255);
      data[i + 1] = Math.round(g * 255);
      data[i + 2] = Math.round(b * 255);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
}

const MAX_STEPS = 100;
const MAX_TRAVEL = 10;
const MARCH_E = 0.0001;
const NORM_E = 0.0001;

const IC = {
  uv: new G.Vec2(),
  nc: new G.Vec2(),
  ro: new G.Vec3(),
  rd: new G.Vec3(),
  pt: new G.Vec3(),
};

function image(x, y) {
  const clr = [0, 0, 0];

  // In pt, x is [-0.5, 0.5] and y depends on AR
  const ar = w / h;
  IC.uv.set(x / w - 0.5, y / h - 0.5);
  IC.nc.set(IC.uv.x, IC.uv.y / ar);

  // Cam position and FOV
  const camDir = lookAt.clone().sub(camPos).normalize();
  const camDist = 0.5 / Math.tan(fov / 2);
  const canvCenter = camPos.clone().addMul(camDir, camDist);
  const right = camDir.clone().cross(camUp);
  const up = right.clone().cross(camDir);

  IC.ro.setFrom(camPos);
  IC.rd.setFrom(canvCenter).addMul(right, IC.nc.x).addMul(up, IC.nc.y).sub(camPos).normalize();

  let stepCount = 0;
  let dist = Number.MAX_VALUE;
  let travel = 0;
  IC.pt.setFrom(IC.ro);
  while (stepCount < MAX_STEPS && dist > MARCH_E && travel <= MAX_TRAVEL) {
    dist = scene(IC.pt);
    IC.pt.addMul(IC.rd, dist);
    ++stepCount;
    travel += dist;
  }

  if (dist > MARCH_E) return clr;

  return light(IC.pt);
}

const SC = {
  q: new G.Vec3(),
};

function scene(pt) {
  const q = SC.q;
  let d = Number.MAX_VALUE;

  // First sphere
  q.setFrom(pt);
  q.z += 1;
  q.x -= 0.2;
  d = Math.min(d, q.length() - 0.2);

  // Second sphere
  q.setFrom(pt);
  q.z += 1;
  q.x += 0.2;
  d = Math.min(d, q.length() - 0.2);

  return d;
}

const NC = {
  e: new G.Vec3(),
  p: new G.Vec3(),
  n: new G.Vec3(),
};

function norm(pt) {
  NC.e.set(NORM_E, 0, 0);
  const dxa = scene(NC.p.setFrom(pt).add(NC.e));
  const dxb = scene(NC.p.setFrom(pt).sub(NC.e));
  NC.e.set(0, NORM_E, 0);
  const dya = scene(NC.p.setFrom(pt).add(NC.e));
  const dyb = scene(NC.p.setFrom(pt).sub(NC.e));
  NC.e.set(0, 0, NORM_E);
  const dza = scene(NC.p.setFrom(pt).add(NC.e));
  const dzb = scene(NC.p.setFrom(pt).sub(NC.e));

  NC.n.set(dxa - dxb, dya - dyb, dza - dzb);
  return NC.n.normalize();
}

const l1v = new G.Vec3(1, 0.5, 0.2).normalize();
const l2v = new G.Vec3(-0.2, -1, 0.5).normalize();

function light(pt) {
  const sn = norm(pt);
  let l1 = sn.dot(l1v);
  if (l1 < 0) l1 = 0;
  let l2 = sn.dot(l2v);
  if (l2 < 0) l2 = 0;

  let l = l1 * 0.8 + l2 * 0.2;
  if (l1 > 1) l = 1;
  return [l, l, l];
}
