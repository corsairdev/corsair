import type { PlacidEndpoints } from '..';
import { call } from './call';
import { downloadAsFile } from './download';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const upload: PlacidEndpoints['mediaUpload'] = async (ctx, rawInput) => {
	const parsed = Inputs.mediaUpload.parse(rawInput ?? {});
	// Placid files each part under the key the caller chose; `file` is its own
	// example, and the reply repeats that key back.
	const key = parsed.file_key ?? 'file';
	const file = await downloadAsFile(parsed.file_url, parsed.filename, 'upload');

	return await call(
		ctx,
		{
			event: 'media.upload',
			input: Inputs.mediaUpload,
			output: Outputs.mediaUpload,
		},
		parsed,
		() => ({ method: 'POST', path: '/media', formData: { [key]: file } }),
		{
			log: (_, result) => ({ count: result.media.length }),
		},
	);
};
