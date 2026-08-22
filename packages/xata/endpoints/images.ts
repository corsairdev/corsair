import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { ImagesListResponse } from './types';

// GET /organizations/{organizationID}/images
export const list: XataEndpoints['imagesList'] = async (ctx, input) => {
	const query: Record<string, string> = {};
	if (input.region) query.region = input.region;
	const response = await makeXataManagementRequest<ImagesListResponse>(
		`/organizations/${input.organizationId}/images`,
		ctx.key,
		{ query },
	);
	await logEventFromContext(ctx, 'xata.images.list', { ...input }, 'completed');
	return response;
};

export const Images = { list };
