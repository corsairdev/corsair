import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import type { ProjectsUpdateInput } from './types';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

const projectsBase = '/projects';

export const list: HoneybadgerEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs['projects.list'],
			output: Outputs['projects.list'],
		},
		input,
		({ name, page, per_page }) => ({
			method: 'GET',
			path: projectsBase,
			query: { name, page, per_page },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: HoneybadgerEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs['projects.get'],
			output: Outputs['projects.get'],
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `${projectsBase}/${segment(project_id)}`,
		}),
		{ log: ({ project_id }) => ({ projectId: project_id }) },
	);

/** The writable project fields, shared by create and update. */
type ProjectWriteBody = Partial<
	Pick<
		ProjectsUpdateInput,
		| 'name'
		| 'resolve_errors_on_deploy'
		| 'disable_public_links'
		| 'language'
		| 'user_url'
		| 'source_url'
		| 'user_search_field'
		| 'asana_workspace_id'
		| 'customer_throttle'
		| 'purge_days'
	>
>;

/** The writable fields, without the path and create-only ones. */
function writeBody(parsed: ProjectWriteBody): ProjectWriteBody {
	// Only the fields the caller sent are passed on: PATCH merges, so a field
	// left out stays as it is, while `null` clears it. Sending `undefined` would
	// serialise as absent under JSON.stringify anyway, so the body is built from
	// the keys that are present.
	const body: ProjectWriteBody = {};
	for (const key of [
		'name',
		'resolve_errors_on_deploy',
		'disable_public_links',
		'language',
		'user_url',
		'source_url',
		'user_search_field',
		'asana_workspace_id',
		'customer_throttle',
		'purge_days',
	] as const) {
		// `in` is what keeps a field the caller left out out of the body, so an
		// update only changes what it names and a null only clears what it names.
		if (key in parsed) Object.assign(body, { [key]: parsed[key] });
	}
	return body;
}

export const create: HoneybadgerEndpoints['projectsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs['projects.create'],
			output: Outputs['projects.create'],
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: projectsBase,
			body: {
				...writeBody(parsed),
				...(parsed.team_id !== undefined
					? { team_id: parsed.team_id }
					: undefined),
				...(parsed.disable_email_notifications !== undefined
					? {
							disable_email_notifications: parsed.disable_email_notifications,
						}
					: undefined),
			},
		}),
		{ log: (_, result) => ({ projectId: result.data.id }) },
	);

export const update: HoneybadgerEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs['projects.update'],
			output: Outputs['projects.update'],
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${projectsBase}/${segment(parsed.project_id)}`,
			body: writeBody(parsed),
			// The body sets fields to given values, so a replay lands on the same
			// record in the same state rather than applying a change twice.
			replayable: true,
		}),
		{ log: ({ project_id }) => ({ projectId: project_id }) },
	);

export const remove: HoneybadgerEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs['projects.delete'],
			output: Outputs['projects.delete'],
		},
		input,
		({ project_id }) => ({
			method: 'DELETE',
			path: `${projectsBase}/${segment(project_id)}`,
		}),
		{
			shape: (raw, { project_id }) => confirmDeleted(raw, { project_id }),
			log: ({ project_id }) => ({ projectId: project_id }),
		},
	);

export const stats: HoneybadgerEndpoints['projectsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.stats',
			input: Inputs['projects.stats'],
			output: Outputs['projects.stats'],
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `${projectsBase}/${segment(project_id)}/stats`,
		}),
		{ log: ({ project_id }) => ({ projectId: project_id }) },
	);

export const occurrences: HoneybadgerEndpoints['projectsOccurrences'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.occurrences',
			input: Inputs['projects.occurrences'],
			output: Outputs['projects.occurrences'],
		},
		input,
		({ project_id, period, environment }) => ({
			method: 'GET',
			path: `${projectsBase}/${segment(project_id)}/occurrences`,
			query: { period, environment },
		}),
		{
			log: (_, result) => ({ buckets: result.data.buckets.length }),
		},
	);
