import { makeShortioRequest } from '../client';
import type { ShortioContext, ShortioEndpoints } from '../index';
import type { ShortioEndpointOutputs } from './types';
import {
	ShortioEndpointInputSchemas as inputs,
	ShortioEndpointOutputSchemas as outputs,
} from './types';

type StoredLink = ShortioEndpointOutputs['linksGet'];
type StoredDomain = ShortioEndpointOutputs['domainsGet'];

// Saved rows are a local copy. Core hands every plugin entity clients even when
// createCorsair has no database, and those reject, so each write checks
// ctx.database first. A failed write is logged, never thrown: Short.io has
// already carried out the call by then.
async function writeSaved(
	ctx: ShortioContext,
	what: string,
	write: () => Promise<void>,
) {
	if (!ctx.database) return;
	try {
		await write();
	} catch (error) {
		console.warn(
			`Short.io: could not update saved ${what}:`,
			error instanceof Error ? error.message : String(error),
		);
	}
}

// Core's entity client can only find, upsert and delete whole rows, so the
// read-merge-write saves below (archive flag, domain details) could interleave
// with another save of the same row and put an older copy back, or recreate a
// row a delete just removed. Every write to one saved row runs in order behind
// the previous one. Each withTenant() call builds new entity clients over the
// same database, so the queues hang off the database object and are keyed by
// tenant, entity type and id.
const savedRowQueues = new WeakMap<object, Map<string, Promise<void>>>();

async function inOrder(
	ctx: ShortioContext,
	entity: 'links' | 'domains',
	entityId: string,
	write: () => Promise<void>,
) {
	const owner = ctx.database as object;
	let queues = savedRowQueues.get(owner);
	if (!queues) {
		queues = new Map();
		savedRowQueues.set(owner, queues);
	}
	const key = `${ctx.tenantId ?? ''}\u0000${entity}\u0000${entityId}`;
	const current = (queues.get(key) ?? Promise.resolve())
		.catch(() => undefined)
		.then(write);
	queues.set(key, current);
	try {
		await current;
	} finally {
		if (queues.get(key) === current) queues.delete(key);
	}
}

async function saveLinks(ctx: ShortioContext, links: StoredLink[]) {
	await writeSaved(ctx, 'links', async () => {
		for (const link of links)
			await inOrder(ctx, 'links', link.idString, () =>
				ctx.db.links.upsertByEntityId(link.idString, link).then(() => {}),
			);
	});
}

async function removeLinks(ctx: ShortioContext, linkIds: string[]) {
	await writeSaved(ctx, 'links', async () => {
		for (const linkId of linkIds)
			await inOrder(ctx, 'links', linkId, () =>
				ctx.db.links.deleteByEntityId(linkId).then(() => {}),
			);
	});
}

// Archive calls return only { success }, so the saved rows get the new flag
// directly. Links that were never saved (or were deleted) stay unsaved.
async function setArchived(
	ctx: ShortioContext,
	linkIds: string[],
	archived: boolean,
) {
	await writeSaved(ctx, 'links', async () => {
		for (const linkId of linkIds)
			await inOrder(ctx, 'links', linkId, async () => {
				const existing = await ctx.db.links.findByEntityId(linkId);
				if (existing)
					await ctx.db.links.upsertByEntityId(linkId, {
						...existing.data,
						archived,
					});
			});
	});
}

// List items lack ipExclusions and userPlan, so a list keeps what an earlier
// domains.get saved instead of wiping it.
async function saveDomain(ctx: ShortioContext, domain: StoredDomain) {
	await writeSaved(ctx, 'domain', async () => {
		const entityId = String(domain.id);
		await inOrder(ctx, 'domains', entityId, async () => {
			const existing = await ctx.db.domains.findByEntityId(entityId);
			await ctx.db.domains.upsertByEntityId(entityId, {
				...existing?.data,
				...domain,
			});
		});
	});
}

export const linksList: ShortioEndpoints['linksList'] = async (ctx, raw) => {
	const input = inputs.linksList.parse(raw);
	const result = outputs.linksList.parse(
		await makeShortioRequest('/api/links', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
	await saveLinks(ctx, result.links);
	return result;
};
export const linksGet: ShortioEndpoints['linksGet'] = async (ctx, raw) => {
	const { linkId, domainId } = inputs.linksGet.parse(raw);
	const link = outputs.linksGet.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(linkId)}`, ctx.key, {
			method: 'GET',
			query: domainId === undefined ? undefined : { domainId },
		}),
	);
	await saveLinks(ctx, [link]);
	return link;
};
export const linksExpand: ShortioEndpoints['linksExpand'] = async (
	ctx,
	raw,
) => {
	const input = inputs.linksExpand.parse(raw);
	const link = outputs.linksExpand.parse(
		await makeShortioRequest('/links/expand', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
	await saveLinks(ctx, [link]);
	return link;
};
export const linksCreate: ShortioEndpoints['linksCreate'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksCreate.parse(raw);
	const result = outputs.linksCreate.parse(
		await makeShortioRequest('/links', ctx.key, { method: 'POST', body }),
	);
	const { success: _success, duplicate: _duplicate, ...link } = result;
	await saveLinks(ctx, [link]);
	return result;
};
export const linksUpdate: ShortioEndpoints['linksUpdate'] = async (
	ctx,
	raw,
) => {
	const { linkId, domain_id, body } = inputs.linksUpdate.parse(raw);
	const link = outputs.linksUpdate.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(linkId)}`, ctx.key, {
			method: 'POST',
			query: domain_id === undefined ? undefined : { domain_id },
			body,
		}),
	);
	await saveLinks(ctx, [link]);
	return link;
};
export const linksDelete: ShortioEndpoints['linksDelete'] = async (
	ctx,
	raw,
) => {
	const { link_id } = inputs.linksDelete.parse(raw);
	const result = outputs.linksDelete.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(link_id)}`, ctx.key, {
			method: 'DELETE',
		}),
	);
	if (result.success) await removeLinks(ctx, [link_id]);
	return result;
};
export const linksArchive: ShortioEndpoints['linksArchive'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksArchive.parse(raw);
	const result = outputs.linksArchive.parse(
		await makeShortioRequest('/links/archive', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	if (result.success) await setArchived(ctx, [body.link_id], true);
	return result;
};
export const linksUnarchive: ShortioEndpoints['linksUnarchive'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksUnarchive.parse(raw);
	const result = outputs.linksUnarchive.parse(
		await makeShortioRequest('/links/unarchive', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	if (result.success) await setArchived(ctx, [body.link_id], false);
	return result;
};
export const linksArchiveBulk: ShortioEndpoints['linksArchiveBulk'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksArchiveBulk.parse(raw);
	const result = outputs.linksArchiveBulk.parse(
		await makeShortioRequest('/links/archive_bulk', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	if (result.success) await setArchived(ctx, body.link_ids, true);
	return result;
};
export const linksUnarchiveBulk: ShortioEndpoints['linksUnarchiveBulk'] =
	async (ctx, raw) => {
		const body = inputs.linksUnarchiveBulk.parse(raw);
		const result = outputs.linksUnarchiveBulk.parse(
			await makeShortioRequest('/links/unarchive_bulk', ctx.key, {
				method: 'POST',
				body,
			}),
		);
		if (result.success) await setArchived(ctx, body.link_ids, false);
		return result;
	};
export const linksDeleteBulk: ShortioEndpoints['linksDeleteBulk'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksDeleteBulk.parse(raw);
	const result = outputs.linksDeleteBulk.parse(
		await makeShortioRequest('/links/delete_bulk', ctx.key, {
			method: 'DELETE',
			body,
		}),
	);
	if (result.success) await removeLinks(ctx, body.link_ids);
	return result;
};
export const domainsList: ShortioEndpoints['domainsList'] = async (
	ctx,
	raw,
) => {
	const input = inputs.domainsList.parse(raw);
	const domains = outputs.domainsList.parse(
		await makeShortioRequest('/api/domains', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
	for (const domain of domains) await saveDomain(ctx, domain);
	return domains;
};
export const domainsGet: ShortioEndpoints['domainsGet'] = async (ctx, raw) => {
	const { domainId } = inputs.domainsGet.parse(raw);
	const domain = outputs.domainsGet.parse(
		await makeShortioRequest(`/domains/${domainId}`, ctx.key, {
			method: 'GET',
		}),
	);
	await saveDomain(ctx, domain);
	return domain;
};
