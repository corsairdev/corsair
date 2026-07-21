import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { AnyCorsairInstance } from 'corsair';
import { listOperations, setupCorsair } from 'corsair';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';
import { formatGetSchemaResponse } from './schema-format.js';

export type CorsairToolDef = {
	name: string;
	description: string;
	shape: z.ZodRawShape;
	handler: (args: Record<string, unknown>) => Promise<CallToolResult>;
};

export function buildCorsairToolDefs(
	options: BaseMcpOptions,
): CorsairToolDef[] {
	const { corsair } = options;

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
				const result = listOperations(corsair as AnyCorsairInstance, {
					plugin: plugin as string | undefined,
					type: type as 'api' | 'webhooks' | 'db' | undefined,
				});
				return {
					content: [{ type: 'text', text: result }],
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
				const result = formatGetSchemaResponse(
					corsair as AnyCorsairInstance,
					path as string,
				);
				return {
					content: [{ type: 'text', text: result }],
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
						content: [
							{
								type: 'text',
								text: JSON.stringify(result ?? null, null, 2),
							},
						],
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
	];

	return defs;
}
