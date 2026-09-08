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

/**
 * Retrieves proposal luck for validators via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional validators array and chain
 * @returns Proposal luck response
 */
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

/**
 * Retrieves activation and exit queue position for validators via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional chain
 * @returns Validators queue response
 */
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

/**
 * Retrieves validators registered with a deposit address via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including address, chain, cursor, page_size
 * @returns Validators by deposit address response
 */
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

/**
 * Retrieves validators registered with withdrawal credentials via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including credentials, chain, cursor, page_size
 * @returns Validators by withdrawal credentials response
 */
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

/**
 * Fetches multiple validators by indices or public keys via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including validator identifiers, chain, cursor, page_size
 * @returns Multiple validators response
 */
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
				validator: {
					validator_identifiers: parsed.validator.validator_identifiers,
				},
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.validators.post',
		{ count: parsed.validator.validator_identifiers.length },
		'completed',
	);
	return BeaconchainV2ResponseSchema.parse(res);
};
