import { logEventFromContext } from '../../utils/events';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest, makeGrafanaRequest } from '../client';
import type { GrafanaEndpointOutputs } from './types';

export const postAcs: GrafanaEndpoints['samlPostAcs'] = async (ctx, input) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['samlPostAcs'];

	try {
		// SAML ACS expects application/x-www-form-urlencoded body
		const params = new URLSearchParams();
		params.append('SAMLResponse', input.saml_response);
		if (input.relay_state) {
			params.append('RelayState', input.relay_state);
		}

		const raw = await makeGrafanaRawRequest('/login/saml/acs', ctx.key, grafanaUrl, {
			method: 'POST',
			// params.toString() produces a form-encoded string; typed as unknown here
			// because makeGrafanaRawRequest accepts unknown body
			body: params.toString() as unknown,
			contentType: 'application/x-www-form-urlencoded',
		});

		const isRedirect = raw.status_code === 302;
		const message = isRedirect
			? 'SAML authentication redirect'
			: raw.content || 'ACS processed';

		// Extract Location header from raw content when status is 302
		const locationMatch = /<meta[^>]+url=([^"]+)/.exec(raw.content);
		const location = locationMatch ? locationMatch[1] : undefined;

		result = {
			data: {
				status_code: raw.status_code,
				message,
				location,
			},
			successful: raw.status_code < 400,
		};
	} catch (error) {
		result = {
			data: {
				status_code: 0,
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	await logEventFromContext(ctx, 'grafana.saml.postAcs', {}, 'completed');
	return result;
};

export const retrieveJwks: GrafanaEndpoints['jwksRetrieve'] = async (ctx, _input) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['jwksRetrieve'];

	// Try known Grafana JWKS paths in order; use raw request to avoid throwing on 404
	const jwksPaths = ['/api/signing-keys/jwks', '/.well-known/jwks.json', '/api/jwks'];

	try {
		let raw: { content: string; content_type: string; status_code: number } | null = null;

		for (const path of jwksPaths) {
			const candidate = await makeGrafanaRawRequest(path, ctx.key, grafanaUrl);
			if (candidate.status_code === 200) {
				raw = candidate;
				break;
			}
		}

		if (!raw || raw.status_code !== 200) {
			result = { data: { keys: [] }, successful: true };
		} else {
			// Parse JSON response; keys field is typed as unknown[] from the JWKS spec
			let parsed: { keys?: unknown[] } = {};
			try {
				parsed = JSON.parse(raw.content) as { keys?: unknown[] };
			} catch {
				// Not valid JSON — return empty keys
			}
			result = {
				data: {
					// parsed.keys elements are typed as unknown[] and cast here because
					// each key's shape depends on the algorithm (RSA, EC, etc.)
					keys: parsed.keys as GrafanaEndpointOutputs['jwksRetrieve']['data']['keys'],
				},
				successful: true,
			};
		}
	} catch (error) {
		result = {
			data: {},
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	await logEventFromContext(ctx, 'grafana.jwks.retrieve', {}, 'completed');
	return result;
};
