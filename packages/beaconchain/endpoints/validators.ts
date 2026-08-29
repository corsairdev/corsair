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
	GetValidatorsByDepositAddressInputSchema,
	GetValidatorsByWithdrawalCredentialsInputSchema,
	GetValidatorsProposalLuckInputSchema,
	GetValidatorsQueueInputSchema,
	PostValidatorsInputSchema,
} from './types';

export const getValidatorsProposalLuck: BeaconchainEndpoints['getValidatorsProposalLuck'] =
	async (ctx, input) => {
		const parsed = GetValidatorsProposalLuckInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			'validators/proposalLuck',
			requireBeaconchainKey(ctx.key),
			v1GetOptions(
				parsed.chain,
				parsed.validators?.length
					? { query: { validators: parsed.validators.join(',') } }
					: {},
			),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getProposalLuck',
			{},
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getValidatorsQueue: BeaconchainEndpoints['getValidatorsQueue'] =
	async (ctx, input) => {
		const parsed = GetValidatorsQueueInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			'validators/queue',
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getQueue',
			{},
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getValidatorsByDepositAddress: BeaconchainEndpoints['getValidatorsByDepositAddress'] =
	async (ctx, input) => {
		const parsed = GetValidatorsByDepositAddressInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: v2Body(parsed, {
					validator: { deposit_address: parsed.address },
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getByDepositAddress',
			{ address: parsed.address },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

export const getValidatorsByWithdrawalCredentials: BeaconchainEndpoints['getValidatorsByWithdrawalCredentials'] =
	async (ctx, input) => {
		const parsed = GetValidatorsByWithdrawalCredentialsInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: v2Body(parsed, {
					validator: { withdrawal: parsed.credentials },
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getByWithdrawalCredentials',
			{ credentials: parsed.credentials },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

export const postValidators: BeaconchainEndpoints['postValidators'] = async (
	ctx,
	input,
) => {
	const parsed = PostValidatorsInputSchema.parse(input);
	const res = await makeBeaconchainV2Request(
		'ethereum/validators',
		requireBeaconchainKey(ctx.key),
		{
			method: 'POST',
			body: v2Body(parsed, {
				validator: { validator_identifiers: parsed.indicesOrPubkeys },
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.validators.post',
		{ count: parsed.indicesOrPubkeys.length },
		'completed',
	);
	return BeaconchainV2ResponseSchema.parse(res);
};
