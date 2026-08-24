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

	const isRestrictedProp = (prop: string | symbol) =>
		prop === '__proto__' || prop === 'constructor' || prop === 'prototype';

	const wrapManage = (value: any) => {
		if (!value) return value;
		return new Proxy(value, {
			get(manageTarget, manageProp, manageReceiver) {
				if (isRestrictedProp(manageProp)) return undefined;
				return wrapManageProp(
					Reflect.get(manageTarget, manageProp, manageReceiver),
					manageProp,
					manageTarget,
				);
			},
			getOwnPropertyDescriptor(manageTarget, manageProp) {
				if (isRestrictedProp(manageProp)) return undefined;
				const desc = Reflect.getOwnPropertyDescriptor(manageTarget, manageProp);
				if (desc && 'value' in desc) {
					desc.value = wrapManageProp(desc.value, manageProp, manageTarget);
				}
				return desc;
			},
		});
	};

	const wrapManageProp = (
		manageValue: any,
		manageProp: string | symbol,
		manageTarget: any,
	) => {
		if (manageProp === 'tenants') {
			if (!manageValue) return manageValue;
			return new Proxy(manageValue, {
				get(tTarget, tProp, tReceiver) {
					if (isRestrictedProp(tProp)) return undefined;
					return wrapTenantProp(
						Reflect.get(tTarget, tProp, tReceiver),
						tProp,
						tTarget,
					);
				},
				getOwnPropertyDescriptor(tTarget, tProp) {
					if (isRestrictedProp(tProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(tTarget, tProp);
					if (desc && 'value' in desc) {
						desc.value = wrapTenantProp(desc.value, tProp, tTarget);
					}
					return desc;
				},
			});
		}

		if (manageProp === 'plugins') {
			if (!manageValue) return manageValue;
			return new Proxy(manageValue, {
				get(pTarget, pProp, pReceiver) {
					if (isRestrictedProp(pProp)) return undefined;
					return wrapPluginManagerProp(
						Reflect.get(pTarget, pProp, pReceiver),
						pProp,
						pTarget,
					);
				},
				getOwnPropertyDescriptor(pTarget, pProp) {
					if (isRestrictedProp(pProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(pTarget, pProp);
					if (desc && 'value' in desc) {
						desc.value = wrapPluginManagerProp(desc.value, pProp, pTarget);
					}
					return desc;
				},
			});
		}

		if (manageProp === 'connect') {
			if (!manageValue) return manageValue;
			return new Proxy(manageValue, {
				get(cTarget, cProp, cReceiver) {
					if (isRestrictedProp(cProp)) return undefined;
					return wrapConnectProp(
						Reflect.get(cTarget, cProp, cReceiver),
						cProp,
						cTarget,
					);
				},
				getOwnPropertyDescriptor(cTarget, cProp) {
					if (isRestrictedProp(cProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(cTarget, cProp);
					if (desc && 'value' in desc) {
						desc.value = wrapConnectProp(desc.value, cProp, cTarget);
					}
					return desc;
				},
			});
		}

		if (typeof manageValue === 'function') {
			return function (...args: any[]) {
				return manageValue.apply(manageTarget, args);
			};
		}

		return manageValue;
	};

	const wrapTenantProp = (
		methodValue: any,
		tProp: string | symbol,
		tTarget: any,
	) => {
		if (typeof methodValue === 'function') {
			if (tProp !== 'list' && tProp !== 'get') {
				return function () {
					throw new Error(
						`manage.tenants.${String(tProp)} is not available in run_script.`,
					);
				};
			}
			return function (...args: any[]) {
				return methodValue.apply(tTarget, args);
			};
		}
		return methodValue;
	};

	const wrapPluginManagerProp = (
		methodValue: any,
		pProp: string | symbol,
		pTarget: any,
	) => {
		if (typeof methodValue === 'function') {
			if (pProp !== 'list') {
				return function () {
					throw new Error(
						`manage.plugins.${String(pProp)} is not available in run_script.`,
					);
				};
			}
			return function (...args: any[]) {
				return methodValue.apply(pTarget, args);
			};
		}
		return methodValue;
	};

	const wrapConnectProp = (
		methodValue: any,
		cProp: string | symbol,
		cTarget: any,
	) => {
		if (typeof methodValue === 'function') {
			return function () {
				throw new Error(
					`manage.connect.${String(cProp)} is not available in run_script.`,
				);
			};
		}
		return methodValue;
	};

	const wrapKeys = (value: any) => {
		return new Proxy(value || {}, {
			get() {
				throw new Error(
					'Credential access (keys) not available in run_script. Use corsair.<plugin>.api.* endpoints instead.',
				);
			},
			getOwnPropertyDescriptor() {
				throw new Error(
					'Credential access (keys) not available in run_script. Use corsair.<plugin>.api.* endpoints instead.',
				);
			},
		});
	};

	const wrapPluginProp = (
		pluginValue: any,
		pluginProp: string | symbol,
		pluginTarget: any,
	) => {
		if (pluginProp === 'keys') {
			return wrapKeys(pluginValue);
		}

		if (pluginProp === 'db') {
			if (!pluginValue) return pluginValue;
			return new Proxy(pluginValue, {
				get(dbTarget, dbProp, dbReceiver) {
					if (isRestrictedProp(dbProp)) return undefined;
					return wrapDbProp(
						Reflect.get(dbTarget, dbProp, dbReceiver),
						dbProp,
						dbTarget,
					);
				},
				getOwnPropertyDescriptor(dbTarget, dbProp) {
					if (isRestrictedProp(dbProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(dbTarget, dbProp);
					if (desc && 'value' in desc) {
						desc.value = wrapDbProp(desc.value, dbProp, dbTarget);
					}
					return desc;
				},
			});
		}

		if (typeof pluginValue === 'function') {
			return function (...args: any[]) {
				return pluginValue.apply(pluginTarget, args);
			};
		}

		return pluginValue;
	};

	const wrapDbProp = (
		entityValue: any,
		dbProp: string | symbol,
		dbTarget: any,
	) => {
		if (entityValue && typeof entityValue === 'object') {
			return new Proxy(entityValue, {
				get(eTarget, eProp, eReceiver) {
					if (isRestrictedProp(eProp)) return undefined;
					return wrapEntityMethod(
						Reflect.get(eTarget, eProp, eReceiver),
						eProp,
						eTarget,
					);
				},
				getOwnPropertyDescriptor(eTarget, eProp) {
					if (isRestrictedProp(eProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(eTarget, eProp);
					if (desc && 'value' in desc) {
						desc.value = wrapEntityMethod(desc.value, eProp, eTarget);
					}
					return desc;
				},
			});
		}
		return entityValue;
	};

	const wrapEntityMethod = (
		methodValue: any,
		eProp: string | symbol,
		eTarget: any,
	) => {
		if (typeof methodValue === 'function') {
			const allowedReads = [
				'findByEntityId',
				'existsByEntityId',
				'findIdByEntityId',
				'findById',
				'findManyByEntityIds',
				'list',
				'search',
				'count',
			];
			if (!allowedReads.includes(String(eProp))) {
				return function (...args: any[]) {
					assertReadonlyAllowed(`db.${String(eProp)}`, 'write');
					return methodValue.apply(eTarget, args);
				};
			}
			return function (...args: any[]) {
				return methodValue.apply(eTarget, args);
			};
		}
		return methodValue;
	};

	const wrapProp = (value: any, prop: string | symbol, target: any) => {
		if (prop === 'withTenant' && typeof value === 'function') {
			return function (...args: any[]) {
				const tenantClient = value.apply(target, args);
				return createScopedCorsairProxy(tenantClient);
			};
		}

		if (prop === 'manage') {
			return wrapManage(value);
		}

		if (prop === 'permissions') {
			return undefined;
		}

		if (prop === 'keys') {
			return wrapKeys(value);
		}

		if (value && typeof value === 'object') {
			return new Proxy(value, {
				get(pluginTarget, pluginProp, pluginReceiver) {
					if (isRestrictedProp(pluginProp)) return undefined;
					return wrapPluginProp(
						Reflect.get(pluginTarget, pluginProp, pluginReceiver),
						pluginProp,
						pluginTarget,
					);
				},
				getOwnPropertyDescriptor(pluginTarget, pluginProp) {
					if (isRestrictedProp(pluginProp)) return undefined;
					const desc = Reflect.getOwnPropertyDescriptor(
						pluginTarget,
						pluginProp,
					);
					if (desc && 'value' in desc) {
						desc.value = wrapPluginProp(desc.value, pluginProp, pluginTarget);
					}
					return desc;
				},
			});
		}

		if (typeof value === 'function') {
			return function (...args: any[]) {
				return value.apply(target, args);
			};
		}

		return value;
	};

	return new Proxy(corsairObj, {
		get(target, prop, receiver) {
			if (isRestrictedProp(prop)) return undefined;
			const value = Reflect.get(target, prop, receiver);
			return wrapProp(value, prop, target);
		},
		getOwnPropertyDescriptor(target, prop) {
			if (isRestrictedProp(prop)) return undefined;
			const desc = Reflect.getOwnPropertyDescriptor(target, prop);
			if (desc && 'value' in desc) {
				desc.value = wrapProp(desc.value, prop, target);
			}
			return desc;
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
