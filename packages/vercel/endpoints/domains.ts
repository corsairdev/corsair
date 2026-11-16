import { makeAuthenticatedVercelRequest, seg } from '../client';
import type { VercelContext } from '../index';
import { compactBody, defineEndpoint, pickQuery } from './common';
import {
	VercelDomainsInputSchemas as In,
	VercelDomainsOutputSchemas as Out,
} from './domains-types';

// Raw Vercel domain: fields beyond id and name pass through as is.
type DomainRecord = { id: string; name: string; [key: string]: unknown };

/**
 * Stores an account domain, keyed by its name: names are unique on Vercel and
 * are what every domain route takes. Project domains (no id, one row per
 * project) are not stored here. `domain` is a raw response item; id and name
 * are checked before it is stored.
 */
async function saveDomain(ctx: VercelContext, domain: unknown) {
	const record = domain as Partial<DomainRecord> | undefined;
	if (
		typeof record?.id !== 'string' ||
		typeof record.name !== 'string' ||
		!ctx.db.domains
	) {
		return;
	}
	const data: DomainRecord = { ...record, id: record.id, name: record.name };
	await ctx.db.domains.upsertByEntityId(record.name, data);
}

export const getDomains = defineEndpoint({
	event: 'vercel.domains.getDomains',
	input: In.getDomains,
	output: Out.getDomains,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{
			// Raw items: saveDomain checks each, the output schema parses them.
			domains?: unknown[];
		}>('/v5/domains', ctx, {
			teamId: input.teamId,
			query: pickQuery(input, ['limit', 'since', 'until']),
		});
		for (const domain of result?.domains ?? []) {
			await saveDomain(ctx, domain);
		}
		return result;
	},
});

export const getDomain = defineEndpoint({
	event: 'vercel.domains.getDomain',
	input: In.getDomain,
	output: Out.getDomain,
	run: async (ctx, input) => {
		// Raw domain: saveDomain checks it, the output schema parses the response.
		const result = await makeAuthenticatedVercelRequest<{ domain?: unknown }>(
			`/v5/domains/${seg(input.domain)}`,
			ctx,
			{ teamId: input.teamId },
		);
		await saveDomain(ctx, result?.domain);
		return result;
	},
});

export const getDomainConfig = defineEndpoint({
	event: 'vercel.domains.getDomainConfig',
	input: In.getDomainConfig,
	output: Out.getDomainConfig,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v6/domains/${seg(input.domain)}/config`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, ['projectIdOrName', 'strict']),
			},
		),
});

export const addDomain = defineEndpoint({
	event: 'vercel.domains.addDomain',
	input: In.addDomain,
	output: Out.addDomain,
	run: async (ctx, input) => {
		const { teamId, ...fields } = input;
		// Only the plain "add a domain you own" method. move-in and transfer-in
		// (which charges for the transfer) are deliberately not offered. The raw
		// domain in the response is checked by saveDomain.
		const result = await makeAuthenticatedVercelRequest<{ domain?: unknown }>(
			'/v7/domains',
			ctx,
			{
				method: 'POST',
				teamId,
				body: compactBody({ method: 'add', ...fields }),
			},
		);
		await saveDomain(ctx, result?.domain);
		return result;
	},
});

export const deleteDomain = defineEndpoint({
	event: 'vercel.domains.deleteDomain',
	input: In.deleteDomain,
	output: Out.deleteDomain,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{ uid?: string }>(
			`/v6/domains/${seg(input.domain)}`,
			ctx,
			{ method: 'DELETE', teamId: input.teamId },
		);
		// Reaching here means Vercel removed it; drop the stored copy too.
		await ctx.db.domains?.deleteByEntityId(input.domain);
		return { deleted: true, domain: input.domain, uid: result?.uid ?? null };
	},
});

export const getProjectDomains = defineEndpoint({
	event: 'vercel.domains.getProjectDomains',
	input: In.getProjectDomains,
	output: Out.getProjectDomains,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(input.idOrName)}/domains`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, [
					'limit',
					'since',
					'until',
					'production',
					'target',
					'customEnvironmentId',
					'gitBranch',
					'redirects',
					'redirect',
					'verified',
					'order',
				]),
			},
		),
});

export const getProjectDomain = defineEndpoint({
	event: 'vercel.domains.getProjectDomain',
	input: In.getProjectDomain,
	output: Out.getProjectDomain,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(input.idOrName)}/domains/${seg(input.domain)}`,
			ctx,
			{ teamId: input.teamId },
		),
});

export const addProjectDomain = defineEndpoint({
	event: 'vercel.domains.addProjectDomain',
	input: In.addProjectDomain,
	output: Out.addProjectDomain,
	run: async (ctx, input) => {
		const { teamId, idOrName, ...body } = input;
		return makeAuthenticatedVercelRequest(
			`/v10/projects/${seg(idOrName)}/domains`,
			ctx,
			{ method: 'POST', teamId, body: compactBody(body) },
		);
	},
});

export const updateProjectDomain = defineEndpoint({
	event: 'vercel.domains.updateProjectDomain',
	input: In.updateProjectDomain,
	output: Out.updateProjectDomain,
	run: async (ctx, input) => {
		const { teamId, idOrName, domain, ...body } = input;
		// null is kept: it clears the field on Vercel.
		return makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(idOrName)}/domains/${seg(domain)}`,
			ctx,
			{ method: 'PATCH', teamId, body: compactBody(body) },
		);
	},
});

export const removeProjectDomain = defineEndpoint({
	event: 'vercel.domains.removeProjectDomain',
	input: In.removeProjectDomain,
	output: Out.removeProjectDomain,
	run: async (ctx, input) => {
		const { teamId, idOrName, domain, removeRedirects } = input;
		await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(idOrName)}/domains/${seg(domain)}`,
			ctx,
			{
				method: 'DELETE',
				teamId,
				// A body only when the option is given; a plain DELETE otherwise.
				body: removeRedirects === undefined ? undefined : { removeRedirects },
			},
		);
		// Vercel answers with an empty object.
		return { removed: true, idOrName, domain };
	},
});

export const verifyProjectDomain = defineEndpoint({
	event: 'vercel.domains.verifyProjectDomain',
	input: In.verifyProjectDomain,
	output: Out.verifyProjectDomain,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(input.idOrName)}/domains/${seg(input.domain)}/verify`,
			ctx,
			{ method: 'POST', teamId: input.teamId },
		),
});
