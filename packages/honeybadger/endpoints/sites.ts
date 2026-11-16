import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import type { SitesCreateInput } from './types';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The writable site fields. Every one is optional, so an update can name only
 * what it changes and a create can send only what it was given.
 */
type SiteWriteBody = Partial<
	Pick<
		SitesCreateInput,
		| 'name'
		| 'url'
		| 'match_type'
		| 'match'
		| 'request_method'
		| 'validate_ssl'
		| 'request_body'
		| 'request_headers'
		| 'frequency'
		| 'locations'
		| 'outage_threshold'
		| 'active'
		| 'timeout'
	>
>;

function sitesPath(projectId: string, suffix = ''): string {
	const base = `/projects/${segment(projectId)}/sites`;
	return suffix ? `${base}/${suffix}` : base;
}

/** The fields a site write sends, dropping the ones the caller left out. */
function writeBody(parsed: SiteWriteBody): SiteWriteBody {
	const body: SiteWriteBody = {};
	for (const key of [
		'name',
		'url',
		'match_type',
		'match',
		'request_method',
		'validate_ssl',
		'request_body',
		'request_headers',
		'frequency',
		'locations',
		'outage_threshold',
		'active',
		'timeout',
	] as const) {
		// `in` is what keeps a field the caller left out out of the body, so an
		// update only changes what it names.
		if (key in parsed) Object.assign(body, { [key]: parsed[key] });
	}
	return body;
}

export const sitesList: HoneybadgerEndpoints['sitesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.list',
			input: Inputs['sites.list'],
			output: Outputs['sites.list'],
		},
		input,
		({ project_id, page, per_page }) => ({
			method: 'GET',
			path: sitesPath(project_id),
			query: { page, per_page },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const sitesGet: HoneybadgerEndpoints['sitesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.get',
			input: Inputs['sites.get'],
			output: Outputs['sites.get'],
		},
		input,
		({ project_id, site_id }) => ({
			method: 'GET',
			path: sitesPath(project_id, segment(site_id)),
		}),
		{ log: ({ site_id }) => ({ siteId: site_id }) },
	);

export const sitesCreate: HoneybadgerEndpoints['sitesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.create',
			input: Inputs['sites.create'],
			output: Outputs['sites.create'],
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: sitesPath(parsed.project_id),
			body: writeBody(parsed),
			// A second site for the same URL is a second monitor, not a repeat.
			replayable: false,
		}),
		{ log: ({ url }) => ({ url }) },
	);

export const sitesUpdate: HoneybadgerEndpoints['sitesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.update',
			input: Inputs['sites.update'],
			output: Outputs['sites.update'],
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: sitesPath(parsed.project_id, segment(parsed.site_id)),
			body: writeBody(parsed),
			replayable: true,
		}),
		{ log: ({ site_id }) => ({ siteId: site_id }) },
	);

export const sitesDelete: HoneybadgerEndpoints['sitesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.delete',
			input: Inputs['sites.delete'],
			output: Outputs['sites.delete'],
		},
		input,
		({ project_id, site_id }) => ({
			method: 'DELETE',
			path: sitesPath(project_id, segment(site_id)),
		}),
		{
			shape: (raw, { project_id, site_id }) =>
				confirmDeleted(raw, { project_id, site_id }),
			log: ({ site_id }) => ({ siteId: site_id }),
		},
	);

export const sitesChecks: HoneybadgerEndpoints['sitesChecks'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sites.checks',
			input: Inputs['sites.checks'],
			output: Outputs['sites.checks'],
		},
		input,
		({ project_id, site_id, limit, created_after, created_before }) => ({
			method: 'GET',
			path: sitesPath(project_id, `${segment(site_id)}/checks`),
			query: { limit, created_after, created_before },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const sitesOutages: HoneybadgerEndpoints['sitesOutages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'sites.outages',
			input: Inputs['sites.outages'],
			output: Outputs['sites.outages'],
		},
		input,
		({ project_id, site_id, limit, created_after, created_before }) => ({
			method: 'GET',
			path: sitesPath(project_id, `${segment(site_id)}/outages`),
			query: { limit, created_after, created_before },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
