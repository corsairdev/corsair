import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['featureFlagsList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.featureFlagsList.parse(input);
	const path = `/api/v2/flags/${encodeURIComponent(parsedInput.projectKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			env: parsedInput.env,
			tag: parsedInput.tag,
			limit: parsedInput.limit,
			offset: parsedInput.offset,
			archived: parsedInput.archived,
			summary: parsedInput.summary,
			filter: parsedInput.filter,
			sort: parsedInput.sort,
			filterEnv: parsedInput.filterEnv,
			expand: parsedInput.expand,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.featureFlagsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.featureFlags.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['featureFlagsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.featureFlagsGet.parse(input);
	const path = `/api/v2/flags/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.featureFlagKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			env: parsedInput.env,
			expand: parsedInput.expand,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.featureFlagsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.featureFlags.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['featureFlagsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.featureFlagsCreate.parse(input);
	const { projectKey, clone, ...body } = parsedInput;
	const path = `/api/v2/flags/${encodeURIComponent(projectKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'POST',
		body,
		query: { clone },
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.featureFlagsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.featureFlags.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['featureFlagsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.featureFlagsUpdate.parse(input);
	const path = `/api/v2/flags/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.featureFlagKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: {
			patch: parsedInput.patch,
			comment: parsedInput.comment,
		},
		query: {
			ignoreConflicts: parsedInput.ignoreConflicts,
			dryRun: parsedInput.dryRun,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.featureFlagsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.featureFlags.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteFeatureFlag: LaunchDarklyEndpoints['featureFlagsDelete'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.featureFlagsDelete.parse(input);
		const path = `/api/v2/flags/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.featureFlagKey)}`;
		// `unknown` because even an empty response is checked against the endpoint output schema.
		const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
			method: 'DELETE',
		});
		LaunchDarklyEndpointOutputSchemas.featureFlagsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'launchdarkly.featureFlags.delete',
			{ status: 'ok' },
			'completed',
		);
	};

export const getStatus: LaunchDarklyEndpoints['featureFlagsGetStatus'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.featureFlagsGetStatus.parse(input);
	const path = `/api/v2/flag-statuses/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}/${encodeURIComponent(parsedInput.featureFlagKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.featureFlagsGetStatus.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.featureFlags.getStatus',
		{ name: parsed.name },
		'completed',
	);
	return parsed;
};

export const listStatuses: LaunchDarklyEndpoints['featureFlagsListStatuses'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.featureFlagsListStatuses.parse(input);
		const path = `/api/v2/flag-statuses/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}`;
		// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
		const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
			method: 'GET',
		});
		const parsed =
			LaunchDarklyEndpointOutputSchemas.featureFlagsListStatuses.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'launchdarkly.featureFlags.listStatuses',
			{ count: parsed.items?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const FeatureFlags = {
	list,
	get,
	create,
	update,
	delete: deleteFeatureFlag,
	getStatus,
	listStatuses,
};
