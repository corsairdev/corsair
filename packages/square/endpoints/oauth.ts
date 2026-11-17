import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /oauth2/token/status (RetrieveTokenStatus). */
export const getTokenStatus: SquareEndpoints['oauthGetTokenStatus'] = async (
	ctx,
	rawInput,
) => {
	// The call takes no input; parsing still refuses a malformed one.
	SquareEndpointInputSchemas.oauthGetTokenStatus.parse(rawInput ?? {});
	return callSquare(ctx, '/oauth2/token/status', {
		method: 'POST',
		output: SquareEndpointOutputSchemas.oauthGetTokenStatus,
		event: 'oauth.getTokenStatus',
	});
};
