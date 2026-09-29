import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';
import type { ScaleProject } from './types';

function encodeName(name: string): string {
	return encodeURIComponent(name);
}

export const getProject: ScaleAiEndpoints['getProject'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleProject>(
		`projects/${encodeName(input.name)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.projects.get',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const listProjects: ScaleAiEndpoints['listProjects'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleProject[]>(
		'projects',
		ctx.key,
		{
			method: 'GET',
			query:
				input?.archived === undefined
					? undefined
					: { archived: input.archived },
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.projects.list',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const setProjectParams: ScaleAiEndpoints['setProjectParams'] = async (
	ctx,
	input,
) => {
	const { project, ...params } = input;
	const response = await makeScaleAiRequest<ScaleProject>(
		`projects/${encodeName(project)}/setParams`,
		ctx.key,
		{ method: 'POST', body: params },
	);
	await logEventFromContext(
		ctx,
		'scaleai.projects.setParams',
		{ project },
		'completed',
	);
	return response;
};

export const setProjectOntology: ScaleAiEndpoints['setProjectOntology'] =
	async (ctx, input) => {
		const { project, ...body } = input;
		const response = await makeScaleAiRequest<ScaleProject>(
			`projects/${encodeName(project)}/setOntology`,
			ctx.key,
			{ method: 'POST', body },
		);
		await logEventFromContext(
			ctx,
			'scaleai.projects.setOntology',
			{ project },
			'completed',
		);
		return response;
	};
