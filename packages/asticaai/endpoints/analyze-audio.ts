import { logEventFromContext } from 'corsair/core';
import type { AsticaAiEndpoints } from '..';
import { ASTICAAI_LISTEN_API_BASE, makeAsticaAiRequest } from '../client';
import {
	assertAsticaOk,
	describeInput,
	inputEntityId,
	inputFingerprint,
} from './shared';
import type { AnalyzeAudioOutput } from './types';
import { AnalyzeAudioInputSchema, AnalyzeAudioOutputSchema } from './types';

export const analyze: AsticaAiEndpoints['analyzeAudio'] = async (
	ctx,
	input,
) => {
	const query = AnalyzeAudioInputSchema.parse(input);

	const response = AnalyzeAudioOutputSchema.parse(
		await makeAsticaAiRequest<AnalyzeAudioOutput>('/transcribe', ctx.key, {
			baseUrl: ASTICAAI_LISTEN_API_BASE,
			body: {
				input: query.input,
				modelVersion: query.modelVersion,
				doStream: query.doStream,
				low_priority: query.low_priority,
			},
		}),
	);

	assertAsticaOk(response);

	try {
		await ctx.db.audioTranscripts.upsertByEntityId(inputEntityId(query.input), {
			inputFingerprint: inputFingerprint(query.input),
			...describeInput(query.input),
			modelVersion: query.modelVersion,
			text: response.text ?? null,
			resultURI: response.resultURI ?? null,
			transcribedAt: new Date(),
		});
	} catch (error) {
		console.warn('[asticaai] Failed to save transcript:', error);
	}

	await logEventFromContext(
		ctx,
		'asticaai.analyze_audio',
		{
			...describeInput(query.input),
			modelVersion: query.modelVersion,
			deferred: response.resultURI != null,
		},
		'completed',
	);

	return response;
};
