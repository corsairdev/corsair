import { z } from 'zod';

// Inputs use ngrok's own field names, which are snake_case. Outputs are
// `.loose()` and their documented fields nullish, so a field ngrok adds cannot
// fail a call that has already happened.

/**
 * ngrok pages by id, not by number: pass the `next_page_uri` from one response
 * as `before_id` on the next. It is null on the last page.
 */
const PagingSchema = {
	before_id: z
		.string()
		.min(1)
		.optional()
		.describe('The id to start before; ngrok sends it as next_page_uri.'),
	limit: z.number().int().min(1).optional().describe('Most results to return.'),
};

const IdSchema = z.string().min(1).describe('The resource id.');

const TimestampSchema = z.string().nullish();

// ── endpoints.* ───────────────────────────────────────────────────────────

const EndpointsListInputSchema = z.object({
	...PagingSchema,
	filter: z
		.string()
		.min(1)
		.optional()
		.describe(
			'ngrok filter syntax, e.g. description="my app" or proto="https".',
		),
});

export type EndpointsListInput = z.input<typeof EndpointsListInputSchema>;

/** A cross-resource reference, as ngrok nests it on an endpoint. */
const RefSchema = z
	.object({ id: z.string().nullish(), uri: z.string().nullish() })
	.loose();

export const EndpointSchema = z
	.object({
		id: z.string().nullish(),
		region: z.string().nullish(),
		created_at: TimestampSchema,
		updated_at: TimestampSchema,
		public_url: z.string().nullish(),
		proto: z.string().nullish(),
		scheme: z.string().nullish(),
		hostport: z.string().nullish(),
		host: z.string().nullish(),
		port: z.number().nullish(),
		type: z.string().nullish(),
		metadata: z.string().nullish(),
		description: z.string().nullish(),
		domain: RefSchema.nullish(),
		tcp_addr: RefSchema.nullish(),
		tunnel: RefSchema.nullish(),
		url: z.string().nullish(),
		upstream_url: z.string().nullish(),
		upstream_protocol: z.string().nullish(),
		/** The traffic policy body, as the API returns it. */
		traffic_policy: z.string().nullish(),
		bindings: z.array(z.string()).nullish(),
		principal: RefSchema.nullish(),
		tunnel_session: RefSchema.nullish(),
	})
	.loose();

export type NgrokEndpoint = z.infer<typeof EndpointSchema>;

const EndpointsListResponseSchema = z.object({
	endpoints: z.array(EndpointSchema),
	uri: z.string().nullish(),
	next_page_uri: z
		.string()
		.nullish()
		.describe('Present while more results exist; pass it as before_id.'),
});

export type EndpointsListResponse = z.infer<typeof EndpointsListResponseSchema>;

const EndpointsGetInputSchema = z.object({ id: IdSchema });

export type EndpointsGetInput = z.input<typeof EndpointsGetInputSchema>;

export type EndpointsGetResponse = NgrokEndpoint;

const EndpointsCreateInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe(
			'The upstream URL the endpoint forwards to, e.g. https://example.com.',
		),
	type: z
		.string()
		.min(1)
		.optional()
		.describe("The endpoint type. Only 'cloud' is supported; defaults to it."),
	traffic_policy: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The Traffic Policy to attach, as YAML or JSON text. An empty policy forwards everything.',
		),
	description: z.string().optional(),
	metadata: z.string().max(4096).optional(),
	bindings: z.array(z.string().min(1)).optional(),
});

export type EndpointsCreateInput = z.input<typeof EndpointsCreateInputSchema>;

export type EndpointsCreateResponse = NgrokEndpoint;

const EndpointsUpdateInputSchema = z.object({
	id: IdSchema,
	description: z
		.string()
		.optional()
		.describe('A new description. An empty string clears it.'),
	metadata: z.string().max(4096).optional(),
	traffic_policy: z.string().optional(),
	bindings: z.array(z.string().min(1)).optional(),
});

export type EndpointsUpdateInput = z.input<typeof EndpointsUpdateInputSchema>;

export type EndpointsUpdateResponse = NgrokEndpoint;

const EndpointsDeleteInputSchema = z.object({ id: IdSchema });

export type EndpointsDeleteInput = z.input<typeof EndpointsDeleteInputSchema>;

/** A delete answers 204 with no body, so this records the id that was removed. */
const DeletedResponseSchema = z.object({
	deleted: z.boolean(),
	id: z.string(),
});

export type EndpointsDeleteResponse = z.infer<typeof DeletedResponseSchema>;

// ── domains.* ─────────────────────────────────────────────────────────────

const DomainsListInputSchema = z.object({ ...PagingSchema });

export type DomainsListInput = z.input<typeof DomainsListInputSchema>;

const CertificateSchema = z
	.object({ id: z.string().nullish(), uri: z.string().nullish() })
	.loose();

export const ReservedDomainSchema = z
	.object({
		id: z.string().nullish(),
		uri: z.string().nullish(),
		created_at: TimestampSchema,
		description: z.string().nullish(),
		metadata: z.string().nullish(),
		domain: z.string().nullish(),
		region: z.string().nullish(),
		cname_target: z.string().nullish(),
		certificate: CertificateSchema.nullish(),
		certificate_management_policy: z.string().nullish(),
		certificate_management_status: z
			.object({
				renews_at: z.string().nullish(),
				provisioning_job: z
					.object({
						error_code: z.string().nullish(),
						started_at: z.string().nullish(),
						finished_at: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		acme_challenge_cname_target: z.string().nullish(),
	})
	.loose();

export type NgrokReservedDomain = z.infer<typeof ReservedDomainSchema>;

const DomainsListResponseSchema = z.object({
	reserved_domains: z.array(ReservedDomainSchema),
	uri: z.string().nullish(),
	next_page_uri: z.string().nullish(),
});

export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

const DomainsGetInputSchema = z.object({ id: IdSchema });

export type DomainsGetInput = z.input<typeof DomainsGetInputSchema>;

export type DomainsGetResponse = NgrokReservedDomain;

const DomainsCreateInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.describe('The hostname to reserve, e.g. app.example.com.'),
	region: z.string().optional(),
	description: z.string().optional(),
	metadata: z.string().max(4096).optional(),
	certificate_id: z
		.string()
		.optional()
		.describe('Attach an uploaded certificate instead of an automatic one.'),
	certificate_management_policy: z
		.string()
		.optional()
		.describe('The policy for automatic certificate issuance and renewal.'),
	resolves_to: z
		.array(z.string().min(1))
		.optional()
		.describe('Only let these ngrok IP addresses serve the domain.'),
});

export type DomainsCreateInput = z.input<typeof DomainsCreateInputSchema>;

export type DomainsCreateResponse = NgrokReservedDomain;

const DomainsUpdateInputSchema = z.object({
	id: IdSchema,
	description: z.string().optional(),
	metadata: z.string().max(4096).optional(),
	certificate_id: z.string().optional(),
	certificate_management_policy: z.string().optional(),
	resolves_to: z.array(z.string().min(1)).optional(),
});

export type DomainsUpdateInput = z.input<typeof DomainsUpdateInputSchema>;

export type DomainsUpdateResponse = NgrokReservedDomain;

const DomainsDeleteInputSchema = z.object({ id: IdSchema });

export type DomainsDeleteInput = z.input<typeof DomainsDeleteInputSchema>;

export type DomainsDeleteResponse = EndpointsDeleteResponse;

// ── tunnels.list ──────────────────────────────────────────────────────────

const TunnelsListInputSchema = z.object({
	before_id: PagingSchema.before_id,
	limit: PagingSchema.limit,
});

export type TunnelsListInput = z.input<typeof TunnelsListInputSchema>;

export const TunnelSchema = z
	.object({
		id: z.string().nullish(),
		public_url: z.string().nullish(),
		started_at: TimestampSchema,
		metadata: z.string().nullish(),
		proto: z.string().nullish(),
		region: z.string().nullish(),
		tunnel_session: RefSchema.nullish(),
		endpoint: RefSchema.nullish(),
		// A map, not an array: ngrok matches tunnel-group backends against it.
		labels: z.record(z.string(), z.string()).nullish(),
		backends: z.array(RefSchema).nullish(),
		forwards_to: z.string().nullish(),
	})
	.loose();

export type NgrokTunnel = z.infer<typeof TunnelSchema>;

const TunnelsListResponseSchema = z.object({
	tunnels: z.array(TunnelSchema),
	uri: z.string().nullish(),
	next_page_uri: z.string().nullish(),
});

export type TunnelsListResponse = z.infer<typeof TunnelsListResponseSchema>;

// ── apiKeys.* ─────────────────────────────────────────────────────────────

const ApiKeysListInputSchema = z.object({ ...PagingSchema });

export type ApiKeysListInput = z.input<typeof ApiKeysListInputSchema>;

/**
 * The `token` is only present on the create response. A later read returns the
 * key without it, so the token has to be stored when it is minted.
 */
export const ApiKeySchema = z
	.object({
		id: z.string().nullish(),
		uri: z.string().nullish(),
		description: z.string().nullish(),
		metadata: z.string().nullish(),
		created_at: TimestampSchema,
		token: z.string().nullish(),
		owner_id: z.string().nullish(),
	})
	.loose();

export type NgrokApiKey = z.infer<typeof ApiKeySchema>;

const ApiKeysListResponseSchema = z.object({
	keys: z.array(ApiKeySchema),
	uri: z.string().nullish(),
	next_page_uri: z.string().nullish(),
});

export type ApiKeysListResponse = z.infer<typeof ApiKeysListResponseSchema>;

const ApiKeysCreateInputSchema = z.object({
	description: z.string().optional(),
	metadata: z.string().max(4096).optional(),
	owner_id: z
		.string()
		.optional()
		.describe('Create the key for this user instead of the caller.'),
});

export type ApiKeysCreateInput = z.input<typeof ApiKeysCreateInputSchema>;

export type ApiKeysCreateResponse = NgrokApiKey;

const ApiKeysDeleteInputSchema = z.object({ id: IdSchema });

export type ApiKeysDeleteInput = z.input<typeof ApiKeysDeleteInputSchema>;

export type ApiKeysDeleteResponse = EndpointsDeleteResponse;

// ── eventSubscriptions.* ──────────────────────────────────────────────────

const EventsListInputSchema = z.object({ ...PagingSchema });

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventSourceSchema = z
	.object({ type: z.string().nullish(), uri: z.string().nullish() })
	.loose();

const EventDestinationSchema = z
	.object({
		id: z.string().nullish(),
		uri: z.string().nullish(),
		description: z.string().nullish(),
		metadata: z.string().nullish(),
		created_at: TimestampSchema,
		target: z
			.object({ id: z.string().nullish(), uri: z.string().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export const EventSubscriptionSchema = z
	.object({
		id: z.string().nullish(),
		uri: z.string().nullish(),
		created_at: TimestampSchema,
		metadata: z.string().nullish(),
		description: z.string().nullish(),
		sources: z.array(EventSourceSchema).nullish(),
		destinations: z.array(EventDestinationSchema).nullish(),
	})
	.loose();

export type NgrokEventSubscription = z.infer<typeof EventSubscriptionSchema>;

const EventsListResponseSchema = z.object({
	event_subscriptions: z.array(EventSubscriptionSchema),
	uri: z.string().nullish(),
	next_page_uri: z.string().nullish(),
});

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const EventsGetInputSchema = z.object({ id: IdSchema });

export type EventsGetInput = z.input<typeof EventsGetInputSchema>;

export type EventsGetResponse = NgrokEventSubscription;

const EventsCreateInputSchema = z.object({
	sources: z
		.array(z.object({ type: z.string().min(1) }))
		.min(1)
		.describe(
			'Event types that trigger the subscription, e.g. [{ type: "endpoint.created" }].',
		),
	destination_ids: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Where to deliver the events. A destination is created separately and is not wrapped here.',
		),
	description: z.string().optional(),
	metadata: z.string().max(4096).optional(),
});

export type EventsCreateInput = z.input<typeof EventsCreateInputSchema>;

export type EventsCreateResponse = NgrokEventSubscription;

const EventsDeleteInputSchema = z.object({ id: IdSchema });

export type EventsDeleteInput = z.input<typeof EventsDeleteInputSchema>;

export type EventsDeleteResponse = EndpointsDeleteResponse;

// ── Registry ──────────────────────────────────────────────────────────────

export type NgrokEndpointInputs = {
	endpointsList: EndpointsListInput;
	endpointsGet: EndpointsGetInput;
	endpointsCreate: EndpointsCreateInput;
	endpointsUpdate: EndpointsUpdateInput;
	endpointsDelete: EndpointsDeleteInput;
	domainsList: DomainsListInput;
	domainsGet: DomainsGetInput;
	domainsCreate: DomainsCreateInput;
	domainsUpdate: DomainsUpdateInput;
	domainsDelete: DomainsDeleteInput;
	tunnelsList: TunnelsListInput;
	apiKeysList: ApiKeysListInput;
	apiKeysCreate: ApiKeysCreateInput;
	apiKeysDelete: ApiKeysDeleteInput;
	eventsList: EventsListInput;
	eventsGet: EventsGetInput;
	eventsCreate: EventsCreateInput;
	eventsDelete: EventsDeleteInput;
};

export type NgrokEndpointOutputs = {
	endpointsList: EndpointsListResponse;
	endpointsGet: EndpointsGetResponse;
	endpointsCreate: EndpointsCreateResponse;
	endpointsUpdate: EndpointsUpdateResponse;
	endpointsDelete: EndpointsDeleteResponse;
	domainsList: DomainsListResponse;
	domainsGet: DomainsGetResponse;
	domainsCreate: DomainsCreateResponse;
	domainsUpdate: DomainsUpdateResponse;
	domainsDelete: DomainsDeleteResponse;
	tunnelsList: TunnelsListResponse;
	apiKeysList: ApiKeysListResponse;
	apiKeysCreate: ApiKeysCreateResponse;
	apiKeysDelete: ApiKeysDeleteResponse;
	eventsList: EventsListResponse;
	eventsGet: EventsGetResponse;
	eventsCreate: EventsCreateResponse;
	eventsDelete: EventsDeleteResponse;
};

export const NgrokEndpointInputSchemas = {
	endpointsList: EndpointsListInputSchema,
	endpointsGet: EndpointsGetInputSchema,
	endpointsCreate: EndpointsCreateInputSchema,
	endpointsUpdate: EndpointsUpdateInputSchema,
	endpointsDelete: EndpointsDeleteInputSchema,
	domainsList: DomainsListInputSchema,
	domainsGet: DomainsGetInputSchema,
	domainsCreate: DomainsCreateInputSchema,
	domainsUpdate: DomainsUpdateInputSchema,
	domainsDelete: DomainsDeleteInputSchema,
	tunnelsList: TunnelsListInputSchema,
	apiKeysList: ApiKeysListInputSchema,
	apiKeysCreate: ApiKeysCreateInputSchema,
	apiKeysDelete: ApiKeysDeleteInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsCreate: EventsCreateInputSchema,
	eventsDelete: EventsDeleteInputSchema,
} as const;

export const NgrokEndpointOutputSchemas = {
	endpointsList: EndpointsListResponseSchema,
	endpointsGet: EndpointSchema,
	endpointsCreate: EndpointSchema,
	endpointsUpdate: EndpointSchema,
	endpointsDelete: DeletedResponseSchema,
	domainsList: DomainsListResponseSchema,
	domainsGet: ReservedDomainSchema,
	domainsCreate: ReservedDomainSchema,
	domainsUpdate: ReservedDomainSchema,
	domainsDelete: DeletedResponseSchema,
	tunnelsList: TunnelsListResponseSchema,
	apiKeysList: ApiKeysListResponseSchema,
	apiKeysCreate: ApiKeySchema,
	apiKeysDelete: DeletedResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsGet: EventSubscriptionSchema,
	eventsCreate: EventSubscriptionSchema,
	eventsDelete: DeletedResponseSchema,
} as const;
