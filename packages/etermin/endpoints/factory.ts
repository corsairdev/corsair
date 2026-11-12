import type { AccountKeyManagerFor, CorsairEndpoint } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { makeETerminRequest, makeETerminSyncRequest } from '../client';
import type { ETerminAuthConfig, ETerminContext } from '../index';
import type { ETerminOperation } from './operation-types';
import type { ETerminEndpointInputs, ETerminEndpointOutputs } from './types';

type ETerminAccountKeys = AccountKeyManagerFor<
	'api_key',
	typeof ETerminAuthConfig
>;

async function credentialsForContext(ctx: ETerminContext) {
	const publicKey = ctx.options.publicKey ?? ctx.key;
	const privateKey =
		ctx.options.privateKey ??
		(await (ctx.keys as ETerminAccountKeys).get_api_secret());
	if (!publicKey || !privateKey)
		throw new AuthMissingError('etermin', 'api_key');
	return { publicKey, privateKey };
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
