import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const create: HeygenEndpoints['proofreadCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['proofreadCreate']
	>('/v3/video-translations/proofreads', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'heygen.proofread.create',
		{ outputLanguageCount: input.output_languages.length },
		'completed',
	);
	return result;
};

export const get: HeygenEndpoints['proofreadGet'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['proofreadGet']>(
		`/v3/video-translations/proofreads/${input.proofread_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'heygen.proofread.get',
		{ proofreadId: input.proofread_id },
		'completed',
	);
	return result;
};

export const downloadSrt: HeygenEndpoints['proofreadDownloadSrt'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['proofreadDownloadSrt']
	>(`/v3/video-translations/proofreads/${input.proofread_id}/srt`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'heygen.proofread.downloadSrt',
		{ proofreadId: input.proofread_id },
		'completed',
	);
	return result;
};

export const uploadSrt: HeygenEndpoints['proofreadUploadSrt'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['proofreadUploadSrt']
	>(`/v3/video-translations/proofreads/${input.proofread_id}/srt`, ctx.key, {
		method: 'PUT',
		body: { srt: input.srt },
	});

	await logEventFromContext(
		ctx,
		'heygen.proofread.uploadSrt',
		{ proofreadId: input.proofread_id },
		'completed',
	);
	return result;
};

export const generateVideo: HeygenEndpoints['proofreadGenerateVideo'] = async (
	ctx,
	input,
) => {
	const { proofread_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['proofreadGenerateVideo']
	>(`/v3/video-translations/proofreads/${proofread_id}/generate`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'heygen.proofread.generateVideo',
		{ proofreadId: proofread_id },
		'completed',
	);
	return result;
};
