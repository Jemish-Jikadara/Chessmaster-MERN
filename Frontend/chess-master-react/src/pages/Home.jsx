import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSocket } from '../lib/socket';
import api from '../api/axios';

/* =========================================================
   STYLES
   ========================================================= */
const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.h-page{
  --h-bg:#050510;
  --h-bg-2:#08081a;
  --h-panel:#0c0c20;
  --h-panel-2:#12122e;
  --h-line:rgba(0,229,255,0.14);
  --h-line-soft:rgba(255,255,255,0.06);
  --h-text:#e8f4ff;
  --h-muted:#7d8ba8;
  --h-soft:#b8c6dd;
  --h-cyan:#00e5ff;
  --h-cyan-2:#5cf0ff;
  --h-cyan-3:#a8f8ff;
  --h-pink:#ff2d95;
  --h-pink-2:#ff6bb0;
  --h-acid:#b6ff3c;
  --h-purple:#8b5cf6;
  --h-font-display:'Orbitron', system-ui, sans-serif;
  --h-font-tech:'Chakra Petch', system-ui, sans-serif;
  --h-font-body:'Inter', system-ui, sans-serif;

  position:relative;
  background:var(--h-bg);
  color:var(--h-text);
  font-family:var(--h-font-body);
  overflow-x:hidden;
  min-height:100vh;
}

/* Animated grid backdrop */
.h-page::before{
  content:'';
  position:fixed;
  inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  pointer-events:none;
  z-index:0;
  animation:h-grid 24s linear infinite;
}

/* Ambient glows */
.h-page::after{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
    radial-gradient(800px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%);
  pointer-events:none;
  z-index:0;
}

@keyframes h-grid{
  0%{ background-position:0 0, 0 0; }
  100%{ background-position:52px 52px, 52px 52px; }
}

.h-page > *{ position:relative; z-index:1; }
.h-page *{ box-sizing:border-box; }

.h-wrap{
  width:min(1240px, calc(100% - 40px));
  margin:0 auto;
}

/* =========================================================
   TICKER
   ========================================================= */
.h-ticker{
  border-bottom:1px solid var(--h-line);
  background:rgba(5,5,16,0.85);
  backdrop-filter:blur(10px);
  overflow:hidden;
  height:36px;
  display:flex;
  align-items:center;
  position:relative;
}

.h-ticker::before,
.h-ticker::after{
  content:'';
  position:absolute;
  top:0; bottom:0;
  width:80px;
  z-index:2;
  pointer-events:none;
}
.h-ticker::before{ left:0; background:linear-gradient(90deg, var(--h-bg), transparent); }
.h-ticker::after{ right:0; background:linear-gradient(270deg, var(--h-bg), transparent); }

.h-ticker-track{
  display:flex;
  gap:44px;
  white-space:nowrap;
  animation:h-ticker 38s linear infinite;
  font-family:var(--h-font-tech);
  font-size:12px;
  font-weight:600;
  letter-spacing:.14em;
  text-transform:uppercase;
  padding-left:20px;
}

.h-ticker-item{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:var(--h-soft);
}
.h-ticker-item .live{
  color:var(--h-pink);
  font-weight:800;
}
.h-ticker-item .live::before{
  content:'';
  display:inline-block;
  width:6px; height:6px;
  border-radius:50%;
  background:var(--h-pink);
  box-shadow:0 0 8px var(--h-pink);
  margin-right:6px;
  animation:h-blink 1.2s ease-in-out infinite;
}
.h-ticker-item strong{ color:var(--h-cyan); font-weight:700; }

@keyframes h-ticker{
  0%{ transform:translateX(0); }
  100%{ transform:translateX(-50%); }
}
@keyframes h-blink{
  0%,100%{ opacity:1; }
  50%{ opacity:.25; }
}

/* =========================================================
   NAV
   ========================================================= */
.h-nav{
  position:sticky;
  top:0;
  z-index:50;
  backdrop-filter:blur(14px);
  background:rgba(5,5,16,0.78);
  border-bottom:1px solid var(--h-line);
}

.h-nav-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  padding:14px 0;
}

.h-logo{
  display:inline-flex;
  align-items:center;
  gap:11px;
  color:var(--h-text);
  text-decoration:none;
  font-family:var(--h-font-display);
  font-weight:800;
  font-size:19px;
  letter-spacing:.06em;
  text-transform:uppercase;
}

.h-logo-mark{
  width:36px;
  height:36px;
  border-radius:8px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  position:relative;
  background:linear-gradient(135deg, var(--h-cyan), var(--h-purple));
  color:#050510;
  font-size:18px;
  font-weight:900;
  box-shadow:
    0 0 18px rgba(0,229,255,.55),
    0 0 32px rgba(139,92,246,.35),
    inset 0 0 10px rgba(255,255,255,.35);
}

.h-logo-mark::after{
  content:'';
  position:absolute;
  inset:-3px;
  border-radius:10px;
  border:1px solid rgba(0,229,255,.35);
  pointer-events:none;
}

.h-nav-links{
  display:flex;
  align-items:center;
  gap:26px;
  list-style:none;
  margin:0;
  padding:0;
}

.h-nav-links a{
  color:var(--h-soft);
  text-decoration:none;
  font-family:var(--h-font-tech);
  font-size:13px;
  font-weight:600;
  letter-spacing:.14em;
  text-transform:uppercase;
  position:relative;
  padding:4px 0;
  transition:color .18s ease, text-shadow .18s ease;
}

.h-nav-links a::before{
  content:'>';
  position:absolute;
  left:-14px;
  opacity:0;
  color:var(--h-cyan);
  transition:opacity .18s ease;
}

.h-nav-links a:hover{
  color:var(--h-cyan);
  text-shadow:0 0 12px rgba(0,229,255,.7);
}
.h-nav-links a:hover::before{ opacity:1; }

.h-nav-actions{
  display:flex;
  align-items:center;
  gap:10px;
}

/* =========================================================
   BUTTONS
   ========================================================= */
.h-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:46px;
  padding:0 22px;
  border-radius:6px;
  font-family:var(--h-font-tech);
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  border:1px solid transparent;
  cursor:pointer;
  position:relative;
  transition:transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease;
  white-space:nowrap;
  overflow:hidden;
}

.h-btn:hover{ transform:translateY(-2px); }

.h-btn-sm{ min-height:38px; padding:0 16px; font-size:11.5px; }

.h-btn-cyber{
  color:#050510;
  background:linear-gradient(90deg, var(--h-cyan), var(--h-cyan-3));
  box-shadow:
    0 0 20px rgba(0,229,255,.55),
    0 0 44px rgba(0,229,255,.25),
    inset 0 0 10px rgba(255,255,255,.4);
}
.h-btn-cyber:hover{
  box-shadow:
    0 0 30px rgba(0,229,255,.8),
    0 0 60px rgba(0,229,255,.4),
    inset 0 0 12px rgba(255,255,255,.55);
}

.h-btn-cyber::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transform:translateX(-100%);
  transition:transform .5s ease;
}
.h-btn-cyber:hover::after{ transform:translateX(100%); }

.h-btn-outline{
  color:var(--h-cyan);
  background:rgba(0,229,255,0.05);
  border-color:rgba(0,229,255,.35);
  box-shadow:inset 0 0 12px rgba(0,229,255,.12);
}
.h-btn-outline:hover{
  background:rgba(0,229,255,0.12);
  border-color:var(--h-cyan);
  color:var(--h-cyan-3);
  box-shadow:
    inset 0 0 20px rgba(0,229,255,.2),
    0 0 22px rgba(0,229,255,.35);
}

.h-btn-pink{
  color:#050510;
  background:linear-gradient(90deg, var(--h-pink), var(--h-pink-2));
  box-shadow:
    0 0 20px rgba(255,45,149,.5),
    0 0 44px rgba(255,45,149,.22);
}
.h-btn-pink:hover{
  box-shadow:
    0 0 30px rgba(255,45,149,.75),
    0 0 60px rgba(255,45,149,.35);
}

/* Corner brackets on buttons */
.h-corners{
  position:relative;
}
.h-corners::before,
.h-corners::after{
  content:'';
  position:absolute;
  width:8px; height:8px;
  border:1px solid currentColor;
  opacity:.5;
  pointer-events:none;
}
.h-corners::before{
  top:3px; left:3px;
  border-right:0; border-bottom:0;
}
.h-corners::after{
  bottom:3px; right:3px;
  border-left:0; border-top:0;
}

/* =========================================================
   HERO — diagonal
   ========================================================= */
.h-hero{
  position:relative;
  padding:80px 0 60px;
}

.h-hero-grid{
  display:grid;
  grid-template-columns:minmax(0, 1.05fr) minmax(340px, 0.95fr);
  gap:56px;
  align-items:center;
  position:relative;
}

/* Diagonal divider behind hero */
.h-hero::before{
  content:'';
  position:absolute;
  top:8%;
  left:52%;
  width:1px;
  height:84%;
  background:linear-gradient(180deg, transparent, rgba(0,229,255,.35), rgba(255,45,149,.35), transparent);
  transform:rotate(14deg);
  transform-origin:top center;
  pointer-events:none;
  opacity:.5;
}

.h-hero-copy{ max-width:640px; }

.h-hud{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:24px;
}

.h-hud-chip{
  display:inline-flex;
  align-items:center;
  gap:9px;
  padding:6px 12px;
  border-radius:4px;
  background:rgba(0,229,255,.06);
  border:1px solid rgba(0,229,255,.28);
  font-family:var(--h-font-tech);
  font-size:11px;
  font-weight:600;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--h-cyan-2);
  box-shadow:inset 0 0 10px rgba(0,229,255,.12);
}
.h-hud-chip strong{ color:#fff; font-weight:800; }
.h-hud-chip.pink{
  color:var(--h-pink-2);
  background:rgba(255,45,149,.06);
  border-color:rgba(255,45,149,.3);
  box-shadow:inset 0 0 10px rgba(255,45,149,.12);
}

.h-hud-dot{
  position:relative;
  display:inline-flex;
  width:8px; height:8px;
}
.h-hud-dot::before{
  content:'';
  position:absolute; inset:0;
  border-radius:50%;
  background:currentColor;
  animation:h-ping 1.4s cubic-bezier(0,0,.2,1) infinite;
}
.h-hud-dot::after{
  content:'';
  position:relative;
  width:8px; height:8px;
  border-radius:50%;
  background:currentColor;
  box-shadow:0 0 12px currentColor;
}
@keyframes h-ping{
  75%,100%{ transform:scale(2.6); opacity:0; }
}

.h-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:10px;
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:12px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:18px;
}

.h-eyebrow::before{
  content:'[';
  color:var(--h-cyan-2);
  font-family:var(--h-font-display);
  font-weight:900;
}
.h-eyebrow::after{
  content:']';
  color:var(--h-cyan-2);
  font-family:var(--h-font-display);
  font-weight:900;
}

.h-h1{
  margin:0;
  font-family:var(--h-font-display);
  font-size:clamp(2.6rem, 6vw, 5.4rem);
  line-height:.94;
  font-weight:900;
  letter-spacing:-0.01em;
  text-transform:uppercase;
}

.h-h1 .accent{
  background:linear-gradient(90deg, var(--h-cyan), var(--h-cyan-3), var(--h-pink));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  filter:drop-shadow(0 0 24px rgba(0,229,255,.35));
}

.h-h1 .sage{ color:#b8c6dd; }

.h-h1 .outline{
  color:transparent;
  -webkit-text-stroke:1.5px rgba(0,229,255,.6);
}

.h-sub{
  max-width:600px;
  margin:26px 0 0;
  color:var(--h-soft);
  font-size:16px;
  line-height:1.75;
}

.h-hero-btns{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:34px;
}

.h-hero-stats{
  display:grid;
  grid-template-columns:repeat(4, minmax(90px, 1fr));
  gap:0;
  max-width:600px;
  margin-top:46px;
  border-top:1px solid var(--h-line);
  border-bottom:1px solid var(--h-line);
}

.h-hstat{
  padding:18px 12px;
  position:relative;
  border-right:1px solid var(--h-line);
  transition:background .22s ease;
}
.h-hstat:last-child{ border-right:0; }
.h-hstat:hover{
  background:rgba(0,229,255,.05);
}

.h-hstat strong{
  display:block;
  font-family:var(--h-font-display);
  color:#fff;
  font-size:24px;
  line-height:1;
  font-weight:800;
  margin-bottom:8px;
  text-shadow:0 0 14px rgba(0,229,255,.45);
}

.h-hstat span{
  display:block;
  color:var(--h-muted);
  font-family:var(--h-font-tech);
  font-size:9.5px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:.16em;
}

/* =========================================================
   BOARD (HUD style)
   ========================================================= */
.h-board-frame{
  position:relative;
  padding:18px;
  border-radius:6px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(0,229,255,.015)),
    #0a0a1e;
  border:1px solid rgba(0,229,255,.28);
  box-shadow:
    0 0 40px rgba(0,229,255,.2),
    0 0 90px rgba(139,92,246,.12),
    inset 0 0 40px rgba(0,229,255,.05);
}

/* HUD corner brackets */
.h-board-frame::before,
.h-board-frame::after{
  content:'';
  position:absolute;
  width:22px; height:22px;
  border:2px solid var(--h-cyan);
  pointer-events:none;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.7));
}
.h-board-frame::before{
  top:-2px; left:-2px;
  border-right:0; border-bottom:0;
}
.h-board-frame::after{
  bottom:-2px; right:-2px;
  border-left:0; border-top:0;
}

.h-board-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  margin-bottom:14px;
}

.h-board-tag{
  display:block;
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:10px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:5px;
}

.h-board-title{
  margin:0;
  font-family:var(--h-font-display);
  font-size:15px;
  color:#fff;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
}

.h-board-live{
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:6px 11px;
  border-radius:4px;
  background:rgba(182,255,60,.08);
  border:1px solid rgba(182,255,60,.32);
  color:var(--h-acid);
  font-family:var(--h-font-tech);
  font-size:10.5px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  white-space:nowrap;
}
.h-board-live .dot{
  width:7px; height:7px;
  border-radius:50%;
  background:var(--h-acid);
  box-shadow:0 0 10px var(--h-acid);
  animation:h-blink 1.4s ease-in-out infinite;
}

.h-board-outer{
  display:grid;
  grid-template-columns:20px 1fr;
  grid-template-rows:1fr 20px;
  gap:5px;
}

.h-ranks{
  display:grid;
  grid-template-rows:repeat(8,1fr);
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:10px;
  font-weight:700;
  opacity:.65;
}
.h-ranks span, .h-files span{
  display:flex; align-items:center; justify-content:center;
}

.h-files{
  grid-column:2;
  display:grid;
  grid-template-columns:repeat(8,1fr);
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:10px;
  font-weight:700;
  opacity:.65;
}

.h-board-8{
  grid-column:2;
  grid-row:1;
  display:grid;
  grid-template-columns:repeat(8,1fr);
  grid-template-rows:repeat(8,1fr);
  overflow:hidden;
  aspect-ratio:1;
  border-radius:4px;
  border:1px solid rgba(0,229,255,.4);
  box-shadow:
    inset 0 0 40px rgba(0,229,255,.14),
    0 0 30px rgba(0,229,255,.2);
}

.h-board-8 .lt{
  background:#141a2e;
  box-shadow:inset 0 0 8px rgba(0,229,255,.08);
}
.h-board-8 .dk{
  background:#0a0d1c;
  box-shadow:inset 0 0 8px rgba(139,92,246,.08);
}
.h-board-8 .sq{
  display:flex; align-items:center; justify-content:center; position:relative;
}

.h-board-8 .sq img{
  width:80%; height:80%; object-fit:contain;
  filter:
    drop-shadow(0 0 6px rgba(0,229,255,.55))
    drop-shadow(0 2px 3px rgba(0,0,0,.6));
}

.h-board-8 .sq.animate-knight img{
  animation:h-float 3.4s ease-in-out infinite;
}
@keyframes h-float{
  0%, 100%{ transform:translateY(0); }
  50%{ transform:translateY(-4px); }
}

.h-board-bottom{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:6px;
  margin-top:14px;
}
.h-board-bottom > div{
  padding:10px 8px;
  border-radius:4px;
  text-align:center;
  background:rgba(0,229,255,.05);
  border:1px solid rgba(0,229,255,.22);
}
.h-board-bottom span{
  display:block;
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:9px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:4px;
  opacity:.75;
}
.h-board-bottom strong{
  color:#fff;
  font-family:var(--h-font-display);
  font-size:12px;
  font-weight:700;
  letter-spacing:.04em;
}

/* =========================================================
   SECTION
   ========================================================= */
.h-section{
  padding:100px 0;
  position:relative;
}

.h-section-head{
  max-width:680px;
  margin-bottom:52px;
}
.h-section-head.center{
  margin-left:auto;
  margin-right:auto;
  text-align:center;
}

.h-h2{
  margin:0;
  font-family:var(--h-font-display);
  font-size:clamp(1.9rem, 4vw, 3.4rem);
  line-height:1.02;
  font-weight:800;
  letter-spacing:-0.005em;
  text-transform:uppercase;
}

.h-h2 .accent{
  background:linear-gradient(90deg, var(--h-cyan), var(--h-pink));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  filter:drop-shadow(0 0 20px rgba(0,229,255,.35));
}

.h-h3{
  margin:0 0 10px;
  font-family:var(--h-font-display);
  font-size:17px;
  font-weight:700;
  line-height:1.25;
  letter-spacing:.02em;
  text-transform:uppercase;
}

.h-p{
  margin:20px 0 0;
  color:var(--h-soft);
  font-size:16px;
  line-height:1.75;
}

/* Section label with number */
.h-section-label{
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:24px;
  font-family:var(--h-font-tech);
  font-size:11px;
  font-weight:700;
  letter-spacing:.24em;
  text-transform:uppercase;
  color:var(--h-cyan);
}
.h-section-label .num{
  color:var(--h-pink);
  font-family:var(--h-font-display);
  font-weight:900;
}
.h-section-label::after{
  content:'';
  flex:1;
  height:1px;
  background:linear-gradient(90deg, rgba(0,229,255,.5), transparent);
}

/* =========================================================
   GAME MODES — tilted HUD cards
   ========================================================= */
.h-modes{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:20px;
}

.h-mode{
  position:relative;
  padding:32px 26px 28px;
  border-radius:6px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(0,229,255,.015)),
    #0a0a1e;
  border:1px solid rgba(0,229,255,.25);
  text-decoration:none;
  color:inherit;
  display:flex;
  flex-direction:column;
  transition:transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, border-color .3s ease;
  overflow:hidden;
}

.h-mode::before{
  content:'';
  position:absolute;
  top:0; left:0; right:0;
  height:2px;
  background:linear-gradient(90deg, var(--h-cyan), var(--h-pink));
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .3s ease;
}
.h-mode:hover::before{ transform:scaleX(1); }

.h-mode:hover{
  transform:translateY(-8px) rotate(-0.5deg);
  border-color:rgba(0,229,255,.7);
  box-shadow:
    0 0 30px rgba(0,229,255,.35),
    0 0 60px rgba(139,92,246,.18),
    0 20px 40px rgba(0,0,0,.55);
}

.h-mode:nth-child(2):hover{
  transform:translateY(-8px) rotate(0.5deg);
  border-color:rgba(255,45,149,.7);
  box-shadow:
    0 0 30px rgba(255,45,149,.35),
    0 0 60px rgba(139,92,246,.18),
    0 20px 40px rgba(0,0,0,.55);
}

.h-mode-corner{
  position:absolute;
  width:16px; height:16px;
  border:1.5px solid var(--h-cyan);
  opacity:.6;
  pointer-events:none;
}
.h-mode-corner.tl{ top:10px; left:10px; border-right:0; border-bottom:0; }
.h-mode-corner.br{ bottom:10px; right:10px; border-left:0; border-top:0; }

.h-mode-icon{
  width:54px;
  height:54px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:26px;
  margin-bottom:22px;
  background:rgba(0,229,255,.08);
  border:1px solid rgba(0,229,255,.35);
  box-shadow:inset 0 0 20px rgba(0,229,255,.15);
}

.h-mode p{
  color:var(--h-soft);
  font-size:14.5px;
  line-height:1.65;
  margin:0 0 22px;
  flex-grow:1;
}

.h-mode-link{
  display:inline-flex;
  align-items:center;
  gap:8px;
  color:var(--h-cyan);
  font-family:var(--h-font-tech);
  font-size:12.5px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
}

.h-mode-badge{
  position:absolute;
  top:16px;
  right:16px;
  padding:4px 9px;
  border-radius:3px;
  font-family:var(--h-font-tech);
  font-size:9.5px;
  font-weight:800;
  letter-spacing:.16em;
  text-transform:uppercase;
  background:rgba(182,255,60,.1);
  border:1px solid rgba(182,255,60,.4);
  color:var(--h-acid);
}
.h-mode-badge.hot{
  background:rgba(255,45,149,.12);
  border-color:rgba(255,45,149,.45);
  color:var(--h-pink-2);
}

/* =========================================================
   FEATURES MARQUEE + GRID
   ========================================================= */
.h-marquee{
  position:relative;
  padding:22px 0;
  margin-bottom:56px;
  border-top:1px solid var(--h-line);
  border-bottom:1px solid var(--h-line);
  overflow:hidden;
  background:rgba(0,229,255,.02);
}

.h-marquee-track{
  display:flex;
  gap:52px;
  white-space:nowrap;
  animation:h-ticker 40s linear infinite;
  font-family:var(--h-font-display);
  font-size:15px;
  font-weight:700;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(184,198,221,.5);
  padding-left:20px;
}

.h-marquee-track .star{
  color:var(--h-cyan);
  filter:drop-shadow(0 0 8px rgba(0,229,255,.7));
}

.h-features{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:14px;
}

.h-feature{
  padding:22px 20px;
  border-radius:6px;
  background:rgba(0,229,255,.025);
  border:1px solid rgba(0,229,255,.14);
  transition:transform .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease;
  position:relative;
}

.h-feature:hover{
  transform:translateY(-4px);
  border-color:rgba(0,229,255,.55);
  background:rgba(0,229,255,.06);
  box-shadow:
    0 0 24px rgba(0,229,255,.22),
    inset 0 0 20px rgba(0,229,255,.08);
}

.h-feature-icon{
  width:40px;
  height:40px;
  border-radius:5px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:18px;
  margin-bottom:14px;
  background:rgba(0,229,255,.08);
  border:1px solid rgba(0,229,255,.3);
}

.h-feature h3{
  margin:0 0 8px;
  font-family:var(--h-font-display);
  font-size:14px;
  font-weight:700;
  letter-spacing:.04em;
  text-transform:uppercase;
  color:#fff;
}

.h-feature p{
  color:var(--h-muted);
  font-size:13.5px;
  line-height:1.65;
  margin:0;
}

/* =========================================================
   LEADERBOARD
   ========================================================= */
.h-leaderboard{
  display:grid;
  grid-template-columns:1fr 1.1fr;
  gap:52px;
  align-items:center;
}

.h-lb-list{
  border-radius:6px;
  overflow:hidden;
  border:1px solid rgba(0,229,255,.3);
  background:rgba(5,5,16,.75);
  box-shadow:
    0 0 40px rgba(0,229,255,.15),
    inset 0 0 40px rgba(0,229,255,.04);
}

.h-lb-head{
  display:grid;
  grid-template-columns:56px 1fr auto auto;
  gap:14px;
  padding:12px 20px;
  border-bottom:1px solid var(--h-line);
  font-family:var(--h-font-tech);
  font-size:10px;
  font-weight:700;
  letter-spacing:.22em;
  text-transform:uppercase;
  color:var(--h-cyan);
  background:rgba(0,229,255,.05);
}

.h-lb-row{
  display:grid;
  grid-template-columns:56px 1fr auto auto;
  align-items:center;
  gap:14px;
  padding:16px 20px;
  border-bottom:1px solid var(--h-line-soft);
  transition:background .18s ease;
  position:relative;
}
.h-lb-row:last-child{ border-bottom:0; }
.h-lb-row:hover{
  background:rgba(0,229,255,.06);
}

.h-lb-row::before{
  content:'';
  position:absolute;
  left:0; top:0; bottom:0;
  width:2px;
  background:var(--h-cyan);
  transform:scaleY(0);
  transform-origin:center;
  transition:transform .2s ease;
  box-shadow:0 0 12px var(--h-cyan);
}
.h-lb-row:hover::before{ transform:scaleY(1); }

.h-lb-rank{
  font-family:var(--h-font-display);
  font-size:18px;
  font-weight:900;
  color:var(--h-cyan);
  text-align:center;
  text-shadow:0 0 12px rgba(0,229,255,.55);
}
.h-lb-row:nth-child(2) .h-lb-rank{ color:var(--h-acid); text-shadow:0 0 12px rgba(182,255,60,.55); }
.h-lb-row:nth-child(3) .h-lb-rank{ color:var(--h-pink-2); text-shadow:0 0 12px rgba(255,45,149,.55); }

.h-lb-player{
  display:flex;
  align-items:center;
  gap:12px;
}

.h-lb-avatar{
  width:36px;
  height:36px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--h-font-display);
  font-weight:800;
  font-size:14px;
  color:#050510;
  background:linear-gradient(135deg, var(--h-cyan), var(--h-cyan-3));
  box-shadow:0 0 14px rgba(0,229,255,.45);
}

.h-lb-name{
  font-family:var(--h-font-tech);
  font-weight:700;
  font-size:14px;
  color:#fff;
  letter-spacing:.06em;
}

.h-lb-flag{
  font-size:11px;
  color:var(--h-muted);
  font-family:var(--h-font-tech);
  letter-spacing:.08em;
}

.h-lb-rating{
  font-family:var(--h-font-display);
  font-weight:800;
  color:#fff;
  font-size:15px;
  text-shadow:0 0 10px rgba(0,229,255,.35);
}

.h-lb-trend{
  font-family:var(--h-font-tech);
  font-size:11px;
  font-weight:800;
  padding:3px 8px;
  border-radius:3px;
  letter-spacing:.06em;
}
.h-lb-trend.up{ color:var(--h-acid); background:rgba(182,255,60,.12); border:1px solid rgba(182,255,60,.3); }
.h-lb-trend.down{ color:var(--h-pink-2); background:rgba(255,45,149,.12); border:1px solid rgba(255,45,149,.3); }

/* =========================================================
   HOW IT WORKS
   ========================================================= */
.h-how{
  background:rgba(8,8,26,.65);
  border-top:1px solid var(--h-line);
  border-bottom:1px solid var(--h-line);
  backdrop-filter:blur(10px);
}

.h-steps{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
  position:relative;
}

.h-steps::before{
  content:'';
  position:absolute;
  top:34px; left:14%; right:14%;
  height:1px;
  background:linear-gradient(90deg, transparent, var(--h-cyan), transparent);
  opacity:.4;
  box-shadow:0 0 8px var(--h-cyan);
}

.h-step{
  position:relative;
  z-index:1;
  padding:30px 22px;
  border-radius:6px;
  background:rgba(0,229,255,.035);
  border:1px solid rgba(0,229,255,.22);
  text-align:center;
  transition:transform .22s ease, border-color .22s ease, box-shadow .22s ease;
}
.h-step:hover{
  transform:translateY(-4px);
  border-color:rgba(0,229,255,.55);
  box-shadow:0 0 28px rgba(0,229,255,.25);
}

.h-step-num{
  width:56px;
  height:56px;
  margin:0 auto 20px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#050510;
  background:linear-gradient(135deg, var(--h-cyan), var(--h-cyan-3));
  font-family:var(--h-font-display);
  font-size:22px;
  font-weight:900;
  box-shadow:
    0 0 22px rgba(0,229,255,.6),
    inset 0 0 12px rgba(255,255,255,.35);
}

.h-step h3{
  margin:0 0 10px;
  font-family:var(--h-font-display);
  font-size:15px;
  font-weight:700;
  letter-spacing:.04em;
  text-transform:uppercase;
  color:#fff;
}

.h-step p{
  color:var(--h-muted);
  font-size:13.5px;
  line-height:1.65;
  margin:0;
}

/* =========================================================
   TESTIMONIALS
   ========================================================= */
.h-testimonials{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:16px;
}

.h-testimonial{
  padding:24px 22px;
  border-radius:6px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.18);
  display:flex;
  flex-direction:column;
  gap:18px;
  position:relative;
  transition:border-color .22s ease, box-shadow .22s ease;
}
.h-testimonial:hover{
  border-color:rgba(255,45,149,.45);
  box-shadow:0 0 26px rgba(255,45,149,.18);
}

.h-quote{
  color:var(--h-soft);
  font-size:14.5px;
  line-height:1.7;
  margin:0;
}

.h-quote::before{
  content:'“';
  color:var(--h-cyan);
  font-family:var(--h-font-display);
  font-size:24px;
  margin-right:4px;
  text-shadow:0 0 12px rgba(0,229,255,.6);
}

.h-person{
  display:flex;
  align-items:center;
  gap:12px;
}

.h-person-avatar{
  width:40px;
  height:40px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--h-font-display);
  font-weight:800;
  color:#050510;
  background:linear-gradient(135deg, var(--h-pink), var(--h-pink-2));
  box-shadow:0 0 14px rgba(255,45,149,.45);
}

.h-person-name{
  font-family:var(--h-font-tech);
  font-weight:700;
  font-size:13.5px;
  color:#fff;
  letter-spacing:.06em;
}
.h-person-meta{
  font-family:var(--h-font-tech);
  font-size:11px;
  color:var(--h-muted);
  letter-spacing:.1em;
  text-transform:uppercase;
}

/* =========================================================
   CTA
   ========================================================= */
.h-cta-section{ padding:110px 0 120px; position:relative; }

.h-cta{
  position:relative;
  padding:64px 44px;
  border-radius:8px;
  text-align:center;
  overflow:hidden;
  background:
    linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.05)),
    #08081a;
  border:1px solid rgba(0,229,255,.35);
  box-shadow:
    0 0 60px rgba(0,229,255,.18),
    0 0 120px rgba(255,45,149,.1),
    inset 0 0 60px rgba(0,229,255,.06);
}

.h-cta::before,
.h-cta::after{
  content:'';
  position:absolute;
  width:28px; height:28px;
  border:2px solid var(--h-cyan);
  filter:drop-shadow(0 0 10px rgba(0,229,255,.8));
  pointer-events:none;
}
.h-cta::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.h-cta::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.h-cta-inner{ position:relative; z-index:1; max-width:640px; margin:0 auto; }

.h-cta-btns{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:34px;
}

/* Pulsing CTA button */
.h-btn-pulse{
  animation:h-pulse-glow 2.4s ease-in-out infinite;
}
@keyframes h-pulse-glow{
  0%, 100%{
    box-shadow:
      0 0 20px rgba(0,229,255,.5),
      0 0 44px rgba(0,229,255,.22),
      inset 0 0 10px rgba(255,255,255,.4);
  }
  50%{
    box-shadow:
      0 0 32px rgba(0,229,255,.9),
      0 0 70px rgba(0,229,255,.5),
      inset 0 0 14px rgba(255,255,255,.55);
  }
}

/* =========================================================
   FOOTER
   ========================================================= */
.h-footer{
  border-top:1px solid var(--h-line);
  background:rgba(3,3,10,.9);
  padding:64px 0 24px;
  position:relative;
}

.h-status-bar{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  padding:10px 16px;
  margin-bottom:44px;
  border:1px solid rgba(182,255,60,.28);
  border-radius:4px;
  background:rgba(182,255,60,.05);
  font-family:var(--h-font-tech);
  font-size:10.5px;
  font-weight:700;
  letter-spacing:.24em;
  text-transform:uppercase;
  color:var(--h-acid);
  width:max-content;
  margin-left:auto;
  margin-right:auto;
  box-shadow:inset 0 0 14px rgba(182,255,60,.1);
}
.h-status-bar .dot{
  width:8px; height:8px;
  border-radius:50%;
  background:var(--h-acid);
  box-shadow:0 0 10px var(--h-acid);
  animation:h-blink 1.4s ease-in-out infinite;
}

.h-footer-grid{
  display:grid;
  grid-template-columns:1.4fr 1fr 1fr 1fr;
  gap:40px;
  margin-bottom:48px;
}

.h-footer-brand{
  max-width:300px;
  color:var(--h-muted);
  font-size:13.5px;
  line-height:1.75;
  margin-top:16px;
}

.h-footer-col h4{
  margin:0 0 18px;
  font-family:var(--h-font-tech);
  font-size:11px;
  font-weight:700;
  letter-spacing:.24em;
  text-transform:uppercase;
  color:var(--h-cyan);
}

.h-footer-col ul{
  list-style:none;
  margin:0; padding:0;
  display:flex;
  flex-direction:column;
  gap:12px;
}

.h-footer-col a{
  color:var(--h-soft);
  font-family:var(--h-font-tech);
  font-size:13px;
  text-decoration:none;
  letter-spacing:.06em;
  transition:color .18s ease, text-shadow .18s ease;
}
.h-footer-col a:hover{
  color:var(--h-cyan);
  text-shadow:0 0 10px rgba(0,229,255,.6);
}

.h-footer-bottom{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
  flex-wrap:wrap;
  padding-top:26px;
  border-top:1px solid var(--h-line);
  color:#5a6684;
  font-family:var(--h-font-tech);
  font-size:11.5px;
  letter-spacing:.14em;
  text-transform:uppercase;
}

.h-socials{ display:flex; gap:10px; }
.h-social{
  width:38px;
  height:38px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(0,229,255,.04);
  border:1px solid rgba(0,229,255,.22);
  color:var(--h-cyan);
  text-decoration:none;
  transition:background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
}
.h-social:hover{
  background:rgba(0,229,255,.14);
  color:var(--h-cyan-3);
  transform:translateY(-3px);
  box-shadow:0 0 20px rgba(0,229,255,.4);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:1024px){
  .h-hero::before{ display:none; }
  .h-hero-grid{ grid-template-columns:1fr; gap:52px; }
  .h-hero-copy{ max-width:none; }
  .h-leaderboard{ grid-template-columns:1fr; gap:40px; }
}

@media (max-width:820px){
  .h-nav-links{ display:none; }
  .h-section{ padding:72px 0; }
  .h-modes,
  .h-features,
  .h-testimonials,
  .h-steps{ grid-template-columns:1fr; }
  .h-steps::before{ display:none; }
  .h-footer-grid{ grid-template-columns:1fr 1fr; gap:32px; }
  .h-h1{ font-size:clamp(2.2rem, 9vw, 3.6rem); }
}

@media (max-width:560px){
  .h-wrap{ width:calc(100% - 24px); }
  .h-hero{ padding:52px 0 44px; }
  .h-hero-stats{ grid-template-columns:repeat(2, 1fr); }
  .h-hstat:nth-child(2){ border-right:0; }
  .h-hstat:nth-child(1),
  .h-hstat:nth-child(2){ border-bottom:1px solid var(--h-line); }
  .h-board-frame{ padding:14px; }
  .h-cta{ padding:44px 22px; }
  .h-footer-grid{ grid-template-columns:1fr; }
  .h-nav-inner .h-btn{ padding:0 12px; font-size:10.5px; letter-spacing:.1em; }
  .h-ticker-item{ font-size:10px; }
}
`;

/* =========================================================
   STATIC DATA
   ========================================================= */
const BACK_ROW = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

const TICKER_ITEMS = [
  { live: true, text: 'LIVE: MagnusJr def. HikaruFan 1-0' },
  { text: '12,483 games played today' },
  { text: 'Season 4 starts in 3 days' },
  { live: true, text: 'LIVE: DingLiren vs NakamuraX' },
  { text: 'Top rating: 2840' },
  { text: 'New bot: Berserker 2400' },
];

const GAME_MODES = [
  {
    icon: '⚔',
    title: 'Local Duel',
    desc: 'Pass-and-play on one screen. Two players, one board, zero lag. Perfect for settling disputes.',
    link: '/play',
    linkText: 'Initialize',
    badge: null,
  },
  {
    icon: '⬢',
    title: 'Bot Arena',
    desc: '32 AI opponents from 100 to 3200 rating. Test your limits against Stockfish-powered engines.',
    link: '/play',
    linkText: 'Select Bot',
    badge: { text: 'Popular', hot: true },
  },
  {
    icon: '◈',
    title: 'Online PvP',
    desc: 'Live multiplayer over Socket.IO. Real opponents, real ratings, real consequences.',
    link: '/online',
    linkText: 'Match Now',
    badge: null,
  },
];

const MARQUEE_ITEMS = [
  'Interactive Board', '32 AI Bots', 'Online Multiplayer', 'Friends',
  'Time Controls', 'Game Replay', 'Leaderboard', 'Ratings', 'Board Themes',
  'Player Profiles', 'Stockfish Engine', 'Live Matchmaking',
];

const FEATURES = [
  { icon: '♟', title: 'Interactive Board', desc: 'Click or drag pieces, see legal move hints, captures, and check highlights in real time.' },
  { icon: '⬢', title: '32 AI Bots', desc: 'From rating 100 to 3200, all powered by Stockfish for practice at every level.' },
  { icon: '◈', title: 'Online Multiplayer', desc: 'Live games over Socket.IO — create a room, share it, or match with a friend.' },
  { icon: '⟐', title: 'Friends System', desc: 'Search players by username, send friend requests, and build your rivals list.' },
  { icon: '⏱', title: 'Time Controls', desc: 'Rapid, Blitz, or Bullet — clocks tick, increment applies, timeout ends the game.' },
  { icon: '▶', title: 'Game Replay', desc: 'Every game is auto-saved and fully replayable so you can review each move.' },
  { icon: '▲', title: 'Leaderboard', desc: 'Wins, losses, draws, and an Elo-style rating saved for every player.' },
  { icon: '◐', title: 'Board Themes', desc: 'Six board themes saved to your profile so your setup follows you.' },
  { icon: '◉', title: 'Player Profiles', desc: 'Your stats, history, and rating live in one profile you can update anytime.' },
];

const LEADERBOARD = [
  { rank: 1, name: 'MagnusJr', flag: '🇳🇴', rating: 2840, trend: 'up', delta: '+18' },
  { rank: 2, name: 'HikaruFan', flag: '🇺🇸', rating: 2795, trend: 'up', delta: '+9' },
  { rank: 3, name: 'DingLiren', flag: '🇨🇳', rating: 2780, trend: 'down', delta: '-4' },
  { rank: 4, name: 'NakamuraX', flag: '🇺🇸', rating: 2762, trend: 'up', delta: '+12' },
  { rank: 5, name: 'AnishG', flag: '🇮🇳', rating: 2748, trend: 'down', delta: '-2' },
];

const STEPS = [
  { n: '01', title: 'Register', desc: 'Create a free account. No card, no commitment, no nonsense. Stats saved from move one.' },
  { n: '02', title: 'Select Opponent', desc: 'Choose your mode: friend, bot, or online. Set your time control and enter the arena.' },
  { n: '03', title: 'Dominate', desc: 'Play, replay, review. Climb the leaderboard, sharpen your game, return stronger.' },
];

const TESTIMONIALS = [
  { text: 'The bot ladder is unreal. I went from 800 to 1400 in a month without paying a cent.', name: 'Sarah K.', meta: 'Rating 1420' },
  { text: 'Clean interface, smooth online games, and my replays are always saved. Exactly what I wanted.', name: 'Devon R.', meta: 'Rating 1780' },
  { text: 'I play with my brother every night. Pass-and-play on one screen is perfect.', name: 'Ali M.', meta: 'Casual player' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Play',
    links: [
      { to: '/play', label: 'Local Duel' },
      { to: '/play', label: 'Bot Arena' },
      { to: '/online', label: 'Online PvP' },
      { to: '/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/friends', label: 'Friends' },
      { to: '/profile', label: 'Profile' },
      { to: '/leaderboard', label: 'Rankings' },
      { to: '/register', label: 'Register' },
    ],
  },
  {
    title: 'Info',
    links: [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Sign In' },
      { to: '/', label: 'Privacy' },
      { to: '/', label: 'Terms' },
    ],
  },
];

/* =========================================================
   HOME
   ========================================================= */
const Home = ({ currentUser }) => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    const onUpdate = (count) => setOnlineCount(count);
    socket.on('activeUsersUpdate', onUpdate);
    return () => socket.off('activeUsersUpdate', onUpdate);
  }, []);

  useEffect(() => {
    api.get('/api/stats')
      .then((res) => setTotalUsers(res.data.totalUsers || 0))
      .catch(() => setTotalUsers(0));
  }, []);

  // Build board
  const boardSquares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      let piece = null;

      if (row === 0) piece = { color: 'black', type: BACK_ROW[col] };
      else if (row === 1) piece = { color: 'black', type: 'pawn' };
      else if (row === 6) piece = { color: 'white', type: 'pawn' };
      else if (row === 7) piece = { color: 'white', type: BACK_ROW[col] };

      const isAnimatedKnight =
        (row === 0 && col === 1) || (row === 7 && col === 6);

      boardSquares.push(
        <div
          key={`${row}-${col}`}
          className={`sq ${isLight ? 'lt' : 'dk'} ${isAnimatedKnight ? 'animate-knight' : ''}`}
        >
          {piece && (
            <img
              src={`/images/pieces/${piece.color}-${piece.type}.png`}
              alt={`${piece.color} ${piece.type}`}
            />
          )}
        </div>
      );
    }
  }

  const initials = currentUser?.username?.[0]?.toUpperCase() || 'U';
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <div className="h-page">
        {/* ================= TICKER ================= */}
        <div className="h-ticker">
          <div className="h-ticker-track">
            {tickerContent.map((item, i) => (
              <span key={i} className="h-ticker-item">
                {item.live && <span className="live">Live</span>}
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>

     

        {/* ================= HERO ================= */}
        <section className="h-hero">
          <div className="h-wrap h-hero-grid">
            <div className="h-hero-copy">
              <div className="h-hud">
                <div className="h-hud-chip">
                  <span className="h-hud-dot" />
                  <span>Online: <strong>{onlineCount}</strong></span>
                </div>
                <div className="h-hud-chip pink">
                  <span>Members: <strong>{totalUsers || 0}</strong></span>
                </div>
              </div>

              <span className="h-eyebrow">1.e4 e5 2.Nf3 — your move</span>

              <h1 className="h-h1">
                Enter the<br />
                <span className="accent">arena.</span><br />
                <span className="outline">Claim the crown.</span>
              </h1>

              <p className="h-sub">
                Fast online matches. 32 Stockfish-powered bots. Local duels. Friends, replays,
                ratings, profiles — a full chess combat system built for players who take the game seriously.
              </p>

              <div className="h-hero-btns">
                <Link to="/play" className="h-btn h-btn-cyber h-corners">▶ Play Now</Link>
                {currentUser ? (
                  <Link to="/online" className="h-btn h-btn-outline h-corners">Enter Online →</Link>
                ) : (
                  <Link to="/register" className="h-btn h-btn-outline h-corners">Create Account →</Link>
                )}
              </div>

              <div className="h-hero-stats">
                <div className="h-hstat"><strong>32</strong><span>AI Bots</span></div>
                <div className="h-hstat"><strong>LIVE</strong><span>Online PvP</span></div>
                <div className="h-hstat"><strong>06</strong><span>Themes</span></div>
                <div className="h-hstat"><strong>FREE</strong><span>Forever</span></div>
              </div>
            </div>

            <div className="h-board-frame">
              <div className="h-board-top">
                <div>
                  <span className="h-board-tag">// Starting Position</span>
                  <h3 className="h-board-title">System Ready</h3>
                </div>
                <div className="h-board-live">
                  <span className="dot" /> Engine Idle
                </div>
              </div>

              <div className="h-board-outer">
                <div className="h-ranks">
                  <span>8</span><span>7</span><span>6</span><span>5</span>
                  <span>4</span><span>3</span><span>2</span><span>1</span>
                </div>
                <div className="h-board-8">{boardSquares}</div>
                <div />
                <div className="h-files">
                  <span>a</span><span>b</span><span>c</span><span>d</span>
                  <span>e</span><span>f</span><span>g</span><span>h</span>
                </div>
              </div>

              <div className="h-board-bottom">
                <div><span>Turn</span><strong>WHITE</strong></div>
                <div><span>Mode</span><strong>SELECT</strong></div>
                <div><span>Engine</span><strong>STOCKFISH</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GAME MODES ================= */}
        <section className="h-section">
          <div className="h-wrap">
            <div className="h-section-head">
              <div className="h-section-label">
                <span className="num">01</span>
                <span>Select Mode</span>
              </div>
              <h2 className="h-h2">
                Choose your <span className="accent">battlefield</span>
              </h2>
              <p className="h-p">
                Three ways to fight. Pick your opponent, set the stakes, and enter the board.
              </p>
            </div>

            <div className="h-modes">
              {GAME_MODES.map((m) => (
                <Link to={m.link} key={m.title} className="h-mode">
                  <span className="h-mode-corner tl" />
                  <span className="h-mode-corner br" />
                  {m.badge && (
                    <span className={`h-mode-badge ${m.badge.hot ? 'hot' : ''}`}>
                      {m.badge.text}
                    </span>
                  )}
                  <div className="h-mode-icon">{m.icon}</div>
                  <h3 className="h-h3">{m.title}</h3>
                  <p>{m.desc}</p>
                  <span className="h-mode-link">{m.linkText} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="h-section" style={{ paddingTop: 0 }}>
          <div className="h-wrap">
            {/* Marquee */}
            <div className="h-marquee">
              <div className="h-marquee-track">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <span key={i}>
                    <span className="star">◆</span> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-section-head">
              <div className="h-section-label">
                <span className="num">02</span>
                <span>System Modules</span>
              </div>
              <h2 className="h-h2">
                Everything <span className="accent">included</span>
              </h2>
              <p className="h-p">
                All the core components a serious chess platform needs — from legal move validation to full match replays.
              </p>
            </div>

            <div className="h-features">
              {FEATURES.map((f) => (
                <div key={f.title} className="h-feature">
                  <div className="h-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LEADERBOARD ================= */}
        <section className="h-section">
          <div className="h-wrap h-leaderboard">
            <div>
              <div className="h-section-label">
                <span className="num">03</span>
                <span>Rankings</span>
              </div>
              <h2 className="h-h2">
                Climb the <span className="accent">ladder</span>
              </h2>
              <p className="h-p">
                Every win, loss, and draw updates your Elo-style rating in real time. Track your progress against the best players on the platform — and see exactly where you stand.
              </p>
              <div className="h-hero-btns" style={{ marginTop: 30 }}>
                <Link to="/leaderboard" className="h-btn h-btn-cyber h-corners">View Rankings</Link>
                <Link to="/register" className="h-btn h-btn-outline h-corners">Start Ranked →</Link>
              </div>
            </div>

            <div className="h-lb-list">
              <div className="h-lb-head">
                <span>Rank</span>
                <span>Player</span>
                <span>Rating</span>
                <span>Δ</span>
              </div>
              {LEADERBOARD.map((p) => (
                <div key={p.rank} className="h-lb-row">
                  <span className="h-lb-rank">#{p.rank}</span>
                  <div className="h-lb-player">
                    <div className="h-lb-avatar">{p.name[0]}</div>
                    <div>
                      <div className="h-lb-name">{p.name}</div>
                      <div className="h-lb-flag">{p.flag} GRANDMASTER</div>
                    </div>
                  </div>
                  <span className="h-lb-rating">{p.rating}</span>
                  <span className={`h-lb-trend ${p.trend}`}>{p.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="h-section h-how">
          <div className="h-wrap">
            <div className="h-section-head center">
              <div className="h-section-label" style={{ justifyContent: 'center' }}>
                <span className="num">04</span>
                <span>Protocol</span>
              </div>
              <h2 className="h-h2">
                Three steps to <span className="accent">combat</span>
              </h2>
            </div>

            <div className="h-steps">
              {STEPS.map((s) => (
                <div key={s.n} className="h-step">
                  <div className="h-step-num">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* ================= CTA ================= */}
        <section className="h-cta-section">
          <div className="h-wrap">
            <div className="h-cta">
              <div className="h-cta-inner">
                <span className="h-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
                  Checkmate Awaits
                </span>
                <h2 className="h-h2" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
                  Your next move<br />
                  <span className="accent">starts here.</span>
                </h2>
                <p className="h-p" style={{ margin: '20px auto 0' }}>
                  Join ChessMaster — play, learn, and challenge yourself every day. Free forever.
                </p>
                <div className="h-cta-btns">
                  <Link
                    to={currentUser ? '/play' : '/register'}
                    className="h-btn h-btn-cyber h-btn-pulse h-corners"
                  >
                    ▶ {currentUser ? 'Play Now' : 'Get Started Free'}
                  </Link>
                  <Link to="/leaderboard" className="h-btn h-btn-outline h-corners">
                    View Rankings →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

     
      </div>
    </>
  );
};

export default Home;