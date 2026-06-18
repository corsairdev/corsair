import {
	DomainMetrics,
	KeywordMetrics,
	Ranking,
	RefDomain,
	SerpPosition,
	SubscriptionUsage,
	TopPage,
} from './database';

export const AhrefsSchema = {
	version: '1.0.0',
	entities: {
		domainMetrics: DomainMetrics,
		keywords: KeywordMetrics,
		refdomains: RefDomain,
		pages: TopPage,
		rankings: Ranking,
		serpPositions: SerpPosition,
		subscriptionUsage: SubscriptionUsage,
	},
} as const;
