import { FILLOUT_AUTH_URL } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const authorizeOAuth: FilloutFormsEndpoints['authorizeOAuth'] = async (
	_ctx,
	input,
) => {
	const params = new URLSearchParams({
		client_id: input.clientId,
		redirect_uri: input.redirectUri,
	});

	if (input.state) {
		params.set('state', input.state);
	}

	const authorizationUrl = `${FILLOUT_AUTH_URL}?${params.toString()}`;

	return { authorizationUrl };
};
