/**
 * Template: Solace
 * HR theme — warm glassmorphic portfolio on a sand canvas with tan/gold accents.
 * Plus Jakarta Sans 800 headings over Inter, a floating pill nav, three drifting
 * ambient blobs, a frosted "People Snapshot" hero panel with a floating profile
 * card and geometric accents, an asymmetric bento expertise grid, a rail
 * timeline, and gradient-topped impact cards.
 * Palette: bg #F8F4EF, primary #C7A17A, secondary #9B7E63, gold #D4A373,
 * dark #1E1E1E, mid #6D6D6D, glass rgba(255,255,255,.55).
 * Fonts: Plus Jakarta Sans (display) · Inter (body).
 * Signature: blobDrift ambient blobs, floatY profile card + geo ring, count-up
 * stat animation, staggered reveals, spring card hovers, nav scroll highlight.
 *
 * Ported from templates_add/hr-portfolio-2.html. The hero dashboard's percentage
 * progress bars, the add-project modal, the toast and the blog grid had no
 * backing fields — the dashboard now shows a real programme snapshot (Z16), the
 * modal/toast are dropped (Z15) and the blog grid renders custom_sections.
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap';

const BENTO_ICONS = ['🎯', '🤝', '⚙️', '🚀', '💰', '📊', '📋', '🗺️'];
const SERVICE_ICONS = ['🎯', '💼', '🗺️', '📊', '🚀', '❤️', '⚖️', '📋'];
const ACHIEVE_ICONS = ['📉', '⚡', '🌟', '🏆'];
const EDU_ICONS = ['🎓', '🎓', '📘', '📗'];
const BLOG_ICONS = ['🔮', '🤖', '❤️', '🌱'];

function initials(name: string): string {
	const p = name.trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1]?.[0] ?? '' : '')).toUpperCase() || '••';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/\b(19|20)\d{2}\b/);
		if (m) {
			const y = parseInt(m[0], 10);
			if (y < earliest) earliest = y;
		}
	}
	return Math.max(0, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #F8F4EF;
  --primary: #C7A17A;
  --secondary: #9B7E63;
  --dark: #1E1E1E;
  --mid: #6D6D6D;
  --white: #FFFFFF;
  --gold: #D4A373;
  --glass: rgba(255,255,255,0.55);
  --glass-border: rgba(255,255,255,0.75);
  --shadow-soft: 0 8px 40px rgba(199,161,122,0.12);
  --shadow-card: 0 20px 60px rgba(30,30,30,0.08);
  --shadow-hover: 0 30px 80px rgba(30,30,30,0.14);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;
}
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--dark); overflow-x: hidden; line-height: 1.6; }
h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; line-height: 1.2; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }
img { display: block; max-width: 100%; }

/* Blobs */
.blob-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .35; animation: blobDrift 18s ease-in-out infinite alternate; }
.blob-1 { width: 600px; height: 600px; background: radial-gradient(circle,#D4A373 0%,#C7A17A 60%,transparent 100%); top: -200px; right: -150px; animation-delay: 0s; }
.blob-2 { width: 500px; height: 500px; background: radial-gradient(circle,#9B7E63 0%,#C7A17A 60%,transparent 100%); bottom: 20%; left: -150px; animation-delay: -6s; }
.blob-3 { width: 400px; height: 400px; background: radial-gradient(circle,#F8D5A3 0%,#D4A373 60%,transparent 100%); top: 50%; left: 40%; animation-delay: -12s; }
@keyframes blobDrift {
  0%   { transform: translate(0,0) scale(1); }
  33%  { transform: translate(40px,-30px) scale(1.05); }
  66%  { transform: translate(-20px,20px) scale(.97); }
  100% { transform: translate(30px,10px) scale(1.03); }
}

/* Nav */
nav {
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 48px); max-width: 1300px;
  background: rgba(248,244,239,0.72);
  backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1.5px solid var(--glass-border); border-radius: 60px; padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between; z-index: 1000; gap: 16px;
  box-shadow: 0 8px 40px rgba(199,161,122,0.15), 0 2px 0 rgba(255,255,255,0.8) inset;
  transition: box-shadow .3s;
}
.nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--dark); letter-spacing: -.5px; }
.nav-logo span { color: var(--primary); }
.nav-links { display: flex; gap: 6px; }
.nav-links a { color: var(--mid); font-size: .875rem; font-weight: 500; padding: 7px 14px; border-radius: 50px; transition: all .25s; }
.nav-links a:hover { color: var(--dark); background: rgba(199,161,122,0.12); }
.btn-nav {
  background: linear-gradient(135deg,var(--primary),var(--secondary)); color: #fff; border: none;
  padding: 10px 22px; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: .85rem; cursor: pointer; transition: all .3s; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(199,161,122,0.35);
}
.btn-nav:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(199,161,122,0.45); }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
.hamburger span { width: 22px; height: 2px; background: var(--dark); border-radius: 2px; transition: all .3s; display: block; }

main { position: relative; z-index: 1; }
.section { padding: 100px 24px; max-width: 1300px; margin: 0 auto; }

/* Hero */
#hero { padding: 160px 24px 100px; max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 1; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px; background: rgba(199,161,122,0.12);
  border: 1px solid rgba(199,161,122,0.3); border-radius: 50px; padding: 7px 16px; margin-bottom: 24px;
  font-size: .8rem; font-weight: 600; color: var(--secondary); letter-spacing: .3px;
}
.hero-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--primary); animation: pulse 2s infinite; flex: none; }
@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(.8); } }
.hero-h1 { font-size: clamp(2.2rem,4vw,3.4rem); color: var(--dark); margin-bottom: 20px; letter-spacing: -1.5px; }
.hero-h1 .highlight { background: linear-gradient(135deg,var(--primary),var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { font-size: 1.05rem; color: var(--mid); line-height: 1.75; margin-bottom: 36px; max-width: 480px; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
.btn-primary {
  background: linear-gradient(135deg,var(--primary),var(--secondary)); color: #fff; border: none;
  padding: 14px 28px; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: .9rem; cursor: pointer; transition: all .3s;
  box-shadow: 0 6px 24px rgba(199,161,122,0.35); display: inline-flex; align-items: center; gap: 8px;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(199,161,122,0.45); }
.btn-outline {
  background: transparent; color: var(--dark); border: 1.5px solid rgba(30,30,30,0.15);
  padding: 13px 26px; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600; font-size: .9rem; cursor: pointer; transition: all .3s; display: inline-flex; align-items: center; gap: 8px;
}
.btn-outline:hover { background: rgba(199,161,122,0.08); border-color: var(--primary); transform: translateY(-2px); }
.hero-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
.stat-card {
  background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg); padding: 18px 20px;
  box-shadow: var(--shadow-soft); transition: transform .3s, box-shadow .3s;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.stat-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--dark); letter-spacing: -1px; }
.stat-num .suffix { background: linear-gradient(135deg,var(--primary),var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-label { font-size: .78rem; color: var(--mid); margin-top: 2px; }

/* Hero snapshot panel */
.hero-dashboard { position: relative; }
.dashboard-main {
  background: var(--glass); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1.5px solid var(--glass-border); border-radius: var(--radius-xl);
  padding: 28px; box-shadow: var(--shadow-card); position: relative; overflow: hidden;
}
.dashboard-main::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,var(--primary),var(--gold),var(--secondary)); }
.dash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.dash-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .9rem; color: var(--dark); }
.dash-dot { width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; box-shadow: 0 0 0 3px rgba(76,175,80,0.2); animation: pulse 2s infinite; }
.dash-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.metric-item { background: rgba(255,255,255,0.6); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid rgba(255,255,255,0.8); }
.metric-label { font-size: .72rem; color: var(--mid); margin-bottom: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: .5px; }
.metric-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.4rem; color: var(--dark); }
.dash-list { display: flex; flex-direction: column; gap: 12px; }
.dash-row { background: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.8); border-radius: var(--radius-md); padding: 12px 14px; }
.dash-row-name { font-size: .8rem; font-weight: 600; color: var(--dark); }
.dash-row-sub { font-size: .74rem; color: var(--secondary); font-weight: 600; margin-top: 3px; }

.profile-float {
  position: absolute; bottom: -28px; left: -28px; background: #fff; border-radius: var(--radius-lg);
  padding: 18px 20px; box-shadow: 0 20px 60px rgba(30,30,30,0.14); border: 1px solid rgba(255,255,255,0.9);
  display: flex; align-items: center; gap: 14px; min-width: 240px; animation: floatY 4s ease-in-out infinite;
}
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.profile-avatar {
  width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--secondary));
  display: flex; align-items: center; justify-content: center; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1rem;
  overflow: hidden; flex-shrink: 0; position: relative;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .9rem; color: var(--dark); }
.profile-role { font-size: .72rem; color: var(--mid); }
.profile-stats { margin-top: 6px; display: flex; gap: 12px; }
.pstat { text-align: center; }
.pstat-val { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: .95rem; color: var(--primary); }
.pstat-l { font-size: .65rem; color: var(--mid); }

.geo { position: absolute; pointer-events: none; }
.geo-circle { width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(199,161,122,0.25); top: -20px; right: -20px; }
.geo-ring { width: 50px; height: 50px; border-radius: 50%; border: 8px solid rgba(212,163,115,0.2); top: 80px; right: 10px; animation: floatY 5s ease-in-out infinite reverse; }
.geo-dot-grid { position: absolute; bottom: 60px; right: -10px; display: grid; grid-template-columns: repeat(4,10px); gap: 7px; }
.geo-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(199,161,122,0.3); }

/* Section headers */
.section-label { font-size: .78rem; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
.section-title { font-size: clamp(1.8rem,3vw,2.6rem); color: var(--dark); margin-bottom: 16px; letter-spacing: -1px; }
.section-sub { font-size: 1rem; color: var(--mid); max-width: 560px; line-height: 1.75; margin-bottom: 48px; }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px; align-items: start; }
.about-img-wrap {
  aspect-ratio: 3/4; border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(199,161,122,0.12), rgba(155,126,99,0.08));
  border: 2px dashed rgba(199,161,122,0.3);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; position: relative; overflow: hidden; transition: border-color .3s;
}
.about-img-wrap:hover { border-color: var(--primary); }
.about-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-xl); }
.upload-hint { font-size: .8rem; color: var(--mid); text-align: center; z-index: 1; padding: 0 20px; }
.upload-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(199,161,122,0.12); border: 1.5px solid rgba(199,161,122,0.3); display: flex; align-items: center; justify-content: center; z-index: 1; font-size: 1.3rem; color: var(--primary); }
.about-text { padding: 8px 0; }
.about-text p { color: var(--mid); line-height: 1.85; margin-bottom: 18px; font-size: .97rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { font-size: .72rem; background: rgba(199,161,122,0.1); color: var(--secondary); padding: 5px 12px; border-radius: 50px; font-weight: 600; border: 1px solid rgba(199,161,122,0.2); }
.about-metrics { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-top: 32px; }
.about-metric { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); padding: 20px; text-align: center; box-shadow: var(--shadow-soft); transition: transform .3s; }
.about-metric:hover { transform: translateY(-4px); }
.am-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 2rem; color: var(--primary); letter-spacing: -1px; }
.am-label { font-size: .78rem; color: var(--mid); margin-top: 4px; font-weight: 500; }

/* Bento (skills) */
#skills { background: rgba(255,255,255,0.3); }
.bento-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.bento-card {
  background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg);
  padding: 28px 24px; box-shadow: var(--shadow-soft);
  transition: all .35s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden;
}
.bento-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(199,161,122,0), rgba(199,161,122,0.06)); opacity: 0; transition: opacity .3s; pointer-events: none; }
.bento-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--shadow-hover); }
.bento-card:hover::after { opacity: 1; }
.bento-card.large { grid-column: span 2; }
.bento-icon { width: 46px; height: 46px; border-radius: var(--radius-sm); background: linear-gradient(135deg, rgba(199,161,122,0.2), rgba(212,163,115,0.1)); border: 1px solid rgba(199,161,122,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 1.3rem; }
.bento-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1rem; color: var(--dark); margin-bottom: 12px; }

/* Timeline */
.timeline { position: relative; padding: 20px 0; }
.timeline::before { content: ''; position: absolute; left: 32px; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--primary) 0%, rgba(199,161,122,0) 100%); }
.tl-item { display: flex; gap: 32px; margin-bottom: 40px; position: relative; }
.tl-dot { width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--gold)); border: 3px solid var(--bg); box-shadow: 0 0 0 3px rgba(199,161,122,0.25); flex-shrink: 0; margin-top: 6px; margin-left: 24px; }
.tl-content { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg); padding: 24px 28px; flex: 1; box-shadow: var(--shadow-soft); transition: transform .3s; position: relative; }
.tl-content:hover { transform: translateX(6px); }
.tl-year { font-size: .75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.tl-role { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1.1rem; color: var(--dark); margin-bottom: 4px; }
.tl-company { font-size: .85rem; color: var(--mid); margin-bottom: 12px; }
.tl-desc { font-size: .85rem; color: var(--mid); line-height: 1.7; }
.tl-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.shots { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: var(--radius-md); margin-top: 14px; background: rgba(199,161,122,0.1); }
.shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.shots img.active { opacity: 1; }
.shots-dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; gap: 5px; justify-content: center; z-index: 2; }
.shots-dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.7); }
.shots-dots i.on { background: var(--primary); }

/* Achievements */
#achievements { background: linear-gradient(135deg, rgba(199,161,122,0.06), rgba(212,163,115,0.03)); }
.achieve-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
.achieve-card { background: var(--white); border-radius: var(--radius-xl); padding: 32px 24px; box-shadow: var(--shadow-card); border: 1px solid rgba(255,255,255,0.9); position: relative; overflow: hidden; transition: all .3s; }
.achieve-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg,var(--primary),var(--gold)); }
.achieve-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.achieve-icon { font-size: 2rem; margin-bottom: 20px; }
.achieve-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 2.2rem; color: var(--dark); letter-spacing: -2px; margin-bottom: 8px; }
.achieve-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .95rem; color: var(--dark); margin-bottom: 8px; }
.achieve-desc { font-size: .8rem; color: var(--mid); line-height: 1.65; }
.achieve-link { font-size: .75rem; color: var(--primary); font-weight: 700; display: inline-block; margin-top: 10px; }

/* Services (software proficiency) */
.services-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.service-card { background: var(--white); border: 1.5px solid rgba(199,161,122,0.12); border-radius: var(--radius-lg); padding: 28px 24px; transition: all .35s; box-shadow: 0 4px 20px rgba(30,30,30,0.04); }
.service-card:hover { border-color: var(--primary); transform: translateY(-6px); box-shadow: var(--shadow-hover); background: linear-gradient(135deg,#fff, rgba(248,244,239,0.5)); }
.service-icon { width: 48px; height: 48px; border-radius: var(--radius-sm); background: linear-gradient(135deg,var(--primary),var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 16px; }
.service-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .97rem; color: var(--dark); margin-bottom: 10px; }
.chip-panel { background: var(--white); border: 1.5px solid rgba(199,161,122,0.12); border-radius: var(--radius-xl); padding: 36px 32px; box-shadow: 0 4px 20px rgba(30,30,30,0.04); }

/* Certifications */
#certifications { background: rgba(255,255,255,0.3); }
.certs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.cert-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg); padding: 28px 24px; text-align: center; box-shadow: var(--shadow-soft); transition: all .3s; position: relative; overflow: hidden; }
.cert-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(199,161,122,0.06), transparent); opacity: 0; transition: opacity .3s; pointer-events: none; }
.cert-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
.cert-card:hover::before { opacity: 1; }
.cert-badge { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--gold)); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: .75rem; letter-spacing: -.5px; padding: 6px; text-align: center; }
.cert-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--dark); margin-bottom: 6px; }
.cert-org { font-size: .78rem; color: var(--mid); margin-bottom: 4px; }
.cert-year { font-size: .72rem; font-weight: 700; color: var(--primary); }

/* Education */
.edu-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.edu-card { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-soft); transition: transform .3s, box-shadow .3s; position: relative; }
.edu-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
.edu-badge { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg,var(--primary),var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.3rem; margin-bottom: 16px; }
.edu-degree { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1.05rem; color: var(--dark); margin-bottom: 6px; }
.edu-org { font-size: .85rem; color: var(--secondary); font-weight: 600; margin-bottom: 6px; }
.edu-year { font-size: .78rem; color: var(--mid); }
.edu-link { font-size: .75rem; color: var(--primary); font-weight: 700; display: inline-block; margin-top: 8px; }

/* Programme cards */
.projects-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.project-card { background: var(--white); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-card); border: 1px solid rgba(255,255,255,0.9); transition: all .35s; position: relative; }
.project-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.project-img { height: 200px; background: linear-gradient(135deg, rgba(199,161,122,0.15), rgba(212,163,115,0.08)); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; position: relative; overflow: hidden; border-bottom: 1px solid rgba(199,161,122,0.1); }
.project-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.project-img img.active { opacity: 1; }
.proj-upload-hint { font-size: .75rem; color: var(--mid); z-index: 1; text-align: center; padding: 0 16px; }
.proj-upload-icon { font-size: 1.8rem; z-index: 1; }
.project-body { padding: 20px; }
.project-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.project-tag { font-size: .68rem; font-weight: 700; color: var(--primary); background: rgba(199,161,122,0.1); padding: 3px 10px; border-radius: 50px; border: 1px solid rgba(199,161,122,0.2); }
.project-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 1rem; color: var(--dark); margin-bottom: 8px; }
.project-desc { font-size: .8rem; color: var(--mid); line-height: 1.65; }
.project-scope { font-size: .75rem; color: var(--secondary); font-weight: 600; margin-top: 10px; }
.proj-mini { font-size: .66rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--primary); margin: 14px 0 6px; }
.proj-list { display: flex; flex-direction: column; gap: 6px; }
.proj-list li { font-size: .78rem; color: var(--mid); line-height: 1.6; padding-left: 14px; position: relative; }
.proj-list li::before { content: ''; position: absolute; left: 0; top: .55em; width: 5px; height: 5px; border-radius: 50%; background: var(--primary); }
.project-meta { display: flex; align-items: flex-start; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(199,161,122,0.1); gap: 10px; }
.project-result { font-size: .75rem; font-weight: 700; color: #4CAF50; display: flex; flex-direction: column; gap: 4px; }

/* Custom sections (blog card language) */
.blog-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
.blog-card { background: var(--white); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-card); border: 1px solid rgba(255,255,255,0.9); transition: all .3s; position: relative; }
.blog-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.blog-img { height: 160px; background: linear-gradient(135deg, rgba(199,161,122,0.2), rgba(212,163,115,0.1)); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; overflow: hidden; }
.blog-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(30,30,30,0.05)); }
.blog-body { padding: 20px; }
.blog-cat { font-size: .7rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.blog-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .92rem; color: var(--dark); line-height: 1.45; margin-bottom: 10px; }
.blog-meta { font-size: .72rem; color: var(--mid); line-height: 1.6; }
.cs-list { display: flex; flex-direction: column; gap: 14px; }
.cs-row { background: var(--glass); backdrop-filter: blur(16px); border: 1.5px solid var(--glass-border); border-radius: var(--radius-lg); padding: 20px 24px; box-shadow: var(--shadow-soft); transition: transform .3s; position: relative; }
.cs-row:hover { transform: translateX(6px); }

/* Contact */
#contact { background: rgba(255,255,255,0.3); }
.contact-wrap { display: grid; grid-template-columns: 1fr; max-width: 700px; margin: 0 auto; align-items: start; }
.contact-info h2 { font-size: 2.2rem; color: var(--dark); margin-bottom: 16px; letter-spacing: -1px; }
.contact-info p { color: var(--mid); line-height: 1.8; margin-bottom: 32px; }
.contact-items { display: flex; flex-direction: column; gap: 16px; }
.contact-item { display: flex; align-items: center; gap: 16px; }
.contact-ic { width: 44px; height: 44px; border-radius: var(--radius-sm); background: rgba(199,161,122,0.1); border: 1px solid rgba(199,161,122,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.contact-item-text { font-size: .88rem; color: var(--mid); }
.contact-item-text strong { display: block; color: var(--dark); font-size: .85rem; margin-bottom: 2px; }
.form-btns { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }

/* Footer */
footer { background: var(--dark); color: rgba(255,255,255,0.85); padding: 60px 24px 32px; position: relative; z-index: 1; }
.footer-inner { max-width: 1300px; margin: 0 auto; }
.footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 60px; margin-bottom: 48px; }
.footer-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; margin-bottom: 14px; }
.footer-logo span { color: var(--primary); }
.footer-brand p { font-size: .85rem; color: rgba(255,255,255,0.5); line-height: 1.8; max-width: 280px; }
.footer-socials { display: flex; gap: 12px; margin-top: 24px; }
.social-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7); font-size: 1rem; transition: all .3s; }
.social-btn:hover { background: var(--primary); border-color: var(--primary); color: #fff; transform: translateY(-3px); }
.footer-col h5 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: .85rem; color: #fff; margin-bottom: 18px; }
.footer-col ul { display: flex; flex-direction: column; gap: 10px; }
.footer-col ul a { color: rgba(255,255,255,0.5); font-size: .83rem; transition: color .2s; }
.footer-col ul a:hover { color: var(--primary); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.footer-bottom p { font-size: .78rem; color: rgba(255,255,255,0.35); }

/* Reveal */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }
.reveal-delay-3 { transition-delay: .3s; }

[data-item-wrap] { position: relative; }
.ce-add-btn { margin-top: 28px; }

@media (max-width: 1100px) {
  .bento-grid, .achieve-grid, .services-grid, .blog-grid, .projects-grid, .edu-grid { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 900px) {
  #hero { grid-template-columns: 1fr; gap: 40px; }
  .hero-stats { grid-template-columns: repeat(4,1fr); }
  .about-grid { grid-template-columns: 1fr; }
  .about-img-wrap { aspect-ratio: 16/7; }
  .contact-wrap { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
}
@media (max-width: 640px) {
  .hero-stats { grid-template-columns: repeat(2,1fr); }
  .achieve-grid { grid-template-columns: 1fr 1fr; }
  .services-grid, .edu-grid, .blog-grid, .projects-grid { grid-template-columns: 1fr; }
  .certs-grid { grid-template-columns: 1fr 1fr; }
  .footer-top { grid-template-columns: 1fr; gap: 32px; }
  .tl-item { gap: 16px; }
  .bento-card.large { grid-column: span 1; }
  .profile-float { left: 0; right: 0; min-width: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .blob, .profile-float, .geo-ring { animation: none; }
  .reveal { transition: none; opacity: 1; transform: none; }
}
`;
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const ed = (path: string, multi = false): string => (em ? _editable(path, multi) : '');
	const le = (path: string): string => (em ? _listEditable(path) : '');
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn btn-outline" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);

	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const programmes = v.template_overrides?.campaigns_count ?? (v.hr_programs?.length ?? 0);
	const orgs = v.template_overrides?.roles_count ?? (v.experience?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');
	const skillCount = v.skill_groups.reduce((a, g) => a + g.skills.length, 0);

	const shots = (images: string[], path: string, cls: string, label: string, empty: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		const ph = !images.length ? `<div class="proj-upload-icon">&#128248;</div><div class="proj-upload-hint">${empty}</div>` : '';
		return `<div class="${cls}" ${_imgUpload(path, em, label)}>${imgs}${ph}${dots}</div>`;
	};

	// ── HERO ──────────────────────────────────────────────────────────────────
	const statCards = [
		statShown(v, 'years_experience', years)
			? `<div class="stat-card reveal"><div class="stat-num"><span ${ted('years_experience')}>${years}</span><span class="suffix">+</span></div><div class="stat-label">Years Experience</div></div>` : '',
		statShown(v, 'campaigns_count', programmes)
			? `<div class="stat-card reveal reveal-delay-1"><div class="stat-num"><span ${ted('campaigns_count')}>${programmes}</span><span class="suffix">+</span></div><div class="stat-label">Programmes Led</div></div>` : '',
		statShown(v, 'roles_count', orgs)
			? `<div class="stat-card reveal reveal-delay-2"><div class="stat-num"><span ${ted('roles_count')}>${orgs}</span></div><div class="stat-label">Organisations</div></div>` : '',
		statShown(v, 'certifications_count', certCount)
			? `<div class="stat-card reveal reveal-delay-3"><div class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="stat-label">Certifications</div></div>` : ''
	].filter(Boolean).join('');

	// Snapshot panel — real counts and real programme names (the source's
	// hardcoded percentage bars had no backing field, see Z16).
	const dashRows = v.hr_programs.slice(0, 3).map((p) => `<div class="dash-row">
        <div class="dash-row-name">${p.program_name || p.program_type}</div>
        ${p.measurable_outcomes?.[0] ? `<div class="dash-row-sub">${p.measurable_outcomes[0]}</div>` : p.scope ? `<div class="dash-row-sub">${p.scope}</div>` : ''}
      </div>`).join('');
	const dashHtml = `<div class="dashboard-main">
      <div class="dash-header">
        <div class="dash-title">People Snapshot</div>
        <div class="dash-dot"></div>
      </div>
      <div class="dash-metrics">
        <div class="metric-item"><div class="metric-label">Programmes</div><div class="metric-val">${v.hr_programs.length}</div></div>
        <div class="metric-item"><div class="metric-label">Roles Held</div><div class="metric-val">${v.experience.length}</div></div>
        <div class="metric-item"><div class="metric-label">Credentials</div><div class="metric-val">${v.certifications.length}</div></div>
        <div class="metric-item"><div class="metric-label">Skill Areas</div><div class="metric-val">${skillCount}</div></div>
      </div>
      ${dashRows ? `<div class="dash-list">${dashRows}</div>` : ''}
    </div>`;

	// ── ABOUT ─────────────────────────────────────────────────────────────────
	const aboutImg = v.summary_image
		? `<img src="${v.summary_image}" alt="${v.name}">`
		: `<div class="upload-icon">&#8593;</div><div class="upload-hint">${em ? 'Click to upload your professional photo' : ''}</div>`;
	const expertiseChips = v.core_expertise.length
		? `<div class="chip-row" style="margin-top:8px" ${le('core_expertise')}>${v.core_expertise.map((t) => `<span class="chip">${t}</span>`).join('')}</div>`
		: em ? `<div class="chip-row" style="margin-top:8px" ${le('core_expertise')}><span class="chip">Add core expertise</span></div>` : '';
	const aboutMetrics = [
		statShown(v, 'years_experience', years) ? `<div class="about-metric reveal"><div class="am-num"><span ${ted('years_experience')}>${years}</span>+</div><div class="am-label">Years Experience</div></div>` : '',
		statShown(v, 'campaigns_count', programmes) ? `<div class="about-metric reveal reveal-delay-1"><div class="am-num"><span ${ted('campaigns_count')}>${programmes}</span></div><div class="am-label">Programmes Led</div></div>` : '',
		statShown(v, 'roles_count', orgs) ? `<div class="about-metric reveal reveal-delay-2"><div class="am-num"><span ${ted('roles_count')}>${orgs}</span></div><div class="am-label">Organisations</div></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div class="about-metric reveal reveal-delay-3"><div class="am-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="am-label">Certifications</div></div>` : ''
	].filter(Boolean).join('');
	const aboutHtml = (v.bio || v.uniqueValue || v.summary_image || em)
		? `<section id="about">
  <div class="section">
    <div class="about-grid">
      <div>
        <div class="about-img-wrap" ${_imgUpload('profile.summary_image', em, 'Upload image')}>${aboutImg}</div>
      </div>
      <div class="about-text">
        <div class="section-label">About Me</div>
        <h2 class="section-title">Passionate About People &amp; Organizational Excellence</h2>
        ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
        ${expertiseChips}
        ${aboutMetrics ? `<div class="about-metrics">${aboutMetrics}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	// ── SKILLS (bento) ────────────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<section id="skills">
  <div class="section">
    <div class="section-label">Core Skills</div>
    <h2 class="section-title">HR Expertise That Moves Organizations Forward</h2>
    <p class="section-sub">A comprehensive suite of human resources capabilities built across industries, company sizes, and stages of growth.</p>
    <div class="bento-grid">
${v.skill_groups.map((g, gi) => `      <div class="bento-card${gi % 3 === 0 ? ' large' : ''} reveal reveal-delay-${gi % 4}"${iw}>
        ${delBtn('skills', gi)}
        <div class="bento-icon">${BENTO_ICONS[gi % BENTO_ICONS.length]}</div>
        <div class="bento-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
        <div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>
</section>` : '';

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<section id="experience">
  <div class="section">
    <div class="section-label">Career Path</div>
    <h2 class="section-title">Experience That Spans Industries &amp; Scale</h2>
    <p class="section-sub">Progressive HR leadership across organisations, sectors and stages of growth.</p>
    <div class="timeline">
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			return `      <div class="tl-item reveal reveal-delay-${i % 4}">
        <div class="tl-dot"></div>
        <div class="tl-content"${iw}>
          ${delBtn('experience', i)}
          ${period ? `<div class="tl-year">${period}</div>` : ''}
          <div class="tl-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
          ${exp.company ? `<div class="tl-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
          ${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
          ${exp.key_points?.length ? `<div class="tl-tags" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<span class="chip">${k}</span>`).join('')}</div>` : ''}
          ${shots(exp.images ?? [], `experience.${i}.images`, 'shots', 'Upload image', 'Add image')}
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('experience', 'Experience')}
  </div>
</section>` : '';

	// ── HR PROGRAMS ───────────────────────────────────────────────────────────
	const programsHtml = (v.hr_programs?.length || em)
		? `<section id="hr_programs">
  <div class="section">
    <div class="section-label">Portfolio</div>
    <h2 class="section-title">Featured HR Programmes</h2>
    <p class="section-sub">People initiatives owned end to end — with the outcomes they produced.</p>
    <div class="projects-grid">
${v.hr_programs.map((p, i) => {
			const period = _rangeEditable(`hr_programs.${i}.start_date`, p.start_date, `hr_programs.${i}.end_date`, p.end_date, em, ' — ');
			return `      <div class="project-card reveal reveal-delay-${i % 4}"${iw}>
        ${delBtn('hr_programs', i)}
        ${shots(p.images ?? [], `hr_programs.${i}.images`, 'project-img', 'Upload image', 'Click to add programme photo')}
        <div class="project-body">
          <div class="project-tags">
            ${p.program_type ? `<span class="project-tag" ${ed(`hr_programs.${i}.program_type`)}>${p.program_type}</span>` : ''}
            ${p.organization ? `<span class="project-tag" ${ed(`hr_programs.${i}.organization`)}>${p.organization}</span>` : ''}
          </div>
          <div class="project-title" ${ed(`hr_programs.${i}.program_name`)}>${p.program_name || (em ? 'Programme' : '')}</div>
          ${p.description ? `<div class="project-desc" ${ed(`hr_programs.${i}.description`, true)}>${p.description}</div>` : ''}
          ${p.scope ? `<div class="project-scope" ${ed(`hr_programs.${i}.scope`)}>${p.scope}</div>` : ''}
          ${period ? `<div class="project-scope">${period}</div>` : ''}
          ${p.activities?.length ? `<div class="proj-mini">What I did</div><ul class="proj-list" ${le(`hr_programs.${i}.activities`)}>${p.activities.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
          ${p.tools_used?.length ? `<div class="proj-mini">Tools</div><div class="project-tags" ${le(`hr_programs.${i}.tools_used`)}>${p.tools_used.map((t) => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
          ${p.measurable_outcomes?.length ? `<div class="project-meta"><div class="project-result" ${le(`hr_programs.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map((m) => `<span>&uarr; ${m}</span>`).join('')}</div></div>` : ''}
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('hr_programs', 'Program')}
  </div>
</section>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<section id="achievements">
  <div class="section">
    <div class="section-label">Impact Metrics</div>
    <h2 class="section-title">Measurable Results Across Every Role</h2>
    <p class="section-sub">Milestones that reflect real organizational transformation, not just activity.</p>
    <div class="achieve-grid">
${v.achievements.map((a, i) => `      <div class="achieve-card reveal reveal-delay-${i % 4}"${iw}>
        ${delBtn('achievements', i)}
        <div class="achieve-icon">${ACHIEVE_ICONS[i % ACHIEVE_ICONS.length]}</div>
        ${a.year ? `<div class="achieve-num" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="achieve-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<div class="achieve-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="achieve-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('achievements', 'Achievement')}
  </div>
</section>` : '';

	// ── SOFTWARE PROFICIENCY (service cards) ──────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<section id="software_proficiency">
  <div class="section">
    <div class="section-label">Toolkit</div>
    <h2 class="section-title">HRIS, ATS &amp; People Tools</h2>
    <p class="section-sub">The systems I run people operations on.</p>
    <div class="services-grid" ${le('software_proficiency')}>
${v.software_proficiency.map((s, i) => `      <div class="service-card reveal reveal-delay-${i % 4}">
        <div class="service-icon">${SERVICE_ICONS[i % SERVICE_ICONS.length]}</div>
        <div class="service-title">${s}</div>
      </div>`).join('\n')}
    </div>
  </div>
</section>` : '';

	// ── COMPLIANCE EXPERTISE ──────────────────────────────────────────────────
	const complianceHtml = v.compliance_expertise?.length
		? `<section id="compliance_expertise">
  <div class="section">
    <div class="section-label">Governance</div>
    <h2 class="section-title">Employment Law &amp; Compliance</h2>
    <p class="section-sub">The statutory frameworks behind every policy, process and case.</p>
    <div class="chip-panel reveal">
      <div class="chip-row" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="chip" style="font-size:.8rem;padding:8px 16px">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<section id="certifications">
  <div class="section">
    <div class="section-label">Credentials</div>
    <h2 class="section-title">Professional Certifications</h2>
    <p class="section-sub">Globally recognized certifications that validate strategic expertise.</p>
    <div class="certs-grid">
${v.certifications.map((c, i) => `      <div class="cert-card reveal reveal-delay-${i % 3}"${iw}>
        ${delBtn('certifications', i)}
        <div class="cert-badge">${(c.name || '••').slice(0, 8)}</div>
        <div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
        ${c.issuer ? `<div class="cert-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        ${c.year ? `<div class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
        ${c.url ? `<a class="edu-link" href="${c.url}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>
</section>` : '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<section id="education">
  <div class="section">
    <div class="section-label">Academic Background</div>
    <h2 class="section-title">Education</h2>
    <p class="section-sub">The academic foundation behind a career in people leadership.</p>
    <div class="edu-grid">
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `      <div class="edu-card reveal reveal-delay-${i % 3}"${iw}>
        ${delBtn('education', i)}
        <div class="edu-badge">${EDU_ICONS[i % EDU_ICONS.length]}</div>
        <div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
        ${edu.institution ? `<div class="edu-org"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
        ${yr ? `<div class="edu-year">${yr}</div>` : ''}
        ${edu.grade_or_score ? `<div class="edu-year" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('education', 'Education')}
  </div>
</section>` : '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customHtml = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return '';
		const items = cs.items ?? [];
		const sub = (i: number, t: string) => t ? `<div class="blog-cat" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${t}</div>` : '';
		const label = (i: number, t: string) => t ? `<div class="blog-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${t}</div>` : '';
		const value = (i: number, t: string) => t ? `<div class="blog-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${t}</div>` : '';
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="project-tags" style="margin-top:10px" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="project-tag">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="edu-link" href="${u}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="timeline">${items.map((it, i) => `<div class="tl-item"><div class="tl-dot"></div><div class="tl-content"${iw}>${delBtn(`custom_sections.${ci}`, i)}${it.subtitle ? `<div class="tl-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}${it.label ? `<div class="tl-role" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</div>` : ''}${it.value ? `<div class="tl-desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</div>` : ''}${tags(i, it.tags)}${link(it.url)}</div></div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-row"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="blog-grid">${items.map((it, i) => `<div class="blog-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}<div class="blog-img">${BLOG_ICONS[i % BLOG_ICONS.length]}</div><div class="blog-body">${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div></div>`).join('')}</div>`;
		}
		return `<section id="${cs.section_id}">
  <div class="section">
    <div class="section-label">More</div>
    <h2 class="section-title" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
	}).filter(Boolean).join('\n');

	const sectionMap: Record<string, string> = {
		experience: experienceHtml,
		hr_programs: programsHtml,
		skills: skillsHtml,
		software_proficiency: softwareHtml,
		compliance_expertise: complianceHtml,
		education: educationHtml,
		certifications: certsHtml,
		achievements: achievementsHtml,
		custom_sections: customHtml
	};
	const orderedSections = order
		.filter((k) => !hidden.has(k) && k in sectionMap)
		.map((k) => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	const NAV_LABELS: Record<string, string> = {
		about: 'About', skills: 'Expertise', experience: 'Experience', hr_programs: 'Programmes',
		software_proficiency: 'Toolkit', compliance_expertise: 'Compliance',
		education: 'Education', certifications: 'Certifications', achievements: 'Impact'
	};
	const navKeys: string[] = ['hero'];
	if (v.bio || v.uniqueValue) navKeys.push('about');
	for (const key of order) {
		if (hidden.has(key) || !(key in sectionMap) || !sectionMap[key]) continue;
		if (key === 'custom_sections') continue;
		navKeys.push(key);
	}
	navKeys.push('contact');
	const navItems = navKeys.slice(0, 6)
		.map((k) => `<li><a href="#${k}">${k === 'hero' ? 'Home' : k === 'contact' ? 'Contact' : NAV_LABELS[k] ?? k}</a></li>`).join('');
	const workAnchor = navKeys.includes('hr_programs') ? 'hr_programs' : navKeys.includes('experience') ? 'experience' : 'contact';

	const nameParts = v.name.split(/\s+/);
	const logoFirst = nameParts[0] || v.name;

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactItems = [
		v.email ? `<div class="contact-item"><div class="contact-ic">&#9993;</div><div class="contact-item-text"><strong>Email</strong><span ${ed('profile.email')}>${v.email}</span></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-ic">&#128241;</div><div class="contact-item-text"><strong>Phone</strong><span ${ed('profile.phone')}>${v.phone}</span></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-ic">&#127757;</div><div class="contact-item-text"><strong>Location</strong><span ${ed('profile.location')}>${v.location}</span></div></div>` : '',
		v.linkedin_url ? `<div class="contact-item"><div class="contact-ic">&#128279;</div><div class="contact-item-text"><strong>LinkedIn</strong><a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">Connect &rarr;</a></div></div>` : ''
	].filter(Boolean).join('');
	const contactHtml = contactItems
		? `<section id="contact">
  <div class="section">
    <div class="contact-wrap">
      <div class="contact-info reveal">
        <div class="section-label">Get In Touch</div>
        <h2 class="section-title" style="margin-bottom:16px">Let's Build Something Exceptional Together</h2>
        <p ${ed('profile.contact_tagline', true)}>${v.contact_tagline || "Whether you're scaling a startup, transforming a legacy culture, or building a world-class people function — I'd love to explore how we can work together."}</p>
        <div class="contact-items">${contactItems}</div>
        <div class="form-btns">
          ${v.email ? `<a href="mailto:${v.email}" class="btn-primary">&#9993; Email Me</a>` : ''}
          ${v.phone ? `<a href="tel:${v.phone}" class="btn-outline">&#128241; Call Me</a>` : ''}
        </div>
      </div>
    </div>
  </div>
</section>` : '';

	const footerNav = navKeys.slice(0, 6).map((k) => `<li><a href="#${k}">${k === 'hero' ? 'Home' : k === 'contact' ? 'Contact' : NAV_LABELS[k] ?? k}</a></li>`).join('');
	const footerSkills = v.skill_groups.slice(0, 6).map((g) => `<li><a href="#skills">${g.category}</a></li>`).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="social-btn" target="_blank" rel="noopener noreferrer" title="LinkedIn">in</a>` : '',
		v.email ? `<a href="mailto:${v.email}" class="social-btn" title="Email">&#9993;</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" class="social-btn" target="_blank" rel="noopener noreferrer" title="X">&#120143;</a>` : ''
	].filter(Boolean).join('');

	const RUNTIME = `<script>
(function(){
  var hb=document.querySelector('.hamburger');
  if(hb){
    hb.addEventListener('click',function(){
      var links=document.querySelector('.nav-links');
      if(!links)return;
      if(links.style.display==='flex'){links.style.display='none';}
      else{links.style.cssText='display:flex;flex-direction:column;position:absolute;top:70px;left:0;right:0;background:rgba(248,244,239,0.97);backdrop-filter:blur(20px);padding:20px;border-radius:0 0 20px 20px;border:1.5px solid rgba(255,255,255,0.75);gap:4px;z-index:999;';}
    });
  }

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  document.querySelectorAll('#hero .reveal').forEach(function(el){ setTimeout(function(){el.classList.add('visible');},200); });

  document.querySelectorAll('.shots, .project-img').forEach(function(box){
    var imgs=box.querySelectorAll('img');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shots-dots i'),i=0;
    setInterval(function(){
      imgs[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%imgs.length;
      imgs[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
    },3200);
  });

  var secs=document.querySelectorAll('section[id]'), navAs=document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',function(){
    var current='';
    secs.forEach(function(s){ if(window.scrollY>=s.offsetTop-120) current=s.id; });
    navAs.forEach(function(a){
      var on=a.getAttribute('href')==='#'+current;
      a.style.color=on?'var(--dark)':'';
      a.style.background=on?'rgba(199,161,122,0.12)':'';
    });
  },{passive:true});
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — ${v.profile_headline || 'HR Leader'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>

<div class="blob-wrap" aria-hidden="true">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
</div>

<nav>
  <div class="nav-logo">${logoFirst}<span>.</span>HR</div>
  <ul class="nav-links">${navItems}</ul>
  <a href="#contact" class="btn-nav">Book Consultation</a>
  <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>

<main>

<section id="hero">
  <div class="hero-left">
    ${v.profile_headline ? `<div class="hero-badge" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
    <h1 class="hero-h1" ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
    ${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
    <div class="hero-btns">
      <a href="#${workAnchor}" class="btn-primary">View Work</a>
      <a href="#contact" class="btn-outline">&#128197; Schedule Meeting</a>
    </div>
    ${statCards ? `<div class="hero-stats">${statCards}</div>` : ''}
  </div>

  <div class="hero-dashboard reveal">
    <div class="geo geo-circle"></div>
    <div class="geo geo-ring"></div>
    <div class="geo-dot-grid geo">
      ${Array.from({ length: 12 }, () => '<div class="geo-dot"></div>').join('')}
    </div>
    ${dashHtml}
    <div class="profile-float">
      <div class="profile-avatar" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : inits}</div>
      <div>
        <div class="profile-name" ${ed('profile.full_name')}>${v.name}</div>
        <div class="profile-role">${v.profile_headline || 'HR Professional'}</div>
        <div class="profile-stats">
          <div class="pstat"><div class="pstat-val">${v.hr_programs.length}</div><div class="pstat-l">Programmes</div></div>
          <div class="pstat"><div class="pstat-val">${v.experience.length}</div><div class="pstat-l">Roles</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

</main>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">${logoFirst}<span>.</span>HR</div>
        <p>${v.profile_headline || 'HR Leader'}. Helping organizations build high-performing teams and cultures that last.</p>
        ${socials ? `<div class="footer-socials">${socials}</div>` : ''}
      </div>
      <div class="footer-col">
        <h5>Navigation</h5>
        <ul>${footerNav}</ul>
      </div>
      ${footerSkills ? `<div class="footer-col"><h5>Expertise</h5><ul>${footerSkills}</ul></div>` : ''}
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</p>
      <p>Designed for people-first leaders</p>
    </div>
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
