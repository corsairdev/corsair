import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

export const list: DockerHubEndpoints['repositoriesList'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/`,
		{ method: 'GET', query: pageQuery(input) },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.repositories.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: DockerHubEndpoints['repositoriesGet'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.repositories.get',
		summarize(input),
		'completed',
	);
	return response;
};

export const create: DockerHubEndpoints['repositoriesCreate'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/repositories/', {
		method: 'POST',
		body: {
			namespace: input.namespace,
			name: input.name,
			description: input.description,
			is_private: input.isPrivate,
			full_description: input.fullDescription,
		},
	});
	await logEventFromContext(
		ctx,
		'dockerhub.repositories.create',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteRepository: DockerHubEndpoints['repositoriesDelete'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/`,
			{ method: 'DELETE', okOn404: true },
		);
		await logEventFromContext(
			ctx,
			'dockerhub.repositories.delete',
			summarize(input),
			'completed',
		);
		return response;
	};
