import { logEventFromContext } from 'corsair/core';
import { makeRemovebgRequest } from '../client';
import type { RemovebgEndpoints } from '../index';
import { SubmitImprovementInputSchema } from './types';

export const submit: RemovebgEndpoints['improvement'] = async (
	ctx,
	rawInput,
) => {
	const input = SubmitImprovementInputSchema.parse(rawInput);

	await makeRemovebgRequest<unknown>('/improve', ctx.key, {
		method: 'POST',
		body: {
			image_url: input.imageUrl,
			image_file_b64: input.imageFileB64,
			error_type: input.errorType,
			error_description: input.errorDescription,
		},
	});

	await logEventFromContext(
		ctx,
		'removebg.improvement.submit',
		{
			source: input.imageUrl ? 'url' : 'file',
			errorType: input.errorType,
		},
		'completed',
	);

	return { success: true };
};
