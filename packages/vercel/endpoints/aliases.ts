import { makeAuthenticatedVercelRequest, seg } from '../client';
import type { VercelContext } from '../index';
import {
	VercelAliasesInputSchemas as In,
	VercelAliasesOutputSchemas as Out,
} from './aliases-types';
import { compactBody, defineEndpoint, pickQuery } from './common';

type AliasRecord = { uid: string; [key: string]: unknown };

async function saveAlias(
	ctx: VercelContext,
	alias: unknown,
	deploymentId?: string,
) {
	if (!alias || typeof alias !== 'object' || !ctx.db.aliases) return;
	// protectionBypass is keyed by share-link secrets and invitee emails: it
	// stays out of the local store.
	const { protectionBypass: _bypass, ...rest } = alias as Record<
		string,
		unknown
	>;
	if (typeof rest.uid !== 'string' || !rest.uid) return;
	// The local entity rejects null in alias, created and createdAt; dropping
	// null fields lets a sparse alias still store.
	const record: AliasRecord = { uid: rest.uid };
	for (const [key, value] of Object.entries(rest)) {
		if (value !== null) record[key] = value;
	}
	if (deploymentId) record.deploymentId = deploymentId;
	await ctx.db.aliases.upsertByEntityId(rest.uid, record);
}

export const getAliases = defineEndpoint({
	event: 'vercel.aliases.getAliases',
	input: In.getAliases,
	output: Out.getAliases,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{
			aliases?: unknown[];
		}>('/v4/aliases', ctx, {
			teamId: input.teamId,
			query: pickQuery(input, [
				'limit',
				'since',
				'until',
				'domain',
				'projectId',
				'rollbackDeploymentId',
			]),
		});
		for (const alias of result?.aliases ?? []) {
			await saveAlias(ctx, alias);
		}
		return result;
	},
});

export const getAlias = defineEndpoint({
	event: 'vercel.aliases.getAlias',
	input: In.getAlias,
	output: Out.getAlias,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v4/aliases/${seg(input.idOrAlias)}`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, ['projectId', 'since', 'until']),
			},
		);
		await saveAlias(ctx, result);
		return result;
	},
});

export const getDeploymentAliases = defineEndpoint({
	event: 'vercel.aliases.getDeploymentAliases',
	input: In.getDeploymentAliases,
	output: Out.getDeploymentAliases,
	// Not stored: these entries lack projectId and createdAt, and an upsert
	// would replace the fuller record getAliases saved.
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v2/deployments/${seg(input.deploymentId)}/aliases`,
			ctx,
			{ teamId: input.teamId },
		),
});

export const assignAlias = defineEndpoint({
	event: 'vercel.aliases.assignAlias',
	input: In.assignAlias,
	output: Out.assignAlias,
	run: async (ctx, input) => {
		const { teamId, deploymentId, ...body } = input;
		const result = await makeAuthenticatedVercelRequest(
			`/v2/deployments/${seg(deploymentId)}/aliases`,
			ctx,
			{ method: 'POST', teamId, body: compactBody(body) },
		);
		// The path also takes hostnames and alias ids; only a dpl_ id is known to
		// be the deployment the alias now points at.
		await saveAlias(
			ctx,
			result,
			deploymentId.startsWith('dpl_') ? deploymentId : undefined,
		);
		return result;
	},
});

export const deleteAlias = defineEndpoint({
	event: 'vercel.aliases.deleteAlias',
	input: In.deleteAlias,
	output: Out.deleteAlias,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{ status?: unknown }>(
			`/v2/aliases/${seg(input.aliasId)}`,
			ctx,
			{ method: 'DELETE', teamId: input.teamId },
		);
		// Alias ids carry no dots and hostnames always do; a hostname's uid isn't
		// known here, so only an id clears the local record.
		if (!input.aliasId.includes('.') && ctx.db.aliases) {
			await ctx.db.aliases.deleteByEntityId(input.aliasId);
		}
		// A non-2xx response throws before this, so reaching here means removed.
		return {
			deleted: true,
			aliasId: input.aliasId,
			status: typeof result?.status === 'string' ? result.status : null,
		};
	},
});
