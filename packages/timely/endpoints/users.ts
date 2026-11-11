import type { TimelyEndpoints } from '..';
import { idPath, resolveTimelyAccountId, timelyCall } from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

export const list: TimelyEndpoints['usersList'] = async (ctx, input) => {
	const parsed = In.usersList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.users.list',
		input: parsed,
		path: `/${accountId}/users`,
		query: {
			limit: parsed.limit,
			offset: parsed.offset,
			order: parsed.order,
			kind: parsed.kind,
			filter: parsed.filter,
		},
		output: Out.usersList,
	});
};

export const get: TimelyEndpoints['usersGet'] = async (ctx, input) => {
	const parsed = In.usersGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.users.get',
		input: parsed,
		path: `/${accountId}/users/${idPath(parsed.id)}`,
		output: Out.usersGet,
	});
};

export const current: TimelyEndpoints['usersCurrent'] = async (ctx, input) => {
	const parsed = In.usersCurrent.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.users.current',
		input: parsed,
		path: `/${accountId}/users/current`,
		output: Out.usersCurrent,
	});
};
