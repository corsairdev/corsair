import type { TimelyEndpoints } from '..';
import { idPath, resolveTimelyAccountId, timelyCall } from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

export const list: TimelyEndpoints['teamsList'] = async (ctx, input) => {
	const parsed = In.teamsList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.teams.list',
		input: parsed,
		path: `/${accountId}/teams`,
		query: { limit: parsed.limit, offset: parsed.offset, order: parsed.order },
		output: Out.teamsList,
	});
};

export const get: TimelyEndpoints['teamsGet'] = async (ctx, input) => {
	const parsed = In.teamsGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.teams.get',
		input: parsed,
		path: `/${accountId}/teams/${idPath(parsed.id)}`,
		output: Out.teamsGet,
	});
};
