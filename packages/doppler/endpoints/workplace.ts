import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerWorkplaceEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'workplace';

/** Retrieves the workplace - a singleton per account. */
export const get: DopplerEndpoints['workplaceGet'] = async (ctx) => {
	const result = await dopplerCall<{
		workplace: DopplerEndpointOutputs['workplaceGet'];
	}>(ctx, 'workplace');

	await cacheEntity(
		ctx.db.workplace,
		DopplerWorkplaceEntity,
		result.workplace,
		{
			label: LABEL,
		},
	);

	await logEventFromContext(ctx, 'doppler.workplace.get', {}, 'completed');
	return result.workplace;
};

/** Updates workplace settings - name, billing email, security email. */
export const update: DopplerEndpoints['workplaceUpdate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		workplace: DopplerEndpointOutputs['workplaceUpdate'];
	}>(ctx, 'workplace', {
		method: 'POST',
		body: compact({
			name: input.name,
			billing_email: input.billingEmail,
			security_email: input.securityEmail,
		}),
	});

	await cacheEntity(
		ctx.db.workplace,
		DopplerWorkplaceEntity,
		result.workplace,
		{
			label: LABEL,
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.workplace.update',
		auditPayload(input, []),
		'completed',
	);
	return result.workplace;
};
