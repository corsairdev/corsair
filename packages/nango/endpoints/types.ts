import { z } from 'zod';

// Inputs follow Nango's OpenAPI reference (docs.nango.dev/reference) strictly.
// Responses are parsed leniently: Nango adds fields often, and metadata,
// configuration, credentials and synced records are provider-defined.

// unknown: metadata, connection configuration, raw credentials, records and
// provider config carry provider-defined values of any JSON type.
const JsonObject = z.record(z.string(), z.unknown());
// unknown: a tool's input and output, and a proxied body, are whatever the
// deployed function or the end customer's API defines.
const AnyJson = z.unknown();

const Tags = z
	.record(z.string(), z.string().max(255))
	.refine(
		(tags) => Object.keys(tags).length <= 10,
		'At most 10 tags are supported',
	)
	.describe(
		'Connection tags (key/value strings, at most 10). Keys are lowercased by Nango.',
	);
// Nango returns tags it stored; keep reads working if it ever adds more.
const ReturnedTags = z.record(z.string(), z.string());
const SafeId = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..', 'Invalid identifier');
const ProviderConfigKey = z
	.string()
	.min(1)
	.describe('The integration ID (unique key) the connection belongs to.');
const ConnectionId = SafeId.describe('The connection ID.');
const EndUserInput = z
	.object({
		id: z.string(),
		email: z.string().optional(),
		display_name: z.string().optional(),
		tags: z.record(z.string(), z.string().max(64)).optional(),
	})
	.describe('Deprecated by Nango; use tags instead.');
const OrganizationInput = z
	.object({
		id: z.string(),
		display_name: z.string().optional(),
	})
	.describe('Deprecated by Nango; use tags instead.');

// ── Connect sessions ─────────────────────────────────────────────────────────
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
		.optional()
		.describe(
			'Per-integration defaults for the Connect UI, keyed by integration ID.',
		),
	overrides: z
		.record(z.string(), z.object({ docs_connect: z.string().optional() }))
		.optional(),
	webhook_url_override: z.string().optional(),
};
const CreateSessionInput = z
	.object({
		...SessionFields,
		allowed_integrations: z
			.array(z.string())
			.optional()
			.describe('Integration IDs the end user may connect.'),
	})
	.refine(
		(value) => value.tags !== undefined || value.end_user !== undefined,
		'tags or end_user is required',
	);
const ReconnectSessionInput = z.object({
	...SessionFields,
	connection_id: ConnectionId,
	integration_id: z.string().min(1),
});
const SessionCreated = z.object({
	data: z.looseObject({
		token: z.string(),
		expires_at: z.string(),
		connect_link: z.string().optional(),
	}),
});

// ── Connections ──────────────────────────────────────────────────────────────
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
		token: z.string(),
		expires_at: z.string().optional(),
	}),
	z.object({ type: z.literal('NONE') }),
	z.object({
		type: z.literal('TBA'),
		token_id: z.string(),
		token_secret: z.string(),
		config_override: ConfigOverride,
	}),
	z.object({
		type: z.literal('APP'),
		app_id: z.string(),
		installation_id: z.string(),
	}),
]);
const ImportInput = z.object({
	provider_config_key: ProviderConfigKey,
	credentials: ImportCredentials,
	connection_id: z
		.string()
		.optional()
		.describe(
			'Connection ID to create or overwrite. Nango generates one when omitted.',
		),
	metadata: JsonObject.optional(),
	connection_config: JsonObject.optional(),
	webhook_url_override: z.string().optional(),
	tags: Tags.optional(),
	end_user: EndUserInput.optional(),
});
const ConnectionError = z.looseObject({
	type: z.string(),
	log_id: z.string().optional(),
});
const ConnectionEndUser = z.looseObject({
	id: z.string(),
	email: z.string().nullable().optional(),
	display_name: z.string().nullable().optional(),
	tags: JsonObject.nullable().optional(),
	organization: z
		.looseObject({
			id: z.string(),
			display_name: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});
// Credentials vary by auth mode and include provider-defined `raw` data.
const ReturnedCredentials = z.looseObject({
	type: z.string().optional(),
	access_token: z.string().optional(),
	refresh_token: z.string().optional(),
	apiKey: z.string().optional(),
	username: z.string().optional(),
	password: z.string().optional(),
	token: z.string().optional(),
	expires_at: z.string().nullable().optional(),
	raw: JsonObject.optional(),
});
const Connection = z.looseObject({
	id: z.number().int(),
	connection_id: z.string(),
	provider_config_key: z.string(),
	provider: z.string(),
	errors: z.array(ConnectionError).optional(),
	metadata: JsonObject.nullable().optional(),
	connection_config: JsonObject.nullable().optional(),
	tags: ReturnedTags.nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	last_fetched_at: z.string().nullable().optional(),
	webhook_url_override: z.string().nullable().optional(),
	end_user: ConnectionEndUser.nullable().optional(),
	credentials: ReturnedCredentials.optional().describe(
		'Only present when include_credentials is true. Holds live third-party secrets.',
	),
});
const ListInput = z.object({
	connectionId: z
		.string()
		.optional()
		.describe('Exact connection ID; can match one connection per integration.'),
	tags: Tags.optional().describe(
		'Only connections carrying all of these tags.',
	),
	search: z.string().optional().describe('Deprecated by Nango; prefer tags.'),
	endUserId: z
		.string()
		.optional()
		.describe('Deprecated by Nango; prefer tags.'),
	endUserOrganizationId: z
		.string()
		.optional()
		.describe('Deprecated by Nango; prefer tags.'),
	limit: z.number().int().min(1).optional(),
	page: z.number().int().min(0).optional(),
});
const ListOutput = z.object({
	connections: z.array(
		z.looseObject({
			id: z.number().int(),
			connection_id: z.string(),
			provider: z.string(),
			provider_config_key: z.string(),
			created: z.string().optional(),
			metadata: JsonObject.nullable().optional(),
			tags: ReturnedTags.nullable().optional(),
			errors: z.array(ConnectionError).optional(),
			end_user: ConnectionEndUser.nullable().optional(),
		}),
	),
});
const ConnectionInput = z.object({
	connectionId: ConnectionId,
	provider_config_key: ProviderConfigKey,
});
const GetConnectionInput = ConnectionInput.extend({
	include_credentials: z
		.boolean()
		.optional()
		.describe(
			'Return the connection credentials (access tokens, API keys, passwords). Off by default; the plugin drops them from the result unless this is true.',
		),
	force_refresh: z
		.boolean()
		.optional()
		.describe('Refresh the access token even if it has not expired.'),
	refresh_token: z
		.boolean()
		.optional()
		.describe('Also return the refresh token (needs include_credentials).'),
	refresh_github_app_jwt_token: z.boolean().optional(),
});
const PatchConnectionInput = ConnectionInput.extend({
	body: z.object({
		tags: Tags.optional().describe('Replaces the connection tags.'),
		webhook_url_override: z
			.string()
			.optional()
			.describe(
				'Send this connection’s webhooks only to this URL; "" clears it.',
			),
		end_user: EndUserInput.optional(),
	}),
});
const MetadataInput = z.object({
	connection_id: z
		.union([ConnectionId, z.array(ConnectionId).min(1)])
		.describe('One connection ID or a list; a bad ID aborts the whole call.'),
	provider_config_key: ProviderConfigKey,
	metadata: JsonObject,
});
const MetadataOutput = z.looseObject({
	connection_id: z.union([z.string(), z.array(z.string())]).optional(),
	provider_config_key: z.string().optional(),
	metadata: JsonObject.optional(),
});
const SuccessOutput = z.looseObject({ success: z.boolean() });

// ── Integrations ─────────────────────────────────────────────────────────────
const IntegrationCredentialsInput = z
	.looseObject({
		type: z
			.string()
			.describe(
				'OAUTH1, OAUTH2, TBA, APP, CUSTOM, MCP_OAUTH2, MCP_OAUTH2_GENERIC, or NANGO_MANAGED (create only).',
			),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		scopes: z.string().optional().describe('Comma-separated OAuth scopes.'),
		webhook_secret: z.string().optional(),
		app_id: z.string().optional(),
		app_link: z.string().optional(),
		private_key: z.string().optional(),
	})
	.describe('Developer app credentials. Omit to add them later.');
const IntegrationFields = {
	display_name: z.string().optional(),
	forward_webhooks: z.boolean().optional(),
	credentials: IntegrationCredentialsInput.optional(),
	integration_config: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Config for providers that declare an integration_config schema (e.g. private-api-generic baseUrl).',
		),
	custom: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Free-form settings for providers without an integration_config schema.',
		),
};
const IntegrationKey = SafeId.describe('The integration ID (unique_key).');
const CreateIntegrationInput = z.object({
	unique_key: z.string().min(1).describe('A unique integration ID you choose.'),
	provider: z
		.string()
		.min(1)
		.describe('The provider name, as returned by providers.list.'),
	...IntegrationFields,
});
const UpdateIntegrationInput = z.object({
	uniqueKey: IntegrationKey,
	unique_key: z
		.string()
		.min(1)
		.optional()
		.describe('Rename the integration ID.'),
	...IntegrationFields,
});
const GetIntegrationInput = z.object({
	uniqueKey: IntegrationKey,
	include: z
		.array(z.enum(['webhook', 'credentials']))
		.optional()
		.describe(
			'Extra data to return. "credentials" returns the developer app client secret and private key.',
		),
});
const Integration = z.looseObject({
	unique_key: z.string(),
	display_name: z.string().optional(),
	provider: z.string(),
	logo: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	forward_webhooks: z.boolean().optional(),
	missing_fields: z.array(z.string()).optional(),
	webhook_url: z.string().nullable().optional(),
	credentials: JsonObject.nullable().optional(),
});

// ── Functions and scripts ────────────────────────────────────────────────────
const FunctionType = z.enum(['sync', 'on-event', 'tool']);
const FunctionName = SafeId.describe('The function name.');
const ListFunctionsInput = z.object({
	uniqueKey: IntegrationKey,
	type: FunctionType.optional(),
	search: z.string().min(1).max(255).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
const GetFunctionInput = z.object({
	uniqueKey: IntegrationKey,
	name: FunctionName,
	type: FunctionType.optional().describe(
		'Pick one function when several share the name.',
	),
});
const DeleteFunctionInput = z.object({
	uniqueKey: IntegrationKey,
	name: FunctionName,
	type: z.enum(['action', 'sync', 'tool', 'function']),
});
const FunctionInfo = z.looseObject({
	name: z.string(),
	type: z.string(),
	description: z.string().optional(),
	id: z.number().nullable().optional(),
	enabled: z.boolean().optional(),
	last_deployed: z.string().nullable().optional(),
	source: z.string().optional(),
});
const FunctionList = z.looseObject({
	data: z.array(FunctionInfo),
	pagination: JsonObject.optional(),
});
const FunctionCode = z.looseObject({ type: z.string(), code: z.string() });
const DeleteFunctionOutput = z.looseObject({
	data: z.looseObject({ success: z.boolean() }),
});
const ScriptsConfigInput = z.object({
	format: z
		.enum(['nango', 'openai'])
		.optional()
		.describe('"openai" returns tool definitions in OpenAI function format.'),
});
// The `nango` format is an array of per-integration configs, `openai` an
// object of function definitions; both are passed through.
const ScriptsConfig = z.union([z.array(JsonObject), JsonObject]);

// ── Providers ────────────────────────────────────────────────────────────────
const ListProvidersInput = z.object({
	search: z
		.string()
		.min(1)
		.optional()
		.describe('Filter by name. Without it the list has over 1,000 providers.'),
});
const Provider = z.looseObject({
	name: z.string().optional(),
	display_name: z.string(),
	auth_mode: z.string(),
	categories: z.array(z.string()).optional(),
	docs: z.string().optional(),
	logo_url: z.string().optional(),
});
const GetProviderInput = z.object({
	provider: SafeId.describe('The provider name, e.g. github.'),
});

// ── Syncs and records ────────────────────────────────────────────────────────
const SyncSelector = z
	.union([
		z.array(z.string()),
		// Nango refuses an object without a variant (live 11-18), although its
		// reference marks variant optional; the default variant is "base".
		z.array(
			z.object({
				name: z.string(),
				variant: z.string().min(1),
			}),
		),
	])
	.describe(
		'Sync names, or { name, variant } objects (variant is required; the default is "base").',
	);
const SyncScope = {
	provider_config_key: ProviderConfigKey,
	connection_id: z
		.string()
		.optional()
		.describe('Limit to one connection; omit for every connection.'),
	syncs: SyncSelector,
};
const TriggerSyncInput = z.object({
	...SyncScope,
	opts: z
		.object({
			reset: z
				.boolean()
				.optional()
				.describe('Clear the checkpoint and run a full sync.'),
			emptyCache: z
				.boolean()
				.optional()
				.describe('Delete the cached records first; needs reset.'),
		})
		.optional(),
});
const SyncStatusInput = z.object({
	provider_config_key: ProviderConfigKey,
	syncs: z
		.string()
		.min(1)
		.describe(
			'Comma-separated sync names, "*" for all, name::variant for variants.',
		),
	connection_id: z.string().optional(),
});
const SyncStatusOutput = z.looseObject({
	syncs: z.array(
		z.looseObject({
			id: z.string().optional(),
			connection_id: z.string().optional(),
			name: z.string().optional(),
			variant: z.string().optional(),
			status: z.string().optional(),
			finishedAt: z.string().nullable().optional(),
			nextScheduledSyncAt: z.string().nullable().optional(),
			frequency: z.string().nullable().optional(),
			latestResult: JsonObject.nullable().optional(),
			recordCount: JsonObject.nullable().optional(),
			checkpoint: JsonObject.nullable().optional(),
		}),
	),
});
const UpdateFrequencyInput = z.object({
	provider_config_key: ProviderConfigKey,
	connection_id: ConnectionId,
	sync_name: z.string().min(1),
	sync_variant: z.string().optional(),
	frequency: z
		.string()
		.nullable()
		.describe('e.g. "every hour" (min 30 seconds); null restores the default.'),
});
const UpdateFrequencyOutput = z.looseObject({
	frequency: z.string().nullable().optional(),
});
const ListRecordsInput = z.object({
	provider_config_key: ProviderConfigKey,
	connection_id: ConnectionId,
	model: z.string().min(1).describe('The data model the sync writes.'),
	cursor: z
		.string()
		.optional()
		.describe(
			'next_cursor from the previous page, or a record’s _nango_metadata.cursor.',
		),
	limit: z.number().int().min(1).optional().describe('Default 100.'),
	filter: z.enum(['added', 'updated', 'deleted']).optional(),
	modified_after: z.string().optional().describe('ISO 8601 timestamp.'),
	ids: z.array(z.string()).max(100).optional(),
	variant: z.string().optional(),
});
const ListRecordsOutput = z.looseObject({
	records: z.array(JsonObject),
	next_cursor: z.string().nullable().optional(),
});

// ── Tools, actions, environment ──────────────────────────────────────────────
const CallToolInput = z.object({
	connectionId: ConnectionId,
	name: SafeId.describe('The tool name on the integration.'),
	provider_config_key: z
		.string()
		.optional()
		.describe('Needed when several integrations share the connection ID.'),
	input: AnyJson.optional().describe("Input matching the tool's schema."),
});
const TriggerActionInput = z.object({
	connection_id: ConnectionId,
	provider_config_key: ProviderConfigKey,
	action_name: z.string().min(1),
	input: JsonObject.optional(),
});
const EnvironmentVariables = z.array(
	z.looseObject({ name: z.string(), value: z.string().nullable().optional() }),
);
const Empty = z.object({});

// ── Proxy ────────────────────────────────────────────────────────────────────
const ProxyInput = z.object({
	connection_id: ConnectionId,
	provider_config_key: ProviderConfigKey,
	path: z
		.string()
		.min(1)
		.describe(
			"Path on the end customer's API, relative to the provider's base URL, e.g. /v1/users.",
		),
	query: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
	headers: z
		.record(z.string().regex(/^[A-Za-z0-9-]+$/), z.string())
		.optional()
		.describe(
			'Headers passed on to the external API (sent as Nango-Proxy-<name>).',
		),
	retries: z
		.number()
		.int()
		.min(0)
		.max(10)
		.optional()
		.describe('Retries Nango makes on failure, with exponential back-off.'),
});
const ProxyBodyInput = ProxyInput.extend({
	body: AnyJson.optional().describe('JSON body sent to the external API.'),
});
// The external API's response, exactly as it returned it.
const ProxyOutput = AnyJson;

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
	'integrations.list': Empty,
	'integrations.get': GetIntegrationInput,
	'integrations.create': CreateIntegrationInput,
	'integrations.update': UpdateIntegrationInput,
	'integrations.delete': z.object({ uniqueKey: IntegrationKey }),
	'functions.list': ListFunctionsInput,
	'functions.get': GetFunctionInput,
	'functions.getCode': GetFunctionInput,
	'functions.delete': DeleteFunctionInput,
	'scripts.getConfig': ScriptsConfigInput,
	'providers.list': ListProvidersInput,
	'providers.get': GetProviderInput,
	'syncs.trigger': TriggerSyncInput,
	'syncs.start': z.object(SyncScope),
	'syncs.pause': z.object(SyncScope),
	'syncs.status': SyncStatusInput,
	'syncs.updateFrequency': UpdateFrequencyInput,
	'records.list': ListRecordsInput,
	'tools.call': CallToolInput,
	'actions.trigger': TriggerActionInput,
	'environment.getVariables': Empty,
	'proxy.get': ProxyInput,
	'proxy.post': ProxyBodyInput,
	'proxy.put': ProxyBodyInput,
	'proxy.patch': ProxyBodyInput,
	'proxy.delete': ProxyBodyInput,
} as const;

export const EndpointOutputSchemas = {
	'connections.import': Connection,
	'connections.list': ListOutput,
	'connections.get': Connection,
	'connections.patch': SuccessOutput,
	'connections.setMetadata': MetadataOutput,
	'connections.updateMetadata': MetadataOutput,
	'connections.delete': SuccessOutput,
	'sessions.create': SessionCreated,
	'sessions.reconnect': SessionCreated,
	'integrations.list': z.looseObject({ data: z.array(Integration) }),
	'integrations.get': z.looseObject({ data: Integration }),
	'integrations.create': z.looseObject({ data: Integration }),
	'integrations.update': z.looseObject({ data: Integration }),
	'integrations.delete': SuccessOutput,
	'functions.list': FunctionList,
	'functions.get': z.looseObject({ data: FunctionInfo }),
	'functions.getCode': FunctionCode,
	'functions.delete': DeleteFunctionOutput,
	'scripts.getConfig': ScriptsConfig,
	'providers.list': z.looseObject({ data: z.array(Provider) }),
	'providers.get': z.looseObject({ data: Provider }),
	'syncs.trigger': SuccessOutput,
	'syncs.start': SuccessOutput,
	'syncs.pause': SuccessOutput,
	'syncs.status': SyncStatusOutput,
	'syncs.updateFrequency': UpdateFrequencyOutput,
	'records.list': ListRecordsOutput,
	'tools.call': AnyJson,
	'actions.trigger': AnyJson,
	'environment.getVariables': EnvironmentVariables,
	'proxy.get': ProxyOutput,
	'proxy.post': ProxyOutput,
	'proxy.put': ProxyOutput,
	'proxy.patch': ProxyOutput,
	'proxy.delete': ProxyOutput,
} as const;
