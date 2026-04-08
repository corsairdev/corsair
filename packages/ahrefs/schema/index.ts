import {
	AhrefsBacklinksStats,
	AhrefsDomainRating,
	AhrefsKeywordData,
	AhrefsSiteAuditProject,
} from './database';

export const AhrefsSchema = {
	version: '1.0.0',
	entities: {
		backlinksStats: AhrefsBacklinksStats,
		domainRatings: AhrefsDomainRating,
		siteAuditProjects: AhrefsSiteAuditProject,
		keywords: AhrefsKeywordData,
	},
} as const;
