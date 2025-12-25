export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  setFrom(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  cross(other) {
    return cross2(this, other);
  }

  dot(other) {
    return dot2(this, other);
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  addMul(other, r) {
    this.x += other.x * r;
    this.y += other.y * r;
    return this;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  rot(rad) {
    const [x, y] = [this.x, this.y];
    this.x = x * Math.cos(rad) - y * Math.sin(rad);
    this.y = x * Math.sin(rad) + y * Math.cos(rad);
    return this;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  isNull() {
    return this.x == 0 && this.y == 0;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  normalize() {
    const len = this.length();
    return this.mul(1 / len);
  }

  setLength(len) {
    return this.mul(len / this.length());
  }

  distToLine(linePt, lineAngle) {
    // Direction vector of the line
    const dx = Math.cos(lineAngle);
    const dy = Math.sin(lineAngle);

    // Vector from line point to this point
    const px = this.x - linePt.x;
    const py = this.y - linePt.y;

    // Cross product magnitude divided by line length
    // Line length is 1 because dx, dy is unit vector
    const distance = Math.abs(px * dy - py * dx);

    return distance;
  }

  fromLineSegmentIsect(linePt, lineAngle, a, b) {
    const dx = Math.cos(lineAngle),
      dy = Math.sin(lineAngle);
    const sx = b.x - a.x,
      sy = b.y - a.y;
    const denom = dx * -sy + dy * sx;

    // Parallel
    if (Math.abs(denom) < 1e-12) return false;

    const lx = a.x - linePt.x;
    const ly = a.y - linePt.y;

    const t = (lx * -sy + ly * sx) / denom; // line parameter
    const u = (dx * ly - dy * lx) / denom; // segment parameter

    // intersection not on segment
    if (u < 0 || u > 1) return false;

    this.x = linePt.x + t * dx;
    this.y = linePt.y + t * dy;
    return true;
  }
}

export function dist2(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function add2(a, b) {
  const vec = a.clone();
  vec.add(b);
  return vec;
}

export function sub2(a, b) {
  const vec = a.clone();
  vec.sub(b);
  return vec;
}

export function cross2(a, b) {
  return a.x * b.y - a.y * b.x;
}

export function dot2(a, b) {
  return a.x * b.x + a.y * b.y;
}

export function angle2(a, b) {
  const dot = dot2(a, b);
  return Math.acos(dot / (a.length() * b.length()));
}

// Signed angle (-PI..PI), clockwise from a to b is positive.
export function signedAngle2(a, b) {
  return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
}

export class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  setFrom(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  addMul(other, r) {
    this.x += other.x * r;
    this.y += other.y * r;
    this.z += other.z * r;
    return this;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize() {
    const len = this.length();
    return this.mul(1 / len);
  }

  setLength(len) {
    return this.mul(len / this.length());
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    const ax = this.x,
      ay = this.y,
      az = this.z;
    const bx = v.x,
      by = v.y,
      bz = v.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
}

export function cross3(a, b) {
  return a.clone().cross(b);
}

export function sub3(a, b) {
  return a.clone().sub(b);
}

export function dist3(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2);
}

export class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  setFrom(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    if (other.w === undefined) this.w = 1;
    else this.w = other.w;
    return this;
  }
}

export class Mat3 {
  // prettier-ignore
  constructor(
    row0_0 = 0, row0_1 = 0, row0_2 = 0,
    row1_0 = 0, row1_1 = 0, row1_2 = 0,
    row2_0 = 0, row2_1 = 0, row2_2 = 0) {
    this.row0_0 = row0_0;
    this.row0_1 = row0_1;
    this.row0_2 = row0_2;
    this.row1_0 = row1_0;
    this.row1_1 = row1_1;
    this.row1_2 = row1_2;
    this.row2_0 = row2_0;
    this.row2_1 = row2_1;
    this.row2_2 = row2_2;
  }

  // prettier-ignore
  set(
    row0_0 = 0, row0_1 = 0, row0_2 = 0,
    row1_0 = 0, row1_1 = 0, row1_2 = 0,
    row2_0 = 0, row2_1 = 0, row2_2 = 0) {
    this.row0_0 = row0_0;
    this.row0_1 = row0_1;
    this.row0_2 = row0_2;
    this.row1_0 = row1_0;
    this.row1_1 = row1_1;
    this.row1_2 = row1_2;
    this.row2_0 = row2_0;
    this.row2_1 = row2_1;
    this.row2_2 = row2_2;
  }

  setFrom(mat) {
    this.row0_0 = mat.row0_0;
    this.row0_1 = mat.row0_1;
    this.row0_2 = mat.row0_2;
    this.row1_0 = mat.row1_0;
    this.row1_1 = mat.row1_1;
    this.row1_2 = mat.row1_2;
    this.row2_0 = mat.row2_0;
    this.row2_1 = mat.row2_1;
    this.row2_2 = mat.row2_2;
  }

  setCol(colIx, v) {
    // prettier-ignore
    if (colIx == 0)
      this.row0_0 = v.x, this.row1_0 = v.y, this.row2_0 = v.z;
    else if (colIx == 1)
      this.row0_1 = v.x, this.row1_1 = v.y, this.row2_1 = v.z;
    else if (colIx == 2)
      this.row0_2 = v.x, this.row1_2 = v.y, this.row2_2 = v.z;
  }

  mul(mat) {
    // prettier-ignore
    const a00 = this.row0_0, a01 = this.row0_1, a02 = this.row0_2;
    // prettier-ignore
    const a10 = this.row1_0, a11 = this.row1_1, a12 = this.row1_2;
    // prettier-ignore
    const a20 = this.row2_0, a21 = this.row2_1, a22 = this.row2_2;

    this.row0_0 = a00 * mat.row0_0 + a01 * mat.row1_0 + a02 * mat.row2_0;
    this.row0_1 = a00 * mat.row0_1 + a01 * mat.row1_1 + a02 * mat.row2_1;
    this.row0_2 = a00 * mat.row0_2 + a01 * mat.row1_2 + a02 * mat.row2_2;

    this.row1_0 = a10 * mat.row0_0 + a11 * mat.row1_0 + a12 * mat.row2_0;
    this.row1_1 = a10 * mat.row0_1 + a11 * mat.row1_1 + a12 * mat.row2_1;
    this.row1_2 = a10 * mat.row0_2 + a11 * mat.row1_2 + a12 * mat.row2_2;

    this.row2_0 = a20 * mat.row0_0 + a21 * mat.row1_0 + a22 * mat.row2_0;
    this.row2_1 = a20 * mat.row0_1 + a21 * mat.row1_1 + a22 * mat.row2_1;
    this.row2_2 = a20 * mat.row0_2 + a21 * mat.row1_2 + a22 * mat.row2_2;

    return this;
  }
}

export function mulMat3V3(mat, v, target) {
  // prettier-ignore
  const x = v.x, y = v.y, z = v.z;

  // prettier-ignore
  target.x = mat.row0_0 * x + mat.row0_1 * y + mat.row0_2 * z;
  // prettier-ignore
  target.y = mat.row1_0 * x + mat.row1_1 * y + mat.row1_2 * z;
  // prettier-ignore
  target.z = mat.row2_0 * x + mat.row2_1 * y + mat.row2_2 * z;
}
