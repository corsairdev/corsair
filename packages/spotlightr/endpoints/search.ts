import type { SpotlightrEndpoints } from '..';
import { call } from './call';
import {
	SpotlightrEndpointInputSchemas,
	SpotlightrEndpointOutputSchemas,
} from './types';

export const search: SpotlightrEndpoints['search'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'search',
			input: SpotlightrEndpointInputSchemas.search,
			output: SpotlightrEndpointOutputSchemas.search,
		},
		input,
		(parsed) => ({
			method: 'POST',
			// POST with the term in the body: the reference lists no query params
			// for this route.
			path: 'search/global',
			body: { query: parsed.query },
		}),
		{ log: (parsed) => ({ query_length: parsed.query.length }) },
	);

export const uploadAsset: SpotlightrEndpoints['assetsUpload'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'assets.upload',
			input: SpotlightrEndpointInputSchemas.uploadAsset,
			output: SpotlightrEndpointOutputSchemas.uploadAsset,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'assets',
			formData: { file: parsed.file },
		}),
		{
			log: (parsed) => ({
				file_type: parsed.file.type,
				file_size: parsed.file.size,
			}),
		},
	);
