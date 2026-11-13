import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const getSites: GosquaredEndpoints['account.getSites'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['account.getSites'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.presenter) {
		query.presenter = parsed.presenter;
	}

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['account.getSites']
	>('/account/v1/sites', ctx.key, {
		method: 'GET',
		query,
		siteToken: ctx.options?.siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['account.getSites'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.account.getSites',
		{ count: Array.isArray(parsedResponse) ? parsedResponse.length : 1 },
		'completed',
	);

	return parsedResponse;
};

export const createSite: GosquaredEndpoints['account.createSite'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['account.createSite'].parse(input);

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['account.createSite']
	>('/account/v1/sites', ctx.key, {
		method: 'POST',
		body: parsed,
		siteToken: ctx.options?.siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['account.createSite'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.account.createSite',
		{ siteToken: parsedResponse.site_token },
		'completed',
	);

	return parsedResponse;
};

export const getSite: GosquaredEndpoints['account.getSite'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['account.getSite'].parse(input);

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['account.getSite']
	>(`/account/v1/sites/${encodeURIComponent(parsed.site_token)}`, ctx.key, {
		method: 'GET',
		siteToken: ctx.options?.siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['account.getSite'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.account.getSite',
		{ siteToken: parsed.site_token },
		'completed',
	);

	return parsedResponse;
};

export const getSharedUsers: GosquaredEndpoints['account.getSharedUsers'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['account.getSharedUsers'].parse(input);
		const query: Record<string, string | number | boolean | undefined> = {};
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;
		if (siteToken) {
			query.site_token = siteToken;
		}

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['account.getSharedUsers']
		>('/account/v1/sharedUsers', ctx.key, {
			method: 'GET',
			query,
			siteToken,
		});

		const parsedResponse =
			GosquaredEndpointOutputSchemas['account.getSharedUsers'].parse(response);

		await logEventFromContext(
			ctx,
			'gosquared.account.getSharedUsers',
			{ count: parsedResponse.length },
			'completed',
		);

		return parsedResponse;
	};

export const getBlocked: GosquaredEndpoints['account.getBlocked'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['account.getBlocked'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) {
		query.site_token = siteToken;
	}
	if (parsed.presenter) {
		query.presenter = parsed.presenter;
	}

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['account.getBlocked']
	>('/account/v1/blocked', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['account.getBlocked'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.account.getBlocked',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};
