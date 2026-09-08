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
	GetValidatorAttestationEfficiencyInputSchema,
	GetValidatorAttestationsInputSchema,
	GetValidatorBalanceHistoryInputSchema,
	GetValidatorBlsChangesInputSchema,
	GetValidatorConsensusRewardsInputSchema,
	GetValidatorDailyStatsInputSchema,
	GetValidatorDepositsInputSchema,
	GetValidatorExecutionRewardsInputSchema,
	GetValidatorIncomeHistoryInputSchema,
	GetValidatorInputSchema,
	GetValidatorLeaderboardInputSchema,
	GetValidatorProposalsInputSchema,
	GetValidatorWithdrawalsInputSchema,
} from './types';

/**
 * Builds the validator request body for V2 API calls.
 * @param input - Input parameters with chain, cursor, page_size
 * @param indexOrPubkey - Validator index or public key
 * @param extra - Additional properties for the request body
 * @returns Formatted request body with validator identifiers
 */
function validatorBody(
	input: { chain?: 'mainnet' | 'hoodi'; cursor?: string; page_size?: number },
	indexOrPubkey: string,
	extra: Record<string, unknown> = {},
) {
	return v2Body(input, {
		validator: { validator_identifiers: [indexOrPubkey] },
		...extra,
	});
}

/**
 * Retrieves validator details by index or public key via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, cursor, page_size
 * @returns Validator details response
 */
export const getValidator: BeaconchainEndpoints['getValidator'] = async (
	ctx,
	input,
) => {
	const parsed = GetValidatorInputSchema.parse(input);
	const res = await makeBeaconchainV2Request(
		'ethereum/validators',
		requireBeaconchainKey(ctx.key),
		{
			method: 'POST',
			body: validatorBody(parsed, parsed.indexOrPubkey),
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.validator.get',
		{ indexOrPubkey: parsed.indexOrPubkey },
		'completed',
	);
	return BeaconchainV2ResponseSchema.parse(res);
};

/**
 * Retrieves validator attestation efficiency via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, evaluation_window
 * @returns Validator attestation efficiency response
 */
export const getValidatorAttestationEfficiency: BeaconchainEndpoints['getValidatorAttestationEfficiency'] =
	async (ctx, input) => {
		const parsed = GetValidatorAttestationEfficiencyInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/performance-aggregate',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey, {
					range: {
						evaluation_window: parsed.evaluation_window ?? '24h',
					},
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getAttestationEfficiency',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

/**
 * Retrieves attestations performed by a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, cursor, page_size
 * @returns Validator attestations response
 */
export const getValidatorAttestations: BeaconchainEndpoints['getValidatorAttestations'] =
	async (ctx, input) => {
		const parsed = GetValidatorAttestationsInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/attestation-slots',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getAttestations',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

/**
 * Retrieves BLS to execution change operations for a validator via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey and optional chain
 * @returns Validator BLS changes response
 */
export const getValidatorBlsChanges: BeaconchainEndpoints['getValidatorBlsChanges'] =
	async (ctx, input) => {
		const parsed = GetValidatorBlsChangesInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`validator/${parsed.indexOrPubkey}/blsChange`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getBlsChanges',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

/**
 * Retrieves balance history for a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, cursor, page_size
 * @returns Validator balance history response
 */
export const getValidatorBalanceHistory: BeaconchainEndpoints['getValidatorBalanceHistory'] =
	async (ctx, input) => {
		const parsed = GetValidatorBalanceHistoryInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/balances',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getBalanceHistory',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

/**
 * Retrieves consensus rewards for a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, evaluation_window
 * @returns Validator consensus rewards response
 */
export const getValidatorConsensusRewards: BeaconchainEndpoints['getValidatorConsensusRewards'] =
	async (ctx, input) => {
		const parsed = GetValidatorConsensusRewardsInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/rewards-aggregate',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey, {
					range: {
						evaluation_window: parsed.evaluation_window ?? '24h',
					},
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getConsensusRewards',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		const parsedRes = BeaconchainV2ResponseSchema.parse(res);
		const data = parsedRes.data as Record<string, unknown> | undefined;
		return { ...parsedRes, data: data?.consensus ?? parsedRes.data };
	};

/**
 * Retrieves daily stats for a validator via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey and optional chain
 * @returns Validator daily stats response
 */
export const getValidatorDailyStats: BeaconchainEndpoints['getValidatorDailyStats'] =
	async (ctx, input) => {
		const parsed = GetValidatorDailyStatsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`validator/stats/${parsed.indexOrPubkey}`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getDailyStats',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

/**
 * Retrieves deposits for a validator via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey and optional chain
 * @returns Validator deposits response
 */
export const getValidatorDeposits: BeaconchainEndpoints['getValidatorDeposits'] =
	async (ctx, input) => {
		const parsed = GetValidatorDepositsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`validator/${parsed.indexOrPubkey}/deposits`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getDeposits',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

/**
 * Retrieves execution layer rewards for a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, evaluation_window
 * @returns Validator execution rewards response
 */
export const getValidatorExecutionRewards: BeaconchainEndpoints['getValidatorExecutionRewards'] =
	async (ctx, input) => {
		const parsed = GetValidatorExecutionRewardsInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/rewards-aggregate',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey, {
					range: {
						evaluation_window: parsed.evaluation_window ?? '24h',
					},
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getExecutionRewards',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		const parsedRes = BeaconchainV2ResponseSchema.parse(res);
		const data = parsedRes.data as Record<string, unknown> | undefined;
		return { ...parsedRes, data: data?.execution ?? parsedRes.data };
	};

/**
 * Retrieves income history for a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, cursor, page_size, epoch
 * @returns Validator income history response
 */
export const getValidatorIncomeHistory: BeaconchainEndpoints['getValidatorIncomeHistory'] =
	async (ctx, input) => {
		const parsed = GetValidatorIncomeHistoryInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/rewards-list',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey, {
					...(parsed.epoch !== undefined ? { epoch: parsed.epoch } : {}),
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getIncomeHistory',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

/**
 * Retrieves validator leaderboard via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional chain
 * @returns Validator leaderboard response
 */
export const getValidatorLeaderboard: BeaconchainEndpoints['getValidatorLeaderboard'] =
	async (ctx, input) => {
		const parsed = GetValidatorLeaderboardInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			'validator/leaderboard',
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getLeaderboard',
			{},
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

/**
 * Retrieves block proposals for a validator via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey, chain, cursor, page_size
 * @returns Validator proposals response
 */
export const getValidatorProposals: BeaconchainEndpoints['getValidatorProposals'] =
	async (ctx, input) => {
		const parsed = GetValidatorProposalsInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/validators/proposal-slots',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: validatorBody(parsed, parsed.indexOrPubkey),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getProposals',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};

/**
 * Retrieves withdrawals for a validator via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey and optional chain
 * @returns Validator withdrawals response
 */
export const getValidatorWithdrawals: BeaconchainEndpoints['getValidatorWithdrawals'] =
	async (ctx, input) => {
		const parsed = GetValidatorWithdrawalsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`validator/${parsed.indexOrPubkey}/withdrawals`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getWithdrawals',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};
