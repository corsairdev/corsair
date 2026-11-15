import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['environmentsList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.environmentsList.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			limit: parsedInput.limit,
			offset: parsedInput.offset,
			filter: parsedInput.filter,
			sort: parsedInput.sort,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.environmentsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.environments.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['environmentsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.environmentsGet.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.environmentsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.environments.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['environmentsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.environmentsCreate.parse(input);
	const { projectKey, ...body } = parsedInput;
	const path = `/api/v2/projects/${encodeURIComponent(projectKey)}/environments`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'POST',
		body,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.environmentsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.environments.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['environmentsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.environmentsUpdate.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: parsedInput.patch,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.environmentsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.environments.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteEnvironment: LaunchDarklyEndpoints['environmentsDelete'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.environmentsDelete.parse(input);
		const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}`;
		// `unknown` because even an empty response is checked against the endpoint output schema.
		const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
			method: 'DELETE',
		});
		LaunchDarklyEndpointOutputSchemas.environmentsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'launchdarkly.environments.delete',
			{ status: 'ok' },
			'completed',
		);
	};

export const resetSdkKey: LaunchDarklyEndpoints['environmentsResetSdkKey'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.environmentsResetSdkKey.parse(input);
		const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}/apiKey`;
		// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
		const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
			method: 'POST',
			query: { expiry: parsedInput.expiry },
		});
		const parsed =
			LaunchDarklyEndpointOutputSchemas.environmentsResetSdkKey.parse(response);
		await logEventFromContext(
			ctx,
			'launchdarkly.environments.resetSdkKey',
			{ key: parsed.key },
			'completed',
		);
		return parsed;
	};

export const resetMobileKey: LaunchDarklyEndpoints['environmentsResetMobileKey'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.environmentsResetMobileKey.parse(input);
		const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}/mobileKey`;
		// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
		const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
			method: 'POST',
		});
		const parsed =
			LaunchDarklyEndpointOutputSchemas.environmentsResetMobileKey.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'launchdarkly.environments.resetMobileKey',
			{ key: parsed.key },
			'completed',
		);
		return parsed;
	};

export const Environments = {
	list,
	get,
	create,
	update,
	delete: deleteEnvironment,
	resetSdkKey,
	resetMobileKey,
};
