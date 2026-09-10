import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	LocationArchiveResponse,
	LocationCreateResponse,
	LocationInfoResponse,
	LocationListResponse,
	LocationUpdateResponse,
} from './types';

export const info: AshbyEndpoints['location.info'] = async (ctx, input) => {
	return await ashbyCall<LocationInfoResponse>(ctx, 'location.info', {
		locationId: input.locationId,
	});
};

export const list: AshbyEndpoints['location.list'] = async (ctx, input) => {
	return await ashbyCall<LocationListResponse>(ctx, 'location.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		includeArchived: input.includeArchived,
	});
};

export const create: AshbyEndpoints['location.create'] = async (ctx, input) => {
	return await ashbyCall<LocationCreateResponse>(ctx, 'location.create', {
		name: input.name,
		parentId: input.parentId,
	});
};

export const update: AshbyEndpoints['location.update'] = async (ctx, input) => {
	return await ashbyCall<LocationUpdateResponse>(ctx, 'location.update', {
		locationId: input.locationId,
		name: input.name,
		parentId: input.parentId,
	});
};

export const archive: AshbyEndpoints['location.archive'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<LocationArchiveResponse>(ctx, 'location.archive', {
		locationId: input.locationId,
	});
};
