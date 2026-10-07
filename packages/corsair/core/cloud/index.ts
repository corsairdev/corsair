import type { HubConfigInput } from '../../hub';
import type {
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from '../client';
import type { CorsairManageNamespace } from '../management';
import type { ConnectLink } from '../management/types';
import type { CorsairIntegration, CorsairPlugin } from '../plugins';
import { buildCloudClient } from './client';
import type { CloudTransport } from './http';
import { cloudRequest, stripTrailingSlashes } from './http';
import type { CreateCloudConnectLinkInput } from './manage';
import { buildCloudManagement } from './manage';
import { buildCloudV1Management } from './management';
import { CLOUD_ROUTES } from './routes';
import {
	assertCloudUrlSecure,
	cloudManagementUrlFromBase,
	cloudManagementUrlFromKey,
	cloudSlugFromKey,
	cloudUrlFromKey,
} from './url';

// Stands in for the v1 client when no management URL could be resolved. A
// proxy rather than a literal of every method: the hand-written version drifted
// behind the real surface, and a missing key there reads as `undefined is not a
// function` instead of saying why management is unreachable.
function unresolvedManagement(): ReturnType<typeof buildCloudV1Management> {
	const node = (path: string[]): unknown => {
		const name = ['manage', ...path].join('.');
		return new Proxy(() => unresolvedManagementError(name), {
			get: (_t, key) => {
				// `then` must stay undefined: resolving it to a node makes this a
				// thenable, so `await corsair.manage` would reject with
				// "manage.then is not available" instead of handing back the object.
				if (typeof key !== 'string' || key === 'then') return undefined;
				return node([...path, key]);
			},
		});
	};
	return node([]) as ReturnType<typeof buildCloudV1Management>;
}

function unresolvedManagementError(name: string): never {
	throw new Error(
		`"${name}" needs a management URL, which could not be resolved from this apiKey — pass a ck_cloud_<slug>.<secret> key, or set \`managementUrl\` explicitly.`,
	);
}

// A ck_cloud_ key alone isn't enough to enter cloud-client mode: the hosted
// runtime itself holds one (it's the cloud VM) but never sets a base URL. A
// real cloud client always has somewhere to call.
export function hasCloudBaseUrl(hub: HubConfigInput | undefined): boolean {
	return !!(hub?.baseUrl?.trim() || process.env.CORSAIR_CLOUD_URL?.trim());
}

export type CorsairCloudConfig = {
	/** The `ck_cloud_<slug>.<secret>` project key, sent as the bearer token. The
	 * base URL is resolved from its slug, so this is the whole prod contract. */
	apiKey: string;
	/** Internal override (dev/testing). Prod resolves the URL from the key. */
	url?: string;
	/** Hub v1 management API base override (dev/testing). Prod derives it from
	 * the key's host (same host as `url`, no slug segment, `/v1`). */
	managementUrl?: string;
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
	// Trim trailing slashes first: a custom url ending "/api/corsair/" must still
	// strip the suffix, else the resolve hits /api/corsair/instances not /instances.
	const trimmed = stripTrailingSlashes(baseUrl);
	const suffix = '/api/corsair';
	return trimmed.endsWith(suffix) ? trimmed.slice(0, -suffix.length) : trimmed;
}

type ResolvedInstance = { instanceKey: string; url: string };

async function fetchInstanceMap(
	transport: CloudTransport,
): Promise<Map<string, string>> {
	const res = await cloudRequest<{ instances: ResolvedInstance[] }>(
		{ ...transport, baseUrl: projectRootFromBaseUrl(transport.baseUrl) },
		'GET',
		CLOUD_ROUTES.instances,
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

// Project-scoped management, served by the hub v1 REST API (management.ts).
// Credential-touching management (connect/status/disconnect) acts on one
// instance's own credential store, so it lives on the instance handle instead.
// `permissions` stays VM-local: it resolves a link token, which only the
// runtime holds.
export type CorsairCloudManage = Pick<CorsairManageNamespace, 'permissions'> &
	ReturnType<typeof buildCloudV1Management>;

// One instance, chosen by name. Per-op calls go through withTenant; the
// credential-touching management ops act on this instance's own credential
// store (each instance is cred-isolated), so they're scoped here, not on manage.
export type CorsairCloudInstanceHandle<Registry = CorsairCloudRegistry> = {
	withTenant(tenantId: string): CloudTenantClient<Registry>;
	connectionStatus: { get(input: { tenantId: string }): Promise<unknown> };
	connect: {
		createLink(input: CreateCloudConnectLinkInput): Promise<ConnectLink>;
	};
	disconnect(input: { tenantId: string; plugin: string }): Promise<unknown>;
};

export type CorsairCloudInstance<Registry = CorsairCloudRegistry> = {
	withInstance(name: string): CorsairCloudInstanceHandle<Registry>;
	manage: CorsairCloudManage;
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

	// Resolved lazily, not required at construction: a key/url combo that can't
	// reach the project (e.g. a bare dev key with a custom `url`) should still
	// build a working client — it just can't resolve v1, so those calls fail
	// only when actually made.
	// Honor a data-plane `url` override for management too, so a local/proxied
	// `url` never leaves management calls silently pointed at prod.
	// The slug always comes from the key, never the overridden url — a custom
	// base moves the host, not which project the key answers for.
	const slug = cloudSlugFromKey(trimmedKey);
	const overriddenUrl = config.url?.trim();
	const managementUrl =
		config.managementUrl?.trim() ||
		(overriddenUrl
			? slug
				? cloudManagementUrlFromBase(overriddenUrl, slug)
				: null
			: cloudManagementUrlFromKey(trimmedKey));
	const v1 = managementUrl
		? (() => {
				assertCloudUrlSecure(managementUrl, 'Cloud management URL');
				return buildCloudV1Management({
					baseUrl: managementUrl,
					apiKey: trimmedKey,
					fetch: config.fetch,
				});
			})()
		: unresolvedManagement();

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

	// Project-level management over the project base. Credential-touching ops
	// are omitted here and exposed per-instance.
	const projectManage = buildCloudManagement(transport);

	return {
		// The control plane, served by the hub. `permissions` is the exception:
		// it resolves a link token, which only the runtime holds.
		manage: {
			permissions: projectManage.permissions,
			project: v1.project,
			keys: v1.keys,
			instances: v1.instances,
			integrations: v1.integrations,
			tenants: v1.tenants,
			connections: v1.connections,
			connect: v1.connect,
			access: v1.access,
			mcp: v1.mcp,
		} as unknown as CorsairCloudManage,
		withInstance: (name: string): CorsairCloudInstanceHandle<Registry> => {
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
			// Management scoped to this instance's own credential store.
			const instanceManage = buildCloudManagement(getTransport);
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
				connectionStatus: instanceManage.connectionStatus,
				connect: instanceManage.connect,
				disconnect: instanceManage.disconnect,
			};
		},
	};
}
