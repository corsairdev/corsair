import { z } from 'zod';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makePlainRequest, PlainAPIError } from '../client';
import type { PlainEndpoints } from '../index';
import type { PlainEndpointOutputs } from './types';
import {
	CustomerGroupSchema,
	CustomerSchema,
	MutationErrorSchema,
	PageInfoSchema,
	PlainEndpointInputSchemas,
	PlainEndpointOutputSchemas,
	ThreadLinkSchema,
	ThreadSummarySchema,
	TierSchema,
} from './types';

type PlainContext = Parameters<PlainEndpoints['getCustomerById']>[0];

// Every `unknown` in this file carries a JUSTIFY comment. The rule is: raw
// GraphQL JSON enters as `unknown` and is parsed by a zod schema before any
// field is read. No `as` casts and no `typeof` probes of untyped data appear
// anywhere below; all branching happens on zod-validated values.

const MutationPayloadErrorSchema = z
	.object({
		error: MutationErrorSchema.nullable().optional(),
	})
	.loose();

function throwIfMutationPayloadError(
	// JUSTIFY(unknown): one decoded GraphQL mutation payload. Shape-checked
	// by `safeParse` below; fields are never read without validation.
	payload: unknown,
	operationName: string,
): void {
	const parsed = MutationPayloadErrorSchema.safeParse(payload);
	// `success` discrimination is the zod-idiomatic validated check.
	if (parsed.success === false) {
		return;
	}
	const mutationError = parsed.data.error;
	if (mutationError === null || mutationError === undefined) {
		return;
	}
	throw new PlainAPIError(`${operationName}: ${mutationError.message}`, {
		code: mutationError.code,
	});
}

function requireMutationPayload<Payload>(
	payload: Payload | null | undefined,
	operationName: string,
	field: string,
): Payload {
	if (payload === null || payload === undefined) {
		throw new PlainAPIError(
			`${operationName}: missing ${field} in Plain API response`,
		);
	}
	return payload;
}

async function requestAndParse<Schema extends z.ZodTypeAny>(
	ctx: PlainContext,
	event: string,
	// JUSTIFY(unknown): `logEventFromContext` (corsair core) requires
	// `Record<string, unknown>` for the event payload; this only forwards it.
	meta: Record<string, unknown>,
	query: string,
	// JUSTIFY(unknown): GraphQL variables are arbitrary JSON (see client.ts).
	variables: Record<string, unknown> | undefined,
	operationName: string,
	outputSchema: Schema,
): Promise<z.infer<Schema>> {
	if (ctx.key === undefined) {
		throw new AuthMissingError('plain', 'api_key');
	}

	// JUSTIFY(unknown): decoded GraphQL JSON envelope, validated by
	// `outputSchema` on the next line before anything reads it.
	const data: unknown = await makePlainRequest<unknown>(
		query,
		ctx.key,
		variables,
		operationName,
	);
	// The schema is `z.infer<Schema>`-typed, so the parsed value lands in a
	// precisely-typed binding with no cast.
	const parsed: z.infer<Schema> = outputSchema.parse(data);
	await logEventFromContext(ctx, event, meta, 'completed');
	return parsed;
}

// Raw `customers(...)` envelope. `type CustomerConnection`
// { edges { node } pageInfo totalCount } in schema.graphql.
const CustomersConnectionEnvelopeSchema = z
	.object({
		customers: z.object({
			totalCount: z.number().int(),
			pageInfo: PageInfoSchema,
			edges: z.array(z.object({ node: CustomerSchema })),
		}),
	})
	.loose();

// Raw `threads(...)` envelope. `type ThreadConnection`
// { edges { node } pageInfo totalCount } in schema.graphql.
const ThreadsConnectionEnvelopeSchema = z
	.object({
		threads: z.object({
			totalCount: z.number().int(),
			pageInfo: PageInfoSchema,
			edges: z.array(z.object({ node: ThreadSummarySchema })),
		}),
	})
	.loose();

// Raw `tiers(...)` envelope. `type TierConnection` { edges pageInfo } —
// note: no totalCount on this connection in schema.graphql.
const TiersConnectionEnvelopeSchema = z
	.object({
		tiers: z.object({
			pageInfo: PageInfoSchema,
			edges: z.array(z.object({ node: TierSchema })),
		}),
	})
	.loose();

// Raw `customerGroups(...)` envelope. `type CustomerGroupConnection`
// { edges pageInfo } — no totalCount in schema.graphql.
const CustomerGroupsConnectionEnvelopeSchema = z
	.object({
		customerGroups: z.object({
			pageInfo: PageInfoSchema,
			edges: z.array(z.object({ node: CustomerGroupSchema })),
		}),
	})
	.loose();

// Raw customer-threads-with-links envelope for fetchIssues: `customer(id)`
// -> `threads(first/after/last/before)` (`type ThreadConnection`) ->
// `links(first:)` (`type ThreadLinkConnection` { edges { node } }) in
// schema.graphql. `ThreadLink` is an interface; the selected fields
// (id/sourceId/sourceType/title/description/url/status/linkType) are the
// interface fields, so no inline fragments are needed.
const FetchIssuesEnvelopeSchema = z
	.object({
		customer: z
			.object({
				threads: z.object({
					totalCount: z.number().int(),
					pageInfo: PageInfoSchema,
					edges: z.array(
						z.object({
							node: z
								.object({
									id: z.string(),
									ref: z.string(),
									title: z.string(),
									links: z.object({
										edges: z.array(z.object({ node: ThreadLinkSchema })),
									}),
								})
								.loose(),
						}),
					),
				}),
			})
			.loose()
			.nullable(),
	})
	.loose();

export const getCustomerById: PlainEndpoints['getCustomerById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomerById.parse(input);
	return requestAndParse(
		ctx,
		'plain.customers.getById',
		parsed,
		`query GetCustomerById($customerId: ID!) {
  customer: customer(customerId: $customerId) {
    id
    externalId
    fullName
    shortName
    email {
      email
      isVerified
    }
  }
}`,
		parsed,
		'GetCustomerById',
		PlainEndpointOutputSchemas.getCustomerById,
	);
};

export const getCustomerByEmail: PlainEndpoints['getCustomerByEmail'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomerByEmail.parse(input);
	return requestAndParse(
		ctx,
		'plain.customers.getByEmail',
		{ email: parsed.email },
		`query GetCustomerByEmail($email: String!) {
  customer: customerByEmail(email: $email) {
    id
    externalId
    fullName
    shortName
    email {
      email
      isVerified
    }
  }
}`,
		parsed,
		'GetCustomerByEmail',
		PlainEndpointOutputSchemas.getCustomerByEmail,
	);
};

export const getCustomers: PlainEndpoints['getCustomers'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomers.parse(input);

	const envelope = await requestAndParse(
		ctx,
		'plain.customers.list',
		{},
		`query GetCustomers(
  $filters: CustomersFilter
  $sortBy: CustomersSort
  $first: Int
  $after: String
  $last: Int
  $before: String
) {
  customers(filters: $filters, sortBy: $sortBy, first: $first, after: $after, last: $last, before: $before) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        externalId
        fullName
        shortName
        email {
          email
          isVerified
        }
      }
    }
  }
}`,
		parsed,
		'GetCustomers',
		CustomersConnectionEnvelopeSchema,
	);

	const connection = envelope.customers;
	return PlainEndpointOutputSchemas.getCustomers.parse({
		customers: connection.edges.map((edge) => edge.node),
		pageInfo: connection.pageInfo,
		totalCount: connection.totalCount,
	});
};

// `upsertCustomer(input: UpsertCustomerInput!)` ->
// `type UpsertCustomerOutput` { result customer error } in schema.graphql.
const UpsertCustomerEnvelopeSchema = z
	.object({
		upsertCustomer: PlainEndpointOutputSchemas.upsertCustomer
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const upsertCustomer: PlainEndpoints['upsertCustomer'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.upsertCustomer.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.customers.upsert',
		{},
		`mutation UpsertCustomer($input: UpsertCustomerInput!) {
  upsertCustomer(input: $input) {
    result
    customer {
      id
      externalId
      fullName
      shortName
      email {
        email
        isVerified
      }
    }
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'UpsertCustomer',
		UpsertCustomerEnvelopeSchema,
	);

	const payload = requireMutationPayload(
		envelope.upsertCustomer,
		'UpsertCustomer',
		'upsertCustomer',
	);
	throwIfMutationPayloadError(payload, 'UpsertCustomer');
	return PlainEndpointOutputSchemas.upsertCustomer.parse({
		result: payload.result,
		customer: payload.customer,
	});
};

// `deleteCustomer(input: DeleteCustomerInput!)` ->
// `type DeleteCustomerOutput` { error } in schema.graphql.
const DeleteCustomerEnvelopeSchema = z
	.object({
		deleteCustomer: MutationPayloadErrorSchema.nullable().optional(),
	})
	.loose();

export const deleteCustomer: PlainEndpoints['deleteCustomer'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.deleteCustomer.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.customers.delete',
		parsed,
		`mutation DeleteCustomer($input: DeleteCustomerInput!) {
  deleteCustomer(input: $input) {
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'DeleteCustomer',
		DeleteCustomerEnvelopeSchema,
	);

	throwIfMutationPayloadError(envelope.deleteCustomer, 'DeleteCustomer');

	return { success: true };
};

// `createThread(input: CreateThreadInput!)` ->
// `type CreateThreadOutput` { thread error } in schema.graphql.
const CreateThreadEnvelopeSchema = z
	.object({
		createThread: PlainEndpointOutputSchemas.createThread
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const createThread: PlainEndpoints['createThread'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.createThread.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.threads.create',
		{ channel: parsed.channel, title: parsed.title },
		`mutation CreateThread($input: CreateThreadInput!) {
  createThread(input: $input) {
    thread {
      id
      ref
      title
      status
      priority
    }
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'CreateThread',
		CreateThreadEnvelopeSchema,
	);

	const payload = requireMutationPayload(
		envelope.createThread,
		'CreateThread',
		'createThread',
	);
	throwIfMutationPayloadError(payload, 'CreateThread');
	return PlainEndpointOutputSchemas.createThread.parse({
		thread: payload.thread,
	});
};

export const getThreadById: PlainEndpoints['getThreadById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getThreadById.parse(input);
	return requestAndParse(
		ctx,
		'plain.threads.getById',
		parsed,
		`query GetThreadById($threadId: ID!) {
  thread: thread(threadId: $threadId) {
    id
    ref
    title
    status
    priority
  }
}`,
		parsed,
		'GetThreadById',
		PlainEndpointOutputSchemas.getThreadById,
	);
};

async function queryThreadsInternal(
	ctx: PlainContext,
	input: Parameters<PlainEndpoints['queryThreads']>[1],
	event: string,
): Promise<PlainEndpointOutputs['queryThreads']> {
	const parsed = PlainEndpointInputSchemas.queryThreads.parse(input);
	const envelope = await requestAndParse(
		ctx,
		event,
		{},
		`query QueryThreads(
  $filters: ThreadsFilter
  $sortBy: ThreadsSort
  $first: Int
  $after: String
  $last: Int
  $before: String
) {
  threads(filters: $filters, sortBy: $sortBy, first: $first, after: $after, last: $last, before: $before) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        ref
        title
        status
        priority
      }
    }
  }
}`,
		parsed,
		'QueryThreads',
		ThreadsConnectionEnvelopeSchema,
	);

	const connection = envelope.threads;
	return PlainEndpointOutputSchemas.queryThreads.parse({
		threads: connection.edges.map((edge) => edge.node),
		pageInfo: connection.pageInfo,
		totalCount: connection.totalCount,
	});
}

export const queryThreads: PlainEndpoints['queryThreads'] = (ctx, input) =>
	queryThreadsInternal(ctx, input, 'plain.threads.query');

export const listThreadsDeprecated: PlainEndpoints['listThreadsDeprecated'] = (
	ctx,
	input,
) => queryThreadsInternal(ctx, input, 'plain.threads.listDeprecated');

export const fetchIssues: PlainEndpoints['fetchIssues'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.fetchIssues.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.threads.fetchIssues',
		{ customerId: parsed.customerId },
		`query FetchIssues(
  $customerId: ID!
  $threadFirst: Int
  $threadAfter: String
  $threadLast: Int
  $threadBefore: String
  $linkFirst: Int
) {
  customer(customerId: $customerId) {
    threads(first: $threadFirst, after: $threadAfter, last: $threadLast, before: $threadBefore) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          ref
          title
          links(first: $linkFirst) {
            edges {
              node {
                id
                sourceId
                sourceType
                title
                description
                url
                status
                linkType
              }
            }
          }
        }
      }
    }
  }
}`,
		parsed,
		'FetchIssues',
		FetchIssuesEnvelopeSchema,
	);

	// A customer id with no record yields an empty issue list (not an error),
	// matching the previous behaviour of this endpoint.
	const threads = envelope.customer?.threads;
	const issues =
		threads === undefined
			? []
			: threads.edges.flatMap((threadEdge) =>
					threadEdge.node.links.edges.map((linkEdge) => ({
						threadId: threadEdge.node.id,
						threadRef: threadEdge.node.ref,
						threadTitle: threadEdge.node.title,
						link: linkEdge.node,
					})),
				);

	return PlainEndpointOutputSchemas.fetchIssues.parse({
		issues,
		pageInfo: threads?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
		totalThreads: threads?.totalCount ?? 0,
	});
};

// `replyToThread(input: ReplyToThreadInput!)` ->
// `type ReplyToThreadOutput` { error } in schema.graphql.
const SendMessageEnvelopeSchema = z
	.object({
		replyToThread: MutationPayloadErrorSchema.nullable().optional(),
	})
	.loose();

export const sendMessage: PlainEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.sendMessage.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.threads.reply',
		{ threadId: parsed.threadId },
		`mutation ReplyToThread($input: ReplyToThreadInput!) {
  replyToThread(input: $input) {
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'ReplyToThread',
		SendMessageEnvelopeSchema,
	);

	throwIfMutationPayloadError(envelope.replyToThread, 'ReplyToThread');

	return { success: true };
};

// `updateThreadTitle(input: UpdateThreadTitleInput!)` ->
// `type UpdateThreadTitleOutput` { thread error } in schema.graphql.
const UpdateThreadEnvelopeSchema = z
	.object({
		updateThreadTitle: PlainEndpointOutputSchemas.updateThread
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const updateThread: PlainEndpoints['updateThread'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.updateThread.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.threads.updateTitle',
		parsed,
		`mutation UpdateThreadTitle($input: UpdateThreadTitleInput!) {
  updateThreadTitle(input: $input) {
    thread {
      id
      ref
      title
      status
      priority
    }
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'UpdateThreadTitle',
		UpdateThreadEnvelopeSchema,
	);

	const payload = requireMutationPayload(
		envelope.updateThreadTitle,
		'UpdateThreadTitle',
		'updateThreadTitle',
	);
	throwIfMutationPayloadError(payload, 'UpdateThreadTitle');
	return PlainEndpointOutputSchemas.updateThread.parse({
		thread: payload.thread,
	});
};

export const getUserById: PlainEndpoints['getUserById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getUserById.parse(input);
	return requestAndParse(
		ctx,
		'plain.users.getById',
		parsed,
		`query GetUserById($userId: ID!) {
  user: user(userId: $userId) {
    id
    fullName
    publicName
    email
    isDeleted
  }
}`,
		parsed,
		'GetUserById',
		PlainEndpointOutputSchemas.getUserById,
	);
};

// `deleteUser(input: DeleteUserInput!)` ->
// `type DeleteUserOutput` { error } in schema.graphql.
const DeleteUserEnvelopeSchema = z
	.object({
		deleteUser: MutationPayloadErrorSchema.nullable().optional(),
	})
	.loose();

export const deleteUser: PlainEndpoints['deleteUser'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.deleteUser.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.users.delete',
		parsed,
		`mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'DeleteUser',
		DeleteUserEnvelopeSchema,
	);

	throwIfMutationPayloadError(envelope.deleteUser, 'DeleteUser');

	return { success: true };
};

export const fetchCompany: PlainEndpoints['fetchCompany'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.fetchCompany.parse(input);
	return requestAndParse(
		ctx,
		'plain.companies.getById',
		parsed,
		`query FetchCompany($companyId: ID!) {
  company: company(companyId: $companyId) {
    id
    name
    domainName
    contractValue
  }
}`,
		parsed,
		'FetchCompany',
		PlainEndpointOutputSchemas.fetchCompany,
	);
};

// `upsertCompany(input: UpsertCompanyInput!)` ->
// `type UpsertCompanyOutput` { company result error } in schema.graphql.
const UpdateCompanyEnvelopeSchema = z
	.object({
		upsertCompany: PlainEndpointOutputSchemas.updateCompany
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const updateCompany: PlainEndpoints['updateCompany'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.updateCompany.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.companies.upsert',
		{},
		`mutation UpsertCompany($input: UpsertCompanyInput!) {
  upsertCompany(input: $input) {
    result
    company {
      id
      name
      domainName
      contractValue
    }
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'UpsertCompany',
		UpdateCompanyEnvelopeSchema,
	);

	const payload = requireMutationPayload(
		envelope.upsertCompany,
		'UpsertCompany',
		'upsertCompany',
	);
	throwIfMutationPayloadError(payload, 'UpsertCompany');
	return PlainEndpointOutputSchemas.updateCompany.parse({
		result: payload.result,
		company: payload.company,
	});
};

export const fetchTier: PlainEndpoints['fetchTier'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.fetchTier.parse(input);
	return requestAndParse(
		ctx,
		'plain.tiers.getById',
		parsed,
		`query FetchTier($tierId: ID!) {
  tier: tier(tierId: $tierId) {
    id
    name
    externalId
    color
    isDefault
  }
}`,
		parsed,
		'FetchTier',
		PlainEndpointOutputSchemas.fetchTier,
	);
};

export const listTiers: PlainEndpoints['listTiers'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.listTiers.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.tiers.list',
		{},
		`query ListTiers($first: Int, $after: String, $last: Int, $before: String) {
  tiers(first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        name
        externalId
        color
        isDefault
      }
    }
  }
}`,
		parsed,
		'ListTiers',
		TiersConnectionEnvelopeSchema,
	);

	const connection = envelope.tiers;
	return PlainEndpointOutputSchemas.listTiers.parse({
		tiers: connection.edges.map((edge) => edge.node),
		pageInfo: connection.pageInfo,
	});
};

// `createCustomerGroup(input: CreateCustomerGroupInput!)` ->
// `type CreateCustomerGroupOutput` { customerGroup error } in schema.graphql.
const CreateCustomerGroupEnvelopeSchema = z
	.object({
		createCustomerGroup: PlainEndpointOutputSchemas.createCustomerGroup
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const createCustomerGroup: PlainEndpoints['createCustomerGroup'] =
	async (ctx, input) => {
		const parsed = PlainEndpointInputSchemas.createCustomerGroup.parse(input);
		const envelope = await requestAndParse(
			ctx,
			'plain.customerGroups.create',
			{ key: parsed.key },
			`mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
  createCustomerGroup(input: $input) {
    customerGroup {
      id
      name
      key
      color
      externalId
    }
    error {
      message
      code
    }
  }
}`,
			{ input: parsed },
			'CreateCustomerGroup',
			CreateCustomerGroupEnvelopeSchema,
		);

		const payload = requireMutationPayload(
			envelope.createCustomerGroup,
			'CreateCustomerGroup',
			'createCustomerGroup',
		);
		throwIfMutationPayloadError(payload, 'CreateCustomerGroup');
		return PlainEndpointOutputSchemas.createCustomerGroup.parse({
			customerGroup: payload.customerGroup,
		});
	};

export const listCustomerGroups: PlainEndpoints['listCustomerGroups'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.listCustomerGroups.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.customerGroups.list',
		{},
		`query ListCustomerGroups(
  $filters: CustomerGroupsFilter
  $first: Int
  $after: String
  $last: Int
  $before: String
) {
  customerGroups(filters: $filters, first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        name
        key
        color
        externalId
      }
    }
  }
}`,
		parsed,
		'ListCustomerGroups',
		CustomerGroupsConnectionEnvelopeSchema,
	);

	const connection = envelope.customerGroups;
	return PlainEndpointOutputSchemas.listCustomerGroups.parse({
		customerGroups: connection.edges.map((edge) => edge.node),
		pageInfo: connection.pageInfo,
	});
};

// `addCustomerToCustomerGroups(input: AddCustomerToCustomerGroupsInput!)` ->
// `type AddCustomerToCustomerGroupsOutput`
// { customerGroupMemberships error } in schema.graphql.
const AddCustomerToGroupEnvelopeSchema = z
	.object({
		addCustomerToCustomerGroups: PlainEndpointOutputSchemas.addCustomerToGroup
			.and(
				z
					.object({
						error: MutationErrorSchema.nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

export const addCustomerToGroup: PlainEndpoints['addCustomerToGroup'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.addCustomerToGroup.parse(input);
	const envelope = await requestAndParse(
		ctx,
		'plain.customerGroups.addCustomer',
		{ customerId: parsed.customerId },
		`mutation AddCustomerToCustomerGroups($input: AddCustomerToCustomerGroupsInput!) {
  addCustomerToCustomerGroups(input: $input) {
    customerGroupMemberships {
      customerId
      customerGroup {
        id
        name
        key
        color
        externalId
      }
    }
    error {
      message
      code
    }
  }
}`,
		{ input: parsed },
		'AddCustomerToCustomerGroups',
		AddCustomerToGroupEnvelopeSchema,
	);

	const payload = requireMutationPayload(
		envelope.addCustomerToCustomerGroups,
		'AddCustomerToCustomerGroups',
		'addCustomerToCustomerGroups',
	);
	throwIfMutationPayloadError(payload, 'AddCustomerToCustomerGroups');
	return PlainEndpointOutputSchemas.addCustomerToGroup.parse({
		customerGroupMemberships: payload.customerGroupMemberships,
	});
};

// `removeCustomerFromCustomerGroups(input:
// RemoveCustomerFromCustomerGroupsInput!)` ->
// `type RemoveCustomerFromCustomerGroupsOutput` { error } in schema.graphql.
const RemoveCustomerFromGroupEnvelopeSchema = z
	.object({
		removeCustomerFromCustomerGroups:
			MutationPayloadErrorSchema.nullable().optional(),
	})
	.loose();

export const removeCustomerFromGroup: PlainEndpoints['removeCustomerFromGroup'] =
	async (ctx, input) => {
		const parsed =
			PlainEndpointInputSchemas.removeCustomerFromGroup.parse(input);
		const envelope = await requestAndParse(
			ctx,
			'plain.customerGroups.removeCustomer',
			{ customerId: parsed.customerId },
			`mutation RemoveCustomerFromCustomerGroups($input: RemoveCustomerFromCustomerGroupsInput!) {
  removeCustomerFromCustomerGroups(input: $input) {
    error {
      message
      code
    }
  }
}`,
			{ input: parsed },
			'RemoveCustomerFromCustomerGroups',
			RemoveCustomerFromGroupEnvelopeSchema,
		);

		throwIfMutationPayloadError(
			envelope.removeCustomerFromCustomerGroups,
			'RemoveCustomerFromCustomerGroups',
		);

		return { success: true };
	};

export const runGraphqlQuery: PlainEndpoints['runGraphqlQuery'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.runGraphqlQuery.parse(input);
	if (ctx.key === undefined) {
		throw new AuthMissingError('plain', 'api_key');
	}

	// JUSTIFY(unknown): arbitrary GraphQL response JSON, validated by the
	// output schema below before returning.
	const data: unknown = await makePlainRequest<unknown>(
		parsed.query,
		ctx.key,
		parsed.variables,
		parsed.operationName,
	);

	await logEventFromContext(
		ctx,
		'plain.graphql.run',
		{ operationName: parsed.operationName },
		'completed',
	);

	// The output schema wraps the value in `{ data }` itself — pass the raw
	// result, not a pre-wrapped object, or it double-nests.
	return PlainEndpointOutputSchemas.runGraphqlQuery.parse(data);
};
