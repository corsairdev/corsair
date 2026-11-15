import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

export const suggestions: RiteKitEndpoints['emojisSuggestions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emojis.suggestions',
			input: Inputs.emojisSuggestions,
			output: Outputs.emojisSuggestions,
		},
		input,
		({ text }) => ({
			method: 'GET',
			path: '/v1/emoji/suggestions',
			query: { text },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.emojis?.length ?? 0 }),
		},
	);

export const auto: RiteKitEndpoints['emojisAuto'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'emojis.auto',
			input: Inputs.emojisAuto,
			output: Outputs.emojisAuto,
		},
		input,
		({ text }) => ({
			method: 'GET',
			path: '/v1/emoji/auto-emojify',
			query: { text },
			replayable: true,
		}),
		{
			log: (_, result) => ({ length: result.text?.length ?? 0 }),
		},
	);
