import { logEventFromContext } from 'corsair/core';
import { makeKrakenRequest, parseKrakenCredentials } from '../client';
import type { KrakenEndpoints } from '../index';
import {
	KrakenEndpointInputSchemas,
	KrakenEndpointOutputSchemas,
} from './types';

export const optimizeUrl: KrakenEndpoints['imageOptimizeUrl'] = async (
	ctx,
	rawInput,
) => {
	const input = KrakenEndpointInputSchemas.imageOptimizeUrl.parse(rawInput);
	const credentials = parseKrakenCredentials(ctx.key);

	const response = await makeKrakenRequest('v1/url', credentials, {
		url: input.url,
		wait: input.wait,
		lossy: input.lossy,
		filename: input.filename,
		callback_url: input.callback_url,
	});
	const result = KrakenEndpointOutputSchemas.imageOptimizeUrl.parse(response);

	await logEventFromContext(
		ctx,
		'kraken.image.optimizeUrl',
		{ ...input },
		'completed',
	);
	return result;
};

export const preserveMetadata: KrakenEndpoints['imagePreserveMetadata'] =
	async (ctx, rawInput) => {
		const input =
			KrakenEndpointInputSchemas.imagePreserveMetadata.parse(rawInput);
		const credentials = parseKrakenCredentials(ctx.key);

		const response = await makeKrakenRequest('v1/url', credentials, {
			url: input.url,
			preserve_meta: input.preserve_meta,
			wait: input.wait,
			lossy: input.lossy,
			filename: input.filename,
		});
		const result =
			KrakenEndpointOutputSchemas.imagePreserveMetadata.parse(response);

		await logEventFromContext(
			ctx,
			'kraken.image.preserveMetadata',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sandboxUpload: KrakenEndpoints['imageSandboxUpload'] = async (
	ctx,
	rawInput,
) => {
	const input = KrakenEndpointInputSchemas.imageSandboxUpload.parse(rawInput);
	const credentials = parseKrakenCredentials(ctx.key);

	// `dev: true` is intentionally not caller-controllable: it's the whole
	// point of this tool (validate integration without spending real quota),
	// and randomized results would be misleading if surfaced from the
	// production optimize endpoint by mistake. The input schema doesn't
	// declare a `dev` field, so `.parse()` above already strips any
	// caller-supplied value before we set it here.
	const response = await makeKrakenRequest('v1/url', credentials, {
		url: input.url,
		wait: input.wait,
		filename: input.filename,
		dev: true,
	});
	const result = KrakenEndpointOutputSchemas.imageSandboxUpload.parse(response);

	await logEventFromContext(
		ctx,
		'kraken.image.sandboxUpload',
		{ ...input },
		'completed',
	);
	return result;
};
