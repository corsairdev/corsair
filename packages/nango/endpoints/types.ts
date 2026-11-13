import { z } from 'zod';

// Nango connection metadata and connection configuration are provider-defined JSON.
const JsonObject = z.record(z.string(), z.unknown());
const Tags = z
	.record(z.string(), z.string().max(255))
	.refine(
		(tags) => Object.keys(tags).length <= 10,
		'At most 10 tags are supported',
	);
const SafePath = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Invalid path segment',
	);
const EndUserInput = z.object({
	id: z.string(),
	email: z.string().optional(),
	display_name: z.string().optional(),
	tags: z.record(z.string(), z.string().max(64)).optional(),
});
const OrganizationInput = z.object({
	id: z.string(),
	display_name: z.string().optional(),
});
const SessionFields = {
	tags: Tags.optional(),
	end_user: EndUserInput.optional(),
	organization: OrganizationInput.optional(),
	integrations_config_defaults: z
		.record(
			z.string(),
			z.object({
				user_scopes: z.string().optional(),
				authorization_params: z.record(z.string(), z.string()).optional(),
				connection_config: z
					.looseObject({
						oauth_scopes_override: z.string().optional(),
						oauth_client_id_override: z.string().optional(),
						oauth_client_secret_override: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	overrides: z
		.record(z.string(), z.object({ docs_connect: z.string().optional() }))
		.optional(),
	webhook_url_override: z.string().optional(),
};
const CreateSessionInput = z
	.object({
		...SessionFields,
		allowed_integrations: z.array(z.string()).optional(),
	})
	.refine(
		(value) => value.tags !== undefined || value.end_user !== undefined,
		'tags or end_user is required',
	);
const ReconnectSessionInput = z.object({
	...SessionFields,
	connection_id: z.string(),
	integration_id: z.string(),
});
const SessionTokenInput = z.object({ session_token: z.string().min(1) });
const SessionCreated = z.object({
	data: z.object({
		token: z.string(),
		expires_at: z.string(),
		connect_link: z.string().optional(),
	}),
});
const ReturnedEndUser = z.object({
	id: z.string(),
	email: z.string().nullable(),
	display_name: z.string().nullable(),
	tags: JsonObject.nullable(),
	organization: z
		.object({ id: z.string(), display_name: z.string().nullable() })
		.nullable(),
});
// GET /connect/session is authenticated by the session token and the server's
// actual response differs from its generated OpenAPI (see Nango's integration test).
const SessionDetails = z.object({
	data: z.object({
		endUser: ReturnedEndUser.nullable(),
		connectUISettings: z.looseObject({
			showWatermark: z.boolean(),
			defaultTheme: z.string(),
		}),
		allowed_integrations: z.array(z.string()).optional(),
		integrations_config_defaults: z.record(z.string(), JsonObject).optional(),
		overrides: z
			.record(z.string(), z.object({ docs_connect: z.string().optional() }))
			.optional(),
		isReconnecting: z.boolean().optional(),
		websocketsPath: z.string().optional(),
	}),
});

const ConfigOverride = z.object({
	client_id: z.string().optional(),
	client_secret: z.string().optional(),
});
const ImportCredentials = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('OAUTH1'),
		oauth_token: z.string(),
		oauth_token_secret: z.string(),
	}),
	z.object({
		type: z.literal('OAUTH2'),
		access_token: z.string(),
		config_override: ConfigOverride.optional(),
		expires_at: z.string().optional(),
		refresh_token: z.string().optional(),
	}),
	z.object({
		type: z.literal('BASIC'),
		username: z.string(),
		password: z.string(),
	}),
	z.object({ type: z.literal('API_KEY'), apiKey: z.string() }),
	z.object({
		type: z.literal('OAUTH2_CC'),
		client_id: z.string(),
		client_secret: z.string(),
		client_certificate: z.string().optional(),
		client_private_key: z.string().optional(),
		token: z.string(),
		expires_at: z.string().optional(),
	}),
	z.object({ type: z.literal('NONE') }),
	z.object({
		type: z.literal('TBA'),
		token_id: z.string(),
		token_secret: z.string(),
		config_override: ConfigOverride.optional(),
	}),
	z.object({
		type: z.literal('APP'),
		app_id: z.string(),
		installation_id: z.string(),
		private_key: z.string().optional(),
		webhook_secret: z.string().optional(),
	}),
	z.object({
		type: z.literal('CUSTOM'),
		app_id: z.string(),
		installation_id: z.string(),
	}),
]);
const ImportInput = z.object({
	provider_config_key: z.string(),
	credentials: ImportCredentials,
	connection_id: z.string().optional(),
	metadata: JsonObject.optional(),
	connection_config: JsonObject.optional(),
	webhook_url_override: z.string().optional(),
	tags: Tags.optional(),
	end_user: EndUserInput.optional(),
});
const ConnectionError = z.object({
	type: z.enum(['auth', 'sync']),
	log_id: z.string(),
});
const ConnectionEndUser = z.object({
	id: z.string(),
	email: z.string().nullable().optional(),
	display_name: z.string().nullable().optional(),
	tags: JsonObject.nullable().optional(),
	organization: z
		.object({ id: z.string(), display_name: z.string().nullable().optional() })
		.nullable()
		.optional(),
});
// Credentials vary by Nango authentication mode, including provider-defined raw data.
const ReturnedCredentials = z.looseObject({
	type: z.string().optional(),
	access_token: z.string().optional(),
	refresh_token: z.string().optional(),
	apiKey: z.string().optional(),
	username: z.string().optional(),
	password: z.string().optional(),
	token: z.string().optional(),
	expires_at: z.string().optional(),
	raw: JsonObject.optional(),
});
const ConnectionFull = z.object({
	id: z.number().int(),
	connection_id: z.string(),
	provider_config_key: z.string(),
	provider: z.string(),
	errors: z.array(ConnectionError),
	metadata: JsonObject.nullable(),
	connection_config: JsonObject,
	tags: Tags,
	created_at: z.string(),
	updated_at: z.string(),
	last_fetched_at: z.string().nullable(),
	webhook_url_override: z.string().nullable().optional(),
	credentials: ReturnedCredentials,
	end_user: ConnectionEndUser.nullable().optional(),
});
const ListInput = z.object({
	connectionId: z.string().optional(),
	integrationId: z.string().optional(),
	search: z.string().optional(),
	endUserId: z.string().optional(),
	endUserOrganizationId: z.string().optional(),
	tags: Tags.optional(),
	limit: z.number().int().optional(),
	page: z.number().int().optional(),
});
const ListOutput = z.object({
	connections: z.array(
		z.object({
			id: z.number().int(),
			connection_id: z.string(),
			provider: z.string(),
			provider_config_key: z.string(),
			created: z.string(),
			metadata: JsonObject.nullable(),
			tags: Tags,
			errors: z.array(ConnectionError),
			end_user: ConnectionEndUser.nullable().optional(),
		}),
	),
});
const ConnectionInput = z.object({
	connectionId: SafePath,
	provider_config_key: z.string(),
});
const GetConnectionInput = ConnectionInput.extend({
	force_refresh: z.boolean().optional(),
	refresh_token: z.boolean().optional(),
	refresh_github_app_jwt_token: z.boolean().optional(),
});
const PatchConnectionInput = ConnectionInput.extend({
	body: z.object({
		tags: Tags.optional(),
		webhook_url_override: z.string().optional(),
		end_user: EndUserInput.optional(),
	}),
});
const MetadataInput = z.object({
	connection_id: z.union([z.string(), z.array(z.string())]),
	provider_config_key: z.string(),
	metadata: JsonObject,
});
const MetadataOutput = z.object({
	connection_id: z.union([z.string(), z.array(z.string())]).optional(),
	provider_config_key: z.string().optional(),
	metadata: JsonObject.optional(),
});
const SuccessOutput = z.object({ success: z.boolean().optional() });

export const EndpointInputSchemas = {
	'connections.import': ImportInput,
	'connections.list': ListInput,
	'connections.get': GetConnectionInput,
	'connections.patch': PatchConnectionInput,
	'connections.setMetadata': MetadataInput,
	'connections.updateMetadata': MetadataInput,
	'connections.delete': ConnectionInput,
	'sessions.create': CreateSessionInput,
	'sessions.reconnect': ReconnectSessionInput,
	'sessions.get': SessionTokenInput,
	'sessions.delete': SessionTokenInput,
} as const;

export const EndpointOutputSchemas = {
	'connections.import': ConnectionFull,
	'connections.list': ListOutput,
	'connections.get': ConnectionFull,
	'connections.patch': SuccessOutput,
	'connections.setMetadata': MetadataOutput,
	'connections.updateMetadata': MetadataOutput,
	'connections.delete': SuccessOutput,
	'sessions.create': SessionCreated,
	'sessions.reconnect': SessionCreated,
	'sessions.get': SessionDetails,
	'sessions.delete': z.void(),
} as const;
