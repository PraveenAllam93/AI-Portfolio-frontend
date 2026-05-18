<script lang="ts">
	import { onMount, tick } from 'svelte';
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
		publishPortfolio,
		getImageUploadUrl,
		generateProjectImage,
		getAiSuggestions,
		addCustomSection as addCustomSectionApi,
		type LlmSuggestion
	} from '$lib/services/portfolio';
	import { dndzone } from 'svelte-dnd-action';
	import { reveal } from '$lib/actions/animate';
	import type {
		EditableField,
		ParsedData,
		PortfolioContent,
		SkillGroup,
		CustomSection,
		CustomSectionItem
	} from '$lib/types/portfolio';
	import { DEFAULT_SECTION_ORDER } from '$lib/types/portfolio';
	import { renderPortfolio } from '$lib/templates';
	import { EDITOR_JS, EDITOR_SCRIPT } from '$lib/templates/base';

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
		inputType: 'text' | 'textarea' | 'list' | 'url' | 'images';
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
				{ key: 'images', label: 'Images (max 3)', inputType: 'images' }
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
				{ key: 'images', label: 'Images (max 3)', inputType: 'images' }
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
				{ key: 'grade_or_score', label: 'Grade / Score', inputType: 'text', limit: 100 }
			],
			emptyItem: () => ({ degree: '', field_of_study: '', institution: '', location: '', start_year: '', end_year: '', grade_or_score: '' })
		},
		certifications: {
			label: 'Certifications',
			categories: ['*'],
			type: 'array',
			itemTitle: (item, i) => (item.name as string) || `Certification ${i + 1}`,
			fields: [
				{ key: 'name', label: 'Certification Name', inputType: 'text', limit: 300 },
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
				{ key: 'title', label: 'Award Title', inputType: 'text', limit: 300 },
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
				{ key: 'performance_return', label: 'Performance / Return', inputType: 'textarea', limit: 1000 }
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
		profile_image: string;
	}

	function emptyRawProfile(): RawProfileState {
		return { full_name: '', headline: '', email: '', phone: '', location: '', summary: '', social_linkedin: '', social_github: '', social_gitlab: '', social_portfolio: '', social_twitter: '', profile_image: '' };
	}

	let rawProfile: RawProfileState = $state(emptyRawProfile());
	let rawProfileOriginal: RawProfileState = $state(emptyRawProfile());
	let rawProfileStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let rawProfileError: string = $state('');

	// Profile image upload state
	let imageUploadStatus = $state<'idle' | 'uploading' | 'done' | 'error'>('idle');
	let imageUploadError: string = $state('');

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
		activeSuggestionId: string; // tracks which LLM suggestion activated this panel
		hidden: boolean; // item hidden from portfolio (data._hidden persists this)
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
			showAiPanel: false,
			activeSuggestionId: '',
			hidden: !!(data._hidden as boolean)
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

	// ── Custom sections ─────────────────────────────────────────────────────────

	let customSections = $state<CustomSection[]>([]);
	let csExpanded = $state<Record<number, boolean>>({});
	let csSaveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let csSaveError = $state('');
	let customSectionInput = $state('');
	let customSectionTitleHint = $state('');
	let customSectionAiStatus = $state<'idle' | 'loading' | 'done' | 'error'>('idle');
	type CsAiResult =
		| { action: 'merge'; targetSection: string; item: Record<string, unknown> }
		| { action: 'new_section'; section: CustomSection };
	let customSectionAiResult = $state<CsAiResult | null>(null);
	let customSectionAiError = $state('');

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

	// ── Template ───────────────────────────────────────────────────────────────
	let templateId = $state('neon');

	// ── Live preview (client-side rendering) ───────────────────────────────────
	// Reconstruct ParsedData from in-memory editor state so the preview re-renders
	// instantly on every keystroke without any server round-trip.
	const liveParsedData = $derived<ParsedData>({
		profile: {
			full_name:     rawProfile.full_name,
			headline:      rawProfile.headline,
			email:         rawProfile.email,
			phone:         rawProfile.phone,
			location:      rawProfile.location,
			summary:       rawProfile.summary,
			profile_image: rawProfile.profile_image || undefined,
			social_links: {
				...(rawProfile.social_linkedin  ? { linkedin:  rawProfile.social_linkedin  } : {}),
				...(rawProfile.social_github    ? { github:    rawProfile.social_github    } : {}),
				...(rawProfile.social_gitlab    ? { gitlab:    rawProfile.social_gitlab    } : {}),
				...(rawProfile.social_portfolio ? { portfolio: rawProfile.social_portfolio } : {}),
				...(rawProfile.social_twitter   ? { twitter:   rawProfile.social_twitter   } : {}),
			}
		},
		skills:               skillGroups,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		experience:           (sections.experience           ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		projects:             (sections.projects             ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		education:            (sections.education            ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		certifications:       (sections.certifications       ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		achievements:         (sections.achievements         ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		awards:               (sections.awards               ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		campaigns:            (sections.campaigns            ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		financial_modeling:   (sections.financial_modeling   ?? []).filter(it => !it.hidden).map(it => it.data as any),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		investment_portfolios:(sections.investment_portfolios?? []).filter(it => !it.hidden).map(it => it.data as any),
		design_philosophy:    stringSections.design_philosophy ?? '',
		software_proficiency: (stringSections.software_proficiency ?? '').split('\n').map(s => s.trim()).filter(Boolean),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		custom_sections:      customSections as any,
	});

	const livePortfolioContent = $derived<PortfolioContent>({
		bio:         profileFields.bio.value,
		headline:    profileFields.headline.value,
		uniqueValue: profileFields.uniqueValue.value,
	});

	const renderedHTML = $derived(
		renderPortfolio(templateId, liveParsedData, livePortfolioContent, category, sectionOrder, [...hiddenSections])
	);

	// ── Delete confirmation modal ──────────────────────────────────────────────
	let deleteModal = $state<{ open: boolean; sectionKey: string; itemIdx: number }>({ open: false, sectionKey: '', itemIdx: -1 });

	function promptDeleteItem(sectionKey: string, itemIdx: number) {
		deleteModal = { open: true, sectionKey, itemIdx };
	}

	function moveItemUp(sKey: string, idx: number) {
		if (idx === 0) return;
		const items = [...sections[sKey]];
		[items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
		sections = { ...sections, [sKey]: items };
		savePortfolioSection(userId, sKey, items.map(it => it.data));
		// LLM suggestion indices are now stale — drop them so we fall back to
		// the static derived suggestions which always reflect current order.
		llmSuggestions = [];
		llmSuggestionsLoaded = false;
		queuePreviewRefresh();
	}

	function moveItemDown(sKey: string, idx: number) {
		const items = sections[sKey];
		if (idx >= items.length - 1) return;
		const updated = [...items];
		[updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
		sections = { ...sections, [sKey]: updated };
		savePortfolioSection(userId, sKey, updated.map(it => it.data));
		// LLM suggestion indices are now stale — drop them.
		llmSuggestions = [];
		llmSuggestionsLoaded = false;
		queuePreviewRefresh();
	}

	function toggleItemHidden(sKey: string, idx: number) {
		const items = [...sections[sKey]];
		const newHidden = !items[idx].hidden;
		const newData = { ...items[idx].data };
		if (newHidden) newData._hidden = true;
		else delete newData._hidden;
		items[idx] = { ...items[idx], hidden: newHidden, data: newData };
		sections = { ...sections, [sKey]: items };
		savePortfolioSection(userId, sKey, items.map(it => it.data));
		// Drop stale LLM suggestions — liveParsedData excludes hidden items so
		// indices from a previous LLM run no longer map correctly to sections[].
		llmSuggestions = [];
		llmSuggestionsLoaded = false;
		queuePreviewRefresh();
	}

	function confirmDelete() {
		const { sectionKey, itemIdx } = deleteModal;
		deleteModal = { open: false, sectionKey: '', itemIdx: -1 };
		const items = sections[sectionKey].filter((_, i) => i !== itemIdx);
		sections = { ...sections, [sectionKey]: items };
		savePortfolioSection(userId, sectionKey, items.map((it) => it.data));
		queuePreviewRefresh();
	}

	function cancelDelete() {
		deleteModal = { open: false, sectionKey: '', itemIdx: -1 };
	}

	// ── Publish ────────────────────────────────────────────────────────────────
	let hasUnpublishedChanges = $state(false);
	let publishStatus = $state<'idle' | 'publishing' | 'done' | 'error'>('idle');
	let publishToast = $state('');

	// ── Mobile layout ──────────────────────────────────────────────────────────
	let mobileTab = $state<'sections' | 'preview' | 'edit'>('edit');

	// ── AI Suggestions ─────────────────────────────────────────────────────────

	interface SuggestionItem {
		id: string;
		section: string;
		index?: number;
		field?: string;
		profileKey?: EditableField;
		label: string;
		sublabel: string;
		instruction: string;
		priority: 'high' | 'medium' | 'low';
	}

	let dismissedSuggestions = $state<Set<string>>(new Set());
	let activeSkillsSuggestionId = $state('');
	let activeProfileSuggestionIds = $state<Record<string, string>>({});
	let llmSuggestions = $state<LlmSuggestion[]>([]);
	let llmSuggestionsLoading = $state(false);
	let llmSuggestionsLoaded = $state(false);
	let llmSuggestionsError = $state('');

	async function fetchLlmSuggestions() {
		llmSuggestionsLoading = true;
		llmSuggestionsError = '';
		// Pass current in-memory state so the LLM always sees what the user sees,
		// regardless of whether auto-save debounce has flushed to DynamoDB yet.
		const result = await getAiSuggestions(userId, {
			parsedData: liveParsedData,
			portfolioContent: livePortfolioContent,
			category
		});
		llmSuggestionsLoading = false;
		llmSuggestionsLoaded = true;
		if (result.ok && result.data) {
			llmSuggestions = result.data.suggestions;
			// Clear dismissed when refreshed so new suggestions aren't hidden
			dismissedSuggestions = new Set();
		} else {
			llmSuggestionsError = result.error ?? 'Failed to load suggestions';
		}
	}

	interface CompletionItem { label: string; done: boolean; points: number; }
	const completionItems = $derived.by((): CompletionItem[] => {
		const exp = sections.experience ?? [];
		const proj = sections.projects ?? [];
		const edu = sections.education ?? [];
		const hasSocial = !!(rawProfile.social_linkedin || rawProfile.social_github || rawProfile.social_twitter || rawProfile.social_portfolio);
		return [
			{ label: 'Add your full name',                            done: !!rawProfile.full_name.trim(),                                                                points: 7  },
			{ label: 'Add a professional headline',                   done: !!(rawProfile.headline.trim() || profileFields.headline.value.trim()),                       points: 7  },
			{ label: 'Write a bio (80+ characters)',                  done: (profileFields.bio.value ?? '').trim().length >= 80,                                         points: 10 },
			{ label: 'Add a unique value proposition',                done: (profileFields.uniqueValue.value ?? '').trim().length >= 40,                                  points: 7  },
			{ label: 'Upload a profile photo',                        done: !!rawProfile.profile_image.trim(),                                                            points: 6  },
			{ label: 'Add your email address',                        done: !!rawProfile.email.trim(),                                                                    points: 4  },
			{ label: 'Add a social link (LinkedIn, GitHub, etc.)',    done: hasSocial,                                                                                    points: 4  },
			{ label: 'Add at least one experience entry',             done: exp.some(it => (it.data.role as string)?.trim()),                                             points: 14 },
			{ label: 'Add at least 2 skill groups',                   done: skillGroups.length >= 2,                                                                      points: 9  },
			{ label: 'Add at least one project',                      done: proj.some(it => (it.data.title as string)?.trim()),                                           points: 12 },
			{ label: 'Add your education',                            done: edu.some(it => (it.data.degree as string)?.trim()),                                           points: 8  },
			{ label: 'Add certifications',                            done: (sections.certifications ?? []).length > 0,                                                   points: 6  },
			{ label: 'Add achievements',                              done: (sections.achievements ?? []).length > 0,                                                     points: 6  },
		];
	});

	// Derived from completionItems so score is always consistent with the checklist.
	// Points are calibrated to sum to 100 when all items are done.
	const completionScore = $derived(
		completionItems.reduce((sum, item) => item.done ? sum + item.points : sum, 0)
	);

	let showCompletionChecklist = $state(false);

	const aiSuggestions = $derived.by(() => {
		const list: SuggestionItem[] = [];

		// ── Profile ──
		const bioVal = (profileFields.bio.value ?? '').trim();
		const uqVal  = (profileFields.uniqueValue.value ?? '').trim();

		if (bioVal.length === 0) {
			list.push({ id: 'profile-bio', section: 'profile', profileKey: 'bio', label: 'About', sublabel: 'Write your bio', instruction: 'Write a compelling 3-4 sentence intro highlighting my background, expertise, and what drives me', priority: 'high' });
		} else if (bioVal.length < 80) {
			list.push({ id: 'profile-bio', section: 'profile', profileKey: 'bio', label: 'About', sublabel: 'Expand your bio', instruction: 'Expand this into a compelling 3-4 sentence intro highlighting my background, expertise, and what drives me', priority: 'medium' });
		}

		if (uqVal.length === 0) {
			list.push({ id: 'profile-uniqueValue', section: 'profile', profileKey: 'uniqueValue', label: 'About', sublabel: 'Define your unique value', instruction: 'Describe in 2-3 sentences what sets me apart from others in my field — my unique combination of skills, experience, and perspective', priority: 'high' });
		} else if (uqVal.length < 40) {
			list.push({ id: 'profile-uniqueValue', section: 'profile', profileKey: 'uniqueValue', label: 'About', sublabel: 'Strengthen unique value', instruction: 'Expand this to clearly articulate what sets me apart from others in my field', priority: 'medium' });
		}

		// ── Experience ──
		for (const [i, it] of (sections.experience ?? []).entries()) {
			if (it.hidden) continue;
			const d = it.data;
			const role = ((d.role as string) ?? '').trim();
			const company = ((d.company as string) ?? '').trim();
			const label = role ? (company ? `${role} @ ${company}` : role) : `Experience ${i + 1}`;

			const desc = ((d.description as string) ?? '').trim();
			const kp   = Array.isArray(d.key_points) ? (d.key_points as string[]) : [];

			if (desc.length < 60) {
				list.push({ id: `experience-${i}-description`, section: 'experience', index: i, field: 'description', label, sublabel: 'Add job summary', instruction: 'Write a 2-3 sentence summary of what this role involved, the team/product context, and my core responsibilities', priority: desc.length === 0 ? 'high' : 'medium' });
			}
			const kpWeak = kp.length > 0 && kp.every(k => k.trim().length < 50);
			if (kp.length < 3) {
				list.push({ id: `experience-${i}-key_points`, section: 'experience', index: i, field: 'key_points', label, sublabel: 'Strengthen achievements', instruction: 'Rewrite as 4-6 bullet points with specific metrics: what I did, how I did it, and measurable impact (e.g. reduced load time by 40%, led team of 5)', priority: kp.length === 0 ? 'high' : 'medium' });
			} else if (kpWeak) {
				list.push({ id: `experience-${i}-key_points`, section: 'experience', index: i, field: 'key_points', label, sublabel: 'Make achievements more impactful', instruction: 'Rewrite these bullet points to be more result-oriented with specific metrics and measurable business impact', priority: 'low' });
			}
		}

		// ── Projects ──
		for (const [i, it] of (sections.projects ?? []).entries()) {
			if (it.hidden) continue;
			const d = it.data;
			const title = ((d.title as string) ?? `Project ${i + 1}`).trim();
			const desc  = ((d.description as string) ?? '').trim();
			const resp  = Array.isArray(d.responsibilities) ? (d.responsibilities as string[]) : [];
			const out   = Array.isArray(d.measurable_outcomes) ? (d.measurable_outcomes as string[]) : [];

			if (desc.length < 100) {
				list.push({ id: `projects-${i}-description`, section: 'projects', index: i, field: 'description', label: title, sublabel: 'Sharpen project description', instruction: 'Rewrite as a concise 2-3 sentence summary highlighting the problem solved, my role, and the key technologies used', priority: desc.length === 0 ? 'high' : 'medium' });
			}
			if (resp.length < 2) {
				list.push({ id: `projects-${i}-responsibilities`, section: 'projects', index: i, field: 'responsibilities', label: title, sublabel: 'Define your responsibilities', instruction: 'List 3-5 specific technical responsibilities I owned in this project — what I built, designed, architected, or led', priority: resp.length === 0 ? 'high' : 'medium' });
			}
			if (out.length < 2) {
				list.push({ id: `projects-${i}-measurable_outcomes`, section: 'projects', index: i, field: 'measurable_outcomes', label: title, sublabel: 'Add measurable outcomes', instruction: 'Add 3-4 outcomes with concrete metrics: performance improvements in %, users impacted, cost saved, time reduced, or other quantifiable results', priority: out.length === 0 ? 'high' : 'medium' });
			}
		}

		// ── Skills ──
		if (skillGroups.length < 2) {
			list.push({ id: 'skills-organize', section: 'skills', label: 'Skills', sublabel: 'Organize into categories', instruction: 'Group my skills into clear categories like Frontend, Backend, Tools, etc. and expand each with specific technologies', priority: skillGroups.length === 0 ? 'high' : 'medium' });
		} else {
			for (const [i, g] of skillGroups.entries()) {
				if (g.skills.length < 3) {
					list.push({ id: `skills-${i}-expand`, section: 'skills', label: `Skills · ${g.category || `Group ${i+1}`}`, sublabel: 'Expand this skill group', instruction: `Add more specific skills to the "${g.category}" category based on my experience and projects`, priority: 'low' });
				}
			}
		}

		// Sort: high → medium → low, filter dismissed
		const order = { high: 0, medium: 1, low: 2 };
		return list
			.filter(s => !dismissedSuggestions.has(s.id))
			.sort((a, b) => order[a.priority] - order[b.priority]);
	});

	// Visible suggestions: LLM results when loaded, static fallback while loading.
	// Always filters: dismissed, and suggestions for hidden items.
	const visibleSuggestions = $derived.by(() => {
		const base = llmSuggestionsLoaded ? llmSuggestions : aiSuggestions;
		return base.filter(s => {
			if (dismissedSuggestions.has(s.id)) return false;
			// Hide suggestions that belong to a currently-hidden item
			if (s.index != null && sections[s.section]?.[s.index]?.hidden) return false;
			return true;
		});
	});

	function activateSuggestion(s: SuggestionItem | LlmSuggestion) {
		activeTab = s.section;
		mobileTab = 'edit';

		if (s.section === 'profile' && s.profileKey) {
			const pk = s.profileKey as EditableField;
			if (pk in profileFields) {
				profileFields[pk].aiInstruction = s.instruction;
				profileFields[pk].showAiPanel = true;
				activeProfileSuggestionIds = { ...activeProfileSuggestionIds, [pk]: s.id };
			}
			iframeEl?.contentWindow?.postMessage({ type: 'scroll-to-section', section: 'profile' }, '*');
			setTimeout(() => {
				if (!rightPanelEl) return;
				const el = rightPanelEl.querySelector<HTMLElement>(`[data-profile-ai-panel="${pk}"]`);
				if (el) {
					const pr = rightPanelEl.getBoundingClientRect();
					const delta = el.getBoundingClientRect().bottom - pr.bottom + 20;
					if (Math.abs(delta) > 4) rightPanelEl.scrollBy({ top: delta, behavior: 'smooth' });
				}
			}, 200);
			return;
		}

		if (s.section === 'skills') {
			showSkillsAiPanel = true;
			skillsAiInstruction = s.instruction;
			activeSkillsSuggestionId = s.id;
			iframeEl?.contentWindow?.postMessage({ type: 'scroll-to-section', section: 'skills' }, '*');
			setTimeout(() => {
				if (!rightPanelEl) return;
				const el = rightPanelEl.querySelector<HTMLElement>('[data-skills-ai-panel]');
				if (el) {
					const pr = rightPanelEl.getBoundingClientRect();
					const delta = el.getBoundingClientRect().bottom - pr.bottom + 20;
					if (Math.abs(delta) > 4) rightPanelEl.scrollBy({ top: delta, behavior: 'smooth' });
				}
			}, 200);
			return;
		}

		if (s.index == null) return;
		const sec = s.section;
		const idx = s.index;

		const items = [...sections[sec]];
		items[idx] = {
			...items[idx],
			expanded: true,
			showAiPanel: true,
			aiSuggestion: null,
			aiError: '',
			aiField: s.field ?? '',
			aiInstruction: s.instruction,
			activeSuggestionId: s.id
		};
		sections = { ...sections, [sec]: items };
		// Scroll the visible (non-hidden) index in the preview.
		// Hidden items are filtered from liveParsedData so preview indices differ from sections indices.
		const previewIdx = (sections[sec] ?? []).slice(0, idx + 1).filter(it => !it.hidden).length - 1;
		setTimeout(() => {
			iframeEl?.contentWindow?.postMessage({ type: 'scroll-to-item', section: sec, index: previewIdx }, '*');
			scrollRightPanelToItem(sec, idx);
		}, 200);
	}

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
		let result: Awaited<ReturnType<typeof getPortfolioData>> = { ok: false, error: 'Loading' };
		try {
			result = await getPortfolioData(userId);
		} catch {
			result = { ok: false, error: 'Network error' };
		} finally {
			pageLoading = false;
		}

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
			full_name:        (prof.full_name as string)     ?? '',
			headline:         (prof.headline as string)      ?? '',
			email:            (prof.email as string)         ?? '',
			phone:            (prof.phone as string)         ?? '',
			location:         (prof.location as string)      ?? '',
			summary:          (prof.summary as string)       ?? '',
			profile_image:    (prof.profile_image as string) ?? '',
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

		// Custom sections
		customSections = JSON.parse(JSON.stringify(parsedData.custom_sections ?? []));

		// Template + section order + visibility from API
		if (result.data?.templateId) templateId = result.data.templateId;
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
		if (!visibleKeys.includes('custom_sections')) visibleKeys.push('custom_sections');
		const sortedVisible = sectionOrder
			.filter(k => visibleKeys.includes(k))
			.concat(visibleKeys.filter(k => !sectionOrder.includes(k)));
		dndItems = sortedVisible.map(k => ({ id: k }));

		// Fetch LLM suggestions non-blockingly after data loads
		fetchLlmSuggestions();
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
		const profileData: Record<string, unknown> = {
			full_name: rawProfile.full_name,
			headline:  rawProfile.headline,
			email:     rawProfile.email,
			phone:     rawProfile.phone,
			location:  rawProfile.location,
			summary:   rawProfile.summary,
			social_links,
		};
		if (rawProfile.profile_image) {
			profileData.profile_image = rawProfile.profile_image;
		}
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

	async function uploadProfileImage(file: File) {
		if (imageUploadStatus === 'uploading') return;
		imageUploadStatus = 'uploading';
		imageUploadError = '';

		// 1. Get presigned URL from our backend
		const urlResult = await getImageUploadUrl(userId, file.type);
		if (!urlResult.ok || !urlResult.data) {
			imageUploadStatus = 'error';
			imageUploadError = urlResult.error ?? 'Failed to get upload URL';
			return;
		}
		const { uploadUrl, imageUrl } = urlResult.data;

		// 2. PUT the file directly to S3
		try {
			const putRes = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file
			});
			if (!putRes.ok) {
				imageUploadStatus = 'error';
				imageUploadError = 'Upload to storage failed';
				return;
			}
		} catch {
			imageUploadStatus = 'error';
			imageUploadError = 'Network error during upload';
			return;
		}

		// 3. Persist the CloudFront URL into profile state and save
		rawProfile = { ...rawProfile, profile_image: imageUrl };
		rawProfileOriginal = { ...rawProfileOriginal, profile_image: imageUrl };
		imageUploadStatus = 'done';
		queuePreviewRefresh();

		// Save the updated profile (with new profile_image) to DynamoDB
		const social_links: Record<string, string> = {};
		if (rawProfile.social_linkedin)  social_links.linkedin  = rawProfile.social_linkedin;
		if (rawProfile.social_github)    social_links.github    = rawProfile.social_github;
		if (rawProfile.social_gitlab)    social_links.gitlab    = rawProfile.social_gitlab;
		if (rawProfile.social_portfolio) social_links.portfolio = rawProfile.social_portfolio;
		if (rawProfile.social_twitter)   social_links.twitter   = rawProfile.social_twitter;
		await savePortfolioSection(userId, 'profile', {
			full_name: rawProfile.full_name, headline: rawProfile.headline,
			email: rawProfile.email, phone: rawProfile.phone,
			location: rawProfile.location, summary: rawProfile.summary,
			social_links, profile_image: imageUrl,
		});

		setTimeout(() => { imageUploadStatus = 'idle'; }, 3000);
	}

	// Per-item image upload state: key = `${sKey}-${idx}`, value = 'idle'|'uploading'|'error'
	let itemImageUploadStatus: Record<string, string> = $state({});
	let itemImageUploadError: Record<string, string> = $state({});

	const MAX_ITEM_IMAGES = 3;

	async function uploadSectionImage(sKey: string, idx: number, file: File) {
		const stateKey = `${sKey}-${idx}`;
		if (itemImageUploadStatus[stateKey] === 'uploading') return;

		const currentImages = (sections[sKey]?.[idx]?.data?.images as string[]) ?? [];
		if (currentImages.length >= MAX_ITEM_IMAGES) {
			itemImageUploadError = { ...itemImageUploadError, [stateKey]: `Maximum ${MAX_ITEM_IMAGES} images allowed` };
			return;
		}

		itemImageUploadStatus = { ...itemImageUploadStatus, [stateKey]: 'uploading' };
		itemImageUploadError = { ...itemImageUploadError, [stateKey]: '' };

		const urlResult = await getImageUploadUrl(userId, file.type);
		if (!urlResult.ok || !urlResult.data) {
			itemImageUploadStatus = { ...itemImageUploadStatus, [stateKey]: 'error' };
			itemImageUploadError = { ...itemImageUploadError, [stateKey]: urlResult.error ?? 'Failed to get upload URL' };
			return;
		}
		const { uploadUrl, imageUrl } = urlResult.data;

		try {
			const putRes = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file
			});
			if (!putRes.ok) {
				itemImageUploadStatus = { ...itemImageUploadStatus, [stateKey]: 'error' };
				itemImageUploadError = { ...itemImageUploadError, [stateKey]: 'Upload to storage failed' };
				return;
			}
		} catch {
			itemImageUploadStatus = { ...itemImageUploadStatus, [stateKey]: 'error' };
			itemImageUploadError = { ...itemImageUploadError, [stateKey]: 'Network error during upload' };
			return;
		}

		// Add new image URL to the item's images array and save
		const updatedImages = [...currentImages, imageUrl];
		const items = [...sections[sKey]];
		items[idx] = { ...items[idx], data: { ...items[idx].data, images: updatedImages }, isDirty: true };
		sections = { ...sections, [sKey]: items };
		itemImageUploadStatus = { ...itemImageUploadStatus, [stateKey]: 'idle' };
		await saveItem(sKey, idx);
	}

	function removeSectionImage(sKey: string, idx: number, imageIdx: number) {
		const items = [...sections[sKey]];
		const currentImages = [...((items[idx].data.images as string[]) ?? [])];
		currentImages.splice(imageIdx, 1);
		items[idx] = { ...items[idx], data: { ...items[idx].data, images: currentImages }, isDirty: true };
		sections = { ...sections, [sKey]: items };
		autoSaveItem(sKey, idx);
	}

	// AI image generation state: stateKey = `${sKey}-${idx}`
	let aiImageGenerating: Record<string, boolean> = $state({});
	let aiImageError: Record<string, string> = $state({});
	// Pending generated image awaiting user accept/discard: stateKey → imageUrl
	let aiImagePending: Record<string, string> = $state({});

	async function generateAiImage(sKey: string, idx: number) {
		const stateKey = `${sKey}-${idx}`;
		if (aiImageGenerating[stateKey]) return;

		const currentImages = (sections[sKey]?.[idx]?.data?.images as string[]) ?? [];
		if (currentImages.length >= MAX_ITEM_IMAGES) {
			aiImageError = { ...aiImageError, [stateKey]: `Maximum ${MAX_ITEM_IMAGES} images already added` };
			return;
		}

		aiImageGenerating = { ...aiImageGenerating, [stateKey]: true };
		aiImageError = { ...aiImageError, [stateKey]: '' };
		aiImagePending = { ...aiImagePending, [stateKey]: '' };

		const result = await generateProjectImage(userId, sKey, idx);

		aiImageGenerating = { ...aiImageGenerating, [stateKey]: false };

		if (!result.ok || !result.data) {
			aiImageError = { ...aiImageError, [stateKey]: result.error ?? 'Generation failed. Please try again.' };
			return;
		}

		aiImagePending = { ...aiImagePending, [stateKey]: result.data.imageUrl };
	}

	function acceptAiImage(sKey: string, idx: number) {
		const stateKey = `${sKey}-${idx}`;
		const imageUrl = aiImagePending[stateKey];
		if (!imageUrl) return;

		const currentImages = (sections[sKey]?.[idx]?.data?.images as string[]) ?? [];
		const updatedImages = [...currentImages, imageUrl];
		const items = [...sections[sKey]];
		items[idx] = { ...items[idx], data: { ...items[idx].data, images: updatedImages }, isDirty: true };
		sections = { ...sections, [sKey]: items };
		aiImagePending = { ...aiImagePending, [stateKey]: '' };
		saveItem(sKey, idx);
	}

	function discardAiImage(sKey: string, idx: number) {
		const stateKey = `${sKey}-${idx}`;
		aiImagePending = { ...aiImagePending, [stateKey]: '' };
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
		autoSaveProfileField(key);
		// Remove matching suggestion from left pane — match by tracked ID, derived ID,
		// AND by section+profileKey to handle LLM ID format variance.
		const trackedId = activeProfileSuggestionIds[key];
		const derivedId = `profile-${key}`;
		dismissedSuggestions = new Set([...dismissedSuggestions, derivedId, ...(trackedId ? [trackedId] : [])]);
		llmSuggestions = llmSuggestions.filter(sg =>
			sg.id !== derivedId &&
			sg.id !== trackedId &&
			!(sg.section === 'profile' && sg.profileKey === key)
		);
		if (trackedId) {
			const updated = { ...activeProfileSuggestionIds };
			delete updated[key];
			activeProfileSuggestionIds = updated;
		}
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
		autoSaveSkills();
		// Dismiss the LLM suggestion that triggered this panel
		if (activeSkillsSuggestionId) {
			dismissedSuggestions = new Set([...dismissedSuggestions, activeSkillsSuggestionId]);
			llmSuggestions = llmSuggestions.filter(sg => sg.id !== activeSkillsSuggestionId);
			activeSkillsSuggestionId = '';
		}
	}

	function addSkillGroup() {
		skillGroups = [...skillGroups, { category: '', skills: [] }];
	}

	function removeSkillGroup(i: number) {
		skillGroups = skillGroups.filter((_, idx) => idx !== i);
	}

	function moveSkillGroupUp(i: number) {
		if (i === 0) return;
		const updated = [...skillGroups];
		[updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
		skillGroups = updated;
		autoSaveSkills();
	}

	function moveSkillGroupDown(i: number) {
		if (i >= skillGroups.length - 1) return;
		const updated = [...skillGroups];
		[updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
		skillGroups = updated;
		autoSaveSkills();
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

	function addItem(sectionKey: string): number {
		const cfg = SECTION_CONFIG[sectionKey];
		const newItem = emptyItemState(cfg.emptyItem());
		newItem.expanded = true;
		newItem.isDirty = true;
		const newItems = [...sections[sectionKey], newItem];
		sections = { ...sections, [sectionKey]: newItems };
		return newItems.length - 1; // index of new item
	}



	async function saveAllItems(sectionKey: string) {
		const items = sections[sectionKey] ?? [];
		const dirtyIdxs = items.map((it, i) => ({ it, i })).filter(({ it }) => it.isDirty).map(({ i }) => i);
		if (!dirtyIdxs.length) return;

		const saving = [...items];
		for (const i of dirtyIdxs) saving[i] = { ...saving[i], isSaving: true, saveError: '' };
		sections = { ...sections, [sectionKey]: saving };

		const allData = sections[sectionKey].map((it) => it.data);
		const result = await savePortfolioSection(userId, sectionKey, allData);

		const done = [...sections[sectionKey]];
		if (result.ok) {
			for (const i of dirtyIdxs) {
				done[i] = { ...done[i], original: JSON.parse(JSON.stringify(done[i].data)), isDirty: false, isSaving: false, saveSuccess: true, saveError: '' };
			}
			sections = { ...sections, [sectionKey]: done };
			queuePreviewRefresh();
			setTimeout(() => {
				const reset = [...sections[sectionKey]];
				for (const i of dirtyIdxs) { if (reset[i]) reset[i] = { ...reset[i], saveSuccess: false }; }
				sections = { ...sections, [sectionKey]: reset };
			}, 2500);
		} else {
			for (const i of dirtyIdxs) done[i] = { ...done[i], isSaving: false, saveError: result.error ?? 'Save failed.' };
			sections = { ...sections, [sectionKey]: done };
		}
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

	// ── Auto-save (debounced, triggered on field blur) ───────────────────────────
	const _formSaveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

	function autoSaveItem(sectionKey: string, itemIdx: number) {
		const tk = `item-${sectionKey}-${itemIdx}`;
		if (_formSaveTimers[tk]) clearTimeout(_formSaveTimers[tk]);
		_formSaveTimers[tk] = setTimeout(() => {
			if (sections[sectionKey]?.[itemIdx]?.isDirty) saveItem(sectionKey, itemIdx);
		}, 800);
	}

	function autoSaveSkills() {
		if (_formSaveTimers['skills']) clearTimeout(_formSaveTimers['skills']);
		_formSaveTimers['skills'] = setTimeout(() => {
			if (isSkillsDirty) saveSkills();
		}, 800);
	}

	function autoSaveRawProfile() {
		if (_formSaveTimers['rawProfile']) clearTimeout(_formSaveTimers['rawProfile']);
		_formSaveTimers['rawProfile'] = setTimeout(() => {
			if (isRawProfileDirty) saveRawProfile();
		}, 800);
	}

	function autoSaveProfileField(key: EditableField) {
		const tk = `pf-${key}`;
		if (_formSaveTimers[tk]) clearTimeout(_formSaveTimers[tk]);
		_formSaveTimers[tk] = setTimeout(() => {
			if (profileFields[key].value !== profileFields[key].original) saveProfileField(key);
		}, 800);
	}

	function autoSaveStringSection(sKey: string) {
		const tk = `str-${sKey}`;
		if (_formSaveTimers[tk]) clearTimeout(_formSaveTimers[tk]);
		_formSaveTimers[tk] = setTimeout(() => {
			if (stringSections[sKey] !== stringSectionOriginals[sKey]) saveStringSection(sKey);
		}, 800);
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

	async function acceptItemSuggestion(sectionKey: string, itemIdx: number) {
		const item = sections[sectionKey][itemIdx];
		if (!item.aiSuggestion) return;
		const acceptedField = item.aiField;
		const updatedData = { ...item.data };
		updatedData[acceptedField] = item.aiSuggestion;
		const updated = [...sections[sectionKey]];
		updated[itemIdx] = {
			...updated[itemIdx],
			data: updatedData,
			isDirty: JSON.stringify(updatedData) !== JSON.stringify(item.original),
			aiSuggestion: null,
			showAiPanel: false,
			aiField: '',
			aiInstruction: '',
			aiError: '',
			activeSuggestionId: ''
		};
		sections = { ...sections, [sectionKey]: updated };
		autoSaveItem(sectionKey, itemIdx);
		// Remove matching suggestion from left pane — match by derived ID, tracked ID,
		// AND by section+index+field to handle LLM ID format variance.
		const derivedId = `${sectionKey}-${itemIdx}-${acceptedField}`;
		const trackedId = item.activeSuggestionId;
		dismissedSuggestions = new Set([...dismissedSuggestions, derivedId, ...(trackedId ? [trackedId] : [])]);
		llmSuggestions = llmSuggestions.filter(sg =>
			sg.id !== derivedId &&
			sg.id !== trackedId &&
			!(sg.section === sectionKey && sg.index === itemIdx && sg.field === acceptedField)
		);
		// Force preview repaint immediately — bypasses the 'paused' guard in iframeEditor
		await tick();
		if (_forcePaint) _forcePaint(renderedHTML);
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
		// When opening: preserve any pre-filled instruction (e.g. from AI Insights panel).
		// When closing: clear state so next open is fresh.
		const instruction = opening ? items[itemIdx].aiInstruction : '';
		items[itemIdx] = { ...items[itemIdx], showAiPanel: opening, aiSuggestion: null, aiError: '', aiInstruction: instruction, aiField: autoField };
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
		if (key === 'custom_sections') return 'Custom Sections';
		return SECTION_CONFIG[key]?.label ?? key;
	}

	// ── Custom sections ──────────────────────────────────────────────────────────

	async function saveCustomSections() {
		csSaveStatus = 'saving';
		csSaveError = '';
		const result = await savePortfolioSection(userId, 'custom_sections', customSections);
		if (result.ok) {
			csSaveStatus = 'saved';
			queuePreviewRefresh();
			// Ensure custom_sections is in the section order so the portfolio generator renders it.
			// This handles users whose stored sectionOrder predates the custom_sections feature.
			if (!sectionOrder.includes('custom_sections')) {
				sectionOrder = [...sectionOrder, 'custom_sections'];
				if (!dndItems.find(i => i.id === 'custom_sections')) {
					dndItems = [...dndItems, { id: 'custom_sections' }];
				}
				await updatePortfolioConfig(userId, { sectionOrder });
			}
			setTimeout(() => { csSaveStatus = 'idle'; }, 2500);
		} else {
			csSaveStatus = 'error';
			csSaveError = result.error ?? 'Save failed';
		}
	}

	function autoSaveCustomSections() {
		if (_formSaveTimers['custom_sections']) clearTimeout(_formSaveTimers['custom_sections']);
		_formSaveTimers['custom_sections'] = setTimeout(saveCustomSections, 800);
	}

	function updateCsItem(csIdx: number, itemIdx: number, field: keyof CustomSectionItem, val: string) {
		const updated = [...customSections];
		const items = [...updated[csIdx].items];
		if (field === 'tags') {
			items[itemIdx] = { ...items[itemIdx], tags: val.split('\n').map(s => s.trim()).filter(Boolean) };
		} else {
			items[itemIdx] = { ...items[itemIdx], [field]: val };
		}
		updated[csIdx] = { ...updated[csIdx], items };
		customSections = updated;
	}

	function addCsItem(csIdx: number) {
		const updated = [...customSections];
		updated[csIdx] = { ...updated[csIdx], items: [...updated[csIdx].items, { label: '', value: '', subtitle: '', tags: [], url: '' }] };
		customSections = updated;
		autoSaveCustomSections();
	}

	function removeCsItem(csIdx: number, itemIdx: number) {
		const updated = [...customSections];
		updated[csIdx] = { ...updated[csIdx], items: updated[csIdx].items.filter((_, i) => i !== itemIdx) };
		customSections = updated;
		autoSaveCustomSections();
	}

	function moveCsItemUp(csIdx: number, itemIdx: number) {
		if (itemIdx === 0) return;
		const updated = [...customSections];
		const items = [...updated[csIdx].items];
		[items[itemIdx - 1], items[itemIdx]] = [items[itemIdx], items[itemIdx - 1]];
		updated[csIdx] = { ...updated[csIdx], items };
		customSections = updated;
		autoSaveCustomSections();
	}

	function moveCsItemDown(csIdx: number, itemIdx: number) {
		const items = customSections[csIdx]?.items ?? [];
		if (itemIdx >= items.length - 1) return;
		const updated = [...customSections];
		const newItems = [...updated[csIdx].items];
		[newItems[itemIdx], newItems[itemIdx + 1]] = [newItems[itemIdx + 1], newItems[itemIdx]];
		updated[csIdx] = { ...updated[csIdx], items: newItems };
		customSections = updated;
		autoSaveCustomSections();
	}

	function deleteCustomSection(csIdx: number) {
		customSections = customSections.filter((_, i) => i !== csIdx);
		const newExpanded: Record<number, boolean> = {};
		for (const [k, v] of Object.entries(csExpanded)) {
			const ki = parseInt(k);
			if (ki < csIdx) newExpanded[ki] = v as boolean;
			else if (ki > csIdx) newExpanded[ki - 1] = v as boolean;
		}
		csExpanded = newExpanded;
		autoSaveCustomSections();
	}

	function moveCustomSectionUp(csIdx: number) {
		if (csIdx === 0) return;
		const updated = [...customSections];
		[updated[csIdx - 1], updated[csIdx]] = [updated[csIdx], updated[csIdx - 1]];
		customSections = updated;
		// Swap expanded state
		const exp = { ...csExpanded };
		[exp[csIdx - 1], exp[csIdx]] = [exp[csIdx], exp[csIdx - 1]];
		csExpanded = exp;
		autoSaveCustomSections();
	}

	function moveCustomSectionDown(csIdx: number) {
		if (csIdx >= customSections.length - 1) return;
		const updated = [...customSections];
		[updated[csIdx], updated[csIdx + 1]] = [updated[csIdx + 1], updated[csIdx]];
		customSections = updated;
		const exp = { ...csExpanded };
		[exp[csIdx], exp[csIdx + 1]] = [exp[csIdx + 1], exp[csIdx]];
		csExpanded = exp;
		autoSaveCustomSections();
	}

	async function classifyCustomSection() {
		const text = customSectionInput.trim();
		if (!text || customSectionAiStatus === 'loading') return;
		customSectionAiStatus = 'loading';
		customSectionAiResult = null;
		customSectionAiError = '';
		const result = await addCustomSectionApi(userId, text, customSectionTitleHint.trim() || undefined);
		customSectionAiStatus = result.ok ? 'done' : 'error';
		if (result.ok && result.data) {
			customSectionAiResult = result.data as CsAiResult;
		} else {
			customSectionAiError = result.error ?? 'Classification failed. Please try again.';
		}
	}

	function acceptNewCustomSection(section: CustomSection) {
		customSections = [...customSections, section];
		autoSaveCustomSections();
		customSectionInput = '';
		customSectionTitleHint = '';
		customSectionAiResult = null;
		customSectionAiStatus = 'idle';
	}

	// ── Preview refresh ──────────────────────────────────────────────────────────
	// Preview is now client-side rendered — no polling needed.
	// This function is called after every save to track unpublished changes.
	function queuePreviewRefresh() {
		hasUnpublishedChanges = true;
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
			publishToast = 'Portfolio published! Changes are live.';
			hasUnpublishedChanges = false;
			setTimeout(() => { publishStatus = 'idle'; publishToast = ''; }, 8000);
		} else {
			publishStatus = 'error';
			publishToast = result.error ?? 'Publish failed. Please try again.';
			setTimeout(() => { publishStatus = 'idle'; publishToast = ''; }, 5000);
		}
	}

	// ── Inline editor overlays ────────────────────────────────────────────────
	let iframeEl = $state<HTMLIFrameElement | null>(null);
	let _forcePaint: ((h: string) => void) | null = null;

	interface AiToolbarState {
		path: string;
		selectedText: string;
		iframeRect: DOMRect;
		selectionRect: { top: number; left: number; bottom: number; right: number; width: number; height: number };
		instruction: string;
		loading: boolean;
		error: string;
	}
	let aiToolbar = $state<AiToolbarState | null>(null);

	interface ListEditorState {
		path: string;
		items: string[];
		iframeRect: DOMRect;
		fieldRect: { top: number; left: number; bottom: number; right: number; width: number };
		saving: boolean;
		error: string;
	}
	let listEditor = $state<ListEditorState | null>(null);

	// Single-line data-paths that should have newlines collapsed
	const _MULTILINE_FIELDS = new Set(['description', 'design_concept', 'design_philosophy', 'outcome', 'performance_return', 'bio', 'uniqueValue', 'headline', 'summary']);

	function _normalizeInlineValue(path: string, raw: string): string {
		const field = path.split('.').pop() ?? '';
		const isMultiline = _MULTILINE_FIELDS.has(field) || path === 'portfolio.bio' || path === 'design_philosophy';
		return isMultiline
			? raw.replace(/[\u200B\uFEFF\u00AD]/g, '').trimEnd()
			: raw.replace(/[\u200B\uFEFF\u00AD]/g, '').replace(/[\r\n]+/g, ' ').trim();
	}

	// Updates parent state from an iframe postMessage without triggering re-render
	function updateFieldFromIframe(path: string, rawValue: string) {
		const value = _normalizeInlineValue(path, rawValue);
		const parts = path.split('.');
		const [ns, idxOrKey, field] = parts;

		if (ns === 'profile') {
			rawProfile = { ...rawProfile, [idxOrKey]: value };
		} else if (ns === 'portfolio') {
			profileFields = {
				...profileFields,
				[idxOrKey]: { ...profileFields[idxOrKey as EditableField], value }
			};
		} else if (ns === 'skills') {
			if (field === 'category') {
				const idx = parseInt(idxOrKey);
				const grps = [...skillGroups];
				grps[idx] = { ...grps[idx], category: value };
				skillGroups = grps;
			}
		} else if (ns === 'design_philosophy') {
			stringSections = { ...stringSections, design_philosophy: value };
		} else {
			const idx = parseInt(idxOrKey);
			const arr = [...(sections[ns] ?? [])];
			if (arr[idx]) {
				const newData = { ...arr[idx].data, [field]: value };
				arr[idx] = { ...arr[idx], data: newData, isDirty: JSON.stringify(newData) !== JSON.stringify(arr[idx].original) };
				sections = { ...sections, [ns]: arr };
			}
		}
	}

	// Debounced per-field save after inline edit blur
	const _saveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

	function scheduleSaveFromIframe(path: string) {
		if (_saveTimers[path]) clearTimeout(_saveTimers[path]);
		_saveTimers[path] = setTimeout(() => performSaveFromPath(path), 1500);
	}

	async function performSaveFromPath(path: string) {
		const parts = path.split('.');
		const [ns, idxOrKey] = parts;
		hasUnpublishedChanges = true;
		if (ns === 'profile') {
			// Rebuild the same shape saveRawProfile() uses
			const social_links: Record<string, string> = {};
			if (rawProfile.social_linkedin)  social_links.linkedin  = rawProfile.social_linkedin;
			if (rawProfile.social_github)    social_links.github    = rawProfile.social_github;
			if (rawProfile.social_gitlab)    social_links.gitlab    = rawProfile.social_gitlab;
			if (rawProfile.social_portfolio) social_links.portfolio = rawProfile.social_portfolio;
			if (rawProfile.social_twitter)   social_links.twitter   = rawProfile.social_twitter;
			const profilePayload: Record<string, unknown> = {
				full_name: rawProfile.full_name, headline: rawProfile.headline,
				email: rawProfile.email, phone: rawProfile.phone,
				location: rawProfile.location, summary: rawProfile.summary, social_links,
			};
			if (rawProfile.profile_image) profilePayload.profile_image = rawProfile.profile_image;
			await savePortfolioSection(userId, 'profile', profilePayload);
		} else if (ns === 'portfolio') {
			await savePortfolioContent(userId, idxOrKey as EditableField, profileFields[idxOrKey as EditableField].value);
		} else if (ns === 'skills') {
			await savePortfolioSection(userId, 'skills', skillGroups);
		} else if (ns === 'design_philosophy') {
			await savePortfolioSection(userId, 'design_philosophy', stringSections.design_philosophy);
		} else {
			const result = await savePortfolioSection(userId, ns, (sections[ns] ?? []).map((it) => it.data));
			if (result.ok) {
				// Inline edit auto-saved successfully  mark all items clean so the
				// section banner and item-level "Unsaved changes" labels clear.
				const cleaned = (sections[ns] ?? []).map((it) => ({
					...it,
					original: JSON.parse(JSON.stringify(it.data)),
					isDirty: false
				}));
				sections = { ...sections, [ns]: cleaned };
			}
		}
	}

	function openListEditor(path: string, fieldRect: ListEditorState['fieldRect'], iframeNode: HTMLIFrameElement) {
		const parts = path.split('.');
		const [ns, idxStr, field] = parts;
		let items: string[] = [];
		if (ns === 'skills') {
			items = [...(skillGroups[parseInt(idxStr)]?.skills ?? [])];
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = sections[ns]?.[parseInt(idxStr)]?.data ?? {} as any;
			items = [...(data[field] ?? [])];
		}
		listEditor = { path, items, iframeRect: iframeNode.getBoundingClientRect(), fieldRect, saving: false, error: '' };
	}

	async function saveListEditor() {
		if (!listEditor) return;
		listEditor = { ...listEditor, saving: true };
		const { path, items } = listEditor;
		const parts = path.split('.');
		const [ns, idxStr, field] = parts;
		const cleanItems = items.filter(Boolean);
		if (ns === 'skills') {
			const idx = parseInt(idxStr);
			const grps = [...skillGroups];
			grps[idx] = { ...grps[idx], skills: cleanItems };
			skillGroups = grps;
			await savePortfolioSection(userId, 'skills', skillGroups);
		} else {
			const idx = parseInt(idxStr);
			const arr = [...(sections[ns] ?? [])];
			arr[idx] = { ...arr[idx], data: { ...arr[idx].data, [field]: cleanItems } };
			sections = { ...sections, [ns]: arr };
			await savePortfolioSection(userId, ns, arr.map((it) => it.data));
		}
		hasUnpublishedChanges = true;
		listEditor = null;
	}

	let listEditorEl = $state<HTMLDivElement | null>(null);
	let rightPanelEl = $state<HTMLDivElement | null>(null);

	/** Scrolls the right panel so the item card sits below the sticky banner.
	 *  If the AI panel is open, scrolls further so its bottom is flush with the panel bottom. */
	function scrollRightPanelToItem(sectionKey: string, idx: number) {
		if (!rightPanelEl) return;
		// Single-pass scroll — fires after Svelte has flushed any expand/ai-panel
		// state changes (expand at t=0, this fires at t+150ms).
		setTimeout(() => {
			if (!rightPanelEl) return;
			const aiPanel = rightPanelEl.querySelector<HTMLElement>(`[data-ai-panel="${sectionKey}-${idx}"]`);
			const card = rightPanelEl.querySelector<HTMLElement>(`[data-item-card="${sectionKey}-${idx}"]`);
			const BANNER_OFFSET = 90;
			const pr = rightPanelEl.getBoundingClientRect();

			if (aiPanel) {
				const ar = aiPanel.getBoundingClientRect();
				// Always position the AI panel so its BOTTOM sits near the panel bottom
				// (positive delta = scroll down, negative = scroll up).
				// This gives a consistent "AI box at the bottom" feel regardless of
				// whether we're coming from above or below the item.
				const delta = ar.bottom - pr.bottom + 20;
				if (Math.abs(delta) > 4) {
					rightPanelEl.scrollBy({ top: delta, behavior: 'smooth' });
				}
			} else if (card) {
				// No AI panel yet (e.g. add-item) → show card top below the sticky banner
				const cr = card.getBoundingClientRect();
				const delta = cr.top - pr.top - BANNER_OFFSET;
				if (Math.abs(delta) > 4) {
					rightPanelEl.scrollBy({ top: delta, behavior: 'smooth' });
				}
			}
		}, 150);
	}

	/** Scrolls the right panel to the bottom (used for skills). */
	function scrollRightPanelToBottom() {
		setTimeout(() => {
			if (rightPanelEl) rightPanelEl.scrollTop = rightPanelEl.scrollHeight;
		}, 60);
	}

	/**
	 * Scrolls the right panel so the clicked field is at a consistent vertical position.
	 *
	 * Target: the field's label+input wrapper top-edge sits at 38% from the panel top.
	 * This is the same fraction regardless of element height (input vs tall textarea),
	 * so every field lands in the same place.
	 *
	 * Uses scrollTo with an absolute scrollTop rather than scrollBy (relative delta)
	 * so any in-progress smooth-scroll animation cannot skew the position calculation.
	 * The browser naturally clamps scrollTop at max-scroll, so end-of-content fields
	 * land as low as they can without any special-casing.
	 */
	function scrollRightPanelToField(id: string, delay = 150) {
		setTimeout(() => {
			if (!rightPanelEl) return;
			const el = rightPanelEl.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
			if (!el) return;
			// Prefer the parent wrapper div (contains label + input) as the scroll
			// target so the label is also visible. Fall back to the element itself if
			// the parent is too tall to be a simple label+field wrapper (e.g. a card).
			const parent = el.parentElement;
			const target = (parent && parent.getBoundingClientRect().height < 220) ? parent : el;
			const pr = rightPanelEl.getBoundingClientRect();
			const er = target.getBoundingClientRect();
			// Absolute target scrollTop: move the panel so `target` top sits at 38% of panel height.
			const targetScrollTop = rightPanelEl.scrollTop + (er.top - pr.top) - pr.height * 0.38;
			rightPanelEl.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
		}, delay);
	}

	/**
	 * Maps visible index (template index, excludes hidden) → actual sections[] index.
	 * e.g. if sections.projects = [hidden, visible, visible]
	 * then visibleToActual.projects = [1, 2]
	 */
	const visibleToActual = $derived.by(() => {
		const result: Record<string, number[]> = {};
		for (const [sec, items] of Object.entries(sections)) {
			const mapping: number[] = [];
			(items as ItemState[]).forEach((item, actualIdx) => {
				if (!item.hidden) mapping.push(actualIdx);
			});
			result[sec] = mapping;
		}
		return result;
	});

	function focusListItem(index: number) {
		setTimeout(() => {
			const inputs = listEditorEl?.querySelectorAll<HTMLInputElement>('[data-list-input]');
			inputs?.[index]?.focus();
		}, 0);
	}

	function handleListItemKeydown(e: KeyboardEvent, i: number) {
		if (!listEditor) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			const items = [...listEditor.items];
			items.splice(i + 1, 0, '');
			listEditor = { ...listEditor, items };
			focusListItem(i + 1);
		} else if (e.key === 'Backspace' && listEditor.items[i] === '') {
			if (listEditor.items.length === 1) return;
			e.preventDefault();
			const items = [...listEditor.items];
			items.splice(i, 1);
			listEditor = { ...listEditor, items };
			focusListItem(Math.max(0, i - 1));
		}
	}

	function updateListItem(i: number, value: string) {
		if (!listEditor) return;
		const items = [...listEditor.items];
		items[i] = value;
		listEditor = { ...listEditor, items };
	}

	function removeListItem(i: number) {
		if (!listEditor) return;
		const items = [...listEditor.items];
		items.splice(i, 1);
		listEditor = { ...listEditor, items: items.length ? items : [''] };
		focusListItem(Math.max(0, i - 1));
	}

	function addListItem() {
		if (!listEditor) return;
		listEditor = { ...listEditor, items: [...listEditor.items, ''] };
		focusListItem(listEditor.items.length - 1);
	}

	async function runAiFromToolbar() {
		if (!aiToolbar) return;
		const { path, selectedText, instruction } = aiToolbar;
		if (!instruction.trim()) return;
		aiToolbar = { ...aiToolbar, loading: true, error: '' };
		const parts = path.split('.');
		const [ns, idxStr, field] = parts;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: { ok: boolean; data?: { suggestion: string | string[] }; error?: string } = { ok: false };
		if (ns === 'portfolio') {
			result = await getAiEnhancement(userId, idxStr as EditableField, instruction, selectedText);
		} else {
			result = await getAiItemEnhancement(userId, ns, parseInt(idxStr), field, instruction);
		}
		if (!result.ok || !result.data) {
			aiToolbar = { ...aiToolbar, loading: false, error: result.error ?? 'AI enhancement failed.' };
			return;
		}
		const suggestion = Array.isArray(result.data.suggestion)
			? result.data.suggestion.join('\n')
			: result.data.suggestion;
		updateFieldFromIframe(path, suggestion);
		scheduleSaveFromIframe(path);
		iframeEl?.contentWindow?.postMessage({ type: 'update-field', path, value: suggestion }, '*');
		aiToolbar = null;
	}

	// ── Auto-resize textarea action ────────────────────────────────────────────
	function autoResize(node: HTMLTextAreaElement) {
		function resize() {
			node.style.height = 'auto';
			node.style.height = node.scrollHeight + 'px';
		}
		resize();
		node.addEventListener('input', resize);
		return { update() { resize(); }, destroy() { node.removeEventListener('input', resize); } };
	}

	// ── iframeEditor action ────────────────────────────────────────────────────
	// Replaces iframePreview. Handles postMessage events for inline editing,
	// pauses re-renders while a field is being edited, and resumes on blur.
	function iframeEditor(node: HTMLIFrameElement, html: string) {
		iframeEl = node;
		let timer: ReturnType<typeof setTimeout> | null = null;
		let pendingHtml: string | null = null;
		let paused = false;
		// Tracks the pending scroll-to-card timer from a focus-item event.
		let focusItemTimer: ReturnType<typeof setTimeout> | null = null;
		// When a field-specific click (field-focus / open-list-editor) is detected,
		// this flag is set so that the *subsequent* focus-item message (which always
		// arrives after, because click fires after focusin and open-list-editor is
		// registered before focus-item in EDITOR_JS) skips its card-top scroll.
		// Without this, focus-item's card scroll races with the field scroll and
		// wins on first click (item not yet at top, large delta) even though the
		// field scroll fires 30ms later — the card animation is still running.
		let suppressNextFocusItemScroll = false;

		function paint(h: string) {
			const win = node.contentWindow;
			const doc = node.contentDocument;
			if (!doc) return;
			const sy = win?.scrollY ?? 0;
			// Strip inline EDITOR_SCRIPT before writing — we inject programmatically
			// below so we can reset the __ceReady guard on every paint. Without this,
			// doc.open() does NOT clear custom document properties, so __ceReady
			// persists from the previous paint and the guard blocks re-initialization.
			const hStripped = h.split(EDITOR_SCRIPT).join('');
			doc.open();
			doc.write(hStripped);
			doc.close();
			try {
				const st = doc.createElement('style');
				st.textContent = '::-webkit-scrollbar{display:none}html,body{scrollbar-width:none;-ms-overflow-style:none;}';
				(doc.head ?? doc.documentElement)?.appendChild(st);
			} catch (_) { /* ignore */ }
			try {
				const sc = doc.createElement('script');
				// Reset __ceReady so EDITOR_JS always initialises fresh on each paint.
				sc.textContent = 'document.__ceReady=false;' + EDITOR_JS;
				(doc.body ?? doc.documentElement)?.appendChild(sc);
			} catch (_) { /* sandbox may block in edge cases */ }
			if (sy > 0) requestAnimationFrame(() => win?.scrollTo(0, sy));
		}

		function handleMessage(event: MessageEvent) {
			const d = event.data;
			if (!d?.type) return;
			switch (d.type) {
				case 'field-focus': {
					paused = true;
					// Cancel any pending re-render timer started before focus.
					// Without this, a 300ms timer fires mid-edit and wipes the iframe.
					if (timer) { clearTimeout(timer); timer = null; }
					// Switch the right panel to the relevant tab and scroll to the field.
					const path = d.path as string;
					const parts = path.split('.');
					const ns = parts[0];
					if (ns === 'profile') {
						// profile.full_name → rp-full-name, profile.headline → rp-headline, etc.
						activeTab = 'profile';
						mobileTab = 'edit';
						const fieldKey = parts[1] ?? '';
						scrollRightPanelToField('rp-' + fieldKey.replace(/_/g, '-'), 80);
					} else if (ns === 'portfolio') {
						// portfolio.bio / portfolio.headline / portfolio.uniqueValue → pf-{key}
						activeTab = 'profile';
						mobileTab = 'edit';
						const pfKey = parts[1] ?? '';
						scrollRightPanelToField('pf-' + pfKey, 80);
					} else if (ns === 'design_philosophy') {
						activeTab = 'design_philosophy';
						mobileTab = 'edit';
					} else if (ns === 'skills') {
						activeTab = 'skills';
						mobileTab = 'edit';
					} else if (ns && parts.length >= 3) {
						// {section}.{visibleIdx}.{field} — map visible index to actual index
						const visibleIdx = parseInt(parts[1]);
						const fieldKey = parts[2];
						const actualIdx = visibleToActual[ns]?.[visibleIdx] ?? visibleIdx;
						activeTab = ns;
						mobileTab = 'edit';
						if (sections[ns]?.[actualIdx] && !sections[ns][actualIdx].expanded) {
							toggleItemExpand(ns, actualIdx);
						}
						// Cancel any stale card scroll already in flight, and flag the
						// *incoming* focus-item (which fires after focusin) to skip its
						// card scroll — the field scroll below is more specific.
						if (focusItemTimer) { clearTimeout(focusItemTimer); focusItemTimer = null; }
						suppressNextFocusItemScroll = true;
						scrollRightPanelToField(`${ns}-${actualIdx}-${fieldKey}`, 260);
					}
					break;
				}
				case 'field-change':
					updateFieldFromIframe(d.path, d.value);
					break;
				case 'field-blur':
					updateFieldFromIframe(d.path, d.value);
					paused = false;
					if (pendingHtml) { const h = pendingHtml; pendingHtml = null; paint(h); }
					scheduleSaveFromIframe(d.path);
					break;
				case 'selection':
					aiToolbar = {
						path: d.path, selectedText: d.text,
						iframeRect: node.getBoundingClientRect(), selectionRect: d.rect,
						instruction: '', loading: false, error: ''
					};
					break;
				case 'open-list-editor': {
					openListEditor(d.path, d.rect, node);
					// Also switch the right panel to the relevant section and scroll to the field,
					// so the user can see the field they just clicked alongside the list editor.
					const listPath = d.path as string;
					const listParts = listPath.split('.');
					if (listParts.length >= 3) {
						const listNs = listParts[0];
						const listVisIdx = parseInt(listParts[1]);
						const listFieldKey = listParts[2];
						const listActualIdx = visibleToActual[listNs]?.[listVisIdx] ?? listVisIdx;
						activeTab = listNs;
						mobileTab = 'edit';
						if (sections[listNs]?.[listActualIdx] && !sections[listNs][listActualIdx].expanded) {
							toggleItemExpand(listNs, listActualIdx);
						}
						// Cancel any stale card scroll already in flight, and flag the
						// *incoming* focus-item to skip its card scroll.
						if (focusItemTimer) { clearTimeout(focusItemTimer); focusItemTimer = null; }
						suppressNextFocusItemScroll = true;
						scrollRightPanelToField(`${listNs}-${listActualIdx}-${listFieldKey}`, 260);
					}
					break;
				}
				case 'add-item': {
					const sec = d.section as string;
					mobileTab = 'edit';
					if (sec.startsWith('custom_sections.')) {
						// "custom_sections.0.items" → csIdx = 0
						const csIdx = parseInt(sec.split('.')[1]);
						activeTab = 'custom_sections';
						csExpanded = { ...csExpanded, [csIdx]: true };
						addCsItem(csIdx);
						setTimeout(() => scrollRightPanelToBottom(), 50);
					} else if (sec === 'skills') {
						activeTab = sec;
						addSkillGroup();
						scrollRightPanelToBottom();
					} else {
						activeTab = sec;
						const newIdx = addItem(sec);
						scrollRightPanelToItem(sec, newIdx);
					}
					break;
				}
				case 'focus-item': {
					const sec = d.section as string;
					const visIdx = d.index as number;
					const actualIdx = visibleToActual[sec]?.[visIdx] ?? visIdx;
					activeTab = sec;
					mobileTab = 'edit';
					if (sections[sec]?.[actualIdx] && !sections[sec][actualIdx].expanded) {
						toggleItemExpand(sec, actualIdx);
					}
					// If field-focus or open-list-editor already scheduled a field-specific
					// scroll for this same click, skip the coarser card-top scroll entirely.
					// (open-list-editor fires before focus-item in EDITOR_JS, so it sets
					// suppressNextFocusItemScroll before we reach here.)
					if (suppressNextFocusItemScroll) {
						suppressNextFocusItemScroll = false;
						break;
					}
					if (focusItemTimer) clearTimeout(focusItemTimer);
					focusItemTimer = setTimeout(() => {
						focusItemTimer = null;
						scrollRightPanelToItem(sec, actualIdx);
					}, 80);
					break;
				}
				case 'open-ai-panel': {
					const sec = d.section as string;
					const visIdx = d.index as number;
					const actualIdx = visibleToActual[sec]?.[visIdx] ?? visIdx;
					activeTab = sec;
					mobileTab = 'edit';
					if (sec === 'skills') {
						showSkillsAiPanel = true;
						scrollRightPanelToBottom();
					} else {
						// Expand the item if it is collapsed
						if (sections[sec]?.[actualIdx] && !sections[sec][actualIdx].expanded) {
							toggleItemExpand(sec, actualIdx);
						}
						setTimeout(() => {
							// Only OPEN the panel — never close it from a preview click.
							// toggleItemAiPanel is a toggle: calling it when already open
							// would close the panel and leave the scroll pointing at the card top.
							if (!sections[sec]?.[actualIdx]?.showAiPanel) {
								toggleItemAiPanel(sec, actualIdx);
							}
							scrollRightPanelToItem(sec, actualIdx);
						}, 80);
					}
					break;
				}
				case 'delete-item': {
					const sec = d.section as string;
					const visIdx = d.index as number;
					const actualIdx = visibleToActual[sec]?.[visIdx] ?? visIdx;
					promptDeleteItem(sec, actualIdx);
					break;
				}
			}
		}

		_forcePaint = paint;
		window.addEventListener('message', handleMessage);
		paint(html);

		return {
			update(h: string) {
				if (paused) { pendingHtml = h; return; }
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => { if (!paused) paint(h); }, 300);
			},
			destroy() {
				if (timer) clearTimeout(timer);
				window.removeEventListener('message', handleMessage);
				iframeEl = null;
				_forcePaint = null;
			}
		};
	}
</script>

<svelte:head>
	<title>Edit Portfolio — Portfolio.ai</title>
</svelte:head>

{#if publishToast}
	<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-bold shadow-xl ring-1 {publishStatus === 'error' ? 'bg-red-600 text-white ring-red-500' : 'bg-brand text-white ring-brand-dark'}">
		{publishToast}
	</div>
{/if}

<div class="flex h-screen flex-col bg-surface-subtle">
	<AppHeader />

	<div use:reveal class="flex flex-shrink-0 items-center justify-between gap-4 border-b border-surface-muted bg-white px-4 py-3 sm:px-6">
		<div class="flex min-w-0 items-center gap-3">
			<a href="/app/dashboard" class="flex-shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink-soft" title="Back">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
			</a>
			<h1 class="truncate text-lg font-bold text-ink">Edit Portfolio</h1>
			{#if hasUnpublishedChanges}
				<span class="hidden flex-shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-200 sm:inline">Draft</span>
			{/if}
		</div>
		<div class="flex flex-shrink-0 items-center gap-2">
			{#if publishStatus === 'done'}
				<span class="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200 sm:inline">Published ✓</span>
			{/if}
			<button onclick={handlePublish} disabled={publishStatus === 'publishing'} class="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50">
				{publishStatus === 'publishing' ? 'Publishing…' : 'Publish'}
			</button>
		</div>
	</div>

	<div class="flex flex-shrink-0 border-b border-surface-muted bg-white sm:hidden">
		{#each [['sections', 'Sections'], ['preview', 'Preview'], ['edit', 'Edit']] as [tab, label] (tab)}
			<button onclick={() => (mobileTab = tab as typeof mobileTab)} class="flex-1 py-2.5 text-sm font-bold transition-colors {mobileTab === tab ? 'border-b-2 border-brand text-ink' : 'text-ink-soft'}">{label}</button>
		{/each}
	</div>

	<div class="flex min-h-0 flex-1 overflow-hidden">

		<aside class="{mobileTab === 'sections' ? 'flex' : 'hidden'} sm:flex w-full sm:w-80 flex-col flex-shrink-0 overflow-hidden border-r border-surface-muted bg-surface-subtle sm:bg-surface-subtle sm:p-0 sm:pt-3">
			<div class="flex-shrink-0 p-3 space-y-0.5 sm:mx-3 sm:rounded-2xl sm:border sm:border-surface-muted sm:bg-white sm:shadow-md sm:p-3 sm:mb-2">
				<button onclick={() => { activeTab = 'profile'; mobileTab = 'edit'; }} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {activeTab === 'profile' ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface-muted'}">
					Profile
				</button>
				{#if !pageLoading}
					<div use:dndzone={{ items: dndItems, flipDurationMs: 150 }} onconsider={handleDndConsider} onfinalize={handleDndFinalize} class="flex flex-col space-y-0.5">
						{#each dndItems as item (item.id)}
							<div class="flex items-center rounded-lg transition-colors {activeTab === item.id ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface-muted'}">
								<div class="flex-shrink-0 cursor-grab px-2 py-2 opacity-40 active:cursor-grabbing">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/></svg>
								</div>
								<button class="flex-1 py-2 text-left text-sm font-medium" onclick={() => { activeTab = item.id; mobileTab = 'edit'; }}>{sectionLabel(item.id)}</button>
								<button onclick={(e) => { e.stopPropagation(); toggleSectionVisibility(item.id); }} class="flex-shrink-0 rounded p-1.5 opacity-60 transition-opacity hover:opacity-100" title={hiddenSections.has(item.id) ? 'Show section' : 'Hide section'}>
									{#if hiddenSections.has(item.id)}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-ink-muted"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
									{/if}
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			{#if !pageLoading}
			<!-- AI Insights panel -->
			<div class="flex-1 min-h-0 mx-3 mb-3 mt-2 rounded-2xl border border-surface-muted bg-white shadow-md overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<!-- Header -->
				<div class="flex items-center gap-2 border-b border-surface-muted px-4 py-3">
					<span class="text-sm font-bold text-ink">✦ AI Insights</span>
					{#if llmSuggestionsLoading}
						<span class="ml-auto flex items-center gap-1 text-xs text-ink-muted"><Spinner size="sm" />Analyzing…</span>
					{:else}
						{#if visibleSuggestions.length > 0}
							<span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{visibleSuggestions.length}</span>
						{/if}
						<button onclick={fetchLlmSuggestions} class="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-ink-muted hover:bg-surface-muted hover:text-ink-soft" title="Refresh suggestions">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
							Refresh
						</button>
					{/if}
				</div>

				<!-- Completion bar -->
				<div class="px-4 pt-3 pb-2">
					<div class="mb-1 flex items-center justify-between">
						<span class="text-xs font-bold text-ink-soft">Profile complete</span>
						<div class="flex items-center gap-1.5">
							<span class="text-xs font-bold {completionScore >= 80 ? 'text-emerald-600' : completionScore >= 50 ? 'text-amber-600' : 'text-red-500'}">{completionScore}%</span>
							{#if completionScore < 100}
								<button onclick={() => showCompletionChecklist = !showCompletionChecklist} class="text-xs text-ink-muted hover:text-ink-soft underline underline-offset-2" title="What's missing?">
									{showCompletionChecklist ? 'hide' : 'what\'s missing?'}
								</button>
							{/if}
						</div>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
						<div class="h-full rounded-full transition-all duration-500 {completionScore >= 80 ? 'bg-emerald-500' : completionScore >= 50 ? 'bg-amber-400' : 'bg-red-400'}" style="width:{completionScore}%"></div>
					</div>
					{#if showCompletionChecklist}
						<div class="mt-2 space-y-1">
							{#each completionItems as item}
								<div class="flex items-start gap-2">
									{#if item.done}
										<span class="mt-0.5 flex-shrink-0 text-emerald-500 text-xs">✓</span>
										<span class="text-xs text-ink-muted line-through">{item.label}</span>
									{:else}
										<span class="mt-0.5 flex-shrink-0 text-ink-muted text-xs">○</span>
										<span class="text-xs text-ink-soft">{item.label} <span class="text-ink-muted">(+{item.points}%)</span></span>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Suggestions list -->
				{#if llmSuggestionsError}
					<div class="px-4 pb-3 pt-2 text-center">
						<p class="text-xs text-red-500">{llmSuggestionsError}</p>
					</div>
				{:else if llmSuggestionsLoading}
					<div class="px-4 pb-4 pt-2 text-center">
						<p class="text-xs text-ink-muted">Generating personalized suggestions…</p>
					</div>
				{:else if visibleSuggestions.length === 0}
					<div class="px-4 pb-4 pt-1 text-center">
						<p class="text-xs text-ink-muted">{llmSuggestionsLoaded ? '✓ Your portfolio looks great! No suggestions right now.' : 'Looking good! No suggestions right now.'}</p>
					</div>
				{:else}
					<div class="space-y-1.5 px-3 pb-3 pt-1">
						{#each visibleSuggestions as s (s.id)}
							<div class="group relative">
								<button
									type="button"
									onclick={() => activateSuggestion(s)}
									class="w-full rounded-xl border px-3 py-2.5 text-left transition-all hover:shadow-sm {s.priority === 'high' ? 'border-red-100 bg-red-50/60 hover:border-red-200 hover:bg-red-50' : s.priority === 'medium' ? 'border-amber-100 bg-amber-50/60 hover:border-amber-200 hover:bg-amber-50' : 'border-surface-muted bg-surface-subtle/60 hover:border-surface-muted hover:bg-surface-subtle'}"
								>
									<p class="pr-5 text-xs font-bold truncate {s.priority === 'high' ? 'text-red-700' : s.priority === 'medium' ? 'text-amber-700' : 'text-ink-soft'}">{s.label}</p>
									<p class="mt-0.5 pr-5 text-xs text-ink-soft truncate">{s.sublabel}</p>
								</button>
								<button
									type="button"
									aria-label="Dismiss suggestion"
									onclick={() => { dismissedSuggestions = new Set([...dismissedSuggestions, s.id]); }}
									class="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-ink-muted opacity-0 transition-opacity hover:bg-surface-muted hover:text-ink-soft group-hover:opacity-100"
								>×</button>
							</div>
						{/each}
					</div>
				{/if}

				{#if dismissedSuggestions.size > 0}
					<div class="border-t border-surface-muted px-4 py-2 text-center">
						<button onclick={() => dismissedSuggestions = new Set()} class="text-xs font-medium text-ink-muted hover:text-ink-soft">
							Show dismissed ({dismissedSuggestions.size})
						</button>
					</div>
				{/if}
			</div>
			{/if}
		</aside>

		<div class="{mobileTab === 'preview' ? 'flex' : 'hidden'} sm:flex flex-1 flex-col overflow-hidden border-r border-surface-muted bg-gradient-to-b from-surface-muted to-surface-muted/70">
			<div class="flex flex-shrink-0 items-center justify-between border-b border-surface-muted bg-white px-4 py-2">
				<span class="text-sm font-bold text-ink-soft">Preview</span>
				<span class="text-xs text-ink-muted">Click any text to edit · select text for AI ✦</span>
			</div>
			<div class="relative flex-1 overflow-hidden p-4 sm:p-5">
				{#if pageLoading}
					<div class="flex h-full items-center justify-center">
						<p class="text-sm text-ink-muted">Loading preview…</p>
					</div>
				{:else}
					<div class="absolute inset-4 sm:inset-5 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/[0.07]">
						<iframe use:iframeEditor={renderedHTML} title="Portfolio Preview" class="h-full w-full border-0" style="overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none;" sandbox="allow-scripts allow-same-origin"></iframe>
					</div>
				{/if}
			</div>
		</div>

		<div bind:this={rightPanelEl} class="{mobileTab === 'edit' ? 'flex' : 'hidden'} sm:flex w-full sm:w-[460px] sm:flex-shrink-0 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<div class="flex-shrink-0 p-4 sm:p-6 space-y-4">

			{#if pageLoading}
				<LoadingState size="lg" message="Loading your portfolio content…" />
			{:else}
				{#if pageError}
					<div role="alert" aria-live="polite" class="rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
						<p class="text-sm font-medium text-amber-800">{pageError}</p>
					</div>
				{/if}

				{#if activeTab === 'profile'}
					<div class="space-y-8">
					<div class="rounded-[1.5rem] border border-surface-muted bg-white p-6 shadow-sm">
						<div class="mb-5 flex items-start justify-between">
							<div>
								<p class="text-xs font-bold uppercase tracking-widest text-ink-muted">Profile Info</p>
								<p class="mt-0.5 text-xs text-ink-muted">Contact details and social links.</p>
							</div>
							{#if rawProfileStatus === 'saved'}<span class="flex-shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">Saved ✓</span>
							{:else if rawProfileStatus === 'error'}<span class="flex-shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">Error</span>{/if}
						</div>
						<div class="space-y-4" onfocusout={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) autoSaveRawProfile(); }}>
							<div><label for="rp-full-name" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Full Name</label><input id="rp-full-name" type="text" value={rawProfile.full_name} oninput={(e) => { rawProfile.full_name = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" /></div>
							<div><label for="rp-headline" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Professional Title</label><input id="rp-headline" type="text" value={rawProfile.headline} oninput={(e) => { rawProfile.headline = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" /></div>
							<div class="grid grid-cols-2 gap-4">
								<div><label for="rp-email" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Email</label><input id="rp-email" type="email" value={rawProfile.email} oninput={(e) => { rawProfile.email = (e.target as HTMLInputElement).value; }} maxlength={200} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" /></div>
								<div><label for="rp-phone" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Phone</label><input id="rp-phone" type="text" value={rawProfile.phone} oninput={(e) => { rawProfile.phone = (e.target as HTMLInputElement).value; }} maxlength={50} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" /></div>
							</div>
							<div><label for="rp-location" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Location</label><input id="rp-location" type="text" value={rawProfile.location} oninput={(e) => { rawProfile.location = (e.target as HTMLInputElement).value; }} maxlength={200} placeholder="e.g. Hyderabad, India" class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" /></div>
							<div><label for="rp-summary" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Summary</label><textarea id="rp-summary" value={rawProfile.summary} oninput={(e) => { rawProfile.summary = (e.target as HTMLTextAreaElement).value; }} rows={3} maxlength={2000} class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea></div>
							<div>
								<p class="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">Social Links</p>
								<div class="space-y-2">
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-ink-soft">LinkedIn</span><input type="url" value={rawProfile.social_linkedin} oninput={(e) => { rawProfile.social_linkedin = (e.target as HTMLInputElement).value; }} placeholder="https://linkedin.com/in/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/15" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-ink-soft">GitHub</span><input type="url" value={rawProfile.social_github} oninput={(e) => { rawProfile.social_github = (e.target as HTMLInputElement).value; }} placeholder="https://github.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/15" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-ink-soft">GitLab</span><input type="url" value={rawProfile.social_gitlab} oninput={(e) => { rawProfile.social_gitlab = (e.target as HTMLInputElement).value; }} placeholder="https://gitlab.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/15" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-ink-soft">Portfolio</span><input type="url" value={rawProfile.social_portfolio} oninput={(e) => { rawProfile.social_portfolio = (e.target as HTMLInputElement).value; }} placeholder="https://..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/15" /></div>
									<div class="flex items-center gap-3"><span class="w-20 flex-shrink-0 text-xs font-bold text-ink-soft">Twitter / X</span><input type="url" value={rawProfile.social_twitter} oninput={(e) => { rawProfile.social_twitter = (e.target as HTMLInputElement).value; }} placeholder="https://twitter.com/..." maxlength={500} class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/15" /></div>
								</div>
							</div>
							<div>
								<p class="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">Profile Photo</p>
								<div class="flex items-center gap-4">
									{#if rawProfile.profile_image}
										<img src={rawProfile.profile_image} alt="Profile" class="h-16 w-16 rounded-full object-cover ring-2 ring-surface-muted" />
									{:else}
										<div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
										</div>
									{/if}
									<div class="flex-1">
										<label class="flex cursor-pointer items-center gap-2 rounded-xl border border-surface-muted bg-surface-subtle px-4 py-2.5 text-sm font-bold text-ink-soft hover:border-brand/40 hover:bg-white transition-colors">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
											{imageUploadStatus === 'uploading' ? 'Uploading…' : imageUploadStatus === 'done' ? 'Photo saved ✓' : rawProfile.profile_image ? 'Replace photo' : 'Upload photo'}
											<input
												type="file"
												accept="image/jpeg,image/png,image/webp,image/gif"
												style="position:fixed;top:-100px;left:-100px;opacity:0;pointer-events:none"
												disabled={imageUploadStatus === 'uploading'}
												onchange={(e) => {
													const f = (e.target as HTMLInputElement).files?.[0];
													if (f) uploadProfileImage(f);
													(e.target as HTMLInputElement).value = '';
												}}
											/>
										</label>
										{#if imageUploadError}<p class="mt-1 text-xs font-bold text-red-500">{imageUploadError}</p>{/if}
										<p class="mt-1 text-xs text-ink-muted">JPEG, PNG, WebP or GIF</p>
									</div>
								</div>
							</div>
						</div>
						{#if rawProfileError}<p class="mt-3 text-xs font-bold text-red-500">{rawProfileError}</p>{/if}
					</div>

					<div><p class="mb-4 text-xs font-bold uppercase tracking-widest text-ink-muted">Portfolio Content <span class="font-normal normal-case ml-1">— AI-generated, edit freely</span></p></div>

					{#each PROFILE_FIELDS as { key, label, hint, limit, multiline }}
						{@const f = profileFields[key]}
						<div class="rounded-[1.5rem] border border-surface-muted bg-white p-6 shadow-sm">
							<div class="mb-4 flex items-start justify-between">
								<div><p class="text-xs font-bold tracking-widest text-ink-muted uppercase">{label}</p><p class="mt-0.5 text-xs text-ink-muted">{hint}</p></div>
								{#if f.status === 'saved'}<span class="flex-shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">Saved ✓</span>
								{:else if f.status === 'error'}<span class="flex-shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">Error</span>{/if}
							</div>
							{#if multiline}
								<textarea id="pf-{key}" value={f.value} oninput={(e) => { profileFields[key].value = (e.target as HTMLTextAreaElement).value; }} onblur={() => autoSaveProfileField(key)} rows={5} maxlength={limit} disabled={f.status === 'saving'} class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60"></textarea>
							{:else}
								<input id="pf-{key}" type="text" value={f.value} oninput={(e) => { profileFields[key].value = (e.target as HTMLInputElement).value; }} onblur={() => autoSaveProfileField(key)} maxlength={limit} disabled={f.status === 'saving'} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand/60 focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60" />
							{/if}
							{#if f.errorMsg}<p class="mt-2 text-xs font-bold text-red-500">{f.errorMsg}</p>{/if}
							<div class="mt-4 flex items-center justify-between">
								<p class="text-xs text-ink-muted">{f.value.length}/{limit}</p>
								<button type="button" onclick={() => { profileFields[key].showAiPanel = !f.showAiPanel; }} class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100">✦ AI Enhance</button>
							</div>
							{#if f.showAiPanel}
								<div data-profile-ai-panel="{key}" class="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
									<p class="mb-2 text-xs font-bold text-amber-700 uppercase tracking-widest">AI Enhancement</p>
									<textarea use:autoResize value={f.aiInstruction} oninput={(e) => { profileFields[key].aiInstruction = (e.target as HTMLTextAreaElement).value; }} placeholder="e.g. Make it more concise and impactful..." class="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 overflow-hidden min-h-[60px]"></textarea>
									{#if f.aiError}<p class="mt-2 text-xs font-bold text-red-500">{f.aiError}</p>{/if}
									{#if f.aiSuggestion}
										<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
											<p class="mb-1 text-xs font-bold text-emerald-700">Suggestion</p>
											<p class="text-sm text-ink-soft">{f.aiSuggestion}</p>
											<div class="mt-3 flex gap-2">
												<button onclick={() => acceptProfileSuggestion(key)} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
												<button onclick={() => { profileFields[key].aiSuggestion = null; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Dismiss</button>
											</div>
										</div>
									{/if}
									<div class="mt-3 flex gap-2">
										<button onclick={() => enhanceProfileField(key)} disabled={!f.aiInstruction.trim() || f.aiLoading} class="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1.5">{#if f.aiLoading}<Spinner size="sm" />{/if}Generate</button>
										<button onclick={() => { profileFields[key].showAiPanel = false; profileFields[key].aiSuggestion = null; profileFields[key].aiError = ''; profileFields[key].aiInstruction = ''; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Close</button>
									</div>
								</div>
							{/if}
						</div>
					{/each}
					</div>

				{:else if activeTab === 'skills'}
					<div class="space-y-4">
						{#each skillGroups as group, gi}
							<div data-item-card="skills-{gi}" class="rounded-[1.5rem] border border-surface-muted bg-white p-4 shadow-sm">
								<div class="mb-3 flex items-center gap-2">
									<!-- Reorder buttons -->
									<div class="flex flex-shrink-0 flex-col">
										<button type="button" onclick={() => moveSkillGroupUp(gi)} disabled={gi === 0} title="Move up" class="rounded p-0.5 text-ink-muted transition-colors hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg></button>
										<button type="button" onclick={() => moveSkillGroupDown(gi)} disabled={gi === skillGroups.length - 1} title="Move down" class="rounded p-0.5 text-ink-muted transition-colors hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
									</div>
									<input type="text" value={group.category} oninput={(e) => updateSkillGroupCategory(gi, (e.target as HTMLInputElement).value)} onblur={autoSaveSkills} placeholder="Category (e.g. Frontend, Backend)" class="min-w-0 flex-1 rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-2 text-sm font-bold text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
									<button onclick={() => { removeSkillGroup(gi); autoSaveSkills(); }} class="flex-shrink-0 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100">Remove</button>
								</div>
								<textarea value={group.skills.join('\n')} oninput={(e) => updateSkillGroupSkills(gi, (e.target as HTMLTextAreaElement).value)} onblur={autoSaveSkills} rows={3} placeholder="One skill per line&#10;e.g. React&#10;TypeScript&#10;Node.js" class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
							</div>
						{/each}
						<div class="flex flex-wrap gap-3">
							<button onclick={() => { addSkillGroup(); }} class="rounded-xl border border-surface-muted bg-white px-4 py-2.5 text-sm font-bold text-ink-soft hover:border-brand/40 hover:bg-surface-subtle">+ Add Group</button>
							<button onclick={() => (showSkillsAiPanel = !showSkillsAiPanel)} class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100">✦ Enhance with AI</button>
						</div>
						{#if skillsSaveError}<p class="text-xs font-bold text-red-500">{skillsSaveError}</p>{/if}
						{#if showSkillsAiPanel}
							<div data-skills-ai-panel class="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
								<p class="mb-1 text-xs font-bold text-amber-700 uppercase tracking-widest">AI Skills Enhancement</p>
								<p class="mb-3 text-xs text-amber-700/80">AI uses all your experience, projects, and certifications as context.</p>
								<textarea value={skillsAiInstruction} oninput={(e) => { skillsAiInstruction = (e.target as HTMLTextAreaElement).value; }} rows={2} placeholder="e.g. Add more specific technical skills from my experience..." class="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"></textarea>
								{#if skillsAiError}<p class="mt-2 text-xs font-bold text-red-500">{skillsAiError}</p>{/if}
								{#if skillsAiSuggestion}
									<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
										<p class="mb-2 text-xs font-bold text-emerald-700">Suggested Skills</p>
										{#each skillsAiSuggestion as grp}
											<div class="mb-2"><p class="text-xs font-bold text-ink-soft">{grp.category}</p><div class="mt-1 flex flex-wrap gap-1">{#each grp.skills as s}<span class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">{s}</span>{/each}</div></div>
										{/each}
										<div class="mt-3 flex gap-2">
											<button onclick={acceptSkillsSuggestion} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
											<button onclick={() => { skillsAiSuggestion = null; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Dismiss</button>
										</div>
									</div>
								{/if}
								<div class="mt-3 flex gap-2">
									<button onclick={enhanceSkills} disabled={!skillsAiInstruction.trim() || skillsAiLoading} class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">{#if skillsAiLoading}<Spinner size="sm" />{/if}Generate</button>
									<button onclick={() => { showSkillsAiPanel = false; skillsAiSuggestion = null; skillsAiError = ''; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Close</button>
								</div>
							</div>
						{/if}
					</div>

				{:else if SECTION_CONFIG[activeTab]?.type === 'array'}
					{@const sKey = activeTab}
					{@const cfg = SECTION_CONFIG[sKey]}
					{@const items = sections[sKey] ?? []}
					<div class="space-y-3">
						<div class="flex items-center gap-3 pb-1">
							<h2 class="text-base font-bold text-ink">{cfg.label}</h2>
							{#if items.length > 0}
								<span class="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold tabular-nums text-ink-soft">{items.length}</span>
							{/if}
						</div>
						{#each items as item, idx}
							<div data-item-card="{sKey}-{idx}" class="overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition-all {item.hidden ? 'border-surface-muted opacity-60' : item.expanded ? 'border-brand/20 shadow-md' : 'border-surface-muted hover:shadow-md'}">
								<div class="flex w-full items-center gap-2 px-4 py-3">
									<!-- Expand/collapse + title -->
									<button type="button" onclick={() => toggleItemExpand(sKey, idx)} class="flex min-w-0 flex-1 items-center gap-2 text-left">
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-bold text-ink {item.hidden ? 'line-through text-ink-muted' : ''}">{cfg.itemTitle(item.data, idx)}</p>
											{#if item.hidden}<span class="mt-0.5 inline-block text-xs font-bold text-ink-muted">Hidden</span>
											{:else if item.isSaving}<span class="mt-0.5 inline-block text-xs font-bold text-ink-muted">Saving…</span>
											{:else if item.saveSuccess}<span class="mt-0.5 inline-block text-xs font-bold text-emerald-600">Saved ✓</span>
											{:else if item.saveError}<span class="mt-0.5 inline-block text-xs font-bold text-red-500">Save failed</span>{/if}
										</div>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 flex-shrink-0 text-ink-muted transition-transform {item.expanded ? 'rotate-180' : ''}"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
									</button>
									<!-- Reorder buttons -->
									<div class="flex flex-shrink-0 flex-col">
										<button type="button" onclick={() => moveItemUp(sKey, idx)} disabled={idx === 0} title="Move up" class="rounded p-0.5 text-ink-muted transition-colors hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg></button>
										<button type="button" onclick={() => moveItemDown(sKey, idx)} disabled={idx === items.length - 1} title="Move down" class="rounded p-0.5 text-ink-muted transition-colors hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
									</div>
									<!-- Hide toggle -->
									<button type="button" onclick={() => toggleItemHidden(sKey, idx)} title={item.hidden ? 'Show in portfolio' : 'Hide from portfolio'} class="flex-shrink-0 rounded-lg border p-1.5 transition-colors {item.hidden ? 'border-surface-muted bg-surface-muted text-ink-muted hover:bg-surface-muted' : 'border-surface-muted text-ink-muted hover:bg-surface-muted hover:text-ink-soft'}">
										{#if item.hidden}
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
										{/if}
									</button>
									<!-- Delete -->
									<button type="button" onclick={() => promptDeleteItem(sKey, idx)} class="flex-shrink-0 rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-100">Delete</button>
								</div>
								{#if item.expanded}
									{@const enhanceable = cfg.fields.filter((f) => f.aiEnhanceable)}
									<div class="space-y-4 border-t border-surface-muted bg-surface-subtle/40 px-6 pb-6 pt-4">
										{#each cfg.fields as field}
											<div>
												{#if field.inputType === 'images'}
													{@const stateKey = `${sKey}-${idx}`}
													{@const imgs = (item.data[field.key] as string[]) ?? []}
													<p class="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">{field.label}</p>
													{#if imgs.length > 0}
														<div class="mb-3 grid grid-cols-3 gap-2">
															{#each imgs as imgUrl, imgIdx}
																<div class="relative">
																	<img src={imgUrl} alt="Uploaded" class="h-20 w-full rounded-xl object-cover ring-1 ring-surface-muted" />
																	<button
																		type="button"
																		aria-label="Remove image"
																		onclick={() => removeSectionImage(sKey, idx, imgIdx)}
																		class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:bg-red-600"
																	>×</button>
																</div>
															{/each}
														</div>
													{/if}
													{#if aiImagePending[stateKey]}
														<div class="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
															<p class="mb-2 text-xs font-bold text-amber-700">AI-generated image — add to project?</p>
															<img src={aiImagePending[stateKey]} alt="AI generated" class="mb-2 h-32 w-full rounded-lg object-cover" />
															<div class="flex gap-2">
																<button
																	type="button"
																	onclick={() => acceptAiImage(sKey, idx)}
																	class="flex-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
																>Add to project</button>
																<button
																	type="button"
																	onclick={() => discardAiImage(sKey, idx)}
																	class="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
																>Discard</button>
															</div>
														</div>
													{/if}
													{#if imgs.length < MAX_ITEM_IMAGES}
														<div class="flex gap-2">
															<label class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-surface-muted bg-surface-subtle px-4 py-2.5 text-sm font-bold text-ink-soft hover:border-brand/40 hover:bg-white transition-colors">
																<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
																{itemImageUploadStatus[stateKey] === 'uploading' ? 'Uploading…' : `Upload (${imgs.length}/${MAX_ITEM_IMAGES})`}
																<input
																	type="file"
																	accept="image/jpeg,image/png,image/webp,image/gif"
																	style="position:fixed;top:-100px;left:-100px;opacity:0;pointer-events:none"
																	disabled={itemImageUploadStatus[stateKey] === 'uploading'}
																	onchange={(e) => {
																		const f = (e.target as HTMLInputElement).files?.[0];
																		if (f) uploadSectionImage(sKey, idx, f);
																		(e.target as HTMLInputElement).value = '';
																	}}
																/>
															</label>
															<button
																type="button"
																disabled={aiImageGenerating[stateKey] || !!aiImagePending[stateKey]}
																onclick={() => generateAiImage(sKey, idx)}
																class="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors"
															>
																{#if aiImageGenerating[stateKey]}
																	<svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
																	Generating…
																{:else}
																	✦ Generate
																{/if}
															</button>
														</div>
													{:else}
														<p class="text-xs text-ink-muted">Maximum {MAX_ITEM_IMAGES} images reached</p>
													{/if}
													{#if itemImageUploadError[stateKey]}<p class="mt-1 text-xs font-bold text-red-500">{itemImageUploadError[stateKey]}</p>{/if}
													{#if aiImageError[stateKey]}<p class="mt-1 text-xs font-bold text-red-500">{aiImageError[stateKey]}</p>{/if}
												{:else}
													<label for="{sKey}-{idx}-{field.key}" class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">{field.label}</label>
													{#if field.inputType === 'textarea' || field.inputType === 'list'}
														<textarea id="{sKey}-{idx}-{field.key}" value={getFieldValue(item.data, field.key, field.inputType)} oninput={(e) => setFieldValue(sKey, idx, field.key, field.inputType, (e.target as HTMLTextAreaElement).value)} onblur={() => autoSaveItem(sKey, idx)} rows={field.inputType === 'list' ? 3 : 4} maxlength={field.limit} placeholder={field.placeholder ?? (field.inputType === 'list' ? 'One item per line' : '')} class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
													{:else}
														<input id="{sKey}-{idx}-{field.key}" type={field.inputType === 'url' ? 'url' : 'text'} value={getFieldValue(item.data, field.key, field.inputType)} oninput={(e) => setFieldValue(sKey, idx, field.key, field.inputType, (e.target as HTMLInputElement).value)} onblur={() => autoSaveItem(sKey, idx)} maxlength={field.limit} placeholder={field.placeholder ?? ''} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
													{/if}
												{/if}
											</div>
										{/each}
										{#if item.saveError}<p class="text-xs font-bold text-red-500">{item.saveError}</p>{/if}
										{#if enhanceable.length > 0}
										<div class="flex items-center pt-2">
											<button onclick={() => toggleItemAiPanel(sKey, idx)} class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100">✦ AI Enhance</button>
										</div>
										{/if}
										{#if item.showAiPanel && enhanceable.length > 0}
											<div data-ai-panel="{sKey}-{idx}" class="mt-2 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
												<p class="mb-3 text-xs font-bold uppercase tracking-widest text-amber-700">AI Enhancement</p>
												{#if enhanceable.length > 1}
													<div class="mb-3 flex flex-wrap gap-2">{#each enhanceable as ef}<button type="button" onclick={() => setItemAiField(sKey, idx, ef.key)} class="rounded-lg px-3 py-1 text-xs font-bold transition-all {item.aiField === ef.key ? 'bg-amber-500 text-white' : 'border border-amber-200 bg-white text-amber-700'}">{ef.label}</button>{/each}</div>
												{:else if enhanceable.length === 1}
													<p class="mb-2 text-xs text-amber-700">Enhancing: <strong>{enhanceable[0].label}</strong></p>
												{/if}
												<textarea use:autoResize value={item.aiInstruction} oninput={(e) => setItemAiInstruction(sKey, idx, (e.target as HTMLTextAreaElement).value)} placeholder="e.g. Make it more impactful with measurable results..." class="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 overflow-hidden min-h-[60px]"></textarea>
												{#if item.aiError}<p class="mt-2 text-xs font-bold text-red-500">{item.aiError}</p>{/if}
												{#if item.aiSuggestion}
													<div class="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
														<p class="mb-1 text-xs font-bold text-emerald-700">Suggestion</p>
														{#if Array.isArray(item.aiSuggestion)}<ul class="space-y-1">{#each item.aiSuggestion as s}<li class="text-sm text-ink-soft">• {s}</li>{/each}</ul>
														{:else}<p class="text-sm text-ink-soft">{item.aiSuggestion}</p>{/if}
														<div class="mt-3 flex gap-2">
															<button onclick={() => acceptItemSuggestion(sKey, idx)} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Accept</button>
															<button onclick={() => { const u = [...sections[sKey]]; u[idx] = { ...u[idx], aiSuggestion: null }; sections = { ...sections, [sKey]: u }; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Dismiss</button>
														</div>
													</div>
												{/if}
												<div class="mt-3 flex gap-2">
													<button onclick={() => enhanceItem(sKey, idx)} disabled={!item.aiField || !item.aiInstruction.trim() || item.aiLoading} class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">{#if item.aiLoading}<Spinner size="sm" />{/if}Generate</button>
													<button onclick={() => toggleItemAiPanel(sKey, idx)} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Close</button>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
						<button onclick={() => addItem(sKey)} class="flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-surface-muted bg-white py-4 text-sm font-bold text-ink-muted transition-all hover:border-brand/40 hover:bg-surface-subtle hover:text-ink-soft">
							<span class="flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-base font-bold leading-none transition-colors group-hover:bg-surface-muted">+</span>
							Add {cfg.label.replace(/s$/, '')}
						</button>
					</div>

				{:else if SECTION_CONFIG[activeTab]?.type === 'string' || SECTION_CONFIG[activeTab]?.type === 'list'}
					{@const sKey = activeTab}
					{@const cfg = SECTION_CONFIG[sKey]}
					{@const isDirtyStr = stringSections[sKey] !== stringSectionOriginals[sKey]}
					<div class="rounded-[1.5rem] border border-surface-muted bg-white p-6 shadow-sm">
						<p class="mb-2 text-xs font-bold uppercase tracking-widest text-ink-muted">{cfg.label}</p>
						{#if cfg.type === 'list'}<p class="mb-3 text-xs text-ink-muted">Enter one item per line.</p>{/if}
						<textarea value={stringSections[sKey] ?? ''} oninput={(e) => { stringSections = { ...stringSections, [sKey]: (e.target as HTMLTextAreaElement).value }; }} onblur={() => autoSaveStringSection(sKey)} rows={6} class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
						<div class="mt-3">
							{#if stringSectionStatus[sKey] === 'error'}<p class="text-xs font-bold text-red-500">Save failed. Please try again.</p>
							{:else if stringSectionStatus[sKey] === 'saving'}<p class="text-xs font-bold text-ink-muted">Saving…</p>
							{:else if stringSectionStatus[sKey] === 'saved'}<p class="text-xs font-bold text-emerald-600">Saved ✓</p>{/if}
						</div>
					</div>

				{:else if activeTab === 'custom_sections'}
					<div class="space-y-3">
						<div class="flex items-center gap-3 pb-1">
							<h2 class="text-base font-bold text-ink">Custom Sections</h2>
							{#if customSections.length > 0}
								<span class="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold tabular-nums text-ink-soft">{customSections.length}</span>
							{/if}
							{#if csSaveStatus === 'saved'}
								<span class="ml-auto text-xs font-bold text-emerald-600">Saved ✓</span>
							{:else if csSaveStatus === 'saving'}
								<span class="ml-auto text-xs font-bold text-ink-muted">Saving…</span>
							{:else if csSaveStatus === 'error'}
								<span class="ml-auto text-xs font-bold text-red-500">{csSaveError}</span>
							{/if}
						</div>

						<!-- Existing custom sections -->
						{#each customSections as cs, csIdx}
							<div class="overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition-all {csExpanded[csIdx] ? 'border-brand/20 shadow-md' : 'border-surface-muted hover:shadow-md'}">
								<!-- Section header -->
								<div class="flex w-full items-center gap-2 px-4 py-3">
									<button type="button" onclick={() => { csExpanded = { ...csExpanded, [csIdx]: !csExpanded[csIdx] }; }} class="flex min-w-0 flex-1 items-center gap-2 text-left">
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-bold text-ink">{cs.title || `Section ${csIdx + 1}`}</p>
											<p class="mt-0.5 text-xs text-ink-muted capitalize">{cs.display_type} · {cs.items.length} item{cs.items.length !== 1 ? 's' : ''}</p>
										</div>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 flex-shrink-0 text-ink-muted transition-transform {csExpanded[csIdx] ? 'rotate-180' : ''}"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
									</button>
									<div class="flex flex-shrink-0 items-center gap-1">
										<button type="button" onclick={() => moveCustomSectionUp(csIdx)} disabled={csIdx === 0} title="Move section up" class="rounded p-1 text-ink-muted hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg></button>
										<button type="button" onclick={() => moveCustomSectionDown(csIdx)} disabled={csIdx === customSections.length - 1} title="Move section down" class="rounded p-1 text-ink-muted hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
										<button type="button" onclick={() => deleteCustomSection(csIdx)} class="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-100">Delete</button>
									</div>
								</div>

								{#if csExpanded[csIdx]}
									<div class="space-y-4 border-t border-surface-muted bg-surface-subtle/40 px-6 pb-6 pt-4">
										<!-- Section metadata -->
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Section Title</label>
												<input type="text" value={cs.title} oninput={(e) => { const u = [...customSections]; u[csIdx] = { ...u[csIdx], title: (e.target as HTMLInputElement).value }; customSections = u; }} onblur={autoSaveCustomSections} maxlength={200} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Display Type</label>
												<select value={cs.display_type} onchange={(e) => { const u = [...customSections]; u[csIdx] = { ...u[csIdx], display_type: (e.target as HTMLSelectElement).value as 'cards'|'list'|'timeline' }; customSections = u; autoSaveCustomSections(); }} class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15">
													<option value="cards">Cards</option>
													<option value="list">List</option>
													<option value="timeline">Timeline</option>
												</select>
											</div>
										</div>

										<!-- Items -->
										{#each cs.items as item, itemIdx}
											<div class="rounded-xl border border-surface-muted bg-white p-4 space-y-3">
												<div class="flex items-center justify-between gap-2">
													<p class="text-xs font-bold text-ink-soft">Item {itemIdx + 1}</p>
													<div class="flex items-center gap-1">
														<button type="button" onclick={() => moveCsItemUp(csIdx, itemIdx)} disabled={itemIdx === 0} title="Move up" class="rounded p-0.5 text-ink-muted hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg></button>
														<button type="button" onclick={() => moveCsItemDown(csIdx, itemIdx)} disabled={itemIdx === cs.items.length - 1} title="Move down" class="rounded p-0.5 text-ink-muted hover:text-ink-soft disabled:opacity-20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>
														<button type="button" onclick={() => removeCsItem(csIdx, itemIdx)} class="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-100">Remove</button>
													</div>
												</div>
												<div>
													<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Label / Title</label>
													<input type="text" value={item.label ?? ''} oninput={(e) => updateCsItem(csIdx, itemIdx, 'label', (e.target as HTMLInputElement).value)} onblur={autoSaveCustomSections} maxlength={200} placeholder="e.g. Conference name, award title" class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
												</div>
												<div>
													<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Description / Content</label>
													<textarea value={item.value ?? ''} oninput={(e) => updateCsItem(csIdx, itemIdx, 'value', (e.target as HTMLTextAreaElement).value)} onblur={autoSaveCustomSections} rows={3} maxlength={1000} placeholder="Main description or body text" class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
												</div>
												<div class="grid grid-cols-2 gap-3">
													<div>
														<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Subtitle</label>
														<input type="text" value={item.subtitle ?? ''} oninput={(e) => updateCsItem(csIdx, itemIdx, 'subtitle', (e.target as HTMLInputElement).value)} onblur={autoSaveCustomSections} maxlength={200} placeholder="e.g. date, org" class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
													</div>
													<div>
														<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">URL</label>
														<input type="url" value={item.url ?? ''} oninput={(e) => updateCsItem(csIdx, itemIdx, 'url', (e.target as HTMLInputElement).value)} onblur={autoSaveCustomSections} maxlength={500} placeholder="https://..." class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
													</div>
												</div>
												<div>
													<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Tags (one per line)</label>
													<textarea value={(item.tags ?? []).join('\n')} oninput={(e) => updateCsItem(csIdx, itemIdx, 'tags', (e.target as HTMLTextAreaElement).value)} onblur={autoSaveCustomSections} rows={2} placeholder="e.g. React&#10;TypeScript" class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-3 py-2 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
												</div>
											</div>
										{/each}

										<button onclick={() => addCsItem(csIdx)} class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-muted bg-white py-3 text-sm font-bold text-ink-muted transition-all hover:border-brand/40 hover:bg-surface-subtle hover:text-ink-soft">+ Add Item</button>
									</div>
								{/if}
							</div>
						{/each}

						<!-- AI classify panel -->
						<div class="rounded-[1.5rem] border border-surface-muted bg-white p-6 shadow-sm">
							<p class="mb-1 text-sm font-bold text-ink">+ Add a Custom Section</p>
							<p class="mb-4 text-xs text-ink-muted">Describe what you'd like to add. AI will suggest the best way to display it or merge it into an existing section.</p>
							<div class="space-y-3">
								<div>
									<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Describe the content</label>
									<textarea value={customSectionInput} oninput={(e) => { customSectionInput = (e.target as HTMLTextAreaElement).value; }} rows={4} maxlength={2000} placeholder="e.g. I've spoken at PyCon 2024, JSConf 2023, and DevFest 2022. I also co-authored a paper on distributed systems…" class="w-full resize-none rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15"></textarea>
									<p class="mt-1 text-right text-xs text-ink-muted">{customSectionInput.length}/2000</p>
								</div>
								<div>
									<label class="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-soft">Section title hint <span class="font-normal normal-case text-ink-muted">(optional)</span></label>
									<input type="text" value={customSectionTitleHint} oninput={(e) => { customSectionTitleHint = (e.target as HTMLInputElement).value; }} maxlength={100} placeholder="e.g. Conference Talks, Publications, Languages" class="w-full rounded-xl border border-surface-muted bg-surface-subtle/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/15" />
								</div>
								<button onclick={classifyCustomSection} disabled={!customSectionInput.trim() || customSectionAiStatus === 'loading'} class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors">
									{#if customSectionAiStatus === 'loading'}
										<Spinner size="sm" />
									{/if}
									✦ Classify with AI
								</button>
							</div>

							{#if customSectionAiError}
								<p class="mt-4 text-xs font-bold text-red-500">{customSectionAiError}</p>
							{/if}

							{#if customSectionAiResult}
								{#if customSectionAiResult.action === 'merge'}
									<div class="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
										<p class="mb-1 text-sm font-bold text-amber-700">This fits in an existing section</p>
										<p class="mb-3 text-xs text-amber-700/80">AI suggests adding this to your <strong class="capitalize">{customSectionAiResult.targetSection}</strong> section instead of creating a new one.</p>
										<div class="flex gap-2">
											<button onclick={() => { activeTab = customSectionAiResult!.targetSection; customSectionAiResult = null; customSectionAiStatus = 'idle'; }} class="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600 capitalize">Go to {customSectionAiResult.targetSection}</button>
											<button onclick={() => { customSectionAiResult = null; customSectionAiStatus = 'idle'; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Dismiss</button>
										</div>
									</div>
								{:else if customSectionAiResult.action === 'new_section'}
									<div class="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
										<p class="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700">New Section Preview</p>
										<p class="mb-0.5 text-sm font-bold text-ink">{customSectionAiResult.section.title}</p>
										<p class="mb-3 text-xs text-ink-muted capitalize">{customSectionAiResult.section.display_type} · {customSectionAiResult.section.items.length} item{customSectionAiResult.section.items.length !== 1 ? 's' : ''}</p>
										{#each customSectionAiResult.section.items.slice(0, 3) as previewItem}
											<div class="mb-1.5 rounded-lg bg-emerald-50 px-3 py-2">
												{#if previewItem.label}<p class="text-xs font-bold text-ink-soft">{previewItem.label}</p>{/if}
												{#if previewItem.value}<p class="mt-0.5 text-xs text-ink-muted line-clamp-2">{previewItem.value}</p>{/if}
											</div>
										{/each}
										{#if customSectionAiResult.section.items.length > 3}
											<p class="mt-1 mb-3 text-xs text-ink-muted">+{customSectionAiResult.section.items.length - 3} more item{customSectionAiResult.section.items.length - 3 !== 1 ? 's' : ''}</p>
										{/if}
										<div class="mt-3 flex gap-2">
											<button onclick={() => acceptNewCustomSection(customSectionAiResult!.section)} class="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">Add to Portfolio</button>
											<button onclick={() => { customSectionAiResult = null; customSectionAiStatus = 'idle'; }} class="rounded-lg border border-surface-muted px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface-muted">Dismiss</button>
										</div>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			{/if}
			</div>
		</div>

	</div>
</div>

<!-- Overlay backdrop — dismisses AI toolbar and list editor on outside click -->
{#if aiToolbar || listEditor}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40" onclick={() => { aiToolbar = null; listEditor = null; }}></div>
{/if}

<!-- Floating AI toolbar — appears above selected text in preview -->
{#if aiToolbar}
	{@const toolbarTop = aiToolbar.iframeRect.top + aiToolbar.selectionRect.top - 64}
	{@const toolbarLeft = Math.max(8, aiToolbar.iframeRect.left + aiToolbar.selectionRect.left + aiToolbar.selectionRect.width / 2 - 160)}
	<div class="fixed z-50 w-80 rounded-2xl bg-brand p-3 shadow-2xl" style="top:{toolbarTop}px;left:{toolbarLeft}px">
		<p class="mb-1.5 text-xs font-bold text-white">✦ AI Enhance</p>
		<p class="mb-2 truncate text-xs text-ink-muted">"{aiToolbar.selectedText.length > 60 ? aiToolbar.selectedText.slice(0, 60) + '…' : aiToolbar.selectedText}"</p>
		<!-- svelte-ignore a11y_autofocus -->
		<input autofocus bind:value={aiToolbar.instruction} placeholder="e.g. Make it more impactful…"
			onkeydown={(e) => { if (e.key === 'Enter') runAiFromToolbar(); if (e.key === 'Escape') aiToolbar = null; }}
			class="mb-2 w-full rounded-lg bg-ink px-3 py-2 text-sm text-white placeholder-ink-muted outline-none focus:ring-2 focus:ring-indigo-500" />
		<div class="flex gap-2">
			<button onclick={runAiFromToolbar} disabled={aiToolbar.loading}
				class="flex-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50">
				{aiToolbar.loading ? 'Enhancing…' : 'Enhance'}
			</button>
			<button onclick={() => aiToolbar = null}
				class="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-bold text-ink-muted hover:bg-surface-muted hover:text-ink">
				Cancel
			</button>
		</div>
		{#if aiToolbar.error}<p class="mt-1.5 text-xs text-red-400">{aiToolbar.error}</p>{/if}
	</div>
{/if}

<!-- Floating list editor — appears near a clicked list in preview -->
{#if listEditor}
	{@const listTop = Math.min(listEditor.iframeRect.top + listEditor.fieldRect.top, (typeof window !== 'undefined' ? window.innerHeight : 800) - 380)}
	{@const listLeft = Math.max(8, listEditor.iframeRect.left + listEditor.fieldRect.left)}
	<div bind:this={listEditorEl} class="fixed z-50 w-80 rounded-2xl border border-surface-muted bg-white shadow-2xl" style="top:{Math.max(8, listTop)}px;left:{listLeft}px">
		<div class="flex items-center justify-between border-b border-surface-muted px-4 py-3">
			<p class="text-sm font-bold text-ink">Edit items</p>
			<button onclick={() => listEditor = null} class="text-lg leading-none text-ink-muted hover:text-ink-soft">×</button>
		</div>
		<div class="max-h-72 overflow-y-auto px-3 py-2">
			{#each listEditor.items as item, i}
				<div class="group flex items-center gap-1 rounded-lg px-1 py-0.5 hover:bg-surface-subtle">
					<span class="w-5 flex-shrink-0 text-center text-sm font-bold text-indigo-400">•</span>
					<input
						data-list-input
						type="text"
						value={item}
						oninput={(e) => updateListItem(i, (e.target as HTMLInputElement).value)}
						onkeydown={(e) => handleListItemKeydown(e, i)}
						placeholder="Enter item…"
						class="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted"
					/>
					{#if listEditor.items.length > 1}
						<button onclick={() => removeListItem(i)} aria-label="Remove item" class="flex-shrink-0 rounded p-0.5 text-ink-muted opacity-0 hover:text-red-400 group-hover:opacity-100">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
						</button>
					{/if}
				</div>
			{/each}
			<button onclick={addListItem} class="mt-1 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-indigo-500 hover:bg-indigo-50">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
				Add item
			</button>
		</div>
		{#if listEditor.error}<p class="px-4 pb-1 text-xs text-red-500">{listEditor.error}</p>{/if}
		<div class="flex gap-2 border-t border-surface-muted px-4 py-3">
			<button onclick={() => listEditor = null}
				class="flex-1 rounded-xl border border-surface-muted py-2 text-sm font-bold text-ink-soft hover:bg-surface-subtle">
				Cancel
			</button>
			<button onclick={saveListEditor} disabled={listEditor.saving}
				class="flex-1 rounded-xl bg-brand py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-40">
				{listEditor.saving ? 'Saving…' : 'Save'}
			</button>
		</div>
	</div>
{/if}

<!-- Delete confirmation modal -->
{#if deleteModal.open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" onclick={cancelDelete}>
		<div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
		<div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<!-- Icon -->
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
				<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</div>
			<h3 class="mb-1 text-base font-bold text-ink">Delete this item?</h3>
			<p class="mb-6 text-sm text-ink-soft">This action cannot be undone.</p>
			<div class="flex gap-3">
				<button onclick={cancelDelete} class="flex-1 rounded-xl border border-surface-muted bg-white px-4 py-2.5 text-sm font-bold text-ink-soft transition hover:bg-surface-subtle">Cancel</button>
				<button onclick={confirmDelete} class="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600">Delete</button>
			</div>
		</div>
	</div>
{/if}
