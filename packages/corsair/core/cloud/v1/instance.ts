import type { CloudList, ListQuery, RequestOptions, V1Transport } from './http';
import { assertInstanceKey, queryString, refPath, v1Request } from './http';
import type {
	AuthType,
	CloudAccess,
	CloudConnection,
	CloudConnectSession,
	CloudDeleted,
	CloudDelivery,
	CloudInstanceApply,
	CloudInstanceRemoval,
	CloudIntegration,
	CloudIntegrationOperations,
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
	/** Omit to leave a stored quota alone; `null` on either half clears it. */
	quota?: { limit: number | null; window: string | null };
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

export type RotateWebhookSecretInput = {
	/** Replaces the stored secret; it is not generated. */
	signing_secret: string;
};

export type CreateWebhookInput = {
	integration: string;
	/** The provider's own signing secret, so inbound deliveries can be
	 *  verified. Write-only. Unrelated to the instance signing secret.
	 *  Required for a new endpoint; omit it on a repeat and the stored one
	 *  stands. */
	signing_secret?: string;
};

/** One instance: its tenants, access lines, connections, integrations and
 *  webhooks. The REST surface addresses these by composite ref
 *  (`<instance>:<tenant>`); this assembles them, so callers pass the tail. */
export function buildInstancePlane(
	transport: V1Transport,
	instanceKey: string,
) {
	assertInstanceKey(instanceKey, 'withInstance');

	// `options` is required rather than optional: it sits behind `body`, so a
	// bodyless call that passed neither silently dropped the caller's signal.
	const req = <T>(
		method: string,
		path: string,
		body: unknown,
		options: RequestOptions | undefined,
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
			list: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudTenant>>(
					'GET',
					`/tenants${scoped(query)}`,
					undefined,
					options,
				),
			/** Fails with `resource_conflict` if the tenant already exists here. */
			create: (input: CreateTenantInput, options?: RequestOptions) =>
				req<CloudTenant>(
					'POST',
					'/tenants',
					{ ...input, instance: instanceKey },
					options,
				),
			get: (tenant: string, options?: RequestOptions) =>
				req<CloudTenant>(
					'GET',
					refPath('/tenants', ref(tenant)),
					undefined,
					options,
				),
			update: (
				tenant: string,
				input: UpdateTenantInput,
				options?: RequestOptions,
			) =>
				req<CloudTenant>(
					'PATCH',
					refPath('/tenants', ref(tenant)),
					input,
					options,
				),
			/** Drops the tenant and its stored credentials. `synced: false` means
			 *  the deployed runtime has not caught up; reconcile the instance. */
			delete: (tenant: string, options?: RequestOptions) =>
				req<CloudDeleted<{ synced: boolean }>>(
					'DELETE',
					refPath('/tenants', ref(tenant)),
					undefined,
					options,
				),
		},

		/** What a tenant may reach through MCP. A link can name a line but never
		 *  create one, so this is the only way to grant reach. */
		access: {
			list: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudAccess>>(
					'GET',
					`/access${scoped(query)}`,
					undefined,
					options,
				),
			get: (tenant: string, options?: RequestOptions) =>
				req<CloudAccess>(
					'GET',
					refPath('/access', ref(tenant)),
					undefined,
					options,
				),
			/** Grants or changes a line. Lowering a permission narrows reach, so
			 *  check `synced` before treating the narrowing as in force. */
			set: (tenant: string, input: SetAccessInput, options?: RequestOptions) =>
				req<CloudAccess & { synced: boolean }>(
					'PUT',
					refPath('/access', ref(tenant)),
					input,
					options,
				),
			revoke: (tenant: string, options?: RequestOptions) =>
				req<CloudDeleted<{ synced: boolean }>>(
					'DELETE',
					refPath('/access', ref(tenant)),
					undefined,
					options,
				),
		},

		connections: {
			list: (
				query: ListQuery & { tenant?: string; integration?: string } = {},
				options?: RequestOptions,
			) =>
				req<CloudList<CloudConnection>>(
					'GET',
					`/connections${scoped(query)}`,
					undefined,
					options,
				),
			get: (integration: string, tenant: string, options?: RequestOptions) =>
				req<CloudConnection>(
					'GET',
					refPath('/connections', ref(integration, tenant)),
					undefined,
					options,
				),
			/** Drops the stored credential. The grant at the provider stands;
			 *  revoke it there too if you need it gone. */
			delete: (integration: string, tenant: string, options?: RequestOptions) =>
				req<CloudDeleted<{ revoked_upstream: false }>>(
					'DELETE',
					refPath('/connections', ref(integration, tenant)),
					undefined,
					options,
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
			list: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudIntegration>>(
					'GET',
					`/integrations${scoped(query)}`,
					undefined,
					options,
				),
			get: (integration: string, options?: RequestOptions) =>
				req<CloudIntegration>(
					'GET',
					refPath('/integrations', ref(integration)),
					undefined,
					options,
				),
			/** Adds the integration, or reconfigures it in place. */
			put: (
				integration: string,
				input: PutIntegrationInput,
				options?: RequestOptions,
			) =>
				req<CloudIntegration>(
					'PUT',
					refPath('/integrations', ref(integration)),
					input,
					options,
				),
			delete: (integration: string, options?: RequestOptions) =>
				req<CloudDeleted>(
					'DELETE',
					refPath('/integrations', ref(integration)),
					undefined,
					options,
				),
			/**
			 * What this integration exposes, each operation with the risk level a
			 * permission mode judges it by.
			 *
			 * `permissions.overrides` is keyed by operation id, so this is how a
			 * caller learns what it may name.
			 */
			operations: (integration: string, options?: RequestOptions) =>
				req<CloudIntegrationOperations>(
					'GET',
					`${refPath('/integrations', ref(integration))}/operations`,
					undefined,
					options,
				),
			/** Your own OAuth app for this integration, in place of Corsair's. */
			oauthApp: {
				get: (integration: string, options?: RequestOptions) =>
					req<CloudOauthApp>(
						'GET',
						`${refPath('/integrations', ref(integration))}/oauth-app`,
						undefined,
						options,
					),
				put: (
					integration: string,
					input: PutOauthAppInput,
					options?: RequestOptions,
				) =>
					req<CloudOauthApp>(
						'PUT',
						`${refPath('/integrations', ref(integration))}/oauth-app`,
						input,
						options,
					),
				/** Drops the app; the integration stays configured. 404 when
				 *  there is none. */
				delete: (integration: string, options?: RequestOptions) =>
					req<CloudDeleted>(
						'DELETE',
						`${refPath('/integrations', ref(integration))}/oauth-app`,
						undefined,
						options,
					),
			},
		},

		/** Inbound provider webhooks: one endpoint per integration. */
		webhooks: {
			list: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudWebhook>>(
					'GET',
					`/webhooks${scoped(query)}`,
					undefined,
					options,
				),
			/** Idempotent by integration: a repeat returns the existing endpoint,
			 *  and writes `signing_secret` if one is supplied. */
			create: (input: CreateWebhookInput, options?: RequestOptions) =>
				req<CloudWebhook>(
					'POST',
					'/webhooks',
					{ ...input, instance: instanceKey },
					options,
				),
			get: (integration: string, options?: RequestOptions) =>
				req<CloudWebhook>(
					'GET',
					refPath('/webhooks', ref(integration)),
					undefined,
					options,
				),
			/** Removes the endpoint here. The provider keeps posting until you
			 *  unsubscribe it there as well. */
			delete: (integration: string, options?: RequestOptions) =>
				req<CloudDeleted<{ provider_still_sending: true }>>(
					'DELETE',
					refPath('/webhooks', ref(integration)),
					undefined,
					options,
				),
			/** Replaces the provider's signing secret. The URL is unaffected. */
			rotateSecret: (
				integration: string,
				input: RotateWebhookSecretInput,
				options?: RequestOptions,
			) =>
				req<CloudWebhook>(
					'POST',
					`${refPath('/webhooks', ref(integration))}/rotate-secret`,
					input,
					options,
				),
			/** The log of what this endpoint received. */
			deliveries: {
				list: (
					integration: string,
					query: ListQuery & { tenant?: string } = {},
					options?: RequestOptions,
				) =>
					req<CloudList<CloudDelivery>>(
						'GET',
						`${deliveries(integration)}${queryString(query)}`,
						undefined,
						options,
					),
				get: (
					integration: string,
					deliveryId: string,
					options?: RequestOptions,
				) =>
					req<CloudDelivery>(
						'GET',
						refPath(deliveries(integration), deliveryId),
						undefined,
						options,
					),
				/** Re-posts the stored event. 502 if that POST fails, 400 if the
				 *  row never routed to a tenant and so cannot be replayed. */
				retry: (
					integration: string,
					deliveryId: string,
					options?: RequestOptions,
				) =>
					req<{
						object: 'delivery_retry';
						id: string;
						delivered: true;
						error: null;
					}>(
						'POST',
						`${refPath(deliveries(integration), deliveryId)}/retry`,
						undefined,
						options,
					),
			},
		},

		/** The HMAC key hub signs its deliveries to this instance with. The
		 *  hosted runtime verifies them itself; read this only when your own
		 *  process is the delivery target. */
		signingSecret: {
			get: (options?: RequestOptions) =>
				req<CloudSigningSecret>(
					'GET',
					instancePath('/signing-secret'),
					undefined,
					options,
				),
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

		/**
		 * Pushes the instance's stored configuration into the runtime.
		 *
		 * The same call performs a first apply and a re-apply. Refuses an
		 * instance holding no integrations: add one with `integrations.put`.
		 */
		apply: (options?: RequestOptions) =>
			req<CloudInstanceApply>(
				'POST',
				instancePath('/apply'),
				undefined,
				options,
			),

		/**
		 * Drops the instance's runtime record and keeps its configuration, so
		 * one `apply` rebuilds it. `instances.delete` destroys the instance.
		 *
		 * The tenants' stored credentials go with the tables, so they reconnect.
		 */
		removeFromRuntime: (options?: RequestOptions) =>
			req<CloudInstanceRemoval>(
				'POST',
				instancePath('/remove'),
				undefined,
				options,
			),

		/** @deprecated Use `apply`, which is idempotent. */
		reconcile: (options?: RequestOptions) =>
			req<{ object: 'instance_reconcile'; id: string; instance: string }>(
				'POST',
				instancePath('/reconcile'),
				undefined,
				options,
			),
	};
}

export type CloudInstancePlane = ReturnType<typeof buildInstancePlane>;
