import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const get: BetterProposalsEndpoints['settingsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['settingsGet']
	>('settings', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.settings.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getBrand: BetterProposalsEndpoints['settingsGetBrand'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['settingsGetBrand']
	>('settings/brand', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.settings.getBrand',
		{ ...input },
		'completed',
	);
	return result;
};

export const listMergeTags: BetterProposalsEndpoints['settingsListMergeTags'] =
	async (ctx, input) => {
		const result = await makeBetterProposalsRequest<
			BetterProposalsEndpointOutputs['settingsListMergeTags']
		>('settings/merge_tag', ctx.key, {
			method: 'GET',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'betterproposals.settings.listMergeTags',
			{ ...input },
			'completed',
		);
		return result;
	};
