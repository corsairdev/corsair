import { logEventFromContext } from 'corsair/core';
import { makeKrakenRequest, parseKrakenCredentials } from '../client';
import type { KrakenEndpoints } from '../index';
import {
	KrakenEndpointInputSchemas,
	KrakenEndpointOutputSchemas,
} from './types';

/**
 * Callers often pass presigned URLs (S3, GCS, ...) carrying a signed access
 * token in the query string. Event payloads are durably stored, so strip the
 * query string before logging — the scheme/host/path is enough to identify
 * the request without persisting the credential.
 */
function redactUrlForLogging(url: string): string {
	try {
		const parsed = new URL(url);
		parsed.search = '';
		return parsed.toString();
	} catch {
		return '[redacted]';
	}
}

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
		{
			...input,
			url: redactUrlForLogging(input.url),
			callback_url: input.callback_url
				? redactUrlForLogging(input.callback_url)
				: undefined,
		},
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
			{ ...input, url: redactUrlForLogging(input.url) },
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
		{ ...input, url: redactUrlForLogging(input.url) },
		'completed',
	);
	return result;
};
