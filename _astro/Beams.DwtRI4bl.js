import{Ht as e,Rt as t,b as n,ct as r,ft as i,g as a,k as o,mt as s}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as c}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{A as l,B as u,P as d,W as f,b as p,d as m,h,i as g,j as _,n as v,o as y,r as b,s as x,z as S}from"./three.module.COK4q9ys.js";import{n as C}from"./helpers.UgYeZch5.js";import{n as w}from"./composables.DpesNDid.js";var T=Math.PI/180;180/Math.PI;function E(e){return e*T}var D=`#fff`,O=`
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`,k=o({__name:`Beams`,props:{beamWidth:{default:2},beamHeight:{default:15},beamNumber:{default:12},lightColor:{default:`#fff`},speed:{default:2},noiseIntensity:{default:1.75},scale:{default:.2},rotation:{default:0}},setup(n,{expose:o}){o();let s=n,c=w(),T=a(()=>typeof s.lightColor==`string`?s.lightColor||D:C(s.lightColor)&&(s.lightColor[c.value?`dark`:`light`]||s.lightColor.light)||D),k=t(`containerRef`),A=null,j=null,M=null,N=null,P=null,F=null,I=null;function L(e){let t=e.replace(`#`,``),n=Number.parseInt(t.substring(0,2),16),r=Number.parseInt(t.substring(2,4),16),i=Number.parseInt(t.substring(4,6),16);return[n/255,r/255,i/255]}function R(e,t){let n=v.physical,{vertexShader:r,fragmentShader:i,uniforms:a}=n,o=n.defines??{},s=f.clone(a),c=new e(t.material||{});c.color&&(s.diffuse.value=c.color),`roughness`in c&&(s.roughness.value=c.roughness),`metalness`in c&&(s.metalness.value=c.metalness),`envMap`in c&&(s.envMap.value=c.envMap),`envMapIntensity`in c&&(s.envMapIntensity.value=c.envMapIntensity),Object.entries(t.uniforms??{}).forEach(([e,t])=>{s[e]=typeof t==`object`&&t&&`value`in t?t:{value:t}});let l=`${t.header}\n${t.vertexHeader??``}\n${r}`,d=`${t.header}\n${t.fragmentHeader??``}\n${i}`;for(let[e,n]of Object.entries(t.vertex??{}))l=l.replace(e,`${e}\n${n}`);for(let[e,n]of Object.entries(t.fragment??{}))d=d.replace(e,`${e}\n${n}`);return new u({defines:{...o},uniforms:s,vertexShader:l,fragmentShader:d,lights:!0,fog:!!t.material?.fog})}function z(e,t,n,r,i){let a=new x,o=e*(i+1)*2,s=e*i*2,c=new Float32Array(o*3),l=new Uint32Array(s*3),u=new Float32Array(o*2),d=0,f=0,p=0,m=-(e*t+(e-1)*r)/2;for(let a=0;a<e;a++){let e=m+a*(t+r),o=Math.random()*300,s=Math.random()*300;for(let r=0;r<=i;r++){let a=n*(r/i-.5),m=[e,a,0],h=[e+t,a,0];c.set([...m,...h],d*3);let g=r/i;if(u.set([o,g+s,o+1,g+s],p),r<i){let e=d,t=d+1,n=d+2,r=d+3;l.set([e,t,n,n,t,r],f),f+=6}d+=2,p+=4}}return a.setAttribute(`position`,new y(c,3)),a.setAttribute(`uv`,new y(u,2)),a.setIndex(new y(l,1)),a.computeVertexNormals(),a}let B=a(()=>R(_,{header:`
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${O}`,vertexHeader:`
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }
  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }
  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,fragmentHeader:``,vertex:{"#include <begin_vertex>":`transformed.z += getPos(transformed.xyz);`,"#include <beginnormal_vertex>":`objectNormal = getNormal(position.xyz);`},fragment:{"#include <dithering_fragment>":`
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`},material:{fog:!0},uniforms:{diffuse:new m(...L(`#000000`)),time:{shared:!0,mixed:!0,linked:!0,value:0},roughness:.3,metalness:.3,uSpeed:{shared:!0,mixed:!0,linked:!0,value:s.speed},envMapIntensity:10,uNoiseIntensity:s.noiseIntensity,uScale:s.scale}}));function V(){if(!k.value)return;H();let e=k.value;A=new b({antialias:!0}),A.setPixelRatio(Math.min(window.devicePixelRatio,2)),A.setClearColor(0,1),j=new S,M=new d(30,1,.1,1e3),M.position.set(0,0,20);let t=z(s.beamNumber,s.beamWidth,s.beamHeight,0,100),n=B.value;N=new l(t,n);let r=new p;r.rotation.z=E(s.rotation),r.add(N),j.add(r),P=new h(new m(T.value),1),P.position.set(0,3,10);let i=P.shadow.camera;i.top=24,i.bottom=-24,i.left=-24,i.right=24,i.far=64,P.shadow.bias=-.004,j.add(P),F=new g(16777215,1),j.add(F),e.appendChild(A.domElement);let a=()=>{if(!e||!A||!M)return;let t=e.offsetWidth,n=e.offsetHeight;A.setSize(t,n),M.aspect=t/n,M.updateProjectionMatrix()},o=new ResizeObserver(a);o.observe(e),a();let c=()=>{I=requestAnimationFrame(c),N&&N.material&&(N.material.uniforms.time.value+=.0016),A&&j&&M&&A.render(j,M)};I=requestAnimationFrame(c),e._resizeObserver=o}function H(){if(I&&=(cancelAnimationFrame(I),null),k.value){let e=k.value;e._resizeObserver&&(e._resizeObserver.disconnect(),delete e._resizeObserver),A&&A.domElement.parentNode===e&&e.removeChild(A.domElement)}N&&=(N.geometry&&N.geometry.dispose(),N.material&&N.material.dispose(),null),A&&=(A.dispose(),A.forceContextLoss(),null),j=null,M=null,P=null,F=null}e(()=>[s.beamWidth,s.beamHeight,s.beamNumber,s.lightColor,s.speed,s.noiseIntensity,s.scale,s.rotation],()=>{V()},{deep:!0}),r(()=>{V()}),i(()=>{H(),A=null,j=null,M=null,N=null,P=null,F=null});let U={props:s,isDark:c,DEFAULT_LIGHT_COLOR:D,lightColor:T,containerRef:k,get renderer(){return A},set renderer(e){A=e},get scene(){return j},set scene(e){j=e},get camera(){return M},set camera(e){M=e},get beamMesh(){return N},set beamMesh(e){N=e},get directionalLight(){return P},set directionalLight(e){P=e},get ambientLight(){return F},set ambientLight(e){F=e},get animationId(){return I},set animationId(e){I=e},hexToNormalizedRGB:L,noise:O,extendMaterial:R,createStackedPlanesBufferGeometry:z,beamMaterial:B,initThreeJS:V,cleanup:H};return Object.defineProperty(U,"__isScriptSetup",{enumerable:!1,value:!0}),U}}),A={ref:`containerRef`,class:`home-hero-effect-beams`};function j(e,t,r,i,a,o){return s(),n(`div`,A,null,512)}var M=c(k,[[`render`,j],[`__scopeId`,`data-v-7d45be68`]]);export{M as default};