import type { HubConfigInput } from '../../hub';
import type {
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from '../client';
import type { CorsairManageNamespace } from '../management';
import type { CorsairIntegration, CorsairPlugin } from '../plugins';
import { buildCloudClient } from './client';
import type { CloudTransport } from './http';
import { buildCloudManagement } from './manage';

const CLOUD_SINGLE_TENANT_ID = 'default';

function deferredCloudError(name: string): never {
	throw new Error(`"${name}" is not available in cloud mode (deferred)`);
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

// The stable public host for the hosted free tier. A cloud key carries its
// project slug (ck_cloud_<slug>.<secret>), so the client builds its own base
// URL and the developer passes only the key.
const CLOUD_API_HOST = 'api.corsair.cloud';

// Slug is the segment after the ck_cloud_ prefix up to the first '.'; the secret
// is the remainder. The secret is base64url so it never contains '.', which is
// why the delimiter is unambiguous. Returns null when the key isn't in that
// shape (e.g. an older flat key with no '.'), so the caller can fall back to an
// explicit url or error clearly.
function cloudUrlFromKey(apiKey: string): string | null {
	if (!apiKey.startsWith('ck_cloud_')) return null;
	const rest = apiKey.slice('ck_cloud_'.length);
	const sep = rest.indexOf('.');
	if (sep <= 0) return null;
	const slug = rest.slice(0, sep);
	if (!/^[a-z0-9]+$/.test(slug)) return null;
	return `https://${CLOUD_API_HOST}/${slug}/api/corsair`;
}

// The cloud transport sends the project key as a bearer token (http.ts), so
// http:// would leak it in cleartext — allowed only for loopback, where the
// mock-runtime tests run.
function assertCloudUrlIsSecure(baseUrl: string): void {
	let parsed: URL;
	try {
		parsed = new URL(baseUrl);
	} catch {
		throw new Error(`Cloud base URL is not a valid URL: "${baseUrl}"`);
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			`Cloud base URL must not contain a query or fragment (got "${baseUrl}") — path segments are appended to it.`,
		);
	}
	if (parsed.protocol === 'https:') return;
	if (parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname)) {
		return;
	}
	throw new Error(
		`Cloud mode requires an https:// base URL (got "${baseUrl}") — http:// is only allowed for localhost/127.0.0.1, since the project key is sent as a bearer token.`,
	);
}

function resolveCloudBaseUrl(hub: HubConfigInput | undefined): string {
	const baseUrl = hub?.baseUrl?.trim() || process.env.CORSAIR_CLOUD_URL?.trim();
	if (!baseUrl) {
		throw new Error(
			'Cloud mode (ck_cloud_ key) requires a base URL — set hub.baseUrl or CORSAIR_CLOUD_URL.',
		);
	}
	assertCloudUrlIsSecure(baseUrl);
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

export type CorsairCloudInstance<Registry = CorsairCloudRegistry> = {
	withTenant(tenantId: string): CloudTenantClient<Registry>;
	manage: CorsairManageNamespace;
};

/**
 * Dedicated cloud surface: no plugin list, no kek/db, multi-tenant by default.
 * Dynamic at runtime — `corsair.withTenant(t).<plugin>.api.<op>(args)` is an HTTP
 * call. Types come from CorsairCloudRegistry (generated by the CLI) or an inline
 * generic, so editor autocomplete works without importing plugins.
 */
export function corsairCloud<Registry = CorsairCloudRegistry>(
	config: CorsairCloudConfig,
): CorsairCloudInstance<Registry> {
	const apiKey = config.apiKey?.trim();
	if (!apiKey) {
		throw new Error('corsairCloud: apiKey is required');
	}
	const baseUrl = config.url?.trim() || cloudUrlFromKey(apiKey);
	if (!baseUrl) {
		throw new Error(
			'corsairCloud: could not resolve a URL from apiKey — pass a ck_cloud_<slug>.<secret> key, or set `url` explicitly.',
		);
	}
	assertCloudUrlIsSecure(baseUrl);
	return buildCloudSurface(
		{ baseUrl, apiKey },
		{ multiTenancy: true },
	) as unknown as CorsairCloudInstance<Registry>;
}
