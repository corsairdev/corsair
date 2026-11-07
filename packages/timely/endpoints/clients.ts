import type { TimelyEndpoints } from '..';
import {
	bodyFields,
	idPath,
	resolveTimelyAccountId,
	timelyCall,
} from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

export const list: TimelyEndpoints['clientsList'] = async (ctx, input) => {
	const parsed = In.clientsList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.clients.list',
		input: parsed,
		path: `/${accountId}/clients`,
		query: {
			limit: parsed.limit,
			offset: parsed.offset,
			order: parsed.order,
			show: parsed.show,
		},
		output: Out.clientsList,
	});
};

export const get: TimelyEndpoints['clientsGet'] = async (ctx, input) => {
	const parsed = In.clientsGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.clients.get',
		input: parsed,
		path: `/${accountId}/clients/${idPath(parsed.id)}`,
		output: Out.clientsGet,
	});
};

export const create: TimelyEndpoints['clientsCreate'] = async (ctx, input) => {
	const parsed = In.clientsCreate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.clients.create',
		input: parsed,
		path: `/${accountId}/clients`,
		method: 'POST',
		body: { client: bodyFields(parsed) },
		output: Out.clientsCreate,
	});
};

export const update: TimelyEndpoints['clientsUpdate'] = async (ctx, input) => {
	const parsed = In.clientsUpdate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.clients.update',
		input: parsed,
		path: `/${accountId}/clients/${idPath(parsed.id)}`,
		method: 'PUT',
		body: { client: bodyFields(parsed) },
		output: Out.clientsUpdate,
	});
};
