import type { ApiLabzEndpoints } from '..';
import { executeApiLabzModule } from './shared';
import {
	ApiLabzEndpointInputSchemas,
	ApiLabzEndpointOutputSchemas,
} from './types';

/** AI search across Trello cards (API_LABZ_TRELLO_AI_SEARCH_ENGINE). */
export const aiSearchEngine: ApiLabzEndpoints['trelloAiSearchEngine'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ApiLabzEndpointInputSchemas.trelloAiSearchEngine.parse(input);
	return executeApiLabzModule(
		ctx,
		'apilabz.trello.aiSearchEngine',
		'trelloAiSearchEngine',
		parsedInput,
		ApiLabzEndpointOutputSchemas.trelloAiSearchEngine,
	);
};
