import type { DubEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DUB_DOMAINS_PAGE_SIZE,
	DubEndpointInputSchemas as Inputs,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const create: DubEndpoints['domainsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.create',
			input: Inputs.domainsCreate,
			output: Outputs.domainsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/domains', body }),
	);

export const list: DubEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		({ archived, search, page, pageSize }) => ({
			method: 'GET',
			path: '/domains',
			query: { archived, search, page, pageSize },
		}),
		{
			shape: (raw, { page, pageSize }) => {
				// A non-array 2xx body is spec drift or an error envelope on 200;
				// hand it to the output schema so it fails loudly instead of
				// masquerading as an empty page.
				if (!Array.isArray(raw)) return raw;
				const effectivePageSize = pageSize ?? DUB_DOMAINS_PAGE_SIZE;
				return {
					items: raw,
					page: page ?? 1,
					pageSize: effectivePageSize,
					nextPage: raw.length >= effectivePageSize ? (page ?? 1) + 1 : null,
				};
			},
			log: (_, result) => ({ count: result.items.length }),
		},
	);

export const update: DubEndpoints['domainsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.update',
			input: Inputs.domainsUpdate,
			output: Outputs.domainsUpdate,
		},
		input,
		({ slug, newSlug, ...rest }) => ({
			method: 'PATCH',
			path: `/domains/${segment(slug)}`,
			body: { ...rest, slug: newSlug },
		}),
	);

export const remove: DubEndpoints['domainsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.delete',
			input: Inputs.domainsDelete,
			output: Outputs.domainsDelete,
		},
		input,
		({ slug }) => ({
			method: 'DELETE',
			path: `/domains/${segment(slug)}`,
		}),
		{
			log: ({ slug }) => ({ slug }),
		},
	);
