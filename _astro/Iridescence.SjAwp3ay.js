import{Ht as e,Rt as t,b as n,ct as r,ft as i,g as a,k as o,mt as s,vn as c}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as l}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{n as u}from"./helpers.UgYeZch5.js";import{n as d}from"./composables.DpesNDid.js";import{i as f,n as p,r as m,t as h}from"./Triangle.CNfWbh8z.js";var g={black:`#000000`,white:`#ffffff`,red:`#ff0000`,green:`#00ff00`,blue:`#0000ff`,fuchsia:`#ff00ff`,cyan:`#00ffff`,yellow:`#ffff00`,orange:`#ff8000`};function _(e){e.length===4&&(e=e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t||console.warn(`Unable to convert hex string ${e} to rgb values`),[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]}function v(e){return e=parseInt(e),[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function y(e){return e===void 0?[0,0,0]:arguments.length===3?arguments:isNaN(e)?e[0]===`#`?_(e):g[e.toLowerCase()]?_(g[e.toLowerCase()]):(console.warn(`Color format not recognised`),[0,0,0]):v(e)}var b=class extends Array{constructor(e){return super(...Array.isArray(e)?e:y(...arguments))}get r(){return this[0]}get g(){return this[1]}get b(){return this[2]}set r(e){this[0]=e}set g(e){this[1]=e}set b(e){this[2]=e}set(e){return Array.isArray(e)?this.copy(e):this.copy(y(...arguments))}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this}},x=`
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,S=`
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`,C=o({__name:`Iridescence`,props:{color:{default:()=>({light:[1,1,1],dark:[.5,.5,.5]})},speed:{default:1},amplitude:{default:.1},mouseReact:{type:Boolean,default:!0}},setup(n,{expose:o}){o();let s=n,l=t(`containerRef`),g=c({x:.5,y:.5}),_=d(),v=[1,1,1],y=a(()=>u(s.color)?s.color[_.value?`dark`:`light`]||v:Array.isArray(s.color)?s.color:v),C=null,w=null,T=null,E=null,D=null;function O(){if(!l.value||!C||!T||!w)return;let e=l.value;C.setSize(e.offsetWidth*1,e.offsetHeight*1),T&&(T.uniforms.uResolution.value=new b(w.canvas.width,w.canvas.height,w.canvas.width/w.canvas.height))}function k(e){if(!l.value||!T)return;let t=l.value.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=1-(e.clientY-t.top)/t.height;g.value={x:n,y:r},T.uniforms.uMouse.value&&(T.uniforms.uMouse.value[0]=n,T.uniforms.uMouse.value[1]=r)}function A(e){!T||!C||!E||(D=requestAnimationFrame(A),T.uniforms.uTime.value=e*.001,C.render({scene:E}))}function j(){if(!l.value)return;M();let e=l.value;C=new m,w=C.gl,w.clearColor(1,1,1,1);let t=new h(w);T=new f(w,{vertex:x,fragment:S,uniforms:{uTime:{value:0},uColor:{value:new b(...y.value)},uResolution:{value:new b(w.canvas.width,w.canvas.height,w.canvas.width/w.canvas.height)},uMouse:{value:new Float32Array([g.value.x,g.value.y])},uAmplitude:{value:s.amplitude},uSpeed:{value:s.speed}}}),E=new p(w,{geometry:t,program:T});let n=w.canvas;n.style.width=`100%`,n.style.height=`100%`,n.style.display=`block`,e.appendChild(n),window.addEventListener(`resize`,O),s.mouseReact&&e.addEventListener(`mousemove`,k),O(),D=requestAnimationFrame(A)}function M(){if(D&&=(cancelAnimationFrame(D),null),window.removeEventListener(`resize`,O),l.value){l.value.removeEventListener(`mousemove`,k);let e=l.value.querySelector(`canvas`);e&&l.value.removeChild(e)}w&&w.getExtension(`WEBGL_lose_context`)?.loseContext(),C=null,w=null,T=null,E=null}r(()=>{j()}),i(()=>{M()}),e([y,()=>s.speed,()=>s.amplitude,()=>s.mouseReact],()=>{j()},{deep:!0});let N={props:s,containerRef:l,mousePos:g,isDark:_,DEFAULT_COLOR:v,color:y,get renderer(){return C},set renderer(e){C=e},get gl(){return w},set gl(e){w=e},get program(){return T},set program(e){T=e},get mesh(){return E},set mesh(e){E=e},get animationId(){return D},set animationId(e){D=e},vertexShader:x,fragmentShader:S,resize:O,handleMouseMove:k,update:A,initializeScene:j,cleanup:M};return Object.defineProperty(N,"__isScriptSetup",{enumerable:!1,value:!0}),N}}),w={ref:`containerRef`,class:`home-hero-effect-iridescence`};function T(e,t,r,i,a,o){return s(),n(`div`,w,null,512)}var E=l(C,[[`render`,T],[`__scopeId`,`data-v-57569e3d`]]);export{E as default};