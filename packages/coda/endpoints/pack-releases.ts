import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packReleasesList'] = async (ctx, input) => {
	const { packId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packReleasesList']
	>(`packs/${encodeURIComponent(packId)}/releases`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.packReleases.list',
		{ ...input },
		'completed',
	);
	return response;
};

const create: CodaEndpoints['packReleasesCreate'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packReleasesCreate']
	>(`packs/${encodeURIComponent(packId)}/releases`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packReleases.create',
		{ ...input },
		'completed',
	);
	return response;
};

const update: CodaEndpoints['packReleasesUpdate'] = async (ctx, input) => {
	const { packId, packReleaseId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packReleasesUpdate']
	>(
		`packs/${encodeURIComponent(packId)}/releases/${encodeURIComponent(packReleaseId)}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'coda.packReleases.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackReleases = {
	list,
	create,
	update,
};
