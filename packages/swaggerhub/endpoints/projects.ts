import { asRecord } from 'corsair/core';
import type { SwaggerhubEndpoints } from '..';
import { segment } from '../client';
import { bodyOr, call, queryOf } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The three spec collections a project holds; each is a list of names. The values
 * come from the operation's input schema, which already validated them.
 * unknown: the returned record mixes the optional strings with the arrays.
 */
function projectBody(fields: {
	name?: string;
	description?: string;
	apis?: string[];
	domains?: string[];
	templates?: string[];
}): Record<string, unknown> {
	return {
		...(fields.name === undefined ? {} : { name: fields.name }),
		...(fields.description === undefined
			? {}
			: { description: fields.description }),
		// The route documents all three as required, and a missing one is set to
		// an empty list, so they are always sent.
		apis: fields.apis ?? [],
		domains: fields.domains ?? [],
		templates: fields.templates ?? [],
	};
}

export const list: SwaggerhubEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		({ owner, page, limit, order }) => ({
			method: 'GET',
			path: `/projects/${segment(owner)}`,
			query: queryOf({ page, limit, order }),
		}),
		{
			// A missing `projects` array is a failure, not an empty list.
			shape: (raw) => {
				const record = asRecord(raw);
				if (!record) {
					throw new Error(
						'SwaggerHub returned an unexpected project list body',
					);
				}
				if (!Array.isArray(record.projects)) {
					throw new Error('SwaggerHub returned no projects array for the list');
				}
				return record;
			},
			log: (_, result) => ({ count: result.projects.length }),
		},
	);

export const get: SwaggerhubEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ owner, projectId }) => ({
			method: 'GET',
			path: `/projects/${segment(owner)}/${segment(projectId)}`,
		}),
		{
			log: (parsed) => ({
				owner: parsed.owner,
				projectId: parsed.projectId,
			}),
		},
	);

export const create: SwaggerhubEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		({ owner, name, description, apis, domains, templates }) => ({
			method: 'POST',
			path: `/projects/${segment(owner)}`,
			body: projectBody({ name, description, apis, domains, templates }),
		}),
		{
			// 201 carries no body in the spec; report the project that was sent.
			shape: (raw, parsed) =>
				bodyOr(raw, {
					owner: parsed.owner,
					...projectBody({
						name: parsed.name,
						description: parsed.description,
						apis: parsed.apis,
						domains: parsed.domains,
						templates: parsed.templates,
					}),
				}),
			log: (_, result) => ({
				owner: result.owner ?? undefined,
				project: result.name ?? undefined,
			}),
		},
	);

/** A PUT replaces the project, so a property left out is cleared. */
export const update: SwaggerhubEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ owner, projectId, name, description, apis, domains, templates }) => ({
			method: 'PUT',
			path: `/projects/${segment(owner)}/${segment(projectId)}`,
			// The PUT refuses a body without `name`, and a project's id is its name.
			body: projectBody({
				name: name ?? projectId,
				description,
				apis,
				domains,
				templates,
			}),
		}),
		{
			// The PUT answers 200 with no body; report the project that was sent.
			shape: (raw, parsed) =>
				bodyOr(raw, {
					owner: parsed.owner,
					name: parsed.name ?? parsed.projectId,
					...projectBody({
						description: parsed.description,
						apis: parsed.apis,
						domains: parsed.domains,
						templates: parsed.templates,
					}),
				}),
			log: (parsed) => ({
				owner: parsed.owner,
				projectId: parsed.projectId,
			}),
		},
	);

export const remove: SwaggerhubEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		({ owner, projectId }) => ({
			method: 'DELETE',
			path: `/projects/${segment(owner)}/${segment(projectId)}`,
		}),
		{
			shape: (_, parsed) => ({
				owner: parsed.owner,
				projectId: parsed.projectId,
				deleted: true,
			}),
			log: (parsed) => ({
				owner: parsed.owner,
				projectId: parsed.projectId,
			}),
		},
	);
