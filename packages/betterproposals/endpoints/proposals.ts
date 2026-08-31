import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['proposalsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsList']
	>('proposal', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getNew: BetterProposalsEndpoints['proposalsGetNew'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetNew']
	>('proposal/new', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getNew',
		{ ...input },
		'completed',
	);
	return result;
};

export const getOpened: BetterProposalsEndpoints['proposalsGetOpened'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetOpened']
	>('proposal/opened', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getOpened',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSent: BetterProposalsEndpoints['proposalsGetSent'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetSent']
	>('proposal/sent', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getSent',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSigned: BetterProposalsEndpoints['proposalsGetSigned'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetSigned']
	>('proposal/signed', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getSigned',
		{ ...input },
		'completed',
	);
	return result;
};

export const getPaid: BetterProposalsEndpoints['proposalsGetPaid'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetPaid']
	>('proposal/paid', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getPaid',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BetterProposalsEndpoints['proposalsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGet']
	>(`proposal/${input.proposal_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.get',
		{ proposal_id: input.proposal_id },
		'completed',
	);
	return result;
};

export const getCount: BetterProposalsEndpoints['proposalsGetCount'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['proposalsGetCount']
	>('proposal/count', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.proposals.getCount',
		{ ...input },
		'completed',
	);
	return result;
};

export const createCover: BetterProposalsEndpoints['proposalsCreateCover'] =
	async (ctx, input) => {
		const result = await makeBetterProposalsRequest<
			BetterProposalsEndpointOutputs['proposalsCreateCover']
		>('proposal/cover/create', ctx.key, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});

		await logEventFromContext(
			ctx,
			'betterproposals.proposals.createCover',
			{ CoverName: input.CoverName },
			'completed',
		);
		return result;
	};
