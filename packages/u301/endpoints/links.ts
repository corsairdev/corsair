import { asRecord } from 'corsair/core';
import type { U301Endpoints } from '..';
import { U301APIError } from '../client';
import { call, shortLinkSegment } from './call';
import {
	U301EndpointInputSchemas as Inputs,
	U301EndpointOutputSchemas as Outputs,
} from './types';

/**
 * Creates a short link.
 *
 * The SDK's `create` actually posts to `/shorten/bulk` with a one-element array, so
 * that is the route used here: it is the one U301's own client treats as the create
 * path. `reuseExisting` is what stops a second link being made for a URL that is
 * already shortened, and it spends no allowance when it matches.
 */
export const create: U301Endpoints['linkCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.create',
			input: Inputs.linkCreate,
			output: Outputs.linkCreate,
		},
		input,
		({ url, domain, slug, reuseExisting, password, comment }) => ({
			method: 'POST',
			path: '/shorten/bulk',
			body: [{ url, domain, slug, reuseExisting, password, comment }],
			// A replay creates a second link and spends another allowance slot, unless
			// reuseExisting happens to match; the caller owns that choice.
			replayable: false,
		}),
		{
			// The bulk route answers 200 with an array even for one link, and an item
			// in that array can carry `error` while the HTTP call succeeded. The SDK
			// throws for that item, so it is rejected here before the output schema
			// can accept it as a created link.
			// unknown: the body is provider JSON until unwrapped below.
			shape: (raw) => {
				if (!Array.isArray(raw) || raw.length === 0) {
					throw new U301APIError(
						'U301 accepted the bulk request but returned no link.',
						{ replayable: false },
					);
				}
				const first = asRecord(raw[0]);
				const itemError = first?.error;
				if (typeof itemError === 'string' && itemError.length > 0) {
					const reason =
						typeof first?.message === 'string' && first.message.length > 0
							? first.message
							: itemError;
					throw new U301APIError(`U301 did not create the link: ${reason}`, {
						replayable: false,
					});
				}
				return raw[0];
			},
			log: (_, result) => ({
				slug: result.slug ?? undefined,
				reused: result.isReused ?? false,
			}),
		},
	);

/** One page of links. The list wraps its rows in `links`. */
export const list: U301Endpoints['linkList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.list',
			input: Inputs.linkList,
			output: Outputs.linkList,
		},
		input,
		({ page, perPage }) => ({
			method: 'GET',
			path: '/shorten/list',
			query: { page, perPage },
			replayable: true,
		}),
		{
			log: (_, result) => ({ links: result.links?.length ?? 0 }),
		},
	);

/** One link, read by its short link rather than by an internal id. */
export const get: U301Endpoints['linkGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.get',
			input: Inputs.linkGet,
			output: Outputs.linkGet,
		},
		input,
		({ shortlink }) => ({
			method: 'GET',
			path: `/shorten/${shortLinkSegment(shortlink)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				slug: result.slug ?? undefined,
				clicks: result.statsClicks ?? undefined,
				archived: result.archived ?? undefined,
			}),
		},
	);

/**
 * Deletes a link. It is found by its short link, and the answer is a bare
 * `{"message":"success"}`.
 */
export const remove: U301Endpoints['linkDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.delete',
			input: Inputs.linkDelete,
			output: Outputs.linkDelete,
		},
		input,
		({ shortlink }) => ({
			method: 'DELETE',
			path: `/shorten/${shortLinkSegment(shortlink)}`,
			// A second delete finds nothing; the link is already gone.
			replayable: false,
		}),
		{
			log: (parsed) => ({ shortlink: parsed.shortlink }),
		},
	);

/** The workspace's domains, including the shared `u301.co`. */
export const domainList: U301Endpoints['domainList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainList,
			output: Outputs.domainList,
		},
		input,
		() => ({ method: 'GET', path: '/shorten/domains', replayable: true }),
		{
			log: (_, result) => ({ domains: result.length }),
		},
	);

/**
 * Adds a domain, which is the first half of the custom-domain flow: the DNS CNAME
 * still has to be created and verified before the domain serves links.
 */
export const domainCreate: U301Endpoints['domainCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.create',
			input: Inputs.domainCreate,
			output: Outputs.domainCreate,
		},
		input,
		({ domain, shortCodeLength }) => ({
			method: 'PUT',
			path: '/shorten/domains',
			body: { domain, shortCodeLength },
			// A 5xx may mean the domain was added and the answer was lost; a resend
			// then conflicts on a domain that already exists, which reports failure for
			// a change that did happen. Not replayable.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				message: result.message ?? undefined,
			}),
		},
	);

export const domainGet: U301Endpoints['domainGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.get',
			input: Inputs.domainGet,
			output: Outputs.domainGet,
		},
		input,
		({ domain }) => ({
			method: 'GET',
			path: `/shorten/domains/${encodeURIComponent(domain)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				valid: result.isValid ?? undefined,
				archived: result.isArchived ?? undefined,
				primary: result.isPrimary ?? undefined,
			}),
		},
	);

/**
 * Whether the domain's DNS challenge has completed.
 *
 * This is the step to poll after adding the CNAME; `actived` is U301's own spelling
 * of the field and is kept as sent.
 */
export const domainActive: U301Endpoints['domainActive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.active',
			input: Inputs.domainActive,
			output: Outputs.domainActive,
		},
		input,
		({ domain }) => ({
			// The SDK sends PATCH here even though the check only reads, so the
			// documented method is used rather than the method the semantics suggest.
			method: 'PATCH',
			path: `/shorten/domains/active/${encodeURIComponent(domain)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				active: result.actived ?? undefined,
				message: result.message ?? undefined,
			}),
		},
	);

export const domainDelete: U301Endpoints['domainDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.delete',
			input: Inputs.domainDelete,
			output: Outputs.domainDelete,
		},
		input,
		({ domain }) => ({
			method: 'DELETE',
			path: `/shorten/domains/${encodeURIComponent(domain)}`,
			// A second delete finds nothing; the domain is already gone.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				message: result.message ?? undefined,
			}),
		},
	);

/**
 * Sets the random slug length for a domain. One PATCH sends only this field, which
 * is why it is its own operation rather than a generic update.
 */
export const domainPathLength: U301Endpoints['domainPathLength'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.pathLength',
			input: Inputs.domainPathLength,
			output: Outputs.domainPathLength,
		},
		input,
		({ domain, randomCodeLength }) => ({
			method: 'PATCH',
			path: `/shorten/domains/${encodeURIComponent(domain)}`,
			body: { randomCodeLength },
			replayable: true,
		}),
		{
			log: (parsed) => ({
				domain: parsed.domain,
				length: parsed.randomCodeLength,
			}),
		},
	);

/** Sets where the domain's root redirects to, instead of the U301 home page. */
export const domainHomeRedirect: U301Endpoints['domainHomeRedirect'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.homeRedirect',
			input: Inputs.domainHomeRedirect,
			output: Outputs.domainHomeRedirect,
		},
		input,
		({ domain, homePageRedirectUrl }) => ({
			method: 'PATCH',
			path: `/shorten/domains/${encodeURIComponent(domain)}`,
			body: { homePageRedirectUrl },
			replayable: true,
		}),
		{
			log: (parsed) => ({ domain: parsed.domain }),
		},
	);

/** Sets where an unknown slug on the domain redirects to. */
export const domainNotFoundRedirect: U301Endpoints['domainNotFoundRedirect'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domains.notFoundRedirect',
			input: Inputs.domainNotFoundRedirect,
			output: Outputs.domainNotFoundRedirect,
		},
		input,
		({ domain, notFoundPageRedirectUrl }) => ({
			method: 'PATCH',
			path: `/shorten/domains/${encodeURIComponent(domain)}`,
			body: { notFoundPageRedirectUrl },
			replayable: true,
		}),
		{
			log: (parsed) => ({ domain: parsed.domain }),
		},
	);

/**
 * Daily click counts over a window.
 *
 * `range` and `granularity` are separate on purpose: the range says how far back,
 * the granularity says how the buckets are cut, and a 1-year range bucketed hourly
 * would be a very large answer.
 */
export const clicks: U301Endpoints['clicks'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analytics.clicks',
			input: Inputs.clicks,
			output: Outputs.clicks,
		},
		input,
		({ range, granularity, timezone }) => ({
			method: 'GET',
			path: '/shorten/analytics/clicks',
			query: { range, granularity, timezone },
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				range: parsed.range,
				buckets: result.data?.length ?? 0,
				clicks:
					result.data?.reduce((sum, row) => sum + (row.click ?? 0), 0) ?? 0,
			}),
		},
	);

/**
 * A top-N breakdown of clicks by one dimension.
 *
 * The dimension is part of the path (`/top-countries`), so it is the one place where
 * a caller chooses the resource rather than a filter.
 */
export const audience: U301Endpoints['audience'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analytics.audience',
			input: Inputs.audience,
			output: Outputs.audience,
		},
		input,
		({ dimension, range, timezone }) => ({
			method: 'GET',
			path: `/shorten/analytics/top-${dimension}`,
			query: { range, timezone },
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				dimension: parsed.dimension,
				rows: result.data?.length ?? 0,
			}),
		},
	);
