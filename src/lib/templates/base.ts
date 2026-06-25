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
	'software_proficiency',
	'custom_sections'
];

// Profession-specific sections and the categories they belong to. Any section
// key NOT listed here is universal (rendered for every profession). This mirrors
// the edit page's SECTION_CONFIG categories and the backend per-category parse
// models. It is the single guard that keeps foreign-profession sections (e.g.
// finance's financial_modeling, marketing's campaigns) out of a portfolio that
// doesn't belong to that profession — for EVERY template and the published site,
// even when stale cross-profession data or a kitchen-sink template would
// otherwise surface an empty "+ Add" scaffold in edit mode.
const SECTION_CATEGORIES: Record<string, string[]> = {
	projects:              ['software_engineer', 'designer', 'civil_engineer', 'mechanical_engineer'],
	awards:                ['designer'],
	design_philosophy:     ['designer'],
	software_proficiency:  ['designer', 'civil_engineer', 'mechanical_engineer'],
	campaigns:             ['marketing'],
	financial_modeling:    ['finance'],
	investment_portfolios: ['finance'],
};

/** True when `key` is a universal section or belongs to `category`.
 *  An empty/unknown category is treated permissively (no filtering) so we never
 *  hide legitimate sections on records that predate category tagging. */
export function sectionAllowedForCategory(key: string, category: string): boolean {
	if (!category) return true;
	const cats = SECTION_CATEGORIES[key];
	return !cats || cats.includes(category);
}

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
 * Returns HTML attribute string that turns an image container into an inline
 * upload zone in the live editor. The element it is placed on must wrap the
 * displayed image (or its placeholder) — the editor overlays a clickable
 * "upload" affordance on it and, on click, opens the file picker and routes the
 * chosen file to `path`.
 *
 * `path` is the target the parent editor updates:
 *   - 'profile.profile_image'         → hero/profile photo (replace)
 *   - 'profile.summary_image'         → about/summary image (replace)
 *   - '{section}.{visibleIdx}.images' → section item image, e.g. 'projects.0.images'
 *
 * Only active in edit mode; returns '' for published output so nothing leaks
 * into the static portfolio.
 */
export function _imgUpload(path: string, editMode: boolean, label = 'Upload photo'): string {
	return editMode ? `data-img-upload="${path}" data-img-label="${label}"` : '';
}

/**
 * Inline-editable "start – end" range for experience dates or education years.
 *
 * Binds to the two REAL model fields (start_date/end_date, start_year/end_year),
 * NEVER the computed `duration`/`year_range`. The computed fields cannot
 * round-trip through the editor: the right-side pane has no input for them and
 * normalize() recomputes them from the real fields, so an inline edit to a
 * combined span is silently discarded on the next re-render. Use this helper so
 * every template stays in sync in both directions.
 *
 * Empty ends are omitted in BOTH edit and published mode — no "Start"/"End"
 * placeholder text leaks into the preview. Non-empty values stay inline-editable;
 * empty ones are edited from the right-side form pane.
 */
export function _rangeEditable(
	startPath: string,
	startVal: string,
	endPath: string,
	endVal: string,
	editMode: boolean,
	sep = ' – '
): string {
	if (!startVal && !endVal) return '';
	const s = startVal ? `<span ${editMode ? _editable(startPath) : ''}>${startVal}</span>` : '';
	const e = endVal ? `<span ${editMode ? _editable(endPath) : ''}>${endVal}</span>` : '';
	return `${s}${s && e ? sep : ''}${e}`;
}

/**
 * Inline-editable "degree, field_of_study" pair that keeps the visual join but
 * edits each field separately. Prevents the bug where the whole "Degree in
 * Field" string is bound to `degree` alone — which both makes field_of_study
 * uneditable inline AND duplicates the field text on re-render.
 *
 * Empty fields (and the joiner) are omitted entirely in BOTH edit and published
 * mode — no placeholder text leaks into the preview. Non-empty values stay
 * inline-editable; empty ones are edited from the right-side form pane.
 */
export function _pairEditable(
	aPath: string,
	aVal: string,
	bPath: string,
	bVal: string,
	editMode: boolean,
	joiner = ' '
): string {
	const a = aVal ? `<span ${editMode ? _editable(aPath) : ''}>${aVal}</span>` : '';
	const b = bVal ? `${a ? joiner : ''}<span ${editMode ? _editable(bPath) : ''}>${bVal}</span>` : '';
	return `${a}${b}`;
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
    '[data-item-wrap]:hover .ce-del-btn,[data-item-wrap]:hover .ce-ai-btn{display:block}',
    '[data-img-upload]{cursor:pointer!important}',
    '[data-img-upload].ce-img-empty{min-width:120px;min-height:120px}',
    '.ce-img-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(17,24,39,0);transition:opacity .15s,background .15s;cursor:pointer;z-index:30;border-radius:inherit;overflow:hidden}',
    '[data-img-upload]:hover .ce-img-ov{opacity:1;background:rgba(17,24,39,.5)}',
    '[data-img-upload].ce-img-empty .ce-img-ov{opacity:1;background:rgba(99,102,241,.16)}',
    '.ce-img-ov-inner{display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font-size:12px;font-weight:700;letter-spacing:.02em;font-family:system-ui,-apple-system,sans-serif;pointer-events:none;text-align:center;padding:6px;text-shadow:0 1px 4px rgba(0,0,0,.55)}',
    '[data-img-upload].ce-img-empty .ce-img-ov-inner{color:#4f46e5;text-shadow:none}',
    '.ce-img-ic{width:26px;height:26px;display:block}'
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
    window.parent.postMessage({type:'field-focus',path:el.dataset.path,value:getValue(el)},'*');
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

  document.addEventListener('click',function(e){
    var z=e.target.closest('[data-img-upload]');
    if(!z)return;
    e.preventDefault();
    e.stopPropagation();
    window.parent.postMessage({type:'image-upload-click',target:z.getAttribute('data-img-upload')},'*');
  },true);

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
      var sec=del.getAttribute('data-del-section')||'';
      if(_NO_AI_SECTIONS.indexOf(sec)>=0)return;
      if(sec.startsWith('custom_sections'))return;
      var btn=document.createElement('button');
      btn.className='ce-ai-btn';
      btn.setAttribute('data-ai-section',del.getAttribute('data-del-section'));
      btn.setAttribute('data-ai-index',del.getAttribute('data-del-index'));
      btn.textContent='\u2726 AI';
      wrap.appendChild(btn);
    });
  }
  var _CAM='<svg class="ce-img-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';
  function injectImgZones(){
    document.querySelectorAll('[data-img-upload]').forEach(function(z){
      if(z.querySelector(':scope > .ce-img-ov'))return;
      var cs=window.getComputedStyle(z);
      if(cs.position==='static')z.style.position='relative';
      if(!z.querySelector('img'))z.classList.add('ce-img-empty');
      else z.classList.remove('ce-img-empty');
      var label=z.getAttribute('data-img-label')||'Upload photo';
      var ov=document.createElement('div');
      ov.className='ce-img-ov';
      ov.innerHTML='<div class="ce-img-ov-inner">'+_CAM+'<span>'+label+'</span></div>';
      z.appendChild(ov);
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){injectAiBtns();injectImgZones();});}
  else{injectAiBtns();injectImgZones();}
})();`;

/**
 * Inline editor script tag — included in every template's html() output
 * so the editing UI also works when portfolios are served as static pages.
 */
export const EDITOR_SCRIPT = `<script data-editor>${EDITOR_JS}<\/script>`;

export interface NormalizedData {
	// Profile
	name: string;
	headline: string;        // portfolioContent.headline || profile.headline (AI preferred)
	profile_headline: string; // profile.headline only (raw professional title)
	bio: string;
	uniqueValue: string;     // portfolioContent.uniqueValue (editable via portfolio.uniqueValue)
	email: string;
	phone: string;
	location: string;
	profile_image: string;
	summary_image: string;
	contact_tagline: string;
	core_expertise: string[];
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
		start_date: string;
		end_date: string;
		is_current: boolean;
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
		start_year: string;
		end_year: string;
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
	// Custom sections (all categories)
	custom_sections: Array<{
		section_id: string;
		title: string;
		display_type: 'cards' | 'list' | 'timeline';
		items: Array<{
			label: string;
			value: string;
			subtitle: string;
			tags: string[];
			url: string;
		}>;
	}>;
	// Template-specific stat overrides (null/absent = use auto-computed value)
	template_overrides: Record<string, number | null>;
	// Metadata
	category: string;
	section_order: string[];
	hidden_sections: Set<string>;
	edit_mode: boolean;
}

export function normalize(
	parsedData: ParsedData,
	portfolioContent: PortfolioContent,
	category: string,
	sectionOrder?: string[],
	hiddenSections?: string[] | Set<string>,
	editMode = true,
	templateOverrides?: Record<string, number | null>
): NormalizedData {
	const profile = parsedData.profile ?? {};
	const social = profile.social_links ?? {};

	const name = _e(profile.full_name) || 'Portfolio';
	const profile_headline = _e(profile.headline);
	const headline = _e(portfolioContent.headline || profile.headline);
	const bio = _e(portfolioContent.bio || profile.summary);
	const uniqueValue = _e(portfolioContent.uniqueValue);
	const email = _e(profile.email);
	const phone = _e(profile.phone);
	const location = _e(profile.location);
	const profile_image = _safeUrl(profile.profile_image);
	const summary_image = _safeUrl(profile.summary_image);
	const contact_tagline = _e(profile.contact_tagline);
	const core_expertise = String(profile.core_expertise ?? '')
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean)
		.map(_e);

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
			start_date: _e(start),
			end_date: _e(endRaw ? String(endRaw) : (exp.is_current ? 'Present' : '')),
			is_current: !!exp.is_current,
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
			start_year: _e(String(sy)),
			end_year: _e(String(ey)),
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

	const custom_sections = (parsedData.custom_sections ?? [])
		.filter((cs) => cs.section_id && cs.title)
		.map((cs) => ({
			section_id: _e(cs.section_id),
			title: _e(cs.title),
			display_type: cs.display_type,
			items: (cs.items ?? []).map((item) => ({
				label: _e(item.label),
				value: _e(item.value),
				subtitle: _e(item.subtitle),
				tags: (Array.isArray(item.tags) ? item.tags : []).filter(Boolean).map(_e),
				url: _safeUrl(item.url)
			}))
		}));

	const hidden =
		hiddenSections instanceof Set
			? hiddenSections
			: new Set<string>(hiddenSections ?? []);

	return {
		name,
		headline,
		profile_headline,
		bio,
		uniqueValue,
		email,
		phone,
		location,
		profile_image,
		summary_image,
		contact_tagline,
		core_expertise,
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
		custom_sections,
		template_overrides: templateOverrides ?? {},
		category,
		section_order: (sectionOrder ?? DEFAULT_SECTION_ORDER).filter((k) =>
			sectionAllowedForCategory(k, category)
		),
		hidden_sections: hidden,
		edit_mode: editMode
	};
}
