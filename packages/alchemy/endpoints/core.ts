import { logEventFromContext } from 'corsair/core';
import type { AlchemyEndpoints } from '..';
import type { AlchemyEndpointOutputs } from './types';
import { makeAlchemyJsonRpcRequest } from '../client';

export const getBlockNumber: AlchemyEndpoints['coreGetBlockNumber'] = async (
	ctx,
	input,
) => {
	const response = await makeAlchemyJsonRpcRequest<string>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'eth_blockNumber',
		[],
	);

	await logEventFromContext(
		ctx,
		'alchemy.core.getBlockNumber',
		{ ...input },
		'completed',
	);

	return {
		blockNumber: parseInt(response, 16),
		hex: response,
	};
};

export const getBlock: AlchemyEndpoints['coreGetBlock'] = async (ctx, input) => {
	const response = await makeAlchemyJsonRpcRequest<
		AlchemyEndpointOutputs['coreGetBlock']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'eth_getBlockByNumber', // Works with block hash or number via different method if it's a hash
		[input.blockHashOrBlockTag, input.fullTransactionObjects],
	);

	await logEventFromContext(
		ctx,
		'alchemy.core.getBlock',
		{ ...input },
		'completed',
	);

	return response;
};

export const getBalance: AlchemyEndpoints['coreGetBalance'] = async (
	ctx,
	input,
) => {
	const response = await makeAlchemyJsonRpcRequest<string>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'eth_getBalance',
		[input.address, input.blockTag],
	);

	await logEventFromContext(
		ctx,
		'alchemy.core.getBalance',
		{ ...input },
		'completed',
	);

	return {
		balanceHex: response,
	};
};

export const getTransaction: AlchemyEndpoints['coreGetTransaction'] = async (
	ctx,
	input,
) => {
	const response = await makeAlchemyJsonRpcRequest<
		AlchemyEndpointOutputs['coreGetTransaction']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'eth_getTransactionByHash',
		[input.transactionHash],
	);

	await logEventFromContext(
		ctx,
		'alchemy.core.getTransaction',
		{ ...input },
		'completed',
	);

	return response;
};

export const getTransactionReceipt: AlchemyEndpoints['coreGetTransactionReceipt'] =
	async (ctx, input) => {
		const response = await makeAlchemyJsonRpcRequest<
			AlchemyEndpointOutputs['coreGetTransactionReceipt']
		>(
			input.network || ctx.options.network || 'eth-mainnet',
			ctx.key,
			'eth_getTransactionReceipt',
			[input.transactionHash],
		);

		await logEventFromContext(
			ctx,
			'alchemy.core.getTransactionReceipt',
			{ ...input },
			'completed',
		);

		return response;
	};

export const call: AlchemyEndpoints['coreCall'] = async (ctx, input) => {
	const response = await makeAlchemyJsonRpcRequest<string>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'eth_call',
		[input.transaction, input.blockTag],
	);

	await logEventFromContext(
		ctx,
		'alchemy.core.call',
		{ ...input },
		'completed',
	);

	return {
		data: response,
	};
};

export const sendRawTransaction: AlchemyEndpoints['coreSendRawTransaction'] =
	async (ctx, input) => {
		const response = await makeAlchemyJsonRpcRequest<string>(
			input.network || ctx.options.network || 'eth-mainnet',
			ctx.key,
			'eth_sendRawTransaction',
			[input.signedTransaction],
		);

		await logEventFromContext(
			ctx,
			'alchemy.core.sendRawTransaction',
			{ ...input },
			'completed',
		);

		return {
			transactionHash: response,
		};
	};
