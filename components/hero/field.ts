/** The hero's lens field: slow liquid bands of the electric blue on the canvas,
 *  seen partly through a drifting glass sphere, under film grain. Raw WebGL 1,
 *  no library, two passes over a full-screen triangle: the soft field renders
 *  at half resolution into a texture, then the sphere refracts that texture,
 *  grain goes on at full resolution, and every sheltered word gets its
 *  luminance cap, so no text loses its 4.5:1. */

type Rgb = readonly [number, number, number];

export interface Shelter {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** Highest relative luminance (0 to 1) the field may reach behind it. */
  readonly cap: number;
}

export interface Field {
  /** Draws one frame at `time` seconds of field time. */
  render(time: number): void;
  setPointer(x: number, y: number, active: boolean): void;
  setShelter(shelters: readonly Shelter[]): void;
  resize(width: number, height: number, dpr: number): void;
  dispose(): void;
}

const MAX_SHELTER = 32;
/** The field is soft, so half the CSS resolution is plenty; grain restores the detail. */
const FIELD_SCALE = 0.5;
const FIELD_MAX_SIDE = 1024;

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FIELD = `
precision highp float;
uniform vec2 uRes;
uniform float uAspect;
uniform float uTime;
uniform vec3 uPointer;
uniform vec3 uCanvas;
uniform vec3 uBlue;
uniform vec3 uInk;

// 3D simplex noise: Ian McEwan, Ashima Arts (MIT), github.com/ashima/webgl-noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  // Bottom-left origin, like the texture this pass fills.
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 st = vec2(uv.x * uAspect, uv.y) * 0.62;
  float t = uTime * 0.04;

  // The pointer parts the liquid around it.
  vec2 toPointer = st - vec2(uPointer.x * uAspect, uPointer.y) * 0.62;
  st += toPointer * exp(-dot(toPointer, toPointer) * 9.0) * 0.45 * uPointer.z;

  // Domain warp (after Inigo Quilez): noise bends the coordinates of noise.
  // One octave per step keeps the bands broad and soft.
  vec2 q = vec2(snoise(vec3(st, t)), snoise(vec3(st + vec2(5.2, 1.3), t)));
  vec2 r = vec2(snoise(vec3(st + 1.25 * q + vec2(1.7, 9.2), t * 1.2)), snoise(vec3(st + 1.25 * q + vec2(8.3, 2.8), t * 1.2)));
  float v = clamp(snoise(vec3(st + 1.1 * r, t * 0.8)) * 0.55 + 0.5, 0.0, 1.0);

  // One hue: canvas, a deep ink-blue, the blue, and a pale tint on the crests.
  vec3 deep = mix(uCanvas, uBlue, 0.14);
  vec3 col = mix(uCanvas, deep, smoothstep(0.3, 0.6, v));
  col = mix(col, uBlue * 0.78, smoothstep(0.56, 0.86, v));
  col = mix(col, mix(uBlue, uInk, 0.45), smoothstep(0.84, 1.0, v) * 0.7);

  // Dark-dominant: the light gathers to the right, away from where the words
  // start, and the hero meets the next section on the bare canvas.
  float light = 0.2 + 0.8 * smoothstep(0.25, 1.15, uv.x * 0.85 + uv.y * 0.45);
  col = mix(uCanvas, col, light * smoothstep(0.0, 0.3, uv.y));
  gl_FragColor = vec4(col, 1.0);
}
`;

const COMPOSITE = `
precision highp float;
uniform sampler2D uField;
uniform vec2 uSize;
uniform float uDpr;
uniform float uTime;
uniform vec3 uSphere;
uniform vec3 uCanvas;
uniform vec3 uBlue;
uniform vec3 uInk;
uniform vec4 uShelter[${MAX_SHELTER}];
uniform vec4 uCap[${MAX_SHELTER / 4}];

vec2 toUv(vec2 css) { return vec2(css.x / uSize.x, 1.0 - css.y / uSize.y); }

// Distance to a pill around the rect (the system's one rounded shape), grown
// just enough that the rect's corners sit inside it.
float sdShelter(vec2 p, vec4 r) {
  float radius = min(r.z, r.w) * 0.5;
  vec2 q = abs(p - (r.xy + r.zw * 0.5)) - r.zw * 0.5 + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius * 1.415;
}

// Hash without sine (Dave Hoskins, MIT): stable across GPUs.
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 toSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

void main() {
  // CSS pixels, origin top left, like the DOM rects in uShelter.
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 uv = toUv(p);
  vec3 col = texture2D(uField, uv).rgb;

  // The glass sphere: a ball lens that magnifies the field at its centre and
  // turns it over toward the rim (so the bands curve along the edge), splits
  // the channels a little there, and catches a thin line of light.
  vec2 d = (p - uSphere.xy) / uSphere.z;
  float rr = length(d);
  float inside = 1.0 - smoothstep(1.0 - 1.5 / uSphere.z, 1.0, rr);
  if (inside > 0.0) {
    float z = sqrt(max(0.0, 1.0 - rr * rr));
    float bend = 1.0 - z;
    float m = mix(-0.35, 0.85, z);
    float split = 0.05 * bend;
    vec3 glass = vec3(
      texture2D(uField, toUv(uSphere.xy + d * uSphere.z * (m - split))).r,
      texture2D(uField, toUv(uSphere.xy + d * uSphere.z * m)).g,
      texture2D(uField, toUv(uSphere.xy + d * uSphere.z * (m + split))).b
    );
    vec2 n = d / max(rr, 1e-4);
    float lit = max(0.0, dot(n, normalize(vec2(0.55, 0.85))));
    vec3 tint = mix(uBlue, uInk, 0.6);
    // A dark band inside the rim away from the light, a soft glow toward it,
    // and the thin bright line right at the edge.
    glass *= 1.0 - 0.7 * smoothstep(0.55, 0.97, rr) * (1.0 - lit);
    glass += tint * pow(bend, 3.0) * 0.35 * lit;
    glass += tint * pow(bend, 14.0) * (0.25 + 0.9 * lit);
    col = mix(col, glass, inside);
  }

  // The header and the pause control sit in a dusk along the top edge.
  col = mix(uCanvas, col, 0.3 + 0.7 * smoothstep(40.0, 240.0, p.y));

  // Film grain at 24 frames a second, seeded by field time, so a still frame
  // stays still. It fades out with the field at the bottom edge.
  float frame = mod(floor(uTime * 24.0), 97.0);
  float grain = hash12(gl_FragCoord.xy + frame * vec2(37.0, 17.0)) - 0.5;
  col += grain * 0.075 * smoothstep(0.0, 0.3, uv.y);

  // Every sheltered word caps the luminance behind it (hue kept), full strength
  // within 12px of it and easing off over the next 120px.
  vec3 lin = toLinear(clamp(col, 0.0, 1.0));
  float lum = max(dot(lin, vec3(0.2126, 0.7152, 0.0722)), 1e-5);
  float k = 1.0;
  for (int i = 0; i < ${MAX_SHELTER}; i++) {
    vec4 r = uShelter[i];
    if (r.z > 0.0) {
      vec4 caps = uCap[i / 4];
      int lane = i - (i / 4) * 4;
      float cap = lane == 0 ? caps.x : lane == 1 ? caps.y : lane == 2 ? caps.z : caps.w;
      float w = 1.0 - smoothstep(12.0, 132.0, sdShelter(p, r));
      k = min(k, mix(1.0, min(1.0, cap / lum), w));
    }
  }
  gl_FragColor = vec4(toSrgb(lin * k), 1.0);
}
`;

/** A renderer on `canvas`, or null where WebGL (or a shader, or rendering to
 *  a texture) isn't available. */
export function createField(canvas: HTMLCanvasElement, colors: { canvas: Rgb; blue: Rgb; ink: Rgb }): Field | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return null;

  const shelter = new Float32Array(MAX_SHELTER * 4);
  const caps = new Float32Array(MAX_SHELTER);
  const size = { width: 1, height: 1, dpr: 1 };
  // Eased state: the pointer as the liquid feels it, and the sphere's parallax.
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, strength: 0, target: 0, seen: false };
  const parallax = { x: 0, y: 0 };
  let last: number | null = null;
  let lost = false;
  let fieldProgram: WebGLProgram | null = null;
  let compositeProgram: WebGLProgram | null = null;
  let texture: WebGLTexture | null = null;
  let framebuffer: WebGLFramebuffer | null = null;
  let fieldRes = { width: 1, height: 1 };
  let fieldLoc: Record<string, WebGLUniformLocation | null> = {};
  let compositeLoc: Record<string, WebGLUniformLocation | null> = {};

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const link = (fragment: string, uniforms: readonly string[]) => {
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return null;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    // Both programs read the one triangle from attribute 0.
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    const loc = Object.fromEntries(uniforms.map((name) => [name, gl.getUniformLocation(program, name)]));
    return { program, loc };
  };

  const init = (): boolean => {
    const fieldPass = link(FIELD, ["uRes", "uAspect", "uTime", "uPointer", "uCanvas", "uBlue", "uInk"]);
    const compositePass = link(COMPOSITE, ["uField", "uSize", "uDpr", "uTime", "uSphere", "uCanvas", "uBlue", "uInk", "uShelter", "uCap"]);
    if (!fieldPass || !compositePass) return false;
    ({ program: fieldProgram, loc: fieldLoc } = fieldPass);
    ({ program: compositeProgram, loc: compositeLoc } = compositePass);

    // One triangle that covers the viewport.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // The half-resolution field lives in a texture. NPOT is fine in WebGL 1
    // with linear filtering, clamped edges and no mipmaps.
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!complete) return false;

    gl.useProgram(fieldProgram);
    gl.uniform3f(fieldLoc.uCanvas, ...colors.canvas);
    gl.uniform3f(fieldLoc.uBlue, ...colors.blue);
    gl.uniform3f(fieldLoc.uInk, ...colors.ink);
    gl.useProgram(compositeProgram);
    gl.uniform1i(compositeLoc.uField, 0);
    gl.uniform3f(compositeLoc.uCanvas, ...colors.canvas);
    gl.uniform3f(compositeLoc.uBlue, ...colors.blue);
    gl.uniform3f(compositeLoc.uInk, ...colors.ink);
    return true;
  };

  /** Where the sphere sits at `time`: large and partly off the upper right,
   *  on a slow idle drift, leaning a little toward the pointer. */
  const sphere = (time: number): [number, number, number] => {
    const { width: w, height: h } = size;
    const radius = 0.36 * Math.max(w, 0.8 * h) * (1 + 0.025 * Math.sin(time * 0.11));
    const x = 0.76 * w + 0.025 * w * Math.sin(time * 0.13) + parallax.x;
    const y = 0.24 * h + 0.03 * h * Math.sin(time * 0.17 + 1.3) + parallax.y;
    return [x, y, radius];
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    lost = !init();
    if (!lost) field.resize(size.width, size.height, size.dpr);
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  if (!init()) return null;

  const field: Field = {
    render(time) {
      if (lost || !fieldProgram || !compositeProgram) return;
      const dt = last === null ? 0 : Math.min(0.1, Math.max(0, time - last));
      last = time;
      // The liquid answers quickly, the heavy glass slowly.
      const quick = 1 - Math.exp(-dt * 4);
      const slow = 1 - Math.exp(-dt * 1.6);
      pointer.x += (pointer.tx - pointer.x) * quick;
      pointer.y += (pointer.ty - pointer.y) * quick;
      pointer.strength += (pointer.target - pointer.strength) * quick;
      const lean = pointer.target > 0 ? 0.12 : 0;
      parallax.x += ((pointer.tx - 0.5) * size.width * lean - parallax.x) * slow;
      parallax.y += ((0.5 - pointer.ty) * size.height * lean - parallax.y) * slow;

      // Unbound while it is the render target: a texture can't be read and written at once.
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, fieldRes.width, fieldRes.height);
      gl.useProgram(fieldProgram);
      gl.uniform1f(fieldLoc.uTime, time);
      gl.uniform3f(fieldLoc.uPointer, pointer.x, pointer.y, pointer.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(compositeProgram);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1f(compositeLoc.uTime, time);
      gl.uniform3f(compositeLoc.uSphere, ...sphere(time));
      gl.uniform4fv(compositeLoc.uShelter, shelter);
      gl.uniform4fv(compositeLoc.uCap, caps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    setPointer(x, y, active) {
      // Stored as field UV: 0 to 1, origin bottom left.
      pointer.tx = x / size.width;
      pointer.ty = 1 - y / size.height;
      pointer.target = active ? 1 : 0;
      // The first sighting places the push instead of sweeping in from the centre.
      if (active && !pointer.seen) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.seen = true;
      }
    },
    setShelter(shelters) {
      shelter.fill(0);
      caps.fill(1);
      shelters.slice(0, MAX_SHELTER).forEach((s, i) => {
        shelter.set([s.x, s.y, s.width, s.height], i * 4);
        caps[i] = s.cap;
      });
    },
    resize(width, height, dpr) {
      Object.assign(size, { width, height, dpr });
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      const scale = Math.min(FIELD_SCALE, FIELD_MAX_SIDE / Math.max(width, height, 1));
      fieldRes = { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
      if (lost || !fieldProgram || !compositeProgram) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fieldRes.width, fieldRes.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.useProgram(fieldProgram);
      gl.uniform2f(fieldLoc.uRes, fieldRes.width, fieldRes.height);
      gl.uniform1f(fieldLoc.uAspect, width / Math.max(height, 1));
      gl.useProgram(compositeProgram);
      gl.uniform2f(compositeLoc.uSize, width, height);
      gl.uniform1f(compositeLoc.uDpr, dpr);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
  return field;
}
