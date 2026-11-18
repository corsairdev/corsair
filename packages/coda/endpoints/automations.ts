import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const trigger: CodaEndpoints['automationsTrigger'] = async (ctx, input) => {
	const { docId, ruleId, payload } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['automationsTrigger']
	>(
		`docs/${encodeURIComponent(docId)}/hooks/automation/${encodeURIComponent(ruleId)}`,
		ctx.key,
		{ method: 'POST', body: payload },
	);
	await logEventFromContext(
		ctx,
		'coda.automations.trigger',
		{ ...input },
		'completed',
	);
	return response;
};

export const Automations = {
	trigger,
};
