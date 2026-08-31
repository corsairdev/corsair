import { logEventFromContext } from 'corsair/core';
import { makeKrakenRequest, parseKrakenCredentials } from '../client';
import type { KrakenEndpoints } from '../index';
import type { KrakenEndpointOutputs } from './types';

export const optimizeUrl: KrakenEndpoints['imageOptimizeUrl'] = async (
	ctx,
	input,
) => {
	const credentials = parseKrakenCredentials(ctx.key);

	const response = await makeKrakenRequest<
		KrakenEndpointOutputs['imageOptimizeUrl']
	>('v1/url', credentials, {
		url: input.url,
		wait: input.wait,
		lossy: input.lossy,
		filename: input.filename,
		callback_url: input.callback_url,
	});

	await logEventFromContext(
		ctx,
		'kraken.image.optimizeUrl',
		{ ...input },
		'completed',
	);
	return response;
};

export const preserveMetadata: KrakenEndpoints['imagePreserveMetadata'] =
	async (ctx, input) => {
		const credentials = parseKrakenCredentials(ctx.key);

		const response = await makeKrakenRequest<
			KrakenEndpointOutputs['imagePreserveMetadata']
		>('v1/url', credentials, {
			url: input.url,
			preserve_meta: input.preserve_meta,
			wait: input.wait,
			lossy: input.lossy,
			filename: input.filename,
		});

		await logEventFromContext(
			ctx,
			'kraken.image.preserveMetadata',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sandboxUpload: KrakenEndpoints['imageSandboxUpload'] = async (
	ctx,
	input,
) => {
	const credentials = parseKrakenCredentials(ctx.key);

	// `dev: true` is intentionally not caller-controllable: it's the whole
	// point of this tool (validate integration without spending real quota),
	// and randomized results would be misleading if surfaced from the
	// production optimize endpoint by mistake.
	const response = await makeKrakenRequest<
		KrakenEndpointOutputs['imageSandboxUpload']
	>('v1/url', credentials, {
		url: input.url,
		wait: input.wait,
		filename: input.filename,
		dev: true,
	});

	await logEventFromContext(
		ctx,
		'kraken.image.sandboxUpload',
		{ ...input },
		'completed',
	);
	return response;
};
