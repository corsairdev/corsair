import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerMessageTypeEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'message type';

/** A message type's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (m: { brandId?: string; id: string }) =>
	`${m.brandId}:${m.id}`;

/** Lists message-type categories within a brand, optionally filtered by type. */
export const list: BigmailerEndpoints['messageTypesList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['messageTypesList']
	>(ctx, `brands/${seg(input.brandId)}/message-types`, {
		query: compact({
			limit: input.limit,
			cursor: input.cursor,
			type: input.type,
		}),
	});

	await cacheEntities(
		ctx.db.messageTypes,
		BigmailerMessageTypeEntity,
		result.data.map((m) => ({ ...m, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.messageTypes.list',
		{
			...auditPayload(input, ['brandId', 'type']),
			returned: result.data.length,
		},
		'completed',
	);
	return result;
};
