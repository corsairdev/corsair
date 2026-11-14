import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

export const list: ImgixEndpoints['sources.list'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['sources.list'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.filter_name !== undefined) {
		query['filter[name]'] = parsedInput.filter_name;
	}
	if (parsedInput.filter_deployment_type !== undefined) {
		query['filter[deployment.type]'] = parsedInput.filter_deployment_type;
	}
	if (parsedInput.filter_enabled !== undefined) {
		query['filter[enabled]'] = parsedInput.filter_enabled;
	}
	if (parsedInput.sort !== undefined) {
		query.sort = parsedInput.sort;
	}
	if (parsedInput.fields !== undefined) {
		query['fields[sources]'] = parsedInput.fields;
	}
	if (parsedInput.page_number !== undefined) {
		query['page[number]'] = parsedInput.page_number;
	}
	if (parsedInput.page_size !== undefined) {
		query['page[size]'] = parsedInput.page_size;
	}

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: 'sources',
		query,
	});

	const parsed = ImgixEndpointOutputSchemas['sources.list'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.sources.list',
		{ count: parsed.data.length },
		'completed',
	);

	return parsed;
};

export const create: ImgixEndpoints['sources.create'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['sources.create'].parse(input);

	// Every input field other than name and deployment_type is a deployment
	// attribute under the same name in the imgix API (the input schema is strict).
	const { name, deployment_type, ...deploymentFields } = parsedInput;
	// `unknown` because deployment attributes vary across source types
	const deployment: Record<string, unknown> = { type: deployment_type };
	for (const [field, value] of Object.entries(deploymentFields)) {
		if (value !== undefined) deployment[field] = value;
	}

	const body = {
		data: {
			type: 'sources',
			attributes: {
				name,
				deployment,
			},
		},
		jsonapi: {
			version: '1.0',
		},
	};

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: 'sources',
		body,
	});

	const parsed = ImgixEndpointOutputSchemas['sources.create'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.sources.create',
		{ source_id: parsed.data.id, deployment_type: parsedInput.deployment_type },
		'completed',
	);

	return parsed;
};

export const get: ImgixEndpoints['sources.get'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['sources.get'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.fields !== undefined) {
		query['fields[sources]'] = parsedInput.fields;
	}

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}`,
		query,
	});

	const parsed = ImgixEndpointOutputSchemas['sources.get'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.sources.get',
		{ source_id: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: ImgixEndpoints['sources.update'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['sources.update'].parse(input);

	// `unknown` because update attributes vary across provider parameters
	const attributes: Record<string, unknown> = {};
	if (parsedInput.name !== undefined) attributes.name = parsedInput.name;
	if (parsedInput.enabled !== undefined)
		attributes.enabled = parsedInput.enabled;

	// `unknown` because deployment attributes vary across provider parameters
	const deployment: Record<string, unknown> = {};
	if (parsedInput.default_params !== undefined)
		deployment.default_params = parsedInput.default_params;
	if (parsedInput.custom_domains !== undefined)
		deployment.custom_domains = parsedInput.custom_domains;
	if (parsedInput.cache_ttl_value !== undefined)
		deployment.cache_ttl_value = parsedInput.cache_ttl_value;
	if (parsedInput.cache_ttl_error !== undefined)
		deployment.cache_ttl_error = parsedInput.cache_ttl_error;
	if (parsedInput.secure_url_enabled !== undefined)
		deployment.secure_url_enabled = parsedInput.secure_url_enabled;

	if (Object.keys(deployment).length > 0) {
		attributes.deployment = deployment;
	}

	const body = {
		data: {
			id: parsedInput.source_id,
			type: 'sources',
			attributes,
		},
	};

	const response = await makeImgixRequest(ctx.key, {
		method: 'PATCH',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}`,
		body,
	});

	const parsed = ImgixEndpointOutputSchemas['sources.update'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.sources.update',
		{ source_id: parsed.data.id },
		'completed',
	);

	return parsed;
};
