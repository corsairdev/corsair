import { makeShortioRequest } from '../client';
import type { ShortioContext, ShortioEndpoints } from '../index';
import type { ShortioEndpointOutputs } from './types';
import {
	ShortioEndpointInputSchemas as inputs,
	ShortioEndpointOutputSchemas as outputs,
} from './types';

type StoredLink = ShortioEndpointOutputs['linksGet'];
type StoredDomain = ShortioEndpointOutputs['domainsGet'];

async function saveLinks(ctx: ShortioContext, links: StoredLink[]) {
	if (!ctx.db?.links) return;
	for (const link of links)
		await ctx.db.links.upsertByEntityId(link.idString, link);
}

async function removeLinks(ctx: ShortioContext, linkIds: string[]) {
	if (!ctx.db?.links) return;
	for (const linkId of linkIds) await ctx.db.links.deleteByEntityId(linkId);
}

// List items lack ipExclusions and userPlan, so a list keeps what an earlier
// domains.get saved instead of wiping it.
async function saveDomain(ctx: ShortioContext, domain: StoredDomain) {
	if (!ctx.db?.domains) return;
	const entityId = String(domain.id);
	const existing = await ctx.db.domains.findByEntityId(entityId);
	await ctx.db.domains.upsertByEntityId(entityId, {
		...existing?.data,
		...domain,
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
	return outputs.linksArchive.parse(
		await makeShortioRequest('/links/archive', ctx.key, {
			method: 'POST',
			body,
		}),
	);
};
export const linksUnarchive: ShortioEndpoints['linksUnarchive'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksUnarchive.parse(raw);
	return outputs.linksUnarchive.parse(
		await makeShortioRequest('/links/unarchive', ctx.key, {
			method: 'POST',
			body,
		}),
	);
};
export const linksArchiveBulk: ShortioEndpoints['linksArchiveBulk'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksArchiveBulk.parse(raw);
	return outputs.linksArchiveBulk.parse(
		await makeShortioRequest('/links/archive_bulk', ctx.key, {
			method: 'POST',
			body,
		}),
	);
};
export const linksUnarchiveBulk: ShortioEndpoints['linksUnarchiveBulk'] =
	async (ctx, raw) => {
		const body = inputs.linksUnarchiveBulk.parse(raw);
		return outputs.linksUnarchiveBulk.parse(
			await makeShortioRequest('/links/unarchive_bulk', ctx.key, {
				method: 'POST',
				body,
			}),
		);
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
