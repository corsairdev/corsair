import { logEventFromContext } from 'corsair/core';
import type { BigpictureioEndpoints } from '..';
import { makeBigpictureioRequest } from '../client';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
	hasCompanyIdentity,
} from './types';

export const get: BigpictureioEndpoints['companyFind'] = async (ctx, input) => {
	const parsed = BigpictureioEndpointInputSchemas.companyFind.parse(input);
	const query: Record<string, string> = { domain: parsed.domain };
	if (parsed.webhookUrl) {
		query.webhookUrl = parsed.webhookUrl;
	}
	if (parsed.webhookId) {
		query.webhookId = parsed.webhookId;
	}

	const response = await makeBigpictureioRequest<unknown>(
		'/v1/companies/find',
		ctx.key,
		{
			method: 'GET',
			query,
			acceptPending: Boolean(parsed.webhookUrl),
		},
	);

	const output = BigpictureioEndpointOutputSchemas.companyFind.parse(
		parsed.webhookUrl && !hasCompanyIdentity(response)
			? {
					pending: true,
					webhookUrl: parsed.webhookUrl,
					webhookId: parsed.webhookId,
				}
			: (response ?? {}),
	);

	await logEventFromContext(
		ctx,
		'bigpictureio.company.find',
		{ domain: parsed.domain },
		'completed',
	);
	return output;
};
