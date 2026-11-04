import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const upload: CodaEndpoints['packAssetsUpload'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packAssetsUpload']
	>(`packs/${encodeURIComponent(packId)}/uploadAsset`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packAssets.upload',
		{ ...input },
		'completed',
	);
	return response;
};

const uploadComplete: CodaEndpoints['packAssetsUploadComplete'] = async (
	ctx,
	input,
) => {
	const { packId, packAssetId, packAssetType } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packAssetsUploadComplete']
	>(
		`packs/${encodeURIComponent(packId)}/assets/${encodeURIComponent(packAssetId)}/assetType/${encodeURIComponent(packAssetType)}/uploadComplete`,
		ctx.key,
		{ method: 'POST' },
	);
	await logEventFromContext(
		ctx,
		'coda.packAssets.uploadComplete',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackAssets = {
	upload,
	uploadComplete,
};
