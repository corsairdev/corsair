import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makePlainRequest, PlainAPIError } from '../client';
import type { PlainEndpoints } from '../index';
import type { PlainEndpointOutputs } from './types';
import { PlainEndpointInputSchemas, PlainEndpointOutputSchemas } from './types';

type PlainContext = Parameters<PlainEndpoints['getCustomerById']>[0];

function throwIfMutationPayloadError(payload: unknown, operationName: string) {
	if (!payload || typeof payload !== 'object') {
		return;
	}

	const error = (payload as { error?: unknown }).error;
	if (!error || typeof error !== 'object') {
		return;
	}

	const message = (error as { message?: unknown }).message;
	if (typeof message !== 'string' || message.length === 0) {
		return;
	}

	const code = (error as { code?: unknown }).code;
	throw new PlainAPIError(`${operationName}: ${message}`, {
		code: typeof code === 'string' ? code : undefined,
	});
}

async function requestParsed<TOutput extends keyof PlainEndpointOutputs>(
	ctx: PlainContext,
	event: string,
	meta: Record<string, unknown>,
	query: string,
	variables: Record<string, unknown> | undefined,
	operationName: string,
	outputKey: TOutput,
): Promise<PlainEndpointOutputs[TOutput]> {
	if (!ctx.key) {
		throw new AuthMissingError('plain', 'api_key');
	}

	const data = await makePlainRequest<unknown>(
		query,
		ctx.key,
		variables,
		operationName,
	);
	// outputKey is a generic key into the schema record, so `.parse` widens to the
	// union of every operation's output; narrow back to this operation's type.
	const parsed = PlainEndpointOutputSchemas[outputKey].parse(
		data,
	) as PlainEndpointOutputs[TOutput];
	await logEventFromContext(ctx, event, meta, 'completed');
	return parsed;
}

export const getCustomerById: PlainEndpoints['getCustomerById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomerById.parse(input);
	return requestParsed(
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
		'getCustomerById',
	);
};

export const getCustomerByEmail: PlainEndpoints['getCustomerByEmail'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomerByEmail.parse(input);
	return requestParsed(
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
		'getCustomerByEmail',
	);
};

export const getCustomers: PlainEndpoints['getCustomers'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getCustomers.parse(input);

	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	const customersConnection = (
		response.data as {
			customers?: {
				totalCount?: number;
				pageInfo?: PlainEndpointOutputs['getCustomers']['pageInfo'];
				edges?: Array<{
					node: PlainEndpointOutputs['getCustomers']['customers'][number];
				}>;
			};
		}
	).customers;

	return PlainEndpointOutputSchemas.getCustomers.parse({
		customers: customersConnection?.edges?.map((edge) => edge.node) ?? [],
		pageInfo: customersConnection?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
		totalCount: customersConnection?.totalCount ?? 0,
	});
};

export const upsertCustomer: PlainEndpoints['upsertCustomer'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.upsertCustomer.parse(input);
	return requestParsed(
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
		'runGraphqlQuery',
	).then((response) => {
		const payload = (
			response.data as {
				upsertCustomer?: PlainEndpointOutputs['upsertCustomer'] & {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).upsertCustomer;
		throwIfMutationPayloadError(payload, 'UpsertCustomer');
		return PlainEndpointOutputSchemas.upsertCustomer.parse(payload ?? {});
	});
};

export const deleteCustomer: PlainEndpoints['deleteCustomer'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.deleteCustomer.parse(input);
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	throwIfMutationPayloadError(
		(
			response.data as {
				deleteCustomer?: {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).deleteCustomer,
		'DeleteCustomer',
	);

	return { success: true };
};

export const createThread: PlainEndpoints['createThread'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.createThread.parse(input);
	return requestParsed(
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
		'runGraphqlQuery',
	).then((response) => {
		const payload = (
			response.data as {
				createThread?: PlainEndpointOutputs['createThread'] & {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).createThread;
		throwIfMutationPayloadError(payload, 'CreateThread');
		return PlainEndpointOutputSchemas.createThread.parse(payload ?? {});
	});
};

export const getThreadById: PlainEndpoints['getThreadById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getThreadById.parse(input);
	return requestParsed(
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
		'getThreadById',
	);
};

async function queryThreadsInternal(
	ctx: PlainContext,
	input: Parameters<PlainEndpoints['queryThreads']>[1],
	event: string,
): Promise<PlainEndpointOutputs['queryThreads']> {
	const parsed = PlainEndpointInputSchemas.queryThreads.parse(input);
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	const threadsConnection = (
		response.data as {
			threads?: {
				totalCount?: number;
				pageInfo?: PlainEndpointOutputs['queryThreads']['pageInfo'];
				edges?: Array<{
					node: PlainEndpointOutputs['queryThreads']['threads'][number];
				}>;
			};
		}
	).threads;

	return PlainEndpointOutputSchemas.queryThreads.parse({
		threads: threadsConnection?.edges?.map((edge) => edge.node) ?? [],
		pageInfo: threadsConnection?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
		totalCount: threadsConnection?.totalCount ?? 0,
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
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	const threadsConnection = (
		response.data as {
			customer?: {
				threads?: {
					totalCount?: number;
					pageInfo?: PlainEndpointOutputs['fetchIssues']['pageInfo'];
					edges?: Array<{
						node: {
							id: string;
							ref?: string;
							title: string;
							links?: {
								edges?: Array<{
									node: PlainEndpointOutputs['fetchIssues']['issues'][number]['link'];
								}>;
							};
						};
					}>;
				};
			};
		}
	).customer?.threads;

	const issues =
		threadsConnection?.edges?.flatMap((threadEdge) =>
			(threadEdge.node.links?.edges ?? []).map((linkEdge) => ({
				threadId: threadEdge.node.id,
				threadRef: threadEdge.node.ref ?? '',
				threadTitle: threadEdge.node.title,
				link: linkEdge.node,
			})),
		) ?? [];

	return PlainEndpointOutputSchemas.fetchIssues.parse({
		issues,
		pageInfo: threadsConnection?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
		totalThreads: threadsConnection?.totalCount ?? 0,
	});
};

export const sendMessage: PlainEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.sendMessage.parse(input);
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	throwIfMutationPayloadError(
		(
			response.data as {
				replyToThread?: {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).replyToThread,
		'ReplyToThread',
	);

	return { success: true };
};

export const updateThread: PlainEndpoints['updateThread'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.updateThread.parse(input);
	return requestParsed(
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
		'runGraphqlQuery',
	).then((response) => {
		const payload = (
			response.data as {
				updateThreadTitle?: PlainEndpointOutputs['updateThread'] & {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).updateThreadTitle;
		throwIfMutationPayloadError(payload, 'UpdateThreadTitle');
		return PlainEndpointOutputSchemas.updateThread.parse(payload ?? {});
	});
};

export const getUserById: PlainEndpoints['getUserById'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.getUserById.parse(input);
	return requestParsed(
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
		'getUserById',
	);
};

export const deleteUser: PlainEndpoints['deleteUser'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.deleteUser.parse(input);
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	throwIfMutationPayloadError(
		(
			response.data as {
				deleteUser?: {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).deleteUser,
		'DeleteUser',
	);

	return { success: true };
};

export const fetchCompany: PlainEndpoints['fetchCompany'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.fetchCompany.parse(input);
	return requestParsed(
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
		'fetchCompany',
	);
};

export const updateCompany: PlainEndpoints['updateCompany'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.updateCompany.parse(input);
	return requestParsed(
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
		'runGraphqlQuery',
	).then((response) => {
		const payload = (
			response.data as {
				upsertCompany?: PlainEndpointOutputs['updateCompany'] & {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).upsertCompany;
		throwIfMutationPayloadError(payload, 'UpsertCompany');
		return PlainEndpointOutputSchemas.updateCompany.parse(payload ?? {});
	});
};

export const fetchTier: PlainEndpoints['fetchTier'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.fetchTier.parse(input);
	return requestParsed(
		ctx,
		'plain.tiers.getById',
		parsed,
		`query FetchTier($tierId: ID!) {
  tier: tier(tierId: $tierId) {
    id
    name
    description
  }
}`,
		parsed,
		'FetchTier',
		'fetchTier',
	);
};

export const listTiers: PlainEndpoints['listTiers'] = async (ctx, input) => {
	const parsed = PlainEndpointInputSchemas.listTiers.parse(input);
	const response = await requestParsed(
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
        description
      }
    }
  }
}`,
		parsed,
		'ListTiers',
		'runGraphqlQuery',
	);

	const tiersConnection = (
		response.data as {
			tiers?: {
				pageInfo?: PlainEndpointOutputs['listTiers']['pageInfo'];
				edges?: Array<{
					node: PlainEndpointOutputs['listTiers']['tiers'][number];
				}>;
			};
		}
	).tiers;

	return PlainEndpointOutputSchemas.listTiers.parse({
		tiers: tiersConnection?.edges?.map((edge) => edge.node) ?? [],
		pageInfo: tiersConnection?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
	});
};

export const createCustomerGroup: PlainEndpoints['createCustomerGroup'] =
	async (ctx, input) => {
		const parsed = PlainEndpointInputSchemas.createCustomerGroup.parse(input);
		return requestParsed(
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
			'runGraphqlQuery',
		).then((response) => {
			const payload = (
				response.data as {
					createCustomerGroup?: PlainEndpointOutputs['createCustomerGroup'] & {
						error?: { message?: string; code?: string | null } | null;
					};
				}
			).createCustomerGroup;
			throwIfMutationPayloadError(payload, 'CreateCustomerGroup');
			return PlainEndpointOutputSchemas.createCustomerGroup.parse(payload);
		});
	};

export const listCustomerGroups: PlainEndpoints['listCustomerGroups'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.listCustomerGroups.parse(input);
	const response = await requestParsed(
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
		'runGraphqlQuery',
	);

	const groupsConnection = (
		response.data as {
			customerGroups?: {
				pageInfo?: PlainEndpointOutputs['listCustomerGroups']['pageInfo'];
				edges?: Array<{
					node: PlainEndpointOutputs['listCustomerGroups']['customerGroups'][number];
				}>;
			};
		}
	).customerGroups;

	return PlainEndpointOutputSchemas.listCustomerGroups.parse({
		customerGroups: groupsConnection?.edges?.map((edge) => edge.node) ?? [],
		pageInfo: groupsConnection?.pageInfo ?? {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		},
	});
};

export const addCustomerToGroup: PlainEndpoints['addCustomerToGroup'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.addCustomerToGroup.parse(input);
	return requestParsed(
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
		'runGraphqlQuery',
	).then((response) => {
		const payload = (
			response.data as {
				addCustomerToCustomerGroups?: PlainEndpointOutputs['addCustomerToGroup'] & {
					error?: { message?: string; code?: string | null } | null;
				};
			}
		).addCustomerToCustomerGroups;
		throwIfMutationPayloadError(payload, 'AddCustomerToCustomerGroups');
		return PlainEndpointOutputSchemas.addCustomerToGroup.parse(payload);
	});
};

export const removeCustomerFromGroup: PlainEndpoints['removeCustomerFromGroup'] =
	async (ctx, input) => {
		const parsed =
			PlainEndpointInputSchemas.removeCustomerFromGroup.parse(input);
		const response = await requestParsed(
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
			'runGraphqlQuery',
		);

		throwIfMutationPayloadError(
			(
				response.data as {
					removeCustomerFromCustomerGroups?: {
						error?: { message?: string; code?: string | null } | null;
					};
				}
			).removeCustomerFromCustomerGroups,
			'RemoveCustomerFromCustomerGroups',
		);

		return { success: true };
	};

export const runGraphqlQuery: PlainEndpoints['runGraphqlQuery'] = async (
	ctx,
	input,
) => {
	const parsed = PlainEndpointInputSchemas.runGraphqlQuery.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('plain', 'api_key');
	}

	const data = await makePlainRequest<unknown>(
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

	// The output schema wraps the value in `{ data }` itself — pass the raw result,
	// not a pre-wrapped object, or it double-nests.
	return PlainEndpointOutputSchemas.runGraphqlQuery.parse(data);
};
