import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import { makeFathomRequest } from '../client';
import type { FathomEndpointOutputs } from './types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './types';

export const list: FathomEndpoints['sites.list'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.list'].parse(input);

	const response = await makeFathomRequest<FathomEndpointOutputs['sites.list']>(
		'/sites',
		ctx.key,
		{
			method: 'GET',
			query: parsed,
		},
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.list'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.list',
		{
			count: parsedResponse.data.length,
			has_more: parsedResponse.has_more,
		},
		'completed',
	);

	return parsedResponse;
};

export const create: FathomEndpoints['sites.create'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.create'].parse(input);

	const response = await makeFathomRequest<
		FathomEndpointOutputs['sites.create']
	>('/sites', ctx.key, {
		method: 'POST',
		body: parsed,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.create'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.create',
		{ site_id: parsedResponse.id },
		'completed',
	);

	return parsedResponse;
};

export const get: FathomEndpoints['sites.get'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.get'].parse(input);

	const response = await makeFathomRequest<FathomEndpointOutputs['sites.get']>(
		`/sites/${encodeURIComponent(parsed.site_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.get'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.get',
		{ site_id: parsed.site_id },
		'completed',
	);

	return parsedResponse;
};

export const update: FathomEndpoints['sites.update'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.update'].parse(input);
	const { site_id, ...body } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['sites.update']
	>(`/sites/${encodeURIComponent(site_id)}`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.update'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.update',
		{ site_id },
		'completed',
	);

	return parsedResponse;
};

export const del: FathomEndpoints['sites.delete'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.delete'].parse(input);

	const response = await makeFathomRequest<
		FathomEndpointOutputs['sites.delete']
	>(`/sites/${encodeURIComponent(parsed.site_id)}`, ctx.key, {
		method: 'DELETE',
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.delete'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.delete',
		{ site_id: parsed.site_id, deleted: parsedResponse.deleted },
		'completed',
	);

	return parsedResponse;
};

export const wipe: FathomEndpoints['sites.wipe'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['sites.wipe'].parse(input);

	const response = await makeFathomRequest<FathomEndpointOutputs['sites.wipe']>(
		`/sites/${encodeURIComponent(parsed.site_id)}/data`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['sites.wipe'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.sites.wipe',
		{ site_id: parsed.site_id },
		'completed',
	);

	return parsedResponse;
};
