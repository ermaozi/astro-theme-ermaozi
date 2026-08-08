import{Ht as e,Rt as t,b as n,ct as r,it as i,k as a,mt as o}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as s}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{i as c,n as l,r as u,t as d}from"./Triangle.CNfWbh8z.js";var f=a({__name:`Prism`,props:{height:{default:3.5},baseWidth:{default:5.5},animationType:{default:`rotate`},glow:{default:1},offset:{default:()=>({x:0,y:0})},noise:{default:0},transparent:{type:Boolean,default:!0},scale:{default:3.6},hueShift:{default:0},colorFrequency:{default:1},hoverStrength:{default:2},inertia:{default:.05},bloom:{default:1},suspendWhenOffscreen:{type:Boolean,default:!0},timeScale:{default:.5}},setup(n,{expose:a}){a();let o=n,s=t(`containerRef`),f=null;function p(){let e=s.value;if(!e)return;let t=Math.max(.001,o.height),n=Math.max(.001,o.baseWidth)*.5,r=Math.max(0,o.glow),i=Math.max(0,o.noise),a=o.offset?.x??0,p=o.offset?.y??0,m=o.transparent?1.5:1,h=Math.max(.001,o.scale),g=o.hueShift||0,_=Math.max(0,o.colorFrequency||1),v=Math.max(0,o.bloom||1),y=Math.max(0,o.timeScale||1),b=Math.max(0,o.hoverStrength||1),x=Math.max(0,Math.min(1,o.inertia||.12)),S=Math.min(2,window.devicePixelRatio||1),C=new u({dpr:S,alpha:o.transparent,antialias:!1}),w=C.gl;w.disable(w.DEPTH_TEST),w.disable(w.CULL_FACE),w.disable(w.BLEND),Object.assign(w.canvas.style,{position:`absolute`,inset:`0`,width:`100%`,height:`100%`,display:`block`}),e.appendChild(w.canvas);let T=new d(w),E=new Float32Array(2),D=new Float32Array(2),O=new c(w,{vertex:`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,fragment:`
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `,uniforms:{iResolution:{value:E},iTime:{value:0},uHeight:{value:t},uBaseHalf:{value:n},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:r},uOffsetPx:{value:D},uNoise:{value:i},uSaturation:{value:m},uScale:{value:h},uHueShift:{value:g},uColorFreq:{value:_},uBloom:{value:v},uCenterShift:{value:t*.25},uInvBaseHalf:{value:1/n},uInvHeight:{value:1/t},uMinAxis:{value:Math.min(n,t)},uPxScale:{value:1/((w.drawingBufferHeight||1)*.1*h)},uTimeScale:{value:y}}}),ee=new l(w,{geometry:T,program:O}),k=()=>{let t=e.clientWidth||1,n=e.clientHeight||1;C.setSize(t,n),E[0]=w.drawingBufferWidth,E[1]=w.drawingBufferHeight,D[0]=a*S,D[1]=p*S,O.uniforms.uPxScale.value=1/((w.drawingBufferHeight||1)*.1*h)},A=new ResizeObserver(k);A.observe(e),k();let j=new Float32Array(9),M=(e,t,n,r)=>{let i=Math.cos(e),a=Math.sin(e),o=Math.cos(t),s=Math.sin(t),c=Math.cos(n),l=Math.sin(n),u=i*c+a*s*l,d=-i*l+a*s*c,f=a*o,p=o*l,m=o*c,h=-s,g=-a*c+i*s*l,_=a*l+i*s*c,v=i*o;return r[0]=u,r[1]=p,r[2]=g,r[3]=d,r[4]=m,r[5]=_,r[6]=f,r[7]=h,r[8]=v,r},te=i<1e-6,N=0,P=performance.now(),F=()=>{N||=requestAnimationFrame($)},I=()=>{N&&=(cancelAnimationFrame(N),0)},L=()=>Math.random(),R=(.3+L()*.6)*1,z=(.2+L()*.7)*1,B=(.1+L()*.5)*1,V=L()*Math.PI*2,H=L()*Math.PI*2,U=0,W=0,G=0,K=0,q=0,J=(e,t,n)=>e+(t-e)*n,Y={x:0,y:0,inside:!0},ne=e=>{let t=Math.max(1,window.innerWidth),n=Math.max(1,window.innerHeight),r=t*.5,i=n*.5,a=(e.clientX-r)/(t*.5),o=(e.clientY-i)/(n*.5);Y.x=Math.max(-1,Math.min(1,a)),Y.y=Math.max(-1,Math.min(1,o)),Y.inside=!0},X=()=>{Y.inside=!1},Z=()=>{Y.inside=!1},Q=null;o.animationType===`hover`?(Q=e=>{ne(e),F()},window.addEventListener(`pointermove`,Q,{passive:!0}),window.addEventListener(`mouseleave`,X),window.addEventListener(`blur`,Z),O.uniforms.uUseBaseWobble.value=0):o.animationType===`3drotate`?O.uniforms.uUseBaseWobble.value=0:O.uniforms.uUseBaseWobble.value=1;let $=e=>{let t=(e-P)*.001;O.uniforms.iTime.value=t;let n=!0;if(o.animationType===`hover`){let e=.6*b,t=.6*b;K=(Y.inside?-Y.x:0)*t,q=(Y.inside?Y.y:0)*e;let r=U,i=W,a=G;U=J(r,K,x),W=J(i,q,x),G=J(a,0,.1),O.uniforms.uRot.value=M(U,W,G,j),te&&Math.abs(U-K)<1e-4&&Math.abs(W-q)<1e-4&&Math.abs(G)<1e-4&&(n=!1)}else if(o.animationType===`3drotate`){let e=t*y;U=e*z,W=Math.sin(e*R+V)*.6,G=Math.sin(e*B+H)*.5,O.uniforms.uRot.value=M(U,W,G,j),y<1e-6&&(n=!1)}else j[0]=1,j[1]=0,j[2]=0,j[3]=0,j[4]=1,j[5]=0,j[6]=0,j[7]=0,j[8]=1,O.uniforms.uRot.value=j,y<1e-6&&(n=!1);C.render({scene:ee}),N=n?requestAnimationFrame($):0};if(o.suspendWhenOffscreen){let t=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)?F():I()});t.observe(e),F(),e.__prismIO=t}else F();f=()=>{if(I(),A.disconnect(),o.animationType===`hover`&&(Q&&window.removeEventListener(`pointermove`,Q),window.removeEventListener(`mouseleave`,X),window.removeEventListener(`blur`,Z)),o.suspendWhenOffscreen){let t=e.__prismIO;t&&t.disconnect(),delete e.__prismIO}w.canvas.parentElement===e&&e.removeChild(w.canvas),w.getExtension(`WEBGL_lose_context`)?.loseContext()}}r(()=>{p()}),i(()=>{f?.()}),e(o,()=>{f?.(),p()},{deep:!0});let m={props:o,containerRef:s,get cleanup(){return f},set cleanup(e){f=e},setup:p};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),p={ref:`containerRef`,class:`home-hero-effect-prism`};function m(e,t,r,i,a,s){return o(),n(`div`,p,null,512)}var h=s(f,[[`render`,m],[`__scopeId`,`data-v-efa4438a`]]);export{h as default};