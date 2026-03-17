import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { setupCorsair } from 'corsair';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';

export type CorsairToolDef = {
	name: string;
	description: string;
	shape: z.ZodRawShape;
	handler: (args: Record<string, unknown>) => Promise<CallToolResult>;
};

export function buildCorsairToolDefs(
	options: BaseMcpOptions,
): CorsairToolDef[] {
	const { corsair, permissions, basePermissionUrl } = options;

	const defs: CorsairToolDef[] = [
		{
			name: 'list_operations',
			description:
				"List available Corsair operations. Without options returns all API endpoints across every plugin. Filter by plugin (e.g. 'slack') and/or type ('api' | 'webhooks' | 'db').",
			shape: {
				plugin: z
					.string()
					.optional()
					.describe("Plugin ID to filter by, e.g. 'slack' or 'github'"),
				type: z
					.enum(['api', 'webhooks', 'db'])
					.optional()
					.describe("Operation type: 'api' (default), 'webhooks', or 'db'"),
			},
			handler: async ({ plugin, type }) => {
				const result = corsair.list_operations({
					plugin: plugin as string | undefined,
					type: type as 'api' | 'webhooks' | 'db' | undefined,
				});
				return {
					content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
				};
			},
		},
		{
			name: 'get_schema',
			description:
				"Get the schema and metadata for a Corsair operation path. Accepts API paths ('slack.api.channels.list'), webhook paths ('slack.webhooks.messages.message'), or DB paths ('slack.db.messages.search').",
			shape: {
				path: z
					.string()
					.describe(
						"Full dot-path from list_operations, e.g. 'slack.api.channels.list'",
					),
			},
			handler: async ({ path }) => {
				const result = corsair.get_schema(path as string);
				return {
					content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
				};
			},
		},
		{
			name: 'run_script',
			description:
				'Run a JavaScript script with `corsair` as the only variable in scope. Call Corsair operations, filter or transform the results inline, and return only what you need. The return value becomes the tool output.',
			shape: {
				code: z
					.string()
					.describe(
						'Async JS script with `corsair` in scope. Return the value you want. Example:\nconst result = await corsair.slack.api.channels.list({});\nconst channel = result.channels?.find(c => c.name === "general");\nreturn channel?.id;',
					),
			},
			handler: async ({ code }) => {
				try {
					const fn = new Function(
						'corsair',
						`return (async () => { ${code} })()`,
					);
					const result = await (fn as (c: unknown) => Promise<unknown>)(
						corsair,
					);
					return {
						content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
					};
				} catch (err) {
					const message = err instanceof Error ? err.message : String(err);
					const extra =
						err instanceof Error && err.cause
							? `\nCause: ${String(err.cause)}`
							: '';
					const full = JSON.stringify(err, Object.getOwnPropertyNames(err));
					return {
						isError: true,
						content: [
							{
								type: 'text',
								text: `Error running snippet: ${message}${extra}\n${full}`,
							},
						],
					};
				}
			},
		},
		{
			name: 'corsair_setup',
			description:
				'Helps the user configure Corsair. Call this to see if any keys or tokens need to be set up. It will also provide the instructions to set them up.',
			shape: {},
			handler: async () => {
				try {
					if (Object.keys(corsair).includes('withTenant')) {
						throw new Error(
							'Cannot setup Corsair if it multiTenancy is enabled.',
						);
					}

					const text = await setupCorsair(
						corsair as Parameters<typeof setupCorsair>[0],
					);
					return {
						content: [
							{ type: 'text', text: text || 'Corsair setup complete.' },
						],
					};
				} catch (err) {
					const message = err instanceof Error ? err.message : String(err);
					return {
						isError: true,
						content: [{ type: 'text', text: `Setup failed: ${message}` }],
					};
				}
			},
		},
	];

	if (permissions && basePermissionUrl) {
		defs.push({
			name: 'request_permission',
			description:
				'Request permission from the user to execute a protected endpoint. Call this when a script returns a [PERMISSION_REQUIRED] message. Returns an approval URL. After calling this, call ask_human with the approval URL so the user can review and approve.',
			shape: {
				endpoint: z
					.string()
					.describe(
						'Full endpoint path from the PERMISSION_REQUIRED message, e.g. "slack.messages.post"',
					),
				args: z
					.record(z.unknown())
					.describe(
						'The arguments object from the PERMISSION_REQUIRED message',
					),
				description: z
					.string()
					.describe(
						'Short human-readable summary of what this action will do, e.g. "Post a message to #general in Slack"',
					),
				jid: z
					.string()
					.optional()
					.describe(
						'Optional chat/conversation ID for resuming after approval',
					),
			},
			handler: async ({ endpoint, args, description }) => {
				const { permissionId, approvalUrl } =
					await permissions.createPermissionRequest({
						endpoint: endpoint as string,
						args: args as Record<string, unknown>,
						description: description as string,
					});
				const result = {
					permissionId,
					approvalUrl,
					message: `Permission request created. Ask the user to approve at: ${approvalUrl}`,
				};
				return {
					content: [{ type: 'text', text: JSON.stringify(result) }],
				};
			},
		});
	}

	return defs;
}
