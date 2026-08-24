import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

/** Official: GET /v2/namespaces/{namespace}/repositories/{repository}/tags */
export const list: DockerHubEndpoints['tagsList'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/namespaces/${encodeURIComponent(input.namespace)}/repositories/${encodeURIComponent(input.name)}/tags`,
		{ method: 'GET', query: pageQuery(input) },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.tags.list',
		summarize(input),
		'completed',
	);
	return response;
};

/** Official: GET /v2/namespaces/{namespace}/repositories/{repository}/tags/{tag} */
export const get: DockerHubEndpoints['tagsGet'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/namespaces/${encodeURIComponent(input.namespace)}/repositories/${encodeURIComponent(input.name)}/tags/${encodeURIComponent(input.tag)}`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.tags.get',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Delete tag. Not in public Hub OpenAPI; Hub REST still accepts
 * DELETE /v2/repositories/{namespace}/{name}/tags/{tag}/ (idempotent).
 */
export const deleteTag: DockerHubEndpoints['tagsDelete'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/tags/${encodeURIComponent(input.tag)}/`,
		{ method: 'DELETE', okOn404: true },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.tags.delete',
		summarize(input),
		'completed',
	);
	return response;
};
