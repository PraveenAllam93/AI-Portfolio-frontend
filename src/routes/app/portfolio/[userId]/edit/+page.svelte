<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import AppHeader from '$lib/components/common/AppHeader.svelte';
	import LoadingState from '$lib/components/common/LoadingState.svelte';
	import {
		getPortfolioData,
		savePortfolioContent,
		savePortfolioSection,
		getAiEnhancement,
		getAiItemEnhancement,
		getAiSkillsEnhancement,
		updatePortfolioConfig,
		publishPortfolio
	} from '$lib/services/portfolio';
	import { dndzone } from 'svelte-dnd-action';
	import { reveal } from '$lib/actions/animate';
	import type {
		EditableField,
		ParsedData,
		SkillGroup
	} from '$lib/types/portfolio';
	import { DEFAULT_SECTION_ORDER } from '$lib/types/portfolio';

	const userId: string = $derived($page.params.userId ?? '');

	// Ownership guard
	$effect(() => {
		const authUser = $authStore.user;
		if (!$authStore.loading && authUser && authUser.userId !== userId) {
			goto('/app/dashboard');
		}
	});

	// ── Section config ─────────────────────────────────────────────────────────

	interface FieldConfig {
		key: string;
		label: string;
		inputType: 'text' | 'textarea' | 'list' | 'url';
		aiEnhanceable?: boolean;
		placeholder?: string;
		limit?: number;
	}

	interface SectionConfig {
		label: string;
		categories: string[]; // '*' = all
		type: 'array' | 'string' | 'list';
		itemTitle: (item: Record<string, unknown>, index: number) => string;
		fields: FieldConfig[];
		emptyItem: () => Record<string, unknown>;
	}

	const SECTION_CONFIG: Record<string, SectionConfig> = {
		experience: {
			label: 'Experience',
			categories: ['*'],
			type: 'array',
			itemTitle: (item, i) =>
				item.role ? `${item.role}${item.company ? ` — ${item.company}` : ''}` : `Experience ${i + 1}`,
			fields: [
				{ key: 'role', label: 'Role / Title', inputType: 'text', limit: 200 },
				{ key: 'company', label: 'Company', inputType: 'text', limit: 200 },
				{ key: 'location', label: 'Location', inputType: 'text', limit: 200 },
				{ key: 'start_date', label: 'Start Date', inputType: 'text', placeholder: 'e.g. Jan 2020', limit: 50 },
				{ key: 'end_date', label: 'End Date', inputType: 'text', placeholder: 'e.g. Mar 2023 or Present', limit: 50 },
				{ key: 'description', label: 'Description', inputType: 'textarea', aiEnhanceable: true, limit: 1500 },
				{ key: 'key_points', label: 'Key Points (one per line)', inputType: 'list', aiEnhanceable: true },
				{ key: 'images', label: 'Image URLs (one per line)', inputType: 'list' }
			],
			emptyItem: () => ({ role: '', company: '', location: '', start_date: '', end_date: '', description: '', key_points: [], images: [] })
		},
		projects: {
			label: 'Projects',
			categories: ['software_engineer', 'designer'],
			type: 'array',
			itemTitle: (item, i) => (item.title as string) || `Project ${i + 1}`,
			fields: [
				{ key: 'title', label: 'Project Title', inputType: 'text', limit: 200 },
				{ key: 'description', label: 'Description', inputType: 'textarea', aiEnhanceable: true, limit: 1500 },
				{ key: 'tech_stack', label: 'Tech Stack (one per line)', inputType: 'list' },
				{ key: 'github_repo', label: 'GitHub URL', inputType: 'url', limit: 500 },
				{ key: 'project_url', label: 'Live URL', inputType: 'url', limit: 500 },
				{ key: 'responsibilities', label: 'Responsibilities (one per line)', inputType: 'list', aiEnhanceable: true },
				{ key: 'measurable_outcomes', label: 'Outcomes (one per line)', inputType: 'list', aiEnhanceable: true },
				{ key: 'design_concept', label: 'Design Concept', inputType: 'textarea', limit: 1000 },
				{ key: 'software_used', label: 'Software Used (one per line)', inputType: 'list' },
				{ key: 'images', label: 'Image URLs (one per line)', inputType: 'list' }
			],
			emptyItem: () => ({ title: '', description: '', tech_stack: [], github_repo: '', project_url: '', responsibilities: [], measurable_outcomes: [], images: [] })
		},
		education: {
			label: 'Education',
			categories: ['*'],
			type: 'array',
			itemTitle: (item, i) =>
				item.degree ? `${item.degree}${item.institution ? ` — ${item.institution}` : ''}` : `Education ${i + 1}`,
			fields: [
				{ key: 'degree', label: 'Degree', inputType: 'text', limit: 200 },
				{ key: 'field_of_study', label: 'Field of Study', inputType: 'text', limit: 200 },
				{ key: 'institution', label: 'Institution', inputType: 'text', limit: 200 },
				{ key: 'location', label: 'Location', inputType: 'text', limit: 200 },
				{ key: 'start_year', label: 'Start Year', inputType: 'text', placeholder: 'e.g. 2016', limit: 10 },
				{ key: 'end_year', label: 'End Year', inputType: 'text', placeholder: 'e.g. 2020', limit: 10 },
				{ key: 'grade_or_score', label: 'Grade / Score', inputType: 'text', aiEnhanceable: true, limit: 100 }
			],
			emptyItem: () => ({ degree: '', field_of_study: '', institution: '', location: '', start_year: '', end_year: '', grade_or_score: '' })
		},
		certifications: {
			label: 'Certifications',
			categories: ['*'],
			type: 'array',
			itemTitle: (item, i) => (item.name as string) || `Certification ${i + 1}`,
			fields: [
				{ key: 'name', label: 'Certification Name', inputType: 'text', aiEnhanceable: true, limit: 300 },
				{ key: 'issuer', label: 'Issuing Body', inputType: 'text', limit: 200 },
				{ key: 'year', label: 'Year', inputType: 'text', placeholder: 'e.g. 2023', limit: 10 },
				{ key: 'certification_url', label: 'Certificate URL', inputType: 'url', limit: 500 }
			],
			emptyItem: () => ({ name: '', issuer: '', year: '', certification_url: '' })
		},
		achievements: {
			label: 'Achievements',
			categories: ['*'],
			type: 'array',
			itemTitle: (item, i) => (item.title as string) || `Achievement ${i + 1}`,
			fields: [
				{ key: 'title', label: 'Title', inputType: 'text', limit: 300 },
				{ key: 'description', label: 'Description', inputType: 'textarea', aiEnhanceable: true, limit: 1000 },
				{ key: 'year', label: 'Year', inputType: 'text', placeholder: 'e.g. 2022', limit: 10 },
				{ key: 'achievement_url', label: 'URL', inputType: 'url', limit: 500 }
			],
			emptyItem: () => ({ title: '', description: '', year: '', achievement_url: '' })
		},
		awards: {
			label: 'Awards',
			categories: ['designer'],
			type: 'array',
			itemTitle: (item, i) => (item.title as string) || `Award ${i + 1}`,
			fields: [
				{ key: 'title', label: 'Award Title', inputType: 'text', aiEnhanceable: true, limit: 300 },
				{ key: 'awarding_body', label: 'Awarding Body', inputType: 'text', limit: 200 },
				{ key: 'year', label: 'Year', inputType: 'text', placeholder: 'e.g. 2023', limit: 10 },
				{ key: 'award_url', label: 'URL', inputType: 'url', limit: 500 }
			],
			emptyItem: () => ({ title: '', awarding_body: '', year: '', award_url: '' })
		},
		campaigns: {
			label: 'Campaigns',
			categories: ['marketing'],
			type: 'array',
			itemTitle: (item, i) => (item.campaign_name as string) || `Campaign ${i + 1}`,
			fields: [
				{ key: 'campaign_name', label: 'Campaign Name', inputType: 'text', limit: 300 },
				{ key: 'campaign_type', label: 'Campaign Type', inputType: 'text', limit: 200 },
				{ key: 'channels_used', label: 'Channels Used (one per line)', inputType: 'list' },
				{ key: 'budget', label: 'Budget', inputType: 'text', limit: 100 },
				{ key: 'performance_metrics', label: 'Performance Metrics (one per line)', inputType: 'list', aiEnhanceable: true }
			],
			emptyItem: () => ({ campaign_name: '', campaign_type: '', channels_used: [], budget: '', performance_metrics: [] })
		},
		financial_modeling: {
			label: 'Financial Modeling',
			categories: ['finance'],
			type: 'array',
			itemTitle: (item, i) => (item.model_type as string) || `Model ${i + 1}`,
			fields: [
				{ key: 'model_type', label: 'Model Type', inputType: 'text', limit: 200 },
				{ key: 'tools_used', label: 'Tools Used (one per line)', inputType: 'list' },
				{ key: 'outcome', label: 'Outcome', inputType: 'textarea', aiEnhanceable: true, limit: 1000 }
			],
			emptyItem: () => ({ model_type: '', tools_used: [], outcome: '' })
		},
		investment_portfolios: {
			label: 'Investment Portfolios',
			categories: ['finance'],
			type: 'array',
			itemTitle: (item, i) => (item.portfolio_type as string) || `Portfolio ${i + 1}`,
			fields: [
				{ key: 'portfolio_type', label: 'Portfolio Type', inputType: 'text', limit: 200 },
				{ key: 'assets_under_management', label: 'Assets Under Management', inputType: 'text', limit: 200 },
				{ key: 'performance_return', label: 'Performance / Return', inputType: 'textarea', aiEnhanceable: true, limit: 1000 }
			],
			emptyItem: () => ({ portfolio_type: '', assets_under_management: '', performance_return: '' })
		},
		design_philosophy: {
			label: 'Design Philosophy',
			categories: ['designer'],
			type: 'string',
			itemTitle: () => '',
			fields: [{ key: 'value', label: 'Design Philosophy', inputType: 'textarea', limit: 2000 }],
			emptyItem: () => ({})
		},
		software_proficiency: {
			label: 'Software Proficiency',
			categories: ['designer'],
			type: 'list',
			itemTitle: () => '',
			fields: [],
			emptyItem: () => ({})
		}
	};

	// ── Profile fields ──────────────────────────────────────────────────────────

	const PROFILE_FIELDS: Array<{
		key: EditableField;
		label: string;
		hint: string;
		limit: number;
		multiline: boolean;
	}> = [
		{ key: 'headline', label: 'Professional Headline', hint: 'e.g. "Full-Stack Engineer · React · Node.js"', limit: 150, multiline: false },
		{ key: 'bio', label: 'About / Bio', hint: 'A short paragraph introducing who you are and what you do.', limit: 600, multiline: true },
		{ key: 'uniqueValue', label: 'Unique Value Proposition', hint: 'What sets you apart from others in your field?', limit: 400, multiline: true }
	];

	interface ProfileFieldState {
		value: string;
		original: string;
		status: 'idle' | 'saving' | 'saved' | 'error';
		errorMsg: string;
		aiLoading: boolean;
		aiInstruction: string;
		aiError: string;
		aiSuggestion: string | null;
		showAiPanel: boolean;
	}

	function emptyProfileField(): ProfileFieldState {
		return { value: '', original: '', status: 'idle', errorMsg: '', aiLoading: false, aiInstruction: '', aiError: '', aiSuggestion: null, showAiPanel: false };
	}

	let profileFields: Record<EditableField, ProfileFieldState> = $state({
		headline: emptyProfileField(),
		bio: emptyProfileField(),
		uniqueValue: emptyProfileField()
	});

	// ── Raw profile state (parsedData.profile) ───────────────────────────────────

	interface RawProfileState {
		full_name: string;
		headline: string;
		email: string;
		phone: string;
		location: string;
		summary: string;
		social_linkedin: string;
		social_github: string;
		social_gitlab: string;
		social_portfolio: string;
		social_twitter: string;
	}

	function emptyRawProfile(): RawProfileState {
		return { full_name: '', headline: '', email: '', phone: '', location: '', summary: '', social_linkedin: '', social_github: '', social_gitlab: '', social_portfolio: '', social_twitter: '' };
	}

	let rawProfile: RawProfileState = $state(emptyRawProfile());
	let rawProfileOriginal: RawProfileState = $state(emptyRawProfile());
	let rawProfileStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let rawProfileError: string = $state('');

	const isRawProfileDirty = $derived(JSON.stringify(rawProfile) !== JSON.stringify(rawProfileOriginal));

	// ── Section item state ──────────────────────────────────────────────────────

	interface ItemState {
		data: Record<string, unknown>;
		original: Record<string, unknown>;
		expanded: boolean;
		isDirty: boolean;
		isSaving: boolean;
		saveError: string;
		saveSuccess: boolean;
		aiField: string;
		aiInstruction: string;
		aiLoading: boolean;
		aiSuggestion: string | string[] | null;
		aiError: string;
		showAiPanel: boolean;
	}

	function emptyItemState(data: Record<string, unknown>): ItemState {
		return {
			data,
			original: JSON.parse(JSON.stringify(data)),
			expanded: false,
			isDirty: false,
			isSaving: false,
			saveError: '',
			saveSuccess: false,
			aiField: '',
			aiInstruction: '',
			aiLoading: false,
			aiSuggestion: null,
			aiError: '',
			showAiPanel: false
		};
	}

	let sections: Record<string, ItemState[]> = $state({});
	let stringSections: Record<string, string> = $state({});
	let stringSectionOriginals: Record<string, string> = $state({});
	let stringSectionStatus: Record<string, 'idle' | 'saving' | 'saved' | 'error'> = $state({});

	// Skills
	let skillGroups: SkillGroup[] = $state([]);
	let skillGroupsOriginal: SkillGroup[] = $state([]);
	let skillsStatus: 'idle' | 'saving' | 'saved' | 'error' = $state('idle');
	let skillsSaveError: string = $state('');
	let skillsAiInstruction: string = $state('');
	let skillsAiLoading: boolean = $state(false);
	let skillsAiSuggestion: SkillGroup[] | null = $state(null);
	let skillsAiError: string = $state('');
	let showSkillsAiPanel: boolean = $state(false);

	// ── Page state ──────────────────────────────────────────────────────────────

	let pageLoading = $state(true);
	let pageError = $state('');
	let category = $state('software_engineer');
	let parsedDataRef: ParsedData | null = $state(null);
	let activeTab = $state('profile');

	// ── Section ordering & visibility ──────────────────────────────────────────
	interface DndItem { id: string; }
	let dndItems = $state<DndItem[]>([]);
	let sectionOrder = $state<string[]>([...DEFAULT_SECTION_ORDER]);
	let hiddenSections = $state<Set<string>>(new Set());

	// ── Preview ────────────────────────────────────────────────────────────────
	let draftUrl = $state('');
	let publishedUrl = $state('');   // fallback: last published portfolio
	let draftExists = $state(false);
	let iframeKey = $state(0);
	let previewStatus = $state<'idle' | 'updating' | 'ready' | 'timeout'>('idle');
	let previewRefreshTimer: ReturnType<typeof setTimeout> | null = null;
	let previewPollTimer: ReturnType<typeof setTimeout> | null = null;

	// The URL actually shown in the iframe:
	// • after a save attempt → draftUrl (poll until ready)
	// • on first load with no draft → publishedUrl (last published)
	// • nothing published yet → empty (show placeholder)
	const activePreviewUrl = $derived(draftExists ? draftUrl : publishedUrl);

	// ── Publish ────────────────────────────────────────────────────────────────
	let hasUnpublishedChanges = $state(false);
	let publishStatus = $state<'idle' | 'publishing' | 'done' | 'error'>('idle');
	let publishToast = $state('');

	// ── Mobile layout ──────────────────────────────────────────────────────────
	let mobileTab = $state<'sections' | 'preview' | 'edit'>('edit');

	const visibleSectionKeys = $derived(
		Object.entries(SECTION_CONFIG)
			.filter(([key, cfg]) => {
				const cats: string[] = cfg.categories;
				const matchCat = cats.includes('*') || cats.includes(category);
				const hasData = parsedDataRef != null && key in parsedDataRef;
				return matchCat || hasData;
			})
			.map(([key]) => key)
	);

	// ── Load ────────────────────────────────────────────────────────────────────

	onMount(async () => {
		const result = await getPortfolioData(userId);
		pageLoading = false;

		// Non-blocking: show error but still render the (empty) form
		if (!result.ok || !result.data) {
			pageError = 'Could not load existing portfolio data. You can still edit and save below.';
		}

		const portfolioContent = result.data?.portfolioContent ?? { bio: '', headline: '', uniqueValue: '' };
		const parsedData = result.data?.parsedData ?? {};
		const cat = result.data?.category ?? 'software_engineer';
		category = cat;
		parsedDataRef = parsedData;

		// Raw profile info (parsedData.profile)
		const prof = (parsedData.profile ?? {}) as Record<string, unknown>;
		const soc = (prof.social_links ?? {}) as Record<string, string>;
		const loadedRaw: RawProfileState = {
			full_name:        (prof.full_name as string)  ?? '',
			headline:         (prof.headline as string)   ?? '',
			email:            (prof.email as string)      ?? '',
			phone:            (prof.phone as string)      ?? '',
			location:         (prof.location as string)   ?? '',
			summary:          (prof.summary as string)    ?? '',
			social_linkedin:  soc.linkedin   ?? '',
			social_github:    soc.github     ?? '',
			social_gitlab:    soc.gitlab     ?? '',
			social_portfolio: soc.portfolio  ?? '',
			social_twitter:   soc.twitter    ?? '',
		};
		rawProfile = loadedRaw;
		rawProfileOriginal = JSON.parse(JSON.stringify(loadedRaw));

		// Portfolio content fields (AI-generated layer)
		profileFields.headline = { ...emptyProfileField(), value: portfolioContent.headline, original: portfolioContent.headline };
		profileFields.bio = { ...emptyProfileField(), value: portfolioContent.bio, original: portfolioContent.bio };
		profileFields.uniqueValue = { ...emptyProfileField(), value: portfolioContent.uniqueValue, original: portfolioContent.uniqueValue };

		// Skills
		const rawSkills: SkillGroup[] = (parsedData.skills as SkillGroup[]) ?? [];
		skillGroups = JSON.parse(JSON.stringify(rawSkills));
		skillGroupsOriginal = JSON.parse(JSON.stringify(rawSkills));

		// Array sections
		const newSections: Record<string, ItemState[]> = {};
		for (const [key, cfg] of Object.entries(SECTION_CONFIG)) {
			if (cfg.type !== 'array') continue;
			const raw = (parsedData as Record<string, unknown>)[key];
			newSections[key] = Array.isArray(raw)
				? (raw as Record<string, unknown>[]).map((item) => emptyItemState(JSON.parse(JSON.stringify(item))))
				: [];
		}
		sections = newSections;

		// String / list sections
		const dp = parsedData.design_philosophy ?? '';
		const sp = (parsedData.software_proficiency ?? []).join('\n');
		stringSections = { design_philosophy: dp, software_proficiency: sp };
		stringSectionOriginals = { design_philosophy: dp, software_proficiency: sp };
		stringSectionStatus = { design_philosophy: 'idle', software_proficiency: 'idle' };

		// Section order + visibility from API
		if (result.data?.sectionOrder) sectionOrder = result.data.sectionOrder;
		if (result.data?.hiddenSections) hiddenSections = new Set(result.data.hiddenSections);

		// Build dndItems from visible sections in order
		const visibleKeys = Object.entries(SECTION_CONFIG)
			.filter(([key, cfg]) => {
				const cats = cfg.categories;
				return cats.includes('*') || cats.includes(cat) || (parsedData as Record<string, unknown>)[key] != null;
			})
			.map(([key]) => key);
		if (!visibleKeys.includes('skills')) visibleKeys.push('skills');
		const sortedVisible = sectionOrder
			.filter(k => visibleKeys.includes(k))
			.concat(visibleKeys.filter(k => !sectionOrder.includes(k)));
		dndItems = sortedVisible.map(k => ({ id: k }));

		// Load preview URLs and check what's already built in S3
		try {
			const urlRes = await fetch('/api/portfolio/url');
			if (urlRes.ok) {
				const urlData = await urlRes.json();
				draftUrl = urlData.draftUrl ?? '';
				publishedUrl = urlData.url ?? '';
				// Server-side check (no CORS restrictions) for what exists in S3
				try {
					const checkRes = await fetch('/api/portfolio/draft-ready');
					if (checkRes.ok) {
						const checkData = await checkRes.json();
						draftExists = checkData.ready === true;
						// If no draft yet, check whether the published portfolio exists
						if (!draftExists && publishedUrl) {
							publishedUrl = checkData.publishedReady === true ? publishedUrl : '';
						}
					}
				} catch { /* non-critical */ }
			}
		} catch { /* non-critical */ }
	});

	// ── Profile save/AI ─────────────────────────────────────────────────────────

	const isProfileDirty = $derived(
		(Object.keys(profileFields) as EditableField[]).some((k) => profileFields[k].value !== profileFields[k].original)
		|| isRawProfileDirty
	);
	const isProfileSavingAny = $derived(
		(Object.keys(profileFields) as EditableField[]).some((k) => profileFields[k].status === 'saving')
		|| rawProfileStatus === 'saving'
	);

	async function saveProfileField(key: EditableField) {
		const f = profileFields[key];
		if (f.value === f.original || f.status === 'saving') return;
		profileFields[key].status = 'saving';
		profileFields[key].errorMsg = '';
		const result = await savePortfolioContent(userId, key, f.value);
		if (result.ok) {
			profileFields[key].original = f.value;
			profileFields[key].status = 'saved';
			queuePreviewRefresh();
			setTimeout(() => { profileFields[key].status = 'idle'; }, 2500);
		} else {
			profileFields[key].status = 'error';
			profileFields[key].errorMsg = result.error ?? 'Save failed. Please try again.';
		}
	}

	async function saveAllProfile() {
		const dirty = (Object.keys(profileFields) as EditableField[]).filter(
			(k) => profileFields[k].value !== profileFields[k].original && profileFields[k].status !== 'saving'
		);
		const tasks = dirty.map(saveProfileField);
		if (isRawProfileDirty) tasks.push(saveRawProfile());
		await Promise.all(tasks);
	}

	async function saveRawProfile() {
		if (!isRawProfileDirty || rawProfileStatus === 'saving') return;
		rawProfileStatus = 'saving';
		rawProfileError = '';
		const social_links: Record<string, string> = {};
		if (rawProfile.social_linkedin)  social_links.linkedin  = rawProfile.social_linkedin;
		if (rawProfile.social_github)    social_links.github    = rawProfile.social_github;
		if (rawProfile.social_gitlab)    social_links.gitlab    = rawProfile.social_gitlab;
		if (rawProfile.social_portfolio) social_links.portfolio = rawProfile.social_portfolio;
		if (rawProfile.social_twitter)   social_links.twitter   = rawProfile.social_twitter;
		const profileData = {
			full_name: rawProfile.full_name,
			headline:  rawProfile.headline,
			email:     rawProfile.email,
			phone:     rawProfile.phone,
			location:  rawProfile.location,
			summary:   rawProfile.summary,
			social_links,
		};
		const result = await savePortfolioSection(userId, 'profile', profileData);
		if (result.ok) {
			rawProfileOriginal = JSON.parse(JSON.stringify(rawProfile));
			rawProfileStatus = 'saved';
			queuePreviewRefresh();
			setTimeout(() => { rawProfileStatus = 'idle'; }, 2500);
		} else {
			rawProfileStatus = 'error';
			rawProfileError = result.error ?? 'Save failed. Please try again.';
		}
	}

	async function enhanceProfileField(key: EditableField) {
		const f = profileFields[key];
		if (!f.aiInstruction.trim() || f.aiLoading) return;
		profileFields[key].aiLoading = true;
		profileFields[key].aiSuggestion = null;
		profileFields[key].aiError = '';
		const result = await getAiEnhancement(userId, key, f.aiInstruction, f.value);
		profileFields[key].aiLoading = false;
		if (result.ok && result.data) {
			profileFields[key].aiSuggestion = result.data.suggestion;
		} else {
			profileFields[key].aiError = result.error ?? 'Enhancement failed. Please try again.';
		}
	}

	function acceptProfileSuggestion(key: EditableField) {
		const s = profileFields[key].aiSuggestion;
		if (!s) return;
		profileFields[key].value = s;
		profileFields[key].aiSuggestion = null;
		profileFields[key].showAiPanel = false;
		profileFields[key].aiInstruction = '';
		profileFields[key].aiError = '';
	}

	// ── Skills ──────────────────────────────────────────────────────────────────

	const isSkillsDirty = $derived(JSON.stringify(skillGroups) !== JSON.stringify(skillGroupsOriginal));

	async function saveSkills() {
		if (!isSkillsDirty || skillsStatus === 'saving') return;
		skillsStatus = 'saving';
		skillsSaveError = '';
		const result = await savePortfolioSection(userId, 'skills', skillGroups);
		if (result.ok) {
			skillGroupsOriginal = JSON.parse(JSON.stringify(skillGroups));
			skillsStatus = 'saved';
			queuePreviewRefresh();
			setTimeout(() => { skillsStatus = 'idle'; }, 2500);
		} else {
			skillsStatus = 'error';
			skillsSaveError = result.error ?? 'Save failed. Please try again.';
		}
	}

	async function enhanceSkills() {
		if (!skillsAiInstruction.trim() || skillsAiLoading) return;
		skillsAiLoading = true;
		skillsAiSuggestion = null;
		skillsAiError = '';
		const result = await getAiSkillsEnhancement(userId, skillsAiInstruction);
		skillsAiLoading = false;
		if (result.ok && result.data) {
			skillsAiSuggestion = result.data.suggestion;
		} else {
			skillsAiError = result.error ?? 'Enhancement failed. Please try again.';
		}
	}

	function acceptSkillsSuggestion() {
		if (!skillsAiSuggestion) return;
		skillGroups = JSON.parse(JSON.stringify(skillsAiSuggestion));
		skillsAiSuggestion = null;
		showSkillsAiPanel = false;
		skillsAiInstruction = '';
		skillsAiError = '';
	}

	function addSkillGroup() {
		skillGroups = [...skillGroups, { category: '', skills: [] }];
	}

	function removeSkillGroup(i: number) {
		skillGroups = skillGroups.filter((_, idx) => idx !== i);
	}

	function updateSkillGroupCategory(i: number, val: string) {
		const updated = [...skillGroups];
		updated[i] = { ...updated[i], category: val };
		skillGroups = updated;
	}

	function updateSkillGroupSkills(i: number, val: string) {
		const updated = [...skillGroups];
		updated[i] = { ...updated[i], skills: val.split('\n').map((s) => s.trim()).filter(Boolean) };
		skillGroups = updated;
	}

	// ── Array sections ──────────────────────────────────────────────────────────

	function getFieldValue(item: Record<string, unknown>, fieldKey: string, inputType: string): string {
		const v = item[fieldKey];
		if (Array.isArray(v)) return (v as string[]).join('\n');
		if (typeof v === 'boolean') return v ? 'true' : '';
		return (v as string) ?? '';
	}

	function setFieldValue(sectionKey: string, itemIdx: number, fieldKey: string, inputType: string, val: string) {
		const items = sections[sectionKey];
		const item = { ...items[itemIdx].data };
		item[fieldKey] = inputType === 'list'
			? val.split('\n').map((s) => s.trim()).filter(Boolean)
			: val;
		const updated = [...items];
		updated[itemIdx] = {
			...updated[itemIdx],
			data: item,
			isDirty: JSON.stringify(item) !== JSON.stringify(updated[itemIdx].original)
		};
		sections = { ...sections, [sectionKey]: updated };
	}

	function toggleItemExpand(sectionKey: string, itemIdx: number) {
		const items = [...sections[sectionKey]];
		items[itemIdx] = { ...items[itemIdx], expanded: !items[itemIdx].expanded };
		sections = { ...sections, [sectionKey]: items };
	}

	function addItem(sectionKey: string) {
		const cfg = SECTION_CONFIG[sectionKey];
		const newItem = emptyItemState(cfg.emptyItem());
		newItem.expanded = true;
		newItem.isDirty = true;
		sections = { ...sections, [sectionKey]: [...sections[sectionKey], newItem] };
	}

	function deleteItem(sectionKey: string, itemIdx: number) {
		if (!confirm('Delete this item? This cannot be undone.')) return;
		const items = sections[sectionKey].filter((_, i) => i !== itemIdx);
		sections = { ...sections, [sectionKey]: items };
		savePortfolioSection(userId, sectionKey, items.map((it) => it.data));
		queuePreviewRefresh();
	}

	async function saveItem(sectionKey: string, itemIdx: number) {
		const items = [...sections[sectionKey]];
		items[itemIdx] = { ...items[itemIdx], isSaving: true, saveError: '' };
		sections = { ...sections, [sectionKey]: items };

		const allData = sections[sectionKey].map((it) => it.data);
		const result = await savePortfolioSection(userId, sectionKey, allData);

		const updated = [...sections[sectionKey]];
		if (result.ok) {
			updated[itemIdx] = {
				...updated[itemIdx],
				original: JSON.parse(JSON.stringify(updated[itemIdx].data)),
				isDirty: false,
				isSaving: false,
				saveSuccess: true,
				saveError: ''
			};
			sections = { ...sections, [sectionKey]: updated };
			queuePreviewRefresh();
			setTimeout(() => {
				const u = [...sections[sectionKey]];
				if (u[itemIdx]) {
					u[itemIdx] = { ...u[itemIdx], saveSuccess: false };
					sections = { ...sections, [sectionKey]: u };
				}
			}, 2500);
		} else {
			updated[itemIdx] = { ...updated[itemIdx], isSaving: false, saveError: result.error ?? 'Save failed.' };
			sections = { ...sections, [sectionKey]: updated };
		}
	}

	async function enhanceItem(sectionKey: string, itemIdx: number) {
		const item = sections[sectionKey][itemIdx];
		if (!item.aiField || !item.aiInstruction.trim() || item.aiLoading) return;

		const updated = [...sections[sectionKey]];
		updated[itemIdx] = { ...updated[itemIdx], aiLoading: true, aiSuggestion: null, aiError: '' };
		sections = { ...sections, [sectionKey]: updated };

		const result = await getAiItemEnhancement(userId, sectionKey, itemIdx, item.aiField, item.aiInstruction);

		const u = [...sections[sectionKey]];
		u[itemIdx] = { ...u[itemIdx], aiLoading: false };
		if (result.ok && result.data) {
			u[itemIdx] = { ...u[itemIdx], aiSuggestion: result.data.suggestion };
		} else {
			u[itemIdx] = { ...u[itemIdx], aiError: result.error ?? 'Enhancement failed.' };
		}
		sections = { ...sections, [sectionKey]: u };
	}

	function acceptItemSuggestion(sectionKey: string, itemIdx: number) {
		const item = sections[sectionKey][itemIdx];
		if (!item.aiSuggestion) return;
		const updatedData = { ...item.data };
		updatedData[item.aiField] = item.aiSuggestion;
		const updated = [...sections[sectionKey]];
		updated[itemIdx] = {
			...updated[itemIdx],
			data: updatedData,
			isDirty: JSON.stringify(updatedData) !== JSON.stringify(item.original),
			aiSuggestion: null,
			showAiPanel: false,
			aiField: '',
			aiInstruction: '',
			aiError: ''
		};
		sections = { ...sections, [sectionKey]: updated };
	}

	function toggleItemAiPanel(sectionKey: string, itemIdx: number) {
		const items = [...sections[sectionKey]];
		const opening = !items[itemIdx].showAiPanel;
		// Auto-select the field if there is only one enhanceable field
		let autoField = items[itemIdx].aiField;
		if (opening && !autoField) {
			const enhanceable = SECTION_CONFIG[sectionKey]?.fields.filter((f) => f.aiEnhanceable) ?? [];
			if (enhanceable.length === 1) autoField = enhanceable[0].key;
		}
		items[itemIdx] = { ...items[itemIdx], showAiPanel: opening, aiSuggestion: null, aiError: '', aiInstruction: '', aiField: autoField };
		sections = { ...sections, [sectionKey]: items };
	}

	function setItemAiField(sectionKey: string, itemIdx: number, fieldKey: string) {
		const items = [...sections[sectionKey]];
		items[itemIdx] = { ...items[itemIdx], aiField: fieldKey };
		sections = { ...sections, [sectionKey]: items };
	}

	function setItemAiInstruction(sectionKey: string, itemIdx: number, val: string) {
		const items = [...sections[sectionKey]];
		items[itemIdx] = { ...items[itemIdx], aiInstruction: val };
		sections = { ...sections, [sectionKey]: items };
	}

	// ── String/list sections ────────────────────────────────────────────────────

	async function saveStringSection(key: string) {
		if (stringSections[key] === stringSectionOriginals[key]) return;
		stringSectionStatus = { ...stringSectionStatus, [key]: 'saving' };
		const cfg = SECTION_CONFIG[key];
		const data: string | string[] = cfg?.type === 'list'
			? stringSections[key].split('\n').map((s) => s.trim()).filter(Boolean)
			: stringSections[key];
		const result = await savePortfolioSection(userId, key, data);
		if (result.ok) {
			stringSectionOriginals = { ...stringSectionOriginals, [key]: stringSections[key] };
			stringSectionStatus = { ...stringSectionStatus, [key]: 'saved' };
			queuePreviewRefresh();
			setTimeout(() => { stringSectionStatus = { ...stringSectionStatus, [key]: 'idle' }; }, 2500);
		} else {
			stringSectionStatus = { ...stringSectionStatus, [key]: 'error' };
		}
	}

	function sectionLabel(key: string): string {
		if (key === 'skills') return 'Skills';
		return SECTION_CONFIG[key]?.label ?? key;
	}

	// ── Preview refresh ──────────────────────────────────────────────────────────
	function queuePreviewRefresh() {
		hasUnpublishedChanges = true;
		previewStatus = 'updating';

		// Cancel any in-progress poll/timer
		if (previewRefreshTimer) { clearTimeout(previewRefreshTimer); previewRefreshTimer = null; }
		if (previewPollTimer) { clearTimeout(previewPollTimer); previewPollTimer = null; }

		// Poll the draft URL until the file is ready (Content-Type: text/html)
		// Timeout after 45 seconds to avoid polling forever
		const pollStart = Date.now();
		const POLL_INTERVAL = 2500;
		const POLL_TIMEOUT = 45_000;

		function poll() {
			fetch('/api/portfolio/draft-ready')
				.then((res) => res.json())
				.then((data: { ready: boolean }) => {
					if (data.ready) {
						draftExists = true;
						iframeKey += 1;
						previewStatus = 'ready';
					} else if (Date.now() - pollStart > POLL_TIMEOUT) {
						previewStatus = 'timeout';
					} else {
						previewPollTimer = setTimeout(poll, POLL_INTERVAL);
					}
				})
				.catch(() => {
					if (Date.now() - pollStart > POLL_TIMEOUT) {
						previewStatus = 'timeout';
					} else {
						previewPollTimer = setTimeout(poll, POLL_INTERVAL);
					}
				});
		}

		// Small initial delay to let the Lambda start before first poll
		previewRefreshTimer = setTimeout(poll, 3000);
	}

	// ── Section ordering / visibility ────────────────────────────────────────────
	function handleDndConsider(e: CustomEvent<{ items: DndItem[] }>) {
		dndItems = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent<{ items: DndItem[] }>) {
		dndItems = e.detail.items;
		sectionOrder = dndItems.map(i => i.id);
		await updatePortfolioConfig(userId, { sectionOrder });
		queuePreviewRefresh();
	}

	async function toggleSectionVisibility(key: string) {
		const newHidden = new Set(hiddenSections);
		if (newHidden.has(key)) newHidden.delete(key);
		else newHidden.add(key);
		hiddenSections = newHidden;
		await updatePortfolioConfig(userId, { hiddenSections: [...hiddenSections] });
		queuePreviewRefresh();
	}

	// ── Publish ──────────────────────────────────────────────────────────────────
	async function handlePublish() {
		if (publishStatus === 'publishing') return;
		publishStatus = 'publishing';
		publishToast = '';
		const result = await publishPortfolio(userId);
		if (result.ok) {
			publishStatus = 'done';
			publishToast = 'Publishing started — live in ~15s';
			hasUnpublishedChanges = false;
			setTimeout(() => { publishStatus = 'idle'; publishToast = ''; }, 8000);
		} else {
			publishStatus = 'error';
			publishToast = result.error ?? 'Publish failed. Please try again.';
			setTimeout(() => { publishStatus = 'idle'; publishToast = ''; }, 5000);
		}
	}
</script>

<svelte:head>
	<title>Edit Portfolio — AIfolio</title>
</svelte:head>

{#if publishToast}
	<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-bold shadow-xl ring-1 {publishStatus === 'error' ? 'bg-red-600 text-white ring-red-500' : 'bg-slate-900 text-white ring-slate-700'}">
		{publishToast}
	</div>
{/if}

<div class="flex h-screen flex-col bg-surface-subtle">
	<AppHeader />

	<div use:reveal class="flex flex-shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
		<div class="flex min-w-0 items-center gap-3">
			<a href="/app/dashboard" class="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Back">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
			</a>
			<h1 class="truncate text-lg font-bold text-slate-900">Edit Portfolio</h1>
			{#if hasUnpublishedChanges}
				<span class="hidden flex-shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-200 sm:inline">Draft</span>
			{/if}
		</div>
		<div class="flex flex-shrink-0 items-center gap-2">
			{#if publishStatus === 'done'}
				<span class="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200 sm:inline">Published ✓</span>
			{/if}
			<button onclick={handlePublish} disabled={publishStatus === 'publishing'} class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50">
				{publishStatus === 'publishing' ? 'Publishing…' : 'Publish'}
			</button>
		</div>
	</div>

	<div class="flex flex-shrink-0 border-b border-slate-200 bg-white sm:hidden">
		{#each [['sections', 'Sections'], ['preview', 'Preview'], ['edit', 'Edit']] as [tab, label] (tab)}
			<button onclick={() => (mobileTab = tab as typeof mobileTab)} class="flex-1 py-2.5 text-sm font-bold transition-colors {mobileTab === tab ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500'}">{label}</button>
		{/each}
	</div>

	<div class="flex min-h-0 flex-1 overflow-hidden">

		<aside class="{mobileTab === 'sections' ? 'flex' : 'hidden'} sm:flex w-full sm:w-52 flex-col flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50">
			<div class="p-3 space-y-0.5">
				<button onclick={() => { activeTab = 'profile'; mobileTab = 'edit'; }} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}">
					Profile
				</button>
				{#if !pageLoading}
					<div use:dndzone={{ items: dndItems, flipDurationMs: 150 }} onconsider={handleDndConsider} onfinalize={handleDndFinalize} class="flex flex-col space-y-0.5">
						{#each dndItems as item (item.id)}
							<div class="flex items-center rounded-lg transition-colors {activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}">
								<div class="flex-shrink-0 cursor-grab px-2 py-2 opacity-40 active:cursor-grabbing">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/></svg>
								</div>
								<button class="flex-1 py-2 text-left text-sm font-medium" onclick={() => { activeTab = item.id; mobileTab = 'edit'; }}>{sectionLabel(item.id)}</button>
								<button onclick={(e) => { e.stopPropagation(); toggleSectionVisibility(item.id); }} class="flex-shrink-0 rounded p-1.5 opacity-60 transition-opacity hover:opacity-100" title={hiddenSections.has(item.id) ? 'Show section' : 'Hide section'}>
									{#if hiddenSections.has(item.id)}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
									{/if}
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</aside>

		<div class="{mobileTab === 'preview' ? 'flex' : 'hidden'} sm:flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-slate-100">
			<div class="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
				<span class="text-sm font-bold text-slate-600">Preview</span>
				<div class="flex items-center gap-3">
					{#if previewStatus === 'updating'}
						<span class="flex items-center gap-1.5 text-xs text-amber-600"><Spinner size="sm" /> Updating…</span>
					{/if}
					<button onclick={() => { iframeKey += 1; }} class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50">↺ Refresh</button>
				</div>
			</div>
			<div class="relative flex-1 overflow-hidden">
				{#if !activePreviewUrl && previewStatus !== 'updating'}
					{#if previewStatus === 'timeout'}
						<div class="flex h-full flex-col items-center justify-center gap-3">
							<p class="text-sm text-slate-400">Preview is taking longer than expected.</p>
							<button onclick={queuePreviewRefresh} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Retry</button>
						</div>
					{:else}
						<div class="flex h-full items-center justify-center"><p class="text-sm text-slate-400">No portfolio generated yet.</p></div>
					{/if}
				{:else}
					{#key iframeKey}
						<iframe src={activePreviewUrl} title="Portfolio Preview" class="h-full w-full border-0" sandbox="allow-scripts allow-same-origin"></iframe>
					{/key}
					{#if previewStatus === 'updating'}
						<div class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
							<div class="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-slate-100">
								<Spinner size="sm" />
								<span class="text-sm font-bold text-slate-700">Building preview…</span>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>

		<div class="{mobileTab === 'edit' ? 'flex' : 'hidden'} sm:flex w-full sm:w-[460px] sm:flex-shrink-0 flex-col overflow-y-auto">
			<div class="p-4 sm:p-6 space-y-4">

			{#if pageLoading}
				<LoadingState size="lg" message="Loading your portfolio content…" />
			{:else}
				{#if pageError}
					<div role="alert" aria-live="polite" class="rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
						<p class="text-sm font-medium text-amber-800">{pageError}</p>
					</div>
				{/if}

				{#if activeTab === 'profile'}
					{#if isProfileDirty}
						<div class="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 px-6 py-4 shadow-xl">
							<p class="text-sm font-bold text-white">You have unsaved changes.</p>
							<button onclick={saveAllProfile} disabled={isProfileSavingAny} class="w-full sm:w-auto rounded-xl bg-white px-5 py-2 text-sm font-bold text-slate-900 disabled:opacity-50">{isProfileSavingAny ? 'Saving…' : 'Save All Changes'}</button>
						</div>
					{/if}

					<div class="space-y-8">
					<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
						<div class="mb-5 flex items-start justify-between">
							<div>
								<p class="text-xs font-bold uppercase tracking-widest text-slate-400">Profile Info</p>
								<p class="mt-0.5 text-xs text-slate-400">Contact details and social links.</p>
							</div>
							{#if rawProfileStatus === 'saved'}<span class="flex-shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">Saved ✓</span>
							{:else if rawProfileStatus === 'error'}<span class="flex-shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">Error</span>{/if}
						</div>
						<div class="space-y-4">
							<div><label for="rp-full-name" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label><input id="rp-full-name" type="text" value={rawProfile.full_name} oninput={(e) => { rawProfile.full_name = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" /></div>
							<div><label for="rp-headline" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Professional Title</label><input id="rp-headline" type="text" value={rawProfile.headline} oninput={(e) => { rawProfile.headline = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" /></div>
							<div class="grid grid-cols-2 gap-4">
								<div><label for="rp-email" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Email</label><input id="rp-email" type="email" value={rawProfile.email} oninput={(e) => { rawProfile.email = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" /></div>
								<div><label for="rp-phone" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Phone</label><input id="rp-phone" type="text" value={rawProfile.phone} oninput={(e) => { rawProfile.phone = (e.target as HTMLInputElement).value; }} maxlength={50} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" /></div>
							</div>
							<div><label for="rp-location" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Location</label><input id="rp-location" type="text" value={rawProfile.location} oninput={(e) => { rawProfile.location = (e.target as HTMLInputElement).value; }} maxlength={200} placeholder="e.g. Hyderabad, India" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" /></div>
							<div><label for="rp-summary" class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">Summary</label><textarea id="rp-summary" value={rawProfile.summary} oninput={(e) => { rawProfile.summary = (e.target as HTMLTextAreaElement).value; }} rows={3} maxlength={2000} class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30"></textarea></div>
							<div>
								<p class="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Social Links</p>
								<div class="space-y-2">
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-slate-500">LinkedIn</span><input type="url" value={rawProfile.social_linkedin} oninput={(e) => { rawProfile.social_linkedin = (e.target as HTMLInputElement).value; }} placeholder="https://linkedin.com/in/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-slate-500">GitHub</span><input type="url" value={rawProfile.social_github} oninput={(e) => { rawProfile.social_github = (e.target as HTMLInputElement).value; }} placeholder="https://github.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-slate-500">GitLab</span><input type="url" value={rawProfile.social_gitlab} oninput={(e) => { rawProfile.social_gitlab = (e.target as HTMLInputElement).value; }} placeholder="https://gitlab.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-slate-500">Portfolio</span><input type="url" value={rawProfile.social_portfolio} oninput={(e) => { rawProfile.social_portfolio = (e.target as HTMLInputElement).value; }} placeholder="https://..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-slate-500">Twitter / X</span><input type="url" value={rawProfile.social_twitter} oninput={(e) => { rawProfile.social_twitter = (e.target as HTMLInputElement).value; }} placeholder="https://twitter.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30" /></div>
								</div>
							</div>
						</div>
						{#if rawProfileError}<p class="mt-3 text-xs font-bold text-red-500">{rawProfileError}</p>{/if}
						<div class="mt-5 flex justify-end">
							<button type="button" onclick={saveRawProfile} disabled={!isRawProfileDirty || rawProfileStatus === 'saving'} class="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-40">{rawProfileStatus === 'saving' ? 'Saving…' : 'Save Profile Info'}</button>
						</div>
					</div>

					<div><p class="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Portfolio Content <span class="font-normal normal-case ml-1">— AI-generated, edit freely</span></p></div>

					{#each PROFILE_FIELDS as { key, label, hint, limit, multiline }}
						{@const f = profileFields[key]}
						<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
							<div class="mb-4 flex items-start justify-between">
								<div><p class="text-xs font-bold tracking-widest text-slate-400 uppercase">{label}</p><p class="mt-0.5 text-xs text-slate-400">{hint}</p></div>
								{#if f.status === 'saved'}<span class="flex-shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">Saved ✓</span>
								{:else if f.status === 'error'}<span class="flex-shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">Error</span>{/if}
							</div>
							{#if multiline}
								<textarea value={f.value} oninput={(e) => { profileFields[key].value = (e.target as HTMLTextAreaElement).value; }} rows={5} maxlength={limit} disabled={f.status === 'saving'} class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/30 disabled:opacity-60"></textarea>
							{:else}
								<input type="text" value={f.value} oninput={(e) => { profileFields[key].value = (e.target as HTMLInputElement).value; }} maxlength={limit} disabled={f.status === 'saving'} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/30 disabled:opacity-60" />
							{/if}
							{#if f.errorMsg}<p class="mt-2 text-xs font-bold text-red-500">{f.errorMsg}</p>{/if}
							<div class="mt-4 flex items-center justify-between">
								<p class="text-xs text-slate-400">{f.value.length}/{limit}</p>
								<div class="flex gap-2">
									<button type="button" onclick={() => { profileFields[key].showAiPanel = !f.showAiPanel; }} class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100">✦ AI Enhance</button>
									<button type="button" onclick={() => saveProfileField(key)} disabled={f.value === f.original || f.status === 'saving'} class="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40">{f.status === 'saving' ? 'Saving…' : 'Save'}</button>
								</div>
							</div>
							{#if f.showAiPanel}
								<div class="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
									<p class="mb-2 text-xs font-bold text-amber-700 uppercase tracking-widest">AI Enhancement</p>
									<textarea value={f.aiInstruction} oninput={(e) => { profileFields[key].aiInstruction = (e.target as HTMLTextAreaElement).value; }} rows={2} placeholder="e.g. Make it more concise and impactful..." class="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"></textarea>
									{#if f.aiError}<p class="mt-2 text-xs font-bold text-red-500">{f.aiError}</p>{/if}
									{#if f.aiSuggestion}
										<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
											<p class="mb-1 text-xs font-bold text-emerald-700">Suggestion</p>
											<p class="text-sm text-slate-700">{f.aiSuggestion}</p>
											<div class="mt-3 flex gap-2">
												<button onclick={() => acceptProfileSuggestion(key)} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
												<button onclick={() => { profileFields[key].aiSuggestion = null; }} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Dismiss</button>
											</div>
										</div>
									{/if}
									<div class="mt-3 flex gap-2">
										<button onclick={() => enhanceProfileField(key)} disabled={!f.aiInstruction.trim() || f.aiLoading} class="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1.5">{#if f.aiLoading}<Spinner size="sm" />{/if}Generate</button>
										<button onclick={() => { profileFields[key].showAiPanel = false; profileFields[key].aiSuggestion = null; profileFields[key].aiError = ''; }} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Close</button>
									</div>
								</div>
							{/if}
						</div>
					{/each}
					</div>

				{:else if activeTab === 'skills'}
					<div class="space-y-4">
						{#if isSkillsDirty}
							<div class="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 px-6 py-4 shadow-xl">
								<p class="text-sm font-bold text-white">Unsaved changes in Skills.</p>
								<button onclick={saveSkills} disabled={skillsStatus === 'saving'} class="w-full sm:w-auto rounded-xl bg-white px-5 py-2 text-sm font-bold text-slate-900 disabled:opacity-50">{skillsStatus === 'saving' ? 'Saving…' : 'Save Skills'}</button>
							</div>
						{/if}
						{#each skillGroups as group, gi}
							<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
								<div class="mb-3 flex items-center gap-3">
									<input type="text" value={group.category} oninput={(e) => updateSkillGroupCategory(gi, (e.target as HTMLInputElement).value)} placeholder="Category (e.g. Frontend, Backend)" class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" />
									<button onclick={() => removeSkillGroup(gi)} class="flex-shrink-0 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100">Remove</button>
								</div>
								<textarea value={group.skills.join('\n')} oninput={(e) => updateSkillGroupSkills(gi, (e.target as HTMLTextAreaElement).value)} rows={3} placeholder="One skill per line&#10;e.g. React&#10;TypeScript&#10;Node.js" class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30"></textarea>
							</div>
						{/each}
						<div class="flex flex-wrap gap-3">
							<button onclick={addSkillGroup} class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50">+ Add Group</button>
							<button onclick={() => (showSkillsAiPanel = !showSkillsAiPanel)} class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100">✦ Enhance with AI</button>
							<button onclick={saveSkills} disabled={!isSkillsDirty || skillsStatus === 'saving'} class="ml-auto rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 hover:bg-slate-800">{skillsStatus === 'saving' ? 'Saving…' : skillsStatus === 'saved' ? 'Saved ✓' : 'Save Skills'}</button>
						</div>
						{#if skillsSaveError}<p class="text-xs font-bold text-red-500">{skillsSaveError}</p>{/if}
						{#if showSkillsAiPanel}
							<div class="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
								<p class="mb-1 text-xs font-bold text-amber-700 uppercase tracking-widest">AI Skills Enhancement</p>
								<p class="mb-3 text-xs text-amber-700/80">AI uses all your experience, projects, and certifications as context.</p>
								<textarea value={skillsAiInstruction} oninput={(e) => { skillsAiInstruction = (e.target as HTMLTextAreaElement).value; }} rows={2} placeholder="e.g. Add more specific technical skills from my experience..." class="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"></textarea>
								{#if skillsAiError}<p class="mt-2 text-xs font-bold text-red-500">{skillsAiError}</p>{/if}
								{#if skillsAiSuggestion}
									<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
										<p class="mb-2 text-xs font-bold text-emerald-700">Suggested Skills</p>
										{#each skillsAiSuggestion as grp}
											<div class="mb-2"><p class="text-xs font-bold text-slate-600">{grp.category}</p><div class="mt-1 flex flex-wrap gap-1">{#each grp.skills as s}<span class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">{s}</span>{/each}</div></div>
										{/each}
										<div class="mt-3 flex gap-2">
											<button onclick={acceptSkillsSuggestion} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
											<button onclick={() => { skillsAiSuggestion = null; }} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Dismiss</button>
										</div>
									</div>
								{/if}
								<div class="mt-3 flex gap-2">
									<button onclick={enhanceSkills} disabled={!skillsAiInstruction.trim() || skillsAiLoading} class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">{#if skillsAiLoading}<Spinner size="sm" />{/if}Generate</button>
									<button onclick={() => { showSkillsAiPanel = false; skillsAiSuggestion = null; skillsAiError = ''; }} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Close</button>
								</div>
							</div>
						{/if}
					</div>

				{:else if SECTION_CONFIG[activeTab]?.type === 'array'}
					{@const sKey = activeTab}
					{@const cfg = SECTION_CONFIG[sKey]}
					{@const items = sections[sKey] ?? []}
					<div class="space-y-4">
						{#each items as item, idx}
							<div class="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm">
								<div class="flex w-full items-center justify-between px-6 py-4">
									<button type="button" onclick={() => toggleItemExpand(sKey, idx)} class="flex min-w-0 flex-1 items-center gap-3 text-left">
										<div class="min-w-0 flex-1">
											<p class="text-sm font-bold text-slate-900">{cfg.itemTitle(item.data, idx)}</p>
											{#if item.isDirty}<span class="mt-0.5 inline-block text-xs font-bold text-amber-600">Unsaved changes</span>
											{:else if item.saveSuccess}<span class="mt-0.5 inline-block text-xs font-bold text-emerald-600">Saved ✓</span>{/if}
										</div>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform {item.expanded ? 'rotate-180' : ''}"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
									</button>
									<button type="button" onclick={() => deleteItem(sKey, idx)} class="ml-3 flex-shrink-0 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500 hover:bg-red-100">Delete</button>
								</div>
								{#if item.expanded}
									<div class="space-y-4 border-t border-slate-100 px-6 pb-6 pt-4">
										{#each cfg.fields as field}
											<div>
												<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">{field.label}</label>
												{#if field.inputType === 'textarea' || field.inputType === 'list'}
													<textarea value={getFieldValue(item.data, field.key, field.inputType)} oninput={(e) => setFieldValue(sKey, idx, field.key, field.inputType, (e.target as HTMLTextAreaElement).value)} rows={field.inputType === 'list' ? 3 : 4} maxlength={field.limit} placeholder={field.placeholder ?? (field.inputType === 'list' ? 'One item per line' : '')} class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30"></textarea>
												{:else}
													<input type={field.inputType === 'url' ? 'url' : 'text'} value={getFieldValue(item.data, field.key, field.inputType)} oninput={(e) => setFieldValue(sKey, idx, field.key, field.inputType, (e.target as HTMLInputElement).value)} maxlength={field.limit} placeholder={field.placeholder ?? ''} class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30" />
												{/if}
											</div>
										{/each}
										{#if item.saveError}<p class="text-xs font-bold text-red-500">{item.saveError}</p>{/if}
										<div class="flex items-center gap-2 pt-2">
											<button onclick={() => saveItem(sKey, idx)} disabled={!item.isDirty || item.isSaving} class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-40">{item.isSaving ? 'Saving…' : 'Save'}</button>
											<button onclick={() => toggleItemAiPanel(sKey, idx)} class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100">✦ AI Enhance</button>
										</div>
										{#if item.showAiPanel}
											{@const enhanceable = cfg.fields.filter((f) => f.aiEnhanceable)}
											<div class="mt-2 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
												<p class="mb-3 text-xs font-bold uppercase tracking-widest text-amber-700">AI Enhancement</p>
												{#if enhanceable.length > 1}
													<div class="mb-3 flex flex-wrap gap-2">{#each enhanceable as ef}<button type="button" onclick={() => setItemAiField(sKey, idx, ef.key)} class="rounded-lg px-3 py-1 text-xs font-bold transition-all {item.aiField === ef.key ? 'bg-amber-500 text-white' : 'border border-amber-200 bg-white text-amber-700'}">{ef.label}</button>{/each}</div>
												{:else if enhanceable.length === 1}
													<p class="mb-2 text-xs text-amber-700">Enhancing: <strong>{enhanceable[0].label}</strong></p>
												{/if}
												<textarea value={item.aiInstruction} oninput={(e) => setItemAiInstruction(sKey, idx, (e.target as HTMLTextAreaElement).value)} rows={2} placeholder="e.g. Make it more impactful with measurable results..." class="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"></textarea>
												{#if item.aiError}<p class="mt-2 text-xs font-bold text-red-500">{item.aiError}</p>{/if}
												{#if item.aiSuggestion}
													<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
														<p class="mb-1 text-xs font-bold text-emerald-700">Suggestion</p>
														{#if Array.isArray(item.aiSuggestion)}<ul class="space-y-1">{#each item.aiSuggestion as s}<li class="text-sm text-slate-700">• {s}</li>{/each}</ul>
														{:else}<p class="text-sm text-slate-700">{item.aiSuggestion}</p>{/if}
														<div class="mt-3 flex gap-2">
															<button onclick={() => acceptItemSuggestion(sKey, idx)} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
															<button onclick={() => { const u = [...sections[sKey]]; u[idx] = { ...u[idx], aiSuggestion: null }; sections = { ...sections, [sKey]: u }; }} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Dismiss</button>
														</div>
													</div>
												{/if}
												<div class="mt-3 flex gap-2">
													<button onclick={() => enhanceItem(sKey, idx)} disabled={!item.aiField || !item.aiInstruction.trim() || item.aiLoading} class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">{#if item.aiLoading}<Spinner size="sm" />{/if}Generate</button>
													<button onclick={() => toggleItemAiPanel(sKey, idx)} class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Close</button>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
						<button onclick={() => addItem(sKey)} class="flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white py-5 text-sm font-bold text-slate-500 transition-all hover:border-slate-400 hover:text-slate-900">+ Add {cfg.label.replace(/s$/, '')}</button>
					</div>

				{:else if SECTION_CONFIG[activeTab]?.type === 'string' || SECTION_CONFIG[activeTab]?.type === 'list'}
					{@const sKey = activeTab}
					{@const cfg = SECTION_CONFIG[sKey]}
					{@const isDirtyStr = stringSections[sKey] !== stringSectionOriginals[sKey]}
					<div class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
						<p class="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{cfg.label}</p>
						{#if cfg.type === 'list'}<p class="mb-3 text-xs text-slate-400">Enter one item per line.</p>{/if}
						<textarea value={stringSections[sKey] ?? ''} oninput={(e) => { stringSections = { ...stringSections, [sKey]: (e.target as HTMLTextAreaElement).value }; }} rows={6} class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/30"></textarea>
						<div class="mt-4 flex items-center justify-between">
							<div>
								{#if stringSectionStatus[sKey] === 'error'}<p class="text-xs font-bold text-red-500">Save failed. Please try again.</p>
								{:else if stringSectionStatus[sKey] === 'saved'}<p class="text-xs font-bold text-emerald-600">Saved ✓</p>{/if}
							</div>
							<button onclick={() => saveStringSection(sKey)} disabled={!isDirtyStr || stringSectionStatus[sKey] === 'saving'} class="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-40">{stringSectionStatus[sKey] === 'saving' ? 'Saving…' : 'Save'}</button>
						</div>
					</div>
				{/if}
			{/if}
			</div>
		</div>

	</div>
</div>
