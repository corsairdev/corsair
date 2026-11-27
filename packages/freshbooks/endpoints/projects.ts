import type { FreshBooksEndpoints } from '..';
import { FreshBooksAPIError, segment } from '../client';
import { call } from './call';
import {
	FreshBooksEndpointInputSchemas as Inputs,
	FreshBooksEndpointOutputSchemas as Outputs,
} from './types';

const listBase = (businessId: number) =>
	`/projects/business/${segment(businessId)}/projects`;

const itemBase = (businessId: number) =>
	`/projects/business/${segment(businessId)}/project`;

export const list: FreshBooksEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
			envelope: 'bare',
		},
		input,
		({ businessId, page, per_page }) => ({
			method: 'GET',
			path: listBase(businessId),
			query: { page, per_page },
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

export const get: FreshBooksEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
			envelope: 'bare',
		},
		input,
		({ businessId, projectId }) => ({
			method: 'GET',
			path: `${itemBase(businessId)}/${segment(projectId)}`,
		}),
		{ log: ({ businessId, projectId }) => ({ businessId, projectId }) },
	);

export const create: FreshBooksEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
			envelope: 'bare',
		},
		input,
		({ businessId, project }) => ({
			method: 'POST',
			path: itemBase(businessId),
			body: { project },
		}),
		{
			log: ({ businessId, project }) => ({
				businessId,
				title: project.title,
				projectType: project.project_type,
			}),
		},
	);

export const update: FreshBooksEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
			envelope: 'bare',
		},
		input,
		({ businessId, projectId, project }) => ({
			method: 'PUT',
			path: `${itemBase(businessId)}/${segment(projectId)}`,
			body: { project },
		}),
		{ log: ({ businessId, projectId }) => ({ businessId, projectId }) },
	);

// Hard delete: the project is gone, not marked. The docs answer an empty
// `{ response: {} }`, so success is a response object with no errors and no
// result; any other body fails.
export const remove: FreshBooksEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
			envelope: 'accounting',
		},
		input,
		({ businessId, projectId }) => ({
			method: 'DELETE',
			path: `${itemBase(businessId)}/${segment(projectId)}`,
		}),
		{
			// unwrapAccountingEnvelope returns undefined for `{ response: {} }`.
			shape: (raw, { projectId }) => {
				if (raw !== undefined && raw !== null) {
					throw new FreshBooksAPIError(
						'Unexpected projects.delete response body',
					);
				}
				return { success: true as const, projectId };
			},
			log: ({ businessId, projectId }) => ({ businessId, projectId }),
		},
	);
