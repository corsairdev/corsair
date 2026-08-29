import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const oneRosterOAuth2BaseApi: BlackbaudEndpoints['oneRosterOAuth2BaseApi'] =
	async (ctx, input) => {
		let endpoint = '';
		let method: 'GET' | 'POST' = 'GET';
		let body: any = undefined;
		let headers: Record<string, string> | undefined = undefined;

		if (input.operation === 'openid-configuration') {
			endpoint =
				'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration';
			method = 'GET';
		} else if (input.operation === 'publickeys') {
			endpoint = 'https://oauth2.sky.blackbaud.com/publickeys';
			method = 'GET';
		} else if (input.operation === 'token') {
			endpoint = 'https://oauth2.sky.blackbaud.com/token';
			method = 'POST';
			body = new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: input.clientId || '',
				client_secret: input.clientSecret || '',
			}).toString();
			headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
			};
		}

		const response = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['oneRosterOAuth2BaseApi']
		>(endpoint, ctx.key, {
			method,
			body,
			headers,
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
