import type { GoogleAdsEndpoints } from '..';
import { customerPathId } from '../client';
import { call } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `customers:listAccessibleCustomers` names the accounts the token can call. It
 * takes no customer path, because its whole purpose is to find them.
 */
export const listAccessible: GoogleAdsEndpoints['customersListAccessible'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'customers.listAccessible',
				input: Inputs.customersListAccessible,
				output: Outputs.customersListAccessible,
			},
			rawInput,
			() => ({ method: 'GET', path: '/customers:listAccessibleCustomers' }),
			{ log: (result) => ({ accounts: result.resourceNames?.length ?? 0 }) },
		);

/**
 * `customers:mutate` only supports an update, and only the tracking fields are
 * writable. Google's docs point callers at `GoogleAdsService.Mutate` for
 * everything else.
 */
export const update: GoogleAdsEndpoints['customersUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		rawInput,
		(input) => {
			const customer = customerPathId(input.customerId);
			return {
				method: 'POST',
				path: `/customers/${customer}:mutate`,
				body: {
					operation: {
						update: {
							resourceName: `customers/${customer}`,
							...input.customer,
						},
						updateMask: input.updateMask,
					},
					...(input.validateOnly ? { validateOnly: true } : {}),
				},
			};
		},
		// customers:mutate answers one `result`, not a `results` array.
		{ log: (result) => ({ operations: result.result ? 1 : 0 }) },
	);
