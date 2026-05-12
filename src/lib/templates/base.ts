/**
 * Shared helpers for all portfolio templates.
 *
 * normalize() is the ONLY place user data is HTML-escaped.
 * All template html() functions receive pre-escaped values from this dict.
 */

import type { ParsedData, PortfolioContent } from '$lib/types/portfolio';

export const DEFAULT_SECTION_ORDER: string[] = [
	'experience',
	'projects',
	'skills',
	'education',
	'certifications',
	'achievements',
	'awards',
	'campaigns',
	'financial_modeling',
	'investment_portfolios',
	'design_philosophy',
	'software_proficiency'
];

const _ALLOWED_URL_RE = /^https?:\/\//i;

export function _e(value: unknown): string {
	const s = String(value == null ? '' : value);
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function _safeUrl(url: unknown): string {
	const s = String(url == null ? '' : url).trim();
	return _ALLOWED_URL_RE.test(s) ? s : '';
}

/** Returns HTML attribute string for an inline-editable scalar field. */
export function _editable(path: string, multiline = false): string {
	return `contenteditable="true" data-path="${path}"${multiline ? ' data-multiline="true"' : ''}`;
}

/** Returns HTML attribute string for a click-to-edit list field. */
export function _listEditable(path: string): string {
	return `data-list-path="${path}"`;
}

/**
 * Pure JS body for the inline editor (no <script> tags).
 * Exported separately so the edit page can also inject it programmatically,
 * which is more reliable than relying on document.write() script execution.
 * The idempotent guard (window.__ceReady) prevents double-init.
 */
export const EDITOR_JS = `(function(){
  if(document.__ceReady)return;
  document.__ceReady=true;
  /* ── Styles ── */
  var s=document.createElement('style');
  s.textContent=[
    '[contenteditable]{user-select:text!important;-webkit-user-select:text!important;pointer-events:auto!important;cursor:text!important;min-height:1em;outline-offset:2px}',
    '[contenteditable]:hover{outline:2px dashed rgba(99,102,241,0.5);border-radius:3px}',
    '[contenteditable]:focus{outline:2px solid rgba(99,102,241,0.85);border-radius:3px}',
    '[data-list-path]{cursor:pointer!important;pointer-events:auto!important}',
    '[data-list-path]:hover{outline:2px dashed rgba(99,102,241,0.5);border-radius:3px}',
    '.ce-add-btn{display:block;margin-top:14px;padding:9px 16px;border:2px dashed #c7d2fe;border-radius:8px;background:rgba(238,242,255,0.9);color:#6366f1;font-size:0.85rem;cursor:pointer;width:100%;text-align:center;font-weight:600}',
    '.ce-add-btn:hover{background:#eef2ff;border-color:#818cf8}',
    '.ce-del-btn{display:none;position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;border:none;background:#fee2e2;color:#ef4444;font-size:13px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}',
    '.ce-ai-btn{display:none;position:absolute;top:6px;right:32px;padding:2px 8px;border-radius:12px;border:1px solid rgba(139,92,246,0.4);background:rgba(238,235,255,0.9);color:#7c3aed;font-size:11px;font-weight:600;cursor:pointer;z-index:10;white-space:nowrap;line-height:18px}',
    '.ce-ai-btn:hover{background:rgba(139,92,246,0.18);border-color:rgba(139,92,246,0.7)}',
    '[data-item-wrap]{position:relative!important}',
    '[data-item-wrap]:hover .ce-del-btn,[data-item-wrap]:hover .ce-ai-btn{display:block}'
  ].join('');
  document.head.appendChild(s);

  var _LF=String.fromCharCode(10),_CR=String.fromCharCode(13),_ZW=String.fromCharCode(8203),_BOM=String.fromCharCode(65279),_SHY=String.fromCharCode(173);
  function getValue(el){
    var raw=el.innerText.split(_ZW).join('').split(_BOM).join('').split(_SHY).join('');
    if(el.dataset.multiline) return raw.trimEnd();
    raw=raw.split(_LF).join(' ').split(_CR).join(' ');
    while(raw.indexOf('  ')>=0) raw=raw.split('  ').join(' ');
    return raw.trim();
  }

  document.addEventListener('paste',function(e){
    if(!e.target.closest('[contenteditable]'))return;
    e.preventDefault();
    document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));
  });

  document.addEventListener('keydown',function(e){
    var el=e.target.closest('[data-path]');
    if(!el)return;
    if(e.key==='Enter'&&!el.dataset.multiline){e.preventDefault();el.blur();}
    if(e.key==='Escape'){el.blur();}
  });

  document.addEventListener('focusin',function(e){
    var el=e.target.closest('[data-path]');
    if(!el)return;
    window.parent.postMessage({type:'field-focus',path:el.dataset.path},'*');
  });

  document.addEventListener('input',function(e){
    var el=e.target.closest('[data-path]');
    if(!el)return;
    window.parent.postMessage({type:'field-change',path:el.dataset.path,value:getValue(el)},'*');
  });

  document.addEventListener('focusout',function(e){
    var el=e.target.closest('[data-path]');
    if(!el)return;
    window.parent.postMessage({type:'field-blur',path:el.dataset.path,value:getValue(el)},'*');
  });

  document.addEventListener('mouseup',function(e){
    var sel=document.getSelection();
    if(!sel||sel.isCollapsed||!sel.toString().trim())return;
    var el=e.target.closest('[data-path]');
    if(!el)return;
    var r=sel.getRangeAt(0).getBoundingClientRect();
    window.parent.postMessage({type:'selection',path:el.dataset.path,text:sel.toString().trim(),
      rect:{top:r.top,left:r.left,bottom:r.bottom,right:r.right,width:r.width,height:r.height}},'*');
  });

  document.addEventListener('click',function(e){
    if(e.target.closest('[data-path]'))return;
    var el=e.target.closest('[data-list-path]');
    if(!el)return;
    var r=el.getBoundingClientRect();
    window.parent.postMessage({type:'open-list-editor',path:el.dataset.listPath,
      rect:{top:r.top,left:r.left,bottom:r.bottom,right:r.right,width:r.width}},'*');
  });

  document.addEventListener('click',function(e){
    var wrap=e.target.closest('[data-item-wrap]');
    if(!wrap)return;
    var del=wrap.querySelector('[data-del-section]');
    if(!del)return;
    window.parent.postMessage({type:'focus-item',
      section:del.getAttribute('data-del-section'),
      index:parseInt(del.getAttribute('data-del-index'),10)},'*');
  });

  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-add-section]');
    if(!btn)return;
    window.parent.postMessage({type:'add-item',section:btn.dataset.addSection},'*');
  });

  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-del-section]');
    if(!btn)return;
    window.parent.postMessage({type:'delete-item',section:btn.dataset.delSection,
      index:parseInt(btn.dataset.delIndex,10)},'*');
  });

  document.addEventListener('click',function(e){
    var btn=e.target.closest('.ce-ai-btn');
    if(!btn)return;
    window.parent.postMessage({type:'open-ai-panel',
      section:btn.dataset.aiSection,index:parseInt(btn.dataset.aiIndex,10)},'*');
  });

  window.addEventListener('message',function(e){
    if(!e.data)return;
    if(e.data.type==='update-field'){
      var el=document.querySelector('[data-path="'+e.data.path+'"]');
      if(el){el.innerText=e.data.value;}
    } else if(e.data.type==='scroll-to-item'){
      var btn=document.querySelector('[data-del-section="'+e.data.section+'"][data-del-index="'+e.data.index+'"]');
      var wrap=btn&&btn.closest('[data-item-wrap]');
      if(wrap){
        var navEl=document.querySelector('nav');
        var navH=navEl?navEl.getBoundingClientRect().height:0;
        var rect=wrap.getBoundingClientRect();
        window.scrollBy({top:rect.top-navH-24,behavior:'smooth'});
      }
    } else if(e.data.type==='scroll-to-section'){
      var sec=document.getElementById(e.data.section)||document.querySelector('[data-add-section="'+e.data.section+'"]');
      var target=sec&&(sec.tagName==='SECTION'?sec:(sec.closest('section')||sec));
      if(target){
        var navEl2=document.querySelector('nav');
        var navH2=navEl2?navEl2.getBoundingClientRect().height:0;
        var rect2=target.getBoundingClientRect();
        window.scrollBy({top:rect2.top-navH2-24,behavior:'smooth'});
      }
    }
  });

  var _NO_AI_SECTIONS=['education','certifications','awards','investment_portfolios'];
  function injectAiBtns(){
    document.querySelectorAll('[data-item-wrap]').forEach(function(wrap){
      if(wrap.querySelector('.ce-ai-btn'))return;
      var del=wrap.querySelector('[data-del-section]');
      if(!del)return;
      if(_NO_AI_SECTIONS.indexOf(del.getAttribute('data-del-section'))>=0)return;
      var btn=document.createElement('button');
      btn.className='ce-ai-btn';
      btn.setAttribute('data-ai-section',del.getAttribute('data-del-section'));
      btn.setAttribute('data-ai-index',del.getAttribute('data-del-index'));
      btn.textContent='\u2726 AI';
      wrap.appendChild(btn);
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',injectAiBtns);}
  else{injectAiBtns();}
})();`;

/**
 * Inline editor script tag — included in every template's html() output
 * so the editing UI also works when portfolios are served as static pages.
 */
export const EDITOR_SCRIPT = `<script>${EDITOR_JS}<\/script>`;

/**
 * CSP meta tag injected into the <head> of published (static) portfolios.
 * unsafe-inline is required for the template animation scripts (stars, cursor, etc.).
 * All user data is HTML-escaped by normalize(), so inline script injection is not possible.
 */
export const PUBLISH_CSP_META = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src * data: blob:; connect-src 'none'">`;

/**
 * Returns helpers scoped to publishMode.
 * Use inside each template's html() to shadow the module-level imports:
 *
 *   const { editable: _editable, listEditable: _listEditable,
 *           editorScript: EDITOR_SCRIPT, cspMeta, publishStyles } = makePublishHelpers(publishMode);
 */
export function makePublishHelpers(publishMode: boolean) {
	// Hides editor UI buttons whose CSS is normally injected by EDITOR_JS.
	// Template animation scripts (stars, IntersectionObserver, etc.) are kept as-is.
	const publishStyles = publishMode
		? `<style>
.ce-del-btn,.ce-add-btn,.ce-ai-btn,.del-btn,.add-btn{display:none!important}
</style>`
		: '';

	return {
		editable: (path: string, multiline = false) =>
			publishMode ? '' : _editable(path, multiline),
		listEditable: (path: string) =>
			publishMode ? '' : _listEditable(path),
		editorScript: publishMode ? '' : EDITOR_SCRIPT,
		cspMeta: publishMode ? PUBLISH_CSP_META : '',
		publishStyles,
	};
}

export interface NormalizedData {
	// Profile
	name: string;
	headline: string;
	bio: string;
	email: string;
	phone: string;
	location: string;
	profile_image: string;
	linkedin_url: string;
	github_url: string;
	portfolio_url: string;
	twitter_url: string;
	// Common sections
	skill_groups: Array<{ category: string; skills: string[] }>;
	experience: Array<{
		role: string;
		company: string;
		location: string;
		duration: string;
		description: string;
		key_points: string[];
		channels_managed: string[];
		financial_metrics_managed: string[];
	}>;
	education: Array<{
		degree: string;
		field_of_study: string;
		institution: string;
		location: string;
		year_range: string;
		grade_or_score: string;
	}>;
	certifications: Array<{ name: string; issuer: string; year: string; url: string }>;
	achievements: Array<{ title: string; description: string; year: string; url: string }>;
	// Software engineer
	projects: Array<{
		title: string;
		description: string;
		responsibilities: string[];
		measurable_outcomes: string[];
		tech_stack: string[];
		github_repo: string;
		project_url: string;
		project_category: string;
		design_concept: string;
		software_used: string[];
		images: string[];
	}>;
	// Designer
	design_philosophy: string;
	software_proficiency: string[];
	awards: Array<{ title: string; awarding_body: string; year: string; url: string }>;
	// Marketing
	campaigns: Array<{
		campaign_name: string;
		campaign_type: string;
		channels_used: string[];
		budget: string;
		performance_metrics: string[];
	}>;
	// Finance
	financial_modeling: Array<{ model_type: string; tools_used: string[]; outcome: string }>;
	investment_portfolios: Array<{
		portfolio_type: string;
		assets_under_management: string;
		performance_return: string;
	}>;
	// Metadata
	category: string;
	section_order: string[];
	hidden_sections: Set<string>;
}

export function normalize(
	parsedData: ParsedData,
	portfolioContent: PortfolioContent,
	category: string,
	sectionOrder?: string[],
	hiddenSections?: string[] | Set<string>
): NormalizedData {
	const profile = parsedData.profile ?? {};
	const social = profile.social_links ?? {};

	const name = _e(profile.full_name) || 'Portfolio';
	const headline = _e(portfolioContent.headline || profile.headline);
	const bio = _e(portfolioContent.bio || profile.summary);
	const email = _e(profile.email);
	const phone = _e(profile.phone);
	const location = _e(profile.location);
	const profile_image = _safeUrl(profile.profile_image);

	const linkedin_url = _safeUrl(social['linkedin']);
	const github_url = _safeUrl(social['github']);
	const portfolio_url = _safeUrl(social['portfolio']);
	const twitter_url = _safeUrl(social['twitter']);

	const skill_groups = (parsedData.skills ?? [])
		.filter((g) => g.category || g.skills?.length)
		.map((g) => ({
			category: _e(g.category),
			skills: (Array.isArray(g.skills) ? g.skills : []).filter(Boolean).map(_e)
		}));

	const experience = (parsedData.experience ?? []).map((exp) => {
		const start = String(exp.start_date ?? '');
		const endRaw = exp.end_date;
		const end = endRaw ? String(endRaw) : exp.is_current ? 'Present' : '';
		const duration = start ? `${start} – ${end}` : end;
		return {
			role: _e(exp.role),
			company: _e(exp.company),
			location: _e(exp.location),
			duration: _e(duration),
			description: _e(exp.description),
			key_points: (Array.isArray(exp.key_points) ? exp.key_points : []).filter(Boolean).map(_e),
			channels_managed: (Array.isArray(exp.channels_managed) ? exp.channels_managed : []).filter(Boolean).map(_e),
			financial_metrics_managed: (Array.isArray(exp.financial_metrics_managed) ? exp.financial_metrics_managed : []).filter(Boolean).map(_e)
		};
	});

	const projects = (parsedData.projects ?? []).map((p) => ({
		title: _e(p.title),
		description: _e(p.description),
		responsibilities: (Array.isArray(p.responsibilities) ? p.responsibilities : []).filter(Boolean).map(_e),
		measurable_outcomes: (Array.isArray(p.measurable_outcomes) ? p.measurable_outcomes : []).filter(Boolean).map(_e),
		tech_stack: (Array.isArray(p.tech_stack) ? p.tech_stack : []).filter(Boolean).map(_e),
		github_repo: _safeUrl(p.github_repo),
		project_url: _safeUrl(p.project_url),
		project_category: _e(p.project_category),
		design_concept: _e(p.design_concept),
		software_used: (Array.isArray(p.software_used) ? p.software_used : []).filter(Boolean).map(_e),
		images: (Array.isArray(p.images) ? p.images : []).map(_safeUrl).filter(Boolean)
	}));

	const education = (parsedData.education ?? []).map((edu) => {
		const sy = edu.start_year ?? '';
		const ey = edu.end_year ?? '';
		const year_range = sy && ey ? `${sy}–${ey}` : String(ey || sy || '');
		return {
			degree: _e(edu.degree),
			field_of_study: _e(edu.field_of_study),
			institution: _e(edu.institution),
			location: _e(edu.location),
			year_range: _e(year_range),
			grade_or_score: _e(edu.grade_or_score)
		};
	});

	const certifications = (parsedData.certifications ?? [])
		.filter((c) => c.name)
		.map((c) => ({
			name: _e(c.name),
			issuer: _e(c.issuer),
			year: _e(String(c.year ?? '')),
			url: _safeUrl(c.certification_url)
		}));

	const achievements = (parsedData.achievements ?? [])
		.filter((a) => a.title)
		.map((a) => ({
			title: _e(a.title),
			description: _e(a.description),
			year: _e(String(a.year ?? '')),
			url: _safeUrl(a.achievement_url)
		}));

	const design_philosophy = _e(parsedData.design_philosophy);
	const software_proficiency = (Array.isArray(parsedData.software_proficiency) ? parsedData.software_proficiency : []).filter(Boolean).map(_e);

	const awards = (parsedData.awards ?? [])
		.filter((a) => a.title)
		.map((a) => ({
			title: _e(a.title),
			awarding_body: _e(a.awarding_body),
			year: _e(String(a.year ?? '')),
			url: _safeUrl(a.award_url)
		}));

	const campaigns = (parsedData.campaigns ?? [])
		.filter((c) => c.campaign_name)
		.map((c) => ({
			campaign_name: _e(c.campaign_name),
			campaign_type: _e(c.campaign_type),
			channels_used: (c.channels_used ?? []).filter(Boolean).map(_e),
			budget: _e(c.budget),
			performance_metrics: (c.performance_metrics ?? []).filter(Boolean).map(_e)
		}));

	const financial_modeling = (parsedData.financial_modeling ?? [])
		.filter((fm) => fm.model_type)
		.map((fm) => ({
			model_type: _e(fm.model_type),
			tools_used: (fm.tools_used ?? []).filter(Boolean).map(_e),
			outcome: _e(fm.outcome)
		}));

	const investment_portfolios = (parsedData.investment_portfolios ?? [])
		.filter((ip) => ip.portfolio_type)
		.map((ip) => ({
			portfolio_type: _e(ip.portfolio_type),
			assets_under_management: _e(ip.assets_under_management),
			performance_return: _e(ip.performance_return)
		}));

	const hidden =
		hiddenSections instanceof Set
			? hiddenSections
			: new Set<string>(hiddenSections ?? []);

	return {
		name,
		headline,
		bio,
		email,
		phone,
		location,
		profile_image,
		linkedin_url,
		github_url,
		portfolio_url,
		twitter_url,
		skill_groups,
		experience,
		education,
		certifications,
		achievements,
		projects,
		design_philosophy,
		software_proficiency,
		awards,
		campaigns,
		financial_modeling,
		investment_portfolios,
		category,
		section_order: sectionOrder ?? DEFAULT_SECTION_ORDER,
		hidden_sections: hidden
	};
}
