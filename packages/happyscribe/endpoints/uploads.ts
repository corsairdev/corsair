import type { HappyScribeEndpoints } from '..';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

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
			// The caller PUTs the bytes to the S3 URL themselves; the plugin
			// never touches the media. The host only, never the signature.
			log: (_parsed, result) => ({
				signedUrlHost: new URL(result.signedUrl).host,
			}),
		},
	);
