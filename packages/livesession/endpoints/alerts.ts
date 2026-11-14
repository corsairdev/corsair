import { makeLiveSessionRequest } from '../client';
import type { LiveSessionEndpoints } from '../index';
import { complete, parseInput, parseOutput } from './helpers';
import type { LiveSessionEndpointOutputs } from './types';

export const list: LiveSessionEndpoints['alertsList'] = (ctx, rawInput) => {
	const parsed = parseInput('alertsList', rawInput);
	return complete(
		ctx,
		'livesession.alerts.list',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['alertsList']>(
			'/alerts',
			ctx.key,
		).then((response) => parseOutput('alertsList', response)),
	);
};

export const create: LiveSessionEndpoints['alertsCreate'] = (ctx, rawInput) => {
	const parsed = parseInput('alertsCreate', rawInput);
	return complete(
		ctx,
		'livesession.alerts.create',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['alertsCreate']>(
			'/alerts',
			ctx.key,
			{ method: 'POST', body: parsed },
		).then((response) => parseOutput('alertsCreate', response)),
	);
};

export const update: LiveSessionEndpoints['alertsUpdate'] = (ctx, rawInput) => {
	const parsed = parseInput('alertsUpdate', rawInput);
	const { id, ...body } = parsed;
	return complete(
		ctx,
		'livesession.alerts.update',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['alertsUpdate']>(
			`/alerts/${encodeURIComponent(id)}`,
			ctx.key,
			{ method: 'PUT', body },
		).then((response) => parseOutput('alertsUpdate', response)),
	);
};

export const remove: LiveSessionEndpoints['alertsDelete'] = (ctx, rawInput) => {
	const parsed = parseInput('alertsDelete', rawInput);
	return complete(
		ctx,
		'livesession.alerts.delete',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['alertsDelete']>(
			`/alerts/${encodeURIComponent(parsed.id)}`,
			ctx.key,
			{ method: 'DELETE' },
		).then((response) => parseOutput('alertsDelete', response)),
	);
};
