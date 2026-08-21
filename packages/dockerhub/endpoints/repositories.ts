import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

/** Official: GET /v2/namespaces/{namespace}/repositories */
export const list: DockerHubEndpoints['repositoriesList'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/namespaces/${encodeURIComponent(input.namespace)}/repositories`,
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

/** Official: GET /v2/namespaces/{namespace}/repositories/{repository} */
export const get: DockerHubEndpoints['repositoriesGet'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/namespaces/${encodeURIComponent(input.namespace)}/repositories/${encodeURIComponent(input.name)}`,
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

/** Official: POST /v2/namespaces/{namespace}/repositories */
export const create: DockerHubEndpoints['repositoriesCreate'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/namespaces/${encodeURIComponent(input.namespace)}/repositories`,
		{
			method: 'POST',
			body: {
				namespace: input.namespace,
				name: input.name,
				description: input.description,
				is_private: input.isPrivate,
				full_description: input.fullDescription,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'dockerhub.repositories.create',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Delete repository. Not in public Hub OpenAPI; Hub REST still accepts
 * DELETE /v2/repositories/{namespace}/{name}/ (idempotent).
 */
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
