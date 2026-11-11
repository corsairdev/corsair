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

// Manages Timely webhook subscriptions. `secret_token` is never echoed back:
// outputs and event logs replace it with "[redacted]".

export const list: TimelyEndpoints['webhooksList'] = async (ctx, input) => {
	const parsed = In.webhooksList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.webhooks.list',
		input: parsed,
		path: `/${accountId}/webhooks`,
		query: { limit: parsed.limit, offset: parsed.offset },
		output: Out.webhooksList,
	});
};

export const get: TimelyEndpoints['webhooksGet'] = async (ctx, input) => {
	const parsed = In.webhooksGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.webhooks.get',
		input: parsed,
		path: `/${accountId}/webhooks/${idPath(parsed.id)}`,
		output: Out.webhooksGet,
	});
};

export const create: TimelyEndpoints['webhooksCreate'] = async (ctx, input) => {
	const parsed = In.webhooksCreate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.webhooks.create',
		input: parsed,
		path: `/${accountId}/webhooks`,
		method: 'POST',
		body: { webhook: bodyFields(parsed) },
		output: Out.webhooksCreate,
	});
};

export const update: TimelyEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const parsed = In.webhooksUpdate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.webhooks.update',
		input: parsed,
		path: `/${accountId}/webhooks/${idPath(parsed.id)}`,
		method: 'PUT',
		body: { webhook: bodyFields(parsed) },
		output: Out.webhooksUpdate,
	});
};

export const remove: TimelyEndpoints['webhooksDelete'] = async (ctx, input) => {
	const parsed = In.webhooksDelete.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	const id = idPath(parsed.id);
	return timelyCall(ctx, {
		event: 'timely.webhooks.delete',
		input: parsed,
		path: `/${accountId}/webhooks/${id}`,
		method: 'DELETE',
		output: Out.webhooksDelete,
		transform: () => ({ id, deleted: true }),
	});
};
