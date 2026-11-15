import type { KrakenEndpoints } from '..';
import { definedBody } from '../client';
import { call } from './call';
import {
	KrakenEndpointInputSchemas as Inputs,
	KrakenEndpointOutputSchemas as Outputs,
} from './types';

/** The shared optimization options, which both routes take by the same names. */
function optionBody(parsed: {
	wait?: boolean;
	callback_url?: string;
	lossy?: boolean;
	quality?: number;
	auto_orient?: boolean;
	preserve_meta?: readonly string[];
	convert?: { format: string; background?: string };
	resize?: { width?: number; height?: number; strategy?: string };
}) {
	return definedBody({
		wait: parsed.wait,
		callback_url: parsed.callback_url,
		lossy: parsed.lossy,
		quality: parsed.quality,
		auto_orient: parsed.auto_orient,
		preserve_meta: parsed.preserve_meta,
		convert: parsed.convert,
		resize: parsed.resize,
	});
}

export const url: KrakenEndpoints['urlOptimize'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'url.optimize',
			input: Inputs.urlOptimize,
			output: Outputs.urlOptimize,
		},
		input,
		(parsed) => ({
			path: '/v1/url',
			body: { url: parsed.url, ...optionBody(parsed) },
		}),
		{
			// The source URL is not logged: it can carry a token in its query.
			log: (_, result) => ({
				success: result.success,
				originalBytes: result.original_size ?? undefined,
				krakedBytes: result.kraked_size ?? undefined,
				savedBytes: result.saved_bytes ?? undefined,
				// A one-file answer is flat; a multi-size one fills `results`.
				files: result.results
					? Object.keys(result.results).length
					: result.kraked_url
						? 1
						: 0,
			}),
		},
	);

// The caller passes base64, because a tool call carries text. Kraken takes the
// file as a multipart part, so the endpoint decodes it here.
function decodeUpload(data: string): Uint8Array {
	// A data URL is accepted too: only the part after the comma is the file.
	const base64 = data.startsWith('data:')
		? data.slice(data.indexOf(',') + 1)
		: data;
	const bytes = Buffer.from(base64, 'base64');
	if (bytes.length === 0) {
		throw new Error(
			'`data` decoded to an empty file; pass the file as base64.',
		);
	}
	return new Uint8Array(bytes);
}

export const upload: KrakenEndpoints['uploadOptimize'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'upload.optimize',
			input: Inputs.uploadOptimize,
			output: Outputs.uploadOptimize,
		},
		input,
		(parsed) => ({
			path: '/v1/upload',
			body: optionBody(parsed),
			file: {
				bytes: decodeUpload(parsed.data),
				filename: parsed.filename ?? 'upload',
			},
		}),
		{
			log: (_, result) => ({
				success: result.success,
				originalBytes: result.original_size ?? undefined,
				krakedBytes: result.kraked_size ?? undefined,
				savedBytes: result.saved_bytes ?? undefined,
			}),
		},
	);

export const account: KrakenEndpoints['accountStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.status',
			input: Inputs.accountStatus,
			output: Outputs.accountStatus,
		},
		input,
		() => ({ path: '/user_status', body: {} }),
		{
			log: (_, result) => ({
				active: result.active ?? undefined,
				plan: result.plan_name ?? undefined,
				remainingBytes: result.quota_remaining ?? undefined,
			}),
		},
	);
