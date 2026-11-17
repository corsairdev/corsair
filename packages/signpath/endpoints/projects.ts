import type { SignpathEndpoints } from '..';
import { segment } from '../client';
import { assertBodyless, call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

export const list: SignpathEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		(_, organizationId) => ({
			method: 'GET',
			path: orgPath(organizationId, '/Projects'),
		}),
		{
			// The route answers a bare array, so the envelope is added here. It
			// does not page: SignPath returns every project in one response.
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(
						'projects.list expected an array of projects from SignPath.',
					);
				}
				return { projects: raw };
			},
			log: (_, result) => ({ count: result.projects.length }),
		},
	);

export const get: SignpathEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ projectSlug }, organizationId) => ({
			method: 'GET',
			path: orgPath(organizationId, `/Projects/${segment(projectSlug)}`),
		}),
		{
			log: ({ projectSlug }) => ({ projectSlug }),
		},
	);

export const create: SignpathEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		(body, organizationId) => ({
			method: 'POST',
			path: orgPath(organizationId, '/Projects'),
			body,
		}),
		{
			// 201 puts the new project in Location with no body, and core's client
			// cannot return a header with the body. The caller supplied the slug
			// and the XML, so echo both back rather than invent a link.
			shape: (raw, { slug, artifactConfigurationXml }) => {
				assertBodyless(raw, 'projects.create');
				return {
					slug,
					created: true as const,
					artifactConfigurationXml,
				};
			},
			log: ({ slug }) => ({ slug }),
		},
	);

export const update: SignpathEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ projectSlug, ...body }, organizationId) => ({
			method: 'POST',
			path: orgPath(organizationId, `/Projects/${segment(projectSlug)}/Edit`),
			body,
		}),
		{
			shape: (raw, { projectSlug }) => {
				assertBodyless(raw, 'projects.update');
				return { projectSlug, success: true as const };
			},
			log: ({ projectSlug, slug }) => ({ projectSlug, slug }),
		},
	);

/** Activate and deactivate share a route shape and an empty 204. */
function changeStatus(
	ctx: Parameters<SignpathEndpoints['projectsActivate']>[0],
	action: 'Activate' | 'Deactivate',
	input: unknown, // unknown: raw caller input, parsed by call()
) {
	return call(
		ctx,
		{
			event: `projects.${action.toLowerCase()}`,
			input: Inputs.projectsActivate,
			output: Outputs.projectsActivate,
		},
		input,
		({ projectSlug }, organizationId) => ({
			method: 'POST',
			path: orgPath(
				organizationId,
				`/Projects/${segment(projectSlug)}/${action}`,
			),
		}),
		{
			shape: (raw, { projectSlug }) => {
				assertBodyless(raw, `projects.${action.toLowerCase()}`);
				return { projectSlug, success: true as const };
			},
			log: ({ projectSlug }) => ({ projectSlug }),
		},
	);
}

export const activate: SignpathEndpoints['projectsActivate'] = (ctx, input) =>
	changeStatus(ctx, 'Activate', input);

export const deactivate: SignpathEndpoints['projectsDeactivate'] = (
	ctx,
	input,
) => changeStatus(ctx, 'Deactivate', input);

export const setDefaultArtifactConfiguration: SignpathEndpoints['projectsSetDefaultArtifactConfiguration'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'projects.setDefaultArtifactConfiguration',
				input: Inputs.projectsSetDefaultArtifactConfiguration,
				output: Outputs.projectsSetDefaultArtifactConfiguration,
			},
			input,
			({ projectSlug, artifactConfigurationSlug }, organizationId) => ({
				method: 'POST',
				path: orgPath(
					organizationId,
					`/Projects/${segment(projectSlug)}/SetDefaultArtifactConfiguration`,
				),
				body: { artifactConfigurationSlug },
			}),
			{
				shape: (raw, { projectSlug, artifactConfigurationSlug }) => {
					assertBodyless(raw, 'projects.setDefaultArtifactConfiguration');
					return {
						projectSlug,
						artifactConfigurationSlug,
						success: true as const,
					};
				},
				log: ({ projectSlug, artifactConfigurationSlug }) => ({
					projectSlug,
					artifactConfigurationSlug,
				}),
			},
		);
