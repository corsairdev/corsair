import type { MoneybirdEndpoints } from '..';
import { idSegment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MoneybirdEndpoints['projectsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		({ page, per_page }) => ({
			replayable: true,
			method: 'GET',
			path: '/projects.json',
			query: { page, per_page },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page, parsed.per_page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MoneybirdEndpoints['projectsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/projects/${idSegment(id)}.json`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const create: MoneybirdEndpoints['projectsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		(parsed) => ({
			// The name must be unique within the administration; Moco-style state
			// changes are not part of the projects API.
			method: 'POST',
			path: '/projects.json',
			body: { project: parsed },
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id, state: result.state ?? undefined }),
		},
	);

export const update: MoneybirdEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/projects/${idSegment(id)}.json`,
			body: { project: rest },
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MoneybirdEndpoints['projectsDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/projects/${idSegment(id)}.json`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, String(id)),
			log: ({ id }) => ({ id }),
		},
	);
