import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	createdAtQuery,
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const getProgram: PiggyEndpoints['loyaltyGetProgram'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'loyalty.getProgram',
			input: Inputs.loyaltyGetProgram,
			output: Outputs.loyaltyGetProgram,
		},
		input,
		() => ({ method: 'GET', path: `${CLIENT}/loyalty-program` }),
		{ log: (_, program) => ({ program: program.data.name ?? undefined }) },
	);

export const listTransactions: PiggyEndpoints['loyaltyListTransactions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'loyalty.listTransactions',
			input: Inputs.loyaltyListTransactions,
			output: Outputs.loyaltyListTransactions,
		},
		input,
		({
			limit,
			page,
			type,
			shopUuid,
			sort,
			createdAtGt,
			createdAtGte,
			createdAtLt,
			createdAtLte,
		}) => ({
			method: 'GET',
			path: `${CLIENT}/loyalty-transactions`,
			query: {
				limit,
				page,
				type,
				shop_uuid: shopUuid,
				sort,
				...createdAtQuery({
					createdAtGt,
					createdAtGte,
					createdAtLt,
					createdAtLte,
				}),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
