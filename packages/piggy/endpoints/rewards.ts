import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['rewardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewards.list',
			input: Inputs.rewardsList,
			output: Outputs.rewardsList,
		},
		input,
		({ shopUuid, contactUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/rewards`,
			query: { shop_uuid: shopUuid, contact_uuid: contactUuid },
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PiggyEndpoints['rewardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewards.get',
			input: Inputs.rewardsGet,
			output: Outputs.rewardsGet,
		},
		input,
		({ rewardUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/rewards/${encodeURIComponent(rewardUuid)}`,
		}),
		{ log: (_, reward) => ({ rewardUuid: reward.data.uuid ?? undefined }) },
	);

export const update: PiggyEndpoints['rewardsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewards.update',
			input: Inputs.rewardsUpdate,
			output: Outputs.rewardsUpdate,
		},
		input,
		({ rewardUuid, title, description, requiredCredits }) => ({
			method: 'PUT',
			path: `${CLIENT}/rewards/${encodeURIComponent(rewardUuid)}`,
			body: {
				title,
				description,
				required_credits: requiredCredits,
			},
		}),
		{ log: (_, reward) => ({ rewardUuid: reward.data.uuid ?? undefined }) },
	);

export const redeem: PiggyEndpoints['rewardsRedeem'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewards.redeem',
			input: Inputs.rewardsRedeem,
			output: Outputs.rewardsRedeem,
		},
		input,
		({ contactUuid, rewardUuid, shopUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/reward-receptions`,
			body: {
				contact_uuid: contactUuid,
				reward_uuid: rewardUuid,
				shop_uuid: shopUuid,
			},
		}),
		{ log: (_, reception) => ({ uuid: reception.data.uuid ?? undefined }) },
	);

export const reverseRedemption: PiggyEndpoints['rewardsReverseRedemption'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'rewards.reverseRedemption',
			input: Inputs.rewardsReverseRedemption,
			output: Outputs.rewardsReverseRedemption,
		},
		input,
		({ rewardReceptionUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/reward-receptions/${encodeURIComponent(rewardReceptionUuid)}/reverse`,
		}),
		{ log: (_, reception) => ({ uuid: reception.data.uuid ?? undefined }) },
	);
