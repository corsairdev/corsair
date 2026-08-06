import { overview } from './keywords-explorer';
import { overview as rankTrackerOverview } from './rank-tracker';
import { overview as serpOverview } from './serp-overview';
import {
	backlinksStats,
	getDomainRating,
	organicKeywords,
	refdomains,
	topPages,
} from './site-explorer';
import { limitsAndUsage } from './subscription-info';

export const SiteExplorer = {
	getDomainRating,
	backlinksStats,
	organicKeywords,
	refdomains,
	topPages,
};

export const KeywordsExplorer = {
	overview,
};

export const RankTracker = {
	overview: rankTrackerOverview,
};

export const SerpOverview = {
	overview: serpOverview,
};

export const SubscriptionInfo = {
	limitsAndUsage,
};

export * from './types';
