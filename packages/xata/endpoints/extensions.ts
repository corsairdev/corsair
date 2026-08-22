import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { ExtensionsListResponse } from './types';

// GET /organizations/{organizationID}/extensions?image={image}&region={region}
export const list: XataEndpoints['extensionsList'] = async (ctx, input) => {
	const query: Record<string, string> = { image: input.image };
	if (input.region) query.region = input.region;
	const response = await makeXataManagementRequest<ExtensionsListResponse>(
		`/organizations/${input.organizationId}/extensions`,
		ctx.key,
		{ query },
	);
	await logEventFromContext(
		ctx,
		'xata.extensions.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Extensions = { list };
