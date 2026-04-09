import { logEventFromContext } from 'corsair/core';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest } from '../client';
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

		const raw = await makeGrafanaRawRequest(
			'/login/saml/acs',
			ctx.key,
			grafanaUrl,
			{
				method: 'POST',
				body: params.toString(),
				contentType: 'application/x-www-form-urlencoded',
			},
		);

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

	if (ctx.db.samlSessions) {
		try {
			// Use saml_response hash prefix as stable session ID
			const sessionId = `saml-${input.saml_response.slice(0, 16)}`;
			await ctx.db.samlSessions.upsertByEntityId(sessionId, {
				id: sessionId,
				...result.data,
				statusCode: result.data.status_code,
				successful: result.successful,
				processedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save SAML session to database:', err);
		}
	}

	await logEventFromContext(ctx, 'grafana.saml.postAcs', {}, 'completed');
	return result;
};

export const retrieveJwks: GrafanaEndpoints['jwksRetrieve'] = async (
	ctx,
	_input,
) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['jwksRetrieve'];

	// Try known Grafana JWKS paths in order; use raw request to avoid throwing on 404
	const jwksPaths = [
		'/api/signing-keys/jwks',
		'/.well-known/jwks.json',
		'/api/jwks',
	];

	try {
		let raw: {
			content: string;
			content_type: string;
			status_code: number;
		} | null = null;

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
				// JSON.parse returns any; cast to extract the keys array from the JWKS response object
				parsed = JSON.parse(raw.content);
			} catch {
				// Not valid JSON — return empty keys
			}
			result = {
				data: {
					// parsed.keys elements are cast here because each key's shape depends on the algorithm (RSA, EC, etc.)
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

	if (result.successful && ctx.db.jwksKeys && result.data.keys?.length) {
		try {
			for (const key of result.data.keys) {
				const keyId = crypto.randomUUID();
				await ctx.db.jwksKeys.upsertByEntityId(String(keyId), {
					...key,
					id: String(keyId),
					use: key?.Use,
					algorithm: key?.Algorithm,
					certificates: key?.Certificates,
					certificatesUrl: key?.CertificatesURL,
					// keyMaterial is the raw cryptographic key object; shape varies by algorithm (RSA, EC, etc.)
					keyMaterial: key?.Key,
					fetchedAt: new Date(),
				});
			}
		} catch (err) {
			console.warn('Failed to save JWKS keys to database:', err);
		}
	}

	await logEventFromContext(ctx, 'grafana.jwks.retrieve', {}, 'completed');
	return result;
};
