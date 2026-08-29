import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v1GetOptions,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV1ResponseSchema,
	BeaconchainV2ResponseSchema,
	GetExecutionAddressErc20TokensInputSchema,
	GetExecutionBlockInputSchema,
	GetExecutionProducedBlocksInputSchema,
} from './types';

export const getExecutionAddressErc20Tokens: BeaconchainEndpoints['getExecutionAddressErc20Tokens'] =
	async (ctx, input) => {
		const parsed = GetExecutionAddressErc20TokensInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`execution/address/${parsed.address}/erc20tokens`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getAddressErc20Tokens',
			{ address: parsed.address },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getExecutionBlock: BeaconchainEndpoints['getExecutionBlock'] =
	async (ctx, input) => {
		const parsed = GetExecutionBlockInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/block',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: v2Body(parsed, { block: parsed.blockId }),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getBlock',
			{ blockId: String(parsed.blockId) },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

export const getExecutionProducedBlocks: BeaconchainEndpoints['getExecutionProducedBlocks'] =
	async (ctx, input) => {
		const parsed = GetExecutionProducedBlocksInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`execution/${parsed.address}/produced`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getProducedBlocks',
			{ address: parsed.address },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};
