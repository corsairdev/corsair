import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

export const info: UnioneEndpoints['system']['info'] = async (ctx) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['systemInfo']>(
		'system/info.json',
		ctx.key,
		{ body: {} },
	);

	if (response.user_id !== undefined) {
		await maybeUpsert(ctx.db.account, response.user_id, {
			user_id: response.user_id,
			email: response.email,
			emails_included: response.accounting?.emails_included,
			emails_sent: response.accounting?.emails_sent,
		});
	}
	await logEventFromContext(ctx, 'unione.system.info', {}, 'completed');
	return response;
};
