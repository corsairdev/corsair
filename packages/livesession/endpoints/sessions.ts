import { makeLiveSessionRequest } from '../client';
import type { LiveSessionEndpoints } from '../index';
import { complete, parseInput, parseOutput } from './helpers';
import type { LiveSessionEndpointOutputs } from './types';

export const list: LiveSessionEndpoints['sessionsList'] = (ctx, rawInput) => {
	const parsed = parseInput('sessionsList', rawInput);
	return complete(
		ctx,
		'livesession.sessions.list',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['sessionsList']>(
			'/sessions',
			ctx.key,
			{ query: parsed },
		).then((response) => parseOutput('sessionsList', response)),
	);
};
