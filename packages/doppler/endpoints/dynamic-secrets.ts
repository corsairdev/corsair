import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Revokes a leased dynamic secret credential before its TTL expires. */
export const revokeLease: DopplerEndpoints['dynamicSecretsRevokeLease'] =
	async (ctx, input) => {
		const result = await dopplerCall<
			DopplerEndpointOutputs['dynamicSecretsRevokeLease']
		>(ctx, 'configs/config/dynamic_secrets/dynamic_secret/leases/lease', {
			method: 'DELETE',
			body: {
				project: input.project,
				config: input.config,
				dynamic_secret: input.dynamicSecret,
				slug: input.slug,
			},
		});

		await logEventFromContext(
			ctx,
			'doppler.dynamicSecrets.revokeLease',
			auditPayload(input, ['project', 'config', 'dynamicSecret', 'slug']),
			'completed',
		);
		return result;
	};
