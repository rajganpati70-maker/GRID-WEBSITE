import{j as e,p as i}from"./index-C5sCSDoy.js";const a=[{top:"22%",left:"3%",size:46,opacity:.34,dur:"13s",delay:"0s"},{top:"12%",right:"5%",size:38,opacity:.3,dur:"16s",delay:"2s"},{bottom:"18%",left:"6%",size:34,opacity:.28,dur:"15s",delay:"1s"},{bottom:"10%",right:"3%",size:54,opacity:.36,dur:"18s",delay:"3s"},{top:"55%",right:"1.5%",size:30,opacity:.24,dur:"14s",delay:"0.6s"}];function s(){return e.jsxs("div",{"aria-hidden":"true",style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"},children:[e.jsx("style",{children:`
        @keyframes gridMarkFloat {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50%       { transform: translate(6px, -16px) rotate(4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .grid-floating-mark { animation: none !important; }
        }
      `}),a.map((t,o)=>e.jsx("div",{className:"grid-floating-mark",style:{position:"absolute",top:t.top,left:t.left,right:t.right,bottom:t.bottom,opacity:t.opacity,animation:`gridMarkFloat ${t.dur} ease-in-out ${t.delay} infinite`,filter:"drop-shadow(0 0 18px rgba(0,200,255,0.55))"},children:e.jsx(i,{size:t.size})},o))]})}export{s as F};
