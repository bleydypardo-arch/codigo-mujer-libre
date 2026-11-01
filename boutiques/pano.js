/* Visor esférico mínimo (WebGL). Una imagen equirectangular se pega por dentro de una esfera:
   arrastras para girar, la cámara está en el centro. span = grados horizontales que cubre la imagen. */
window.CMLPano = function (canvas, img, o) {
  o = o || {};
  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) return null;
  const spanH = o.span || 360, spanV = spanH / 2, full = spanH >= 359;
  const rad = d => d * Math.PI / 180;
  /* esfera: lon de -spanH/2 a +spanH/2, lat de +spanV/2 a -spanV/2 */
  const N = 64, M = 40, pos = [], uv = [], idx = [];
  for (let j = 0; j <= M; j++) for (let i = 0; i <= N; i++) {
    const u = i / N, v = j / M, lon = rad((u - .5) * spanH), lat = rad((.5 - v) * spanV);
    pos.push(Math.sin(lon) * Math.cos(lat), Math.sin(lat), -Math.cos(lon) * Math.cos(lat)); uv.push(u, v);
  }
  for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + N + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec3 p;attribute vec2 t;uniform mat4 m;varying vec2 v;void main(){v=t;gl_Position=m*vec4(p,1.);}"));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, "precision mediump float;varying vec2 v;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,v);}"));
  gl.linkProgram(pr); gl.useProgram(pr);
  const buf = (d, t) => { const b = gl.createBuffer(); gl.bindBuffer(t, b); gl.bufferData(t, d, gl.STATIC_DRAW); return b; };
  buf(new Float32Array(pos), gl.ARRAY_BUFFER); const lp = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 3, gl.FLOAT, false, 0, 0);
  buf(new Float32Array(uv), gl.ARRAY_BUFFER); const lt = gl.getAttribLocation(pr, "t"); gl.enableVertexAttribArray(lt); gl.vertexAttribPointer(lt, 2, gl.FLOAT, false, 0, 0);
  buf(new Uint16Array(idx), gl.ELEMENT_ARRAY_BUFFER);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const lm = gl.getUniformLocation(pr, "m");
  const S = { yaw: o.yaw || 0, pitch: o.pitch || 0, fov: o.fov || 80, w: 1, h: 1 }, pMin = o.pitchMin == null ? -90 : o.pitchMin, pMax = o.pitchMax == null ? 90 : o.pitchMax;
  const vlim = () => { const vf = rad(S.fov), asp = S.w / S.h, hf = 2 * Math.atan(Math.tan(vf / 2) * asp); return { vf, hf }; };
  function clamp() {
    const { vf, hf } = vlim(), maxP = Math.max(0, spanV / 2 - vf * 90 / Math.PI), maxY = Math.max(0, spanH / 2 - hf * 90 / Math.PI);
    S.pitch = Math.max(Math.max(-maxP, pMin), Math.min(Math.min(maxP, pMax), S.pitch));
    if (full) { S.yaw = ((S.yaw + 180) % 360 + 360) % 360 - 180; } else S.yaw = Math.max(-maxY, Math.min(maxY, S.yaw));
  }
  function rows() { const y = rad(S.yaw), p = rad(S.pitch), cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
    return [[cy, 0, sy], [-sp * sy, cp, sp * cy], [-cp * sy, -sp, cp * cy]]; }
  function matrix() {
    const f = 1 / Math.tan(rad(S.fov) / 2), a = S.w / S.h, n = .1, fa = 1000, m = rows(), out = new Float32Array(16);
    for (let c = 0; c < 3; c++) { out[c * 4] = m[0][c] * f / a; out[c * 4 + 1] = m[1][c] * f; out[c * 4 + 2] = m[2][c] * (fa + n) / (n - fa); out[c * 4 + 3] = -m[2][c]; }
    out[14] = 2 * fa * n / (n - fa); out[15] = 0; return out;
  }
  function size() { const r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); S.w = Math.max(1, r.width); S.h = Math.max(1, r.height); canvas.width = S.w * d; canvas.height = S.h * d; gl.viewport(0, 0, canvas.width, canvas.height); }
  function draw() { clamp(); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniformMatrix4fv(lm, false, matrix()); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0); }
  /* punto (x%, y%) de la imagen -> pantalla (null si está detrás) */
  function project(xp, yp) {
    const lon = rad((xp / 100 - .5) * spanH), lat = rad((.5 - yp / 100) * spanV);
    const x = Math.sin(lon) * Math.cos(lat), y = Math.sin(lat), z = -Math.cos(lon) * Math.cos(lat), m = rows();
    const X = m[0][0] * x + m[0][1] * y + m[0][2] * z, Y = m[1][0] * x + m[1][1] * y + m[1][2] * z, Z = m[2][0] * x + m[2][1] * y + m[2][2] * z;
    if (Z >= -0.05) return null;
    const f = 1 / Math.tan(rad(S.fov) / 2), a = S.w / S.h;
    return { x: (X * f / a / -Z * .5 + .5) * S.w, y: (.5 - Y * f / -Z * .5) * S.h };
  }
  size(); window.addEventListener("resize", () => { size(); draw(); });
  return { S, draw, project, size, rad };
};
