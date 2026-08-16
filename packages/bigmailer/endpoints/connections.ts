import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerConnectionEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'connection';

/** A connection's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (c: { brandId?: string; id: string }) =>
	`${c.brandId}:${c.id}`;

/** Lists email-delivery connections (AWS SES or a supported ESP) configured on a brand. */
export const list: BigmailerEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['connectionsList']
	>(ctx, `brands/${seg(input.brandId)}/connections`, {
		query: compact({ limit: input.limit, cursor: input.cursor }),
	});

	await cacheEntities(
		ctx.db.connections,
		BigmailerConnectionEntity,
		result.connections.map((c) => ({ ...c, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.connections.list',
		{
			...auditPayload(input, ['brandId']),
			returned: result.connections.length,
		},
		'completed',
	);
	return result;
};
