import type { ShotstackEndpoints } from '..';
import { attributesOf } from '../client';
import { call } from './call';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const create: ShotstackEndpoints['uploadsCreate'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'uploads.create',
			input: ShotstackEndpointInputSchemas.uploadsCreate,
			output: ShotstackEndpointOutputSchemas.uploadsCreate,
		},
		rawInput,
		() => ({ method: 'POST', service: 'ingest', path: '/upload' }),
		{
			// json:api unwrapped: the signed PUT URL and its expiry, with no
			// attributes of its own to send. The binary upload itself goes
			// straight to S3 with the signed URL, not through this plugin.
			shape: (raw) => attributesOf(raw),
			log: (_input, result) => ({ uploadId: result.id }),
		},
	);
};
