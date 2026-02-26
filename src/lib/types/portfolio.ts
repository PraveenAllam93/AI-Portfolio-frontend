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
}

export type EditableField = 'bio' | 'headline' | 'uniqueValue';

export interface PortfolioContent {
	bio: string;
	headline: string;
	uniqueValue: string;
}
