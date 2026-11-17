import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import { appName, secret } from './schemas';

const secretName = z
	.string()
	.regex(/^[A-Za-z0-9_]+$/, 'Letters, digits and underscores only')
	.describe('Secret name');
const minVersion = z
	.string()
	.min(1)
	.optional()
	.describe('Read at least this secrets version (from a set or delete)');
const secretPath = (app_name: string, name: string) =>
	`/v1/apps/${seg(app_name)}/secrets/${seg(name)}`;
const RESTART_NOTE =
	'Running Machines keep the old values until they are updated with min_secrets_version set to the returned version.';

export const secrets = {
	list: defineOperation({
		description: "List an app's secrets: names and digests, never values",
		riskLevel: 'read',
		input: z.object({ app_name: appName, min_version: minVersion }),
		output: z.object({ secrets: z.array(secret) }),
		request: ({ app_name, min_version }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}/secrets`,
			query: { min_version },
		}),
	}),
	get: defineOperation({
		description: "Get one secret's name and digest (not its value)",
		riskLevel: 'read',
		input: z.object({
			app_name: appName,
			name: secretName,
			min_version: minVersion,
		}),
		output: secret,
		request: ({ app_name, name, min_version }) => ({
			method: 'GET',
			path: secretPath(app_name, name),
			query: { min_version },
		}),
	}),
	set: defineOperation({
		description: `Create or overwrite one secret. An overwritten value cannot be recovered. ${RESTART_NOTE}`,
		riskLevel: 'destructive',
		input: z.object({ app_name: appName, name: secretName, value: z.string() }),
		output: secret.extend({ version: z.number().int().nullish() }),
		request: ({ app_name, name, value }) => ({
			method: 'POST',
			path: secretPath(app_name, name),
			body: { value },
		}),
	}),
	update: defineOperation({
		description: `Set and delete several secrets at once: a string sets one, null deletes it. ${RESTART_NOTE}`,
		riskLevel: 'destructive',
		input: z.object({
			app_name: appName,
			values: z
				.record(secretName, z.string().nullable())
				.refine(
					(value) => Object.keys(value).length > 0,
					'Give at least one secret',
				),
		}),
		output: z.object({
			secrets: z.array(secret).nullish(),
			version: z.number().int().nullish(),
		}),
		request: ({ app_name, values }) => ({
			method: 'POST',
			path: `/v1/apps/${seg(app_name)}/secrets`,
			body: { values },
		}),
	}),
	delete: defineOperation({
		description: `Delete one secret. ${RESTART_NOTE}`,
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({ app_name: appName, name: secretName }),
		output: z.object({ version: z.number().int().nullish() }),
		request: ({ app_name, name }) => ({
			method: 'DELETE',
			path: secretPath(app_name, name),
		}),
	}),
};
