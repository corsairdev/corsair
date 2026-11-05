import { z } from 'zod';

// The Grafbase platform API is GraphQL and warns it can change at any time, so
// outputs are `.loose()` and their nullable fields nullish: a field Grafbase
// adds or omits cannot fail a call that has already happened. Schema
// reference: https://grafbase.com/api-docs

const PageInfoSchema = z
	.object({
		hasNextPage: z.boolean(),
		hasPreviousPage: z.boolean().nullish(),
		startCursor: z.string().nullish(),
		endCursor: z.string().nullish(),
	})
	.loose();

const AccountRefSchema = z
	.object({
		id: z.string(),
		slug: z.string().nullish(),
		name: z.string().nullish(),
		plan: z.string().nullish(),
	})
	.loose();

export const GraphSchema = z
	.object({
		id: z.string(),
		slug: z.string(),
		createdAt: z.string().nullish(),
		account: AccountRefSchema.nullish(),
		productionBranch: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
				environment: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type GrafbaseGraph = z.infer<typeof GraphSchema>;

const SubgraphRefSchema = z
	.object({ name: z.string().nullish() })
	.loose()
	.nullish();

// ── viewer.get ────────────────────────────────────────────────────────────

const ViewerGetInputSchema = z.object({});

export type ViewerGetInput = z.input<typeof ViewerGetInputSchema>;

const ViewerGetResponseSchema = z.object({
	viewer: z
		.object({
			id: z.string(),
			email: z.string().nullish(),
			name: z.string().nullish(),
			createdAt: z.string().nullish(),
		})
		.loose(),
});

export type ViewerGetResponse = z.infer<typeof ViewerGetResponseSchema>;

// ── graphs.list ───────────────────────────────────────────────────────────

const GraphsListInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	first: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Page size, up to 100.'),
	after: z.string().optional().describe('Cursor from the previous page.'),
});

export type GraphsListInput = z.input<typeof GraphsListInputSchema>;

const GraphsListResponseSchema = z.object({
	account: AccountRefSchema.nullish(),
	graphs: z.array(GraphSchema),
	hasNextPage: z.boolean(),
	nextCursor: z
		.string()
		.nullable()
		.describe('Cursor for the next page; null on the last page.'),
});

export type GraphsListResponse = z.infer<typeof GraphsListResponseSchema>;

// ── graphs.get ────────────────────────────────────────────────────────────

const GraphsGetInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	graphSlug: z.string().min(1).describe('The graph slug.'),
});

export type GraphsGetInput = z.input<typeof GraphsGetInputSchema>;

const GraphsGetResponseSchema = z.object({
	graph: GraphSchema.nullish(),
});

export type GraphsGetResponse = z.infer<typeof GraphsGetResponseSchema>;

// ── graphs.create ─────────────────────────────────────────────────────────

const GraphsCreateInputSchema = z.object({
	accountId: z
		.string()
		.min(1)
		.describe('The organization to create the graph in.'),
	graphSlug: z.string().min(1).describe('Slug for the new graph.'),
});

export type GraphsCreateInput = z.input<typeof GraphsCreateInputSchema>;

// graphCreate returns a union: GraphCreateSuccess carries the graph, the other
// members only carry __typename.
const GraphsCreateResponseSchema = z
	.object({
		__typename: z.string(),
		graph: GraphSchema.nullish(),
	})
	.loose();

export type GraphsCreateResponse = z.infer<typeof GraphsCreateResponseSchema>;

// ── graphs.delete ─────────────────────────────────────────────────────────

const GraphsDeleteInputSchema = z.object({
	id: z.string().min(1).describe('The graph ID.'),
});

export type GraphsDeleteInput = z.input<typeof GraphsDeleteInputSchema>;

const GraphsDeleteResponseSchema = z.object({ __typename: z.string() }).loose();

export type GraphsDeleteResponse = z.infer<typeof GraphsDeleteResponseSchema>;

// ── subgraphs.get ─────────────────────────────────────────────────────────

const SubgraphsGetInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	graphSlug: z.string().min(1).describe('The graph slug.'),
	subgraphName: z.string().min(1).describe('The subgraph name.'),
	branch: z
		.string()
		.optional()
		.describe('The branch to read from; defaults to the production branch.'),
});

export type SubgraphsGetInput = z.input<typeof SubgraphsGetInputSchema>;

const SubgraphsGetResponseSchema = z.object({
	subgraph: z
		.object({
			name: z.string(),
			url: z.string().nullish(),
			schema: z.string().nullish(),
			createdAt: z.string().nullish(),
			updatedAt: z.string().nullish(),
		})
		.loose()
		.nullish(),
});

export type SubgraphsGetResponse = z.infer<typeof SubgraphsGetResponseSchema>;

// ── subgraphs.publish ─────────────────────────────────────────────────────

const SubgraphsPublishInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	graphSlug: z.string().min(1).describe('The graph slug.'),
	subgraph: z.string().min(1).describe('The subgraph name.'),
	schema: z.string().min(1).describe('The subgraph SDL to publish.'),
	url: z
		.string()
		.optional()
		.describe(
			'The subgraph routing URL. Omit it for an existing subgraph or a virtual one.',
		),
	branch: z
		.string()
		.optional()
		.describe('The branch to publish to; defaults to the production branch.'),
	message: z.string().optional().describe('A note kept in the deploy history.'),
	virtual: z
		.boolean()
		.optional()
		.describe('True publishes a virtual subgraph with no routing URL.'),
});

export type SubgraphsPublishInput = z.input<typeof SubgraphsPublishInputSchema>;

// publish returns a union: FederatedGraphCompositionError carries `messages`
// and PublishDeploymentFailure carries `deploymentError`; the success, no
// change, forbidden and unknown graph members only carry __typename.
const SubgraphsPublishResponseSchema = z
	.object({
		__typename: z.string(),
		messages: z.array(z.string()).nullish(),
		deploymentError: z.string().nullish(),
	})
	.loose();

export type SubgraphsPublishResponse = z.infer<
	typeof SubgraphsPublishResponseSchema
>;

// ── subgraphs.delete ──────────────────────────────────────────────────────

const SubgraphsDeleteInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	graphSlug: z.string().min(1).describe('The graph slug.'),
	branch: z.string().min(1).describe('The branch the subgraph is on.'),
	subgraph: z.string().min(1).describe('The subgraph name.'),
	dryRun: z
		.boolean()
		.default(false)
		.describe('Validate the removal without deploying it.'),
	message: z.string().optional().describe('A note kept in the deploy history.'),
});

export type SubgraphsDeleteInput = z.input<typeof SubgraphsDeleteInputSchema>;

// deleteSubgraph returns a union: the failure and composition error members
// carry the reason, the success member only __typename.
const SubgraphsDeleteResponseSchema = z
	.object({
		__typename: z.string(),
		deploymentError: z.string().nullish(),
		messages: z.array(z.string()).nullish(),
	})
	.loose();

export type SubgraphsDeleteResponse = z.infer<
	typeof SubgraphsDeleteResponseSchema
>;

// ── schemaVersions.list ───────────────────────────────────────────────────

const SchemaVersionsListInputSchema = z.object({
	accountSlug: z.string().min(1).describe('The organization slug.'),
	graphSlug: z.string().min(1).describe('The graph slug.'),
	branch: z.string().optional().describe('Only versions on this branch.'),
	subgraphName: z
		.string()
		.optional()
		.describe('Only versions of this subgraph.'),
	populated: z
		.boolean()
		.default(true)
		.describe('Only versions with changes. Default true.'),
	first: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Page size, up to 100.'),
	after: z.string().optional().describe('Cursor from the previous page.'),
});

export type SchemaVersionsListInput = z.input<
	typeof SchemaVersionsListInputSchema
>;

const SchemaVersionSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().nullish(),
		message: z.string().nullish(),
		schema: z.string().nullish(),
		subgraph: SubgraphRefSchema,
	})
	.loose();

export type GrafbaseSchemaVersion = z.infer<typeof SchemaVersionSchema>;

const SchemaVersionsListResponseSchema = z.object({
	versions: z.array(SchemaVersionSchema),
	hasNextPage: z.boolean(),
	nextCursor: z
		.string()
		.nullable()
		.describe('Cursor for the next page; null on the last page.'),
});

export type SchemaVersionsListResponse = z.infer<
	typeof SchemaVersionsListResponseSchema
>;

// ── deployments.get ───────────────────────────────────────────────────────

const DeploymentsGetInputSchema = z.object({
	id: z.string().min(1).describe('The deployment ID.'),
});

export type DeploymentsGetInput = z.input<typeof DeploymentsGetInputSchema>;

const DeploymentsGetResponseSchema = z.object({
	deployment: z
		.object({
			id: z.string(),
			status: z.string().nullish(),
			createdAt: z.string().nullish(),
			startedAt: z.string().nullish(),
			finishedAt: z.string().nullish(),
			duration: z.number().nullish(),
			message: z.string().nullish(),
			isRedeployable: z.boolean().nullish(),
			changeCounts: z
				.object({
					addedFields: z.number().nullish(),
					addedTypes: z.number().nullish(),
					changedFields: z.number().nullish(),
					changedTypes: z.number().nullish(),
					removedFields: z.number().nullish(),
					removedTypes: z.number().nullish(),
				})
				.loose()
				.nullish(),
			subgraph: SubgraphRefSchema,
		})
		.loose()
		.nullish(),
});

export type DeploymentsGetResponse = z.infer<
	typeof DeploymentsGetResponseSchema
>;

// ── accessTokens.list ─────────────────────────────────────────────────────

export const AccessTokenSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		accountId: z.string().nullish(),
		createdAt: z.string().nullish(),
		expiresAt: z.string().nullish(),
		graphScopes: z
			.array(z.object({ id: z.string(), slug: z.string().nullish() }).loose())
			.nullish(),
	})
	.loose();

export type GrafbaseAccessToken = z.infer<typeof AccessTokenSchema>;

const AccessTokensListInputSchema = z.object({
	first: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Page size, up to 100.'),
	after: z.string().optional().describe('Cursor from the previous page.'),
});

export type AccessTokensListInput = z.input<typeof AccessTokensListInputSchema>;

const AccessTokensListResponseSchema = z.object({
	tokens: z.array(AccessTokenSchema),
	hasNextPage: z.boolean(),
	nextCursor: z
		.string()
		.nullable()
		.describe('Cursor for the next page; null on the last page.'),
});

export type AccessTokensListResponse = z.infer<
	typeof AccessTokensListResponseSchema
>;

// ── accessTokens.create ───────────────────────────────────────────────────

export const GRAFBASE_ACCESS_TOKEN_KINDS = ['USER', 'ACCOUNT'] as const;

const AccessTokensCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('A name to recognize the token by.'),
		kind: z
			.enum(GRAFBASE_ACCESS_TOKEN_KINDS)
			.describe(
				'USER acts as you. ACCOUNT acts as an organization and needs accountId.',
			),
		accountId: z
			.string()
			.optional()
			.describe('The organization ID; required for ACCOUNT tokens.'),
		expiresAt: z
			.string()
			.optional()
			.describe(
				'When the token expires, as ISO 8601 such as 2026-12-31T23:59:59Z. Omit for no expiry.',
			),
		graphScopes: z
			.array(z.string())
			.optional()
			.describe(
				'Organization graph IDs the token may use; omit to allow all of them.',
			),
	})
	.refine(
		(value) =>
			value.kind !== 'ACCOUNT' ||
			(value.accountId !== undefined && value.accountId.length > 0),
		{
			message: 'ACCOUNT tokens need accountId.',
			path: ['accountId'],
		},
	);

export type AccessTokensCreateInput = z.input<
	typeof AccessTokensCreateInputSchema
>;

// accessTokenCreate returns a union; only AccessTokenCreateSuccess carries the
// jwt and the token, and the jwt is shown this one time.
const AccessTokensCreateResponseSchema = z
	.object({
		__typename: z.string(),
		jwt: z.string().nullish(),
		token: AccessTokenSchema.nullish(),
	})
	.loose();

export type AccessTokensCreateResponse = z.infer<
	typeof AccessTokensCreateResponseSchema
>;

// ── accessTokens.delete ───────────────────────────────────────────────────

const AccessTokensDeleteInputSchema = z.object({
	id: z.string().min(1).describe('The token ID.'),
});

export type AccessTokensDeleteInput = z.input<
	typeof AccessTokensDeleteInputSchema
>;

const AccessTokensDeleteResponseSchema = z
	.object({ __typename: z.string() })
	.loose();

export type AccessTokensDeleteResponse = z.infer<
	typeof AccessTokensDeleteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type GrafbaseEndpointInputs = {
	viewerGet: ViewerGetInput;
	graphsList: GraphsListInput;
	graphsGet: GraphsGetInput;
	graphsCreate: GraphsCreateInput;
	graphsDelete: GraphsDeleteInput;
	subgraphsGet: SubgraphsGetInput;
	subgraphsPublish: SubgraphsPublishInput;
	subgraphsDelete: SubgraphsDeleteInput;
	schemaVersionsList: SchemaVersionsListInput;
	deploymentsGet: DeploymentsGetInput;
	accessTokensList: AccessTokensListInput;
	accessTokensCreate: AccessTokensCreateInput;
	accessTokensDelete: AccessTokensDeleteInput;
};

export type GrafbaseEndpointOutputs = {
	viewerGet: ViewerGetResponse;
	graphsList: GraphsListResponse;
	graphsGet: GraphsGetResponse;
	graphsCreate: GraphsCreateResponse;
	graphsDelete: GraphsDeleteResponse;
	subgraphsGet: SubgraphsGetResponse;
	subgraphsPublish: SubgraphsPublishResponse;
	subgraphsDelete: SubgraphsDeleteResponse;
	schemaVersionsList: SchemaVersionsListResponse;
	deploymentsGet: DeploymentsGetResponse;
	accessTokensList: AccessTokensListResponse;
	accessTokensCreate: AccessTokensCreateResponse;
	accessTokensDelete: AccessTokensDeleteResponse;
};

export const GrafbaseEndpointInputSchemas = {
	viewerGet: ViewerGetInputSchema,
	graphsList: GraphsListInputSchema,
	graphsGet: GraphsGetInputSchema,
	graphsCreate: GraphsCreateInputSchema,
	graphsDelete: GraphsDeleteInputSchema,
	subgraphsGet: SubgraphsGetInputSchema,
	subgraphsPublish: SubgraphsPublishInputSchema,
	subgraphsDelete: SubgraphsDeleteInputSchema,
	schemaVersionsList: SchemaVersionsListInputSchema,
	deploymentsGet: DeploymentsGetInputSchema,
	accessTokensList: AccessTokensListInputSchema,
	accessTokensCreate: AccessTokensCreateInputSchema,
	accessTokensDelete: AccessTokensDeleteInputSchema,
} as const;

export const GrafbaseEndpointOutputSchemas = {
	viewerGet: ViewerGetResponseSchema,
	graphsList: GraphsListResponseSchema,
	graphsGet: GraphsGetResponseSchema,
	graphsCreate: GraphsCreateResponseSchema,
	graphsDelete: GraphsDeleteResponseSchema,
	subgraphsGet: SubgraphsGetResponseSchema,
	subgraphsPublish: SubgraphsPublishResponseSchema,
	subgraphsDelete: SubgraphsDeleteResponseSchema,
	schemaVersionsList: SchemaVersionsListResponseSchema,
	deploymentsGet: DeploymentsGetResponseSchema,
	accessTokensList: AccessTokensListResponseSchema,
	accessTokensCreate: AccessTokensCreateResponseSchema,
	accessTokensDelete: AccessTokensDeleteResponseSchema,
} as const;
