<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { startUpload, startGeneration, isSupportedFileType, type ResumeCategory } from '$lib/services/upload';
	import { startPolling, type StatusResponse } from '$lib/services/resumeStatus';
	import BreadcrumbHeader from '$lib/components/common/BreadcrumbHeader.svelte';
	import ProcessingSteps from '$lib/components/common/ProcessingSteps.svelte';
	import { renderPortfolio } from '$lib/templates';
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
				'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z'
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
		{ id: 'mechanical_engineer', label: 'Mechanical Engineer', description: 'Design, thermal & manufacturing' }
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

	// Derived: templates visible for the selected profession
	const currentTemplates = $derived(
		TEMPLATES_BY_PROFESSION[selectedTypeId as string] ?? TEMPLATES_BY_PROFESSION['software_engineer']
	);

	// Derived: mock data for the selected profession
	const mockParsed = $derived(
		selectedTypeId === 'designer'            ? DESIGNER_DOE_PARSED  :
		selectedTypeId === 'marketing'           ? MARKETER_DOE_PARSED  :
		selectedTypeId === 'civil_engineer'      ? CIVIL_DOE_PARSED     :
		selectedTypeId === 'mechanical_engineer' ? MECH_DOE_PARSED      :
		selectedTypeId === 'finance'             ? FINANCE_DOE_PARSED   : JOHN_DOE_PARSED
	);
	const mockContent = $derived(
		selectedTypeId === 'designer'            ? DESIGNER_DOE_CONTENT  :
		selectedTypeId === 'marketing'           ? MARKETER_DOE_CONTENT  :
		selectedTypeId === 'civil_engineer'      ? CIVIL_DOE_CONTENT     :
		selectedTypeId === 'mechanical_engineer' ? MECH_DOE_CONTENT      :
		selectedTypeId === 'finance'             ? FINANCE_DOE_CONTENT   : JOHN_DOE_CONTENT
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
		} else {
			uploadStatus = 'error';
			errorMessage = result.error ?? 'Could not start generation. Please try again.';
		}
	}

	function handleUpload() {
		const templateId = currentTemplates[carouselIndex]?.id ?? 'neon';
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
					<div class="mt-4 text-center">
						<span class="font-bold text-ink">{currentTemplates[carouselIndex]?.name}</span>
						<span class="ml-2 rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">{currentTemplates[carouselIndex]?.tag}</span>
					</div>

					<!-- Dot indicators -->
					<div class="mt-3 flex items-center justify-center gap-1.5">
						{#each currentTemplates as _, i}
							<button
								onclick={() => (carouselIndex = i)}
								aria-label="Select template {currentTemplates[i].name}"
								class="rounded-full transition-all duration-200 {i === carouselIndex ? 'w-5 h-2 bg-brand' : 'w-2 h-2 bg-surface-muted hover:bg-ink-muted'}"
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
							<button onclick={handleUpload} class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-brand-dark active:scale-95">
								Select "{currentTemplates[carouselIndex]?.name}" & Generate
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>
</div>
