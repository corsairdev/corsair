import { logEventFromContext } from '../../utils/events';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const getList: AsanaEndpoints['webhooksGetList'] = async (ctx, input) => {
	const { workspace, resource, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		workspace,
		resource,
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['webhooksGetList']>(
		'webhooks',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'asana.webhooks.getList', { workspace }, 'completed');
	return result;
};

export const update: AsanaEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { webhook_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['webhooksUpdate']>(
		`webhooks/${webhook_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	await logEventFromContext(ctx, 'asana.webhooks.update', { webhook_gid }, 'completed');
	return result;
};
