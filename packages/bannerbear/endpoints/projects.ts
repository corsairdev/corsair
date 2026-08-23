import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listProjects'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listProjects']
	>('/v5/projects', ctx.key, { method: 'GET', query: { page: input.page } });
	await logEventFromContext(
		ctx,
		'bannerbear.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getProject'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getProject']
	>(`/v5/projects/${input.uid}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'bannerbear.projects.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createProject']
	>('/v5/projects', ctx.key, { method: 'POST', body: { name: input.name } });
	await logEventFromContext(
		ctx,
		'bannerbear.projects.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const hydrate: BannerbearEndpoints['hydrateProject'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['hydrateProject']
	>(`/v5/projects/${input.uid}/hydrate`, ctx.key, {
		method: 'POST',
		body: { source_project: input.source_project },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.projects.hydrate',
		{ ...input },
		'completed',
	);
	return response;
};
