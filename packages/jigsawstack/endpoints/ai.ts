import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const sentiment: JigsawstackEndpoints['sentiment'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.ai.sentiment',
		'/v1/ai/sentiment',
		'POST',
		input,
		{
			body: input,
		},
	);

export const summary: JigsawstackEndpoints['summary'] = async (ctx, input) =>
	jigsawCall(ctx, 'jigsawstack.ai.summary', '/v1/ai/summary', 'POST', input, {
		body: input,
	});

export const translate: JigsawstackEndpoints['translate'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.ai.translate',
		'/v1/ai/translate',
		'POST',
		input,
		{
			body: input,
		},
	);

export const prediction: JigsawstackEndpoints['prediction'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.ai.prediction',
		'/v1/ai/prediction',
		'POST',
		input,
		{ body: input },
	);

export const imageGeneration: JigsawstackEndpoints['imageGeneration'] = async (
	ctx,
	input,
) => {
	const return_type = input.return_type ?? 'url';
	return jigsawCall(
		ctx,
		'jigsawstack.ai.imageGeneration',
		'/v1/ai/image_generation',
		'POST',
		input,
		{
			body: { ...input, return_type },
			binary: return_type === 'binary',
		},
	);
};
