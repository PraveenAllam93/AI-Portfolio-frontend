<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { startUpload, startGeneration, isSupportedFileType, type ResumeCategory } from '$lib/services/upload';
	import { startPolling, type StatusResponse } from '$lib/services/resumeStatus';
	import BreadcrumbHeader from '$lib/components/common/BreadcrumbHeader.svelte';
	import ProcessingSteps from '$lib/components/common/ProcessingSteps.svelte';
	import { renderPortfolio, sortFreeFirst, isFreeTemplate } from '$lib/templates';
	import { takePendingUpload } from '$lib/stores/pendingUpload';
	import { entitlements, freeTemplateIds, templatesRestricted } from '$lib/stores/entitlements';
	import { readLimitError, type LimitError } from '$lib/services/entitlements';
	import UpgradeModal from '$lib/components/common/UpgradeModal.svelte';
	import type { ParsedData, PortfolioContent } from '$lib/types/portfolio';

	type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
	// Wizard phases. 'analyzing' is the bridge between file upload and profession
	// selection where we run validation + text extraction + profession detection.
	type Phase = 'file' | 'analyzing' | 'profession' | 'template';

	// Confidence thresholds for the auto-detected profession.
	const HIGH_CONFIDENCE = 95; // ≥ → skip the profession screen entirely
	const LOW_CONFIDENCE = 60; //  ≥ (and < HIGH) → pre-select; < → manual

	interface PortfolioType {
		id: ResumeCategory;
		label: string;
		description: string;
	}

	let phase = $state<Phase>('file');
	let uploadStatus: UploadStatus = $state('idle');
	let errorMessage = $state('');
	// Non-null while the upgrade modal is open; carries the backend's 402 payload.
	let limitError = $state<LimitError | null>(null);
	let selectedFile: File | null = $state(null);
	let isDragOver = $state(false);
	let selectedTypeId = $state<ResumeCategory | ''>('');

	// New flow state
	let uploadId = $state<string | null>(null);
	// True when the profession screen was auto-skipped (≥HIGH confidence) — drives
	// the "Auto-detected" chip on the template screen.
	let autoSkipped = $state(false);
	// The auto-detected profession (independent of the user's working selection) —
	// drives the "Detected" chip + hint so they don't mislabel after a manual change.
	let predictedTypeId = $state<ResumeCategory | ''>('');

	// Analyzing-phase state (drives the shared <ProcessingSteps> bridge view)
	let analyzeStatus = $state<string | null>('PENDING_UPLOAD');
	let analyzeMessage = $state<string | null>(null);
	let analyzeAllDone = $state(false);
	let analyzeError = $state<string | null>(null);
	let stopPoll: (() => void) | null = null;

	// Steps shown during the file→profession bridge. The classify step ("Detecting
	// your field") is surfaced when the backend reaches AWAITING_SELECTION.
	const ANALYZE_STEPS = [
		{
			statuses: ['PENDING_UPLOAD', 'VALIDATING', 'VALIDATED', 'UPLOADED'],
			label: 'Securing your file',
			fallback: 'Uploading and running safety checks.',
			iconPath:
				'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
		},
		{
			statuses: ['EXTRACTING_TEXT', 'PARSING'],
			label: 'Reading your resume',
			fallback: 'Extracting your experience, skills and achievements.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
		},
		{
			statuses: ['AWAITING_SELECTION'],
			label: 'Detecting your field',
			fallback: 'Matching your resume to the right profession.',
			iconPath:
				'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z'
		}
	] as const;

	// Carousel state
	let carouselIndex = $state(0);
	let containerWidth = $state(600);

	const portfolioTypes: PortfolioType[] = [
		{ id: 'software_engineer', label: 'Software Engineer', description: 'Dev, tech & coding' },
		{ id: 'designer', label: 'Designer', description: 'UI/UX, creative & visual' },
		{ id: 'marketing', label: 'Marketing', description: 'Growth, content & brand' },
		{ id: 'finance', label: 'Finance', description: 'Analyst, banking & consulting' },
		{ id: 'civil_engineer', label: 'Civil Engineer', description: 'Structural, infra & construction' },
		{ id: 'mechanical_engineer', label: 'Mechanical Engineer', description: 'Design, thermal & manufacturing' },
		{ id: 'accountant', label: 'Accountant', description: 'Accounting, audit & taxation' },
		{ id: 'hr', label: 'Human Resources', description: 'Talent, people ops & L&D' },
		{ id: 'sales', label: 'Sales', description: 'B2B, account management & BD' }
	];

	interface Template {
		id: string;
		name: string;
		tag: string;
	}

	const TEMPLATES_BY_PROFESSION: Record<string, Template[]> = {
		software_engineer: [
			{ id: 'nebula',    name: 'Nebula',    tag: 'Cyberpunk'   },
			{ id: 'codex',     name: 'Codex',     tag: 'Light Tech'  },
			{ id: 'neon',      name: 'Neon',      tag: 'Cyber Green' },
			{ id: 'circuit',   name: 'Circuit',   tag: 'Dark Tech'   },
			{ id: 'glitch',    name: 'Glitch',    tag: 'Brutalist'   },
			{ id: 'navy-gold', name: 'Navy Gold', tag: 'Elegant'     },
			{ id: 'cosmos',    name: 'Cosmos',    tag: 'Space'       },
			{ id: 'retro',     name: 'Retro',     tag: 'Vintage'     },
			{ id: 'luxe',      name: 'Luxe',      tag: 'Classy'      },
			{ id: 'aurora',    name: 'Aurora',    tag: 'Modern'      },
			{ id: 'quantum',   name: 'Quantum',   tag: 'Futuristic'  },
			{ id: 'voltage',   name: 'Voltage',   tag: 'Electric'    },
			{ id: 'nimbus',    name: 'Nimbus',    tag: 'Cloud Navy'  },
			{ id: 'citrus',    name: 'Citrus',    tag: 'Warm Light'  },
			{ id: 'console',   name: 'Console',   tag: 'Sky Dev'     },
			{ id: 'neural',    name: 'Neural',    tag: 'Editorial'   },
			{ id: 'flux',      name: 'Flux',      tag: 'Neon Grid'   },
			{ id: 'monolith',  name: 'Monolith',  tag: 'Dark Luxe'   },
			{ id: 'helix',     name: 'Helix',     tag: 'Orb Glow'    },
			{ id: 'orbit',     name: 'Orbit',     tag: 'Space'       },
			{ id: 'iris',      name: 'Iris',      tag: 'Violet Light'},
			{ id: 'terminal',  name: 'Terminal',  tag: 'QA / Testing'},
			{ id: 'beacon',    name: 'Beacon',    tag: 'Indigo SaaS' },
		],
		designer: [
			{ id: 'designer',   name: 'Luxe Studio', tag: 'Dark Luxury'  },
			{ id: 'designer-2', name: 'Clean Slate', tag: 'Modern Clean' },
			{ id: 'atelier',    name: 'Atelier',     tag: 'Editorial'    },
			{ id: 'terra',      name: 'Terra',       tag: 'Interior'     },
			{ id: 'ember',      name: 'Ember',       tag: 'Cinematic'    },
			{ id: 'folio',      name: 'Folio',       tag: 'Sidebar'      },
			{ id: 'obsidian',   name: 'Obsidian',    tag: 'Dark Gold'    },
			{ id: 'muse',       name: 'Muse',        tag: 'Playful'      },
			{ id: 'prism',      name: 'Prism',       tag: 'Product'      },
			{ id: 'salon',      name: 'Salon',       tag: 'Luxe'         },
		],
		marketing: [
			{ id: 'marketing', name: 'Campaign',  tag: 'Editorial'   },
			{ id: 'momentum',  name: 'Momentum',  tag: 'Bold'        },
			{ id: 'apex',      name: 'Apex',      tag: 'Growth SaaS' },
			{ id: 'bloom',     name: 'Bloom',     tag: 'Soft Luxury' },
			{ id: 'signal',    name: 'Signal',    tag: 'Editorial'   },
			{ id: 'vantage',   name: 'Vantage',   tag: 'Dark Luxe'   },
			{ id: 'canopy',    name: 'Canopy',    tag: 'Organic'     },
		],
		civil_engineer: [
			{ id: 'blueprint', name: 'Blueprint', tag: 'Navy & Gold' },
			{ id: 'structura', name: 'Structura', tag: 'Professional' },
		],
		mechanical_engineer: [
			{ id: 'precision', name: 'Precision', tag: 'Engineering' },
			{ id: 'torque',    name: 'Torque',    tag: 'Navy & Gold'  },
		],
		finance: [
			{ id: 'ledger',   name: 'Ledger',   tag: 'Editorial' },
			{ id: 'sterling', name: 'Sterling', tag: 'Executive' },
		],
		accountant: [
			{ id: 'meridian', name: 'Meridian', tag: 'Navy & Gold' },
			{ id: 'cambria',  name: 'Cambria',  tag: 'Luxe Editorial' },
			{ id: 'verdant',  name: 'Verdant',  tag: 'Emerald' },
		],
		hr: [
			{ id: 'haven',   name: 'Haven',   tag: 'Sage & Calm'  },
			{ id: 'solace',  name: 'Solace',  tag: 'Glass Warm'   },
			{ id: 'quill',   name: 'Quill',   tag: 'Editorial'    },
			{ id: 'journal', name: 'Journal', tag: 'Berry & Gold' },
			{ id: 'atrium',  name: 'Atrium',  tag: 'Forest File'  },
		],
		sales: [
			{ id: 'clarion', name: 'Clarion', tag: 'Editorial Ledger' },
			{ id: 'cadence', name: 'Cadence', tag: 'Framed Warm'      },
		],
	};

	// John Doe mock data — used to render live template previews in the carousel
	const JOHN_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'John Doe',
			headline: 'Senior Software Engineer',
			summary: 'Passionate software engineer with 6+ years building scalable, high-performance web applications.',
			email: 'john.doe@example.com',
			phone: '+1 (555) 123-4567',
			location: 'San Francisco, CA',
			social_links: {
				linkedin: 'https://linkedin.com/in/johndoe',
				github: 'https://github.com/johndoe',
				portfolio: 'https://johndoe.dev',
			},
		},
		skills: [
			{ category: 'Languages',     skills: ['TypeScript', 'JavaScript', 'Python', 'Go'] },
			{ category: 'Frontend',      skills: ['React', 'SvelteKit', 'Next.js', 'Tailwind CSS'] },
			{ category: 'Backend',       skills: ['Node.js', 'Express', 'FastAPI', 'GraphQL'] },
			{ category: 'Cloud & DevOps',skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
		],
		experience: [
			{
				role: 'Senior Software Engineer',
				company: 'TechCorp Inc.',
				location: 'San Francisco, CA',
				start_date: '2021-01',
				is_current: true,
				description: 'Led development of microservices architecture serving 2M+ users.',
				key_points: [
					'Architected event-driven system using Kafka & Node.js, cutting API latency by 40%',
					'Managed a team of 4 engineers, delivering 3 major features ahead of schedule',
					'Implemented CI/CD pipelines reducing deployment time from 2 hours to 12 minutes',
				],
			},
			{
				role: 'Software Engineer',
				company: 'StartupAI',
				location: 'Remote',
				start_date: '2018-06',
				end_date: '2020-12',
				description: 'Built AI-powered features for a B2B SaaS platform.',
				key_points: [
					'Developed React + TypeScript frontend, improving team velocity by 30%',
					'Integrated OpenAI API for automated report generation serving 500+ enterprise clients',
				],
			},
		],
		projects: [
			{
				title: 'PortfolioAI',
				description: 'AI-powered resume-to-portfolio converter built on AWS serverless infrastructure with OpenAI.',
				tech_stack: ['TypeScript', 'SvelteKit', 'AWS Lambda', 'DynamoDB', 'OpenAI'],
				github_repo: 'https://github.com/johndoe/portfolio-ai',
				project_url: 'https://portfolioai.dev',
			},
			{
				title: 'DevMetrics Dashboard',
				description: 'Real-time engineering metrics platform tracking DORA metrics and deployment frequency.',
				tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Grafana'],
				github_repo: 'https://github.com/johndoe/devmetrics',
			},
		],
		education: [
			{
				degree: 'B.S.',
				field_of_study: 'Computer Science',
				institution: 'University of California, Berkeley',
				location: 'Berkeley, CA',
				start_year: '2014',
				end_year: '2018',
				grade_or_score: 'GPA: 3.8',
			},
		],
		certifications: [
			{ name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' },
			{ name: 'Google Cloud Professional',          issuer: 'Google',              year: '2021' },
		],
		achievements: [
			{
				title: 'Open Source Contributor of the Year',
				description: 'Recognized by the Node.js Foundation for significant contributions to the ecosystem.',
				year: '2023',
			},
		],
	};

	const JOHN_DOE_CONTENT: PortfolioContent = {
		bio: 'Passionate software engineer with 6+ years of experience building scalable, high-performance web applications. I thrive at the intersection of clean architecture and developer experience, with a strong focus on performance and observability.',
		headline: 'Senior Software Engineer · Full-Stack · AI Enthusiast',
		uniqueValue: 'I turn complex engineering challenges into elegant, maintainable solutions.',
	};

	// Designer mock data — used when profession is 'designer'
	const DESIGNER_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Jane Studio',
			headline: 'Senior UX/UI Designer',
			summary: 'Independent designer crafting brand systems, digital products, and experiences that feel deliberate.',
			email: 'jane@studio.design',
			phone: '+1 (555) 987-6543',
			location: 'New York, NY',
			social_links: {
				linkedin: 'https://linkedin.com/in/janestudio',
				portfolio: 'https://janestudio.design',
			},
		},
		skills: [
			{ category: 'Design',        skills: ['Brand Systems', 'UI/UX', 'Typography', 'Art Direction'] },
			{ category: 'Tools',         skills: ['Figma', 'Adobe Illustrator', 'After Effects', 'Framer'] },
			{ category: 'Engineering',   skills: ['HTML/CSS', 'Tailwind CSS', 'React', 'Framer Motion'] },
		],
		experience: [
			{
				role: 'Lead Designer',
				company: 'Pentagram',
				location: 'New York, NY',
				start_date: '2021-03',
				is_current: true,
				description: 'Led identity systems for arts institutions and editorial clients.',
				key_points: ['Directed brand refresh for 3 major cultural institutions', 'Built design system used by 12-person team'],
			},
			{
				role: 'Product Designer',
				company: 'Spotify',
				location: 'Remote',
				start_date: '2018-06',
				end_date: '2021-02',
				description: 'Designed core listening and discovery surfaces for 400M+ users.',
				key_points: ['Owned the Now Playing redesign, shipped to 400M+ users', 'Reduced onboarding drop-off by 28%'],
			},
		],
		projects: [
			{
				title: 'Halden & Co. Brand Identity',
				description: 'Complete brand & digital system for a Scandinavian furniture house — anchored by a custom didone and a quiet editorial site.',
				design_concept: 'Minimalist restraint meets Scandinavian warmth',
				software_used: ['Figma', 'Illustrator', 'Framer'],
				project_url: 'https://haldenco.com',
			},
			{
				title: 'Marée Atlas App',
				description: 'An ocean almanac app combining tide data, audio field recordings, and a typographic poster generator.',
				design_concept: 'Designing for the rhythm of nature',
				software_used: ['Figma', 'After Effects', 'Swift'],
			},
		],
		education: [
			{
				degree: 'M.A.',
				field_of_study: 'Communication Design',
				institution: 'Parsons School of Design',
				location: 'New York, NY',
				start_year: '2016',
				end_year: '2018',
				grade_or_score: 'Dean\'s List',
			},
		],
		certifications: [
			{ name: 'Google UX Design Certificate', issuer: 'Google', year: '2022' },
		],
		achievements: [
			{ title: 'Awwwards Site of the Year — Shortlist', description: 'Recognized for the Halden & Co. digital experience.', year: '2023' },
		],
		awards: [
			{ title: 'ADC Gold Pencil', awarding_body: 'Art Directors Club', year: '2022' },
			{ title: 'TDC65 Certificate of Excellence', awarding_body: 'Type Directors Club', year: '2021' },
		],
		design_philosophy: 'Great design is invisible — it removes friction, creates delight, and communicates without shouting. I believe the best work comes from ruthless editing and deep listening.',
		software_proficiency: ['Figma', 'Adobe Illustrator', 'Photoshop', 'After Effects', 'Framer', 'Blender', 'Procreate'],
	};

	const DESIGNER_DOE_CONTENT: PortfolioContent = {
		bio: 'Independent designer with 6+ years crafting brand systems, digital products, and typographic experiences. I work at the intersection of restraint and expression — making things that feel quiet but unforgettable.',
		headline: 'Senior Designer · Brand Systems · Digital Products',
		uniqueValue: 'I make brand systems, sites, and small software that feel deliberate — never noisy, never disposable.',
	};

	// Marketing mock data — used when profession is 'marketing'
	const MARKETER_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Alex Brand',
			headline: 'Growth Marketing Manager',
			summary: 'Data-driven marketing strategist with 7+ years driving measurable growth across B2B and B2C brands.',
			email: 'alex@brandgrowth.co',
			phone: '+1 (555) 246-8135',
			location: 'Austin, TX',
			social_links: {
				linkedin: 'https://linkedin.com/in/alexbrand',
				portfolio: 'https://alexbrand.co',
			},
		},
		skills: [
			{ category: 'Growth',    skills: ['SEO/SEM', 'Performance Marketing', 'Email Marketing', 'CRO'] },
			{ category: 'Analytics', skills: ['Google Analytics 4', 'Mixpanel', 'Tableau', 'Looker Studio'] },
			{ category: 'Content',   skills: ['Content Strategy', 'Copywriting', 'Social Media', 'Brand Voice'] },
		],
		experience: [
			{
				role: 'Growth Marketing Manager',
				company: 'Stripe',
				location: 'Austin, TX',
				start_date: '2021-04',
				is_current: true,
				description: 'Leading growth marketing strategy for SMB segment across 40+ markets.',
				channels_managed: ['Paid Search', 'SEO', 'Email', 'Content', 'Partnerships'],
				key_points: ['Grew organic traffic 180% YoY through content-led SEO strategy', 'Built email nurture sequences with 38% open rates'],
			},
			{
				role: 'Marketing Lead',
				company: 'Notion',
				location: 'Remote',
				start_date: '2018-07',
				end_date: '2021-03',
				description: 'Built the B2B marketing function from 0 to 1 during hypergrowth phase.',
				channels_managed: ['LinkedIn Ads', 'Product Hunt', 'Community', 'Email'],
				key_points: ['Drove 300% increase in B2B pipeline over 18 months', 'Launched ambassador program with 500+ active advocates'],
			},
		],
		campaigns: [
			{
				campaign_name: 'SMB Growth Engine Q4 2023',
				campaign_type: 'Performance Marketing',
				channels_used: ['Google Ads', 'LinkedIn', 'Email', 'Retargeting'],
				budget: '$240,000',
				performance_metrics: ['4.2x ROAS', '12,000 new signups', '38% below CPA target', '$2.1M pipeline generated'],
			},
			{
				campaign_name: 'Content-Led SEO Expansion',
				campaign_type: 'SEO / Content Marketing',
				channels_used: ['Blog', 'YouTube', 'LinkedIn', 'Backlink Outreach'],
				budget: '$85,000',
				performance_metrics: ['180% organic traffic growth', '1,200 new keywords ranked', '45% increase in inbound leads'],
			},
		],
		education: [
			{
				degree: 'B.S.',
				field_of_study: 'Marketing & Communications',
				institution: 'University of Texas, Austin',
				location: 'Austin, TX',
				start_year: '2013',
				end_year: '2017',
				grade_or_score: 'GPA: 3.9',
			},
		],
		certifications: [
			{ name: 'Google Analytics 4 Certification', issuer: 'Google', year: '2023' },
			{ name: 'HubSpot Content Marketing', issuer: 'HubSpot', year: '2022' },
			{ name: 'Meta Blueprint Certification', issuer: 'Meta', year: '2022' },
		],
		achievements: [
			{ title: 'Marketing Team of the Year', description: 'Awarded by SaaS Marketing Insider for driving 300% pipeline growth.', year: '2022' },
		],
	};

	const MARKETER_DOE_CONTENT: PortfolioContent = {
		bio: 'Growth marketing strategist with 7+ years turning data into strategy and strategy into measurable impact. I thrive in fast-moving environments where creative thinking meets rigorous experimentation.',
		headline: 'Growth Marketing Manager · B2B SaaS · Performance & Content',
		uniqueValue: 'I connect the dots between brand, data, and revenue — building programs that scale.',
	};

	// Civil engineer mock data — used when profession is 'civil_engineer'
	const CIVIL_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Marcus Holloway',
			headline: 'Senior Civil Engineer',
			summary: 'Infrastructure specialist with 14+ years across residential, commercial, and large-scale civil projects.',
			email: 'marcus.holloway@example.com',
			phone: '+91 98200 43781',
			location: 'Mumbai, Maharashtra',
			social_links: {
				linkedin: 'https://linkedin.com/in/marcus-holloway-ce',
			},
			summary_image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
		},
		skills: [
			{ category: 'Structural', skills: ['Structural Design', 'Seismic Analysis', 'RC & Steel Design', 'Foundation Design'] },
			{ category: 'Management', skills: ['Site Management', 'Cost Estimation & BOQ', 'QA / QC', 'Project Scheduling'] },
		],
		software_proficiency: ['STAAD Pro', 'ETABS', 'AutoCAD', 'Primavera P6', 'Revit', 'SAFE', 'MS Project'],
		experience: [
			{
				role: 'Senior Civil Engineer',
				company: 'Holloway Infrastructure Group',
				location: 'Mumbai',
				start_date: '2018-01',
				is_current: true,
				description: 'Lead structural engineer on high-rise and infrastructure projects worth ₹820Cr+.',
				key_points: [
					'Directed multidisciplinary teams of up to 60 personnel across 3 shifts',
					'Achieved zero-defect handovers with full IS/IRC code compliance',
				],
			},
			{
				role: 'Structural Engineer',
				company: 'Nexus Construction',
				location: 'Pune',
				start_date: '2012-06',
				end_date: '2017-12',
				description: 'Designed RC frames and post-tensioned slabs for commercial complexes.',
				key_points: ['Delivered 12 commercial projects on time and under budget'],
			},
		],
		projects: [
			{
				title: 'Skyline Heights — G+22 Residential Tower',
				description: 'Structural design and execution of a 22-storey residential tower in Andheri East.',
				project_category: 'Residential',
				tech_stack: ['ETABS', 'STAAD Pro', 'SAFE'],
				responsibilities: ['Structural design of RC frame', 'Supervised pile foundation & raft slab', 'Managed 45-member site team'],
				measurable_outcomes: ['Delivered 3 weeks early', '8% cost savings', 'Zero NCRs raised'],
			},
			{
				title: 'NH-48 Six-Lane Flyover',
				description: 'Design and QA/QC of a 1.4 km prestressed concrete flyover at Khopoli.',
				project_category: 'Infrastructure',
				tech_stack: ['STAAD Pro', 'MIDAS Civil'],
				responsibilities: ['Structural design of prestressed flyover', 'Oversaw segmental launching', 'NHAI & IRC compliance'],
				measurable_outcomes: ['1.4 km span delivered', 'NHAI commendation', 'Zero fatalities'],
			},
			{
				title: 'Nexus Business Park — Phase II',
				description: 'Grade-A office complex of 3.2L sq.ft with post-tensioned slabs.',
				project_category: 'Commercial',
				tech_stack: ['ETABS', 'AutoCAD'],
				responsibilities: ['Lead engineer for office complex', 'Designed transfer beams', 'BOQ & vendor negotiation'],
				measurable_outcomes: ['LEED Gold certified', '₹12Cr under budget'],
			},
		],
		education: [
			{
				degree: 'M.Tech',
				field_of_study: 'Structural Engineering',
				institution: 'VJTI Mumbai',
				location: 'Mumbai',
				start_year: '2010',
				end_year: '2012',
				grade_or_score: 'Gold Medalist',
			},
		],
		certifications: [
			{ name: 'Professional Engineer (PE) License', issuer: 'Maharashtra Council of Engineers', year: '2013' },
			{ name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', year: '2018' },
			{ name: 'Certified QA/QC Engineer', issuer: 'Bureau of Indian Standards', year: '2019' },
			{ name: 'Autodesk Revit BIM Specialist', issuer: 'Autodesk', year: '2022' },
		],
		achievements: [
			{ title: 'NHAI Commendation', description: 'Recognised for the on-time delivery of the NH-48 flyover with zero fatalities.', year: '2019' },
		],
	};

	const CIVIL_DOE_CONTENT: PortfolioContent = {
		bio: 'Senior Civil Engineer with 14+ years of hands-on experience spanning structural design, site execution, and project management across India\'s most demanding infrastructure sectors. I translate complex engineering requirements into safe, cost-effective, and sustainable built environments.',
		headline: 'Senior Civil Engineer · Structural · Infrastructure',
		uniqueValue: 'I deliver precision-engineered infrastructure on time and within budget — with zero-defect handovers.',
	};

	// Mechanical engineer mock data — used when profession is 'mechanical_engineer'
	const MECH_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Marcus Webb',
			headline: 'Senior Mechanical Design Engineer',
			summary: 'Precision-driven engineer specialising in thermal systems, structural analysis, and CAD-to-manufacture pipelines.',
			email: 'marcus.webb@example.com',
			phone: '+971 50 123 4567',
			location: 'Dubai, UAE',
			social_links: {
				linkedin: 'https://linkedin.com/in/marcus-webb',
			},
		},
		skills: [
			{ category: 'CAD & Design', skills: ['SolidWorks', 'CATIA V5', 'AutoCAD', 'GD&T'] },
			{ category: 'Simulation & Analysis', skills: ['ANSYS FEA', 'CFD / Fluent', 'MATLAB', 'Abaqus'] },
			{ category: 'Thermal Systems', skills: ['Heat Transfer', 'HVAC Design', 'Turbomachinery', 'Fluid Dynamics'] },
		],
		software_proficiency: ['SolidWorks', 'CATIA V5', 'ANSYS', 'MATLAB', 'Abaqus', 'AutoCAD'],
		experience: [
			{
				role: 'Senior Mechanical Design Engineer',
				company: 'Petrofac Engineering Ltd.',
				location: 'Dubai, UAE',
				start_date: '2021-01',
				is_current: true,
				description: 'Lead designer for offshore topside modules on a $400M gas compression project.',
				key_points: [
					'Owned the full mechanical design lifecycle from FEED through detailed engineering',
					'Achieved 14% weight reduction through topology optimisation studies',
				],
			},
			{
				role: 'Mechanical Systems Engineer',
				company: 'Airbus SE',
				location: 'Toulouse, France',
				start_date: '2017-06',
				end_date: '2020-12',
				description: 'Thermal management design of A320neo nacelle systems.',
				key_points: ['Validated designs through CFD and rig testing campaigns', 'Coordinated Tier-1 suppliers across 4 countries'],
			},
		],
		projects: [
			{
				title: 'Offshore Topside Module',
				description: 'Lead designer for a 340-tonne gas compression module, FEA-optimised structure.',
				project_category: 'Structural Engineering',
				tech_stack: ['SolidWorks', 'ANSYS', 'ASME'],
				measurable_outcomes: ['14% weight reduction vs baseline'],
			},
			{
				title: 'A320neo Nacelle Thermal Management',
				description: 'Full thermal management design including heat exchanger sizing and CFD-validated duct routing.',
				project_category: 'Aerospace Thermal',
				tech_stack: ['CATIA V5', 'CFD', 'DO-160'],
				measurable_outcomes: ['CFD-validated thermal performance'],
			},
		],
		education: [
			{
				degree: 'M.Sc.',
				field_of_study: 'Mechanical Engineering',
				institution: 'Imperial College London',
				location: 'London, UK',
				start_year: '2010',
				end_year: '2012',
				grade_or_score: 'Merit',
			},
			{
				degree: 'B.Eng. (Hons)',
				field_of_study: 'Mechanical Engineering',
				institution: 'University of Manchester',
				location: 'Manchester, UK',
				start_year: '2006',
				end_year: '2010',
				grade_or_score: 'First Class',
			},
		],
		certifications: [
			{ name: 'Certified SolidWorks Professional (CSWP)', issuer: 'Dassault Systèmes', year: '2023' },
			{ name: 'ASME Section VIII Pressure Vessel Design', issuer: 'ASME', year: '2020' },
		],
		achievements: [
			{ title: 'Two Patents Filed', description: 'Co-inventor on two patents for novel valve sealing mechanisms.', year: '2016' },
		],
	};

	const MECH_DOE_CONTENT: PortfolioContent = {
		bio: 'Senior Mechanical Design Engineer with 12+ years translating complex engineering challenges into manufacturable, high-performance solutions across aerospace, oil & gas, and industrial automation. I specialise in thermodynamic system design, FEA/CFD simulation, and GD&T-driven manufacturing documentation.',
		headline: 'Senior Mechanical Design Engineer · Thermal · CAD/CAE',
		uniqueValue: 'I optimise every component for function, cost, and lifecycle — good engineering is invisible when it works.',
	};

	// Finance mock data — used when profession is 'finance'
	const FINANCE_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Meera Anand',
			headline: 'Chartered Accountant & Financial Consultant',
			summary: 'Finance professional with 9+ years across accounting, taxation, and business analysis — turning financial complexity into confident decisions.',
			email: 'meera.anand@example.com',
			phone: '+971 50 123 4567',
			location: 'Dubai, UAE',
			social_links: {
				linkedin: 'https://linkedin.com/in/meera-anand',
			},
		},
		skills: [
			{ category: 'Accounting', skills: ['Financial Accounting', 'Bookkeeping', 'General Ledger', 'Bank Reconciliation'] },
			{ category: 'Financial Analysis', skills: ['Forecasting', 'Budgeting', 'Ratio Analysis', 'Variance Analysis'] },
			{ category: 'Taxation', skills: ['VAT', 'Corporate Tax', 'Tax Planning'] },
			{ category: 'Audit', skills: ['Internal Audit', 'Risk Assessment', 'Compliance'] },
			{ category: 'ERP Software', skills: ['SAP', 'Oracle', 'Tally', 'QuickBooks'] },
		],
		experience: [
			{
				role: 'Senior Financial Consultant',
				company: 'Meridian Advisory',
				location: 'Dubai, UAE',
				start_date: '2022',
				is_current: true,
				description: 'Manage monthly financial reporting for 14 retained clients across retail and logistics.',
				key_points: [
					'Reduced average client operational costs by 18% through vendor renegotiation and process audits',
					'Lead annual budgeting and statutory audit coordination',
				],
			},
			{
				role: 'Financial Analyst',
				company: 'Al Fahim Trading Group',
				location: 'Abu Dhabi, UAE',
				start_date: '2019',
				end_date: '2022',
				description: 'Owned rolling cash-flow modelling and variance analysis for a multi-entity trading group.',
				key_points: ["Built the group's first rolling 13-week cash flow model, still in use today", 'Identified $1.2M in avoidable annual spend'],
			},
			{
				role: 'Audit Associate',
				company: 'Kapoor & Associates, Chartered Accountants',
				location: 'New Delhi, India',
				start_date: '2016',
				end_date: '2019',
				description: 'Executed statutory and internal audits for manufacturing and healthcare clients.',
				key_points: ['Trained two audit cohorts on risk-based sampling methodology'],
			},
		],
		financial_modeling: [
			{ model_type: '13-Week Rolling Cash Flow Model', tools_used: ['Excel', 'Power BI', 'SQL'], outcome: 'Zero surprise cash shortfalls across 18 months for a multi-entity trading group.' },
			{ model_type: 'Three-Statement Operating Model', tools_used: ['Excel', 'SAP'], outcome: 'Board-ready scenario model that cut monthly close from 9 to 4 days.' },
			{ model_type: 'VAT Automation Template', tools_used: ['QuickBooks', 'Excel'], outcome: 'Reduced quarterly VAT filing time from 6 days to under a day for a five-entity group.' },
		],
		investment_portfolios: [
			{ portfolio_type: 'Balanced Client Retainer Book', assets_under_management: '$46M+', performance_return: '+12% avg. profit margin improvement' },
			{ portfolio_type: 'Fixed-Income Advisory Mandate', assets_under_management: '$20M', performance_return: '+6.4% net annualised' },
		],
		education: [
			{ degree: 'B.Com', field_of_study: 'Accounting & Finance', institution: 'University of Delhi', location: 'New Delhi, India', start_year: '2012', end_year: '2015', grade_or_score: 'Distinction' },
			{ degree: 'Chartered Accountancy', field_of_study: 'ICAI', institution: 'Institute of Chartered Accountants of India', start_year: '2015', end_year: '2018' },
		],
		certifications: [
			{ name: 'ACCA', issuer: 'Association of Chartered Certified Accountants', year: '2020' },
			{ name: 'IFRS Certification', issuer: 'ACCA', year: '2021' },
			{ name: 'SAP Finance (FICO)', issuer: 'SAP', year: '2022' },
			{ name: 'FMVA', issuer: 'Corporate Finance Institute', year: '2023' },
		],
		achievements: [
			{ title: 'Finance Excellence Award', description: 'Recognised for group-level cost optimisation and reporting quality.', year: '2024' },
			{ title: '500+ Tax Filings, Zero Penalties', description: 'Filed over 500 returns across a nine-year career with zero penalty notices.', year: '2023' },
			{ title: 'Employee of the Year', description: 'Awarded for cash-flow modelling that eliminated recurring shortfalls.', year: '2021' },
		],
	};

	const FINANCE_DOE_CONTENT: PortfolioContent = {
		bio: 'Finance professional with 9+ years across accounting, taxation, and business analysis. I help ambitious companies turn financial complexity into confident decisions — through precise reporting, sharp forecasting, and audits that hold up to scrutiny.',
		headline: 'Chartered Accountant & Financial Consultant',
		uniqueValue: "Good accounting doesn't just record the past — it gives a business the confidence to plan its next move.",
	};

	// Accountant mock data — used when profession is 'accountant'
	const ACCOUNTANT_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Priya Raghavan',
			headline: 'Chartered Accountant · Audit & Taxation',
			summary: 'Practising CA with 11+ years closing books, defending audits, and keeping multi-entity groups compliant across three tax regimes.',
			email: 'priya.raghavan@example.com',
			phone: '+91 98765 43210',
			location: 'Bengaluru, India',
			social_links: {
				linkedin: 'https://linkedin.com/in/priya-raghavan',
			},
		},
		skills: [
			{ category: 'Financial Reporting', skills: ['Statutory Financials', 'Consolidation', 'Month-End Close', 'MIS Reporting'] },
			{ category: 'Audit & Assurance', skills: ['Statutory Audit', 'Internal Audit', 'Risk-Based Sampling', 'Internal Controls'] },
			{ category: 'Taxation', skills: ['GST', 'Corporate Tax', 'TDS', 'Transfer Pricing', 'Tax Assessments'] },
			{ category: 'Accounts Operations', skills: ['Accounts Payable', 'Accounts Receivable', 'Payroll Accounting', 'Bank Reconciliation'] },
		],
		software_proficiency: ['SAP FICO', 'Tally ERP 9', 'QuickBooks', 'Zoho Books', 'Advanced Excel', 'Power BI'],
		compliance_expertise: ['Ind AS', 'IFRS', 'US GAAP', 'Companies Act 2013', 'GST Act', 'Income Tax Act', 'SOX 404'],
		experience: [
			{
				role: 'Manager — Audit & Assurance',
				company: 'Nandan & Co., Chartered Accountants',
				location: 'Bengaluru, India',
				start_date: '2020-04',
				is_current: true,
				description: 'Lead a nine-member team across statutory audits, group consolidations, and tax representation for 20+ retained clients.',
				key_points: [
					'Cut average client close cycle from 11 to 4 days by standardising the reconciliation workflow',
					'Represented 14 clients in GST and income-tax assessments with zero adverse orders',
					'Built the firm-wide audit documentation template now used on every engagement',
				],
			},
			{
				role: 'Assistant Manager — Finance & Accounts',
				company: 'Wintrex Industries Pvt. Ltd.',
				location: 'Pune, India',
				start_date: '2016-07',
				end_date: '2020-03',
				description: 'Owned the general ledger, statutory reporting, and audit coordination for a three-entity manufacturing group.',
				key_points: [
					'Recovered ₹1.8 Cr in duplicate and unclaimed vendor payments through an AP ledger scrub',
					'Migrated the group from Tally to SAP FICO with no reporting downtime',
				],
			},
			{
				role: 'Audit Associate',
				company: 'Kalyan Iyer & Associates',
				location: 'Chennai, India',
				start_date: '2013-06',
				end_date: '2016-06',
				description: 'Executed statutory and internal audits for manufacturing, NBFC, and healthcare clients.',
				key_points: ['Completed 40+ statutory audits across three sectors during articleship and post-qualification'],
			},
		],
		engagements: [
			{
				client_name: 'Wintrex Industries Group',
				engagement_type: 'Statutory Audit',
				industry: 'Manufacturing',
				start_date: '2021-04',
				end_date: '2024-03',
				description: 'Three-year statutory audit of a multi-entity manufacturing group with consolidated reporting under Ind AS.',
				responsibilities: [
					'Planned and executed risk-based audit programmes across four subsidiaries',
					'Reviewed inventory valuation, related-party transactions, and revenue cut-off',
				],
				deliverables: ['Audited consolidated financial statements', 'CARO 2020 report', 'Management letter with 12 control observations'],
				standards_applied: ['Ind AS', 'Companies Act 2013', 'CARO 2020'],
				tools_used: ['SAP FICO', 'Advanced Excel', 'CaseWare'],
				engagement_value: '₹640 Cr consolidated turnover audited',
				measurable_outcomes: ['Zero audit qualifications across three consecutive years', 'Closed 12 of 12 control gaps within one cycle'],
			},
			{
				client_name: 'Tessellate Retail Pvt. Ltd.',
				engagement_type: 'GST & Corporate Tax Compliance',
				industry: 'Retail',
				start_date: '2020-07',
				description: 'End-to-end indirect and direct tax compliance for a 60-store retail chain filing across nine states.',
				responsibilities: ['Monthly GSTR-1/3B filings and annual GSTR-9C reconciliation', 'Advance tax computation and TDS compliance'],
				deliverables: ['108 monthly GST returns filed', 'Annual tax audit report (Form 3CD)'],
				standards_applied: ['GST Act', 'Income Tax Act', 'TDS provisions'],
				tools_used: ['Zoho Books', 'ClearTax', 'Advanced Excel'],
				engagement_value: '₹210 Cr annual turnover',
				measurable_outcomes: ['Zero penalty notices in four years', 'Recovered ₹34 lakh in blocked input tax credit'],
			},
			{
				client_name: 'Aravind Healthcare Trust',
				engagement_type: 'Internal Audit',
				industry: 'Healthcare',
				start_date: '2019-01',
				end_date: '2021-12',
				description: 'Rolling internal audit of procurement, payroll, and grant-utilisation cycles for a multi-site trust.',
				responsibilities: ['Designed the risk register and quarterly audit calendar', 'Tested procurement controls across six locations'],
				deliverables: ['Quarterly internal audit reports', 'Revised procurement SOP'],
				standards_applied: ['Internal Financial Controls (IFC)', 'FCRA'],
				tools_used: ['Tally ERP 9', 'Power BI'],
				engagement_value: '₹90 Cr annual spend reviewed',
				measurable_outcomes: ['Procurement leakage reduced by 22% within two quarters'],
			},
		],
		education: [
			{ degree: 'Chartered Accountancy', field_of_study: 'ICAI', institution: 'Institute of Chartered Accountants of India', location: 'India', start_year: '2010', end_year: '2013', grade_or_score: 'Rank holder — AIR 214' },
			{ degree: 'B.Com', field_of_study: 'Accounting & Finance', institution: 'Christ University', location: 'Bengaluru, India', start_year: '2007', end_year: '2010', grade_or_score: 'Distinction' },
		],
		certifications: [
			{ name: 'Chartered Accountant (CA)', issuer: 'ICAI', year: '2013' },
			{ name: 'Diploma in IFRS', issuer: 'ACCA', year: '2019' },
			{ name: 'Certified Concurrent Auditor', issuer: 'ICAI', year: '2021' },
			{ name: 'SAP FICO Certified Associate', issuer: 'SAP', year: '2022' },
		],
		achievements: [
			{ title: 'Zero Adverse Assessment Orders', description: 'Represented 14 clients across GST and income-tax assessments without a single adverse order.', year: '2024' },
			{ title: '₹1.8 Cr Recovered', description: 'Identified and recovered duplicate and unclaimed vendor payments through a full AP ledger scrub.', year: '2019' },
		],
	};

	const ACCOUNTANT_DOE_CONTENT: PortfolioContent = {
		bio: 'Chartered Accountant with 11+ years across statutory audit, taxation, and group financial reporting. I take businesses from messy ledgers to clean, defensible books — closing faster, filing on time, and standing behind the numbers when the assessment notice arrives.',
		headline: 'Chartered Accountant · Audit · Taxation · Ind AS',
		uniqueValue: 'Clean books are not paperwork — they are the evidence a business can be trusted with someone else’s money.',
	};

	// HR mock data — used when profession is 'hr'
	const HR_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Danielle Okafor',
			headline: 'Head of People & Talent',
			summary: 'People leader who has scaled two companies past 1,000 employees without letting culture, hiring quality, or compliance slip.',
			email: 'danielle.okafor@example.com',
			phone: '+44 7700 900123',
			location: 'London, UK',
			social_links: {
				linkedin: 'https://linkedin.com/in/danielle-okafor',
			},
		},
		skills: [
			{ category: 'Talent Acquisition', skills: ['Executive Search', 'Structured Interviewing', 'Employer Branding', 'Campus Hiring'] },
			{ category: 'People Operations', skills: ['HR Policy Design', 'Onboarding', 'HRIS Migration', 'People Analytics'] },
			{ category: 'Employee Relations', skills: ['Grievance Handling', 'Disciplinary Process', 'Union Negotiation', 'Investigations'] },
			{ category: 'Total Rewards', skills: ['Compensation Benchmarking', 'Equity Plans', 'Benefits Design', 'Pay Equity Review'] },
		],
		software_proficiency: ['Workday', 'SAP SuccessFactors', 'Greenhouse', 'BambooHR', 'Culture Amp', 'Excel'],
		compliance_expertise: ['UK Employment Rights Act', 'TUPE', 'GDPR', 'Equality Act 2010', 'IR35', 'Right to Work Checks'],
		experience: [
			{
				role: 'Head of People & Talent',
				company: 'Northwind Technologies',
				location: 'London, UK',
				start_date: '2021-02',
				is_current: true,
				description: 'Own the people function for a 1,200-person scale-up across five markets, reporting to the CEO.',
				key_points: [
					'Scaled headcount from 380 to 1,200 in three years while cutting regretted attrition from 19% to 8%',
					'Rebuilt the hiring process end to end — time-to-hire down from 54 to 28 days',
					'Led the people workstream for two acquisitions, including TUPE transfer of 140 staff',
				],
			},
			{
				role: 'Senior HR Business Partner',
				company: 'Calderwood Retail Group',
				location: 'Manchester, UK',
				start_date: '2017-05',
				end_date: '2021-01',
				description: 'Partnered with retail operations leadership covering 3,400 employees across 90 sites.',
				key_points: [
					'Cut store-manager turnover by 31% through a targeted retention and progression programme',
					'Handled 60+ complex employee-relations cases with zero tribunal escalations',
				],
			},
			{
				role: 'Talent Acquisition Manager',
				company: 'Brightline Consulting',
				location: 'Birmingham, UK',
				start_date: '2014-08',
				end_date: '2017-04',
				description: 'Built and ran the in-house recruitment function, replacing an agency-led model.',
				key_points: ['Reduced agency spend by £480K annually by taking 85% of hiring in-house'],
			},
		],
		hr_programs: [
			{
				program_name: 'Global Onboarding Revamp',
				program_type: 'Onboarding',
				organization: 'Northwind Technologies',
				start_date: '2022-01',
				end_date: '2022-09',
				description: 'Replaced a fragmented, country-by-country onboarding process with a single 90-day journey covering every market.',
				scope: '1,200 employees across 5 countries',
				activities: [
					'Mapped the existing onboarding experience across all five markets',
					'Built a 90-day structured plan with manager checkpoints at day 7, 30 and 90',
					'Automated provisioning and paperwork through Workday',
				],
				tools_used: ['Workday', 'Culture Amp', 'Notion'],
				measurable_outcomes: ['New-hire 90-day attrition down from 14% to 4%', 'Time-to-productivity shortened by 3 weeks', 'Onboarding satisfaction 4.6/5'],
			},
			{
				program_name: 'Inclusive Hiring Programme',
				program_type: 'Diversity & Inclusion',
				organization: 'Northwind Technologies',
				start_date: '2021-06',
				end_date: '2023-06',
				description: 'Structured-interview rollout and sourcing overhaul aimed at widening the senior-hire pipeline.',
				scope: 'All engineering and commercial hiring, 5 markets',
				activities: [
					'Trained 140 interviewers on structured, evidence-based interviewing',
					'Introduced anonymised CV screening for first-round review',
					'Set quarterly pipeline targets reported to the board',
				],
				tools_used: ['Greenhouse', 'Applied', 'Culture Amp'],
				measurable_outcomes: ['Women in senior roles up from 18% to 34%', 'Interview-to-offer consistency up 41%'],
			},
			{
				program_name: 'Workday HRIS Implementation',
				program_type: 'HRIS Implementation',
				organization: 'Northwind Technologies',
				start_date: '2021-03',
				end_date: '2021-12',
				description: 'Migrated five disconnected country HR systems onto a single Workday tenant.',
				scope: '5 legal entities, 900 employee records',
				activities: ['Ran data cleansing and mapping across five source systems', 'Designed approval workflows and role-based access', 'Trained 60 managers on self-service'],
				tools_used: ['Workday', 'Excel'],
				measurable_outcomes: ['Payroll error rate down 76%', 'Manual HR admin reduced by 22 hours per week'],
			},
			{
				program_name: 'Manager Essentials Academy',
				program_type: 'Learning & Development',
				organization: 'Calderwood Retail Group',
				start_date: '2018-09',
				end_date: '2020-12',
				description: 'A six-module leadership curriculum for first-time store managers.',
				scope: '210 managers across 90 sites',
				activities: ['Designed six modules with an external L&D partner', 'Ran 34 cohorts and a peer-coaching circle'],
				tools_used: ['SAP SuccessFactors', 'Kahoot'],
				measurable_outcomes: ['Store-manager turnover down 31%', 'Internal promotion rate up from 22% to 47%'],
			},
		],
		education: [
			{ degree: 'MSc', field_of_study: 'Human Resource Management', institution: 'London School of Economics', location: 'London, UK', start_year: '2012', end_year: '2013', grade_or_score: 'Distinction' },
			{ degree: 'BA (Hons)', field_of_study: 'Psychology', institution: 'University of Bristol', location: 'Bristol, UK', start_year: '2009', end_year: '2012', grade_or_score: 'First Class' },
		],
		certifications: [
			{ name: 'Chartered MCIPD', issuer: 'CIPD', year: '2018' },
			{ name: 'SHRM-SCP', issuer: 'SHRM', year: '2021' },
			{ name: 'Workday HCM Fundamentals', issuer: 'Workday', year: '2021' },
		],
		achievements: [
			{ title: 'HR Team of the Year', description: 'Recognised at the UK People Awards for the onboarding and retention turnaround.', year: '2023' },
			{ title: 'Zero Tribunal Escalations', description: 'Handled 60+ complex employee-relations cases without a single tribunal claim.', year: '2020' },
		],
	};

	const HR_DOE_CONTENT: PortfolioContent = {
		bio: 'People leader with 11+ years across talent acquisition, employee relations, and people operations. I have scaled two companies past 1,000 employees — building hiring processes that hold up under pressure, and the policies, systems, and managers to keep those people once they arrive.',
		headline: 'Head of People & Talent · Scaling · Employee Relations',
		uniqueValue: 'Hiring well is only half the job — I build the systems that make people want to stay.',
	};

	// Sales mock data — used when profession is 'sales'
	const SALES_DOE_PARSED: ParsedData = {
		profile: {
			full_name: 'Rhys Calloway',
			headline: 'Enterprise Account Executive',
			summary: 'Enterprise SaaS seller who turns long, multi-stakeholder pipelines into signed, expanding revenue.',
			email: 'rhys.calloway@example.com',
			phone: '+971 50 123 4567',
			location: 'Dubai, UAE',
			social_links: {
				linkedin: 'https://linkedin.com/in/rhys-calloway',
			},
		},
		skills: [
			{ category: 'Sales Methodology', skills: ['Enterprise Sales', 'Solution Selling', 'Consultative Selling', 'Negotiation', 'Closing'] },
			{ category: 'Pipeline & Accounts', skills: ['Prospecting', 'Lead Generation', 'Account Management', 'Territory Planning', 'Upsell & Cross-sell'] },
			{ category: 'Revenue Operations', skills: ['Sales Forecasting', 'Pipeline Hygiene', 'Deal Desk Review', 'Win/Loss Analysis'] },
		],
		sales_methodologies: ['MEDDIC', 'MEDDPICC', 'SPIN Selling', 'Challenger', 'Sandler', 'Value Selling', 'Account-Based Selling'],
		software_proficiency: ['Salesforce', 'HubSpot CRM', 'Outreach', 'Gong', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Clari', 'Excel'],
		experience: [
			{
				role: 'Senior Account Executive',
				company: 'Northwind Cloud',
				location: 'Dubai, UAE',
				start_date: '2022-03',
				is_current: true,
				territory: 'MENA — Mid-Market Logistics',
				quota_attainment: '142% of $2.2M ARR quota (FY25)',
				description: 'Own the full enterprise cycle for MENA logistics accounts, from first outreach through multi-year renewal. Rebuilt the region’s outbound motion after a flat prior year.',
				key_points: [
					'Sold a supply-chain visibility platform into 40+ mid-market logistics operators',
					'Ran quarterly territory planning and built the region’s first structured forecast',
					'Promoted after exceeding quota four consecutive quarters',
				],
			},
			{
				role: 'Account Executive',
				company: 'Fintra Systems',
				location: 'Dubai, UAE',
				start_date: '2019-01',
				end_date: '2022-02',
				territory: 'GCC — Banking & Fintech',
				quota_attainment: '118% average attainment across 3 years',
				description: 'Carried a full-cycle quota selling payments infrastructure to banks and fintech challengers across the Gulf.',
				key_points: [
					'Closed the company’s largest single contract to date at $610K ACV',
					'Built a repeatable demo-to-close playbook adopted company-wide',
				],
			},
			{
				role: 'Sales Development Representative',
				company: 'Brightline Software',
				location: 'Dubai, UAE',
				start_date: '2017-06',
				end_date: '2018-12',
				territory: 'GCC — Outbound',
				description: 'Generated qualified enterprise pipeline for a three-person AE team.',
				key_points: ['Booked 220+ qualified meetings and sourced $3.4M in pipeline over 18 months'],
			},
		],
		deals: [
			{
				client_name: 'Meridian Freight',
				deal_type: 'New Business → Expansion',
				industry: 'Logistics',
				start_date: '2022-06',
				end_date: '2023-01',
				description: 'Landed a flagship freight operator through a phased pilot-to-platform motion, then expanded it across the group.',
				products_sold: ['Supply Chain Visibility Platform', 'Carrier API', 'Analytics Add-on'],
				deal_value: '$890K ARR',
				sales_cycle_length: '7 months',
				stakeholders_engaged: ['COO', 'Head of Operations', 'IT Director', 'Procurement'],
				responsibilities: [
					'Ran discovery across four operating hubs to size the manual-tracking cost',
					'Built the business case with finance and secured executive sponsorship',
					'Negotiated a three-year term with a phased rollout schedule',
				],
				measurable_outcomes: [
					'Expanded from a single-site pilot to 14 hubs within the first contract year',
					'Grew the account 3x in 18 months',
					'Became the regional reference account for logistics',
				],
			},
			{
				client_name: 'Vantra Bank',
				deal_type: 'Channel / Partner',
				industry: 'Fintech',
				start_date: '2021-02',
				end_date: '2021-10',
				description: 'Built a reseller channel with two regional integrators, opening a pipeline lane outside direct outbound.',
				products_sold: ['Payments Infrastructure', 'Partner Enablement Package'],
				deal_value: '$610K ACV',
				sales_cycle_length: '8 months',
				stakeholders_engaged: ['CFO', 'Head of Digital', 'Compliance', 'Legal'],
				responsibilities: [
					'Navigated a lengthy procurement and compliance review',
					'Ran partner enablement and a joint co-sell motion',
				],
				measurable_outcomes: [
					'Sourced 14 new opportunities in the first quarter after launch',
					'Channel now accounts for 18% of regional pipeline',
				],
			},
			{
				client_name: 'Al Noor Health',
				deal_type: 'Enterprise — New Business',
				industry: 'Healthtech',
				start_date: '2023-04',
				end_date: '2023-11',
				description: 'Phased rollout across six hospital sites, moving from a departmental pilot to an enterprise-wide licence.',
				products_sold: ['Clinical Workflow Suite', 'Integration Services'],
				deal_value: '$1.2M TCV',
				sales_cycle_length: '7 months',
				stakeholders_engaged: ['CMO', 'CIO', 'Head of Nursing', 'Procurement'],
				responsibilities: [
					'Champion-led pilot expanded to full committee sign-off',
					'Coordinated a solutions engineer and clinical reference calls',
				],
				measurable_outcomes: ['Expanded from 1 to 6 sites inside the contract year', 'Renewed at 120% net revenue retention'],
			},
		],
		education: [
			{ degree: 'B.A.', field_of_study: 'Business Administration', institution: 'American University of Dubai', location: 'Dubai, UAE', start_year: '2013', end_year: '2017', grade_or_score: 'GPA 3.6' },
		],
		certifications: [
			{ name: 'Salesforce Sales Cloud Consultant', issuer: 'Salesforce', year: '2024' },
			{ name: 'Certified Professional Sales Person (CPSP)', issuer: 'NASP', year: '2022' },
			{ name: 'Challenger Selling Certification', issuer: 'Challenger Inc.', year: '2021' },
		],
		achievements: [
			{ title: "President's Club", description: 'Top 5% of the global sales organisation by quota attainment and revenue growth.', year: '2025' },
			{ title: 'Deal of the Year', description: 'Largest single contract signed in the region that fiscal year.', year: '2023' },
			{ title: 'Rookie of the Year', description: 'Fastest ramp to full quota in company history at the time.', year: '2019' },
		],
	};

	const SALES_DOE_CONTENT: PortfolioContent = {
		bio: 'Enterprise seller with 9+ years closing six and seven-figure B2B contracts across fintech, logistics and healthtech. I build trust early, quantify value relentlessly, and run a forecast my VP can take to the board without flinching.',
		headline: 'Enterprise SaaS sales leader turning long, complex pipelines into signed, expanding revenue',
		uniqueValue: 'A closed deal is the easy part — I build the accounts that renew, expand, and refer.',
	};

	// Derived: templates visible for the selected profession.
	// Free ones are floated to the front so a free user's first impression — and
	// the carousel's index-0 default — is always something they can actually use.
	// Order within each tier is preserved.
	const currentTemplates = $derived(
		sortFreeFirst(
			TEMPLATES_BY_PROFESSION[selectedTypeId as string] ??
				TEMPLATES_BY_PROFESSION['software_engineer'],
			(t) => t.id,
			$freeTemplateIds
		)
	);

	/** True when the carousel's current slide is not on the caller's plan. */
	const currentIsLocked = $derived(
		$templatesRestricted &&
			!isFreeTemplate(currentTemplates[carouselIndex]?.id ?? '', $freeTemplateIds)
	);

	// Derived: mock data for the selected profession
	const mockParsed = $derived(
		selectedTypeId === 'designer'            ? DESIGNER_DOE_PARSED   :
		selectedTypeId === 'marketing'           ? MARKETER_DOE_PARSED   :
		selectedTypeId === 'civil_engineer'      ? CIVIL_DOE_PARSED      :
		selectedTypeId === 'mechanical_engineer' ? MECH_DOE_PARSED       :
		selectedTypeId === 'accountant'          ? ACCOUNTANT_DOE_PARSED :
		selectedTypeId === 'hr'                  ? HR_DOE_PARSED         :
		selectedTypeId === 'sales'               ? SALES_DOE_PARSED      :
		selectedTypeId === 'finance'             ? FINANCE_DOE_PARSED    : JOHN_DOE_PARSED
	);
	const mockContent = $derived(
		selectedTypeId === 'designer'            ? DESIGNER_DOE_CONTENT   :
		selectedTypeId === 'marketing'           ? MARKETER_DOE_CONTENT   :
		selectedTypeId === 'civil_engineer'      ? CIVIL_DOE_CONTENT      :
		selectedTypeId === 'mechanical_engineer' ? MECH_DOE_CONTENT       :
		selectedTypeId === 'accountant'          ? ACCOUNTANT_DOE_CONTENT :
		selectedTypeId === 'hr'                  ? HR_DOE_CONTENT         :
		selectedTypeId === 'sales'               ? SALES_DOE_CONTENT      :
		selectedTypeId === 'finance'             ? FINANCE_DOE_CONTENT    : JOHN_DOE_CONTENT
	);

	// Reactive preview — re-renders whenever profession or carousel index changes
	const previewScale  = $derived(containerWidth / 1280);
	const previewHeight = $derived(Math.round(900 * previewScale));
	const currentHtml   = $derived(
		// Inject no-scrollbar CSS so the preview is scroll-functional but visually clean
		renderPortfolio(
			currentTemplates[carouselIndex]?.id,
			mockParsed,
			mockContent,
			(selectedTypeId as string) || 'software_engineer',
			undefined,
			undefined,
			undefined,
			undefined,
			true   // publishMode — strips editor chrome
		).replace(
			'</head>',
			'<style>::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important;-ms-overflow-style:none!important}</style></head>'
		)
	);

	const stepLabels = ['File', 'Role', 'Theme'];

	// A resume picked on the landing page (upload dock) before the guest session
	// existed. Consume it here so the wizard opens with the file already staged
	// and goes straight into analysis instead of asking for it a second time.
	onMount(() => {
		const handedOff = takePendingUpload();
		if (!handedOff) return;
		setFile(handedOff);
		if (selectedFile) void beginAnalysis();
	});

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) setFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) setFile(file);
	}

	function setFile(file: File) {
		errorMessage = '';
		if (!isSupportedFileType(file)) {
			errorMessage = 'Unsupported file type. Please upload a PDF or DOC/DOCX file.';
			return;
		}
		selectedFile = file;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	// Indicator step (File / Role / Theme). 'analyzing' still counts as File.
	const indicatorStep = $derived(phase === 'template' ? 3 : phase === 'profession' ? 2 : 1);

	const validProfessionIds = portfolioTypes.map((p) => p.id);
	const detectedLabel = $derived(
		portfolioTypes.find((p) => p.id === selectedTypeId)?.label ?? ''
	);
	const predictedLabel = $derived(
		portfolioTypes.find((p) => p.id === predictedTypeId)?.label ?? ''
	);

	function goNext() {
		if (phase === 'file' && selectedFile) {
			void beginAnalysis();
		} else if (phase === 'profession' && selectedTypeId) {
			carouselIndex = 0; // reset carousel when entering the template screen
			phase = 'template';
		}
	}

	function goBack() {
		if (phase === 'profession') {
			// Returning to the file screen abandons the in-flight upload — cancel it
			// (fire-and-forget) so it doesn't keep consuming the user's upload quota.
			stopPoll?.();
			clearAnalyzeTimeout();
			if (uploadId) {
				fetch(`/api/resume/status/${encodeURIComponent(uploadId)}`, { method: 'DELETE' }).catch(() => {});
			}
			uploadId = null;
			predictedTypeId = '';
			selectedTypeId = '';
			autoSkipped = false;
			phase = 'file';
		} else if (phase === 'template') {
			// Back reveals the profession screen (with the detected option shown)
			// so the user can change it. Once seen, it's no longer "auto-skipped".
			autoSkipped = false;
			phase = 'profession';
		}
	}

	// ── Upload + analyze bridge ──────────────────────────────────────────────────
	// Safety net: the analyzing statuses (EXTRACTING_TEXT etc.) have no backend
	// stale-detection, so if ingestion dies the poll would spin forever. Bail out
	// with an error after this long.
	const ANALYZE_TIMEOUT_MS = 90_000;
	let analyzeTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function clearAnalyzeTimeout() {
		if (analyzeTimeoutId !== null) {
			clearTimeout(analyzeTimeoutId);
			analyzeTimeoutId = null;
		}
	}

	async function beginAnalysis() {
		if (!selectedFile) return;
		phase = 'analyzing';
		analyzeStatus = 'PENDING_UPLOAD';
		analyzeMessage = null;
		analyzeAllDone = false;
		analyzeError = null;
		errorMessage = '';

		const result = await startUpload(selectedFile);
		if (result.limitError) {
			// The portfolio cap is enforced at presign, so this is where a free
			// user who already has a portfolio actually gets stopped — before any
			// file leaves the browser. Go back to the file step and offer the
			// upgrade rather than stranding them on the "analyzing" screen with a
			// raw error.
			phase = 'file';
			entitlements.syncFromLimitError(result.limitError);
			limitError = result.limitError;
			return;
		}
		if (!result.success || !result.uploadId) {
			analyzeError = result.error ?? 'Upload failed. Please try again.';
			return;
		}
		uploadId = result.uploadId;

		clearAnalyzeTimeout();
		analyzeTimeoutId = setTimeout(() => {
			if (phase === 'analyzing' && !analyzeError) {
				stopPoll?.();
				analyzeError = 'This is taking longer than expected. Please try again.';
			}
		}, ANALYZE_TIMEOUT_MS);

		stopPoll?.();
		stopPoll = startPolling(uploadId, {
			onStatus(data: StatusResponse) {
				if (data.status === 'AWAITING_SELECTION') {
					stopPoll?.();
					clearAnalyzeTimeout();
					onDetected(data);
					return;
				}
				analyzeStatus = data.status;
				analyzeMessage = data.message;
			},
			onComplete(data: StatusResponse) {
				// A terminal state before selection is always a failure here.
				clearAnalyzeTimeout();
				analyzeError = data.failureReason ?? 'We could not read that resume. Please try another file.';
			},
			onError() {
				clearAnalyzeTimeout();
				analyzeError = 'Connection lost. Please check your network and try again.';
			}
		});
	}

	function onDetected(data: StatusResponse) {
		const predicted = data.predictedProfession ?? null;
		const confidence = data.predictedConfidence ?? 0;
		const isKnown = !!predicted && validProfessionIds.includes(predicted as ResumeCategory);
		predictedTypeId = isKnown ? (predicted as ResumeCategory) : '';

		// Finish the bridge animation (step 3 check-pop) before branching.
		analyzeStatus = 'AWAITING_SELECTION';
		analyzeMessage = isKnown
			? `Looks like ${portfolioTypes.find((p) => p.id === predicted)?.label}.`
			: null;

		setTimeout(() => {
			analyzeAllDone = true;
			setTimeout(() => {
				// ≥HIGH confidence → skip the profession screen (every profession,
				// finance included, now has dedicated templates).
				if (isKnown && confidence >= HIGH_CONFIDENCE) {
					selectedTypeId = predicted as ResumeCategory;
					autoSkipped = true;
					carouselIndex = 0;
					phase = 'template';
				} else if (isKnown && confidence >= LOW_CONFIDENCE) {
					// Pre-select on the visible profession screen.
					selectedTypeId = predicted as ResumeCategory;
					autoSkipped = false;
					phase = 'profession';
				} else {
					// Unsure — let the user choose.
					selectedTypeId = '';
					autoSkipped = false;
					phase = 'profession';
				}
			}, 550);
		}, 700);
	}

	function retryAnalysis() {
		clearAnalyzeTimeout();
		analyzeError = null;
		phase = 'file';
	}

	function prevTemplate() {
		carouselIndex = (carouselIndex - 1 + currentTemplates.length) % currentTemplates.length;
	}

	function nextTemplate() {
		carouselIndex = (carouselIndex + 1) % currentTemplates.length;
	}

	// ── Resume the pipeline (queue AI processing) ────────────────────────────────
	async function generate(templateId: string) {
		if (!uploadId || !selectedTypeId) return;

		uploadStatus = 'uploading';
		errorMessage = '';

		const result = await startGeneration(uploadId, selectedTypeId as ResumeCategory, templateId);
		if (result.success) {
			goto(`/app/resumes/${uploadId}/processing`);
		} else if (result.limitError) {
			// Plan limit, not a failure — show the upgrade path instead of an error
			// banner, and correct the local usage from the server's own numbers.
			uploadStatus = 'idle';
			entitlements.syncFromLimitError(result.limitError);
			limitError = result.limitError;
		} else {
			uploadStatus = 'error';
			errorMessage = result.error ?? 'Could not start generation. Please try again.';
		}
	}

	function handleUpload() {
		const templateId = currentTemplates[carouselIndex]?.id ?? 'neon';
		// Client-side shortcut so a locked theme never costs a round trip. The
		// backend enforces this independently — this is purely for responsiveness.
		if (currentIsLocked) {
			limitError = {
				error: 'That template is available on the paid plan.',
				code: 'LIMIT_EXCEEDED',
				limit: {
					name: 'templates',
					label: 'premium templates',
					plan: $entitlements.data.plan,
					limit: 'free_only',
					templateId,
					resetsAt: null
				},
				upgradeTo: 'pro'
			};
			return;
		}
		void generate(templateId);
	}

	onDestroy(() => {
		stopPoll?.();
		clearAnalyzeTimeout();
	});
</script>

<svelte:head>
	<title>Upload Resume — Portfolio.ai</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-subtle">
	<BreadcrumbHeader title="Upload" />

	<main class="mx-auto w-full max-w-2xl flex-1 px-6 py-8 sm:py-16">
		<div class="mb-10 text-center">
			<h1 class="font-display text-4xl font-bold text-ink" style="letter-spacing:-0.02em">Build your portfolio</h1>
			<p class="mt-3 text-lg text-ink-soft">Upload your resume, pick a role and a theme.</p>
		</div>

		<!-- Step indicator -->
		<div class="mb-10 flex items-center justify-center gap-4">
			{#each stepLabels as label, i}
				{@const step = i + 1}
				{@const isActive = indicatorStep === step}
				{@const isDone = indicatorStep > step}
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 {isDone || isActive
								? 'bg-brand text-white shadow-md'
								: 'bg-surface-muted text-ink-muted border border-surface-muted'}"
						>
							{#if isDone}
								<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							{:else}
								{step}
							{/if}
						</div>
						<span class="text-sm font-bold hidden sm:block {isActive || isDone ? 'text-ink' : 'text-ink-muted'}">{label}</span>
					</div>
					{#if i < stepLabels.length - 1}
						<div class="h-px w-8 sm:w-16 {indicatorStep > step ? 'bg-brand' : 'bg-surface-muted'}"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Wizard card -->
		<div class="overflow-hidden rounded-[2rem] border border-surface-muted bg-white p-8 sm:p-10 shadow-xl">
			{#if phase === 'file'}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-6" style="letter-spacing:-0.02em">Upload your resume</h2>
					<div
						role={selectedFile ? undefined : 'button'}
						tabindex={selectedFile ? undefined : 0}
						aria-label={selectedFile ? undefined : 'Upload resume — click or drag and drop a PDF or DOCX file'}
						class="rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-200 {isDragOver ? 'border-brand bg-brand/5' : selectedFile ? 'border-surface-muted bg-white' : 'cursor-pointer border-surface-muted bg-surface-subtle hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30'}"
						ondrop={handleDrop}
						ondragover={handleDragOver}
						ondragleave={handleDragLeave}
						onclick={() => { if (!selectedFile) document.getElementById('file-input')?.click(); }}
						onkeydown={(e) => { if (!selectedFile && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); document.getElementById('file-input')?.click(); } }}
					>
						<input id="file-input" type="file" accept=".pdf,.doc,.docx" class="hidden" onchange={handleFileSelect} aria-label="Choose resume file" />
						{#if selectedFile}
							<div class="flex flex-col items-center gap-3">
								<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-brand/10 text-brand border border-brand/20">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
								</div>
								<div>
									<p class="font-bold text-ink">{selectedFile.name}</p>
									<p class="mt-1 text-sm text-ink-soft">{formatFileSize(selectedFile.size)}</p>
								</div>
								<button type="button" class="mt-2 min-h-[44px] px-4 text-xs font-bold text-ink-soft hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-lg" onclick={(e) => { e.stopPropagation(); selectedFile = null; errorMessage = ''; }}>Change file</button>
							</div>
						{:else}
							<div class="flex flex-col items-center gap-3">
								<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-muted text-ink-muted border border-surface-muted transition-colors {isDragOver ? 'bg-brand/10 text-brand border-brand/20' : ''}">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
								</div>
								<div>
									<p class="font-bold text-ink">Drop your resume here</p>
									<p class="mt-1 text-sm text-ink-soft">or click to browse (PDF, DOCX)</p>
								</div>
							</div>
						{/if}
					</div>

					{#if errorMessage}
						<div id="upload-error" role="alert" aria-live="assertive" class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</div>
					{/if}

					<button onclick={goNext} disabled={!selectedFile} class="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
						Continue
					</button>
				</div>
			{:else if phase === 'analyzing'}
				{#if analyzeError}
					<div in:fade={{ duration: 250 }} class="text-center">
						<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-8 w-8 text-red-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
							</svg>
						</div>
						<h2 class="mt-5 font-display text-2xl font-bold text-ink" style="letter-spacing:-0.02em">We couldn't read that resume</h2>
						<p class="mt-3 text-sm text-ink-soft">{analyzeError}</p>
						<button onclick={retryAnalysis} class="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-dark active:scale-95">
							Try again
						</button>
					</div>
				{:else}
					<div in:fade={{ duration: 200 }}>
						<div class="mb-8 text-center">
							<p class="text-xs font-bold tracking-widest text-ink-muted uppercase">Analyzing</p>
							<h2 class="mt-2 font-display text-2xl font-bold text-ink" style="letter-spacing:-0.02em">Reading your resume…</h2>
							<p class="mt-2 text-sm text-ink-soft">We're detecting your profession so you can skip ahead.</p>
						</div>
						<ProcessingSteps steps={ANALYZE_STEPS} status={analyzeStatus} message={analyzeMessage} allDone={analyzeAllDone} />
					</div>
				{/if}
			{:else if phase === 'profession'}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-2" style="letter-spacing:-0.02em">What's your field?</h2>
					{#if predictedTypeId}
						<p class="mb-6 text-ink-soft">We detected <span class="font-bold text-ink">{predictedLabel}</span> from your resume — confirm or pick another.</p>
					{:else}
						<p class="mb-6 text-ink-soft">We couldn't tell for sure — pick the field that fits you best.</p>
					{/if}

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{#each portfolioTypes as ptype}
							<button onclick={() => (selectedTypeId = ptype.id)} class="relative flex flex-col items-start gap-1 rounded-2xl border-2 p-5 text-left transition-all duration-200 {selectedTypeId === ptype.id ? 'border-brand bg-brand/5 shadow-sm' : 'border-surface-muted bg-white hover:border-brand/30'}">
								{#if predictedTypeId === ptype.id}
									<span class="absolute right-3 top-3 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">Detected</span>
								{/if}
								<p class="font-bold text-ink">{ptype.label}</p>
								<p class="text-sm text-ink-soft">{ptype.description}</p>
							</button>
						{/each}
					</div>

					<div class="mt-8 flex gap-4">
						<button onclick={goBack} class="flex items-center justify-center rounded-xl bg-surface-subtle px-6 py-4 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink">Back</button>
						<button onclick={goNext} disabled={!selectedTypeId} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-50">Continue</button>
					</div>
				</div>
			{:else if phase === 'template'}
				<div>
					<h2 class="font-display text-2xl font-bold text-ink mb-1" style="letter-spacing:-0.02em">Choose a theme</h2>
					<p class="mb-3 text-ink-soft">See how your portfolio could look — you can change it later.</p>

					{#if autoSkipped && detectedLabel}
						<div class="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-4 py-2.5 text-sm">
							<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 text-brand"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							<span class="text-ink-soft">Auto-detected field:</span>
							<span class="font-bold text-ink">{detectedLabel}</span>
							<button onclick={goBack} class="ml-auto font-bold text-brand hover:underline">Change</button>
						</div>
					{/if}

					<!-- Carousel -->
					<div class="relative">
						<!-- Full-width iframe preview -->
						<div
							bind:clientWidth={containerWidth}
							class="overflow-hidden rounded-2xl border border-surface-muted shadow-sm"
							style="height: {previewHeight}px;"
						>
							<iframe
								title="Template preview — {currentTemplates[carouselIndex]?.name}"
								srcdoc={currentHtml}
								style="width: 1280px; height: 900px; border: none; transform: scale({previewScale}); transform-origin: top left; display: block;"
							></iframe>
						</div>

						<!-- Left arrow (overlaid) -->
						<button
							onclick={prevTemplate}
							aria-label="Previous template"
							class="absolute left-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white active:scale-90"
						>
							<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5 text-ink">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
							</svg>
						</button>

						<!-- Right arrow (overlaid) -->
						<button
							onclick={nextTemplate}
							aria-label="Next template"
							class="absolute right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white active:scale-90"
						>
							<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5 text-ink">
								<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
							</svg>
						</button>
					</div>

					<!-- Template name + tag -->
					<div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
						<span class="font-bold text-ink">{currentTemplates[carouselIndex]?.name}</span>
						<span class="rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">{currentTemplates[carouselIndex]?.tag}</span>
						{#if currentIsLocked}
							<span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
								<svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3" aria-hidden="true"><path d="M9.5 1.5a.75.75 0 0 1 1 0l2.2 4.46 4.92.72a.75.75 0 0 1 .42 1.28l-3.56 3.47.84 4.9a.75.75 0 0 1-1.09.79L10 14.8l-4.4 2.32a.75.75 0 0 1-1.09-.79l.84-4.9L1.8 7.96a.75.75 0 0 1 .42-1.28l4.92-.72L9.5 1.5Z"/></svg>
								Pro
							</span>
						{/if}
					</div>

					<!-- Dot indicators — a star marks themes that need an upgrade -->
					<div class="mt-3 flex items-center justify-center gap-1.5">
						{#each currentTemplates as t, i}
							{@const locked = $templatesRestricted && !isFreeTemplate(t.id, $freeTemplateIds)}
							<button
								onclick={() => (carouselIndex = i)}
								aria-label="Select template {t.name}{locked ? ' (paid plan)' : ''}"
								class="rounded-full transition-all duration-200 {i === carouselIndex
									? locked
										? 'h-2 w-5 bg-amber-500'
										: 'h-2 w-5 bg-brand'
									: locked
										? 'h-2 w-2 bg-amber-200 hover:bg-amber-400'
										: 'h-2 w-2 bg-surface-muted hover:bg-ink-muted'}"
							></button>
						{/each}
					</div>

					<!-- Counter -->
					<p class="mt-2 text-center text-xs text-ink-muted">{carouselIndex + 1} of {currentTemplates.length}</p>

					{#if uploadStatus === 'uploading'}
						<div class="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-ink-soft">
							<svg class="h-4 w-4 animate-spin text-brand" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
							Starting your portfolio…
						</div>
					{/if}

					{#if errorMessage}
						<div class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{errorMessage}</div>
					{/if}

					{#if uploadStatus !== 'uploading'}
						<div class="mt-6 flex gap-4">
							<button onclick={goBack} class="flex items-center justify-center rounded-xl bg-surface-subtle px-6 py-4 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink">Back</button>
							{#if currentIsLocked}
								<!-- Still clickable: it opens the upgrade modal. A disabled button
								     would leave the user with no explanation of why. -->
								<button onclick={handleUpload} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-amber-600 active:scale-95">
									<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M5 9V6a5 5 0 0 1 10 0v3h.5a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 15.5 18h-11A1.5 1.5 0 0 1 3 16.5v-6A1.5 1.5 0 0 1 4.5 9H5Zm2-3a3 3 0 0 1 6 0v3H7V6Z"/></svg>
									Unlock "{currentTemplates[carouselIndex]?.name}"
								</button>
							{:else}
								<button onclick={handleUpload} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95">
									Select "{currentTemplates[carouselIndex]?.name}" & Generate
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>
</div>

<!-- Single modal for every plan limit this page can hit: the portfolio cap at
     presign/start-generation, and locked themes in the carousel. -->
<UpgradeModal bind:limitError />
