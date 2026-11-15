import { makeLiveSessionRequest } from '../client';
import type { LiveSessionEndpoints } from '../index';
import { complete, parseInput, parseOutput } from './helpers';
import type { LiveSessionEndpointOutputs } from './types';

export const list: LiveSessionEndpoints['websitesList'] = (ctx, rawInput) => {
	parseInput('websitesList', rawInput);
	return complete(
		ctx,
		'livesession.websites.list',
		makeLiveSessionRequest<LiveSessionEndpointOutputs['websitesList']>(
			'/websites',
			ctx.key,
		).then((response) => parseOutput('websitesList', response)),
	);
};
