import type { CorsairInternalConfig } from '../index';
import type { CorsairPlugin } from '../plugins';

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

export class InvalidCorsairInstanceError extends Error {
	constructor(message = 'Invalid corsair instance') {
		super(message);
		this.name = 'InvalidCorsairInstanceError';
	}
}

export function isObjectRecord(
	value: unknown,
): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function isCorsairInternalConfig(
	value: unknown,
): value is CorsairInternalConfig {
	if (!isObjectRecord(value)) return false;
	if (!Array.isArray(value.plugins)) return false;
	if (typeof value.kek !== 'string') return false;
	if (typeof value.multiTenancy !== 'boolean') return false;
	if (value.database === undefined) return true;
	if (!isObjectRecord(value.database)) return false;
	const db = value.database.db;
	return (
		typeof db === 'object' &&
		db !== null &&
		typeof (db as { selectFrom?: unknown }).selectFrom === 'function'
	);
}

export function tryGetCorsairInternal(
	corsair: unknown,
): CorsairInternalConfig | undefined {
	if (!corsair || typeof corsair !== 'object') return undefined;

	const descriptor = Object.getOwnPropertyDescriptor(corsair, CORSAIR_INTERNAL);
	const internal = descriptor?.value;

	return isCorsairInternalConfig(internal) ? internal : undefined;
}

export function getCorsairInternal(
	corsair: unknown,
	onInvalid?: () => Error,
): CorsairInternalConfig {
	const internal = tryGetCorsairInternal(corsair);
	if (!internal) {
		throw onInvalid?.() ?? new InvalidCorsairInstanceError();
	}
	return internal;
}

export function findCorsairPlugin(
	internal: CorsairInternalConfig,
	pluginId: string,
): CorsairPlugin | undefined {
	return internal.plugins.find((plugin) => plugin.id === pluginId);
}

export function requireCorsairPlugin<T extends Error>(
	internal: CorsairInternalConfig,
	pluginId: string,
	createError: (message: string) => T,
): CorsairPlugin {
	const plugin = findCorsairPlugin(internal, pluginId);
	if (!plugin) {
		throw createError(`Plugin '${pluginId}' not found`);
	}
	return plugin;
}

export function isMultiTenantInstance(corsair: object): boolean {
	return (
		'withTenant' in corsair &&
		typeof (corsair as { withTenant?: unknown }).withTenant === 'function'
	);
}
