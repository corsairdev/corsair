import { asRecord } from 'corsair/core';
import type { HappyScribeEndpoints } from '..';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

// unknown: raw is the response body until the output schema validates it.
// The live API answers `{ signed_url }`; the plugin exposes signedUrl.
function withSignedUrl(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || record.signed_url === undefined) return raw;
	const { signed_url, ...rest } = record;
	return { ...rest, signedUrl: signed_url };
}

export const getSignedUrl: HappyScribeEndpoints['uploadsGetSignedUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'uploads.getSignedUrl',
			input: Inputs.uploadsGetSignedUrl,
			output: Outputs.uploadsGetSignedUrl,
		},
		input,
		({ filename }) => ({
			method: 'GET',
			path: '/uploads/new',
			query: { filename },
			replaySafe: true,
		}),
		{
			shape: withSignedUrl,
			// The caller PUTs the bytes to the S3 URL themselves; the plugin
			// never touches the media. The host only, never the signature.
			log: (_parsed, result) => ({
				signedUrlHost: new URL(result.signedUrl).host,
			}),
		},
	);
