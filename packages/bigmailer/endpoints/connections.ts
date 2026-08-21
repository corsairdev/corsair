import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerConnectionEntity } from '../schema/database';
import { cacheEntities } from './persist';
import { bigmailerCall, compact } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'connection';

/** Lists email-delivery connections (AWS SES or a supported ESP) for the account. Account-level, not brand-scoped. */
export const list: BigmailerEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['connectionsList']
	>(ctx, 'connections', {
		query: compact({ limit: input.limit, cursor: input.cursor }),
	});

	await cacheEntities(
		ctx.db.connections,
		BigmailerConnectionEntity,
		result.data,
		{
			label: LABEL,
		},
	);
	await logEventFromContext(
		ctx,
		'bigmailer.connections.list',
		{ returned: result.data.length },
		'completed',
	);
	return result;
};
