import type { TimelyEndpoints } from '..';
import { joinIds, resolveTimelyAccountId, timelyCall } from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

// Timely has no stored reports: both routes compute totals for a date range.

export const totals: TimelyEndpoints['reportsTotals'] = async (ctx, input) => {
	const parsed = In.reportsTotals.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.reports.totals',
		input: parsed,
		path: `/${accountId}/reports`,
		query: {
			since: parsed.since,
			until: parsed.until,
			user_ids: joinIds(parsed.user_ids),
			project_ids: joinIds(parsed.project_ids),
			client_ids: joinIds(parsed.client_ids),
		},
		output: Out.reportsTotals,
	});
};

export const filter: TimelyEndpoints['reportsFilter'] = async (ctx, input) => {
	const parsed = In.reportsFilter.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.reports.filter',
		input: parsed,
		path: `/${accountId}/reports/filter`,
		query: {
			since: parsed.since,
			until: parsed.until,
			user_ids: joinIds(parsed.user_ids),
			project_ids: joinIds(parsed.project_ids),
			client_ids: joinIds(parsed.client_ids),
			label_ids: joinIds(parsed.label_ids),
			team_ids: joinIds(parsed.team_ids),
			state_ids: joinIds(parsed.state_ids),
			group_by: parsed.group_by?.join(','),
			scope: parsed.scope,
			billed: parsed.billed === undefined ? undefined : String(parsed.billed),
		},
		output: Out.reportsFilter,
	});
};
