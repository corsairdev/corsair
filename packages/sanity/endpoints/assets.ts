import { logEventFromContext } from 'corsair/core';
import { makeSanityRequest, SanityError } from '../client';
import type { SanityEndpoints } from '../index';
import { resolveTarget } from './shared';
import {
	SanityEndpointInputSchemas as Inputs,
	MAX_UPLOAD_BYTES,
	SanityEndpointOutputSchemas as Outputs,
} from './types';

/** One minute, plus a second for every 512 KB. */
function uploadTimeoutMs(bytes: number): number {
	return 60_000 + Math.ceil(bytes / (512 * 1024)) * 1000;
}

export const upload: SanityEndpoints['assetsUpload'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.assetsUpload.parse(rawInput);
	const bytes = Buffer.from(input.contentBase64, 'base64');
	if (bytes.byteLength === 0 || bytes.byteLength > MAX_UPLOAD_BYTES) {
		throw new SanityError(
			`The file must be between 1 byte and ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
			'invalid_input',
		);
	}
	const { projectId, dataset } = await resolveTarget(ctx, input.dataset);
	const kind = input.kind === 'image' ? 'images' : 'files';
	const result = await makeSanityRequest<{ document?: unknown }>(
		ctx.key,
		{ projectId },
		`/assets/${kind}/${dataset}`,
		{
			method: 'POST',
			bytes: new Uint8Array(bytes),
			contentType: input.contentType,
			query: {
				filename: input.filename,
				title: input.title,
				description: input.description,
				label: input.label,
				meta: input.kind === 'image' ? input.imageMetadata : undefined,
			},
			timeoutMs: uploadTimeoutMs(bytes.byteLength),
		},
	);
	const response = Outputs.assetsUpload.parse({ asset: result?.document });
	await logEventFromContext(
		ctx,
		'sanity.assets.upload',
		{
			dataset,
			kind: input.kind,
			assetId: response.asset._id,
			size: bytes.byteLength,
		},
		'completed',
	);
	return response;
};
