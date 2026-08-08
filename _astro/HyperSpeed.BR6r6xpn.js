import{Ht as e,Rt as t,b as n,ct as r,ft as i,k as a,mt as o}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as s}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{A as c,B as l,C as u,F as d,H as f,J as p,O as m,P as h,S as g,Y as _,d as v,q as y,r as ee,t as b,u as te,v as ne,w as re,z as ie}from"./three.module.COK4q9ys.js";import{a as ae,i as x,o as S,r as oe,s as C,t as se}from"./build.DynLeYJu.js";var w=`
  #define PI 3.14159265358979
  uniform vec2 uDistortionX;
  uniform vec2 uDistortionY;
  float nsin(float val){
    return sin(val) * 0.5 + 0.5;
  }
  vec3 getDistortion(float progress){
    progress = clamp(progress, 0., 1.);
    float xAmp = uDistortionX.r;
    float xFreq = uDistortionX.g;
    float yAmp = uDistortionY.r;
    float yFreq = uDistortionY.g;
    return vec3(
      xAmp * nsin(progress * PI * xFreq - PI / 2.),
      yAmp * nsin(progress * PI * yFreq - PI / 2.),
      0.
    );
  }
`,T=`
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
  highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
  }
`,E=`
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

  brokenLines = mix(brokenLines, sideLines, uv.x);
`,D=a({__name:`HyperSpeed`,props:{onSpeedUp:{type:Function,default:()=>{}},onSlowDown:{type:Function,default:()=>{}},distortion:{default:`turbulentDistortion`},length:{default:400},roadWidth:{default:10},islandWidth:{default:2},lanesPerRoad:{default:4},fov:{default:90},fovSpeedUp:{default:150},speedUp:{default:2},carLightsFade:{default:.4},totalSideLightSticks:{default:20},lightPairsPerRoadWay:{default:40},shoulderLinesWidthPercentage:{default:.05},brokenLinesWidthPercentage:{default:.1},brokenLinesLengthPercentage:{default:.5},lightStickWidth:{default:()=>[.12,.5]},lightStickHeight:{default:()=>[1.3,1.7]},movingAwaySpeed:{default:()=>[60,80]},movingCloserSpeed:{default:()=>[-120,-160]},carLightsLength:{default:()=>[12,80]},carLightsRadius:{default:()=>[.05,.14]},carWidthPercentage:{default:()=>[.3,.5]},carShiftX:{default:()=>[-.8,.8]},carFloorSeparation:{default:()=>[0,5]},colors:{default:()=>({roadColor:526344,islandColor:657930,background:0,shoulderLines:16777215,brokenLines:16777215,leftCars:[14177983,6770850,12732332],rightCars:[242627,941733,3294549],sticks:242627})},isHyper:{type:Boolean}},setup(n,{expose:a}){a();let o=n,s=t(`hyperspeedContainer`),D=null;function O(e){return Math.sin(e)*.5+.5}let k={uFreq:{value:new p(3,6,10)},uAmp:{value:new p(30,30,20)}},A={uFreq:{value:new y(5,2)},uAmp:{value:new y(25,15)}},j={uFreq:{value:new y(2,3)},uAmp:{value:new y(35,10)}},M={uFreq:{value:new _(4,8,8,1)},uAmp:{value:new _(25,5,10,10)}},N={uFreq:{value:new y(4,8)},uAmp:{value:new y(10,20)},uPowY:{value:new y(20,2)}},P={mountainDistortion:{uniforms:k,getDistortion:`
      uniform vec3 uAmp;
      uniform vec3 uFreq;
      #define PI 3.14159265358979
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
          nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
        );
      }
    `,getJS:(e,t)=>{let n=.02,r=k.uFreq.value,i=k.uAmp.value,a=new p(Math.cos(e*Math.PI*r.x+t)*i.x-Math.cos(n*Math.PI*r.x+t)*i.x,O(e*Math.PI*r.y+t)*i.y-O(n*Math.PI*r.y+t)*i.y,O(e*Math.PI*r.z+t)*i.z-O(n*Math.PI*r.z+t)*i.z),o=new p(2,2,2),s=new p(0,0,-5);return a.multiply(o).add(s)}},xyDistortion:{uniforms:A,getDistortion:`
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
          0.
        );
      }
    `,getJS:(e,t)=>{let n=.02,r=A.uFreq.value,i=A.uAmp.value,a=new p(Math.cos(e*Math.PI*r.x+t)*i.x-Math.cos(n*Math.PI*r.x+t)*i.x,Math.sin(e*Math.PI*r.y+t+Math.PI/2)*i.y-Math.sin(n*Math.PI*r.y+t+Math.PI/2)*i.y,0),o=new p(2,.4,1),s=new p(0,0,-3);return a.multiply(o).add(s)}},LongRaceDistortion:{uniforms:j,getDistortion:`
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float camProgress = 0.0125;
        return vec3(
          sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
          0.
        );
      }
    `,getJS:(e,t)=>{let n=.0125,r=j.uFreq.value,i=j.uAmp.value,a=new p(Math.sin(e*Math.PI*r.x+t)*i.x-Math.sin(n*Math.PI*r.x+t)*i.x,Math.sin(e*Math.PI*r.y+t)*i.y-Math.sin(n*Math.PI*r.y+t)*i.y,0),o=new p(1,1,0),s=new p(0,0,-5);return a.multiply(o).add(s)}},turbulentDistortion:{uniforms:M,getDistortion:`
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `,getJS:(e,t)=>{let n=M.uFreq.value,r=M.uAmp.value,i=e=>Math.cos(Math.PI*e*n.x+t)*r.x+Math.cos(Math.PI*e*n.y+t*(n.y/n.x))**2*r.y,a=e=>-O(Math.PI*e*n.z+t)*r.z-O(Math.PI*e*n.w+t/(n.z/n.w))**5*r.w,o=new p(i(e)-i(e+.007),a(e)-a(e+.007),0),s=new p(-2,-5,0),c=new p(0,0,-10);return o.multiply(s).add(c)}},turbulentDistortionStill:{uniforms:M,getDistortion:`
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r) * uAmp.r +
          pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.02),
          0.
        );
      }
    `},deepDistortionStill:{uniforms:N,getDistortion:`
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      uniform vec2 uPowY;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          sin(progress * PI * uFreq.x) * uAmp.x * 2.
        );
      }
      float getDistortionY(float progress){
        return (
          pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.05),
          0.
        );
      }
    `},deepDistortion:{uniforms:N,getDistortion:`
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      uniform vec2 uPowY;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          sin(progress * PI * uFreq.x + uTime) * uAmp.x
        );
      }
      float getDistortionY(float progress){
        return (
          pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.02),
          0.
        );
      }
    `,getJS:(e,t)=>{let n=N.uFreq.value,r=N.uAmp.value,i=N.uPowY.value,a=e=>Math.sin(e*Math.PI*n.x+t)*r.x,o=e=>(e*i.x)**i.y+Math.sin(e*Math.PI*n.y+t)*r.y,s=new p(a(e)-a(e+.01),o(e)-o(e+.01),0),c=new p(-2,-4,0),l=new p(0,0,-10);return s.multiply(c).add(l)}}},F={uDistortionX:{value:new y(80,3)},uDistortionY:{value:new y(-40,2.5)}};function I(e){return Array.isArray(e)?Math.random()*(e[1]-e[0])+e[0]:Math.random()*e}function L(e){return Array.isArray(e)?e[Math.floor(Math.random()*e.length)]:e}function R(e,t,n=.1,r=.001){let i=(t-e)*n;return Math.abs(i)<r&&(i=t-e),i}class z{webgl;options;colors;speed;fade;mesh;constructor(e,t,n,r,i){this.webgl=e,this.options=t,this.colors=n,this.speed=r,this.fade=i}init(){let e=this.options,t=new re(new p(0,0,0),new p(0,0,-1)),n=new f(t,40,1,8,!1),r=new u;for(let e in n.attributes)r.setAttribute(e,n.attributes[e]);n.index&&r.setIndex(n.index),r.instanceCount=e.lightPairsPerRoadWay*2;let i=e.roadWidth/e.lanesPerRoad,a=[],o=[],s=[],d;d=Array.isArray(this.colors)?this.colors.map(e=>new v(e)):[new v(this.colors)];for(let t=0;t<e.lightPairsPerRoadWay;t++){let n=I(e.carLightsRadius),r=I(e.carLightsLength),c=I(this.speed),l=t%e.lanesPerRoad*i-e.roadWidth/2+i/2,u=I(e.carWidthPercentage)*i,f=I(e.carShiftX)*i;l+=f;let p=I(e.carFloorSeparation)+n*1.3,m=-I(e.length);a.push(l-u/2),a.push(p),a.push(m),a.push(l+u/2),a.push(p),a.push(m),o.push(n),o.push(r),o.push(c),o.push(n),o.push(r),o.push(c);let h=L(d);s.push(h.r),s.push(h.g),s.push(h.b),s.push(h.r),s.push(h.g),s.push(h.b)}r.setAttribute(`aOffset`,new g(new Float32Array(a),3,!1)),r.setAttribute(`aMetrics`,new g(new Float32Array(o),3,!1)),r.setAttribute(`aColor`,new g(new Float32Array(s),3,!1));let m=new l({fragmentShader:B,vertexShader:V,transparent:!0,uniforms:Object.assign({uTime:{value:0},uTravelLength:{value:e.length},uFade:{value:this.fade}},this.webgl.fogUniforms,(typeof this.options.distortion==`object`?this.options.distortion.uniforms:{})||{})});m.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <getDistortion_vertex>`,typeof this.options.distortion==`object`?this.options.distortion.getDistortion:``)};let h=new c(r,m);h.frustumCulled=!1,this.webgl.scene.add(h),this.mesh=h}update(e){this.mesh.material.uniforms.uTime&&(this.mesh.material.uniforms.uTime.value=e)}}let B=`
  #define USE_FOG;
  ${b.fog_pars_fragment}
  varying vec3 vColor;
  varying vec2 vUv;
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${b.fog_fragment}
  }
`,V=`
  #define USE_FOG;
  ${b.fog_pars_vertex}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius;
    transformed.z *= myLength;

    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${b.fog_vertex}
  }
`;class H{webgl;options;mesh;constructor(e,t){this.webgl=e,this.options=t}init(){let e=this.options,t=new d(1,1),n=new u;for(let e in t.attributes)n.setAttribute(e,t.attributes[e]);t.index&&n.setIndex(t.index);let r=e.totalSideLightSticks;n.instanceCount=r;let i=e.length/(r-1),a=[],o=[],s=[],f;f=Array.isArray(e.colors.sticks)?e.colors.sticks.map(e=>new v(e)):[new v(e.colors.sticks)];for(let t=0;t<r;t++){let n=I(e.lightStickWidth),r=I(e.lightStickHeight);a.push((t-1)*i*2+i*Math.random());let c=L(f);o.push(c.r),o.push(c.g),o.push(c.b),s.push(n),s.push(r)}n.setAttribute(`aOffset`,new g(new Float32Array(a),1,!1)),n.setAttribute(`aColor`,new g(new Float32Array(o),3,!1)),n.setAttribute(`aMetrics`,new g(new Float32Array(s),2,!1));let p=new l({fragmentShader:W,vertexShader:U,side:2,uniforms:Object.assign({uTravelLength:{value:e.length},uTime:{value:0}},this.webgl.fogUniforms,(typeof e.distortion==`object`?e.distortion.uniforms:{})||{})});p.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <getDistortion_vertex>`,typeof this.options.distortion==`object`?this.options.distortion.getDistortion:``)};let m=new c(n,p);m.frustumCulled=!1,this.webgl.scene.add(m),this.mesh=m}update(e){this.mesh.material.uniforms.uTime&&(this.mesh.material.uniforms.uTime.value=e)}}let U=`
  #define USE_FOG;
  ${b.fog_pars_vertex}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY( in float angle ) {
    return mat4(
      cos(angle),   0,    sin(angle), 0,
      0,            1.0,  0,      0,
      -sin(angle),  0,    cos(angle), 0,
      0,            0,    0,      1
    );
  }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;

    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${b.fog_vertex}
  }
`,W=`
  #define USE_FOG;
  ${b.fog_pars_fragment}
  varying vec3 vColor;
  void main(){
    vec3 color = vec3(vColor);
    gl_FragColor = vec4(color,1.);
    ${b.fog_fragment}
  }
`;class G{webgl;options;uTime;leftRoadWay;rightRoadWay;island;constructor(e,t){this.webgl=e,this.options=t,this.uTime={value:0}}createPlane(e,t,n){let r=this.options,i=new d(n?r.roadWidth:r.islandWidth,r.length,20,100),a={uTravelLength:{value:r.length},uColor:{value:new v(n?r.colors.roadColor:r.colors.islandColor)},uTime:this.uTime};n&&(a=Object.assign(a,{uLanes:{value:r.lanesPerRoad},uBrokenLinesColor:{value:new v(r.colors.brokenLines)},uShoulderLinesColor:{value:new v(r.colors.shoulderLines)},uShoulderLinesWidthPercentage:{value:r.shoulderLinesWidthPercentage},uBrokenLinesLengthPercentage:{value:r.brokenLinesLengthPercentage},uBrokenLinesWidthPercentage:{value:r.brokenLinesWidthPercentage}}));let o=new l({fragmentShader:n?J:q,vertexShader:Y,side:2,uniforms:Object.assign(a,this.webgl.fogUniforms,(typeof r.distortion==`object`?r.distortion.uniforms:{})||{})});o.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <getDistortion_vertex>`,typeof this.options.distortion==`object`?this.options.distortion.getDistortion:``)};let s=new c(i,o);return s.rotation.x=-Math.PI/2,s.position.z=-r.length/2,s.position.x+=(this.options.islandWidth/2+r.roadWidth/2)*e,this.webgl.scene.add(s),s}init(){this.leftRoadWay=this.createPlane(-1,this.options.roadWidth,!0),this.rightRoadWay=this.createPlane(1,this.options.roadWidth,!0),this.island=this.createPlane(0,this.options.islandWidth,!1)}update(e){this.uTime.value=e}}let K=`
  #define USE_FOG;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  #include <roadMarkings_vars>
  ${b.fog_pars_fragment}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    #include <roadMarkings_fragment>
    gl_FragColor = vec4(color, 1.);
    ${b.fog_fragment}
  }
`,q=K.replace(`#include <roadMarkings_fragment>`,``).replace(`#include <roadMarkings_vars>`,``),J=K.replace(`#include <roadMarkings_fragment>`,E).replace(`#include <roadMarkings_vars>`,T),Y=`
  #define USE_FOG;
  uniform float uTime;
  ${b.fog_pars_vertex}
  uniform float uTravelLength;
  varying vec2 vUv;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${b.fog_vertex}
  }
`;function X(e,t){let n=e.domElement,r=n.parentElement;if(!r)return!1;let i=r.clientWidth,a=r.clientHeight,o=n.width!==i||n.height!==a;return o&&t(i,a,!1),o}class Z{container;options;renderer;composer;camera;scene;renderPass;bloomPass;clock;assets;disposed;road;leftCarLights;rightCarLights;leftSticks;fogUniforms;fovTarget;speedUpTarget;speedUp;timeOffset;resizeObserver;constructor(e,t){this.options=t,this.options.distortion||(this.options.distortion={uniforms:F,getDistortion:w}),this.container=e,this.renderer=new ee({antialias:!1,alpha:!0}),this.renderer.setSize(e.offsetWidth,e.offsetHeight,!1),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.domElement.style.display=`block`,this.renderer.domElement.style.width=`100%`,this.renderer.domElement.style.height=`100%`,this.composer=new oe(this.renderer),e.appendChild(this.renderer.domElement),this.camera=new h(t.fov,e.offsetWidth/e.offsetHeight,.1,1e4),this.camera.position.z=-5,this.camera.position.y=8,this.camera.position.x=0,this.scene=new ie,this.scene.background=null;let n=new ne(t.colors.background,t.length*.2,t.length*500);if(this.scene.fog=n,this.fogUniforms={fogColor:{value:n.color},fogNear:{value:n.near},fogFar:{value:n.far}},this.clock=new te,this.assets={},this.disposed=!1,this.road=new G(this,t),this.leftCarLights=new z(this,t,t.colors.leftCars,t.movingAwaySpeed,new y(0,1-t.carLightsFade)),this.rightCarLights=new z(this,t,t.colors.rightCars,t.movingCloserSpeed,new y(1,0+t.carLightsFade)),this.leftSticks=new H(this,t),this.fovTarget=t.fov,this.speedUpTarget=0,this.speedUp=0,this.timeOffset=0,this.tick=this.tick.bind(this),this.init=this.init.bind(this),this.setSize=this.setSize.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onWindowResize=this.onWindowResize.bind(this),typeof ResizeObserver<`u`){let t=new ResizeObserver(()=>{this.onWindowResize()});t.observe(e),this.resizeObserver=t}else window.addEventListener(`resize`,this.onWindowResize)}onWindowResize(){let e=this.container.offsetWidth,t=this.container.offsetHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.composer.setSize(e,t)}initPasses(){this.renderPass=new ae(this.scene,this.camera),this.bloomPass=new x(this.camera,new se({luminanceThreshold:.2,luminanceSmoothing:0,resolutionScale:1}));let e=new x(this.camera,new S({preset:C.MEDIUM}));this.renderPass.renderToScreen=!1,this.bloomPass.renderToScreen=!1,e.renderToScreen=!0,this.composer.addPass(this.renderPass),this.composer.addPass(this.bloomPass),this.composer.addPass(e)}loadAssets(){let e=this.assets;return new Promise(t=>{let n=new m(t),r=new Image,i=new Image;e.smaa={},r.addEventListener(`load`,function(){e.smaa.search=this,n.itemEnd(`smaa-search`)}),i.addEventListener(`load`,function(){e.smaa.area=this,n.itemEnd(`smaa-area`)}),n.itemStart(`smaa-search`),n.itemStart(`smaa-area`),r.src=S.searchImageDataURL,i.src=S.areaImageDataURL})}init(){this.initPasses();let e=this.options;this.road.init(),this.leftCarLights.init(),this.leftCarLights.mesh.position.setX(-e.roadWidth/2-e.islandWidth/2),this.rightCarLights.init(),this.rightCarLights.mesh.position.setX(e.roadWidth/2+e.islandWidth/2),this.leftSticks.init(),this.leftSticks.mesh.position.setX(-(e.roadWidth+e.islandWidth/2)),this.container.addEventListener(`mousedown`,this.onMouseDown),this.container.addEventListener(`mouseup`,this.onMouseUp),this.container.addEventListener(`mouseout`,this.onMouseUp),this.tick()}onMouseDown(e){this.options.onSpeedUp&&this.options.onSpeedUp(e),this.fovTarget=this.options.fovSpeedUp,this.speedUpTarget=this.options.speedUp}onMouseUp(e){this.options.onSlowDown&&this.options.onSlowDown(e),this.fovTarget=this.options.fov,this.speedUpTarget=0}update(e){let t=Math.exp(-(-60*Math.log2(.9))*e);this.speedUp+=R(this.speedUp,this.speedUpTarget,t,1e-5),this.timeOffset+=this.speedUp*e;let n=this.clock.elapsedTime+this.timeOffset;this.rightCarLights.update(n),this.leftCarLights.update(n),this.leftSticks.update(n),this.road.update(n);let r=!1,i=R(this.camera.fov,this.fovTarget,t);if(i!==0&&(this.camera.fov+=i*e*6,r=!0),typeof this.options.distortion==`object`&&this.options.distortion.getJS){let e=this.options.distortion.getJS(.025,n);this.camera.lookAt(new p(this.camera.position.x+e.x,this.camera.position.y+e.y,this.camera.position.z+e.z)),r=!0}r&&this.camera.updateProjectionMatrix()}render(e){this.composer.render(e)}dispose(){this.disposed=!0,this.resizeObserver?this.resizeObserver.disconnect():window.removeEventListener(`resize`,this.onWindowResize),this.renderer&&(this.renderer.dispose(),this.renderer.forceContextLoss()),this.composer&&this.composer.dispose(),this.scene&&this.scene.clear(),this.container&&(this.container.removeEventListener(`mousedown`,this.onMouseDown),this.container.removeEventListener(`mouseup`,this.onMouseUp),this.container.removeEventListener(`mouseout`,this.onMouseUp))}setSize(e,t,n){this.composer.setSize(e,t,n)}tick(){if(this.disposed||!this)return;let e=this.container.offsetWidth,t=this.container.offsetHeight;X(this.renderer,this.setSize)&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix());let n=this.clock.getDelta();this.render(n),this.update(n),requestAnimationFrame(this.tick)}}async function Q(){if(D){D.dispose();let e=s.value;if(e)for(;e.firstChild;)e.removeChild(e.firstChild)}let e=s.value;if(!e)return;let t={...o};typeof t.distortion==`string`&&(t.distortion=P[t.distortion]);let n=new Z(e,t);D=n,await n.loadAssets(),n.init()}r(()=>{Q()}),i(()=>{D&&=(D.dispose(),null)}),e(()=>o,()=>{Q()},{deep:!0});let $={props:o,hyperspeedContainer:s,get appRef(){return D},set appRef(e){D=e},nsin:O,mountainUniforms:k,xyUniforms:A,LongRaceUniforms:j,turbulentUniforms:M,deepUniforms:N,distortions:P,distortion_uniforms:F,distortion_vertex:w,random:I,pickRandom:L,lerp:R,CarLights:z,carLightsFragment:B,carLightsVertex:V,LightsSticks:H,sideSticksVertex:U,sideSticksFragment:W,Road:G,roadBaseFragment:K,islandFragment:q,roadMarkings_vars:T,roadMarkings_fragment:E,roadFragment:J,roadVertex:Y,resizeRendererToDisplaySize:X,App:Z,initHyperspeed:Q};return Object.defineProperty($,"__isScriptSetup",{enumerable:!1,value:!0}),$}}),O={ref:`hyperspeedContainer`,class:`home-hero-hyperspeed`};function k(e,t,r,i,a,s){return o(),n(`div`,O,null,512)}var A=s(D,[[`render`,k],[`__scopeId`,`data-v-6103dcc7`]]);export{A as default};