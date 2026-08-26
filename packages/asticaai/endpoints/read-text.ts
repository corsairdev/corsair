import { logEventFromContext } from 'corsair/core';
import type { AsticaAiEndpoints } from '..';
import { ASTICAAI_VISION_API_BASE, makeAsticaAiRequest } from '../client';
import {
	assertAsticaOk,
	describeInput,
	inputEntityId,
	inputFingerprint,
} from './shared';
import type { AsticaReadTextOutput } from './types';
import { AsticaReadTextInputSchema, AsticaReadTextOutputSchema } from './types';

export const read: AsticaAiEndpoints['readText'] = async (ctx, input) => {
	const query = AsticaReadTextInputSchema.parse(input);

	const response = AsticaReadTextOutputSchema.parse(
		await makeAsticaAiRequest<AsticaReadTextOutput>('/describe', ctx.key, {
			baseUrl: ASTICAAI_VISION_API_BASE,
			body: {
				input: query.input,
				modelVersion: query.modelVersion,
				visionParams: 'text_read',
			},
		}),
	);

	assertAsticaOk(response);

	const pages = response.readResult?.pages ?? [];

	try {
		await ctx.db.readTextResults.upsertByEntityId(inputEntityId(query.input), {
			inputFingerprint: inputFingerprint(query.input),
			...describeInput(query.input),
			modelVersion: query.modelVersion,
			content: response.readResult?.content ?? null,
			pageCount: pages.length,
			lineCount: pages.reduce((n, page) => n + (page.lines?.length ?? 0), 0),
			readAt: new Date(),
		});
	} catch (error) {
		console.warn('[asticaai] Failed to save OCR result:', error);
	}

	await logEventFromContext(
		ctx,
		'asticaai.read_text',
		{
			...describeInput(query.input),
			modelVersion: query.modelVersion,
			pageCount: pages.length,
		},
		'completed',
	);

	return response;
};
