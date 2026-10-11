import type { CloudList, ListQuery, RequestOptions, V1Transport } from './http';
import { assertInstanceKey, queryString, refPath, v1Request } from './http';
import type {
	CloudCatalogIntegration,
	CloudDeleted,
	CloudInstance,
	CloudKey,
	CloudKeyRotation,
	CloudLink,
	CloudMcpToken,
	CloudProject,
	CredentialSource,
	Permission,
} from './types';

export type CreateInstanceInput = {
	/** Lowercase slug, max 32 characters. Fixed for the instance's life. */
	instance_key: string;
	/** Who owns the provider credentials. Defaults to `app_owned`. */
	credential_source?: CredentialSource;
};

export type UpdateInstanceInput = {
	/** `null` clears it. */
	description?: string | null;
	/** Allows write and destructive operations on this instance. */
	writable?: boolean;
	credential_source?: CredentialSource;
};

/** One line of reach: a tenant on an instance, at a permission. */
export type LinkLine = {
	instance: string;
	tenant: string;
	permission: Permission;
};

export type MintLinkInput = {
	/** Who the link is for. Shown in the console; not an address. */
	recipient?: string | null;
	/** Where `mcp.links.send` mails the link. */
	email?: string | null;
	/** Every line must name access you already hold. */
	instances: LinkLine[];
};

export type UpdateLinkInput = {
	recipient?: string | null;
	email?: string | null;
	/** Replaces the whole set. Omit to leave the lines alone. */
	instances?: LinkLine[];
};

export type MintTokenInput = {
	instance: string;
	tenant: string;
	/** 1-365. Defaults to 30. */
	ttl_days?: number;
};

/** The project as a whole: its key, its instance rows, the plugin catalogue
 *  and the MCP links it has minted. Work inside one instance with
 *  `withInstance(key)`. */
export function buildProjectPlane(transport: V1Transport) {
	// `options` is required rather than optional: it sits behind `body`, so a
	// bodyless call that passed neither silently dropped the caller's signal.
	const req = <T>(
		method: string,
		path: string,
		body: unknown,
		options: RequestOptions | undefined,
	) => v1Request<T>(transport, method, path, body, options);

	return {
		project: {
			/** The project, with a first page of its instances, tenants, access
			 *  lines, connections and links embedded. */
			get: (options?: RequestOptions) =>
				req<CloudProject>('GET', '/project', undefined, options),
		},

		keys: {
			/** The project key. Shown in full; store it, do not log it. */
			get: (options?: RequestOptions) =>
				req<CloudKey>('GET', '/keys', undefined, options),
			/** Mints a new project key and redeploys every instance with it. The
			 *  old key is dead on return, so check `failed`. */
			rotate: (options?: RequestOptions) =>
				req<CloudKeyRotation>('POST', '/keys/rotate', undefined, options),
		},

		instances: {
			/** Every instance in the project. */
			list: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudInstance>>(
					'GET',
					`/instances${queryString(query)}`,
					undefined,
					options,
				),
			/** Idempotent by `instance_key`: a repeat returns the existing row. */
			create: (input: CreateInstanceInput, options?: RequestOptions) => {
				assertInstanceKey(input.instance_key, 'instances.create');
				return req<CloudInstance>('POST', '/instances', input, options);
			},
			get: (instanceKey: string, options?: RequestOptions) =>
				req<CloudInstance>(
					'GET',
					refPath('/instances', instanceKey),
					undefined,
					options,
				),
			update: (
				instanceKey: string,
				input: UpdateInstanceInput,
				options?: RequestOptions,
			) =>
				req<CloudInstance>(
					'PATCH',
					refPath('/instances', instanceKey),
					input,
					options,
				),
			/** Permanent. Destroys the instance's data and its tenants' stored
			 *  credentials. */
			delete: (instanceKey: string, options?: RequestOptions) =>
				req<CloudDeleted>(
					'DELETE',
					refPath('/instances', instanceKey),
					undefined,
					options,
				),
		},

		integrations: {
			/** Every plugin the runtime can host, with its auth types. */
			catalog: (query: ListQuery = {}, options?: RequestOptions) =>
				req<CloudList<CloudCatalogIntegration>>(
					'GET',
					`/integrations/catalog${queryString(query)}`,
					undefined,
					options,
				),
		},

		mcp: {
			/** An MCP link carries its own URL and names the lines it reaches. */
			links: {
				list: (
					query: ListQuery & { tenant?: string } = {},
					options?: RequestOptions,
				) =>
					req<CloudList<CloudLink>>(
						'GET',
						`/mcp/links${queryString(query)}`,
						undefined,
						options,
					),
				/** Mints a link with its own URL. */
				mint: (input: MintLinkInput, options?: RequestOptions) =>
					req<CloudLink>('POST', '/mcp/links', input, options),
				get: (id: string, options?: RequestOptions) =>
					req<CloudLink>('GET', refPath('/mcp/links', id), undefined, options),
				update: (
					id: string,
					input: UpdateLinkInput,
					options?: RequestOptions,
				) => req<CloudLink>('PATCH', refPath('/mcp/links', id), input, options),
				/** Revokes the link. Its URL stops working immediately. */
				delete: (id: string, options?: RequestOptions) =>
					req<CloudDeleted>(
						'DELETE',
						refPath('/mcp/links', id),
						undefined,
						options,
					),
				/** New URL for the same lines. The old URL is revoked. */
				rotate: (id: string, options?: RequestOptions) =>
					req<CloudLink>(
						'POST',
						`${refPath('/mcp/links', id)}/rotate`,
						undefined,
						options,
					),
				/** Mails the link to the address on it. Not deduped, so a retry
				 *  sends a second mail. */
				send: (id: string, options?: RequestOptions) =>
					req<{
						object: 'mcp_link_send';
						id: string;
						email: string;
						sent: true;
					}>('POST', `${refPath('/mcp/links', id)}/send`, undefined, options),
			},
			tokens: {
				/** Mints a bearer token for the project's shared MCP URL. It
				 *  cannot be revoked, only waited out, so pass an idempotency
				 *  key to keep a retry from minting a second one. */
				mint: (input: MintTokenInput, options?: RequestOptions) =>
					req<CloudMcpToken>('POST', '/mcp/tokens', input, options),
			},
		},
	};
}

export type CloudProjectPlane = ReturnType<typeof buildProjectPlane>;
