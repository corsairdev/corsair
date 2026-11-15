import { makeAuthenticatedVercelRequest, seg } from '../client';
import type { VercelContext } from '../index';
import { compactBody, defineEndpoint, pickQuery } from './common';
import {
	VercelEnvsInputSchemas as In,
	VercelEnvsOutputSchemas as Out,
} from './envs-types';

type EnvRecord = { id?: unknown; [key: string]: unknown };

// Fields that carry a variable's value: as typed, encrypted or decrypted.
const VALUE_FIELDS = [
	'value',
	'legacyValue',
	'vsmValue',
	'internalContentHint',
];

// Fields the local store types as non-null.
const STRICT_FIELDS = ['key', 'type', 'createdAt', 'updatedAt'];

function withoutValue(env: EnvRecord): EnvRecord {
	return Object.fromEntries(
		Object.entries(env).filter(([field]) => !VALUE_FIELDS.includes(field)),
	);
}

function asList(result: unknown): EnvRecord[] {
	if (Array.isArray(result)) return result as EnvRecord[];
	return result && typeof result === 'object' ? [result as EnvRecord] : [];
}

/** Stores a variable's metadata. Its value never reaches the local store. */
async function saveEnv(ctx: VercelContext, env: EnvRecord) {
	if (typeof env.id !== 'string' || !ctx.db.envs) return;
	const { target, ...rest } = withoutValue(env);
	// The store's schema rejects nulls in these and a bare string target.
	const record = Object.fromEntries(
		Object.entries(rest).filter(
			([field, value]) => !(value === null && STRICT_FIELDS.includes(field)),
		),
	);
	await ctx.db.envs.upsertByEntityId(env.id, {
		...record,
		id: env.id,
		target:
			typeof target === 'string'
				? [target]
				: Array.isArray(target)
					? (target as string[])
					: undefined,
	});
}

export const getEnvVariables = defineEndpoint({
	event: 'vercel.envs.getEnvVariables',
	input: In.getEnvVariables,
	output: Out.getEnvVariables,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{ envs?: unknown }>(
			`/v10/projects/${seg(input.idOrName)}/env`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, [
					'gitBranch',
					'customEnvironmentId',
					'customEnvironmentSlug',
					'source',
				]),
			},
		);
		for (const env of asList(result?.envs)) await saveEnv(ctx, env);
		return result;
	},
});

export const getEnvVariable = defineEndpoint({
	event: 'vercel.envs.getEnvVariable',
	input: In.getEnvVariable,
	output: Out.getEnvVariable,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v1/projects/${seg(input.idOrName)}/env/${seg(input.id)}`,
			ctx,
			{ teamId: input.teamId },
		);
		for (const env of asList(result)) await saveEnv(ctx, env);
		return result;
	},
});

export const createEnvVariable = defineEndpoint({
	event: 'vercel.envs.createEnvVariable',
	input: In.createEnvVariable,
	output: Out.createEnvVariable,
	run: async (ctx, input) => {
		const { teamId, idOrName, variables, upsert, ...single } = input;
		const result = await makeAuthenticatedVercelRequest<{ created?: unknown }>(
			`/v10/projects/${seg(idOrName)}/env`,
			ctx,
			{
				method: 'POST',
				teamId,
				query: upsert ? { upsert: 'true' } : {},
				body: variables ?? compactBody(single),
			},
		);
		for (const env of asList(result?.created)) await saveEnv(ctx, env);
		return result;
	},
	logInput: ({ value: _value, variables, ...rest }) => ({
		...rest,
		variables: variables?.map(({ value: _v, ...env }) => env),
	}),
});

export const updateEnvVariable = defineEndpoint({
	event: 'vercel.envs.updateEnvVariable',
	input: In.updateEnvVariable,
	output: Out.updateEnvVariable,
	run: async (ctx, input) => {
		const { teamId, idOrName, id, ...changes } = input;
		const result = await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(idOrName)}/env/${seg(id)}`,
			ctx,
			{ method: 'PATCH', teamId, body: compactBody(changes) },
		);
		for (const env of asList(result)) await saveEnv(ctx, env);
		return result;
	},
	logInput: ({ value: _value, ...rest }) => rest,
});

export const deleteEnvVariable = defineEndpoint({
	event: 'vercel.envs.deleteEnvVariable',
	input: In.deleteEnvVariable,
	output: Out.deleteEnvVariable,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest(
			`/v9/projects/${seg(input.idOrName)}/env/${seg(input.id)}`,
			ctx,
			{
				method: 'DELETE',
				teamId: input.teamId,
				query: pickQuery(input, ['customEnvironmentId']),
			},
		);
		await ctx.db.envs?.deleteByEntityId(input.id);
		// Vercel echoes the removed variable, value included. The caller asked
		// to remove it, not to read it, so the value is left out.
		return {
			deleted: true,
			idOrName: input.idOrName,
			id: input.id,
			removed: asList(result).map(withoutValue),
		};
	},
});
