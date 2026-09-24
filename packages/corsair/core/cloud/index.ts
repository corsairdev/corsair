import type { HubConfigInput } from '../../hub';
import type {
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from '../client';
import type { CorsairManageNamespace } from '../management';
import type { CorsairIntegration, CorsairPlugin } from '../plugins';
import { buildCloudClient } from './client';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';
import { buildCloudManagement } from './manage';
import { assertCloudUrlSecure, cloudUrlFromKey } from './url';

const CLOUD_SINGLE_TENANT_ID = 'default';

function deferredCloudError(name: string): never {
	throw new Error(`"${name}" is not available in cloud mode (deferred)`);
}

function resolveCloudBaseUrl(hub: HubConfigInput | undefined): string {
	const baseUrl = hub?.baseUrl?.trim() || process.env.CORSAIR_CLOUD_URL?.trim();
	if (!baseUrl) {
		throw new Error(
			'Cloud mode (ck_cloud_ key) requires a base URL — set hub.baseUrl or CORSAIR_CLOUD_URL.',
		);
	}
	assertCloudUrlSecure(baseUrl);
	return baseUrl;
}

// A ck_cloud_ key alone isn't enough to enter cloud-client mode: the hosted
// runtime itself holds one (it's the cloud VM) but never sets a base URL. A
// real cloud client always has somewhere to call.
export function hasCloudBaseUrl(hub: HubConfigInput | undefined): boolean {
	return !!(hub?.baseUrl?.trim() || process.env.CORSAIR_CLOUD_URL?.trim());
}

// The cloud manage namespace covers what the VM's HTTP surface exposes today
// (tenants, connectionStatus, permissions.get, connect.createLink, disconnect).
// The rest of CorsairManageNamespace is cast in, not implemented: plugins.list,
// connect.resolve/oauthCallback stay a deferred track.
function buildCloudManageNamespace(
	transport: CloudTransport,
	multiTenancy: boolean,
): CorsairManageNamespace {
	const cloud = buildCloudManagement(transport);
	return {
		ok: () => deferredCloudError('manage.ok'),
		tenants: cloud.tenants,
		plugins: {
			list: () => deferredCloudError('manage.plugins.list'),
			get: () => deferredCloudError('manage.plugins.get'),
		},
		connectionStatus: {
			get: (query?: { tenantId?: string }) => {
				const tenantId = query?.tenantId || undefined;
				if (!tenantId && multiTenancy) {
					throw new Error(
						'connectionStatus.get requires a tenantId in multi-tenant mode',
					);
				}
				return cloud.connectionStatus.get({
					tenantId: tenantId ?? CLOUD_SINGLE_TENANT_ID,
				});
			},
		},
		permissions: cloud.permissions,
		connect: {
			createLink: cloud.connect.createLink,
			resolve: () => deferredCloudError('manage.connect.resolve'),
			oauthCallback: () => deferredCloudError('manage.connect.oauthCallback'),
		},
		disconnect: cloud.disconnect,
	} as unknown as CorsairManageNamespace;
}

// Assemble the cloud surface over a resolved transport. `plugins` is optional:
// present keeps the typed client (createCorsair auto-detect), absent gives the
// dynamic client (corsairCloud). keys/permissions are local-only concepts,
// deferred in cloud mode.
function buildCloudSurface<Plugins extends readonly CorsairPlugin[]>(
	transport: CloudTransport,
	opts: { multiTenancy: boolean; plugins?: Plugins },
): CorsairSingleTenantClient<Plugins> | CorsairTenantWrapper<Plugins> {
	const manage = buildCloudManageNamespace(transport, opts.multiTenancy);

	if (opts.multiTenancy) {
		return {
			withTenant: (tenantId: string) => {
				if (!tenantId) {
					throw new Error(
						'corsair.withTenant(tenantId): tenantId must be a non-empty string',
					);
				}
				return buildCloudClient(opts.plugins, { transport, tenantId });
			},
			get keys(): never {
				return deferredCloudError('keys');
			},
			get permissions(): never {
				return deferredCloudError('permissions');
			},
			manage,
		};
	}

	const client = buildCloudClient(opts.plugins, {
		transport,
		tenantId: CLOUD_SINGLE_TENANT_ID,
	});

	// `client` is a Proxy whose own keys are empty — Object.assign would flatten
	// it to nothing, so overlay `manage`/`keys`/`permissions` via a forwarding
	// Proxy instead of copying properties.
	const overlay: Record<string, unknown> = {
		manage,
		get keys(): never {
			return deferredCloudError('keys');
		},
		get permissions(): never {
			return deferredCloudError('permissions');
		},
	};
	const singleTenant = new Proxy(client as object, {
		get(target, prop, receiver) {
			if (typeof prop === 'string' && prop in overlay) {
				return Reflect.get(overlay, prop, receiver);
			}
			return Reflect.get(target, prop, receiver);
		},
	});
	return singleTenant as unknown as CorsairSingleTenantClient<Plugins>;
}

/**
 * `createCorsair` for a `ck_cloud_` key: every plugin call is an HTTP request
 * to the Corsair Cloud VM instead of running in-process.
 */
export function buildCloudCorsair<Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins>,
): CorsairSingleTenantClient<Plugins> | CorsairTenantWrapper<Plugins> {
	return buildCloudSurface(
		{
			baseUrl: resolveCloudBaseUrl(config.hub),
			apiKey: config.hub!.projectApiKey,
		},
		{ multiTenancy: !!config.multiTenancy, plugins: config.plugins },
	);
}

export type CorsairCloudConfig = {
	/** The `ck_cloud_<slug>.<secret>` project key, sent as the bearer token. The
	 * base URL is resolved from its slug, so this is the whole prod contract. */
	apiKey: string;
	/** Internal override (dev/testing). Prod resolves the URL from the key. */
	url?: string;
	/** Reserved for future connect/callback signing; unused by the HTTP client. */
	signingSecret?: string;
	fetch?: typeof fetch;
};

// Empty by design: the declaration-merge target the generated types fill.
export interface CorsairCloudRegistry {}

// Ops surface per tenant. The plugin set lives on the VM, so this is dynamic by
// default. Populate CorsairCloudRegistry (plugin id → its api ops type) — via a
// generated `corsair-env.d.ts` from the CLI, or an inline generic — and the same
// call is fully typed, no plugin list passed at runtime. Until then it is `any`
// (not an index signature, which noUncheckedIndexedAccess would make undefined).
type CloudTenantClient<Registry> = [keyof Registry] extends [never]
	? any
	: { [K in keyof Registry]: { api: Registry[K] } };

// `<projectBase>/api/corsair` (the per-op transport root) and
// `<projectBase>/instances` (the resolve endpoint) are siblings under the same
// project host — strip the former's suffix to get the shared root.
function projectRootFromBaseUrl(baseUrl: string): string {
	const suffix = '/api/corsair';
	return baseUrl.endsWith(suffix) ? baseUrl.slice(0, -suffix.length) : baseUrl;
}

type ResolvedInstance = { instanceKey: string; url: string };

async function fetchInstanceMap(
	transport: CloudTransport,
): Promise<Map<string, string>> {
	const res = await cloudRequest<{ instances: ResolvedInstance[] }>(
		{ ...transport, baseUrl: projectRootFromBaseUrl(transport.baseUrl) },
		'GET',
		'instances',
	);
	const map = new Map<string, string>();
	for (const instance of res.instances) {
		assertCloudUrlSecure(
			instance.url,
			`Instance "${instance.instanceKey}" URL`,
		);
		map.set(instance.instanceKey, instance.url);
	}
	return map;
}

export type CorsairCloudInstance<Registry = CorsairCloudRegistry> = {
	withInstance(name: string): {
		withTenant(tenantId: string): CloudTenantClient<Registry>;
	};
	manage: CorsairManageNamespace;
};

/**
 * Dedicated cloud surface: no plugin list, no kek/db, multi-tenant by default.
 * Dynamic at runtime — `corsair.withInstance(name).withTenant(t).<plugin>.api.<op>(args)`
 * is an HTTP call. There is no implicit default instance: every call names one, so
 * adding a second instance never silently reroutes existing code. Types come from
 * CorsairCloudRegistry (generated by the CLI) or an inline generic, so editor
 * autocomplete works without importing plugins.
 */
export function corsairCloud<Registry = CorsairCloudRegistry>(
	config: CorsairCloudConfig,
): CorsairCloudInstance<Registry> {
	const trimmedKey = config.apiKey?.trim();
	if (!trimmedKey) {
		throw new Error('corsairCloud: apiKey is required');
	}
	const baseUrl = config.url?.trim() || cloudUrlFromKey(trimmedKey);
	if (!baseUrl) {
		throw new Error(
			'corsairCloud: could not resolve a URL from apiKey — pass a ck_cloud_<slug>.<secret> key, or set `url` explicitly.',
		);
	}
	assertCloudUrlSecure(baseUrl);
	const transport: CloudTransport = {
		baseUrl,
		apiKey: trimmedKey,
		fetch: config.fetch,
	};

	// One resolve call per corsairCloud() instance, shared across every
	// withInstance() and cached for its lifetime — concurrent callers await the
	// same in-flight promise instead of firing duplicate requests.
	let instancesPromise: Promise<Map<string, string>> | null = null;
	function resolveInstances(): Promise<Map<string, string>> {
		if (!instancesPromise) {
			instancesPromise = fetchInstanceMap(transport).catch((err) => {
				instancesPromise = null;
				throw err;
			});
		}
		return instancesPromise;
	}

	return {
		manage: buildCloudManageNamespace(transport, true),
		withInstance: (name: string) => {
			const getTransport = async (): Promise<CloudTransport> => {
				const instances = await resolveInstances();
				const url = instances.get(name);
				if (!url) {
					const available = [...instances.keys()].join(', ') || '(none)';
					throw new Error(
						`corsairCloud.withInstance("${name}"): no such instance — available: ${available}`,
					);
				}
				return { ...transport, baseUrl: url };
			};
			return {
				withTenant(tenantId: string) {
					if (!tenantId) {
						throw new Error(
							'corsair.withTenant(tenantId): tenantId must be a non-empty string',
						);
					}
					return buildCloudClient(undefined, {
						transport: getTransport,
						tenantId,
					}) as CloudTenantClient<Registry>;
				},
			};
		},
	};
}
