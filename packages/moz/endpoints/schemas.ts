// Generated from the Moz API method reference (moz.com/api/docs/methods/*): each
// method page embeds its payload and result definitions. Inputs follow the
// payload strictly; outputs are lenient (every field nullish, objects loose) so
// a field Moz adds or drops cannot fail a call that already ran.
// unknown (z.unknown() and records of it): fields Moz documents without a
// type (free-form maps), and Moz Local values whose documented type Moz's own
// examples contradict, so the plugin passes them through for Moz to validate.
import { z } from 'zod';

export const mozInputBuilders = {
	'anchorText.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Defines the input parameters used to retrieve anchor text data for a given target. It allows controlling the pagination, and number of results returned.',
					)
					.optional(),
			})
			.strict(),
	'competitors.fetch': () =>
		z
			.object({
				target_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder'])
							.describe(
								'Fetching site competitors currently supports only the following scopes.',
							),
						locale: z
							.enum(['en-US', 'en-GB', 'en-CA', 'en-AU'])
							.describe(
								'The locale to search in. Only a limited subset of locales are supported for target queries - see the acceptable values below.',
							),
					})
					.strict()
					.describe('The target site to fetch competitors for.'),
			})
			.strict(),
	'global.topDomains': () =>
		z
			.object({
				page: z
					.object({
						n: z.number().describe('The page number to load.').optional(),
						limit: z
							.number()
							.describe('The number of results per page.')
							.optional(),
					})
					.strict()
					.describe(
						'Control how much data is returned by providing a specific page number (n) and limit to the number of results in a given page.',
					)
					.optional(),
			})
			.strict(),
	'global.topPages': () =>
		z
			.object({
				page: z
					.object({
						n: z.number().describe('The page number to load.').optional(),
						limit: z
							.number()
							.describe('The number of results per page.')
							.optional(),
					})
					.strict()
					.describe(
						'Control how much data is returned by providing a specific page number (n) and limit to the number of results in a given page.',
					)
					.optional(),
			})
			.strict(),
	'index.fetch': () =>
		z
			.record(z.string(), z.unknown())
			.describe('This method does not require any input.'),
	'jobs.lookup': () =>
		z
			.object({
				id: z
					.string()
					.describe(
						'The ID of the `async_call` to lookup. This is the `async_call.id` returned by the asynchronous action that started the request.',
					),
			})
			.strict(),
	'keywords.difficulty': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'keywords.generateMetrics': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
			})
			.strict(),
	'keywords.generateSerp': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
			})
			.strict(),
	'keywords.intent': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'keywords.metrics': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'keywords.metricsMultiple': () =>
		z
			.object({
				serp_queries: z.array(
					z
						.object({
							keyword: z
								.string()
								.describe(
									'The keyword to query. Must be between 1 and 255 characters.',
								),
							locale: z
								.string()
								.describe(
									'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
								),
							device: z
								.enum(['desktop', 'mobile_android', 'mobile_ios'])
								.describe('The device to perform the query for.'),
							engine: z
								.enum(['google', 'bing', 'yahoo'])
								.describe('The engine for the query.'),
							vicinity: z
								.string()
								.describe(
									'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
								)
								.optional(),
						})
						.strict(),
				),
			})
			.strict(),
	'keywords.opportunity': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'keywords.priority': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'keywords.serp': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of a cached SERP, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the cached SERP that is returned.',
					)
					.optional(),
			})
			.strict(),
	'keywords.suggestions': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop'])
							.describe('The device to perform the query for.'),
						engine: z.enum(['google']).describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						strategy: z
							.enum(['default', 'related_synonyms', 'related_topics'])
							.describe(
								"The algorithm to use to generate the keyword suggestions. Possible values are: - `default` - Combines Moz's proprietary machine learning with recent search data and the top organic results from the most recent SERP. - `related_synonyms` - Returns keywords semantically related to the input keyword. - `related_topics` - Returns keywords drawn from topics associated with the input keyword. Defaults t",
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further filter or refine which keyword suggestions are returned. Strategy will default to `default` if not provided.',
					)
					.optional(),
				page: z
					.object({
						n: z.number().describe('The page number to load.').optional(),
						limit: z
							.number()
							.describe('The number of results per page.')
							.optional(),
					})
					.strict()
					.describe(
						'Control how much data is returned by providing a specific page number (n) and limit to the number of results in a given page.',
					)
					.optional(),
			})
			.strict(),
	'keywords.volume': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z
							.string()
							.describe(
								'The keyword to query. Must be between 1 and 255 characters.',
							),
						locale: z
							.string()
							.describe(
								'The locale to search in, provided as an `hl-gl` pair - a valid Google `hl` (host language) value and a valid `gl` (country) value, joined by a hyphen, e.g. `en-US`.',
							),
						device: z
							.enum(['desktop', 'mobile_android', 'mobile_ios'])
							.describe('The device to perform the query for.'),
						engine: z
							.enum(['google', 'bing', 'yahoo'])
							.describe('The engine for the query.'),
						vicinity: z
							.string()
							.describe(
								'The location to perform the search from - e.g. `New York, NY`. This field is optional and defaults to a blank string, which is interpreted as national.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'The SERP query object describes a keyword or search phrase in combination with several options to specify how the query is run (i.e. how a SERP should be retrieved for this keyword if necessary).',
					),
				options: z
					.object({
						include_intent: z
							.boolean()
							.describe(
								'Whether to include the `intent` metric in the response. Defaults to `false`. When `true`, and intent is available for the SERP, the `intent` metric is returned and counts toward quota usage like any other metric.',
							)
							.optional(),
						max_age: z
							.number()
							.describe(
								'Maximum acceptable age of the cached keyword metrics, in whole seconds. Defaults to one year. Cannot be less than one day (86400). Example values: 1 day = 86400, 30 days = 2592000, 1 year = 31536000.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Options to further refine the keyword metrics that are returned. `include_intent` defaults to `false` if not provided.',
					)
					.optional(),
			})
			.strict(),
	'linkingDomains.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				options: z
					.object({
						sort: z
							.enum([
								'source_domain_authority',
								'source_link_propensity',
								'source_spam_score',
							])
							.describe(
								'The order to return linking root domains in. The default value is `"source_domain_authority"`. Results are returned in descending order (higher values first).',
							)
							.optional(),
						filters: z
							.array(
								z
									.enum([
										'external',
										'follow',
										'nofollow',
										'deleted',
										'not_deleted',
									])
									.describe(
										'Filters to apply to the linking root domains. Possible values are: - `external` - Only return linking root domains that are external to the target domain. - `follow` - Only return linking root domains that have at least one followed link from the source domain to the target. - `nofollow` - Only return linking root domains that have all links from the source domain to the target be nofollow links. ',
									),
							)
							.describe(
								'Optional. Only return linking root domains that match these filters. As many filter values as desired can be supplied in the array, but if providing multiple filters, `external` must be one of them. **Acceptable Values:** `external`, `follow`, `nofollow`, `deleted`, `not_deleted`.',
							)
							.optional(),
					})
					.strict()
					.describe('Options for fetching linking domains.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'linkingDomains.recentlyGained': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				options: z
					.object({
						begin_date: z
							.string()
							.nullable()
							.describe(
								'Restrict results to only those gained or lost on or after this date. Values must be in `YYYY-MM-DD` form.',
							)
							.optional(),
						end_date: z
							.string()
							.nullable()
							.describe(
								'Restrict results to only those gained or lost on or before this date. Values must be in `YYYY-MM-DD` form.',
							)
							.optional(),
					})
					.strict()
					.describe('Optional date ranges to filter by.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'linkingDomains.recentlyLost': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				options: z
					.object({
						begin_date: z
							.string()
							.nullable()
							.describe(
								'Restrict results to only those gained or lost on or after this date. Values must be in `YYYY-MM-DD` form.',
							)
							.optional(),
						end_date: z
							.string()
							.nullable()
							.describe(
								'Restrict results to only those gained or lost on or before this date. Values must be in `YYYY-MM-DD` form.',
							)
							.optional(),
					})
					.strict()
					.describe('Optional date ranges to filter by.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'links.filterByAnchorText': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				anchor_text: z
					.string()
					.nullable()
					.describe(
						'The anchor text provided for filtering in the original request. Pass an explicit `null` to request links with no anchor text.',
					),
				options: z
					.object({
						scope: z
							.enum(['subdomain', 'domain', 'page'])
							.describe(
								'If set to `subdomain` or `root_domain`, return only the best link from each source at that scope, as ordered by the `sort` parameter. The default value is `page`.',
							)
							.optional(),
						subdomains_limited_to_one: z
							.array(
								z
									.string()
									.describe(
										'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
									),
							)
							.describe(
								'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
							)
							.optional(),
						sort: z
							.enum([
								'source_page_authority',
								'source_domain_authority',
								'source_link_propensity',
								'source_spam_score',
							])
							.describe(
								'Value by which to sort the list of returned links. (Then keep default value + acceptable values)',
							)
							.optional(),
						filters: z
							.array(
								z.enum([
									'external',
									'follow',
									'nofollow',
									'deleted',
									'not_deleted',
									'redirect',
									'not_redirect',
									'rel_canonical',
									'not_rel_canonical',
									'via_redirect',
									'not_via_redirect',
									'via_rel_canonical',
									'not_via_rel_canonical',
									'gained_last_60_days',
									'lost_last_60_days',
								]),
							)
							.describe(
								'Only return links that match these filters. As many filter values as desired can be supplied, separated by `+` *(with no spaces)*, but if providing multiple filters, `external` must be one of them. **Acceptable values:** `external`, `follow`, `nofollow`, `deleted`, `not_deleted`, `redirect`, `not_redirect`, `rel_canonical`, `not_rel_canonical`, `via_redirect`, `not_via_redirect`, `via_rel_canonica',
							)
							.optional(),
					})
					.strict()
					.describe('Options for filtering links by anchor text.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'links.filterByDomain': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				domain_site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain'])
							.describe('The scope of the domain to filter by.'),
					})
					.strict()
					.describe(
						'Specify the source domain to filter by. Must be a fully resolved site_query with a scope of `domain`.',
					),
				options: z
					.object({
						scope: z
							.enum(['subdomain', 'domain', 'page'])
							.describe(
								'If set to `subdomain` or `root_domain`, return only the best link from each source at that scope, as ordered by the `sort` parameter. The default value is `page`.',
							)
							.optional(),
						subdomains_limited_to_one: z
							.array(
								z
									.string()
									.describe(
										'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
									),
							)
							.describe(
								'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
							)
							.optional(),
						sort: z
							.enum(['source_page_authority'])
							.describe(
								'Filtering by domain only allows sorting by `source_page_authority`. This will default to that value if none is provided.',
							)
							.optional(),
						filters: z
							.array(
								z
									.enum([
										'external',
										'follow',
										'nofollow',
										'deleted',
										'not_deleted',
										'gained_last_60_days',
										'lost_last_60_days',
									])
									.describe(
										'Only return links that match these filters. As many filter values as desired can be supplied in the array, but if providing multiple filters, `external` must be one of them. **Acceptable values:** `external`, `follow`, `nofollow`, `deleted`, `not_deleted`, `gained_last_60_days`, `lost_last_60_days`.',
									),
							)
							.describe(
								'Only return links that match these filters. As many filter values as desired can be supplied in the array, but if providing multiple filters, `external` must be one of them. **Acceptable values:** `external`, `follow`, `nofollow`, `deleted`, `not_deleted`, `gained_last_60_days`, `lost_last_60_days`.',
							)
							.optional(),
					})
					.strict()
					.describe('Options for filtering links by domain.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'links.intersect': () =>
		z
			.object({
				is_linking_to: z
					.array(
						z
							.object({
								query: z.string().describe('A URL to query for.'),
								scope: z
									.enum(['domain', 'subdomain', 'subfolder', 'url'])
									.describe(
										'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
									),
							})
							.strict()
							.describe(
								'Get sources that link to at least one of the provided sites, or more if `minimum_matching_targets` is set (see description of `minimum_matching_targets` below). Up to 6 total targets may be specified in the `is_linking_to` and `not_linking_to` fields combined, and at least one target must be specified in `is_linking_to`.',
							),
					)
					.describe(
						'Get sources that link to at least one of the provided sites, or more if `minimum_matching_targets` is set (see description of `minimum_matching_targets` below). Up to 6 total targets may be specified in the `is_linking_to` and `not_linking_to` fields combined, and at least one target must be specified in `is_linking_to`.',
					),
				not_linking_to: z
					.array(
						z
							.object({
								query: z.string().describe('A URL to query for.'),
								scope: z
									.enum(['domain', 'subdomain', 'subfolder', 'url'])
									.describe(
										'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
									),
							})
							.strict()
							.describe(
								'Optionally, ensure that the returned sources that do not link to any of the provided sites.',
							),
					)
					.describe(
						'Optionally, ensure that the returned sources that do not link to any of the provided sites.',
					)
					.optional(),
				options: z
					.object({
						minimum_matching_targets: z
							.number()
							.nullable()
							.describe(
								'The minimum number of positive targets in `is_linking_to` that a result must match to be returned. Can be between 1 and the length of the `is_linking_to` array, or left blank (which is equivalent to defaulting to 1, i.e. requiring only one positive match from the `is_linking_to` array).',
							)
							.optional(),
						scope: z
							.enum(['page', 'domain'])
							.describe('The scope of the source to return.')
							.optional(),
						sort: z
							.enum([
								'matching_target_count',
								'source_spam_score',
								'source_domain_authority',
							])
							.describe(
								'The order to return results in. Results are returned in descending order (higher values first).',
							)
							.optional(),
					})
					.strict()
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50. Defaults to 25.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'links.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				options: z
					.object({
						scope: z
							.enum(['subdomain', 'domain', 'page'])
							.describe(
								'If set to `subdomain` or `root_domain`, return only the best link from each source at that scope, as ordered by the `sort` parameter. The default value is `page`.',
							)
							.optional(),
						subdomains_limited_to_one: z
							.array(
								z
									.string()
									.describe(
										'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
									),
							)
							.describe(
								'If set, return at most one link (the top link as ordered by the `sort` parameter) from each of the specified subdomains. If this field is set, a value must be provided in the `sort` field as well.',
							)
							.optional(),
						sort: z
							.enum([
								'root_domains_to_source_root_domain',
								'root_domains_to_source_page',
								'source_page_authority',
								'source_domain_authority',
								'source_link_propensity',
								'source_spam_score',
							])
							.describe(
								'Sorting will default to `source_page_authority` if none is provided.',
							)
							.optional(),
						filters: z
							.array(
								z.enum([
									'external',
									'follow',
									'nofollow',
									'deleted',
									'not_deleted',
									'redirect',
									'not_redirect',
									'rel_canonical',
									'not_rel_canonical',
									'via_redirect',
									'not_via_redirect',
									'via_rel_canonical',
									'not_via_rel_canonical',
									'gained_last_60_days',
									'lost_last_60_days',
								]),
							)
							.describe(
								'Only return links that match these filters. As many filter values as desired can be supplied in the array, but if providing multiple filters, `"external"` must be one of them. **Acceptable values:** `external`, `follow`, `nofollow`, `deleted`, `not_deleted`, `redirect`, `not_redirect`, `rel_canonical`, `not_rel_canonical`, `via_redirect`, `not_via_redirect`, `via_rel_canonical`, `not_via_rel_canon',
							)
							.optional(),
					})
					.strict()
					.describe('Options for fetching linking domains.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The number of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
	'links.status': () =>
		z
			.object({
				target_site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe('Specify the target to check for an existing link.'),
				source_site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe('Specify the source to check for an existing link.'),
			})
			.strict()
			.describe('The data for the data.site.link.status.fetch action.'),
	'links.statusMultiple': () =>
		z
			.object({
				queries: z.array(
					z
						.object({
							target_site_query: z
								.object({
									query: z.string().describe('A URL to query for.'),
									scope: z
										.enum(['domain', 'subdomain', 'subfolder', 'url'])
										.describe(
											'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
										),
								})
								.strict()
								.describe(
									'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
								)
								.optional(),
							source_site_query: z
								.object({
									query: z.string().describe('A URL to query for.'),
									scope: z
										.enum(['domain', 'subdomain', 'subfolder', 'url'])
										.describe(
											'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
										),
								})
								.strict()
								.describe(
									'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
								)
								.optional(),
						})
						.strict(),
				),
			})
			.strict()
			.describe(
				'The payload for the `data.site.link.status.fetch.multiple` action.',
			),
	'local.accounts.create': () =>
		z
			.object({
				account: z
					.object({
						name: z
							.unknown()
							.describe('The name of the local account.')
							.optional(),
					})
					.loose()
					.describe('A payload to create a local account.'),
			})
			.loose(),
	'local.accounts.list': () =>
		z
			.record(z.string(), z.unknown())
			.describe('This method does not require any input.'),
	'local.accounts.lookup': () =>
		z
			.object({ id: z.number().describe('The ID of the local account.') })
			.loose(),
	'local.customFields.create': () =>
		z
			.object({
				custom_field: z
					.object({
						account_id: z
							.unknown()
							.describe('The account ID the custom field is attached to.')
							.optional(),
						name: z
							.unknown()
							.describe('The name of a local account custom field.')
							.optional(),
					})
					.loose()
					.describe('A payload to create a local account custom field.'),
			})
			.loose(),
	'local.customFields.listForAccount': () =>
		z
			.object({
				account_id: z
					.number()
					.describe('The account ID the custom field is attached to.'),
			})
			.loose(),
	'local.customFields.lookup': () =>
		z
			.object({
				account_id: z
					.number()
					.describe('The account ID the custom field is attached to.'),
				id: z.number().describe('The ID of a local account custom field.'),
			})
			.loose(),
	'local.groups.addLocation': () =>
		z
			.object({
				group_id: z.number().describe('The ID of the local group.'),
				location_id: z.number().describe('The id of the location'),
			})
			.loose(),
	'local.groups.create': () =>
		z
			.object({
				group: z
					.object({
						name: z
							.unknown()
							.describe('The name of the local group.')
							.optional(),
						account_id: z
							.unknown()
							.describe('The Moz Local Account ID the group belongs to.')
							.optional(),
					})
					.loose()
					.describe('A payload to create a local group.'),
			})
			.loose(),
	'local.groups.list': () =>
		z
			.record(z.string(), z.unknown())
			.describe('This method does not require any input.'),
	'local.groups.listForAccount': () =>
		z
			.object({
				account_id: z
					.number()
					.nullable()
					.describe(
						'The id of the local account the location resides in. May be null for legacy inactive locations.',
					),
			})
			.loose(),
	'local.groups.listLocations': () =>
		z
			.object({
				group_id: z.number().describe('The ID of the local group.'),
				page: z
					.object({
						n: z.unknown().describe('The page number to load.').optional(),
						limit: z
							.unknown()
							.describe('The number of results per page. Maximum is 50.')
							.optional(),
					})
					.loose()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default `limit` is 25 with an `n` value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing `n` values to fetch additional pages of results. To get all results, you must continue making calls with incrementing `n` values until an empty result set is retur',
					)
					.optional(),
			})
			.loose(),
	'local.groups.lookup': () =>
		z.object({ id: z.number().describe('The ID of the local group.') }).loose(),
	'local.groups.removeLocation': () =>
		z
			.object({
				group_id: z.number().describe('The ID of the local group.'),
				location_id: z.number().describe('The id of the location'),
			})
			.loose(),
	'local.locations.cancel': () =>
		z.object({ id: z.number().describe('The id of the location') }).loose(),
	'local.locations.categories': () =>
		z
			.record(z.string(), z.unknown())
			.describe('This method does not require any input.'),
	'local.locations.close': () =>
		z.object({ id: z.number().describe('The id of the location') }).loose(),
	'local.locations.create': () =>
		z
			.object({
				location: z
					.object({
						level: z
							.unknown()
							.describe('The name of the tier of service for the location.')
							.optional(),
						account_id: z
							.unknown()
							.describe(
								'The id of the local account the location resides in. May be null for legacy inactive locations.',
							)
							.optional(),
						auto_sync_enabled: z
							.unknown()
							.describe(
								'Enables or disables automatic data synchronization to native networks',
							)
							.optional(),
						custom_fields: z
							.record(z.string(), z.unknown())
							.describe('Custom fields for the location.')
							.optional(),
						remote_id: z
							.unknown()
							.describe('The internal ID property of the source of data')
							.optional(),
						listings_name: z
							.unknown()
							.describe(
								'The listings name (that gets published) of the location',
							)
							.optional(),
						location_name: z
							.unknown()
							.describe('The internal name of the location')
							.optional(),
						website_url: z
							.unknown()
							.describe('The website URL for the location')
							.optional(),
						email_address: z
							.unknown()
							.describe(
								'The email address for the location, or a corporate email address',
							)
							.optional(),
						timezone: z.unknown().describe('The location timezone').optional(),
						store_code: z
							.unknown()
							.describe('Unique store identifier')
							.optional(),
						short_description: z
							.unknown()
							.describe('A short description up to 255 characters')
							.optional(),
						long_description: z
							.unknown()
							.describe('A long description up to 750 characters')
							.optional(),
						languages: z.unknown().optional(),
						keywords: z.unknown().optional(),
						brands: z.unknown().optional(),
						payment_forms: z
							.unknown()
							.describe('A form of payment accepted')
							.optional(),
						price_range: z
							.unknown()
							.describe(
								"The location's product or service estimated price range",
							)
							.optional(),
						service_areas: z.unknown().optional(),
						service_area_only: z
							.unknown()
							.describe('Set this location as a "service-area only" business')
							.optional(),
						services: z.unknown().optional(),
						primary_category: z
							.unknown()
							.describe('The primary category ID from Google')
							.optional(),
						additional_categories: z.unknown().optional(),
						attributes: z.unknown().optional(),
						address: z
							.object({
								address_line_1: z
									.unknown()
									.describe('Name of the street where the premises are located')
									.optional(),
								address_line_2: z
									.unknown()
									.describe(
										'Any additional premises data, such as suite number, building number etc.',
									)
									.optional(),
								sublocality: z
									.unknown()
									.describe('The neighborhood')
									.optional(),
								county: z
									.unknown()
									.describe('The county in which the premises are located')
									.optional(),
								city: z
									.unknown()
									.describe('The geographical city of the premises')
									.optional(),
								state_province: z
									.unknown()
									.describe(
										'The geographical state or province in which the premises are',
									)
									.optional(),
								postal_code: z
									.unknown()
									.describe('The geographical area in which a premises resides')
									.optional(),
								country: z
									.unknown()
									.describe('The country in which the premises resides')
									.optional(),
							})
							.loose()
							.describe("The location's physical address")
							.optional(),
						lat: z.unknown().describe("The location's latitude").optional(),
						long: z.unknown().describe("The location's longitude").optional(),
						opening_status: z
							.unknown()
							.describe('The location open status')
							.optional(),
						reopen_date: z
							.unknown()
							.describe('Reopen date if location is temporarily closed')
							.optional(),
						hours: z
							.object({
								monday: z.unknown().optional(),
								tuesday: z.unknown().optional(),
								wednesday: z.unknown().optional(),
								thursday: z.unknown().optional(),
								friday: z.unknown().optional(),
								saturday: z.unknown().optional(),
								sunday: z.unknown().optional(),
							})
							.loose()
							.describe('The regular opening hours keyed by the day')
							.optional(),
						opening_hours_notes: z
							.unknown()
							.describe('Notes pertaining to opening hours')
							.optional(),
						opening_date: z
							.unknown()
							.describe('The date the business opened or is expected to open')
							.optional(),
						special_hours: z
							.record(z.string(), z.unknown())
							.describe(
								'The special opening hours keyed by the date in YYYY-MM-DD format',
							)
							.optional(),
						phone: z
							.unknown()
							.describe('The primary phone numberfor the location')
							.optional(),
						fax: z
							.unknown()
							.describe('The primary fax numberfor the location')
							.optional(),
						published: z
							.unknown()
							.describe('If true, location would be published when created')
							.optional(),
						create_pages: z
							.unknown()
							.describe('If true, pages will be created for the location')
							.optional(),
					})
					.loose()
					.describe('A location to be created.'),
			})
			.loose(),
	'local.locations.fieldIssues': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.fieldStatuses': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.gbpImpressionHistory': () =>
		z
			.object({
				location_id: z.number().describe('The id of the location'),
				date_start: z.string().describe('Inclusive range start, `YYYY-MM-DD`.'),
				date_end: z
					.string()
					.describe(
						'Inclusive range end, `YYYY-MM-DD`. Date range may not exceed 12 months.',
					),
				keyword_limit: z
					.number()
					.describe(
						'Max number of top keywords returned per Google Business Profile impression bucket.',
					)
					.optional(),
			})
			.loose(),
	'local.locations.gbpImpressionTotals': () =>
		z
			.object({
				location_id: z.number().describe('The id of the location'),
				date_start: z.string().describe('Inclusive range start, `YYYY-MM-DD`.'),
				date_end: z
					.string()
					.describe(
						'Inclusive range end, `YYYY-MM-DD`. Date range may not exceed 12 months.',
					),
				page: z
					.object({
						n: z.unknown().describe('The page number to load.').optional(),
						limit: z
							.unknown()
							.describe(
								'The number of keywords to return per page. Maximum is 50.',
							)
							.optional(),
					})
					.loose()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default `limit` is 25 with an `n` value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing `n` values to fetch additional pages of results. To get all results, you must continue making calls with incrementing `n` values until an empty result set is retur',
					)
					.optional(),
			})
			.loose(),
	'local.locations.gbpLeadHistory': () =>
		z
			.object({
				location_id: z.number().describe('The id of the location'),
				date_start: z.string().describe('Inclusive range start, `YYYY-MM-DD`.'),
				date_end: z
					.string()
					.describe(
						'Inclusive range end, `YYYY-MM-DD`. Date range may not exceed 12 months.',
					),
				date_aggregation: z
					.enum(['day', 'week', 'month'])
					.describe(
						'The bucket size used to aggregate a Google Business Profile insight time series. Accepted and returned in lowercase.',
					)
					.optional(),
			})
			.loose(),
	'local.locations.levels': () =>
		z
			.record(z.string(), z.unknown())
			.describe('This method does not require any input.'),
	'local.locations.list': () =>
		z
			.object({
				page: z
					.object({
						n: z.unknown().describe('The page number to load.').optional(),
						limit: z
							.unknown()
							.describe('The number of results per page. Maximum is 50.')
							.optional(),
					})
					.loose()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default `limit` is 25 with an `n` value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing `n` values to fetch additional pages of results. To get all results, you must continue making calls with incrementing `n` values until an empty result set is retur',
					)
					.optional(),
			})
			.loose(),
	'local.locations.listByStatus': () =>
		z
			.object({
				page: z
					.object({
						n: z.unknown().describe('The page number to load.').optional(),
						limit: z
							.unknown()
							.describe('The number of results per page. Maximum is 50.')
							.optional(),
					})
					.loose()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default `limit` is 25 with an `n` value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing `n` values to fetch additional pages of results. To get all results, you must continue making calls with incrementing `n` values until an empty result set is retur',
					)
					.optional(),
				status: z
					.enum(['active', 'canceled', 'closed', 'suspended'])
					.describe('The status of the location'),
			})
			.loose(),
	'local.locations.listForAccount': () =>
		z
			.object({
				page: z
					.object({
						n: z.unknown().describe('The page number to load.').optional(),
						limit: z
							.unknown()
							.describe('The number of results per page. Maximum is 50.')
							.optional(),
					})
					.loose()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default `limit` is 25 with an `n` value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing `n` values to fetch additional pages of results. To get all results, you must continue making calls with incrementing `n` values until an empty result set is retur',
					)
					.optional(),
			})
			.loose(),
	'local.locations.listings': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.localGridHistory': () =>
		z
			.object({
				location_id: z.number().describe('The id of the location'),
				keyword: z
					.string()
					.describe('The Local Grid keyword the grid ranks are for.'),
				device: z
					.enum(['desktop', 'mobile'])
					.describe('The device to perform the query for.'),
				engine: z.enum(['google']).describe('The engine for the query.'),
				date_start: z.string().describe('Inclusive range start, `YYYY-MM-DD`.'),
				date_end: z
					.string()
					.describe(
						'Inclusive range end, `YYYY-MM-DD`. Date range may not exceed 12 months.',
					),
			})
			.loose(),
	'local.locations.localGridKeywords': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.lookup': () =>
		z.object({ id: z.number().describe('The id of the location') }).loose(),
	'local.locations.networkStatuses': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.networks': () =>
		z
			.object({ location_id: z.number().describe('The id of the location') })
			.loose(),
	'local.locations.rankingHistory': () =>
		z
			.object({
				location_id: z.number().describe('The id of the location'),
				date_start: z.string().describe('Inclusive range start, `YYYY-MM-DD`.'),
				date_end: z
					.string()
					.describe(
						'Inclusive range end, `YYYY-MM-DD`. Date range may not exceed 12 months.',
					),
				engine: z.enum(['google']).describe('The engine for the query.'),
				device: z
					.enum(['desktop', 'mobile'])
					.describe('The device to perform the query for.'),
			})
			.loose(),
	'local.locations.update': () =>
		z
			.object({
				location: z
					.object({
						id: z.unknown().describe('The id of the location').optional(),
						auto_sync_enabled: z
							.unknown()
							.describe(
								'Enables or disables automatic data synchronization to native networks',
							)
							.optional(),
						custom_fields: z
							.record(z.string(), z.unknown())
							.describe('Custom fields for the location.')
							.optional(),
						remote_id: z
							.unknown()
							.describe('The internal ID property of the source of data')
							.optional(),
						listings_name: z
							.unknown()
							.describe(
								'The listings name (that gets published) of the location',
							)
							.optional(),
						location_name: z
							.unknown()
							.describe('The internal name of the location')
							.optional(),
						website_url: z
							.unknown()
							.describe('The website URL for the location')
							.optional(),
						email_address: z
							.unknown()
							.describe(
								'The email address for the location, or a corporate email address',
							)
							.optional(),
						timezone: z.unknown().describe('The location timezone').optional(),
						store_code: z
							.unknown()
							.describe('Unique store identifier')
							.optional(),
						short_description: z
							.unknown()
							.describe('A short description up to 255 characters')
							.optional(),
						long_description: z
							.unknown()
							.describe('A long description up to 750 characters')
							.optional(),
						languages: z.unknown().optional(),
						keywords: z.unknown().optional(),
						brands: z.unknown().optional(),
						payment_forms: z
							.unknown()
							.describe('A form of payment accepted')
							.optional(),
						price_range: z
							.unknown()
							.describe(
								"The location's product or service estimated price range",
							)
							.optional(),
						service_areas: z.unknown().optional(),
						service_area_only: z
							.unknown()
							.describe('Set this location as a "service-area only" business')
							.optional(),
						services: z.unknown().optional(),
						primary_category: z
							.unknown()
							.describe('The primary category ID from Google')
							.optional(),
						additional_categories: z.unknown().optional(),
						attributes: z.unknown().optional(),
						address: z
							.object({
								address_line_1: z
									.unknown()
									.describe('Name of the street where the premises are located')
									.optional(),
								address_line_2: z
									.unknown()
									.describe(
										'Any additional premises data, such as suite number, building number etc.',
									)
									.optional(),
								sublocality: z
									.unknown()
									.describe('The neighborhood')
									.optional(),
								county: z
									.unknown()
									.describe('The county in which the premises are located')
									.optional(),
								city: z
									.unknown()
									.describe('The geographical city of the premises')
									.optional(),
								state_province: z
									.unknown()
									.describe(
										'The geographical state or province in which the premises are',
									)
									.optional(),
								postal_code: z
									.unknown()
									.describe('The geographical area in which a premises resides')
									.optional(),
								country: z
									.unknown()
									.describe('The country in which the premises resides')
									.optional(),
							})
							.loose()
							.describe("The location's physical address")
							.optional(),
						lat: z.unknown().describe("The location's latitude").optional(),
						long: z.unknown().describe("The location's longitude").optional(),
						opening_status: z
							.unknown()
							.describe('The location open status')
							.optional(),
						reopen_date: z
							.unknown()
							.describe('Reopen date if location is temporarily closed')
							.optional(),
						hours: z
							.object({
								monday: z.unknown().optional(),
								tuesday: z.unknown().optional(),
								wednesday: z.unknown().optional(),
								thursday: z.unknown().optional(),
								friday: z.unknown().optional(),
								saturday: z.unknown().optional(),
								sunday: z.unknown().optional(),
							})
							.loose()
							.describe('The regular opening hours keyed by the day')
							.optional(),
						opening_hours_notes: z
							.unknown()
							.describe('Notes pertaining to opening hours')
							.optional(),
						opening_date: z
							.unknown()
							.describe('The date the business opened or is expected to open')
							.optional(),
						special_hours: z
							.record(z.string(), z.unknown())
							.describe(
								'The special opening hours keyed by the date in YYYY-MM-DD format',
							)
							.optional(),
						phone: z
							.unknown()
							.describe('The primary phone numberfor the location')
							.optional(),
						fax: z
							.unknown()
							.describe('The primary fax numberfor the location')
							.optional(),
						create_pages: z
							.unknown()
							.describe('If true, pages will be created for the location')
							.optional(),
						published: z
							.unknown()
							.describe('If true, location would be published when created')
							.optional(),
					})
					.loose()
					.describe('A payload to update one or more fields for a location.'),
			})
			.loose(),
	'local.locations.updateLevel': () =>
		z
			.object({
				id: z.number().describe('The id of the location'),
				level: z
					.string()
					.describe('The name of the tier of service for the location.'),
			})
			.loose(),
	'locales.list': () =>
		z
			.object({
				engine: z
					.enum(['google', 'bing', 'yahoo'])
					.describe('The search engine to list supported locales for.'),
			})
			.strict(),
	'metrics.brandAuthority': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain'])
							.describe('Brand Authority only supports the "domain" scope.'),
					})
					.strict(),
			})
			.strict(),
	'metrics.distributions': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
			})
			.strict(),
	'metrics.fetch': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
			})
			.strict(),
	'metrics.fetchMultiple': () =>
		z
			.object({
				site_queries: z.array(
					z
						.object({
							query: z.string().describe('A URL to query for.'),
							scope: z
								.enum(['domain', 'subdomain', 'subfolder', 'url'])
								.describe(
									'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
								),
						})
						.strict(),
				),
			})
			.strict(),
	'metrics.histories': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				get_daily_history_deltas_for: z
					.array(
						z
							.enum([
								'pages_to_page',
								'nofollow_pages_to_page',
								'redirect_pages_to_page',
								'external_pages_to_page',
								'external_nofollow_pages_to_page',
								'external_redirect_pages_to_page',
								'root_domains_to_page',
								'indirect_root_domains_to_page',
								'nofollow_root_domains_to_page',
								'pages_to_subdomain',
								'nofollow_pages_to_subdomain',
								'redirect_pages_to_subdomain',
								'external_pages_to_subdomain',
								'external_nofollow_pages_to_subdomain',
								'external_redirect_pages_to_subdomain',
								'root_domains_to_subdomain',
								'nofollow_root_domains_to_subdomain',
								'pages_to_root_domain',
								'nofollow_pages_to_root_domain',
								'redirect_pages_to_root_domain',
								'external_pages_to_root_domain',
								'external_indirect_pages_to_root_domain',
								'external_nofollow_pages_to_root_domain',
								'external_redirect_pages_to_root_domain',
								'root_domains_to_root_domain',
								'indirect_root_domains_to_root_domain',
								'nofollow_root_domains_to_root_domain',
								'page_authority',
								'domain_authority',
							])
							.describe(
								'Optional array of values for which to get daily history deltas. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](https://moz.com/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, and `domain_authority`. At least one value must be provided between `get_daily_history_deltas_for`, `get_daily_history_values_fo',
							),
					)
					.describe(
						'Optional array of values for which to get daily history deltas. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, and `domain_authority`. At least one value must be provided between `get_daily_history_deltas_for`, `get_daily_history_values_for`, `get_monthl',
					)
					.optional(),
				get_daily_history_values_for: z
					.array(
						z
							.enum([
								'pages_to_page',
								'nofollow_pages_to_page',
								'redirect_pages_to_page',
								'external_pages_to_page',
								'external_nofollow_pages_to_page',
								'external_redirect_pages_to_page',
								'root_domains_to_page',
								'indirect_root_domains_to_page',
								'nofollow_root_domains_to_page',
								'pages_to_subdomain',
								'nofollow_pages_to_subdomain',
								'redirect_pages_to_subdomain',
								'external_pages_to_subdomain',
								'external_nofollow_pages_to_subdomain',
								'external_redirect_pages_to_subdomain',
								'root_domains_to_subdomain',
								'nofollow_root_domains_to_subdomain',
								'pages_to_root_domain',
								'nofollow_pages_to_root_domain',
								'redirect_pages_to_root_domain',
								'external_pages_to_root_domain',
								'external_indirect_pages_to_root_domain',
								'external_nofollow_pages_to_root_domain',
								'external_redirect_pages_to_root_domain',
								'root_domains_to_root_domain',
								'indirect_root_domains_to_root_domain',
								'nofollow_root_domains_to_root_domain',
								'page_authority',
								'domain_authority',
								'root_domains_to_root_domain_by_root_domains',
								'nofollow_root_domains_to_root_domain_by_root_domains',
								'pages_to_root_domain_by_spam_score',
								'nofollow_pages_to_root_domain_by_spam_score',
								'root_domains_to_root_domain_by_spam_score',
								'nofollow_root_domains_to_root_domain_by_spam_score',
							])
							.describe(
								'Optional array of values for which to get daily history values. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](https://moz.com/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, `domain_authority`, `nofollow_pages_to_root_domain_by_spam_score`, `nofollow_root_domains_to_root_domain_by_root_domains`, `nofo',
							),
					)
					.describe(
						'Optional array of values for which to get daily history values. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, `domain_authority`, `nofollow_pages_to_root_domain_by_spam_score`, `nofollow_root_domains_to_root_domain_by_root_domains`, `nofollow_root_domai',
					)
					.optional(),
				get_monthly_history_deltas_for: z
					.array(
						z
							.enum([
								'pages_to_page',
								'nofollow_pages_to_page',
								'redirect_pages_to_page',
								'external_pages_to_page',
								'external_nofollow_pages_to_page',
								'external_redirect_pages_to_page',
								'root_domains_to_page',
								'indirect_root_domains_to_page',
								'nofollow_root_domains_to_page',
								'pages_to_subdomain',
								'nofollow_pages_to_subdomain',
								'redirect_pages_to_subdomain',
								'external_pages_to_subdomain',
								'external_nofollow_pages_to_subdomain',
								'external_redirect_pages_to_subdomain',
								'root_domains_to_subdomain',
								'nofollow_root_domains_to_subdomain',
								'pages_to_root_domain',
								'nofollow_pages_to_root_domain',
								'redirect_pages_to_root_domain',
								'external_pages_to_root_domain',
								'external_indirect_pages_to_root_domain',
								'external_nofollow_pages_to_root_domain',
								'external_redirect_pages_to_root_domain',
								'root_domains_to_root_domain',
								'indirect_root_domains_to_root_domain',
								'nofollow_root_domains_to_root_domain',
								'page_authority',
								'domain_authority',
							])
							.describe(
								'Optional array of values for which to get monthly history deltas. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](https://moz.com/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, and `domain_authority`. At least one value must be provided between `get_daily_history_deltas_for`, `get_daily_history_values_',
							),
					)
					.describe(
						'Optional array of values for which to get monthly history deltas. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, and `domain_authority`. At least one value must be provided between `get_daily_history_deltas_for`, `get_daily_history_values_for`, `get_mont',
					)
					.optional(),
				get_monthly_history_values_for: z
					.array(
						z
							.enum([
								'pages_to_page',
								'nofollow_pages_to_page',
								'redirect_pages_to_page',
								'external_pages_to_page',
								'external_nofollow_pages_to_page',
								'external_redirect_pages_to_page',
								'root_domains_to_page',
								'indirect_root_domains_to_page',
								'nofollow_root_domains_to_page',
								'pages_to_subdomain',
								'nofollow_pages_to_subdomain',
								'redirect_pages_to_subdomain',
								'external_pages_to_subdomain',
								'external_nofollow_pages_to_subdomain',
								'external_redirect_pages_to_subdomain',
								'root_domains_to_subdomain',
								'nofollow_root_domains_to_subdomain',
								'pages_to_root_domain',
								'nofollow_pages_to_root_domain',
								'redirect_pages_to_root_domain',
								'external_pages_to_root_domain',
								'external_indirect_pages_to_root_domain',
								'external_nofollow_pages_to_root_domain',
								'external_redirect_pages_to_root_domain',
								'root_domains_to_root_domain',
								'indirect_root_domains_to_root_domain',
								'nofollow_root_domains_to_root_domain',
								'page_authority',
								'domain_authority',
								'root_domains_to_root_domain_by_root_domains',
								'nofollow_root_domains_to_root_domain_by_root_domains',
								'pages_to_root_domain_by_spam_score',
								'nofollow_pages_to_root_domain_by_spam_score',
								'root_domains_to_root_domain_by_spam_score',
								'nofollow_root_domains_to_root_domain_by_spam_score',
							])
							.describe(
								'Optional array of values for which to get monthly history values. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](https://moz.com/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, `domain_authority`, `nofollow_pages_to_root_domain_by_spam_score`, `nofollow_root_domains_to_root_domain_by_root_domains`, `no',
							),
					)
					.describe(
						'Optional array of values for which to get monthly history values. Valid values are all non-deleted link count metrics from the site_metrics object in [Fetch Site Metrics](/api/docs/methods/DataSiteMetricsFetchAction) (`pages_to_page`, etc), `page_authority`, `domain_authority`, `nofollow_pages_to_root_domain_by_spam_score`, `nofollow_root_domains_to_root_domain_by_root_domains`, `nofollow_root_dom',
					)
					.optional(),
			})
			.strict(),
	'quota.lookup': () =>
		z
			.object({
				path: z
					.enum([
						'api.limits.mozscape.rows',
						'api.limits.data.rows',
						'api.limits.beta.rows',
					])
					.describe(
						'The quota path specifies a particular quota for which to retrieve information (e.g. beta or production quotas). The quota used by a particular method is specified in the Quota Usage section at the bottom of the method documentation.',
					),
			})
			.strict(),
	'rankingKeywords.count': () =>
		z
			.object({
				target_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'url'])
							.describe(
								'Ranking keyword count currently supports only the following scopes.',
							),
						locale: z
							.enum(['en-US', 'en-GB', 'en-CA', 'en-AU'])
							.describe(
								'The locale to search in. Only a limited subset of locales are supported for target queries - see the acceptable values below.',
							),
					})
					.strict()
					.describe('The target query to use for the ranking keyword count.'),
			})
			.strict(),
	'rankingKeywords.list': () =>
		z
			.object({
				target_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
						locale: z
							.enum(['en-US', 'en-GB', 'en-CA', 'en-AU'])
							.describe(
								'The locale to search in. Only a limited subset of locales are supported for target queries - see the acceptable values below.',
							),
					})
					.strict()
					.describe(
						'A TargetQuery provides a target URL along with several options to specify how the query is run.',
					),
				options: z
					.object({
						sort: z
							.enum(['rank', 'alpha', 'difficulty', 'volume'])
							.describe('Allowed sort options'),
					})
					.strict()
					.describe(
						'The options used when generating site ranking keywords result.',
					)
					.optional(),
				page: z
					.object({
						n: z.number().describe('The page number to load.').optional(),
						limit: z
							.number()
							.describe(
								'The number of results per page. May be any value from 1 to 500.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Control the number of results returned per call in addition to fetching additional results. The default "limit" is 25 with an "n" value of 0 (indicating the first page of results). Make subsequent calls to the endpoint with incrementing "n" values to fetch additional pages of results.',
					)
					.optional(),
			})
			.strict(),
	'redirects.fetch': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain', 'subfolder', 'url'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
			})
			.strict(),
	'test.ping': () =>
		z
			.object({
				message: z
					.string()
					.describe('A message to return to the caller.')
					.optional(),
				error: z
					.boolean()
					.describe(
						'If true, the request will fail instead of returning a message. Use this to exercise the error handling in your integration.',
					)
					.optional(),
			})
			.strict(),
	'test.pingAsync': () =>
		z
			.object({
				message: z
					.string()
					.describe('A message to return to the caller.')
					.optional(),
				error: z
					.boolean()
					.describe(
						'If true, the request will fail instead of returning a message. Use this to exercise the error handling in your integration.',
					)
					.optional(),
			})
			.strict(),
	'topPages.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().describe('A URL to query for.'),
						scope: z
							.enum(['domain', 'subdomain'])
							.describe(
								'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input. e.g. `moz.com/foo/bar` with a scope of `domain` will ultimately resolve to `moz.com`. options are `domain` or `subdomain`',
							),
					})
					.strict()
					.describe(
						'A SiteQuery provides a target URL along with a scope to define how the query is parsed.',
					),
				options: z
					.object({
						filter: z
							.enum([
								'all',
								'status_200',
								'status_301',
								'status_302',
								'status_4xx',
								'status_5xx',
							])
							.describe(
								'Only return results that match this filter. The valid values correspond to the http status code returned the most recent time a page was crawled.',
							)
							.optional(),
						sort: z
							.enum([
								'page_authority',
								'root_domains_to_page',
								'external_pages_to_page',
							])
							.describe(
								'The order to return results in. Results are returned in descending order (higher values first).',
							)
							.optional(),
					})
					.strict()
					.describe('Options for fetching top pages.')
					.optional(),
				offset: z
					.object({
						token: z
							.string()
							.nullable()
							.describe(
								'The provided token for pagination, if accessing a subsequent page of results. Exclude or provide `null` to start at the beginning of a set of results. Must have a value (provided in the previous request) to access the next page of results.',
							)
							.optional(),
						limit: z
							.number()
							.describe(
								'The limit of results to return. Must be between 1 and 50.',
							)
							.optional(),
					})
					.strict()
					.describe(
						'Limit and pagination controls. Optionally specify the total number of desired results and, after the first request has been made, access results on the next page of results.',
					)
					.optional(),
			})
			.strict(),
} as const;

export const mozOutputBuilders = {
	'anchorText.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				anchor_texts: z
					.array(
						z
							.object({
								text: z.string().nullish(),
								external_root_domains: z.number().nullish(),
								external_pages: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'competitors.fetch': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z
							.object({
								target_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										locale: z.string().nullish(),
										original_target_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												locale: z.string().nullish(),
											})
											.loose()
											.nullish(),
										suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												locale: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								competitors: z
									.array(
										z
											.object({
												domain: z.string().nullish(),
												domain_authority: z.number().nullish(),
												proximity: z.number().nullish(),
												overlap: z.number().nullish(),
												relevance: z.number().nullish(),
												rivalry: z.number().nullish(),
												keywords: z.array(z.string().nullish()).nullish(),
											})
											.loose()
											.nullish(),
									)
									.nullish(),
							})
							.loose()
							.nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'global.topDomains': () =>
		z
			.object({
				page: z
					.object({ n: z.number().nullish(), limit: z.number().nullish() })
					.loose()
					.nullish(),
				top_domains: z
					.array(
						z
							.object({
								page: z.string().nullish(),
								subdomain: z.string().nullish(),
								root_domain: z.string().nullish(),
								title: z.string().nullish(),
								last_crawled: z.string().nullish(),
								http_code: z.number().nullish(),
								pages_to_page: z.number().nullish(),
								nofollow_pages_to_page: z.number().nullish(),
								redirect_pages_to_page: z.number().nullish(),
								external_pages_to_page: z.number().nullish(),
								external_nofollow_pages_to_page: z.number().nullish(),
								external_redirect_pages_to_page: z.number().nullish(),
								deleted_pages_to_page: z.number().nullish(),
								root_domains_to_page: z.number().nullish(),
								indirect_root_domains_to_page: z.number().nullish(),
								deleted_root_domains_to_page: z.number().nullish(),
								nofollow_root_domains_to_page: z.number().nullish(),
								pages_to_subdomain: z.number().nullish(),
								nofollow_pages_to_subdomain: z.number().nullish(),
								redirect_pages_to_subdomain: z.number().nullish(),
								external_pages_to_subdomain: z.number().nullish(),
								external_nofollow_pages_to_subdomain: z.number().nullish(),
								external_redirect_pages_to_subdomain: z.number().nullish(),
								deleted_pages_to_subdomain: z.number().nullish(),
								root_domains_to_subdomain: z.number().nullish(),
								deleted_root_domains_to_subdomain: z.number().nullish(),
								nofollow_root_domains_to_subdomain: z.number().nullish(),
								pages_to_root_domain: z.number().nullish(),
								nofollow_pages_to_root_domain: z.number().nullish(),
								redirect_pages_to_root_domain: z.number().nullish(),
								external_pages_to_root_domain: z.number().nullish(),
								external_indirect_pages_to_root_domain: z.number().nullish(),
								external_nofollow_pages_to_root_domain: z.number().nullish(),
								external_redirect_pages_to_root_domain: z.number().nullish(),
								deleted_pages_to_root_domain: z.number().nullish(),
								root_domains_to_root_domain: z.number().nullish(),
								indirect_root_domains_to_root_domain: z.number().nullish(),
								deleted_root_domains_to_root_domain: z.number().nullish(),
								nofollow_root_domains_to_root_domain: z.number().nullish(),
								page_authority: z.number().nullish(),
								domain_authority: z.number().nullish(),
								link_propensity: z.number().nullish(),
								spam_score: z.number().nullish(),
								root_domains_from_page: z.number().nullish(),
								nofollow_root_domains_from_page: z.number().nullish(),
								pages_from_page: z.number().nullish(),
								nofollow_pages_from_page: z.number().nullish(),
								root_domains_from_root_domain: z.number().nullish(),
								nofollow_root_domains_from_root_domain: z.number().nullish(),
								pages_from_root_domain: z.number().nullish(),
								nofollow_pages_from_root_domain: z.number().nullish(),
								pages_crawled_from_root_domain: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'global.topPages': () =>
		z
			.object({
				page: z
					.object({ n: z.number().nullish(), limit: z.number().nullish() })
					.loose()
					.nullish(),
				top_pages: z
					.array(
						z
							.object({
								page: z.string().nullish(),
								subdomain: z.string().nullish(),
								root_domain: z.string().nullish(),
								title: z.string().nullish(),
								last_crawled: z.string().nullish(),
								http_code: z.number().nullish(),
								pages_to_page: z.number().nullish(),
								nofollow_pages_to_page: z.number().nullish(),
								redirect_pages_to_page: z.number().nullish(),
								external_pages_to_page: z.number().nullish(),
								external_nofollow_pages_to_page: z.number().nullish(),
								external_redirect_pages_to_page: z.number().nullish(),
								deleted_pages_to_page: z.number().nullish(),
								root_domains_to_page: z.number().nullish(),
								indirect_root_domains_to_page: z.number().nullish(),
								deleted_root_domains_to_page: z.number().nullish(),
								nofollow_root_domains_to_page: z.number().nullish(),
								pages_to_subdomain: z.number().nullish(),
								nofollow_pages_to_subdomain: z.number().nullish(),
								redirect_pages_to_subdomain: z.number().nullish(),
								external_pages_to_subdomain: z.number().nullish(),
								external_nofollow_pages_to_subdomain: z.number().nullish(),
								external_redirect_pages_to_subdomain: z.number().nullish(),
								deleted_pages_to_subdomain: z.number().nullish(),
								root_domains_to_subdomain: z.number().nullish(),
								deleted_root_domains_to_subdomain: z.number().nullish(),
								nofollow_root_domains_to_subdomain: z.number().nullish(),
								pages_to_root_domain: z.number().nullish(),
								nofollow_pages_to_root_domain: z.number().nullish(),
								redirect_pages_to_root_domain: z.number().nullish(),
								external_pages_to_root_domain: z.number().nullish(),
								external_indirect_pages_to_root_domain: z.number().nullish(),
								external_nofollow_pages_to_root_domain: z.number().nullish(),
								external_redirect_pages_to_root_domain: z.number().nullish(),
								deleted_pages_to_root_domain: z.number().nullish(),
								root_domains_to_root_domain: z.number().nullish(),
								indirect_root_domains_to_root_domain: z.number().nullish(),
								deleted_root_domains_to_root_domain: z.number().nullish(),
								nofollow_root_domains_to_root_domain: z.number().nullish(),
								page_authority: z.number().nullish(),
								domain_authority: z.number().nullish(),
								link_propensity: z.number().nullish(),
								spam_score: z.number().nullish(),
								root_domains_from_page: z.number().nullish(),
								nofollow_root_domains_from_page: z.number().nullish(),
								pages_from_page: z.number().nullish(),
								nofollow_pages_from_page: z.number().nullish(),
								root_domains_from_root_domain: z.number().nullish(),
								nofollow_root_domains_from_root_domain: z.number().nullish(),
								pages_from_root_domain: z.number().nullish(),
								nofollow_pages_from_root_domain: z.number().nullish(),
								pages_crawled_from_root_domain: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'index.fetch': () =>
		z.object({ index_id: z.string().nullish() }).loose().nullish(),
	'jobs.lookup': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z.record(z.string(), z.unknown()).nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.difficulty': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						volume: z.unknown(),
						difficulty: z.number().nullish(),
						organic_ctr: z.unknown(),
						priority: z.unknown(),
						intent: z.unknown(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.generateMetrics': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z
							.object({
								keyword_metrics: z
									.object({
										volume: z.number().nullish(),
										difficulty: z.number().nullish(),
										organic_ctr: z.number().nullish(),
										priority: z.number().nullish(),
										intent: z
											.object({
												primary_intents: z
													.array(z.string().nullish())
													.nullish(),
												all_intents: z
													.array(
														z
															.object({
																label: z.string().nullish(),
																score: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								serp_query: z
									.object({
										keyword: z.string().nullish(),
										locale: z.string().nullish(),
										device: z.string().nullish(),
										engine: z.string().nullish(),
										vicinity: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.generateSerp': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z
							.object({
								serp_query: z
									.object({
										keyword: z.string().nullish(),
										locale: z.string().nullish(),
										device: z.string().nullish(),
										engine: z.string().nullish(),
										vicinity: z.string().nullish(),
									})
									.loose()
									.nullish(),
								serp: z
									.object({
										metadata: z
											.object({ collected_at: z.string().nullish() })
											.loose()
											.nullish(),
										metrics: z
											.object({
												volume: z.number().nullish(),
												difficulty: z.number().nullish(),
												organic_ctr: z.number().nullish(),
												priority: z.number().nullish(),
												intent: z
													.object({
														primary_intents: z
															.array(z.string().nullish())
															.nullish(),
														all_intents: z
															.array(
																z
																	.object({
																		label: z.string().nullish(),
																		score: z.number().nullish(),
																	})
																	.loose()
																	.nullish(),
															)
															.nullish(),
													})
													.loose()
													.nullish(),
											})
											.loose()
											.nullish(),
										results: z
											.array(
												z
													.object({
														type: z.string().nullish(),
														description: z.string().nullish(),
														position: z.string().nullish(),
														title: z.string().nullish(),
														traits: z.array(z.string().nullish()).nullish(),
														url: z.string().nullish(),
														price: z.string().nullish(),
														rating: z.string().nullish(),
														reviews: z.string().nullish(),
														question: z.string().nullish(),
														displayed_path: z.string().nullish(),
														job_title: z.string().nullish(),
														job_employer: z.string().nullish(),
														job_location: z.string().nullish(),
														job_source: z.string().nullish(),
														job_posted_on: z.string().nullish(),
														job_travel_time: z.string().nullish(),
														job_details: z.string().nullish(),
														business_name: z.string().nullish(),
														related_searches: z
															.array(z.string().nullish())
															.nullish(),
														results: z
															.array(
																z.record(z.string(), z.unknown()).nullish(),
															)
															.nullish(),
														sitelinks: z
															.array(
																z.record(z.string(), z.unknown()).nullish(),
															)
															.nullish(),
														one_line_sitelinks: z
															.array(
																z.record(z.string(), z.unknown()).nullish(),
															)
															.nullish(),
														position_index: z.number().nullish(),
														rank: z.number().nullish(),
														brand_authority: z.number().nullish(),
														url_metrics: z
															.object({
																page: z.string().nullish(),
																subdomain: z.string().nullish(),
																root_domain: z.string().nullish(),
																title: z.string().nullish(),
																last_crawled: z.string().nullish(),
																http_code: z.number().nullish(),
																pages_to_page: z.number().nullish(),
																nofollow_pages_to_page: z.number().nullish(),
																redirect_pages_to_page: z.number().nullish(),
																external_pages_to_page: z.number().nullish(),
																external_nofollow_pages_to_page: z
																	.number()
																	.nullish(),
																external_redirect_pages_to_page: z
																	.number()
																	.nullish(),
																deleted_pages_to_page: z.number().nullish(),
																root_domains_to_page: z.number().nullish(),
																indirect_root_domains_to_page: z
																	.number()
																	.nullish(),
																deleted_root_domains_to_page: z
																	.number()
																	.nullish(),
																nofollow_root_domains_to_page: z
																	.number()
																	.nullish(),
																pages_to_subdomain: z.number().nullish(),
																nofollow_pages_to_subdomain: z
																	.number()
																	.nullish(),
																redirect_pages_to_subdomain: z
																	.number()
																	.nullish(),
																external_pages_to_subdomain: z
																	.number()
																	.nullish(),
																external_nofollow_pages_to_subdomain: z
																	.number()
																	.nullish(),
																external_redirect_pages_to_subdomain: z
																	.number()
																	.nullish(),
																deleted_pages_to_subdomain: z
																	.number()
																	.nullish(),
																root_domains_to_subdomain: z.number().nullish(),
																deleted_root_domains_to_subdomain: z
																	.number()
																	.nullish(),
																nofollow_root_domains_to_subdomain: z
																	.number()
																	.nullish(),
																pages_to_root_domain: z.number().nullish(),
																nofollow_pages_to_root_domain: z
																	.number()
																	.nullish(),
																redirect_pages_to_root_domain: z
																	.number()
																	.nullish(),
																external_pages_to_root_domain: z
																	.number()
																	.nullish(),
																external_indirect_pages_to_root_domain: z
																	.number()
																	.nullish(),
																external_nofollow_pages_to_root_domain: z
																	.number()
																	.nullish(),
																external_redirect_pages_to_root_domain: z
																	.number()
																	.nullish(),
																deleted_pages_to_root_domain: z
																	.number()
																	.nullish(),
																root_domains_to_root_domain: z
																	.number()
																	.nullish(),
																indirect_root_domains_to_root_domain: z
																	.number()
																	.nullish(),
																deleted_root_domains_to_root_domain: z
																	.number()
																	.nullish(),
																nofollow_root_domains_to_root_domain: z
																	.number()
																	.nullish(),
																page_authority: z.number().nullish(),
																domain_authority: z.number().nullish(),
																link_propensity: z.number().nullish(),
																spam_score: z.number().nullish(),
																root_domains_from_page: z.number().nullish(),
																nofollow_root_domains_from_page: z
																	.number()
																	.nullish(),
																pages_from_page: z.number().nullish(),
																nofollow_pages_from_page: z.number().nullish(),
																root_domains_from_root_domain: z
																	.number()
																	.nullish(),
																nofollow_root_domains_from_root_domain: z
																	.number()
																	.nullish(),
																pages_from_root_domain: z.number().nullish(),
																nofollow_pages_from_root_domain: z
																	.number()
																	.nullish(),
																pages_crawled_from_root_domain: z
																	.number()
																	.nullish(),
															})
															.loose()
															.nullish(),
													})
													.loose()
													.nullish(),
											)
											.nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.intent': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						volume: z.unknown(),
						difficulty: z.unknown(),
						organic_ctr: z.unknown(),
						priority: z.unknown(),
						intent: z
							.object({
								primary_intents: z.array(z.string().nullish()).nullish(),
								all_intents: z
									.array(
										z
											.object({
												label: z.string().nullish(),
												score: z.number().nullish(),
											})
											.loose()
											.nullish(),
									)
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.metrics': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						volume: z.number().nullish(),
						difficulty: z.number().nullish(),
						organic_ctr: z.number().nullish(),
						priority: z.number().nullish(),
						intent: z
							.object({
								primary_intents: z.array(z.string().nullish()).nullish(),
								all_intents: z
									.array(
										z
											.object({
												label: z.string().nullish(),
												score: z.number().nullish(),
											})
											.loose()
											.nullish(),
									)
									.nullish(),
							})
							.loose()
							.nullish(),
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.metricsMultiple': () =>
		z
			.object({
				results_by_serp_query: z
					.array(
						z
							.object({
								serp_query: z
									.object({
										keyword: z.string().nullish(),
										locale: z.string().nullish(),
										device: z.string().nullish(),
										engine: z.string().nullish(),
										vicinity: z.string().nullish(),
									})
									.loose()
									.nullish(),
								keyword_metrics: z
									.object({
										volume: z.number().nullish(),
										difficulty: z.number().nullish(),
										organic_ctr: z.number().nullish(),
										priority: z.number().nullish(),
										intent: z
											.object({
												primary_intents: z
													.array(z.string().nullish())
													.nullish(),
												all_intents: z
													.array(
														z
															.object({
																label: z.string().nullish(),
																score: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				errors_by_serp_query: z
					.array(
						z
							.object({
								serp_query: z
									.object({
										keyword: z.string().nullish(),
										locale: z.string().nullish(),
										device: z.string().nullish(),
										engine: z.string().nullish(),
										vicinity: z.string().nullish(),
									})
									.loose()
									.nullish(),
								error: z
									.object({
										message: z.string().nullish(),
										name: z.string().nullish(),
										data: z
											.object({
												key: z.string().nullish(),
												value: z.string().nullish(),
											})
											.loose()
											.nullish(),
										httpStatus: z.number().nullish(),
										jsonrpcCode: z.number().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.opportunity': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						volume: z.unknown(),
						difficulty: z.unknown(),
						organic_ctr: z.number().nullish(),
						priority: z.unknown(),
						intent: z.unknown(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.priority': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						volume: z.unknown(),
						difficulty: z.unknown(),
						organic_ctr: z.unknown(),
						priority: z.number().nullish(),
						intent: z.unknown(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.serp': () =>
		z
			.object({
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z.object({ max_age: z.number().nullish() }).loose().nullish(),
				serp: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						metrics: z
							.object({
								volume: z.number().nullish(),
								difficulty: z.number().nullish(),
								organic_ctr: z.number().nullish(),
								priority: z.number().nullish(),
								intent: z
									.object({
										primary_intents: z.array(z.string().nullish()).nullish(),
										all_intents: z
											.array(
												z
													.object({
														label: z.string().nullish(),
														score: z.number().nullish(),
													})
													.loose()
													.nullish(),
											)
											.nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						results: z
							.array(
								z
									.object({
										type: z.string().nullish(),
										description: z.string().nullish(),
										position: z.string().nullish(),
										title: z.string().nullish(),
										traits: z.array(z.string().nullish()).nullish(),
										url: z.string().nullish(),
										price: z.string().nullish(),
										rating: z.string().nullish(),
										reviews: z.string().nullish(),
										question: z.string().nullish(),
										displayed_path: z.string().nullish(),
										job_title: z.string().nullish(),
										job_employer: z.string().nullish(),
										job_location: z.string().nullish(),
										job_source: z.string().nullish(),
										job_posted_on: z.string().nullish(),
										job_travel_time: z.string().nullish(),
										job_details: z.string().nullish(),
										business_name: z.string().nullish(),
										related_searches: z.array(z.string().nullish()).nullish(),
										results: z
											.array(z.record(z.string(), z.unknown()).nullish())
											.nullish(),
										sitelinks: z
											.array(z.record(z.string(), z.unknown()).nullish())
											.nullish(),
										one_line_sitelinks: z
											.array(z.record(z.string(), z.unknown()).nullish())
											.nullish(),
										position_index: z.number().nullish(),
										rank: z.number().nullish(),
										brand_authority: z.number().nullish(),
										url_metrics: z
											.object({
												page: z.string().nullish(),
												subdomain: z.string().nullish(),
												root_domain: z.string().nullish(),
												title: z.string().nullish(),
												last_crawled: z.string().nullish(),
												http_code: z.number().nullish(),
												pages_to_page: z.number().nullish(),
												nofollow_pages_to_page: z.number().nullish(),
												redirect_pages_to_page: z.number().nullish(),
												external_pages_to_page: z.number().nullish(),
												external_nofollow_pages_to_page: z.number().nullish(),
												external_redirect_pages_to_page: z.number().nullish(),
												deleted_pages_to_page: z.number().nullish(),
												root_domains_to_page: z.number().nullish(),
												indirect_root_domains_to_page: z.number().nullish(),
												deleted_root_domains_to_page: z.number().nullish(),
												nofollow_root_domains_to_page: z.number().nullish(),
												pages_to_subdomain: z.number().nullish(),
												nofollow_pages_to_subdomain: z.number().nullish(),
												redirect_pages_to_subdomain: z.number().nullish(),
												external_pages_to_subdomain: z.number().nullish(),
												external_nofollow_pages_to_subdomain: z
													.number()
													.nullish(),
												external_redirect_pages_to_subdomain: z
													.number()
													.nullish(),
												deleted_pages_to_subdomain: z.number().nullish(),
												root_domains_to_subdomain: z.number().nullish(),
												deleted_root_domains_to_subdomain: z.number().nullish(),
												nofollow_root_domains_to_subdomain: z
													.number()
													.nullish(),
												pages_to_root_domain: z.number().nullish(),
												nofollow_pages_to_root_domain: z.number().nullish(),
												redirect_pages_to_root_domain: z.number().nullish(),
												external_pages_to_root_domain: z.number().nullish(),
												external_indirect_pages_to_root_domain: z
													.number()
													.nullish(),
												external_nofollow_pages_to_root_domain: z
													.number()
													.nullish(),
												external_redirect_pages_to_root_domain: z
													.number()
													.nullish(),
												deleted_pages_to_root_domain: z.number().nullish(),
												root_domains_to_root_domain: z.number().nullish(),
												indirect_root_domains_to_root_domain: z
													.number()
													.nullish(),
												deleted_root_domains_to_root_domain: z
													.number()
													.nullish(),
												nofollow_root_domains_to_root_domain: z
													.number()
													.nullish(),
												page_authority: z.number().nullish(),
												domain_authority: z.number().nullish(),
												link_propensity: z.number().nullish(),
												spam_score: z.number().nullish(),
												root_domains_from_page: z.number().nullish(),
												nofollow_root_domains_from_page: z.number().nullish(),
												pages_from_page: z.number().nullish(),
												nofollow_pages_from_page: z.number().nullish(),
												root_domains_from_root_domain: z.number().nullish(),
												nofollow_root_domains_from_root_domain: z
													.number()
													.nullish(),
												pages_from_root_domain: z.number().nullish(),
												nofollow_pages_from_root_domain: z.number().nullish(),
												pages_crawled_from_root_domain: z.number().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
							)
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.suggestions': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z
							.object({
								suggestions: z
									.array(
										z
											.object({
												keyword: z.string().nullish(),
												relevance: z.number().nullish(),
											})
											.loose()
											.nullish(),
									)
									.nullish(),
								serp_query: z
									.object({
										keyword: z.string().nullish(),
										locale: z.string().nullish(),
										device: z.string().nullish(),
										engine: z.string().nullish(),
										vicinity: z.string().nullish(),
									})
									.loose()
									.nullish(),
								options: z
									.object({ strategy: z.string().nullish() })
									.loose()
									.nullish(),
								page: z
									.object({
										n: z.number().nullish(),
										limit: z.number().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'keywords.volume': () =>
		z
			.object({
				keyword_metrics: z
					.object({
						metadata: z
							.object({ collected_at: z.string().nullish() })
							.loose()
							.nullish(),
						volume: z.number().nullish(),
						difficulty: z.unknown(),
						organic_ctr: z.unknown(),
						priority: z.unknown(),
						intent: z.unknown(),
					})
					.loose()
					.nullish(),
				serp_query: z
					.object({
						keyword: z.string().nullish(),
						locale: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						vicinity: z.string().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({
						include_intent: z.union([z.boolean(), z.number()]).nullish(),
						max_age: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'linkingDomains.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				linking_domains: z
					.array(
						z
							.object({
								site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								link_propensity: z.number().nullish(),
								targeted_pages: z.number().nullish(),
								targeted_nofollow_pages: z.number().nullish(),
								targeted_redirect_pages: z.number().nullish(),
								targeted_deleted_pages: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						sort: z.string().nullish(),
						filters: z.array(z.string().nullish()).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'linkingDomains.recentlyGained': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				gained_linking_domains: z
					.array(
						z
							.object({
								site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								link_propensity: z.number().nullish(),
								targeted_pages: z.number().nullish(),
								targeted_nofollow_pages: z.number().nullish(),
								targeted_redirect_pages: z.number().nullish(),
								targeted_deleted_pages: z.number().nullish(),
								date_gained: z.string().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						begin_date: z.string().nullish(),
						end_date: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'linkingDomains.recentlyLost': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				lost_linking_domains: z
					.array(
						z
							.object({
								site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								link_propensity: z.number().nullish(),
								targeted_pages: z.number().nullish(),
								targeted_nofollow_pages: z.number().nullish(),
								targeted_redirect_pages: z.number().nullish(),
								targeted_deleted_pages: z.number().nullish(),
								date_lost: z.string().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						begin_date: z.string().nullish(),
						end_date: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'links.filterByAnchorText': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				links: z
					.array(
						z
							.object({
								source_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								target_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								anchor_text: z.string().nullish(),
								date_first_seen: z.string().nullish(),
								date_last_seen: z.string().nullish(),
								date_disappeared: z.string().nullish(),
								nofollow: z.union([z.boolean(), z.number()]).nullish(),
								redirect: z.union([z.boolean(), z.number()]).nullish(),
								rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
								via_redirect: z.union([z.boolean(), z.number()]).nullish(),
								via_rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						scope: z.string().nullish(),
						subdomains_limited_to_one: z.array(z.string().nullish()).nullish(),
						sort: z.string().nullish(),
						filters: z.array(z.string().nullish()).nullish(),
					})
					.loose()
					.nullish(),
				anchor_text: z.unknown().nullish(),
			})
			.loose()
			.nullish(),
	'links.filterByDomain': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				domain_site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				links: z
					.array(
						z
							.object({
								source_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								target_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								anchor_text: z.string().nullish(),
								date_first_seen: z.string().nullish(),
								date_last_seen: z.string().nullish(),
								date_disappeared: z.string().nullish(),
								nofollow: z.union([z.boolean(), z.number()]).nullish(),
								redirect: z.union([z.boolean(), z.number()]).nullish(),
								rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
								via_redirect: z.union([z.boolean(), z.number()]).nullish(),
								via_rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						scope: z.string().nullish(),
						subdomains_limited_to_one: z.array(z.string().nullish()).nullish(),
						sort: z.string().nullish(),
						filters: z.array(z.string().nullish()).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'links.intersect': () =>
		z
			.object({
				is_linking_to: z
					.array(
						z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								original_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
									})
									.loose()
									.nullish(),
								site_query_suggestion: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				not_linking_to: z
					.array(
						z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								original_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
									})
									.loose()
									.nullish(),
								site_query_suggestion: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						minimum_matching_targets: z.number().nullish(),
						scope: z.string().nullish(),
						sort: z.string().nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				link_intersects: z
					.array(
						z
							.object({
								page: z.string().nullish(),
								title: z.string().nullish(),
								domain_authority: z.number().nullish(),
								spam_score: z.number().nullish(),
								matching_target_indexes: z
									.array(z.number().nullish())
									.nullish(),
								matching_source_pages: z
									.array(
										z
											.object({
												page: z.string().nullish(),
												page_authority: z.number().nullish(),
											})
											.loose()
											.nullish(),
									)
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'links.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				links: z
					.array(
						z
							.object({
								source_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								target_site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
								anchor_text: z.string().nullish(),
								date_first_seen: z.string().nullish(),
								date_last_seen: z.string().nullish(),
								date_disappeared: z.string().nullish(),
								nofollow: z.union([z.boolean(), z.number()]).nullish(),
								redirect: z.union([z.boolean(), z.number()]).nullish(),
								rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
								via_redirect: z.union([z.boolean(), z.number()]).nullish(),
								via_rel_canonical: z.union([z.boolean(), z.number()]).nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				options: z
					.object({
						scope: z.string().nullish(),
						subdomains_limited_to_one: z.array(z.string().nullish()).nullish(),
						sort: z.string().nullish(),
						filters: z.array(z.string().nullish()).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'links.status': () =>
		z
			.object({
				target_site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				source_site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				exists: z.union([z.boolean(), z.number()]).nullish(),
			})
			.loose()
			.nullish(),
	'links.statusMultiple': () =>
		z
			.object({
				results_by_query: z
					.array(
						z
							.object({
								target_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								source_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								exists: z.union([z.boolean(), z.number()]).nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				errors_by_query: z
					.array(
						z
							.object({
								target_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								source_site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								error: z
									.object({
										message: z.string().nullish(),
										name: z.string().nullish(),
										data: z
											.object({
												key: z.string().nullish(),
												value: z.string().nullish(),
											})
											.loose()
											.nullish(),
										httpStatus: z.number().nullish(),
										jsonrpcCode: z.number().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.accounts.create': () =>
		z
			.object({
				account: z
					.object({ id: z.number().nullish(), name: z.string().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.accounts.list': () =>
		z
			.object({
				accounts: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									name: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.accounts.lookup': () =>
		z
			.object({
				account: z
					.object({ id: z.number().nullish(), name: z.string().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.customFields.create': () =>
		z
			.object({
				custom_field: z
					.object({
						id: z.number().nullish(),
						account_id: z.number().nullish(),
						name: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.customFields.listForAccount': () =>
		z
			.object({
				custom_fields: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									account_id: z.number().nullish(),
									name: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.customFields.lookup': () =>
		z
			.object({
				custom_field: z
					.object({
						id: z.number().nullish(),
						account_id: z.number().nullish(),
						name: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.addLocation': () => z.record(z.string(), z.unknown()).nullish(),
	'local.groups.create': () =>
		z
			.object({
				group: z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						account_id: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.list': () =>
		z
			.object({
				groups: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									name: z.string().nullish(),
									account_id: z.number().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.listForAccount': () =>
		z
			.object({
				groups: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									name: z.string().nullish(),
									account_id: z.number().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.listLocations': () =>
		z
			.object({
				locations: z
					.union([
						z.array(z.object({ id: z.number().nullish() }).loose().nullish()),
						z.string(),
					])
					.nullish(),
				page: z
					.object({
						n: z.number().nullish(),
						limit: z.number().nullish(),
						order: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.lookup': () =>
		z
			.object({
				group: z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						account_id: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.groups.removeLocation': () =>
		z.record(z.string(), z.unknown()).nullish(),
	'local.locations.cancel': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.number().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.categories': () =>
		z
			.object({
				categories: z
					.union([
						z.array(
							z
								.object({
									id: z.string().nullish(),
									name: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.close': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.number().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.create': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.unknown().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.fieldIssues': () =>
		z
			.object({
				field_issues: z
					.union([
						z.array(
							z
								.object({
									location_id: z.number().nullish(),
									network_type: z.string().nullish(),
									network_name: z.string().nullish(),
									field_name: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.fieldStatuses': () =>
		z
			.object({
				field_statuses: z
					.union([
						z.array(
							z
								.object({
									field_name: z.string().nullish(),
									networks_with_field: z.number().nullish(),
									healthy_networks: z.number().nullish(),
									pending_issues: z.number().nullish(),
									solved_issues: z.number().nullish(),
									dismissed_issues: z.number().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.gbpImpressionHistory': () =>
		z
			.object({
				gbp_impression_history: z
					.object({
						location_id: z.number().nullish(),
						date_start: z.string().nullish(),
						date_end: z.string().nullish(),
						keyword_limit: z.number().nullish(),
						gbp_impression_history_reports: z
							.union([
								z.array(
									z
										.object({
											date: z.string().nullish(),
											impressions: z
												.union([
													z.array(
														z
															.object({
																keyword: z.string().nullish(),
																value: z.number().nullish(),
															})
															.loose()
															.nullish(),
													),
													z.string(),
												])
												.nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.gbpImpressionTotals': () =>
		z
			.object({
				gbp_impression_total: z
					.object({
						location_id: z.number().nullish(),
						date_start: z.string().nullish(),
						date_end: z.string().nullish(),
						gbp_impression_keyword_totals: z
							.union([
								z.array(
									z
										.object({
											keyword: z.string().nullish(),
											value: z.number().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
					})
					.loose()
					.nullish(),
				page: z
					.object({ n: z.number().nullish(), limit: z.number().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.gbpLeadHistory': () =>
		z
			.object({
				gbp_lead_history: z
					.object({
						location_id: z.number().nullish(),
						date_start: z.string().nullish(),
						date_end: z.string().nullish(),
						date_aggregation: z.string().nullish(),
						gbp_lead_history_reports: z
							.union([
								z.array(
									z
										.object({
											date: z.string().nullish(),
											total_leads: z.number().nullish(),
											actions_website: z.number().nullish(),
											actions_phone: z.number().nullish(),
											actions_driving_directions: z.number().nullish(),
											total_impressions: z.number().nullish(),
											ctr: z.number().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.levels': () =>
		z
			.object({
				levels: z.union([z.array(z.string().nullish()), z.string()]).nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.list': () =>
		z
			.object({
				locations: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									level: z.string().nullish(),
									status: z.string().nullish(),
									account_id: z.number().nullish(),
									auto_sync_enabled: z
										.union([z.boolean(), z.number()])
										.nullish(),
									custom_fields: z.record(z.string(), z.unknown()).nullish(),
									remote_id: z.string().nullish(),
									listings_name: z.string().nullish(),
									location_name: z.string().nullish(),
									website_url: z.string().nullish(),
									email_address: z.string().nullish(),
									timezone: z.string().nullish(),
									store_code: z.string().nullish(),
									short_description: z.string().nullish(),
									long_description: z.string().nullish(),
									languages: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									keywords: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									brands: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									payment_forms: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									price_range: z.string().nullish(),
									service_areas: z
										.union([
											z.array(
												z
													.object({
														text: z.string().nullish(),
														id: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									service_area_only: z
										.union([z.boolean(), z.number()])
										.nullish(),
									services: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									primary_category: z.string().nullish(),
									additional_categories: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									attributes: z
										.union([
											z.array(
												z
													.object({
														id: z.string().nullish(),
														value: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									address: z
										.object({
											address_line_1: z.string().nullish(),
											address_line_2: z.string().nullish(),
											sublocality: z.string().nullish(),
											county: z.string().nullish(),
											city: z.string().nullish(),
											state_province: z.string().nullish(),
											postal_code: z.string().nullish(),
											country: z.string().nullish(),
										})
										.loose()
										.nullish(),
									lat: z.number().nullish(),
									long: z.number().nullish(),
									opening_status: z.string().nullish(),
									reopen_date: z.string().nullish(),
									hours: z
										.object({
											monday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											tuesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											wednesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											thursday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											friday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											saturday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											sunday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
										})
										.loose()
										.nullish(),
									more_hours: z.record(z.string(), z.unknown()).nullish(),
									opening_hours_notes: z.string().nullish(),
									opening_date: z.string().nullish(),
									special_hours: z.record(z.string(), z.unknown()).nullish(),
									phone: z.string().nullish(),
									fax: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.listByStatus': () =>
		z
			.object({
				status: z.string().nullish(),
				locations: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									level: z.string().nullish(),
									status: z.string().nullish(),
									account_id: z.number().nullish(),
									auto_sync_enabled: z
										.union([z.boolean(), z.number()])
										.nullish(),
									custom_fields: z.record(z.string(), z.unknown()).nullish(),
									remote_id: z.string().nullish(),
									listings_name: z.string().nullish(),
									location_name: z.string().nullish(),
									website_url: z.string().nullish(),
									email_address: z.string().nullish(),
									timezone: z.string().nullish(),
									store_code: z.string().nullish(),
									short_description: z.string().nullish(),
									long_description: z.string().nullish(),
									languages: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									keywords: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									brands: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									payment_forms: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									price_range: z.string().nullish(),
									service_areas: z
										.union([
											z.array(
												z
													.object({
														text: z.string().nullish(),
														id: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									service_area_only: z
										.union([z.boolean(), z.number()])
										.nullish(),
									services: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									primary_category: z.string().nullish(),
									additional_categories: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									attributes: z
										.union([
											z.array(
												z
													.object({
														id: z.string().nullish(),
														value: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									address: z
										.object({
											address_line_1: z.string().nullish(),
											address_line_2: z.string().nullish(),
											sublocality: z.string().nullish(),
											county: z.string().nullish(),
											city: z.string().nullish(),
											state_province: z.string().nullish(),
											postal_code: z.string().nullish(),
											country: z.string().nullish(),
										})
										.loose()
										.nullish(),
									lat: z.number().nullish(),
									long: z.number().nullish(),
									opening_status: z.string().nullish(),
									reopen_date: z.string().nullish(),
									hours: z
										.object({
											monday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											tuesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											wednesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											thursday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											friday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											saturday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											sunday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
										})
										.loose()
										.nullish(),
									more_hours: z.record(z.string(), z.unknown()).nullish(),
									opening_hours_notes: z.string().nullish(),
									opening_date: z.string().nullish(),
									special_hours: z.record(z.string(), z.unknown()).nullish(),
									phone: z.string().nullish(),
									fax: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.listForAccount': () =>
		z
			.object({
				locations: z
					.union([
						z.array(
							z
								.object({
									id: z.number().nullish(),
									level: z.string().nullish(),
									status: z.string().nullish(),
									account_id: z.number().nullish(),
									auto_sync_enabled: z
										.union([z.boolean(), z.number()])
										.nullish(),
									custom_fields: z.record(z.string(), z.unknown()).nullish(),
									remote_id: z.string().nullish(),
									listings_name: z.string().nullish(),
									location_name: z.string().nullish(),
									website_url: z.string().nullish(),
									email_address: z.string().nullish(),
									timezone: z.string().nullish(),
									store_code: z.string().nullish(),
									short_description: z.string().nullish(),
									long_description: z.string().nullish(),
									languages: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									keywords: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									brands: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									payment_forms: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									price_range: z.string().nullish(),
									service_areas: z
										.union([
											z.array(
												z
													.object({
														text: z.string().nullish(),
														id: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									service_area_only: z
										.union([z.boolean(), z.number()])
										.nullish(),
									services: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									primary_category: z.string().nullish(),
									additional_categories: z
										.union([z.array(z.string().nullish()), z.string()])
										.nullish(),
									attributes: z
										.union([
											z.array(
												z
													.object({
														id: z.string().nullish(),
														value: z.string().nullish(),
													})
													.loose()
													.nullish(),
											),
											z.string(),
										])
										.nullish(),
									address: z
										.object({
											address_line_1: z.string().nullish(),
											address_line_2: z.string().nullish(),
											sublocality: z.string().nullish(),
											county: z.string().nullish(),
											city: z.string().nullish(),
											state_province: z.string().nullish(),
											postal_code: z.string().nullish(),
											country: z.string().nullish(),
										})
										.loose()
										.nullish(),
									lat: z.number().nullish(),
									long: z.number().nullish(),
									opening_status: z.string().nullish(),
									reopen_date: z.string().nullish(),
									hours: z
										.object({
											monday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											tuesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											wednesday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											thursday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											friday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											saturday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
											sunday: z
												.union([z.array(z.string().nullish()), z.string()])
												.nullish(),
										})
										.loose()
										.nullish(),
									more_hours: z.record(z.string(), z.unknown()).nullish(),
									opening_hours_notes: z.string().nullish(),
									opening_date: z.string().nullish(),
									special_hours: z.record(z.string(), z.unknown()).nullish(),
									phone: z.string().nullish(),
									fax: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
				account_id: z.unknown().nullish(),
				page: z
					.object({ n: z.number().nullish(), limit: z.number().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.listings': () =>
		z
			.object({
				listings: z
					.union([
						z.array(
							z
								.object({
									name: z.string().nullish(),
									status: z.string().nullish(),
									url: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.localGridHistory': () =>
		z
			.object({
				local_grid_history: z
					.object({
						location_id: z.number().nullish(),
						date_start: z.string().nullish(),
						date_end: z.string().nullish(),
						keyword: z.string().nullish(),
						device: z.string().nullish(),
						engine: z.string().nullish(),
						grids: z
							.union([
								z.array(
									z
										.object({
											grid_size: z.number().nullish(),
											grid_distance: z.number().nullish(),
											grid_distance_unit: z.string().nullish(),
											formatted_grid_distance: z.string().nullish(),
											date: z.string().nullish(),
											dots: z
												.union([
													z.array(
														z
															.object({
																row: z.number().nullish(),
																column: z.number().nullish(),
																lat: z.number().nullish(),
																long: z.number().nullish(),
																rank: z.number().nullish(),
																rating: z.number().nullish(),
																votes_count: z.number().nullish(),
															})
															.loose()
															.nullish(),
													),
													z.string(),
												])
												.nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.localGridKeywords': () =>
		z
			.object({
				keywords: z
					.union([z.array(z.string().nullish()), z.string()])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.lookup': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.number().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.networkStatuses': () =>
		z
			.object({
				network_statuses: z
					.union([
						z.array(
							z
								.object({
									network_name: z.string().nullish(),
									network_type: z.string().nullish(),
									monitored_fields: z.number().nullish(),
									healthy_fields: z.number().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.networks': () =>
		z
			.object({
				networks: z
					.union([
						z.array(
							z
								.object({
									type: z.string().nullish(),
									id: z.number().nullish(),
									name: z.string().nullish(),
									remote_network_id: z.string().nullish(),
									picture: z.string().nullish(),
									profile_url: z.string().nullish(),
									error: z.string().nullish(),
								})
								.loose()
								.nullish(),
						),
						z.string(),
					])
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.rankingHistory': () =>
		z
			.object({
				ranking_history: z
					.object({
						location_id: z.number().nullish(),
						date_start: z.string().nullish(),
						date_end: z.string().nullish(),
						engine: z.string().nullish(),
						device: z.string().nullish(),
						ranking_history_reports: z
							.union([
								z.array(
									z
										.object({
											date: z.string().nullish(),
											ranks: z
												.union([
													z.array(
														z
															.object({
																keyword: z.string().nullish(),
																rank: z.number().nullish(),
															})
															.loose()
															.nullish(),
													),
													z.string(),
												])
												.nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.update': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.number().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'local.locations.updateLevel': () =>
		z
			.object({
				location: z
					.object({
						id: z.number().nullish(),
						level: z.string().nullish(),
						status: z.string().nullish(),
						account_id: z.number().nullish(),
						auto_sync_enabled: z.union([z.boolean(), z.number()]).nullish(),
						custom_fields: z.record(z.string(), z.unknown()).nullish(),
						remote_id: z.string().nullish(),
						listings_name: z.string().nullish(),
						location_name: z.string().nullish(),
						website_url: z.string().nullish(),
						email_address: z.string().nullish(),
						timezone: z.string().nullish(),
						store_code: z.string().nullish(),
						short_description: z.string().nullish(),
						long_description: z.string().nullish(),
						languages: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						keywords: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						brands: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						payment_forms: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						price_range: z.string().nullish(),
						service_areas: z
							.union([
								z.array(
									z
										.object({
											text: z.string().nullish(),
											id: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						service_area_only: z.union([z.boolean(), z.number()]).nullish(),
						services: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						primary_category: z.string().nullish(),
						additional_categories: z
							.union([z.array(z.string().nullish()), z.string()])
							.nullish(),
						attributes: z
							.union([
								z.array(
									z
										.object({
											id: z.string().nullish(),
											value: z.string().nullish(),
										})
										.loose()
										.nullish(),
								),
								z.string(),
							])
							.nullish(),
						address: z
							.object({
								address_line_1: z.string().nullish(),
								address_line_2: z.string().nullish(),
								sublocality: z.string().nullish(),
								county: z.string().nullish(),
								city: z.string().nullish(),
								state_province: z.string().nullish(),
								postal_code: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						lat: z.number().nullish(),
						long: z.number().nullish(),
						opening_status: z.string().nullish(),
						reopen_date: z.string().nullish(),
						hours: z
							.object({
								monday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								tuesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								wednesday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								thursday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								friday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								saturday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
								sunday: z
									.union([z.array(z.string().nullish()), z.string()])
									.nullish(),
							})
							.loose()
							.nullish(),
						more_hours: z.record(z.string(), z.unknown()).nullish(),
						opening_hours_notes: z.string().nullish(),
						opening_date: z.string().nullish(),
						special_hours: z.record(z.string(), z.unknown()).nullish(),
						phone: z.string().nullish(),
						fax: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'locales.list': () =>
		z
			.object({
				engine: z.string().nullish(),
				locales: z.array(z.string().nullish()).nullish(),
			})
			.loose()
			.nullish(),
	'metrics.brandAuthority': () =>
		z
			.object({
				site_metrics: z
					.object({ brand_authority_score: z.number().nullish() })
					.loose()
					.nullish(),
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'metrics.distributions': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				site_metrics_distributions: z
					.object({
						root_domains_to_page_by_root_domains: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_root_domain_by_root_domains: z
							.array(z.number().nullish())
							.nullish(),
						nofollow_root_domains_to_root_domain_by_root_domains: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_page_by_domain_authority: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_subdomain_by_domain_authority: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_root_domain_by_domain_authority: z
							.array(z.number().nullish())
							.nullish(),
						nofollow_root_domains_to_root_domain_by_domain_authority: z
							.array(z.number().nullish())
							.nullish(),
						pages_to_root_domain_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
						nofollow_pages_to_root_domain_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_page_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_subdomain_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
						root_domains_to_root_domain_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
						nofollow_root_domains_to_root_domain_by_spam_score: z
							.array(z.number().nullish())
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'metrics.fetch': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				site_metrics: z
					.object({
						page: z.string().nullish(),
						subdomain: z.string().nullish(),
						root_domain: z.string().nullish(),
						title: z.string().nullish(),
						last_crawled: z.string().nullish(),
						http_code: z.number().nullish(),
						pages_to_page: z.number().nullish(),
						nofollow_pages_to_page: z.number().nullish(),
						redirect_pages_to_page: z.number().nullish(),
						external_pages_to_page: z.number().nullish(),
						external_nofollow_pages_to_page: z.number().nullish(),
						external_redirect_pages_to_page: z.number().nullish(),
						deleted_pages_to_page: z.number().nullish(),
						root_domains_to_page: z.number().nullish(),
						indirect_root_domains_to_page: z.number().nullish(),
						deleted_root_domains_to_page: z.number().nullish(),
						nofollow_root_domains_to_page: z.number().nullish(),
						pages_to_subdomain: z.number().nullish(),
						nofollow_pages_to_subdomain: z.number().nullish(),
						redirect_pages_to_subdomain: z.number().nullish(),
						external_pages_to_subdomain: z.number().nullish(),
						external_nofollow_pages_to_subdomain: z.number().nullish(),
						external_redirect_pages_to_subdomain: z.number().nullish(),
						deleted_pages_to_subdomain: z.number().nullish(),
						root_domains_to_subdomain: z.number().nullish(),
						deleted_root_domains_to_subdomain: z.number().nullish(),
						nofollow_root_domains_to_subdomain: z.number().nullish(),
						pages_to_root_domain: z.number().nullish(),
						nofollow_pages_to_root_domain: z.number().nullish(),
						redirect_pages_to_root_domain: z.number().nullish(),
						external_pages_to_root_domain: z.number().nullish(),
						external_indirect_pages_to_root_domain: z.number().nullish(),
						external_nofollow_pages_to_root_domain: z.number().nullish(),
						external_redirect_pages_to_root_domain: z.number().nullish(),
						deleted_pages_to_root_domain: z.number().nullish(),
						root_domains_to_root_domain: z.number().nullish(),
						indirect_root_domains_to_root_domain: z.number().nullish(),
						deleted_root_domains_to_root_domain: z.number().nullish(),
						nofollow_root_domains_to_root_domain: z.number().nullish(),
						page_authority: z.number().nullish(),
						domain_authority: z.number().nullish(),
						link_propensity: z.number().nullish(),
						spam_score: z.number().nullish(),
						root_domains_from_page: z.number().nullish(),
						nofollow_root_domains_from_page: z.number().nullish(),
						pages_from_page: z.number().nullish(),
						nofollow_pages_from_page: z.number().nullish(),
						root_domains_from_root_domain: z.number().nullish(),
						nofollow_root_domains_from_root_domain: z.number().nullish(),
						pages_from_root_domain: z.number().nullish(),
						nofollow_pages_from_root_domain: z.number().nullish(),
						pages_crawled_from_root_domain: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'metrics.fetchMultiple': () =>
		z
			.object({
				results_by_site: z
					.array(
						z
							.object({
								site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								site_metrics: z
									.object({
										page: z.string().nullish(),
										subdomain: z.string().nullish(),
										root_domain: z.string().nullish(),
										title: z.string().nullish(),
										last_crawled: z.string().nullish(),
										http_code: z.number().nullish(),
										pages_to_page: z.number().nullish(),
										nofollow_pages_to_page: z.number().nullish(),
										redirect_pages_to_page: z.number().nullish(),
										external_pages_to_page: z.number().nullish(),
										external_nofollow_pages_to_page: z.number().nullish(),
										external_redirect_pages_to_page: z.number().nullish(),
										deleted_pages_to_page: z.number().nullish(),
										root_domains_to_page: z.number().nullish(),
										indirect_root_domains_to_page: z.number().nullish(),
										deleted_root_domains_to_page: z.number().nullish(),
										nofollow_root_domains_to_page: z.number().nullish(),
										pages_to_subdomain: z.number().nullish(),
										nofollow_pages_to_subdomain: z.number().nullish(),
										redirect_pages_to_subdomain: z.number().nullish(),
										external_pages_to_subdomain: z.number().nullish(),
										external_nofollow_pages_to_subdomain: z.number().nullish(),
										external_redirect_pages_to_subdomain: z.number().nullish(),
										deleted_pages_to_subdomain: z.number().nullish(),
										root_domains_to_subdomain: z.number().nullish(),
										deleted_root_domains_to_subdomain: z.number().nullish(),
										nofollow_root_domains_to_subdomain: z.number().nullish(),
										pages_to_root_domain: z.number().nullish(),
										nofollow_pages_to_root_domain: z.number().nullish(),
										redirect_pages_to_root_domain: z.number().nullish(),
										external_pages_to_root_domain: z.number().nullish(),
										external_indirect_pages_to_root_domain: z
											.number()
											.nullish(),
										external_nofollow_pages_to_root_domain: z
											.number()
											.nullish(),
										external_redirect_pages_to_root_domain: z
											.number()
											.nullish(),
										deleted_pages_to_root_domain: z.number().nullish(),
										root_domains_to_root_domain: z.number().nullish(),
										indirect_root_domains_to_root_domain: z.number().nullish(),
										deleted_root_domains_to_root_domain: z.number().nullish(),
										nofollow_root_domains_to_root_domain: z.number().nullish(),
										page_authority: z.number().nullish(),
										domain_authority: z.number().nullish(),
										link_propensity: z.number().nullish(),
										spam_score: z.number().nullish(),
										root_domains_from_page: z.number().nullish(),
										nofollow_root_domains_from_page: z.number().nullish(),
										pages_from_page: z.number().nullish(),
										nofollow_pages_from_page: z.number().nullish(),
										root_domains_from_root_domain: z.number().nullish(),
										nofollow_root_domains_from_root_domain: z
											.number()
											.nullish(),
										pages_from_root_domain: z.number().nullish(),
										nofollow_pages_from_root_domain: z.number().nullish(),
										pages_crawled_from_root_domain: z.number().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				errors_by_site: z
					.array(
						z
							.object({
								site_query: z
									.object({
										query: z.string().nullish(),
										scope: z.string().nullish(),
										original_site_query: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
											})
											.loose()
											.nullish(),
										site_query_suggestion: z
											.object({
												query: z.string().nullish(),
												scope: z.string().nullish(),
												explanation: z.string().nullish(),
												issue: z.string().nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
								error: z
									.object({
										message: z.string().nullish(),
										name: z.string().nullish(),
										data: z
											.object({
												key: z.string().nullish(),
												value: z.string().nullish(),
											})
											.loose()
											.nullish(),
										httpStatus: z.number().nullish(),
										jsonrpcCode: z.number().nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
	'metrics.histories': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				site_metrics_histories: z
					.object({
						daily_history_deltas: z
							.array(
								z
									.object({
										metric_name: z.string().nullish(),
										metric_deltas: z
											.object({
												gained: z
													.array(
														z
															.object({
																date: z.string().nullish(),
																count: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
												lost: z
													.array(
														z
															.object({
																date: z.string().nullish(),
																count: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
							)
							.nullish(),
						daily_history_values: z
							.array(
								z
									.object({
										metric_name: z.string().nullish(),
										metric_values: z
											.array(
												z
													.object({
														date: z.string().nullish(),
														value: z.number().nullish(),
													})
													.loose()
													.nullish(),
											)
											.nullish(),
									})
									.loose()
									.nullish(),
							)
							.nullish(),
						monthly_history_deltas: z
							.array(
								z
									.object({
										metric_name: z.string().nullish(),
										metric_deltas: z
											.object({
												gained: z
													.array(
														z
															.object({
																date: z.string().nullish(),
																count: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
												lost: z
													.array(
														z
															.object({
																date: z.string().nullish(),
																count: z.number().nullish(),
															})
															.loose()
															.nullish(),
													)
													.nullish(),
											})
											.loose()
											.nullish(),
									})
									.loose()
									.nullish(),
							)
							.nullish(),
						monthly_history_values: z
							.array(
								z
									.object({
										metric_name: z.string().nullish(),
										metric_values: z
											.array(
												z
													.object({
														date: z.string().nullish(),
														value: z.number().nullish(),
													})
													.loose()
													.nullish(),
											)
											.nullish(),
									})
									.loose()
									.nullish(),
							)
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'quota.lookup': () =>
		z
			.object({
				quota: z
					.object({
						path: z.string().nullish(),
						account_id: z.number().nullish(),
						allotted: z.number().nullish(),
						used: z.number().nullish(),
						report: z.string().nullish(),
						reset: z.string().nullish(),
						overage: z.union([z.boolean(), z.number()]).nullish(),
						period_start: z.number().nullish(),
						period_reset: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'rankingKeywords.count': () =>
		z
			.object({
				ranking_keyword_count: z
					.object({
						total: z.number().nullish(),
						position: z
							.object({
								rank_1: z.number().nullish(),
								rank_2: z.number().nullish(),
								rank_3: z.number().nullish(),
								rank_4: z.number().nullish(),
								rank_5: z.number().nullish(),
								rank_6: z.number().nullish(),
								rank_7: z.number().nullish(),
								rank_8: z.number().nullish(),
								rank_9: z.number().nullish(),
								rank_10: z.number().nullish(),
								rank_11: z.number().nullish(),
								rank_12: z.number().nullish(),
								rank_13: z.number().nullish(),
								rank_14: z.number().nullish(),
								rank_15: z.number().nullish(),
								rank_16: z.number().nullish(),
								rank_17: z.number().nullish(),
								rank_18: z.number().nullish(),
								rank_19: z.number().nullish(),
								rank_20: z.number().nullish(),
								rank_21: z.number().nullish(),
								rank_22: z.number().nullish(),
								rank_23: z.number().nullish(),
								rank_24: z.number().nullish(),
								rank_25: z.number().nullish(),
								rank_26: z.number().nullish(),
								rank_27: z.number().nullish(),
								rank_28: z.number().nullish(),
								rank_29: z.number().nullish(),
								rank_30: z.number().nullish(),
								rank_31: z.number().nullish(),
								rank_32: z.number().nullish(),
								rank_33: z.number().nullish(),
								rank_34: z.number().nullish(),
								rank_35: z.number().nullish(),
								rank_36: z.number().nullish(),
								rank_37: z.number().nullish(),
								rank_38: z.number().nullish(),
								rank_39: z.number().nullish(),
								rank_40: z.number().nullish(),
								rank_41: z.number().nullish(),
								rank_42: z.number().nullish(),
								rank_43: z.number().nullish(),
								rank_44: z.number().nullish(),
								rank_45: z.number().nullish(),
								rank_46: z.number().nullish(),
								rank_47: z.number().nullish(),
								rank_48: z.number().nullish(),
								rank_49: z.number().nullish(),
								rank_50: z.number().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				target_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						locale: z.string().nullish(),
						original_target_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								locale: z.string().nullish(),
							})
							.loose()
							.nullish(),
						suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								locale: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'rankingKeywords.list': () =>
		z
			.object({
				ranking_keywords: z
					.array(
						z
							.object({
								keyword: z.string().nullish(),
								ranking_page: z.string().nullish(),
								rank_position: z.number().nullish(),
								difficulty: z.number().nullish(),
								volume: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
				target_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						locale: z.string().nullish(),
						original_target_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								locale: z.string().nullish(),
							})
							.loose()
							.nullish(),
						suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								locale: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				options: z.object({ sort: z.string().nullish() }).loose().nullish(),
				page: z
					.object({ n: z.number().nullish(), limit: z.number().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'redirects.fetch': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				destination: z.string().nullish(),
			})
			.loose()
			.nullish(),
	'test.ping': () =>
		z.object({ message: z.string().nullish() }).loose().nullish(),
	'test.pingAsync': () =>
		z
			.object({
				async_call: z
					.object({
						id: z.string().nullish(),
						action: z.string().nullish(),
						status: z.string().nullish(),
						ttl: z.number().nullish(),
						result: z
							.object({ message: z.string().nullish() })
							.loose()
							.nullish(),
						error: z
							.object({
								message: z.string().nullish(),
								code: z.number().nullish(),
								status: z.number().nullish(),
								data: z
									.object({
										explanation: z.string().nullish(),
										issue: z.string().nullish(),
										key: z.string().nullish(),
										value: z.record(z.string(), z.unknown()).nullish(),
									})
									.loose()
									.nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	'topPages.list': () =>
		z
			.object({
				site_query: z
					.object({
						query: z.string().nullish(),
						scope: z.string().nullish(),
						original_site_query: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
							})
							.loose()
							.nullish(),
						site_query_suggestion: z
							.object({
								query: z.string().nullish(),
								scope: z.string().nullish(),
								explanation: z.string().nullish(),
								issue: z.string().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose()
					.nullish(),
				offset: z
					.object({
						provided_token: z.string().nullish(),
						token: z.string().nullish(),
						limit: z.number().nullish(),
					})
					.loose()
					.nullish(),
				options: z
					.object({ filter: z.string().nullish(), sort: z.string().nullish() })
					.loose()
					.nullish(),
				top_pages: z
					.array(
						z
							.object({
								page: z.string().nullish(),
								subdomain: z.string().nullish(),
								root_domain: z.string().nullish(),
								title: z.string().nullish(),
								last_crawled: z.string().nullish(),
								http_code: z.number().nullish(),
								pages_to_page: z.number().nullish(),
								nofollow_pages_to_page: z.number().nullish(),
								redirect_pages_to_page: z.number().nullish(),
								external_pages_to_page: z.number().nullish(),
								external_nofollow_pages_to_page: z.number().nullish(),
								external_redirect_pages_to_page: z.number().nullish(),
								deleted_pages_to_page: z.number().nullish(),
								root_domains_to_page: z.number().nullish(),
								indirect_root_domains_to_page: z.number().nullish(),
								deleted_root_domains_to_page: z.number().nullish(),
								nofollow_root_domains_to_page: z.number().nullish(),
								pages_to_subdomain: z.number().nullish(),
								nofollow_pages_to_subdomain: z.number().nullish(),
								redirect_pages_to_subdomain: z.number().nullish(),
								external_pages_to_subdomain: z.number().nullish(),
								external_nofollow_pages_to_subdomain: z.number().nullish(),
								external_redirect_pages_to_subdomain: z.number().nullish(),
								deleted_pages_to_subdomain: z.number().nullish(),
								root_domains_to_subdomain: z.number().nullish(),
								deleted_root_domains_to_subdomain: z.number().nullish(),
								nofollow_root_domains_to_subdomain: z.number().nullish(),
								pages_to_root_domain: z.number().nullish(),
								nofollow_pages_to_root_domain: z.number().nullish(),
								redirect_pages_to_root_domain: z.number().nullish(),
								external_pages_to_root_domain: z.number().nullish(),
								external_indirect_pages_to_root_domain: z.number().nullish(),
								external_nofollow_pages_to_root_domain: z.number().nullish(),
								external_redirect_pages_to_root_domain: z.number().nullish(),
								deleted_pages_to_root_domain: z.number().nullish(),
								root_domains_to_root_domain: z.number().nullish(),
								indirect_root_domains_to_root_domain: z.number().nullish(),
								deleted_root_domains_to_root_domain: z.number().nullish(),
								nofollow_root_domains_to_root_domain: z.number().nullish(),
								page_authority: z.number().nullish(),
								domain_authority: z.number().nullish(),
								link_propensity: z.number().nullish(),
								spam_score: z.number().nullish(),
								root_domains_from_page: z.number().nullish(),
								nofollow_root_domains_from_page: z.number().nullish(),
								pages_from_page: z.number().nullish(),
								nofollow_pages_from_page: z.number().nullish(),
								root_domains_from_root_domain: z.number().nullish(),
								nofollow_root_domains_from_root_domain: z.number().nullish(),
								pages_from_root_domain: z.number().nullish(),
								nofollow_pages_from_root_domain: z.number().nullish(),
								pages_crawled_from_root_domain: z.number().nullish(),
							})
							.loose()
							.nullish(),
					)
					.nullish(),
			})
			.loose()
			.nullish(),
} as const;
