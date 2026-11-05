import { logEventFromContext } from 'corsair/core';
import type { AccredibleCertificatesEndpoints } from '..';
import {
	AccredibleCertificatesAPIError,
	makeAccredibleCertificatesRequest,
} from '../client';
import { cacheCredential } from './persist';
import type { AccredibleCertificatesEndpointOutputs } from './types';
import { AccredibleCertificatesEndpointOutputSchemas } from './types';

/**
 * `GET /v1/credentials/{id}` — "View a Credential" in the official OpenAPI
 * document.
 */
export const getCredential: AccredibleCertificatesEndpoints['getCredential'] =
	async (ctx, input) => {
		// Endpoint inputs are not validated by the binder, so the guard has to
		// live here. Without it a blank id would request the collection route
		// and a value like `../issuer/details` would leave the credentials
		// resource entirely.
		const rawId = typeof input.id === 'number' ? String(input.id) : input.id;
		const id = rawId?.trim();
		if (!id) {
			throw new AccredibleCertificatesAPIError('Credential id is required');
		}

		const response = await makeAccredibleCertificatesRequest<
			AccredibleCertificatesEndpointOutputs['getCredential']
		>(`credentials/${encodeURIComponent(id)}`, ctx.key, {
			method: 'GET',
			schema: AccredibleCertificatesEndpointOutputSchemas.getCredential,
		});

		await cacheCredential(ctx.db?.credentials, response.credential);

		await logEventFromContext(
			ctx,
			'accrediblecertificates.credentials.get',
			{ id },
			'completed',
		);

		return response;
	};
