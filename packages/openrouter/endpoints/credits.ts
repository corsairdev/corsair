import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type {
	CreateCoinbaseChargeResponse,
	ListCreditsResponse,
} from './types';

// GET /credits returns the account credit balance, and optionally a
// Zero-Data Residency (ZDR) report when filter params are supplied.
export const listCredits: OpenRouterEndpoints['creditsList'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenRouterRequest<ListCreditsResponse>(
		'credits',
		ctx.key,
		{
			query: {
				query: input.query,
				cursor: input.cursor,
				per_page: input.perPage,
				max_age: input.maxAge,
			},
		},
	);

	return result;
};

// POST /credits/coinbase creates a Coinbase Commerce on-chain charge
// to top up the account with credits.
export const createCoinbaseCharge: OpenRouterEndpoints['creditsCoinbaseCreate'] =
	async (ctx, input) => {
		const result = await makeOpenRouterRequest<CreateCoinbaseChargeResponse>(
			'credits/coinbase',
			ctx.key,
			{
				method: 'POST',
				body: {
					amount: input.amount,
					sender: input.sender,
					chain_id: input.chainId,
				},
			},
		);

		return result;
	};
