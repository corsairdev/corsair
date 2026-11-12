import type { PostHogEndpoints } from '../index';
import { callPostHogApi } from './api';
import type { PostHogEndpointOutputs } from './types';

const QUERY_PATH = '/api/projects/{project_id}/query/';

export const run: PostHogEndpoints['queryRun'] = async (ctx, input) => {
	// A bare string is HogQL; any other query kind is passed through as is.
	const query =
		typeof input.query === 'string'
			? { kind: 'HogQLQuery', query: input.query }
			: input.query;

	return callPostHogApi<PostHogEndpointOutputs['queryRun']>(
		ctx,
		'posthog.query.run',
		QUERY_PATH,
		{
			method: 'POST',
			body: {
				query,
				...(input.name ? { name: input.name } : {}),
				...(input.refresh ? { refresh: input.refresh } : {}),
			},
		},
		{ kind: query.kind, name: input.name },
	);
};

export const errorTrackingIssuesList: PostHogEndpoints['errorTrackingIssuesList'] =
	async (ctx, input) => {
		// PostHog's REST issues list has no occurrence counts; the
		// ErrorTrackingQuery it runs for its own UI does, so use that.
		const query = {
			kind: 'ErrorTrackingQuery',
			dateRange: {
				date_from: input.date_from ?? '-7d',
				...(input.date_to ? { date_to: input.date_to } : {}),
			},
			status: input.status ?? 'active',
			orderBy: input.order_by ?? 'occurrences',
			orderDirection: input.order_direction ?? 'DESC',
			filterTestAccounts: input.filter_test_accounts ?? true,
			volumeResolution: 0,
			limit: input.limit ?? 10,
			offset: input.offset ?? 0,
			...(input.search ? { searchQuery: input.search } : {}),
		};

		return callPostHogApi<PostHogEndpointOutputs['errorTrackingIssuesList']>(
			ctx,
			'posthog.errorTracking.issuesList',
			QUERY_PATH,
			{ method: 'POST', body: { query } },
			{ status: query.status, search: input.search, limit: query.limit },
		);
	};
