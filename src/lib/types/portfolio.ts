export interface AnalyticsTimeline {
	date: string; // 'YYYY-MM-DD'
	views: number;
}

export interface PortfolioAnalytics {
	totalViews: number;
	last7Days: number;
	last30Days: number;
	byCountry: Record<string, number>;
	bySource: Record<string, number>;
	byDevice: Record<string, number>;
	timeline: AnalyticsTimeline[];
	uniqueVisitors?: number;
	avgTtfb?: number | null;
	cacheHitRate?: number;
	byHour?: Record<number, number>;
	byDayOfWeek?: Record<string, number>;
	byVersion?: Record<string, number>;
	bestTimeToShare?: { hour: number; dayOfWeek: string | null } | null;
}

// Scalar fields in portfolioContent
export type EditableField = 'bio' | 'headline' | 'uniqueValue';

export interface PortfolioContent {
	bio: string;
	headline: string;
	uniqueValue: string;
}

// ParsedData section item types (all categories)

export interface SkillGroup {
	category: string;
	skills: string[];
}

export interface ExperienceItem {
	role?: string;
	company?: string;
	location?: string;
	start_date?: string;
	end_date?: string;
	is_current?: boolean;
	description?: string;
	key_points?: string[];
	channels_managed?: string[];
	financial_metrics_managed?: string[];
	images?: string[];
}

export interface ProjectItem {
	title?: string;
	description?: string;
	tech_stack?: string[];
	github_repo?: string;
	project_url?: string;
	responsibilities?: string[];
	measurable_outcomes?: string[];
	project_category?: string;
	design_concept?: string;
	software_used?: string[];
	images?: string[];
}

export interface EducationItem {
	degree?: string;
	field_of_study?: string;
	institution?: string;
	location?: string;
	start_year?: string;
	end_year?: string;
	grade_or_score?: string;
}

export interface CertificationItem {
	name?: string;
	issuer?: string;
	year?: string;
	certification_url?: string;
}

export interface AchievementItem {
	title?: string;
	description?: string;
	year?: string;
	achievement_url?: string;
}

export interface AwardItem {
	title?: string;
	awarding_body?: string;
	year?: string;
	award_url?: string;
}

export interface CampaignItem {
	campaign_name?: string;
	campaign_type?: string;
	channels_used?: string[];
	budget?: string;
	performance_metrics?: string[];
}

export interface FinancialModelItem {
	model_type?: string;
	tools_used?: string[];
	outcome?: string;
}

export interface InvestmentPortfolioItem {
	portfolio_type?: string;
	assets_under_management?: string;
	performance_return?: string;
}

export interface CustomSectionItem {
	label?: string;
	value?: string;
	subtitle?: string;
	tags?: string[];
	url?: string;
}

export interface CustomSection {
	section_id: string;
	title: string;
	display_type: 'cards' | 'list' | 'timeline';
	items: CustomSectionItem[];
}

export interface ParsedData {
	profile?: {
		full_name?: string;
		headline?: string;
		summary?: string;
		email?: string;
		phone?: string;
		location?: string;
		social_links?: Record<string, string>;
		profile_image?: string;
	};
	skills?: SkillGroup[];
	experience?: ExperienceItem[];
	education?: EducationItem[];
	certifications?: CertificationItem[];
	achievements?: AchievementItem[];
	projects?: ProjectItem[];
	design_philosophy?: string;
	software_proficiency?: string[];
	awards?: AwardItem[];
	campaigns?: CampaignItem[];
	financial_modeling?: FinancialModelItem[];
	investment_portfolios?: InvestmentPortfolioItem[];
	custom_sections?: CustomSection[];
}

export type EditableSection = Exclude<keyof ParsedData, 'profile'>;

export interface PortfolioData {
	portfolioContent: PortfolioContent;
	parsedData: ParsedData;
	category: string;
	templateId?: string;
	sectionOrder?: string[];
	hiddenSections?: string[];
}

export interface PortfolioConfig {
	sectionOrder: string[];
	hiddenSections: string[];
}

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
