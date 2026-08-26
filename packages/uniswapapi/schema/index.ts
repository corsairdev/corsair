import {
	UniswapApproval,
	UniswapGaslessOrder,
	UniswapQuote,
	UniswapSwapStatus,
	UniswapToken,
} from './database';

export const UniswapApiSchema = {
	version: '1.0.0',
	entities: {
		token: UniswapToken,
		quote: UniswapQuote,
		swapStatus: UniswapSwapStatus,
		approval: UniswapApproval,
		gaslessOrder: UniswapGaslessOrder,
	},
} as const;
