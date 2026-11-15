import type { TimelyEndpoints } from '..';
import { resolveTimelyAccountId, timelyCall } from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

export const list: TimelyEndpoints['accountsList'] = async (ctx, input) => {
	const parsed = In.accountsList.parse(input ?? {});
	return timelyCall(ctx, {
		event: 'timely.accounts.list',
		input: parsed,
		path: '/accounts',
		output: Out.accountsList,
	});
};

export const get: TimelyEndpoints['accountsGet'] = async (ctx, input) => {
	const parsed = In.accountsGet.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.accounts.get',
		input: parsed,
		path: `/accounts/${accountId}`,
		output: Out.accountsGet,
	});
};
