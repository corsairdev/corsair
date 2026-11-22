import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const get: PayhereEndpoints['companyGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.get',
			input: Inputs.companyGet,
			output: Outputs.companyGet,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/current_company' }),
		{ log: (_, result) => ({ companyId: result.data.id }) },
	);

export const stats: PayhereEndpoints['companyStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.stats',
			input: Inputs.companyStats,
			output: Outputs.companyStats,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/current_company/stats' }),
		{
			log: (_, stats) => ({
				currency: stats.currency,
				last30: stats.payments_last_30,
			}),
		},
	);
