import type { MoreTreesEndpoints } from '..';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Plants trees from the payment account, either for the account itself or as
 * gifts for listed recipients. With `test: true` the request is a
 * evaluated without persisting; the default plants real trees and spends
 * credits.
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
		(parsed) => ({
			service: 'transaction_management',
			// A planting that may have reached More Trees is never replayed: it
			// spends credits. test=true is a caller choice, not our default.
			replayable: false,
			method: 'POST',
			path: '/plant',
			body: {
				payment_account_code: parsed.payment_account_code,
				test: parsed.test,
				plant_for_others: parsed.plant_for_others,
				quantity:
					parsed.plant_for_others === false ? parsed.quantity : undefined,
				project_id: parsed.project_id,
				tree_id: parsed.tree_id,
				recipients:
					parsed.plant_for_others === false ? undefined : parsed.recipients,
			},
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({
				creditsUsed: result.credits_used ?? undefined,
				test: result.test ?? false,
			}),
		},
	);
