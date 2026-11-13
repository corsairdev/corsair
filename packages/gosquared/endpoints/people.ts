import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const getPeople: GosquaredEndpoints['people.getPeople'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['people.getPeople'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;
	if (parsed.sort) query.sort = parsed.sort;
	if (parsed.order) query.order = parsed.order;
	if (parsed.filters) query.filters = parsed.filters;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getPeople']
	>('/people/v1/people', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getPeople'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getPeople',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getPerson: GosquaredEndpoints['people.getPerson'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['people.getPerson'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getPerson']
	>(`/people/v1/people/${encodeURIComponent(parsed.person_id)}`, ctx.key, {
		method: 'GET',
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getPerson'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getPerson',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getPersonFeed: GosquaredEndpoints['people.getPersonFeed'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['people.getPersonFeed'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;
	if (parsed.from) query.from = parsed.from;
	if (parsed.to) query.to = parsed.to;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getPersonFeed']
	>(`/people/v1/people/${encodeURIComponent(parsed.person_id)}/feed`, ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getPersonFeed'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getPersonFeed',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getPersonDevices: GosquaredEndpoints['people.getPersonDevices'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['people.getPersonDevices'].parse(input);
		const query: Record<string, string | number | boolean | undefined> = {};
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;
		if (siteToken) query.site_token = siteToken;
		if (parsed.limit !== undefined) query.limit = parsed.limit;

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['people.getPersonDevices']
		>(
			`/people/v1/people/${encodeURIComponent(parsed.person_id)}/devices`,
			ctx.key,
			{
				method: 'GET',
				query,
				siteToken,
			},
		);

		const parsedResponse =
			GosquaredEndpointOutputSchemas['people.getPersonDevices'].parse(response);

		await logEventFromContext(
			ctx,
			'gosquared.people.getPersonDevices',
			{ success: true },
			'completed',
		);

		return parsedResponse;
	};

export const getSmartGroups: GosquaredEndpoints['people.getSmartGroups'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['people.getSmartGroups'].parse(input);
		const query: Record<string, string | number | boolean | undefined> = {};
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;
		if (siteToken) query.site_token = siteToken;

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['people.getSmartGroups']
		>('/people/v1/smartgroups', ctx.key, {
			method: 'GET',
			query,
			siteToken,
		});

		const parsedResponse =
			GosquaredEndpointOutputSchemas['people.getSmartGroups'].parse(response);

		await logEventFromContext(
			ctx,
			'gosquared.people.getSmartGroups',
			{ success: true },
			'completed',
		);

		return parsedResponse;
	};

export const getDevices: GosquaredEndpoints['people.getDevices'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['people.getDevices'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getDevices']
	>('/people/v1/devices', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getDevices'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getDevices',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getDevice: GosquaredEndpoints['people.getDevice'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['people.getDevice'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getDevice']
	>(`/people/v1/devices/${encodeURIComponent(parsed.device_id)}`, ctx.key, {
		method: 'GET',
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getDevice'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getDevice',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getEventTypes: GosquaredEndpoints['people.getEventTypes'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['people.getEventTypes'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['people.getEventTypes']
	>('/people/v1/eventTypes', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['people.getEventTypes'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.people.getEventTypes',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getPropertyTypes: GosquaredEndpoints['people.getPropertyTypes'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['people.getPropertyTypes'].parse(input);
		const query: Record<string, string | number | boolean | undefined> = {};
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;
		if (siteToken) query.site_token = siteToken;

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['people.getPropertyTypes']
		>('/people/v1/propertyTypes', ctx.key, {
			method: 'GET',
			query,
			siteToken,
		});

		const parsedResponse =
			GosquaredEndpointOutputSchemas['people.getPropertyTypes'].parse(response);

		await logEventFromContext(
			ctx,
			'gosquared.people.getPropertyTypes',
			{ success: true },
			'completed',
		);

		return parsedResponse;
	};
