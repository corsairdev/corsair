import { makeLiveSessionRequest } from '../client';
import type { LiveSessionEndpoints } from '../index';
import { complete, parseInput, parseOutput } from './helpers';
import type { LiveSessionEndpointOutputs } from './types';

export const list: LiveSessionEndpoints['webhooksList'] = (ctx, rawInput) => {
	parseInput('webhooksList', rawInput);
	return complete(
		ctx,
		'livesession.webhooks.list',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['webhooksList']>(
			'/webhooks',
			ctx.key,
		).then((response) => parseOutput('webhooksList', response)),
	);
};

export const create: LiveSessionEndpoints['webhooksCreate'] = (
	ctx,
	rawInput,
) => {
	const parsed = parseInput('webhooksCreate', rawInput);
	return complete(
		ctx,
		'livesession.webhooks.create',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['webhooksCreate']>(
			'/webhooks',
			ctx.key,
			{ method: 'POST', body: parsed },
		).then((response) => parseOutput('webhooksCreate', response)),
	);
};

export const update: LiveSessionEndpoints['webhooksUpdate'] = (
	ctx,
	rawInput,
) => {
	const parsed = parseInput('webhooksUpdate', rawInput);
	const { id, ...body } = parsed;
	return complete(
		ctx,
		'livesession.webhooks.update',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['webhooksUpdate']>(
			`/webhooks/${encodeURIComponent(id)}`,
			ctx.key,
			{ method: 'PUT', body, query: { version: body.version } },
		).then((response) => parseOutput('webhooksUpdate', response)),
	);
};

export const remove: LiveSessionEndpoints['webhooksDelete'] = (
	ctx,
	rawInput,
) => {
	const parsed = parseInput('webhooksDelete', rawInput);
	return complete(
		ctx,
		'livesession.webhooks.delete',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['webhooksDelete']>(
			`/webhooks/${encodeURIComponent(parsed.id)}`,
			ctx.key,
			{ method: 'DELETE' },
		).then((response) => parseOutput('webhooksDelete', response)),
	);
};
