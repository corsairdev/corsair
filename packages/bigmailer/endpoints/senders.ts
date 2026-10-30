import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerSenderEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'sender';

/** A sender's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (s: { brandId?: string; id: string }) =>
	`${s.brandId}:${s.id}`;

/** Lists verified sender identities (domains/emails) configured on a brand. */
export const list: BigmailerEndpoints['sendersList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['sendersList']>(
		ctx,
		`brands/${seg(input.brandId)}/senders`,
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(
		ctx.db.senders,
		BigmailerSenderEntity,
		result.data.map((s) => ({ ...s, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.senders.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};
