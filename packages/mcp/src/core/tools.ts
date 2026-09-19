import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { AnyCorsairInstance } from 'corsair';
import { listOperations, runReadonly } from 'corsair';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';
import { formatGetSchemaResponse } from './schema-format.js';
import { formatRunScriptError, formatRunScriptResult } from './tool-result.js';

export {
	callToolResultToText,
	formatRunScriptError,
	formatRunScriptResult,
	isActionToolError,
	isAgentFacingActionMessage,
	toolErrorResult,
} from './tool-result.js';

export type CorsairToolDef = {
	name: string;
	description: string;
	shape: z.ZodRawShape;
	handler: (args: Record<string, unknown>) => Promise<CallToolResult>;
};

type Corsair = BaseMcpOptions['corsair'];

// Endpoint results are HTTP-derived JSON, but guard the edge cases (BigInt, a
// circular ref) so serializing a batch can never throw and reject the handler.
function safeJson(value: unknown): string {
	try {
		return JSON.stringify(
			value,
			(_k, v) => (typeof v === 'bigint' ? v.toString() : v),
			2,
		);
	} catch {
		return JSON.stringify(String(value));
	}
}

// Resolve and invoke `corsair[plugin].api.<op>` on the (already tenant-scoped)
// instance. Own-property walk only — never cross a prototype boundary — and the
// method is called on its parent so its bound receiver is preserved. A leading
// "api." (as it appears in list_operations paths) is tolerated.
function callOperation(
	corsair: Corsair,
	plugin: string,
	op: string,
	args: unknown,
): Promise<unknown> {
	const unknown = () => new Error(`unknown operation ${plugin}.${op}`);
	const pluginNs = (corsair as Record<string, unknown>)[plugin];
	const api =
		pluginNs && typeof pluginNs === 'object'
			? (pluginNs as Record<string, unknown>).api
			: undefined;
	const segs = op
		.replace(/^api\./, '')
		.split('.')
		.filter(Boolean);
	if (segs.length === 0) throw unknown();
	let parent: unknown = api;
	for (let i = 0; i < segs.length - 1; i++) {
		const seg = segs[i] as string;
		if (
			!parent ||
			typeof parent !== 'object' ||
			!Object.prototype.hasOwnProperty.call(parent, seg)
		) {
			throw unknown();
		}
		parent = (parent as Record<string, unknown>)[seg];
	}
	const last = segs[segs.length - 1] as string;
	if (
		!parent ||
		typeof parent !== 'object' ||
		!Object.prototype.hasOwnProperty.call(parent, last)
	) {
		throw unknown();
	}
	const fn = (parent as Record<string, unknown>)[last];
	if (typeof fn !== 'function') throw unknown();
	return (fn as (a: unknown) => Promise<unknown>).call(parent, args ?? {});
}

function listOperationsDef(corsair: Corsair): CorsairToolDef {
	return {
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
			return { content: [{ type: 'text', text: result }] };
		},
	};
}

function getSchemaDef(corsair: Corsair): CorsairToolDef {
	return {
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
			return { content: [{ type: 'text', text: result }] };
		},
	};
}

function runScriptDef(
	corsair: Corsair,
	runOptions: BaseMcpOptions['runOptions'],
): CorsairToolDef {
	return {
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
			const readonly = runOptions?.readonly || false;
			try {
				const fn = new Function(
					'corsair',
					`return (async () => { ${code} })()`,
				);
				const invoke = () => (fn as (c: unknown) => Promise<unknown>)(corsair);
				// When readonly is required, run the whole script inside a readonly
				// scope that takes precedence over the developer's permission config.
				// Any write/destructive endpoint throws and aborts the script.
				const result = readonly ? await runReadonly(invoke) : await invoke();
				return formatRunScriptResult(result);
			} catch (err) {
				return formatRunScriptError(err);
			}
		},
	};
}

function callOperationDef(corsair: Corsair): CorsairToolDef {
	return {
		name: 'call_operation',
		description:
			"Run one Corsair operation. `op` is the path under the plugin's api, e.g. 'channels.list' for slack.api.channels.list. Returns the operation result. Use list_operations to discover ops and get_schema for args.",
		shape: {
			plugin: z.string().describe("Plugin ID, e.g. 'slack'"),
			op: z
				.string()
				.describe("Operation path under the plugin api, e.g. 'channels.list'"),
			args: z
				.record(z.string(), z.unknown())
				.optional()
				.describe('Operation arguments object'),
		},
		handler: async ({ plugin, op, args }) => {
			try {
				const data = await callOperation(
					corsair,
					plugin as string,
					op as string,
					args,
				);
				return formatRunScriptResult(data);
			} catch (err) {
				return formatRunScriptError(err);
			}
		},
	};
}

function runBatchDef(corsair: Corsair): CorsairToolDef {
	return {
		name: 'run_batch',
		description:
			'Run several INDEPENDENT operations in one round-trip. Each entry is {plugin, op, args}; they run in order and each returns its own result. Ops cannot reference each other — for a dependent chain (op B needs op A output) call operations one at a time.',
		shape: {
			ops: z
				.array(
					z.object({
						plugin: z.string(),
						op: z.string(),
						args: z.record(z.string(), z.unknown()).optional(),
					}),
				)
				.min(1)
				.describe('Operations to run sequentially'),
		},
		handler: async ({ ops }) => {
			const list = ops as Array<{
				plugin: string;
				op: string;
				args?: Record<string, unknown>;
			}>;
			const results: Array<Record<string, unknown>> = [];
			for (const o of list) {
				try {
					const data = await callOperation(corsair, o.plugin, o.op, o.args);
					results.push({ ok: true, plugin: o.plugin, op: o.op, data });
				} catch (err) {
					results.push({
						ok: false,
						plugin: o.plugin,
						op: o.op,
						error: err instanceof Error ? err.message : String(err),
					});
				}
			}
			return {
				content: [{ type: 'text', text: safeJson(results) }],
			};
		},
	};
}

// Local/self-hosted tool set: includes run_script (arbitrary eval), safe only in
// a developer's own process.
export function buildCorsairToolDefs(
	options: BaseMcpOptions,
): CorsairToolDef[] {
	const { corsair, runOptions } = options;
	return [
		listOperationsDef(corsair),
		getSchemaDef(corsair),
		runScriptDef(corsair, runOptions),
	];
}

// Hosted (multi-tenant, end-user-reachable) tool set: declarative only — no
// run_script eval, which on the shared runtime would expose process.env (KEK,
// signing secret) and has no execution bound. Batching is declarative.
export function buildHostedToolDefs(options: BaseMcpOptions): CorsairToolDef[] {
	const { corsair } = options;
	return [
		listOperationsDef(corsair),
		getSchemaDef(corsair),
		callOperationDef(corsair),
		runBatchDef(corsair),
	];
}
