import { z } from 'zod';

export const AhrefsBacklinksStats = z.object({
	id: z.string(),
	target: z.string(),
	date: z.string(),
	edu: z.number().optional(),
	gov: z.number().optional(),
	rss: z.number().optional(),
	live: z.number().optional(),
	text: z.number().optional(),
	image: z.number().optional(),
	pages: z.number().optional(),
	refips: z.number().optional(),
	dofollow: z.number().optional(),
	nofollow: z.number().optional(),
	redirect: z.number().optional(),
	refpages: z.number().optional(),
	alternate: z.number().optional(),
	backlinks: z.number().optional(),
	canonical: z.number().optional(),
	html_pages: z.number().optional(),
	refclass_c: z.number().optional(),
	refdomains: z.number().optional(),
	valid_pages: z.number().optional(),
	links_external: z.number().optional(),
	links_internal: z.number().optional(),
	linked_root_domains: z.number().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const AhrefsDomainRating = z.object({
	id: z.string(),
	target: z.string(),
	date: z.string(),
	domain_rating: z.number().optional(),
	ahrefs_rank: z.number().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const AhrefsSiteAuditProject = z.object({
	id: z.string(),
	project_id: z.string(),
	domain: z.string().optional(),
	crawl_id: z.string().optional(),
	crawl_status: z.string().optional(),
	crawled_urls: z.number().optional(),
	health_score: z.number().optional(),
	issues_count: z.number().optional(),
	last_crawl_date: z.string().optional(),
	next_scheduled_audit: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const AhrefsKeywordData = z.object({
	id: z.string(),
	keyword: z.string(),
	country: z.string().optional(),
	volume: z.number().optional(),
	difficulty: z.number().optional(),
	cpc: z.number().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type AhrefsBacklinksStats = z.infer<typeof AhrefsBacklinksStats>;
export type AhrefsDomainRating = z.infer<typeof AhrefsDomainRating>;
export type AhrefsSiteAuditProject = z.infer<typeof AhrefsSiteAuditProject>;
export type AhrefsKeywordData = z.infer<typeof AhrefsKeywordData>;
