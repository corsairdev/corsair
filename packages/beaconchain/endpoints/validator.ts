import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getValidator: BeaconchainEndpoints['getValidator'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/validators',
		ctx.key,
		{
			method: 'POST',
			body: {
				chain: 'mainnet',
				validator: {
					validator_identifiers: [input.indexOrPubkey],
				},
			},
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.validator.get',
		{ indexOrPubkey: input.indexOrPubkey },
		'completed',
	);
	return res;
};

export const getValidatorAttestationEfficiency: BeaconchainEndpoints['getValidatorAttestationEfficiency'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/attestation-efficiency',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getAttestationEfficiency',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorAttestations: BeaconchainEndpoints['getValidatorAttestations'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/attestations',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
					...(input.page !== undefined ? { page: input.page } : {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getAttestations',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorBlsChanges: BeaconchainEndpoints['getValidatorBlsChanges'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/bls-changes',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					...(input.page !== undefined ? { page: input.page } : {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getBlsChanges',
			{},
			'completed',
		);
		return res;
	};

export const getValidatorBalanceHistory: BeaconchainEndpoints['getValidatorBalanceHistory'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/balance-history',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getBalanceHistory',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorConsensusRewards: BeaconchainEndpoints['getValidatorConsensusRewards'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/rewards/consensus',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getConsensusRewards',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorDailyStats: BeaconchainEndpoints['getValidatorDailyStats'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/stats/daily',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getDailyStats',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorDeposits: BeaconchainEndpoints['getValidatorDeposits'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/deposits',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getDeposits',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorExecutionRewards: BeaconchainEndpoints['getValidatorExecutionRewards'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/rewards/execution',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getExecutionRewards',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorIncomeHistory: BeaconchainEndpoints['getValidatorIncomeHistory'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/income-history',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getIncomeHistory',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorLeaderboard: BeaconchainEndpoints['getValidatorLeaderboard'] =
	async (ctx, _input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/leaderboard',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getLeaderboard',
			{},
			'completed',
		);
		return res;
	};

export const getValidatorProposals: BeaconchainEndpoints['getValidatorProposals'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/proposals',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getProposals',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};

export const getValidatorWithdrawals: BeaconchainEndpoints['getValidatorWithdrawals'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/withdrawals',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getWithdrawals',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};
