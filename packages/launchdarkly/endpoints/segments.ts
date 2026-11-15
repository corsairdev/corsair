import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['segmentsList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.segmentsList.parse(input);
	const path = `/api/v2/segments/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			limit: parsedInput.limit,
			offset: parsedInput.offset,
			sort: parsedInput.sort,
			filter: parsedInput.filter,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.segmentsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.segments.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['segmentsGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.segmentsGet.parse(input);
	const path = `/api/v2/segments/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}/${encodeURIComponent(parsedInput.segmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.segmentsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.segments.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['segmentsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.segmentsCreate.parse(input);
	const { projectKey, environmentKey, ...body } = parsedInput;
	const path = `/api/v2/segments/${encodeURIComponent(projectKey)}/${encodeURIComponent(environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'POST',
		body,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.segmentsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.segments.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['segmentsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.segmentsUpdate.parse(input);
	const path = `/api/v2/segments/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}/${encodeURIComponent(parsedInput.segmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: {
			patch: parsedInput.patch,
			comment: parsedInput.comment,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.segmentsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.segments.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteSegment: LaunchDarklyEndpoints['segmentsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.segmentsDelete.parse(input);
	const path = `/api/v2/segments/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}/${encodeURIComponent(parsedInput.segmentKey)}`;
	await makeLaunchDarklyRequest<void>(path, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'launchdarkly.segments.delete',
		{ status: 'ok' },
		'completed',
	);
};

export const Segments = {
	list,
	get,
	create,
	update,
	delete: deleteSegment,
};
