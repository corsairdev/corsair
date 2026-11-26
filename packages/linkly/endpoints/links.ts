import type { LinklyEndpoints } from '..';
import { LINKLY_BULK_TIMEOUT_MS, segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const list: LinklyEndpoints['linksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.list',
			input: Inputs.linksList,
			output: Outputs.linksList,
		},
		input,
		({
			workspace_id,
			search,
			page,
			page_size,
			sort_by,
			sort_dir,
			deleted,
			filter,
		}) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/list_links`,
			query: { search, page, page_size, sort_by, sort_dir, deleted, filter },
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				page: result.page_number,
				count: result.links.length,
			}),
		},
	);

export const get: LinklyEndpoints['linksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.get',
			input: Inputs.linksGet,
			output: Outputs.linksGet,
		},
		input,
		({ id, workspace_id }) => ({
			method: 'GET',
			path: `/api/v1/link/${segment(id)}`,
			query: { workspace_id },
			replaySafe: true,
		}),
		{
			log: ({ id }) => ({ linkId: id }),
		},
	);

export const create: LinklyEndpoints['linksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.create',
			input: Inputs.linksCreate,
			output: Outputs.linksCreate,
		},
		input,
		(parsed) => ({
			// The spec documents two create paths for the same capability: this
			// one and POST /workspace/{id}/links. The docs and examples all use
			// POST /link, so that is the one wrapped here.
			method: 'POST',
			path: '/api/v1/link',
			body: parsed,
			// POST /link without an id creates a new link; a repeat after an
			// inconclusive outcome would make a second one.
			replaySafe: false,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				linkId: result.id,
			}),
		},
	);

export const update: LinklyEndpoints['linksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.update',
			input: Inputs.linksUpdate,
			output: Outputs.linksUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/v1/link',
			body: parsed,
			// Sending the id again updates the same link in place, so a replay
			// cannot create a duplicate.
			replaySafe: true,
		}),
		{
			log: ({ id }, result) => ({ linkId: id, updatedId: result.id }),
		},
	);

export const remove: LinklyEndpoints['linksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.delete',
			input: Inputs.linksDelete,
			output: Outputs.linksDelete,
		},
		input,
		({ workspace_id, id }) => ({
			method: 'DELETE',
			path: `/api/v1/workspace/${segment(workspace_id)}/links/${segment(id)}`,
			// Deleting a link already in the trash answers 200 again, so a
			// replay is a no-op rather than an error.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id, id }) => ({
				workspaceId: workspace_id,
				linkId: id,
			}),
		},
	);

export const restore: LinklyEndpoints['linksRestore'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.restore',
			input: Inputs.linksRestore,
			output: Outputs.linksRestore,
		},
		input,
		({ workspace_id, ids }) => ({
			method: 'POST',
			path: `/api/v1/workspace/${segment(workspace_id)}/links/restore`,
			body: { ids },
			// Restore targets links by id; links already out of the trash are not
			// restored again.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				// LogFields rejects null, so a nullable count logs as undefined.
				restored: result.restored ?? undefined,
				conflicts: result.conflicts?.length ?? 0,
			}),
		},
	);

export const exportLinks: LinklyEndpoints['linksExport'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.export',
			input: Inputs.linksExport,
			output: Outputs.linksExport,
		},
		input,
		({ workspace_id, format, search }) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/links/export`,
			query: { format, search },
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				count: result.length,
			}),
		},
	);

export const getDetails: LinklyEndpoints['linksGetDetails'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.getDetails',
			input: Inputs.linksGetDetails,
			output: Outputs.linksGetDetails,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/api/v1/get_link/${segment(id)}`,
			replaySafe: true,
		}),
		{
			log: ({ id }) => ({ linkId: id }),
		},
	);

export const bulkUpsert: LinklyEndpoints['linksBulkUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.bulkUpsert',
			input: Inputs.linksBulkUpsert,
			output: Outputs.linksBulkUpsert,
		},
		input,
		({ links }) => ({
			method: 'POST',
			path: '/api/v1/links',
			// The body is the bare array the spec documents.
			body: links,
			// Items without an id create links, so only an all-update batch is
			// safe to send again.
			replaySafe: links.every((link) => link.id !== undefined),
			// Up to 1,000 links per call can outlast core's 20 s default.
			timeoutMs: LINKLY_BULK_TIMEOUT_MS,
		}),
		{
			log: ({ links }, result) => ({
				submitted: links.length,
				failed: result.filter((item) => item.status !== 'success').length,
			}),
		},
	);

export const removeMany: LinklyEndpoints['linksDeleteMany'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.deleteMany',
			input: Inputs.linksDeleteMany,
			output: Outputs.linksDeleteMany,
		},
		input,
		({ workspace_id, ids }) => ({
			method: 'DELETE',
			path: `/api/v1/workspace/${segment(workspace_id)}/links`,
			body: { ids },
			// Trashing a trashed link again is a no-op.
			replaySafe: true,
			timeoutMs: LINKLY_BULK_TIMEOUT_MS,
		}),
		{
			log: ({ workspace_id, ids }) => ({
				workspaceId: workspace_id,
				count: ids.length,
			}),
		},
	);
