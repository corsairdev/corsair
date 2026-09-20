import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const getSignedUrl = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.uploadsGetSignedUrl.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/uploads/signed-url', ctx.key, {
		method: 'POST',
		body: {
			file_name: parsed.file_name,
			content_type: parsed.content_type,
		},
	});

	const response = CodyEndpointOutputSchemas.uploadsGetSignedUrl.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.uploads.getSignedUrl',
		{ file_name: parsed.file_name },
		'completed',
	);

	return response;
};
