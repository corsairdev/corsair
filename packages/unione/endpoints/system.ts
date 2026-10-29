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
		const accounting = response.accounting;
		await maybeUpsert(ctx.db.account, response.user_id, {
			user_id: response.user_id,
			email: response.email,
			project_id: response.project_id,
			project_name: response.project_name,
			emails_included: accounting?.emails_included,
			emails_sent: accounting?.emails_sent,
			validations_included: accounting?.validations_included,
			validations_used: accounting?.validations_used,
			period_start: accounting?.period_start,
			period_end: accounting?.period_end,
		});
	}
	await logEventFromContext(ctx, 'unione.system.info', {}, 'completed');
	return response;
};

export const ping: UnioneEndpoints['system']['ping'] = async (ctx) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['systemPing']>(
		'system/ping.json',
		ctx.key,
		{ body: {} },
	);

	await logEventFromContext(ctx, 'unione.system.ping', {}, 'completed');
	return response;
};
