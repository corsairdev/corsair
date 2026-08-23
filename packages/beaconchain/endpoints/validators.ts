import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getValidatorsProposalLuck: BeaconchainEndpoints['getValidatorsProposalLuck'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/proposal-luck',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					...(input.validators?.length
						? { validator: { validator_identifiers: input.validators } }
						: {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getProposalLuck',
			{},
			'completed',
		);
		return res;
	};

export const getValidatorsQueue: BeaconchainEndpoints['getValidatorsQueue'] =
	async (ctx, _input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators/queues',
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
			'beaconchain.validators.getQueue',
			{},
			'completed',
		);
		return res;
	};

export const getValidatorsByDepositAddress: BeaconchainEndpoints['getValidatorsByDepositAddress'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					deposit_address: input.address,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getByDepositAddress',
			{ address: input.address },
			'completed',
		);
		return res;
	};

export const getValidatorsByWithdrawalCredentials: BeaconchainEndpoints['getValidatorsByWithdrawalCredentials'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/validators',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					withdrawal_credentials: input.credentials,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.validators.getByWithdrawalCredentials',
			{ credentials: input.credentials },
			'completed',
		);
		return res;
	};

export const postValidators: BeaconchainEndpoints['postValidators'] = async (
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
					validator_identifiers: input.indicesOrPubkeys,
				},
			},
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.validators.post',
		{ count: input.indicesOrPubkeys.length },
		'completed',
	);
	return res;
};
