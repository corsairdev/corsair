import type { MoreTreesEndpoints } from '..';
import { rawId, resolveAccountCode } from '../client';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Plants trees from the payment account, either for the account itself or as
 * gifts for listed recipients. With `test: true` the request is evaluated
 * without persisting; the default plants real trees and spends credits.
 */
export const plant: MoreTreesEndpoints['treesPlant'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'trees.plant',
			input: Inputs.treesPlant,
			output: Outputs.treesPlant,
		},
		input,
		async (parsed, context) => ({
			service: 'transaction_management',
			// A planting that may have reached More Trees is never replayed: it
			// spends credits.
			replayable: false,
			method: 'POST',
			path: '/plant',
			body: {
				payment_account_code:
					parsed.payment_account_code ?? (await resolveAccountCode(context)),
				test: parsed.test,
				plant_for_others: parsed.plant_for_others,
				quantity:
					parsed.plant_for_others === false ? parsed.quantity : undefined,
				// Exact digits: tree and project IDs can exceed 2^53.
				project_id: rawId(parsed.project_id),
				tree_id: rawId(parsed.tree_id),
				recipients:
					parsed.plant_for_others === true ? parsed.recipients : undefined,
			},
		}),
		{
			log: (parsed, result) => ({
				creditsUsed: result.credits_used ?? undefined,
				// The requested mode when the response leaves `test` out.
				test: result.test ?? parsed.test ?? false,
			}),
		},
	);
