import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type { SchemaGenerateResponse } from './types';

export const generate: ScrapegraphAiEndpoints['schemaGenerate'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SchemaGenerateResponse>(
		'v1/generate_schema',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.schema.generate',
		{ ...input },
		'completed',
	);
	return response;
};
