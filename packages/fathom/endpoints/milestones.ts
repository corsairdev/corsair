import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import { makeFathomRequest } from '../client';
import type { FathomEndpointOutputs } from './types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './types';

export const list: FathomEndpoints['milestones.list'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['milestones.list'].parse(input);
	const { site_id, ...query } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['milestones.list']
	>(`/sites/${encodeURIComponent(site_id)}/milestones`, ctx.key, {
		method: 'GET',
		query,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['milestones.list'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.milestones.list',
		{
			site_id,
			count: parsedResponse.data.length,
			has_more: parsedResponse.has_more,
		},
		'completed',
	);

	return parsedResponse;
};

export const create: FathomEndpoints['milestones.create'] = async (
	ctx,
	input,
) => {
	const parsed = FathomEndpointInputSchemas['milestones.create'].parse(input);
	const { site_id, name, milestone_date } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['milestones.create']
	>(`/sites/${encodeURIComponent(site_id)}/milestones`, ctx.key, {
		method: 'POST',
		body: { name, milestone_date },
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['milestones.create'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.milestones.create',
		{ site_id, milestone_id: parsedResponse.id },
		'completed',
	);

	return parsedResponse;
};

export const get: FathomEndpoints['milestones.get'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['milestones.get'].parse(input);
	const { site_id, milestone_id } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['milestones.get']
	>(
		`/sites/${encodeURIComponent(site_id)}/milestones/${encodeURIComponent(milestone_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['milestones.get'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.milestones.get',
		{ site_id, milestone_id },
		'completed',
	);

	return parsedResponse;
};

export const update: FathomEndpoints['milestones.update'] = async (
	ctx,
	input,
) => {
	const parsed = FathomEndpointInputSchemas['milestones.update'].parse(input);
	const { site_id, milestone_id, name, milestone_date } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['milestones.update']
	>(
		`/sites/${encodeURIComponent(site_id)}/milestones/${encodeURIComponent(milestone_id)}`,
		ctx.key,
		{
			method: 'POST',
			body: { name, milestone_date },
		},
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['milestones.update'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.milestones.update',
		{ site_id, milestone_id },
		'completed',
	);

	return parsedResponse;
};

export const del: FathomEndpoints['milestones.delete'] = async (ctx, input) => {
	const parsed = FathomEndpointInputSchemas['milestones.delete'].parse(input);
	const { site_id, milestone_id } = parsed;

	const response = await makeFathomRequest<
		FathomEndpointOutputs['milestones.delete']
	>(
		`/sites/${encodeURIComponent(site_id)}/milestones/${encodeURIComponent(milestone_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const parsedResponse =
		FathomEndpointOutputSchemas['milestones.delete'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.milestones.delete',
		{ site_id, milestone_id },
		'completed',
	);

	return parsedResponse;
};
