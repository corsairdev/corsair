import { logEventFromContext } from 'corsair/core';
import { AlchemyAPIError, makeAlchemyJsonRpcRequest } from '../client';
import type { AlchemyEndpoints } from '../index';
import { resolveNetwork } from './resolve';

export const getTransactionCount: AlchemyEndpoints['rpcGetTransactionCount'] =
	async (ctx, input) => {
		const hex = await makeAlchemyJsonRpcRequest<string>(
			resolveNetwork(ctx, input.network),
			ctx.key,
			'eth_getTransactionCount',
			[input.address, input.blockTag],
		);

		if (typeof hex !== 'string' || !/^0x[0-9a-fA-F]+$/.test(hex)) {
			throw new AlchemyAPIError(
				`Invalid eth_getTransactionCount result: ${String(hex)}`,
				{ status: 502 },
			);
		}

		// z.number() can't represent values past MAX_SAFE_INTEGER losslessly.
		const countBig = BigInt(hex);
		if (countBig > BigInt(Number.MAX_SAFE_INTEGER)) {
			throw new AlchemyAPIError(
				`eth_getTransactionCount exceeds Number.MAX_SAFE_INTEGER: ${hex}`,
				{ status: 502 },
			);
		}

		await logEventFromContext(
			ctx,
			'alchemy.rpc.getTransactionCount',
			{ address: input.address, blockTag: input.blockTag },
			'completed',
		);

		return {
			count: Number(countBig),
			hex,
		};
	};
