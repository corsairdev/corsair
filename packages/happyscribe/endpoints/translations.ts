import type { HappyScribeContext, HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

export const createTask: HappyScribeEndpoints['translationsCreateTask'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'translations.createTask',
			input: Inputs.translationsCreateTask,
			output: Outputs.translationsCreateTask,
		},
		input,
		({ sourceTranscriptionId, targetLanguage }) => ({
			method: 'POST',
			path: '/task/transcription_translation',
			body: {
				source_transcription_id: sourceTranscriptionId,
				target_language: targetLanguage,
			},
		}),
		{
			log: (parsed, result) => ({
				taskId: result.id,
				targetLanguage: parsed.targetLanguage,
			}),
		},
	);

export const getTask: HappyScribeEndpoints['translationsGetTask'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'translations.getTask',
			input: Inputs.translationsGetTask,
			output: Outputs.translationsGetTask,
		},
		input,
		({ taskId }) => ({
			method: 'GET',
			path: `/task/transcription_translation/${segment(taskId)}`,
			replaySafe: true,
		}),
	);
