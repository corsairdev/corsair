import { makeLiveSessionRequest } from '../client';
import type { LiveSessionEndpoints } from '../index';
import { complete, parseInput, parseOutput } from './helpers';
import type { LiveSessionEndpointOutputs } from './types';

export const list: LiveSessionEndpoints['websitesList'] = (ctx, rawInput) => {
	const parsed = parseInput('websitesList', rawInput);
	return complete(
		ctx,
		'livesession.websites.list',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['websitesList']>(
			'/websites',
			ctx.key,
		).then((response) => parseOutput('websitesList', response)),
	);
};

export const create: LiveSessionEndpoints['websitesCreate'] = (
	ctx,
	rawInput,
) => {
	const parsed = parseInput('websitesCreate', rawInput);
	return complete(
		ctx,
		'livesession.websites.create',
		parsed,
		makeLiveSessionRequest<LiveSessionEndpointOutputs['websitesCreate']>(
			'/websites',
			ctx.key,
			{ method: 'POST', body: parsed },
		).then((response) => parseOutput('websitesCreate', response)),
	);
};
