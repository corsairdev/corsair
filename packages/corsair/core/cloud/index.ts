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

function resolveCloudBaseUrl(hub: HubConfigInput | undefined): string {
	const baseUrl = hub?.baseUrl?.trim() || process.env.CORSAIR_CLOUD_URL?.trim();
	if (!baseUrl) {
		throw new Error(
			'Cloud mode (ck_cloud_ key) requires a base URL — set hub.baseUrl or CORSAIR_CLOUD_URL.',
		);
	}
	return baseUrl;
}

// The cloud manage namespace only covers what the VM's HTTP surface exposes
// today (tenants/plugins/connect/disconnect/connectionStatus). The rest of
// CorsairManageNamespace is cast in, not implemented — server-side auth
// review and OAuth callback handling stay a deferred track.
function buildCloudManageNamespace(
	transport: CloudTransport,
): CorsairManageNamespace {
	const cloud = buildCloudManagement(transport);
	return {
		ok: () => deferredCloudError('manage.ok'),
		tenants: cloud.tenants,
		plugins: cloud.plugins,
		connectionStatus: {
			get: (query?: { tenantId?: string }) =>
				cloud.connectionStatus.get({ tenantId: query?.tenantId ?? '' }),
		},
		permissions: {
			get: () => deferredCloudError('manage.permissions'),
		},
		connect: {
			createLink: cloud.connect.createLink,
			resolve: () => deferredCloudError('manage.connect.resolve'),
			oauthCallback: () => deferredCloudError('manage.connect.oauthCallback'),
		},
		disconnect: cloud.disconnect,
	} as unknown as CorsairManageNamespace;
}

/**
 * `createCorsair` for a `ck_cloud_` key: every plugin call is an HTTP request
 * to the Corsair Cloud VM instead of running in-process. `keys`/`permissions`
 * (local DB/KEK concepts) aren't available in cloud mode yet.
 */
export function buildCloudCorsair<Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins>,
): CorsairSingleTenantClient<Plugins> | CorsairTenantWrapper<Plugins> {
	const transport: CloudTransport = {
		baseUrl: resolveCloudBaseUrl(config.hub),
		apiKey: config.hub!.projectApiKey,
	};
	const manage = buildCloudManageNamespace(transport);

	if (config.multiTenancy) {
		return {
			withTenant: (tenantId: string) => {
				if (!tenantId) {
					throw new Error(
						'corsair.withTenant(tenantId): tenantId must be a non-empty string',
					);
				}
				return buildCloudClient(config.plugins, { transport, tenantId });
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

	const client = buildCloudClient(config.plugins, {
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
	// The Proxy handler's `get` widens to `object` (it forwards to two shapes),
	// so it can't infer CorsairSingleTenantClient<Plugins> on its own — one cast
	// still needed here, unlike the tenant-wrapper branch above.
	return singleTenant as unknown as CorsairSingleTenantClient<Plugins>;
}
