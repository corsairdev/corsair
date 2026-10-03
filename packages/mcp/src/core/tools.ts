import * as vm from 'node:vm';
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

const BLOCKED_KEYS = new Set<PropertyKey>([
	'constructor',
	'prototype',
	'__proto__',
]);

export function harden(value: unknown, thisArg?: unknown): unknown {
	if (value === null || value === undefined) return value;
	const type = typeof value;
	if (type === 'function') {
		return hardenFunction(value as (...args: unknown[]) => unknown, thisArg);
	}
	if (type === 'object') return hardenObject(value as object);
	return value;
}

function hardenObject(target: object): object {
	return new Proxy(target, {
		get(t, key) {
			if (BLOCKED_KEYS.has(key)) return undefined;
			return harden(Reflect.get(t, key, t), t);
		},
		getPrototypeOf: () => null,
		setPrototypeOf: () => false,
		defineProperty: () => false,
		set: () => false,
		deleteProperty: () => false,
	});
}

function hardenFunction(
	target: (...args: unknown[]) => unknown,
	thisArg: unknown,
): (...args: unknown[]) => unknown {
	return new Proxy(target, {
		apply: (fn, _thisArg, args) =>
			hardenResult(Reflect.apply(fn, thisArg, args)),
		construct() {
			throw new Error('Script execution may not construct host objects');
		},
		get(fn, key) {
			if (BLOCKED_KEYS.has(key)) return undefined;
			return harden(Reflect.get(fn, key, fn), fn);
		},
		getPrototypeOf: () => null,
		setPrototypeOf: () => false,
		defineProperty: () => false,
		set: () => false,
		deleteProperty: () => false,
	});
}

function hardenResult(result: unknown): unknown {
	if (
		result !== null &&
		typeof result === 'object' &&
		typeof (result as { then?: unknown }).then === 'function'
	) {
		return Promise.resolve(result as Promise<unknown>).then(
			(value) => harden(value, undefined),
			(error) => {
				throw harden(error, undefined);
			},
		);
	}
	return harden(result, undefined);
}

const MCP_SCRIPT_TIMEOUT_MS = 30_000;

export async function runScriptInSandbox(
	code: string,
	corsair: unknown,
	timeoutMs = MCP_SCRIPT_TIMEOUT_MS,
): Promise<unknown> {
	const sandbox = Object.create(null) as Record<string, unknown>;
	const context = vm.createContext(sandbox, {
		name: 'corsair-mcp-sandbox',
		codeGeneration: { strings: false, wasm: false },
	});

	const wrappedCode = `(async function(corsair) { ${code} })`;
	const script = new vm.Script(wrappedCode, {
		filename: 'corsair:mcp:script',
	});

	const fn = script.runInContext(context, {
		timeout: timeoutMs,
	}) as (c: unknown) => Promise<unknown>;

	const hardenedCorsair = harden(corsair);
	return await fn(hardenedCorsair);
}

export function buildCorsairToolDefs(
	options: BaseMcpOptions,
): CorsairToolDef[] {
	const { corsair, runOptions } = options;

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
				const readonly = runOptions?.readonly || false;
				try {
					const invoke = () =>
						runScriptInSandbox(code as string, corsair);
					// When readonly is required, run the whole script inside a readonly
					// scope that takes precedence over the developer's permission config.
					// Any write/destructive endpoint throws and aborts the script.
					const result = readonly ? await runReadonly(invoke) : await invoke();
					return formatRunScriptResult(result);
				} catch (err) {
					return formatRunScriptError(err);
				}
			},
		},
	];

	return defs;
}

