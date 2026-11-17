import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import { app, appName, orgSlug } from './schemas';

export const apps = {
	list: defineOperation({
		description:
			'List the apps in an organization. Pass limit to page through results with next_cursor.',
		riskLevel: 'read',
		input: z.object({
			org_slug: orgSlug,
			app_role: z
				.string()
				.min(1)
				.optional()
				.describe('Only apps with this role'),
			limit: z.number().int().min(1).max(5000).optional(),
			cursor: z
				.string()
				.min(1)
				.optional()
				.describe('next_cursor from the previous page; requires limit'),
		}),
		output: z.object({
			apps: z.array(app),
			next_cursor: z.string().nullish(),
			total_apps: z.number().int().nullish(),
		}),
		request: (args) => ({ method: 'GET', path: '/v1/apps', query: args }),
	}),
	create: defineOperation({
		description:
			'Create an app in an organization. The app costs nothing until it has Machines or volumes.',
		riskLevel: 'write',
		input: z.object({
			name: z.string().min(1).describe('Globally unique app name'),
			org_slug: orgSlug,
			network: z
				.string()
				.min(1)
				.optional()
				.describe(
					'Private network to attach the app to; defaults to the org default',
				),
			enable_subdomains: z.boolean().optional(),
			idempotency_key: z
				.string()
				.min(1)
				.optional()
				.describe('Makes a retry of the same create return the same app'),
		}),
		output: z.object({
			/** The app's ID (not its name, whatever the spec says), as Get App returns it. */
			id: z.string(),
			created_at: z.number().int().nullish(),
		}),
		request: (args) => ({ method: 'POST', path: '/v1/apps', body: args }),
	}),
	get: defineOperation({
		description: 'Get an app by name',
		riskLevel: 'read',
		input: z.object({ app_name: appName }),
		output: app,
		request: ({ app_name }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}`,
		}),
	}),
	delete: defineOperation({
		description:
			'Permanently delete an app with its Machines, volumes, secrets, certificates and IP addresses',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({ app_name: appName }),
		// Fly answers 202 with no body once it has accepted the delete.
		output: z.object({ app_name: z.string(), accepted: z.literal(true) }),
		request: ({ app_name }) => ({
			method: 'DELETE',
			path: `/v1/apps/${seg(app_name)}`,
		}),
		transform: (_body, { app_name }) => ({ app_name, accepted: true }),
	}),
};
