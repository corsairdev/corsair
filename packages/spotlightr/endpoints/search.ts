import type { SpotlightrEndpoints } from '..';
import { call, uploadFile } from './call';
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
) => {
	// The file as sent, for the log: a link's type and size are known only
	// once it is fetched.
	let sent: Blob | undefined;
	return call(
		ctx,
		{
			event: 'assets.upload',
			input: SpotlightrEndpointInputSchemas.uploadAsset,
			output: SpotlightrEndpointOutputSchemas.uploadAsset,
		},
		input,
		async (parsed) => {
			sent = await uploadFile(parsed.file, 'asset');
			return { method: 'POST', path: 'assets', formData: { file: sent } };
		},
		{ log: () => ({ file_type: sent?.type, file_size: sent?.size }) },
	);
};
