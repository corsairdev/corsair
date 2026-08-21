import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { AnyCorsairInstance } from 'corsair';
import { assertReadonlyAllowed, listOperations, runReadonly } from 'corsair';
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

/**
 * Creates a proxy around the Corsair client that hides unguarded namespaces.
 * Blocks access to global `manage`, `keys`, `permissions` and plugin-level `keys`, `db`.
 * Wraps `withTenant` to ensure the returned tenant client is also proxied.
 */
function createScopedCorsairProxy(corsair: any): any {
	if (!corsair || typeof corsair !== 'object') return corsair;

	return new Proxy(corsair, {
		get(target, prop) {
			if (prop === 'permissions') {
				return undefined;
			}

			if (prop === 'manage') {
				const manageVal = target[prop as keyof typeof target];
				if (!manageVal) return manageVal;
				return new Proxy(manageVal as object, {
					get(manageTarget, manageProp) {
						if (manageProp === 'connect') {
							return new Proxy(
								{},
								{
									get(t, connectProp) {
										if (
											connectProp === 'toString' ||
											connectProp === 'valueOf' ||
											connectProp === Symbol.toPrimitive ||
											connectProp === 'toJSON' ||
											connectProp === Symbol.toStringTag
										) {
											return () => `[Blocked connect namespace]`;
										}
										return () => {
											throw new Error(
												'manage.connect is not available in run_script.',
											);
										};
									},
								},
							);
						}
						if (manageProp === 'tenants') {
							const tenantsVal =
								manageTarget[manageProp as keyof typeof manageTarget];
							if (!tenantsVal) return tenantsVal;
							return new Proxy(tenantsVal as object, {
								get(tenantsTarget, tenantsProp) {
									if (tenantsProp === 'create') {
										return () => {
											throw new Error(
												'manage.tenants.create is not available in run_script.',
											);
										};
									}
									return tenantsTarget[
										tenantsProp as keyof typeof tenantsTarget
									];
								},
							});
						}
						return manageTarget[manageProp as keyof typeof manageTarget];
					},
				});
			}

			if (prop === 'withTenant') {
				const original = target[prop as keyof typeof target];
				if (typeof original === 'function') {
					return (tenantId: string) =>
						createScopedCorsairProxy(original.call(target, tenantId));
				}
				return original;
			}

			const val = target[prop as keyof typeof target];

			// Top-level properties that are objects (like plugins) get a nested proxy
			// to block .db writes and .keys
			if (
				typeof prop === 'string' &&
				val &&
				typeof val === 'object' &&
				!Array.isArray(val)
			) {
				return new Proxy(val as object, {
					get(pluginTarget, pluginProp) {
						if (pluginProp === 'keys') {
							return new Proxy(
								{},
								{
									get(t, keyProp) {
										if (
											keyProp === 'toString' ||
											keyProp === 'valueOf' ||
											keyProp === Symbol.toPrimitive ||
											keyProp === 'toJSON' ||
											keyProp === Symbol.toStringTag
										) {
											return () => `[Blocked keys namespace for ${prop}]`;
										}
										throw new Error(
											`Credential access (keys) not available in run_script. Use corsair.${prop}.api.* endpoints instead.`,
										);
									},
								},
							);
						}
						if (pluginProp === 'db') {
							const dbVal =
								pluginTarget[pluginProp as keyof typeof pluginTarget];
							if (!dbVal) return dbVal;
							return new Proxy(dbVal as object, {
								get(dbTarget, entityProp) {
									const entityVal =
										dbTarget[entityProp as keyof typeof dbTarget];
									if (!entityVal) return entityVal;
									return new Proxy(entityVal as object, {
										get(entityTarget, methodProp) {
											if (
												methodProp === 'upsertByEntityId' ||
												methodProp === 'deleteById' ||
												methodProp === 'deleteByEntityId'
											) {
												return (...args: any[]) => {
													assertReadonlyAllowed(
														`db.${methodProp as string}`,
														'write',
													);
													// enforcePermission cannot be called here due to architectural limitations,
													// so granular permissions will not apply to db writes in run_script.
													return (
														entityTarget[
															methodProp as keyof typeof entityTarget
														] as Function
													).apply(entityTarget, args);
												};
											}
											return entityTarget[
												methodProp as keyof typeof entityTarget
											];
										},
									});
								},
							});
						}
						return pluginTarget[pluginProp as keyof typeof pluginTarget];
					},
				});
			}

			return val;
		},
	});
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
					const scopedCorsair = createScopedCorsairProxy(corsair);
					const fn = new Function(
						'corsair',
						`return (async () => { ${code} })()`,
					);
					const invoke = () =>
						(fn as (c: unknown) => Promise<unknown>)(scopedCorsair);
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
