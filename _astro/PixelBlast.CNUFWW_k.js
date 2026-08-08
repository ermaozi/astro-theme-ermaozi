import{Ht as e,Rt as t,Zn as n,b as r,ct as i,er as a,g as o,it as s,k as c,mt as l,vn as u}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as d}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{A as f,B as p,E as m,F as h,N as g,U as _,V as v,d as y,q as b,r as x,u as S,y as C,z as w}from"./three.module.COK4q9ys.js";import{t as T}from"./composables.DpesNDid.js";import{a as E,i as D,n as O,r as k}from"./build.DynLeYJu.js";var A=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`,j=`
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  fragColor = vec4(color, M);
}
`,M=10,N=c({__name:`PixelBlast`,props:{variant:{default:`square`},pixelSize:{default:4},color:{default:``},className:{},style:{},antialias:{type:Boolean,default:!0},patternScale:{default:2},patternDensity:{default:1},liquid:{type:Boolean,default:!1},liquidStrength:{default:.1},liquidRadius:{default:1},pixelSizeJitter:{default:0},enableRipples:{type:Boolean,default:!0},rippleIntensityScale:{default:1},rippleThickness:{default:.1},rippleSpeed:{default:.3},liquidWobbleSpeed:{default:4.5},autoPauseOffscreen:{type:Boolean,default:!0},speed:{default:.5},transparent:{type:Boolean,default:!0},edgeFade:{default:.5},noiseAmount:{default:0},backgroundImage:{},backgroundAttachment:{}},setup(n,{expose:r}){r();let a=n;function c(){let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`);if(!t)throw Error(`2D context not available`);t.fillStyle=`black`,t.fillRect(0,0,e.width,e.height);let n=new v(e);n.minFilter=m,n.magFilter=m,n.generateMipmaps=!1;let r=[],i=null,a=6.4,o=()=>{t.fillStyle=`black`,t.fillRect(0,0,e.width,e.height)},s=e=>{let n={x:e.x*64,y:(1-e.y)*64},r=1;r=e.age<19.2?(e=>Math.sin(e*Math.PI/2))(e.age/19.2):(e=>-e*(e-2))(1-(e.age-19.2)/44.8)||0,r*=e.force;let i=`${(e.vx+1)/2*255}, ${(e.vy+1)/2*255}, ${r*255}`;t.shadowOffsetX=320,t.shadowOffsetY=320,t.shadowBlur=a,t.shadowColor=`rgba(${i},${.22*r})`,t.beginPath(),t.fillStyle=`rgba(255,0,0,1)`,t.arc(n.x-320,n.y-320,a,0,Math.PI*2),t.fill()};return{canvas:e,texture:n,addTouch:e=>{let t=0,n=0,a=0;if(i){let r=e.x-i.x,o=e.y-i.y;if(r===0&&o===0)return;let s=r*r+o*o,c=Math.sqrt(s);n=r/(c||1),a=o/(c||1),t=Math.min(s*1e4,1)}i={x:e.x,y:e.y},r.push({x:e.x,y:e.y,age:0,force:t,vx:n,vy:a})},update:()=>{o();for(let e=r.length-1;e>=0;e--){let t=r[e],n=t.force*.015625*(1-t.age/64);t.x+=t.vx*n,t.y+=t.vy*n,t.age++,t.age>64&&r.splice(e,1)}for(let e=0;e<r.length;e++)s(r[e]);n.needsUpdate=!0},set radiusScale(e){a=6.4*e},get radiusScale(){return a/6.4},size:64}}function l(e,t){return new O(`LiquidEffect`,`
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;

      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);

      float amt = uStrength * intensity * wave;

      uv += vec2(vx, vy) * amt;
    }
    `,{uniforms:new Map([[`uTexture`,new _(e)],[`uStrength`,new _(t?.strength??.025)],[`uTime`,new _(0)],[`uFreq`,new _(t?.freq??4.5)]])})}let d={square:0,circle:1,triangle:2,diamond:3},N=T(`--vp-c-brand-1`,`#5086a1`),P=o(()=>a.color||N.value),F=t(`containerRef`),I=u({visible:!0}),L=u(a.speed),R=u(null),z=u(null),B=null;function V(){let e=F.value;if(!e)return;L.value=a.speed;let t=[`antialias`,`liquid`,`noiseAmount`],n={antialias:a.antialias,liquid:a.liquid,noiseAmount:a.noiseAmount},r=!1;if(!R.value)r=!0;else if(z.value){for(let e of t)if(z.value[e]!==n[e]){r=!0;break}}if(r){if(R.value){let t=R.value;t.resizeObserver?.disconnect(),cancelAnimationFrame(t.raf),t.quad?.geometry.dispose(),t.material.dispose(),t.composer?.dispose(),t.renderer.dispose(),t.renderer.forceContextLoss(),t.renderer.domElement.parentElement===e&&e.removeChild(t.renderer.domElement),R.value=null}let t=document.createElement(`canvas`),n=t.getContext(`webgl2`,{antialias:a.antialias,alpha:!0});if(!n)return;let r=new x({canvas:t,context:n,antialias:a.antialias,alpha:!0});r.domElement.style.width=`100%`,r.domElement.style.height=`100%`,r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.appendChild(r.domElement);let i={uResolution:{value:new b(0,0)},uTime:{value:0},uColor:{value:new y(P.value)},uClickPos:{value:Array.from({length:M},()=>new b(-1,-1))},uClickTimes:{value:new Float32Array(M)},uShapeType:{value:d[a.variant]??0},uPixelSize:{value:a.pixelSize*r.getPixelRatio()},uScale:{value:a.patternScale},uDensity:{value:a.patternDensity},uPixelJitter:{value:a.pixelSizeJitter},uEnableRipples:{value:+!!a.enableRipples},uRippleSpeed:{value:a.rippleSpeed},uRippleThickness:{value:a.rippleThickness},uRippleIntensity:{value:a.rippleIntensityScale},uEdgeFade:{value:a.edgeFade}},o=new w,s=new g(-1,1,1,-1,0,1),u=new p({vertexShader:A,fragmentShader:j,uniforms:i,transparent:!0,glslVersion:C,depthTest:!1,depthWrite:!1}),m=new h(2,2),v=new f(m,u);o.add(v);let T=new S,N=()=>{let t=e.clientWidth||1,n=e.clientHeight||1;r.setSize(t,n,!1),i.uResolution.value.set(r.domElement.width,r.domElement.height),R.value?.composer&&R.value.composer.setSize(r.domElement.width,r.domElement.height),i.uPixelSize.value=a.pixelSize*r.getPixelRatio()};N();let F=new ResizeObserver(N);F.observe(e);let z=(()=>{if(typeof window<`u`&&window.crypto?.getRandomValues){let e=new Uint32Array(1);return window.crypto.getRandomValues(e),e[0]/4294967295}return Math.random()})()*1e3,B,V,H;if(a.liquid){V=c(),V.radiusScale=a.liquidRadius,B=new k(r);let e=new E(o,s);H=l(V.texture,{strength:a.liquidStrength,freq:a.liquidWobbleSpeed});let t=new D(s,H);t.renderToScreen=!0,B.addPass(e),B.addPass(t)}if(a.noiseAmount>0){B||(B=new k(r),B.addPass(new E(o,s)));let e=new O(`NoiseEffect`,`uniform float uTime; uniform float uAmount; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);} void mainUv(inout vec2 uv){} void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){ float n=hash(floor(uv*vec2(1920.0,1080.0))+floor(uTime*60.0)); float g=(n-0.5)*uAmount; outputColor=inputColor+vec4(vec3(g),0.0);} `,{uniforms:new Map([[`uTime`,new _(0)],[`uAmount`,new _(a.noiseAmount)]])}),t=new D(s,e);t.renderToScreen=!0,B&&B.passes.length>0&&B.passes.forEach(e=>{`renderToScreen`in e&&(e.renderToScreen=!1)}),B.addPass(t)}B&&B.setSize(r.domElement.width,r.domElement.height);let U=e=>{let t=r.domElement.getBoundingClientRect(),n=r.domElement.width/t.width,i=r.domElement.height/t.height;return{fx:(e.clientX-t.left)*n,fy:(t.height-(e.clientY-t.top))*i,w:r.domElement.width,h:r.domElement.height}};r.domElement.addEventListener(`pointerdown`,e=>{let{fx:t,fy:n}=U(e),r=R.value?.clickIx??0;i.uClickPos.value[r].set(t,n),i.uClickTimes.value[r]=i.uTime.value,R.value&&(R.value.clickIx=(r+1)%M)},{passive:!0}),r.domElement.addEventListener(`pointermove`,e=>{if(!V)return;let{fx:t,fy:n,w:r,h:i}=U(e);V.addTouch({x:t/r,y:n/i})},{passive:!0});let W=0,G=()=>{if(a.autoPauseOffscreen&&!I.value.visible){W=requestAnimationFrame(G);return}i.uTime.value=z+T.getElapsedTime()*L.value,H&&(H.uniforms.get(`uTime`).value=i.uTime.value),B?(V&&V.update(),B.passes.forEach(e=>{e instanceof D&&e.effects?.forEach(e=>{let t=e.uniforms.get(`uTime`);t&&(t.value=i.uTime.value)})}),B.render()):r.render(o,s),W=requestAnimationFrame(G)};W=requestAnimationFrame(G),R.value={renderer:r,scene:o,camera:s,material:u,clock:T,clickIx:0,uniforms:i,resizeObserver:F,raf:W,quad:v,timeOffset:z,composer:B,touch:V,liquidEffect:H}}else{let e=R.value;if(e.uniforms.uShapeType.value=d[a.variant]??0,e.uniforms.uPixelSize.value=a.pixelSize*e.renderer.getPixelRatio(),e.uniforms.uColor.value.set(P.value),e.uniforms.uScale.value=a.patternScale,e.uniforms.uDensity.value=a.patternDensity,e.uniforms.uPixelJitter.value=a.pixelSizeJitter,e.uniforms.uEnableRipples.value=+!!a.enableRipples,e.uniforms.uRippleIntensity.value=a.rippleIntensityScale,e.uniforms.uRippleThickness.value=a.rippleThickness,e.uniforms.uRippleSpeed.value=a.rippleSpeed,e.uniforms.uEdgeFade.value=a.edgeFade,a.transparent?e.renderer.setClearAlpha(0):e.renderer.setClearColor(0,1),e.liquidEffect){let t=e.liquidEffect?.uniforms.get(`uStrength`);t&&(t.value=a.liquidStrength);let n=e.liquidEffect?.uniforms.get(`uFreq`);n&&(n.value=a.liquidWobbleSpeed)}e.touch&&(e.touch.radiusScale=a.liquidRadius)}z.value=n,B=()=>{if(!R.value)return;let t=R.value;t.resizeObserver?.disconnect(),cancelAnimationFrame(t.raf),t.quad?.geometry.dispose(),t.material.dispose(),t.composer?.dispose(),t.renderer.dispose(),t.renderer.forceContextLoss(),t.renderer.domElement.parentElement===e&&e.removeChild(t.renderer.domElement),R.value=null}}i(()=>{V()}),s(()=>{B?.()}),e(a,()=>{B?.(),V()},{deep:!0});let H={props:a,createTouchTexture:c,createLiquidEffect:l,SHAPE_MAP:d,VERTEX_SRC:A,FRAGMENT_SRC:j,MAX_CLICKS:M,brandColor:N,color:P,containerRef:F,visibilityRef:I,speedRef:L,threeRef:R,prevConfigRef:z,get cleanup(){return B},set cleanup(e){B=e},setup:V};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}});function P(e,t,i,o,s,c){return l(),r(`div`,{ref:`containerRef`,class:n([`home-hero-effect-pixel-blast`,[i.className]]),style:a(i.style),"aria-label":`PixelBlast interactive background`},null,6)}var F=d(N,[[`render`,P],[`__scopeId`,`data-v-012c650c`]]);export{F as default};