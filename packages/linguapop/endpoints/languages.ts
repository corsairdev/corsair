import type { LinguapopEndpoints } from '..';
import { call } from './call';
import {
	LinguapopEndpointInputSchemas as Inputs,
	LinguapopEndpointOutputSchemas as Outputs,
} from './types';

/**
 * GET /api/actions/getLanguages. A live probe answered it without a key, so
 * none is sent; the account key is still resolved because core does that
 * before any endpoint runs.
 */
export const list: LinguapopEndpoints['languagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'languages.list',
			input: Inputs.languagesList,
			output: Outputs.languagesList,
		},
		input,
		() => ({ method: 'GET', action: 'getLanguages' }),
		(_parsed, result) => ({ count: result.length }),
	);
