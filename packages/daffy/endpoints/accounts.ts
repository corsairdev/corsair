import { logEventFromContext } from 'corsair/core';
import type { DaffyEndpoints } from '..';
import { makeDaffyRequest } from '../client';
import { DaffyEndpointInputSchemas, DaffyEndpointOutputSchemas } from './types';

export const cancelDonation: DaffyEndpoints['cancelDonation'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.cancelDonation.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.cancelDonation.parse(
		await makeDaffyRequest(`/donations/${input.donationId}`, ctx.key, {
			method: 'DELETE',
		}),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.cancelDonation',
		input,
		'completed',
	);
	return response;
};

export const createDonation: DaffyEndpoints['createDonation'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.createDonation.parse(rawInput);
	const body: Record<string, number | string> = {
		amount: input.amount,
		ein: input.ein,
	};
	if (input.note !== undefined) {
		body.note = input.note;
	}
	if (input.privateMemo !== undefined) {
		body.private_memo = input.privateMemo;
	}
	const path =
		input.userId === undefined
			? '/donations'
			: `/users/${input.userId}/donations`;
	const response = DaffyEndpointOutputSchemas.createDonation.parse(
		await makeDaffyRequest(path, ctx.key, { method: 'POST', body }),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.createDonation',
		{ amount: input.amount },
		'completed',
	);
	return response;
};

export const getBalance: DaffyEndpoints['getBalance'] = async (
	ctx,
	rawInput,
) => {
	DaffyEndpointInputSchemas.getBalance.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getBalance.parse(
		await makeDaffyRequest('/users/me/balance', ctx.key),
	);
	await logEventFromContext(ctx, 'daffy.accounts.getBalance', {}, 'completed');
	return response;
};

export const getContributions: DaffyEndpoints['getContributions'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getContributions.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getContributions.parse(
		await makeDaffyRequest('/contributions', ctx.key, {
			query: { page: input.page },
		}),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getContributions',
		input,
		'completed',
	);
	return response;
};

export const getDonation: DaffyEndpoints['getDonation'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getDonation.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getDonation.parse(
		await makeDaffyRequest(
			`/users/${input.userId}/donations/${input.donationId}`,
			ctx.key,
		),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getDonation',
		input,
		'completed',
	);
	return response;
};

export const getDonations: DaffyEndpoints['getDonations'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getDonations.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getDonations.parse(
		await makeDaffyRequest('/donations', ctx.key, {
			query: { page: input.page },
		}),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getDonations',
		input,
		'completed',
	);
	return response;
};

export const getUserCauses: DaffyEndpoints['getUserCauses'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getUserCauses.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getUserCauses.parse(
		await makeDaffyRequest(`/users/${input.userId}/causes`, ctx.key),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getUserCauses',
		input,
		'completed',
	);
	return response;
};

export const getUserDonations: DaffyEndpoints['getUserDonations'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getUserDonations.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getUserDonations.parse(
		await makeDaffyRequest(`/users/${input.userId}/donations`, ctx.key, {
			query: { page: input.page },
		}),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getUserDonations',
		input,
		'completed',
	);
	return response;
};

export const getUserProfile: DaffyEndpoints['getUserProfile'] = async (
	ctx,
	rawInput,
) => {
	DaffyEndpointInputSchemas.getUserProfile.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getUserProfile.parse(
		await makeDaffyRequest('/users/me', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getUserProfile',
		{},
		'completed',
	);
	return response;
};

export const getUserByUsername: DaffyEndpoints['getUserByUsername'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getUserByUsername.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getUserByUsername.parse(
		await makeDaffyRequest(
			`/users/${encodeURIComponent(input.username)}`,
			ctx.key,
		),
	);
	await logEventFromContext(
		ctx,
		'daffy.accounts.getUserByUsername',
		input,
		'completed',
	);
	return response;
};
