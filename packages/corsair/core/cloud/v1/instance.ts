import type { CloudList, ListQuery, RequestOptions, V1Transport } from './http';
import { queryString, refPath, v1Request } from './http';
import type {
	AuthType,
	CloudAccess,
	CloudConnection,
	CloudConnectSession,
	CloudDeleted,
	CloudDelivery,
	CloudIntegration,
	CloudOauthApp,
	CloudSigningSecret,
	CloudSigningSecretRotation,
	CloudTenant,
	CloudWebhook,
	Permission,
	PermissionDecision,
	PermissionMode,
} from './types';

export type CreateTenantInput = {
	/** `[A-Za-z0-9._:~@+-]`, 1-128 characters. No `/`. */
	tenant_id: string;
	email?: string;
	/** A display name for the console. */
	label?: string;
};

export type UpdateTenantInput = {
	email?: string;
	label?: string;
};

export type SetAccessInput = {
	permission: Permission;
	label?: string;
	/** Stored on the tenant, so it changes every line that tenant holds. */
	email?: string;
};

export type CreateConnectSessionInput = {
	tenant: string;
	/** Which integrations to authorize. Omit for all of the instance's. */
	integrations?: string[];
	/** Where to send the tenant once they finish. */
	delivery_url?: string;
};

export type PutIntegrationInput = {
	auth_type?: AuthType;
	/** How far an agent may go, and per-operation exceptions. */
	permissions?: {
		mode: PermissionMode;
		overrides?: Record<string, PermissionDecision>;
	};
	/** Write-only. Omit to leave the stored credentials in place. */
	credentials?: Record<string, string>;
};

export type PutOauthAppInput = {
	client_id: string;
	/** Write-only. Never read back. */
	client_secret: string;
	/** Space-separated scopes to request. */
	scopes?: string;
	app_install_slug?: string;
};

export type CreateWebhookInput = {
	integration: string;
	/** The provider's own signing secret, so inbound deliveries can be
	 *  verified. Write-only. Unrelated to the instance signing secret. */
	signing_secret?: string;
};

const SLUG = /^[a-z][a-z0-9-]*$/;

/** One instance: its tenants, access lines, connections, integrations and
 *  webhooks. The REST surface addresses these by composite ref
 *  (`<instance>:<tenant>`); this assembles them, so callers pass the tail. */
export function buildInstancePlane(
	transport: V1Transport,
	instanceKey: string,
) {
	if (!SLUG.test(instanceKey)) {
		throw new Error(
			`withInstance("${instanceKey}"): an instance key is a lowercase slug matching ${SLUG.source}`,
		);
	}

	const req = <T>(
		method: string,
		path: string,
		body?: unknown,
		options?: RequestOptions,
	) => v1Request<T>(transport, method, path, body, options);

	const ref = (...tail: string[]) => [instanceKey, ...tail].join(':');
	const scoped = (query: Record<string, string | number | undefined>) =>
		queryString({ ...query, instance: instanceKey });
	const instancePath = (suffix: string) =>
		`${refPath('/instances', instanceKey)}${suffix}`;

	const deliveries = (plugin: string) =>
		`${refPath('/webhooks', ref(plugin))}/deliveries`;

	return {
		instanceKey,

		tenants: {
			/** Every tenant on this instance. */
			list: (query: ListQuery = {}) =>
				req<CloudList<CloudTenant>>('GET', `/tenants${scoped(query)}`),
			/** Fails with `resource_conflict` if the tenant already exists here. */
			create: (input: CreateTenantInput) =>
				req<CloudTenant>('POST', '/tenants', {
					...input,
					instance: instanceKey,
				}),
			get: (tenant: string) =>
				req<CloudTenant>('GET', refPath('/tenants', ref(tenant))),
			update: (tenant: string, input: UpdateTenantInput) =>
				req<CloudTenant>('PATCH', refPath('/tenants', ref(tenant)), input),
			/** Drops the tenant and its stored credentials. `synced: false` means
			 *  the deployed runtime has not caught up; reconcile the instance. */
			delete: (tenant: string) =>
				req<CloudDeleted<{ synced: boolean }>>(
					'DELETE',
					refPath('/tenants', ref(tenant)),
				),
		},

		/** What a tenant may reach through MCP. A link can name a line but never
		 *  create one, so this is the only way to grant reach. */
		access: {
			list: (query: ListQuery = {}) =>
				req<CloudList<CloudAccess>>('GET', `/access${scoped(query)}`),
			get: (tenant: string) =>
				req<CloudAccess>('GET', refPath('/access', ref(tenant))),
			/** Grants or changes a line. Lowering a permission narrows reach, so
			 *  check `synced` before treating the narrowing as in force. */
			set: (tenant: string, input: SetAccessInput) =>
				req<CloudAccess & { synced: boolean }>(
					'PUT',
					refPath('/access', ref(tenant)),
					input,
				),
			revoke: (tenant: string) =>
				req<CloudDeleted<{ synced: boolean }>>(
					'DELETE',
					refPath('/access', ref(tenant)),
				),
		},

		connections: {
			list: (
				query: ListQuery & { tenant?: string; integration?: string } = {},
			) =>
				req<CloudList<CloudConnection>>('GET', `/connections${scoped(query)}`),
			get: (integration: string, tenant: string) =>
				req<CloudConnection>(
					'GET',
					refPath('/connections', ref(integration, tenant)),
				),
			/** Drops the stored credential. The grant at the provider stands;
			 *  revoke it there too if you need it gone. */
			delete: (integration: string, tenant: string) =>
				req<CloudDeleted<{ revoked_upstream: false }>>(
					'DELETE',
					refPath('/connections', ref(integration, tenant)),
				),
		},

		connect: {
			/** Mints a one-time URL the tenant opens to authorize integrations. */
			createSession: (
				input: CreateConnectSessionInput,
				options?: RequestOptions,
			) =>
				req<CloudConnectSession>(
					'POST',
					'/connect/sessions',
					{ ...input, instance: instanceKey },
					options,
				),
		},

		integrations: {
			/** Every integration configured on this instance. */
			list: (query: ListQuery = {}) =>
				req<CloudList<CloudIntegration>>(
					'GET',
					`/integrations${scoped(query)}`,
				),
			get: (integration: string) =>
				req<CloudIntegration>(
					'GET',
					refPath('/integrations', ref(integration)),
				),
			/** Adds the integration, or reconfigures it in place. */
			put: (integration: string, input: PutIntegrationInput) =>
				req<CloudIntegration>(
					'PUT',
					refPath('/integrations', ref(integration)),
					input,
				),
			delete: (integration: string) =>
				req<CloudDeleted>('DELETE', refPath('/integrations', ref(integration))),
			/** Your own OAuth app for this integration, in place of Corsair's. */
			oauthApp: {
				get: (integration: string) =>
					req<CloudOauthApp>(
						'GET',
						`${refPath('/integrations', ref(integration))}/oauth-app`,
					),
				put: (integration: string, input: PutOauthAppInput) =>
					req<CloudOauthApp>(
						'PUT',
						`${refPath('/integrations', ref(integration))}/oauth-app`,
						input,
					),
			},
		},

		/** Inbound provider webhooks: one endpoint per integration. */
		webhooks: {
			list: (query: ListQuery = {}) =>
				req<CloudList<CloudWebhook>>('GET', `/webhooks${scoped(query)}`),
			/** Idempotent by integration: a repeat returns the existing endpoint,
			 *  and writes `signing_secret` if one is supplied. */
			create: (input: CreateWebhookInput) =>
				req<CloudWebhook>('POST', '/webhooks', {
					...input,
					instance: instanceKey,
				}),
			get: (integration: string) =>
				req<CloudWebhook>('GET', refPath('/webhooks', ref(integration))),
			/** Removes the endpoint here. The provider keeps posting until you
			 *  unsubscribe it there as well. */
			delete: (integration: string) =>
				req<CloudDeleted<{ provider_still_sending: true }>>(
					'DELETE',
					refPath('/webhooks', ref(integration)),
				),
			/** Replaces the provider's signing secret held for this endpoint. */
			rotateSecret: (integration: string, signingSecret: string) =>
				req<CloudWebhook>(
					'POST',
					`${refPath('/webhooks', ref(integration))}/rotate-secret`,
					{ signing_secret: signingSecret },
				),
			/** The log of what this endpoint received. */
			deliveries: {
				list: (
					integration: string,
					query: ListQuery & { tenant?: string } = {},
				) =>
					req<CloudList<CloudDelivery>>(
						'GET',
						`${deliveries(integration)}${queryString(query)}`,
					),
				get: (integration: string, deliveryId: string) =>
					req<CloudDelivery>(
						'GET',
						refPath(deliveries(integration), deliveryId),
					),
				/** Re-posts the stored event to the instance's current delivery
				 *  target. Answers 502 if that POST fails. */
				retry: (integration: string, deliveryId: string) =>
					req<{
						object: 'delivery_retry';
						id: string;
						delivered: true;
						error: null;
					}>('POST', `${refPath(deliveries(integration), deliveryId)}/retry`),
			},
		},

		/** The HMAC key hub signs its deliveries to this instance with. The
		 *  hosted runtime verifies them itself; read this only when your own
		 *  process is the delivery target. */
		signingSecret: {
			get: () =>
				req<CloudSigningSecret>('GET', instancePath('/signing-secret')),
			/** Hard cutover. Open connect and permission sessions signed with the
			 *  old secret die; `invalidated` counts them. */
			rotate: (options?: RequestOptions) =>
				req<CloudSigningSecretRotation>(
					'POST',
					instancePath('/signing-secret/rotate'),
					undefined,
					options,
				),
		},

		/** Pushes the stored config, plugins, keys and memberships into the
		 *  deployed runtime again. */
		reconcile: () =>
			req<{ object: 'instance_reconcile'; id: string; instance: string }>(
				'POST',
				instancePath('/reconcile'),
			),
	};
}

export type CloudInstancePlane = ReturnType<typeof buildInstancePlane>;
