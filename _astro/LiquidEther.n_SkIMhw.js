import{Ht as e,Zn as t,b as n,ct as r,er as i,ft as a,k as o,mt as s,vn as c}from"./runtime-core.esm-bundler.4zHMzt0p.js";import{t as l}from"./_plugin-vue_export-helper.BDNMzG2s.js";import{A as u,E as d,F as f,I as p,L as m,T as h,X as g,Y as _,_ as v,c as y,d as b,f as x,l as S,o as C,q as w,r as T,s as E,u as D,x as O,z as k}from"./three.module.COK4q9ys.js";import{t as A}from"./helpers.UgYeZch5.js";var j=o({__name:`LiquidEther`,props:{mouseForce:{default:20},cursorSize:{default:100},isViscous:{type:Boolean,default:!1},viscous:{default:30},iterationsViscous:{default:32},iterationsPoisson:{default:32},dt:{default:.014},BFECC:{type:Boolean,default:!0},resolution:{default:.5},isBounce:{type:Boolean,default:!1},colors:{default:()=>[`#5227FF`,`#FF9FFC`,`#B19EEF`]},style:{default:()=>({})},className:{default:``},autoDemo:{type:Boolean,default:!0},autoSpeed:{default:.5},autoIntensity:{default:2.2},takeoverDuration:{default:.25},autoResumeDelay:{default:1e3},autoRampDuration:{default:.6}},setup(t,{expose:n}){n();let i=t,o=c(null),s=c(null),l=c(null),j=c(null),M=c(null),N=c(!0),P=c(null);function F(){if(!o.value)return;function e(e){let t;t=Array.isArray(e)&&e.length>0?e.length===1?[e[0],e[0]]:e:[`#ffffff`,`#ffffff`];let n=t.length,r=new Uint8Array(n*4);for(let e=0;e<n;e++){let n=new b(t[e]);r[e*4+0]=Math.round(n.r*255),r[e*4+1]=Math.round(n.g*255),r[e*4+2]=Math.round(n.b*255),r[e*4+3]=255}let i=new x(r,n,1,p);return i.magFilter=d,i.minFilter=d,i.wrapS=S,i.wrapT=S,i.generateMipmaps=!1,i.needsUpdate=!0,i}let t=e(i.colors),n=new _(0,0,0,0);class r{width=0;height=0;aspect=1;pixelRatio=1;isMobile=!1;breakpoint=768;fboWidth=null;fboHeight=null;time=0;delta=0;container=null;renderer=null;clock=null;init(e){this.container=e,this.pixelRatio=Math.min(window.devicePixelRatio||1,2),this.resize(),this.renderer=new T({antialias:!0,alpha:!0}),this.renderer.autoClear=!1,this.renderer.setClearColor(new b(0),0),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(this.width,this.height);let t=this.renderer.domElement;t.style.width=`100%`,t.style.height=`100%`,t.style.display=`block`,this.clock=new D,this.clock.start()}resize(){if(!this.container)return;let e=this.container.getBoundingClientRect();this.width=Math.max(1,Math.floor(e.width)),this.height=Math.max(1,Math.floor(e.height)),this.aspect=this.width/this.height,this.renderer&&this.renderer.setSize(this.width,this.height,!1)}update(){this.clock&&(this.delta=this.clock.getDelta(),this.time+=this.delta)}}let a=new r;class c{mouseMoved=!1;coords=new w;coords_old=new w;diff=new w;timer=null;container=null;isHoverInside=!1;hasUserControl=!1;isAutoActive=!1;autoIntensity=2;takeoverActive=!1;takeoverStartTime=0;takeoverDuration=.25;takeoverFrom=new w;takeoverTo=new w;onInteract=null;_onMouseMove=this.onDocumentMouseMove.bind(this);_onTouchStart=this.onDocumentTouchStart.bind(this);_onTouchMove=this.onDocumentTouchMove.bind(this);_onMouseEnter=this.onMouseEnter.bind(this);_onMouseLeave=this.onMouseLeave.bind(this);_onTouchEnd=this.onTouchEnd.bind(this);init(e){this.container=e,e.addEventListener(`mousemove`,this._onMouseMove),e.addEventListener(`touchstart`,this._onTouchStart,{passive:!0}),e.addEventListener(`touchmove`,this._onTouchMove,{passive:!0}),e.addEventListener(`mouseenter`,this._onMouseEnter),e.addEventListener(`mouseleave`,this._onMouseLeave),e.addEventListener(`touchend`,this._onTouchEnd)}dispose(){let e=this.container;e&&(e.removeEventListener(`mousemove`,this._onMouseMove),e.removeEventListener(`touchstart`,this._onTouchStart),e.removeEventListener(`touchmove`,this._onTouchMove),e.removeEventListener(`mouseenter`,this._onMouseEnter),e.removeEventListener(`mouseleave`,this._onMouseLeave),e.removeEventListener(`touchend`,this._onTouchEnd))}setCoords(e,t){if(!this.container)return;this.timer&&window.clearTimeout(this.timer);let n=this.container.getBoundingClientRect(),r=(e-n.left)/n.width,i=(t-n.top)/n.height;this.coords.set(r*2-1,-(i*2-1)),this.mouseMoved=!0,this.timer=window.setTimeout(()=>{this.mouseMoved=!1},100)}setNormalized(e,t){this.coords.set(e,t),this.mouseMoved=!0}onDocumentMouseMove(e){if(this.onInteract&&this.onInteract(),this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive){if(!this.container)return;let t=this.container.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=(e.clientY-t.top)/t.height;this.takeoverFrom.copy(this.coords),this.takeoverTo.set(n*2-1,-(r*2-1)),this.takeoverStartTime=performance.now(),this.takeoverActive=!0,this.hasUserControl=!0,this.isAutoActive=!1;return}this.setCoords(e.clientX,e.clientY),this.hasUserControl=!0}onDocumentTouchStart(e){if(e.touches.length===1){let t=e.touches[0];this.onInteract&&this.onInteract(),this.setCoords(t.pageX,t.pageY),this.hasUserControl=!0}}onDocumentTouchMove(e){if(e.touches.length===1){let t=e.touches[0];this.onInteract&&this.onInteract(),this.setCoords(t.pageX,t.pageY)}}onTouchEnd(){this.isHoverInside=!1}onMouseEnter(){this.isHoverInside=!0}onMouseLeave(){this.isHoverInside=!1}update(){if(this.takeoverActive){let e=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1e3);if(e>=1)this.takeoverActive=!1,this.coords.copy(this.takeoverTo),this.coords_old.copy(this.coords),this.diff.set(0,0);else{let t=e*e*(3-2*e);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,t)}}this.diff.subVectors(this.coords,this.coords_old),this.coords_old.copy(this.coords),this.coords_old.x===0&&this.coords_old.y===0&&this.diff.set(0,0),this.isAutoActive&&!this.takeoverActive&&this.diff.multiplyScalar(this.autoIntensity)}}let F=new c;class I{mouse;manager;enabled;speed;resumeDelay;rampDurationMs;active=!1;current=new w(0,0);target=new w;lastTime=performance.now();activationTime=0;margin=.2;_tmpDir=new w;constructor(e,t,n){this.mouse=e,this.manager=t,this.enabled=n.enabled,this.speed=n.speed,this.resumeDelay=n.resumeDelay||3e3,this.rampDurationMs=(n.rampDuration||0)*1e3,this.pickNewTarget()}pickNewTarget(){let e=Math.random;this.target.set((e()*2-1)*(1-this.margin),(e()*2-1)*(1-this.margin))}forceStop(){this.active=!1,this.mouse.isAutoActive=!1}update(){if(!this.enabled)return;let e=performance.now();if(e-this.manager.lastUserInteraction<this.resumeDelay){this.active&&this.forceStop();return}if(this.mouse.isHoverInside){this.active&&this.forceStop();return}if(this.active||(this.active=!0,this.current.copy(this.mouse.coords),this.lastTime=e,this.activationTime=e),!this.active)return;this.mouse.isAutoActive=!0;let t=(e-this.lastTime)/1e3;this.lastTime=e,t>.2&&(t=.016);let n=this._tmpDir.subVectors(this.target,this.current),r=n.length();if(r<.01){this.pickNewTarget();return}n.normalize();let i=1;if(this.rampDurationMs>0){let t=Math.min(1,(e-this.activationTime)/this.rampDurationMs);i=t*t*(3-2*t)}let a=this.speed*t*i,o=Math.min(a,r);this.current.addScaledVector(n,o),this.mouse.setNormalized(this.current.x,this.current.y)}}let L=`
    attribute vec3 position;
    uniform vec2 px;
    uniform vec2 boundarySpace;
    varying vec2 uv;
    precision highp float;
    void main(){
    vec3 pos = position;
    vec2 scale = 1.0 - boundarySpace * 2.0;
    pos.xy = pos.xy * scale;
    uv = vec2(0.5)+(pos.xy)*0.5;
    gl_Position = vec4(pos, 1.0);
  }
  `,R=`
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
      if(isBFECC == false){
          vec2 vel = texture2D(velocity, uv).xy;
          vec2 uv2 = uv - vel * dt * ratio;
          vec2 newVel = texture2D(velocity, uv2).xy;
          gl_FragColor = vec4(newVel, 0.0, 0.0);
      } else {
          vec2 spot_new = uv;
          vec2 vel_old = texture2D(velocity, uv).xy;
          vec2 spot_old = spot_new - vel_old * dt * ratio;
          vec2 vel_new1 = texture2D(velocity, spot_old).xy;
          vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
          vec2 error = spot_new2 - spot_new;
          vec2 spot_new3 = spot_new - error / 2.0;
          vec2 vel_2 = texture2D(velocity, spot_new3).xy;
          vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
          vec2 newVel2 = texture2D(velocity, spot_old2).xy;
          gl_FragColor = vec4(newVel2, 0.0, 0.0);
      }
  }
  `;class z{props;uniforms;scene=null;camera=null;material=null;geometry=null;plane=null;constructor(e){this.props=e||{},this.uniforms=this.props.material?.uniforms}init(...e){this.scene=new k,this.camera=new y,this.uniforms&&(this.material=new m(this.props.material),this.geometry=new f(2,2),this.plane=new u(this.geometry,this.material),this.scene.add(this.plane))}update(...e){!a.renderer||!this.scene||!this.camera||(a.renderer.setRenderTarget(this.props.output||null),a.renderer.render(this.scene,this.camera),a.renderer.setRenderTarget(null))}}class B extends z{line;constructor(e){super({material:{vertexShader:L,fragmentShader:R,uniforms:{boundarySpace:{value:e.cellScale},px:{value:e.cellScale},fboSize:{value:e.fboSize},velocity:{value:e.src.texture},dt:{value:e.dt},isBFECC:{value:!0}}},output:e.dst}),this.uniforms=this.props.material.uniforms,this.init()}init(){super.init(),this.createBoundary()}createBoundary(){let e=new E,t=new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]);e.setAttribute(`position`,new C(t,3));let n=new m({vertexShader:`
    attribute vec3 position;
    uniform vec2 px;
    precision highp float;
    varying vec2 uv;
    void main(){
    vec3 pos = position;
    uv = 0.5 + pos.xy * 0.5;
    vec2 n = sign(pos.xy);
    pos.xy = abs(pos.xy) - px * 1.0;
    pos.xy *= n;
    gl_Position = vec4(pos, 1.0);
  }
  `,fragmentShader:R,uniforms:this.uniforms});this.line=new h(e,n),this.scene.add(this.line)}update(...e){let{dt:t,isBounce:n,BFECC:r}=e[0]||{};this.uniforms&&(typeof t==`number`&&(this.uniforms.dt.value=t),typeof n==`boolean`&&(this.line.visible=n),typeof r==`boolean`&&(this.uniforms.isBFECC.value=r),super.update())}}class V extends z{mouse;constructor(e){super({output:e.dst}),this.init(e)}init(e){super.init();let t=new f(1,1),n=new m({vertexShader:`
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
      vec2 pos = position.xy * scale * 2.0 * px + center;
      vUv = uv;
      gl_Position = vec4(pos, 0.0, 1.0);
  }
  `,fragmentShader:`
      precision highp float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
      vec2 circle = (vUv - 0.5) * 2.0;
      float d = 1.0 - min(length(circle), 1.0);
      d *= d;
      gl_FragColor = vec4(force * d, 0.0, 1.0);
  }
  `,blending:2,depthWrite:!1,uniforms:{px:{value:e.cellScale},force:{value:new w(0,0)},center:{value:new w(0,0)},scale:{value:new w(e.cursor_size,e.cursor_size)}}});this.mouse=new u(t,n),this.scene.add(this.mouse)}update(...e){let t=e[0]||{},n=F.diff.x/2*(t.mouse_force||0),r=F.diff.y/2*(t.mouse_force||0),i=t.cellScale||{x:1,y:1},a=t.cursor_size||0,o=a*i.x,s=a*i.y,c=Math.min(Math.max(F.coords.x,-1+o+i.x*2),1-o-i.x*2),l=Math.min(Math.max(F.coords.y,-1+s+i.y*2),1-s-i.y*2),u=this.mouse.material.uniforms;u.force.value.set(n,r),u.center.value.set(c,l),u.scale.value.set(a,a),super.update()}}class H extends z{constructor(e){super({material:{vertexShader:L,fragmentShader:`
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
      vec2 old = texture2D(velocity, uv).xy;
      vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
      vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
      vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
      vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
      vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
      newv /= 4.0 * (1.0 + v * dt);
      gl_FragColor = vec4(newv, 0.0, 0.0);
  }
  `,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},velocity_new:{value:e.dst_.texture},v:{value:e.viscous},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update(...e){let{viscous:t,iterations:n,dt:r}=e[0]||{};if(!this.uniforms)return;let i,a;typeof t==`number`&&(this.uniforms.v.value=t);let o=n??0;for(let e=0;e<o;e++)e%2==0?(i=this.props.output0,a=this.props.output1):(i=this.props.output1,a=this.props.output0),this.uniforms.velocity_new.value=i.texture,this.props.output=a,typeof r==`number`&&(this.uniforms.dt.value=r),super.update();return a}}class U extends z{constructor(e){super({material:{vertexShader:L,fragmentShader:`
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
      float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
      float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
      float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
      float divergence = (x1 - x0 + y1 - y0) / 2.0;
      gl_FragColor = vec4(divergence / dt);
  }
  `,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update(...e){let{vel:t}=e[0]||{};this.uniforms&&t&&(this.uniforms.velocity.value=t.texture),super.update()}}class W extends z{constructor(e){super({material:{vertexShader:L,fragmentShader:`
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
      float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
      float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
      float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
      float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
      float div = texture2D(divergence, uv).r;
      float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
      gl_FragColor = vec4(newP);
  }
  `,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.dst_.texture},divergence:{value:e.src.texture},px:{value:e.cellScale}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update(...e){let{iterations:t}=e[0]||{},n,r,i=t??0;for(let e=0;e<i;e++)e%2==0?(n=this.props.output0,r=this.props.output1):(n=this.props.output1,r=this.props.output0),this.uniforms&&(this.uniforms.pressure.value=n.texture),this.props.output=r,super.update();return r}}class G extends z{constructor(e){super({material:{vertexShader:L,fragmentShader:`
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
      float step = 1.0;
      float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
      float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
      float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
      float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
      vec2 v = texture2D(velocity, uv).xy;
      vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
      v = v - gradP * dt;
      gl_FragColor = vec4(v, 0.0, 1.0);
  }
  `,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.src_p.texture},velocity:{value:e.src_v.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update(...e){let{vel:t,pressure:n}=e[0]||{};this.uniforms&&t&&n&&(this.uniforms.velocity.value=t.texture,this.uniforms.pressure.value=n.texture),super.update()}}class K{options;fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null};fboSize=new w;cellScale=new w;boundarySpace=new w;advection;externalForce;viscous;divergence;poisson;pressure;constructor(e){this.options={iterations_poisson:32,iterations_viscous:32,mouse_force:20,resolution:.5,cursor_size:100,viscous:30,isBounce:!1,dt:.014,isViscous:!1,BFECC:!0,...e},this.init()}init(){this.calcSize(),this.createAllFBO(),this.createShaderPass()}getFloatType(){return A()?O:v}createAllFBO(){let e={type:this.getFloatType(),depthBuffer:!1,stencilBuffer:!1,minFilter:d,magFilter:d,wrapS:S,wrapT:S};for(let t in this.fbos)this.fbos[t]=new g(this.fboSize.x,this.fboSize.y,e)}createShaderPass(){this.advection=new B({cellScale:this.cellScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1}),this.externalForce=new V({cellScale:this.cellScale,cursor_size:this.options.cursor_size,dst:this.fbos.vel_1}),this.viscous=new H({cellScale:this.cellScale,boundarySpace:this.boundarySpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt}),this.divergence=new U({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.vel_viscous0,dst:this.fbos.div,dt:this.options.dt}),this.poisson=new W({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0}),this.pressure=new G({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0,dst:this.fbos.vel_0,dt:this.options.dt})}calcSize(){let e=Math.max(1,Math.round(this.options.resolution*a.width)),t=Math.max(1,Math.round(this.options.resolution*a.height));this.cellScale.set(1/e,1/t),this.fboSize.set(e,t)}resize(){this.calcSize();for(let e in this.fbos)this.fbos[e].setSize(this.fboSize.x,this.fboSize.y)}update(){this.options.isBounce?this.boundarySpace.set(0,0):this.boundarySpace.copy(this.cellScale),this.advection.update({dt:this.options.dt,isBounce:this.options.isBounce,BFECC:this.options.BFECC}),this.externalForce.update({cursor_size:this.options.cursor_size,mouse_force:this.options.mouse_force,cellScale:this.cellScale});let e=this.fbos.vel_1;this.options.isViscous&&(e=this.viscous.update({viscous:this.options.viscous,iterations:this.options.iterations_viscous,dt:this.options.dt})),this.divergence.update({vel:e});let t=this.poisson.update({iterations:this.options.iterations_poisson});this.pressure.update({vel:e,pressure:t})}}class q{simulation;scene;camera;output;constructor(){this.simulation=new K,this.scene=new k,this.camera=new y,this.output=new u(new f(2,2),new m({vertexShader:L,fragmentShader:`
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main(){
      vec2 vel = texture2D(velocity, uv).xy;
      float lenv = clamp(length(vel), 0.0, 1.0);
      vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
      vec3 outRGB = mix(bgColor.rgb, c, lenv);
      float outA = mix(bgColor.a, 1.0, lenv);
      gl_FragColor = vec4(outRGB, outA);
  }
  `,transparent:!0,depthWrite:!1,uniforms:{velocity:{value:this.simulation.fbos.vel_0.texture},boundarySpace:{value:new w},palette:{value:t},bgColor:{value:n}}})),this.scene.add(this.output)}resize(){this.simulation.resize()}render(){a.renderer&&(a.renderer.setRenderTarget(null),a.renderer.render(this.scene,this.camera))}update(){this.simulation.update(),this.render()}}class J{props;output;autoDriver;lastUserInteraction=performance.now();running=!1;_loop=this.loop.bind(this);_resize=this.resize.bind(this);_onVisibility;constructor(e){this.props=e,a.init(e.$wrapper),F.init(e.$wrapper),F.autoIntensity=e.autoIntensity,F.takeoverDuration=e.takeoverDuration,F.onInteract=()=>{this.lastUserInteraction=performance.now(),this.autoDriver&&this.autoDriver.forceStop()},this.autoDriver=new I(F,this,{enabled:e.autoDemo,speed:e.autoSpeed,resumeDelay:e.autoResumeDelay,rampDuration:e.autoRampDuration}),this.init(),window.addEventListener(`resize`,this._resize),this._onVisibility=()=>{document.hidden?this.pause():N.value&&this.start()},document.addEventListener(`visibilitychange`,this._onVisibility)}init(){a.renderer&&(this.props.$wrapper.prepend(a.renderer.domElement),this.output=new q)}resize(){a.resize(),this.output.resize()}render(){this.autoDriver&&this.autoDriver.update(),F.update(),a.update(),this.output.update()}loop(){this.running&&(this.render(),j.value=requestAnimationFrame(this._loop))}start(){this.running||(this.running=!0,this._loop())}pause(){this.running=!1,j.value&&=(cancelAnimationFrame(j.value),null)}dispose(){try{if(window.removeEventListener(`resize`,this._resize),this._onVisibility&&document.removeEventListener(`visibilitychange`,this._onVisibility),F.dispose(),a.renderer){let e=a.renderer.domElement;e&&e.parentNode&&e.parentNode.removeChild(e),a.renderer.dispose(),a.renderer.forceContextLoss()}}catch{}}}let Y=o.value;Y.style.position=Y.style.position||`absolute`,Y.style.overflow=Y.style.overflow||`hidden`;let X=new J({$wrapper:Y,autoDemo:i.autoDemo,autoSpeed:i.autoSpeed,autoIntensity:i.autoIntensity,takeoverDuration:i.takeoverDuration,autoResumeDelay:i.autoResumeDelay,autoRampDuration:i.autoRampDuration});s.value=X,(()=>{if(!s.value)return;let e=s.value.output?.simulation;if(!e)return;let t=e.options.resolution;Object.assign(e.options,{mouse_force:i.mouseForce,cursor_size:i.cursorSize,isViscous:i.isViscous,viscous:i.viscous,iterations_viscous:i.iterationsViscous,iterations_poisson:i.iterationsPoisson,dt:i.dt,BFECC:i.BFECC,resolution:i.resolution,isBounce:i.isBounce}),i.resolution!==t&&e.resize()})(),X.start();let Z=new IntersectionObserver(e=>{let t=e[0],n=t.isIntersecting&&t.intersectionRatio>0;N.value=n,s.value&&(n&&!document.hidden?s.value.start():s.value.pause())},{threshold:[0,.01,.1]});Z.observe(Y),M.value=Z;let Q=new ResizeObserver(()=>{s.value&&(P.value&&cancelAnimationFrame(P.value),P.value=requestAnimationFrame(()=>{s.value&&s.value.resize()}))});Q.observe(Y),l.value=Q}e(()=>[i.mouseForce,i.cursorSize,i.isViscous,i.viscous,i.iterationsViscous,i.iterationsPoisson,i.dt,i.BFECC,i.resolution,i.isBounce,i.autoDemo,i.autoSpeed,i.autoIntensity,i.takeoverDuration,i.autoResumeDelay,i.autoRampDuration],()=>{let e=s.value;if(!e)return;let t=e.output?.simulation;if(!t)return;let n=t.options.resolution;Object.assign(t.options,{mouse_force:i.mouseForce,cursor_size:i.cursorSize,isViscous:i.isViscous,viscous:i.viscous,iterations_viscous:i.iterationsViscous,iterations_poisson:i.iterationsPoisson,dt:i.dt,BFECC:i.BFECC,resolution:i.resolution,isBounce:i.isBounce}),e.autoDriver&&(e.autoDriver.enabled=i.autoDemo,e.autoDriver.speed=i.autoSpeed,e.autoDriver.resumeDelay=i.autoResumeDelay,e.autoDriver.rampDurationMs=i.autoRampDuration*1e3,e.autoDriver.mouse&&(e.autoDriver.mouse.autoIntensity=i.autoIntensity,e.autoDriver.mouse.takeoverDuration=i.takeoverDuration)),i.resolution!==n&&t.resize()}),r(()=>{F()}),a(()=>{if(j.value&&cancelAnimationFrame(j.value),l.value)try{l.value.disconnect()}catch{}if(M.value)try{M.value.disconnect()}catch{}s.value&&s.value.dispose(),s.value=null});let I={props:i,mountRef:o,webglRef:s,resizeObserverRef:l,rafRef:j,intersectionObserverRef:M,isVisibleRef:N,resizeRafRef:P,initWebGL:F};return Object.defineProperty(I,"__isScriptSetup",{enumerable:!1,value:!0}),I}});function M(e,r,a,o,c,l){return s(),n(`div`,{ref:`mountRef`,class:t(`home-hero-effect-liquid-ether ${a.className||``}`),style:i(a.style)},null,6)}var N=l(j,[[`render`,M],[`__scopeId`,`data-v-4f4b1a4e`]]);export{N as default};