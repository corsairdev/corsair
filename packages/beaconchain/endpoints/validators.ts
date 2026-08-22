import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getValidatorsProposalLuck: BeaconchainEndpoints['getValidatorsProposalLuck'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'validators/proposal_luck',
			ctx.key,
			{
				method: 'GET',
				query: {
					...(input.validators?.length
						? { validators: input.validators.join(',') }
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'validators/queue',
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validators/deposit_address/${input.address}`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`validators/withdrawal_credentials/${input.credentials}`,
			ctx.key,
			{ method: 'GET' },
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
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		'validators',
		ctx.key,
		{
			method: 'POST',
			body: {
				indicesOrPubkeys: input.indicesOrPubkeys,
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
