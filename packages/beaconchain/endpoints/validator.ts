import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getValidator: BeaconchainEndpoints['getValidator'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		`validator/${input.indexOrPubkey}`,
		ctx.key,
		{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/attestation_efficiency`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/attestations`,
			ctx.key,
			{
				method: 'GET',
				query: {
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'validator/bls_changes',
			ctx.key,
			{
				method: 'GET',
				query: {
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/balance_history`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/rewards/consensus`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/stats/daily`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/deposits`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/rewards/execution`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/income_history`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'validator/leaderboard',
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/proposals`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validator/${input.indexOrPubkey}/withdrawals`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validator.getWithdrawals',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};
