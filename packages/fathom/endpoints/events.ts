import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import { makeFathomRequest } from '../client';
import type { FathomEndpointOutputs } from './types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './types';

export const list: FathomEndpoints['events.list'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.list'].parse(input);
	const { site_id, ...query } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.list']
	>(`/sites/${encodeURIComponent(site_id)}/events`, ctx.key, {
		method: 'GET',
		query,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['events.list'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.list',
		{
			site_id,
			count: parsedResponse.data.length,
			has_more: parsedResponse.has_more,
		},
		'completed',
	);

	return parsedResponse;
};

export const setCurrency: FathomEndpoints['events.setCurrency'] = async (
	ctx,
	input,
) => {
	const parsed = FathomEndpointInputSchemas['events.setCurrency'].parse(input);
	const { site_id, name, currency } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.setCurrency']
	>(`/sites/${encodeURIComponent(site_id)}/events/currency`, ctx.key, {
		method: 'POST',
		body: { name, currency },
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['events.setCurrency'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.setCurrency',
		{ site_id, currency },
		'completed',
	);

	return parsedResponse;
};

export const deleteByName: FathomEndpoints['events.deleteByName'] = async (
	ctx,
	input,
) => {
	const parsed = FathomEndpointInputSchemas['events.deleteByName'].parse(input);
	const { site_id, name } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.deleteByName']
	>(`/sites/${encodeURIComponent(site_id)}/events`, ctx.key, {
		method: 'DELETE',
		query: { name },
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['events.deleteByName'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.deleteByName',
		{ site_id },
		'completed',
	);

	return parsedResponse;
};

export const create: FathomEndpoints['events.create'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.create'].parse(input);
	const { site_id, ...body } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.create']
	>(`/sites/${encodeURIComponent(site_id)}/events`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['events.create'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.create',
		{ site_id },
		'completed',
	);

	return parsedResponse;
};

export const get: FathomEndpoints['events.get'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.get'].parse(input);
	const { site_id, event_id } = parsed;

	const response = await makeFathomRequest<FathomEndpointOutputs['events.get']>(
		`/sites/${encodeURIComponent(site_id)}/events/${encodeURIComponent(event_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['events.get'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.get',
		{ site_id, event_id },
		'completed',
	);

	return parsedResponse;
};

export const update: FathomEndpoints['events.update'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.update'].parse(input);
	const { site_id, event_id, ...body } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.update']
	>(
		`/sites/${encodeURIComponent(site_id)}/events/${encodeURIComponent(event_id)}`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['events.update'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.update',
		{ site_id, event_id },
		'completed',
	);

	return parsedResponse;
};

export const del: FathomEndpoints['events.delete'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.delete'].parse(input);
	const { site_id, event_id } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.delete']
	>(
		`/sites/${encodeURIComponent(site_id)}/events/${encodeURIComponent(event_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['events.delete'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.delete',
		{ site_id, event_id },
		'completed',
	);

	return parsedResponse;
};

export const wipe: FathomEndpoints['events.wipe'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['events.wipe'].parse(input);
	const { site_id, event_id } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['events.wipe']
	>(
		`/sites/${encodeURIComponent(site_id)}/events/${encodeURIComponent(event_id)}/data`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['events.wipe'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.events.wipe',
		{ site_id, event_id },
		'completed',
	);

	return parsedResponse;
};
