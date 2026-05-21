import type {
	CorsairClient,
	CorsairInternalConfig,
	CorsairPlugin,
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from './core';
import { CORSAIR_INTERNAL } from './core';
import type { FormFieldSchema, ListOperationsOptions } from './core/inspect';
import {
	getSchema as getSchemaCore,
	getStructuredSchema as getStructuredSchemaCore,
	listOperations as listOperationsCore,
} from './core/inspect';

export type { ListOperationsOptions, FormFieldSchema };

// Deliberately shallow plugin shape for inspect helpers.
type InspectCorsairPlugin = {
	id: CorsairPlugin['id'];
};

/**
 * Any form of Corsair instance:
 * - single-tenant client (`createCorsair({ ... })`)
 * - multi-tenant wrapper (`createCorsair({ multiTenancy: true, ... })`)
 * - tenant-scoped client (`corsair.withTenant("tenant-id")`)
 */
export type AnyCorsairInstance =
	| CorsairSingleTenantClient<readonly InspectCorsairPlugin[]>
	| CorsairTenantWrapper<readonly InspectCorsairPlugin[]>
	| CorsairClient<readonly InspectCorsairPlugin[]>;

function getPlugins(corsair: AnyCorsairInstance): readonly CorsairPlugin[] {
	const internal = (corsair as unknown as Record<symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;
	if (!internal) {
		throw new Error(
			'listOperations / getSchema: invalid corsair instance. Pass the value returned by createCorsair() or corsair.withTenant().',
		);
	}
	return internal.plugins;
}

/**
 * Lists available operations (API endpoints, webhooks, or database entities) for the configured plugins.
 * Returns a newline-separated string with one operation path per line.
 *
 * Accepts single-tenant instances, multi-tenant wrappers, and tenant-scoped clients.
 *
 * @example
 * listOperations(corsair)
 * // "slack.api.channels.list\nslack.api.messages.post\n..."
 *
 * listOperations(corsair, { plugin: 'slack' })
 * // "slack.api.channels.list\nslack.api.messages.post\n..."
 *
 * listOperations(corsair, { plugin: 'slack', type: 'webhooks' })
 * // "slack.webhooks.messages.message\nslack.webhooks.channels.created\n..."
 */
export function listOperations(
	corsair: AnyCorsairInstance,
	options?: ListOperationsOptions,
): string {
	const result = listOperationsCore(getPlugins(corsair), options);
	if (typeof result === 'string') return result;
	if (Array.isArray(result)) return result.join('\n');
	return Object.values(result).flat().join('\n');
}

/**
 * Returns a plain-text TypeScript-style type declaration for a specific operation path.
 *
 * Accepts single-tenant instances, multi-tenant wrappers, and tenant-scoped clients.
 * Casing is ignored — the path is lowercased before lookup.
 * If the path is not found, returns a list of available paths for self-correction.
 *
 * @example
 * getSchema(corsair, 'slack.api.messages.post')
 * // "Post a message to a channel  [write]\n\ninput {\n  channel: string\n  text?: string\n  ..."
 *
 * getSchema(corsair, 'slack.api.invalid')
 * // "Path not found. Available operations:\n  slack: slack.api.channels.list, ..."
 */
export function getSchema(corsair: AnyCorsairInstance, path: string): string {
	return getSchemaCore(getPlugins(corsair), path);
}

/**
 * Returns a machine-readable, JSON-serializable form schema for a given operation path.
 * Unlike {@link getSchema} (which returns a TypeScript-style string), this returns
 * structured field definitions suitable for driving dynamic form UIs.
 *
 * Returns `null` if the path does not resolve to a known endpoint.
 */
export function getStructuredSchema(
	corsair: AnyCorsairInstance,
	path: string,
): {
	input: FormFieldSchema | null;
	output: FormFieldSchema | null;
	description?: string;
} | null {
	return getStructuredSchemaCore(getPlugins(corsair), path);
}
