import{Ht as e,Rt as t,_ as n,b as r,ct as i,ft as a,k as o,mt as s}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as c}from"./_plugin-vue_export-helper.BDNMzG2s.js";var l=`
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,u=`
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));

    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;

    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

    float dist = abs(uv.x);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
    col = pow(col, vec3(1.0));
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`,d=o({__name:`Lightning`,props:{hue:{default:255},xOffset:{default:0},speed:{default:1},intensity:{default:1},size:{default:1}},setup(n,{expose:r}){r();let o=n,s=t(`canvasRef`),c=0,d=null,f=null,p=0,m;function h(e,t){if(!d)return null;let n=d.createShader(t);return n?(d.shaderSource(n,e),d.compileShader(n),d.getShaderParameter(n,d.COMPILE_STATUS)?n:(console.error(`Shader compile error:`,d.getShaderInfoLog(n)),d.deleteShader(n),null)):null}function g(){let e=s.value;if(!e)return;let t=()=>{let t=e.getBoundingClientRect(),n=window.devicePixelRatio||1,r=t.width,i=t.height,a=e.parentElement;for(;a&&(!r||!i);){if(a.offsetWidth&&a.offsetHeight){r=a.offsetWidth,i=a.offsetHeight;break}a=a.parentElement}(!r||!i)&&(r=window.innerWidth,i=window.innerHeight),r=Math.max(r,300),i=Math.max(i,300),e.width=r*n,e.height=i*n,e.style.width=`100%`,e.style.height=`100%`,e.style.display=`block`,e.style.position=`absolute`,e.style.top=`0`,e.style.left=`0`};if(t(),window.addEventListener(`resize`,t),m=()=>window.removeEventListener(`resize`,t),d=e.getContext(`webgl`),!d){console.error(`WebGL not supported`);return}let n=h(l,d.VERTEX_SHADER),r=h(u,d.FRAGMENT_SHADER);if(!n||!r||(f=d.createProgram(),!f))return;if(d.attachShader(f,n),d.attachShader(f,r),d.linkProgram(f),!d.getProgramParameter(f,d.LINK_STATUS)){console.error(`Program linking error:`,d.getProgramInfoLog(f));return}d.useProgram(f);let i=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),a=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,a),d.bufferData(d.ARRAY_BUFFER,i,d.STATIC_DRAW);let o=d.getAttribLocation(f,`aPosition`);d.enableVertexAttribArray(o),d.vertexAttribPointer(o,2,d.FLOAT,!1,0,0),p=performance.now(),_()}function _(){if(!d||!f||!s.value)return;let e=s.value,t=e.getBoundingClientRect();(e.width!==t.width||e.height!==t.height)&&(e.width=t.width,e.height=t.height,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`),d.viewport(0,0,e.width,e.height);let n=d.getUniformLocation(f,`iResolution`),r=d.getUniformLocation(f,`iTime`),i=d.getUniformLocation(f,`uHue`),a=d.getUniformLocation(f,`uXOffset`),l=d.getUniformLocation(f,`uSpeed`),u=d.getUniformLocation(f,`uIntensity`),m=d.getUniformLocation(f,`uSize`);d.uniform2f(n,e.width,e.height);let h=performance.now();d.uniform1f(r,(h-p)/1e3),d.uniform1f(i,o.hue),d.uniform1f(a,o.xOffset),d.uniform1f(l,o.speed),d.uniform1f(u,o.intensity),d.uniform1f(m,o.size),d.drawArrays(d.TRIANGLES,0,6),c=requestAnimationFrame(_)}i(()=>{g()}),a(()=>{m?.(),c&&cancelAnimationFrame(c),d?.getExtension(`WEBGL_lose_context`)?.loseContext(),d=null,f=null}),e(()=>[o.hue,o.xOffset,o.speed,o.intensity,o.size],()=>{});let v={props:o,canvasRef:s,get animationId(){return c},set animationId(e){c=e},get gl(){return d},set gl(e){d=e},get program(){return f},set program(e){f=e},get startTime(){return p},set startTime(e){p=e},get cleanup(){return m},set cleanup(e){m=e},vertexShaderSource:l,fragmentShaderSource:u,compileShader:h,initWebGL:g,render:_};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}}),f={class:`home-hero-effect-lighting`},p={ref:`canvasRef`,class:`mix-blend-screen`};function m(e,t,i,a,o,c){return s(),r(`div`,f,[n(`canvas`,p,null,512)])}var h=c(d,[[`render`,m],[`__scopeId`,`data-v-11b14641`]]);export{h as default};