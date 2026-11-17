import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Scans text (or the text of a page, when `content` is a URL) for profanity and
 * returns the words found and a censored copy. The text goes in a form body, so
 * long content does not hit URL length limits.
 */
export const badWordFilter: NeutrinoEndpoints['badWordFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'text.badWordFilter',
			input: Inputs.badWordFilter,
			output: Outputs.badWordFilter,
		},
		input,
		({ content, censorCharacter, catalog }) => ({
			method: 'POST',
			path: '/bad-word-filter',
			form: {
				content,
				'censor-character': censorCharacter,
				catalog,
			},
		}),
		{
			// The scanned text is the caller's content, so only counts are logged.
			log: (_, result) => ({
				isBad: result['is-bad'] ?? undefined,
				total: result['bad-words-total'] ?? undefined,
			}),
		},
	);
