import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { BlackbaudAPIError, makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

// OneRoster OAuth2 discovery metadata (public key / configuration endpoints).
// Token issuance uses the client-credentials grant via the OAuth token endpoint
// directly (HTTP Basic auth + scope) and is not exposed as a data endpoint.
// Ref: https://developer.blackbaud.com/skyapi/products/bbem/oneroster/authorization
export const oneRosterOAuth2BaseApi: BlackbaudEndpoints['oneRosterOAuth2BaseApi'] =
	async (ctx, input) => {
		let endpoint: string;

		if (input.operation === 'openid-configuration') {
			endpoint =
				'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration';
		} else if (input.operation === 'publickeys') {
			endpoint = 'https://oauth2.sky.blackbaud.com/publickeys';
		} else {
			throw new BlackbaudAPIError(
				`Unsupported OneRoster operation: ${input.operation}`,
			);
		}

		const response = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['oneRosterOAuth2BaseApi']
		>(endpoint, ctx.key, {
			method: 'GET',
			subscriptionKey: ctx.options.subscriptionKey,
		});

		await logEventFromContext(
			ctx,
			'blackbaud.oneroster.oauth2',
			{ operation: input.operation },
			'completed',
		);
		return response;
	};
