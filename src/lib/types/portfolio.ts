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
	// enriched fields (may be absent on older records)
	uniqueVisitors?: number;
	avgTtfb?: number | null;
	cacheHitRate?: number;
	byHour?: Record<number, number>;
	byDayOfWeek?: Record<string, number>;
	byVersion?: Record<string, number>;
	bestTimeToShare?: { hour: number; dayOfWeek: string | null } | null;
}

export type EditableField = 'bio' | 'headline' | 'uniqueValue';

export interface PortfolioContent {
	bio: string;
	headline: string;
	uniqueValue: string;
}
