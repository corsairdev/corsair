import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { cacheEntities, parseInput, parseOutput } from './shared';
import type {
	AbyssaleEndpointOutputs,
	GenerateBatchInput,
	GenerateImageInput,
} from './types';

/**
 * Synchronous generation — one image per call, static designs only. The render
 * is hard-capped at 10 s provider-side; heavier output (video, GIF, HTML5,
 * print PDF) belongs to `generateBatch`.
 */
export const generateImage: AbyssaleEndpoints['generateImage'] = async (
	ctx,
	input,
) => {
	const args = parseInput('generateImage', input);
	const { designId, ...body } = args as GenerateImageInput & {
		designId: string;
	};

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['generateImage']
	>(`banner-builder/${designId}/generate`, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});

	const result = parseOutput('generateImage', response);

	await cacheEntities(ctx, 'banners', [result]);

	await logEventFromContext(
		ctx,
		'abyssale.generation.image',
		{ design_id: designId },
		'completed',
	);
	return result;
};

/**
 * Asynchronous generation — many formats in one call. Returns a
 * `generation_request_id` immediately; results arrive via the `NEW_BANNER_BATCH`
 * webhook or by polling `getGenerationRequest`.
 */
export const generateBatch: AbyssaleEndpoints['generateBatch'] = async (
	ctx,
	input,
) => {
	const args = parseInput('generateBatch', input);
	const { designId, ...body } = args as GenerateBatchInput & {
		designId: string;
	};

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['generateBatch']
	>(`async/banner-builder/${designId}/generate`, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});

	const result = parseOutput('generateBatch', response);

	await logEventFromContext(
		ctx,
		'abyssale.generation.batch',
		{
			design_id: designId,
			generation_request_id: result.generation_request_id,
		},
		'completed',
	);
	return result;
};

/**
 * Polls an async generation request (`202` + `is_finalized: false` while it
 * runs, `200` + `is_finalized: true` when complete). Banners are cached only
 * once finalized so partial results never masquerade as final ones.
 */
export const getGenerationRequest: AbyssaleEndpoints['getGenerationRequest'] =
	async (ctx, input) => {
		const args = parseInput('getGenerationRequest', input);

		const response = await makeAbyssaleRequest<
			AbyssaleEndpointOutputs['getGenerationRequest']
		>(`generation-request/${args.generationRequestId}`, ctx.key, {
			method: 'GET',
		});

		const result = parseOutput('getGenerationRequest', response);

		if (result.is_finalized && result.banners.length > 0) {
			await cacheEntities(ctx, 'banners', result.banners);
		}

		await logEventFromContext(
			ctx,
			'abyssale.generation.status',
			{
				generation_request_id: args.generationRequestId,
				is_finalized: result.is_finalized,
			},
			'completed',
		);
		return result;
	};
