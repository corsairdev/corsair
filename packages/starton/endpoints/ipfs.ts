import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import { persistEntities } from './persist';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * Upload a file to the project's IPFS storage and pin it. The returned pin
 * carries the content `cid`.
 *
 * API: POST /v3/ipfs/file (multipart/form-data: file, metadata) -> Pin
 */
export const uploadFile: StartonEndpoints['ipfsUploadFile'] = async (
	ctx,
	input,
) => {
	const { content, filename, contentType, metadata } =
		StartonEndpointInputSchemas.ipfsUploadFile.parse(input);
	const file = new File([Buffer.from(content, 'base64')], filename, {
		type: contentType ?? 'application/octet-stream',
	});
	// Safe: the zod parse below validates the payload before it is used.
	// A narrower type is not practical because the request layer cannot know each response shape.
	const response = await makeStartonRequest<unknown>('v3/ipfs/file', ctx.key, {
		method: 'POST',
		formData: { file, metadata },
		// Each success creates a new pin — never replay it.
		replayable: false,
	});
	const pin = StartonEndpointOutputSchemas.ipfsUploadFile.parse(response);
	await persistEntities(ctx.db.pins, [{ entityId: pin.id, data: pin }], 'pin');
	await logEventFromContext(
		ctx,
		'starton.ipfs.uploadFile',
		{ filename, cid: pin.cid },
		'completed',
	);
	return pin;
};
