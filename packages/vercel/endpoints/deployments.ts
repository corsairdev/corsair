import type { VercelQuery } from '../client';
import { makeAuthenticatedVercelRequest, seg } from '../client';
import type { VercelContext } from '../index';
import { compactBody, defineEndpoint, maskCommands, pickQuery } from './common';
import {
	VercelDeploymentsInputSchemas as In,
	VercelDeploymentsOutputSchemas as Out,
} from './deployments-types';

type DeploymentRecord = { uid: string; [key: string]: unknown };

// The local entity types its optional fields as non-null, while live responses
// carry nulls (url while a deployment uploads, target on previews). Dropping
// them keeps the store from rejecting an otherwise good record.
function withoutNulls(record: DeploymentRecord): DeploymentRecord {
	const out: DeploymentRecord = { uid: record.uid };
	for (const [key, value] of Object.entries(record)) {
		if (value !== null) out[key] = value;
	}
	return out;
}

async function saveDeployment(ctx: VercelContext, deployment: unknown) {
	if (!deployment || typeof deployment !== 'object' || !ctx.db.deployments) {
		return;
	}
	// Lists key deployments by `uid`, single reads and writes by `id`.
	const { id, ...rest } = deployment as Record<string, unknown>;
	const uid = typeof rest.uid === 'string' ? rest.uid : id;
	if (typeof uid !== 'string' || !uid) return;
	await ctx.db.deployments.upsertByEntityId(
		uid,
		withoutNulls({ ...rest, uid, created: rest.created ?? rest.createdAt }),
	);
}

/** Vercel's 0/1 query flags from optional booleans. */
function binaryFlags<T extends Record<string, unknown>>(
	input: T,
	keys: readonly (keyof T)[],
): VercelQuery {
	const query: VercelQuery = {};
	for (const key of keys) {
		const value = input[key];
		if (typeof value === 'boolean') query[key as string] = value ? 1 : 0;
	}
	return query;
}

/**
 * Newline-delimited JSON (application/stream+json) into its objects. Blank
 * lines are skipped; any other line that isn't JSON fails the call, since a
 * dropped line would return a silently shortened log.
 */
function parseJsonLines(text: string): unknown[] {
	const events: unknown[] = [];
	let malformed = 0;
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			events.push(JSON.parse(trimmed));
		} catch {
			malformed += 1;
		}
	}
	if (malformed > 0) {
		throw new Error(
			`Vercel returned ${malformed} build-log line(s) that aren't JSON; the log may be cut off. Try again.`,
		);
	}
	return events;
}

export const getDeployments = defineEndpoint({
	event: 'vercel.deployments.getDeployments',
	input: In.getDeployments,
	output: Out.getDeployments,
	run: async (ctx, input) => {
		const query = pickQuery(input, [
			'limit',
			'since',
			'until',
			'projectId',
			'projectIds',
			'app',
			'target',
			'branch',
			'sha',
			'users',
			'rollbackCandidate',
		]);
		// Several states go comma-separated; a repeated state param is a 400.
		if (input.state) query.state = [input.state].flat().join(',');
		const result = await makeAuthenticatedVercelRequest<{
			deployments?: unknown[];
		}>('/v7/deployments', ctx, { teamId: input.teamId, query });
		for (const deployment of result?.deployments ?? []) {
			await saveDeployment(ctx, deployment);
		}
		return result;
	},
});

export const getDeployment = defineEndpoint({
	event: 'vercel.deployments.getDeployment',
	input: In.getDeployment,
	output: Out.getDeployment,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v13/deployments/${seg(input.idOrUrl)}`,
			ctx,
			{ teamId: input.teamId, query: pickQuery(input, ['withGitRepoInfo']) },
		);
		await saveDeployment(ctx, result);
		return result;
	},
});

export const createDeployment = defineEndpoint({
	event: 'vercel.deployments.createDeployment',
	input: In.createDeployment,
	output: Out.createDeployment,
	run: async (ctx, input) => {
		const { teamId, forceNew, skipAutoDetectionConfirmation, ...body } = input;
		const query: VercelQuery = {};
		if (forceNew !== undefined) query.forceNew = forceNew ? '1' : '0';
		if (skipAutoDetectionConfirmation !== undefined) {
			query.skipAutoDetectionConfirmation = skipAutoDetectionConfirmation
				? '1'
				: '0';
		}
		const result = await makeAuthenticatedVercelRequest(
			'/v13/deployments',
			ctx,
			{
				method: 'POST',
				teamId,
				query,
				body: compactBody(body),
			},
		);
		await saveDeployment(ctx, result);
		return result;
	},
	// Inline file contents can hold source and config secrets: log paths only.
	// Build/install commands can carry tokens: log that they were set.
	logInput: ({ files, projectSettings, ...rest }) => ({
		...rest,
		projectSettings: maskCommands(projectSettings),
		files: files?.map((file) =>
			'data' in file
				? { file: file.file, encoding: file.encoding }
				: { file: file.file, sha: file.sha, size: file.size },
		),
	}),
});

export const cancelDeployment = defineEndpoint({
	event: 'vercel.deployments.cancelDeployment',
	input: In.cancelDeployment,
	output: Out.cancelDeployment,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v12/deployments/${seg(input.deploymentId)}/cancel`,
			ctx,
			{ method: 'PATCH', teamId: input.teamId },
		);
		await saveDeployment(ctx, result);
		return result;
	},
});

export const deleteDeployment = defineEndpoint({
	event: 'vercel.deployments.deleteDeployment',
	input: In.deleteDeployment,
	output: Out.deleteDeployment,
	run: async (ctx, input) => {
		// With `url` set Vercel ignores the path id, so the hostname fills it.
		const target = input.deploymentId ?? input.url ?? '';
		const result = await makeAuthenticatedVercelRequest<{ uid?: unknown }>(
			`/v13/deployments/${seg(target)}`,
			ctx,
			{
				method: 'DELETE',
				teamId: input.teamId,
				query: pickQuery(input, ['url']),
			},
		);
		if (typeof result?.uid === 'string' && ctx.db.deployments) {
			await ctx.db.deployments.deleteByEntityId(result.uid);
		}
		return result;
	},
});

export const getDeploymentEvents = defineEndpoint({
	event: 'vercel.deployments.getDeploymentEvents',
	input: In.getDeploymentEvents,
	output: Out.getDeploymentEvents,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<unknown>(
			`/v3/deployments/${seg(input.idOrUrl)}/events`,
			ctx,
			{
				teamId: input.teamId,
				query: {
					...pickQuery(input, [
						'direction',
						'limit',
						'since',
						'until',
						'name',
						'statusCode',
					]),
					...binaryFlags(input, ['builds', 'delimiter']),
					// follow=1 streams new lines until the build ends, so the call
					// would hang; 0 returns what has been logged and closes.
					follow: 0,
				},
			},
		);
		// Core hands back non-JSON bodies as text; the streaming form of this
		// route is newline-delimited JSON.
		return typeof result === 'string' ? parseJsonLines(result) : result;
	},
});

export const getDeploymentFiles = defineEndpoint({
	event: 'vercel.deployments.getDeploymentFiles',
	input: In.getDeploymentFiles,
	output: Out.getDeploymentFiles,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v6/deployments/${seg(input.deploymentId)}/files`,
			ctx,
			{ teamId: input.teamId },
		),
});
