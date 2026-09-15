import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/transactional
// Docs: https://docs.customer.io/integrations/api/app/tag/transactional/listTransactional/
// Returns the ID and trigger name for each template; IDs feed /v1/send/* calls.
export const listTransactionalMessages: CustomerioEndpoints['listTransactionalMessages'] =
	async (ctx, input) => {
		const response = await makeAppRequest<
			CustomerioEndpointOutputs['listTransactionalMessages']
		>('/v1/transactional', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'customerio.transactional.listTransactionalMessages',
			{ ...input },
			'completed',
		);
		return response;
	};
