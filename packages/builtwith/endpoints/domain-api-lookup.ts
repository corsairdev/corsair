import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const domainApiLookup: BuiltWithEndpoints['domainApiLookup'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string> = {
		LOOKUP: input.lookup,
	};

	if (input.hidedl) query.HIDEDL = 'yes';
	if (input.hidetext) query.HIDETEXT = 'yes';
	if (input.liveonly) query.LIVEONLY = 'yes';
	if (input.nolive) query.NOLIVE = 'yes';
	if (input.nometa) query.NOMETA = 'yes';
	if (input.nopii) query.NOPII = 'yes';
	if (input.noattr) query.NOATTR = 'yes';
	if (input.trust) query.TRUST = 'yes';

	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['domainApiLookup']
	>('v23/api.json', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'builtwith.domain.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
