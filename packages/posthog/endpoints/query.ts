import { defineApiEndpoint, ENVIRONMENT, PROJECT } from './api';

const QUERY_PATH = `${PROJECT}/query/`;

function dateRange(
	from: string | undefined,
	to: string | undefined,
	def: string,
) {
	return { date_from: from ?? def, ...(to ? { date_to: to } : {}) };
}

export const queryRun = defineApiEndpoint<'queryRun'>(
	'queryRun',
	'posthog.query.run',
	(input) => {
		// A bare string is HogQL; any other query kind is passed through as is.
		const query =
			typeof input.query === 'string'
				? { kind: 'HogQLQuery', query: input.query }
				: input.query;
		return {
			path: QUERY_PATH,
			method: 'POST',
			body: { query, name: input.name, refresh: input.refresh },
			log: { kind: query.kind, name: input.name },
		};
	},
);

export const eventsList = defineApiEndpoint<'eventsList'>(
	'eventsList',
	'posthog.events.list',
	(input) => ({
		// /api/projects/:id/events/ is deprecated; EventsQuery is its replacement.
		path: QUERY_PATH,
		method: 'POST',
		body: {
			query: {
				kind: 'EventsQuery',
				select: input.select ?? [
					'uuid',
					'event',
					'timestamp',
					'distinct_id',
					'properties',
				],
				where: input.where,
				event: input.event,
				personId: input.person_id,
				after: input.after ?? '-24h',
				before: input.before,
				orderBy: input.order_by ?? ['timestamp DESC'],
				limit: input.limit ?? 100,
				offset: input.offset,
			},
		},
		log: { event: input.event, after: input.after, limit: input.limit },
	}),
);

export const errorTrackingIssuesList =
	defineApiEndpoint<'errorTrackingIssuesList'>(
		'errorTrackingIssuesList',
		'posthog.errorTracking.issuesList',
		(input) => ({
			// PostHog's REST issues list has no occurrence counts; the
			// ErrorTrackingQuery it runs for its own UI does, so use that.
			path: QUERY_PATH,
			method: 'POST',
			body: {
				query: {
					kind: 'ErrorTrackingQuery',
					dateRange: dateRange(input.date_from, input.date_to, '-7d'),
					status: input.status ?? 'active',
					orderBy: input.order_by ?? 'occurrences',
					orderDirection: input.order_direction ?? 'DESC',
					filterTestAccounts: input.filter_test_accounts ?? true,
					volumeResolution: 0,
					limit: input.limit ?? 10,
					offset: input.offset ?? 0,
					searchQuery: input.search,
				},
			},
			log: { status: input.status, search: input.search, limit: input.limit },
			// The query runner returns one row past the limit so it can set
			// hasMore; drop it so callers get exactly `limit` issues.
			transform: (response) => {
				const limit = input.limit ?? 10;
				// Only the length of results matters here; the output schema checks the rows.
				const res = response as { results?: unknown[] };
				return Array.isArray(res.results) && res.results.length > limit
					? { ...res, results: res.results.slice(0, limit) }
					: response;
			},
		}),
	);

export const webAnalyticsOverview = defineApiEndpoint<'webAnalyticsOverview'>(
	'webAnalyticsOverview',
	'posthog.webAnalytics.overview',
	(input) => ({
		path: QUERY_PATH,
		method: 'POST',
		body: {
			query: {
				kind: 'WebOverviewQuery',
				dateRange: dateRange(input.date_from, input.date_to, '-7d'),
				properties: [],
				filterTestAccounts: input.filter_test_accounts,
				compareFilter: input.compare ? { compare: true } : undefined,
			},
		},
		log: { date_from: input.date_from, compare: input.compare },
	}),
);

export const webAnalyticsStats = defineApiEndpoint<'webAnalyticsStats'>(
	'webAnalyticsStats',
	'posthog.webAnalytics.stats',
	(input) => ({
		path: QUERY_PATH,
		method: 'POST',
		body: {
			query: {
				kind: 'WebStatsTableQuery',
				breakdownBy: input.breakdown_by,
				dateRange: dateRange(input.date_from, input.date_to, '-7d'),
				properties: [],
				limit: input.limit ?? 20,
				offset: input.offset,
				filterTestAccounts: input.filter_test_accounts,
			},
		},
		log: { breakdown_by: input.breakdown_by, date_from: input.date_from },
	}),
);

export const llmAnalyticsTraces = defineApiEndpoint<'llmAnalyticsTraces'>(
	'llmAnalyticsTraces',
	'posthog.llmAnalytics.traces',
	(input) => ({
		path: QUERY_PATH,
		method: 'POST',
		body: {
			query: {
				kind: 'TracesQuery',
				dateRange: dateRange(input.date_from, input.date_to, '-7d'),
				limit: input.limit ?? 20,
				offset: input.offset,
				filterTestAccounts: input.filter_test_accounts,
			},
		},
		log: { date_from: input.date_from, limit: input.limit },
	}),
);

export const llmAnalyticsCosts = defineApiEndpoint<'llmAnalyticsCosts'>(
	'llmAnalyticsCosts',
	'posthog.llmAnalytics.costs',
	(input) => {
		// `days` is a validated integer, so it is safe to place in the query.
		const days = Math.trunc(Number(input.days ?? 30));
		return {
			path: QUERY_PATH,
			method: 'POST',
			body: {
				query: {
					kind: 'HogQLQuery',
					query: `select properties.$ai_model as model, count() as generations, sum(toFloat(properties.$ai_input_tokens)) as input_tokens, sum(toFloat(properties.$ai_output_tokens)) as output_tokens, sum(toFloat(properties.$ai_total_cost_usd)) as cost_usd from events where event = '$ai_generation' and timestamp > now() - interval ${days} day group by model order by cost_usd desc limit 100`,
				},
			},
			log: { days },
		};
	},
);

export const logsQuery = defineApiEndpoint<'logsQuery'>(
	'logsQuery',
	'posthog.logs.query',
	(input) => ({
		path: `${ENVIRONMENT}/logs/query/`,
		method: 'POST',
		body: {
			query: {
				dateRange: dateRange(input.date_from, input.date_to, '-1h'),
				serviceNames: input.service_names,
				severityLevels: input.severity_levels,
				searchTerm: input.search,
				// PostHog's property group: an AND of one AND group. A single-level
				// { type, values: [filter] } is rejected by the logs endpoint (500).
				filterGroup: input.filters?.length
					? { type: 'AND', values: [{ type: 'AND', values: input.filters }] }
					: undefined,
				orderBy: input.order_by,
				limit: input.limit ?? 100,
				after: input.after,
				excludeAttributes: input.exclude_attributes,
			},
		},
		log: {
			service_names: input.service_names,
			severity_levels: input.severity_levels,
			date_from: input.date_from,
		},
	}),
);
