import { z } from 'zod';
import {
	BacklinksStatus,
	Bool,
	CountMap,
	Filters,
	Num,
	OrderBy,
	RankScale,
	Strings,
	Tag,
	Text,
} from './shared';

const LinkProfile = {
	rank: Num,
	backlinks: Num,
	first_seen: Text,
	lost_date: Text,
	backlinks_spam_score: Num,
	broken_backlinks: Num,
	broken_pages: Num,
	referring_domains: Num,
	referring_domains_nofollow: Num,
	referring_main_domains: Num,
	referring_main_domains_nofollow: Num,
	referring_ips: Num,
	referring_subnets: Num,
	referring_pages: Num,
	referring_pages_nofollow: Num,
	referring_links_tld: CountMap,
	referring_links_types: CountMap,
	referring_links_attributes: CountMap,
	referring_links_platform_types: CountMap,
	referring_links_semantic_locations: CountMap,
	referring_links_countries: CountMap,
};

export const BacklinksSummaryResult = z.object({
	target: Text,
	crawled_pages: Num,
	internal_links_count: Num,
	external_links_count: Num,
	info: z
		.object({
			server: Text,
			cms: Text,
			platform_type: Strings,
			ip_address: Text,
			country: Text,
			is_ip: Bool,
			target_spam_score: Num,
		})
		.nullish(),
	...LinkProfile,
});

export const Backlink = z.object({
	type: Text,
	domain_from: Text,
	url_from: Text,
	url_from_https: Bool,
	domain_to: Text,
	url_to: Text,
	url_to_https: Bool,
	tld_from: Text,
	is_new: Bool,
	is_lost: Bool,
	backlink_spam_score: Num,
	rank: Num,
	page_from_rank: Num,
	domain_from_rank: Num,
	domain_from_platform_type: Strings,
	domain_from_is_ip: Bool,
	domain_from_ip: Text,
	domain_from_country: Text,
	page_from_external_links: Num,
	page_from_internal_links: Num,
	page_from_size: Num,
	page_from_encoding: Text,
	page_from_language: Text,
	page_from_title: Text,
	page_from_status_code: Num,
	first_seen: Text,
	prev_seen: Text,
	last_seen: Text,
	item_type: Text,
	attributes: Strings,
	dofollow: Bool,
	original: Bool,
	alt: Text,
	image_url: Text,
	anchor: Text,
	text_pre: Text,
	text_post: Text,
	semantic_location: Text,
	links_count: Num,
	group_count: Num,
	is_broken: Bool,
	url_to_status_code: Num,
	url_to_spam_score: Num,
	url_to_redirect_target: Text,
	is_indirect_link: Bool,
	indirect_link_path: z
		.array(z.object({ type: Text, status_code: Num, url: Text }))
		.nullish(),
	ranked_keywords_info: z
		.object({
			page_from_keywords_count_top_3: Num,
			page_from_keywords_count_top_10: Num,
			page_from_keywords_count_top_100: Num,
		})
		.nullish(),
});

export type Backlink = z.infer<typeof Backlink>;

const Page = { total_count: Num, items_count: Num };

export const BacklinksListResult = z.object({
	target: Text,
	mode: Text,
	search_after_token: Text,
	...Page,
	items: z.array(Backlink).nullish(),
});

export const ReferringDomainsResult = z.object({
	target: Text,
	...Page,
	items: z
		.array(z.object({ type: Text, domain: Text, ...LinkProfile }))
		.nullish(),
});

export const AnchorsResult = z.object({
	target: Text,
	...Page,
	items: z
		.array(z.object({ type: Text, anchor: Text, ...LinkProfile }))
		.nullish(),
});

export const CompetitorsResult = z.object({
	...Page,
	items: z
		.array(
			z.object({ type: Text, target: Text, rank: Num, intersections: Num }),
		)
		.nullish(),
});

export const BulkRanksResult = z.object({
	items_count: Num,
	items: z.array(z.object({ target: Text, rank: Num })).nullish(),
});

// Inputs

const Target = z
	.string()
	.min(1)
	.describe(
		'Domain or subdomain without https:// and www., or an absolute page URL',
	);

const Shared = {
	target: Target,
	rank_scale: RankScale.optional(),
	...Tag,
};

const Paging = {
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	filters: Filters.optional(),
	order_by: OrderBy.optional(),
};

const Scope = {
	include_subdomains: z.boolean().optional(),
	exclude_internal_backlinks: z.boolean().optional(),
	backlinks_status_type: BacklinksStatus.optional(),
};

export const BacklinksSummaryInput = z.object({
	...Shared,
	...Scope,
	include_indirect_links: z.boolean().optional(),
	internal_list_limit: z.number().int().min(1).max(1000).optional(),
	backlinks_filters: Filters.optional(),
});

export const BacklinksListInput = z.object({
	...Shared,
	...Scope,
	...Paging,
	offset: z.number().int().min(0).max(20000).optional(),
	search_after_token: z.string().optional(),
	mode: z.enum(['as_is', 'one_per_domain', 'one_per_anchor']).optional(),
});

const GroupedInput = {
	...Shared,
	...Scope,
	...Paging,
	include_indirect_links: z.boolean().optional(),
	internal_list_limit: z.number().int().min(1).max(1000).optional(),
	backlinks_filters: Filters.optional(),
};

export const ReferringDomainsInput = z.object(GroupedInput);

export const AnchorsInput = z.object(GroupedInput);

export const CompetitorsInput = z.object({
	...Shared,
	...Paging,
	main_domain: z.boolean().optional(),
	exclude_large_domains: z.boolean().optional(),
	exclude_internal_backlinks: z.boolean().optional(),
});

export const BulkRanksInput = z.object({
	targets: z.array(Target).min(1).max(1000),
	rank_scale: RankScale.optional(),
	...Tag,
});
