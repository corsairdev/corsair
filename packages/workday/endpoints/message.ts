import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const updateMessageTemplateById: WorkdayEndpoints['updateMessageTemplateById'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['updateMessageTemplateById']
		>('v1/message/updateMessageTemplateById/{id}', ctx.key, {
			method: 'PUT',
			// Justification: The makeWorkdayRequest client expects a generic unknown record.
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.message.updateMessageTemplateById',
			input ?? {},
			'completed',
		);
		return response;
	};
