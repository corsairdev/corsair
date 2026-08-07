import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

export const list: DockerHubEndpoints['tagsList'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/tags`,
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

export const get: DockerHubEndpoints['tagsGet'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/tags/${encodeURIComponent(input.tag)}`,
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
