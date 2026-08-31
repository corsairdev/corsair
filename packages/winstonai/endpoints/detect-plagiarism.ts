import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import { WinstonaiEndpointOutputSchemas } from './types';

export const detectPlagiarism: WinstonaiEndpoints['detectPlagiarism'] = async (
	ctx,
	input,
) => {
	const response = await makeWinstonaiRequest('/plagiarism', ctx.key, {
		schema: WinstonaiEndpointOutputSchemas.detectPlagiarism,
		body: {
			text: input.text,
			file: input.file,
			website: input.website,
			excluded_sources: input.excluded_sources,
			language: input.language,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'winstonai.detect.plagiarism',
		{ ...input },
		'completed',
	);

	return response;
};
