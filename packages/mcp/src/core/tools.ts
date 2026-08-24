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

export function createScopedCorsairProxy(corsairObj: any): any {
	if (!corsairObj || typeof corsairObj !== 'object') return corsairObj;

	return new Proxy(corsairObj, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);

			if (prop === 'withTenant' && typeof value === 'function') {
				return function (...args: any[]) {
					const tenantClient = value.apply(target, args);
					return createScopedCorsairProxy(tenantClient);
				};
			}

			if (prop === 'manage') {
				if (!value) return value;
				return new Proxy(value, {
					get(manageTarget, manageProp, manageReceiver) {
						const manageValue = Reflect.get(
							manageTarget,
							manageProp,
							manageReceiver,
						);

						if (manageProp === 'tenants') {
							if (!manageValue) return manageValue;
							return new Proxy(manageValue, {
								get(tTarget, tProp, tReceiver) {
									if (tProp === 'create') {
										return function () {
											throw new Error(
												'manage.tenants.create is not available in run_script.',
											);
										};
									}
									return Reflect.get(tTarget, tProp, tReceiver);
								},
							});
						}

						if (manageProp === 'connect') {
							if (!manageValue) return manageValue;
							return new Proxy(manageValue, {
								get(cTarget, cProp, cReceiver) {
									if (cProp === 'createLink') {
										return function () {
											throw new Error(
												'manage.connect.createLink is not available in run_script.',
											);
										};
									}
									if (cProp === 'oauthCallback') {
										return function () {
											throw new Error(
												'manage.connect.oauthCallback is not available in run_script.',
											);
										};
									}
									return Reflect.get(cTarget, cProp, cReceiver);
								},
							});
						}

						return manageValue;
					},
				});
			}

			if (prop === 'permissions') {
				return undefined;
			}

			if (prop === 'keys') {
				return new Proxy(value || {}, {
					get() {
						throw new Error(
							'Credential access (keys) not available in run_script. Use corsair.<plugin>.api.* endpoints instead.',
						);
					},
				});
			}

			if (value && typeof value === 'object') {
				return new Proxy(value, {
					get(pluginTarget, pluginProp, pluginReceiver) {
						const pluginValue = Reflect.get(
							pluginTarget,
							pluginProp,
							pluginReceiver,
						);

						if (pluginProp === 'keys') {
							return new Proxy(pluginValue || {}, {
								get() {
									throw new Error(
										'Credential access (keys) not available in run_script. Use corsair.<plugin>.api.* endpoints instead.',
									);
								},
							});
						}

						if (pluginProp === 'db') {
							if (!pluginValue) return pluginValue;
							return new Proxy(pluginValue, {
								get(dbTarget, dbProp, dbReceiver) {
									const entityValue = Reflect.get(dbTarget, dbProp, dbReceiver);
									if (entityValue && typeof entityValue === 'object') {
										return new Proxy(entityValue, {
											get(eTarget, eProp, eReceiver) {
												const methodValue = Reflect.get(
													eTarget,
													eProp,
													eReceiver,
												);
												if (typeof methodValue === 'function') {
													if (eProp === 'upsertByEntityId') {
														return function (...args: any[]) {
															assertReadonlyAllowed(
																'db.upsertByEntityId',
																'write',
															);
															return methodValue.apply(eTarget, args);
														};
													}
													if (eProp === 'deleteById') {
														return function (...args: any[]) {
															assertReadonlyAllowed('db.deleteById', 'write');
															return methodValue.apply(eTarget, args);
														};
													}
													if (eProp === 'deleteByEntityId') {
														return function (...args: any[]) {
															assertReadonlyAllowed(
																'db.deleteByEntityId',
																'write',
															);
															return methodValue.apply(eTarget, args);
														};
													}
												}
												return methodValue;
											},
										});
									}
									return entityValue;
								},
							});
						}

						return pluginValue;
					},
				});
			}

			return value;
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
