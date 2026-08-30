import { logEventFromContext } from 'corsair/core';
import { makeRemovebgRequest } from '../client';
import type { RemovebgEndpoints } from '../index';
import {
	SubmitImprovementInputSchema,
	SubmitImprovementOutputSchema,
	SubmitImprovementResponseSchema,
} from './types';

export const submit: RemovebgEndpoints['improvement'] = async (
	ctx,
	rawInput,
) => {
	const input = SubmitImprovementInputSchema.parse(rawInput);

	const rawResponse = await makeRemovebgRequest('/improve', ctx.key, {
		method: 'POST',
		body: {
			image_url: input.imageUrl,
			image_file_b64: input.imageFileB64,
			error_type: input.errorType,
			error_description: input.errorDescription,
		},
	});

	// Throws if remove.bg's response doesn't match the documented shape,
	// instead of silently reporting success on a drifted/error payload.
	SubmitImprovementResponseSchema.parse(rawResponse);
	const response = SubmitImprovementOutputSchema.parse({ success: true });

	await logEventFromContext(
		ctx,
		'removebg.improvement.submit',
		{
			source: input.imageUrl ? 'url' : 'file',
			errorType: input.errorType,
		},
		'completed',
	);

	return response;
};
