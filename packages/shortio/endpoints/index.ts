import { makeShortioRequest } from '../client';
import type { ShortioEndpoints } from '../index';
import {
	ShortioEndpointInputSchemas as inputs,
	ShortioEndpointOutputSchemas as outputs,
} from './types';

export const linksList: ShortioEndpoints['linksList'] = async (ctx, raw) => {
	const input = inputs.linksList.parse(raw);
	return outputs.linksList.parse(
		await makeShortioRequest('/api/links', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
};
export const linksGet: ShortioEndpoints['linksGet'] = async (ctx, raw) => {
	const { linkId, domainId } = inputs.linksGet.parse(raw);
	return outputs.linksGet.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(linkId)}`, ctx.key, {
			method: 'GET',
			query: domainId === undefined ? undefined : { domainId },
		}),
	);
};
export const linksExpand: ShortioEndpoints['linksExpand'] = async (
	ctx,
	raw,
) => {
	const input = inputs.linksExpand.parse(raw);
	return outputs.linksExpand.parse(
		await makeShortioRequest('/links/expand', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
};
export const linksCreate: ShortioEndpoints['linksCreate'] = async (
	ctx,
	raw,
) => {
	const body = inputs.linksCreate.parse(raw);
	return outputs.linksCreate.parse(
		await makeShortioRequest('/links', ctx.key, { method: 'POST', body }),
	);
};
export const linksUpdate: ShortioEndpoints['linksUpdate'] = async (
	ctx,
	raw,
) => {
	const { linkId, domain_id, body } = inputs.linksUpdate.parse(raw);
	return outputs.linksUpdate.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(linkId)}`, ctx.key, {
			method: 'POST',
			query: domain_id === undefined ? undefined : { domain_id },
			body,
		}),
	);
};
export const linksDelete: ShortioEndpoints['linksDelete'] = async (
	ctx,
	raw,
) => {
	const { link_id } = inputs.linksDelete.parse(raw);
	return outputs.linksDelete.parse(
		await makeShortioRequest(`/links/${encodeURIComponent(link_id)}`, ctx.key, {
			method: 'DELETE',
		}),
	);
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
	return outputs.linksDeleteBulk.parse(
		await makeShortioRequest('/links/delete_bulk', ctx.key, {
			method: 'DELETE',
			body,
		}),
	);
};
export const domainsList: ShortioEndpoints['domainsList'] = async (
	ctx,
	raw,
) => {
	const input = inputs.domainsList.parse(raw);
	return outputs.domainsList.parse(
		await makeShortioRequest('/api/domains', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
};
export const domainsGet: ShortioEndpoints['domainsGet'] = async (ctx, raw) => {
	const { domainId } = inputs.domainsGet.parse(raw);
	return outputs.domainsGet.parse(
		await makeShortioRequest(`/domains/${domainId}`, ctx.key, {
			method: 'GET',
		}),
	);
};
