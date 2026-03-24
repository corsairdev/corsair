import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const get: FigmaEndpoints['paymentsGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['paymentsGet']>(
		`v1/payments`,
		ctx.key,
		{
			method: 'GET',
			query: {
				user_id: input.user_id,
				plugin_id: input.plugin_id,
				widget_id: input.widget_id,
				community_file_id: input.community_file_id,
				plugin_payment_token: input.plugin_payment_token,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.payments.get', { ...input }, 'completed');
	return result;
};
