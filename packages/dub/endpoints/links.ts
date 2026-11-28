import type { DubEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DUB_LINKS_PAGE_SIZE,
	DubEndpointInputSchemas as Inputs,
	nextCursorFrom,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const create: DubEndpoints['linksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.create',
			input: Inputs.linksCreate,
			output: Outputs.linksCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/links', body }),
	);

export const list: DubEndpoints['linksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.list',
			input: Inputs.linksList,
			output: Outputs.linksList,
		},
		input,
		({
			domain,
			tagIds,
			tagNames,
			folderId,
			search,
			userId,
			tenantId,
			showArchived,
			startingAfter,
			endingBefore,
			pageSize,
		}) => ({
			method: 'GET',
			path: '/links',
			query: {
				domain,
				tagIds: tagIds?.join(','),
				tagNames: tagNames?.join(','),
				folderId,
				search,
				userId,
				tenantId,
				showArchived,
				startingAfter,
				endingBefore,
				pageSize,
			},
		}),
		{
			// Dub answers a bare array with no cursor field: the next cursor is
			// the last item's id, and a short page means the list is over.
			shape: (raw, { pageSize }) => {
				// A non-array 2xx body is spec drift or an error envelope on 200;
				// hand it to the output schema so it fails loudly instead of
				// masquerading as an empty page.
				if (!Array.isArray(raw)) return raw;
				return {
					items: raw,
					nextCursor: nextCursorFrom(raw, pageSize ?? DUB_LINKS_PAGE_SIZE),
				};
			},
			log: (_, result) => ({ count: result.items.length }),
		},
	);

export const get: DubEndpoints['linksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.get',
			input: Inputs.linksGet,
			output: Outputs.linksGet,
		},
		input,
		({ linkId, externalId, domain, key }) => ({
			method: 'GET',
			path: '/links/info',
			query: { linkId, externalId, domain, key },
		}),
	);

export const update: DubEndpoints['linksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.update',
			input: Inputs.linksUpdate,
			output: Outputs.linksUpdate,
		},
		input,
		({ linkId, ...body }) => ({
			method: 'PATCH',
			path: `/links/${segment(linkId)}`,
			body,
		}),
	);

// Dub matches an upsert by the destination url within the workspace: an
// existing link with that url is returned, or updated when other fields
// differ (a different key renames its slug). Replaying the same body gives
// the same result, so it may be retried after a 5xx.
export const upsert: DubEndpoints['linksUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.upsert',
			input: Inputs.linksUpsert,
			output: Outputs.linksUpsert,
		},
		input,
		(body) => ({
			method: 'PUT',
			path: '/links/upsert',
			body,
			idempotent: true,
		}),
	);

export const count: DubEndpoints['linksCount'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.count',
			input: Inputs.linksCount,
			output: Outputs.linksCount,
		},
		input,
		({
			domain,
			tagIds,
			tagNames,
			folderId,
			search,
			userId,
			tenantId,
			showArchived,
			groupBy,
		}) => ({
			method: 'GET',
			path: '/links/count',
			query: {
				domain,
				tagIds: tagIds?.join(','),
				tagNames: tagNames?.join(','),
				folderId,
				search,
				userId,
				tenantId,
				showArchived,
				groupBy,
			},
		}),
		{
			// Dub answers a number without groupBy and an array with it; any
			// other body (an error envelope on a 200) must fail, not pass as a count.
			shape: (raw, { groupBy }) => {
				const fits = groupBy ? Array.isArray(raw) : typeof raw === 'number';
				if (!fits) {
					throw new Error(
						`[dub] links.count expected ${groupBy ? 'an array of grouped counts' : 'a number'}`,
					);
				}
				return raw;
			},
		},
	);

export const remove: DubEndpoints['linksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.delete',
			input: Inputs.linksDelete,
			output: Outputs.linksDelete,
		},
		input,
		({ linkId }) => ({
			method: 'DELETE',
			path: `/links/${segment(linkId)}`,
		}),
		{
			log: ({ linkId }) => ({ linkId }),
		},
	);

export const bulkCreate: DubEndpoints['linksBulkCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.bulkCreate',
			input: Inputs.linksBulkCreate,
			output: Outputs.linksBulkCreate,
		},
		input,
		({ links }) => ({ method: 'POST', path: '/links/bulk', body: links }),
		{
			log: (_, result) => ({
				submitted: result.length,
				failed: result.filter((row) => 'error' in row && row.error).length,
			}),
		},
	);

export const bulkUpdate: DubEndpoints['linksBulkUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.bulkUpdate',
			input: Inputs.linksBulkUpdate,
			output: Outputs.linksBulkUpdate,
		},
		input,
		({ linkIds, externalIds, data }) => ({
			method: 'PATCH',
			path: '/links/bulk',
			body: { linkIds, externalIds, data },
		}),
		{
			log: (_, result) => ({ updated: result.length }),
		},
	);

export const bulkDelete: DubEndpoints['linksBulkDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.bulkDelete',
			input: Inputs.linksBulkDelete,
			output: Outputs.linksBulkDelete,
		},
		input,
		({ linkIds }) => ({
			method: 'DELETE',
			path: '/links/bulk',
			// The docs describe the query value as a comma-separated list.
			query: { linkIds: linkIds.join(',') },
		}),
		{
			log: ({ linkIds }, result) => ({
				submitted: linkIds.length,
				deleted: result.deletedCount,
			}),
		},
	);
