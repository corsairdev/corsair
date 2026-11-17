import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	makeETerminRequest,
	makeETerminSyncRequest,
	parseETerminCredentials,
} from '../client';
import type { ETerminContext } from '../index';
import type { ETerminOperation } from './operation-types';
import type { ETerminEndpointInputs, ETerminEndpointOutputs } from './types';

// The keyBuilder resolves both keys (options first, then the account's stored
// api_key and api_secret) into ctx.key, so endpoints never read ctx.options.
async function credentialsForContext(ctx: ETerminContext) {
	const credentials = parseETerminCredentials(ctx.key);
	if (!credentials) throw new AuthMissingError('etermin', 'api_key');
	return credentials;
}

export function createETerminSyncEndpoint(): CorsairEndpoint<
	ETerminContext,
	ETerminEndpointInputs['appointmentSyncList'],
	ETerminEndpointOutputs['appointmentSyncList']
> {
	return async (ctx, input) =>
		await makeETerminSyncRequest(
			'/api/appointmentsync',
			await credentialsForContext(ctx),
			input.synctoken,
		);
}

export function createETerminEndpoint<K extends keyof ETerminEndpointInputs>(
	operation: ETerminOperation & { key: K },
): CorsairEndpoint<
	ETerminContext,
	ETerminEndpointInputs[K],
	ETerminEndpointOutputs[K]
> {
	return async (ctx, input) => {
		const credentials = await credentialsForContext(ctx);
		// Input schemas accept documented language-suffixed fields dynamically; all
		// schema values are scalar query values before they reach this transport.
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		return await makeETerminRequest<ETerminEndpointOutputs[K]>(
			operation.path,
			credentials,
			{
				method: operation.method,
				query,
			},
		);
	};
}
