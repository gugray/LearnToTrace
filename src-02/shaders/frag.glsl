#version 300 es
precision highp float;

uniform sampler2D txTile;
uniform vec2 resolution;
uniform vec3 camPos;
uniform mat3 camMat;
uniform float time;
out vec4 outColor;

const float zWall = -8.0;
const float szTile = 20.0;

// Rotation matrix around the X axis
mat4 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
    vec4(1, 0, 0, 0),
    vec4(0, c, -s, 0),
    vec4(0, s, c, 0),
    vec4(0, 0, 0, 1)
    );
}

vec3 doRotX(vec3 p, float theta) {
    mat4 trans = rotateX(theta);
    return (trans * vec4(p, 1.)).xyz;
}

// Rotation matrix around the Y axis.
mat4 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
    vec4(c, 0, s, 0),
    vec4(0, 1, 0, 0),
    vec4(-s, 0, c, 0),
    vec4(0, 0, 0, 1)
    );
}

vec3 doRotY(vec3 p, float theta) {
    mat4 trans = rotateY(theta);
    return (trans * vec4(p, 1.)).xyz;
}

// Rotation matrix around the Z axis.
mat4 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
    vec4(c, -s, 0, 0),
    vec4(s, c, 0, 0),
    vec4(0, 0, 1, 0),
    vec4(0, 0, 0, 1)
    );
}

vec3 doRotZ(vec3 p, float theta) {
    mat4 trans = rotateZ(theta);
    return (trans * vec4(p, 1.)).xyz;
}

vec3 background(vec3 ro, vec3 rd) {
    // Ray-wall intersection
    float rt = (zWall - ro.z) / rd.z;
    vec3 wpt = ro + rt * rd;
    wpt.y *= -1.0;
    // Texture at this XY
    vec2 txc = vec2(wpt.xy) / vec2(szTile) + vec2(0.5);
    txc.x += time * 0.03;
    return texture(txTile, fract(txc)).rgb;
}

float scene(vec3 pos) {
    // Sphere
    // return length(pos - sphere1.xyz) - sphere1.w;

    // pos.z += 2. * sin(time);

    pos = doRotZ(pos, time * 0.3);
    pos = doRotY(pos, time * 0.34);
    pos = doRotX(pos, time * 0.37);
    vec3 q = abs(pos) - vec3(3.0, 2.0, 1.5);
    float d = length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    return d - 0.05;

}

vec3 calcNormal(vec3 pos) {
    const float eps = 0.002;

    const vec3 v1 = vec3(1.0, -1.0, -1.0);
    const vec3 v2 = vec3(-1.0, -1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0, -1.0);
    const vec3 v4 = vec3(1.0, 1.0, 1.0);

    return normalize(v1 * scene(pos + v1 * eps) +
    v2 * scene(pos + v2 * eps) +
    v3 * scene(pos + v3 * eps) +
    v4 * scene(pos + v4 * eps));
}

vec3 march(vec3 ro, vec3 rd) {

    const float ior = 1.1;
    const float eps = 0.001;
    const float inner_escape = eps * 10.0;
    const float max_travel = 20.5;
    const int max_intersections = 4;
    const int max_steps = 90;
    float travel = 0.0;
    float nf = 1.0;
    vec3 c = vec3(0.0);
    float cr = 1.0;
    bool finished = false;
    int isects;
    for (isects = 0; !finished && isects < max_intersections; ++isects)
    {
        for (int i = 0; i < max_steps; ++i)
        {
            if (travel > max_travel)
            {
                finished = true;
                break;
            }

            vec3 pt = ro + rd * travel;
            float dist = nf * scene(pt);
            // if (nf < 0.0) dist = abs(dist);
            if (dist > eps)
            {
                travel += dist;
                continue;
            }

            vec3 n = calcNormal(pt) * nf;
            vec3 r = refract(rd, n, nf > 0.0 ? 1.0 / ior : ior);

            // Attenuation inside the material
            if (nf < 0.0)
            {
                float fa = travel * 0.025;
                c += vec3(0.8, 0.04, 0.1) * fa * cr;
                cr *= 1.0 - fa;
            }

            // Total internal reflection
            if (r == vec3(0.0))
            {
                rd = reflect(rd, n);
            }
            // Refraction
            else
            {
                // Mix in a little reflection, preserve energy, refract
                float f = 0.0;
                if (nf < 0.0) f = 0.0;
                c += background(pt, reflect(rd, n)) * f * cr;
                cr *= 1.0 - f;
                rd = r;
                nf *= -1.0;
            }
            // New intersection; restart marching
            ro = pt;
            travel = inner_escape;
            break;
        }
        if (finished) break;
    }
    if (isects > 0) return c + background(ro, rd) * cr;
    else return background(ro, rd);
    //else return vec3(0);
}

void main() {
    outColor.a = 1.0;

    float ar = resolution.x / resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution - vec2(0.5);
    vec3 nc = vec3(uv.x, uv.y / ar, 1.0);
    vec3 rd = normalize(camMat * nc);
    vec3 ro = camPos;

    //vec3 bg = background(ro, rd);
    vec3 clr = march(ro, rd);
    outColor.rgb = clr;
}
