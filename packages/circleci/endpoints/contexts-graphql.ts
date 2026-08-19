import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIContextEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity, evictEntity } from './persist';
import { circleCIGraphQLCall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * The GraphQL-transport twins of the REST v2 context operations in
 * `contexts.ts`.
 *
 * These exist as separate catalog ids from their REST counterparts (`Create
 * Context` vs `Create Context (GraphQL)`, and so on), and several catalog
 * descriptions commit explicitly to "using the GraphQL API" - so they are
 * implemented against `graphql-unstable` rather than silently redirected to
 * the REST route that produces the same effect. See `client.ts` and
 * `CIRCLECI-PLAN.md` for why both are kept genuinely distinct rather than
 * collapsed to one transport.
 *
 * Every mutation here was confirmed live against a real, owned context - not
 * just shape-guessed from error messages - created via the REST v2 route,
 * exercised, and cleaned up in the same recon pass.
 */

const LABEL = 'context';

/**
 * Maps the GraphQL context shape (`{id, name, createdAt}`, camelCase, per
 * the selection set this plugin requests) onto `CircleCIContextEntity`'s
 * field names (`created_at`, snake_case, matching what the REST v2 route
 * returns and what the mirror is keyed against). Caching the raw GraphQL
 * object as-is would still succeed - every field but `id` is optional on a
 * `.loose()` entity - but would silently leave `created_at` unset on every
 * GraphQL-sourced row, which is the kind of quiet data loss this normalises
 * away rather than accepting.
 */
function toMirroredContext(
	graphqlContext: CircleCIEndpointOutputs['contextsCreateGraphQL'],
): Record<string, unknown> {
	return {
		id: graphqlContext.id,
		name: graphqlContext.name,
		created_at: graphqlContext.createdAt,
	};
}

/**
 * Creates a context via GraphQL.
 *
 * `createContext(input: {contextName, ownerId, ownerType})` - the field names
 * differ from the REST v2 body (`name`/`owner.id`/`owner.type`), confirmed via
 * the server's own required-keys error rather than assumed to match.
 *
 * Cached on the same mirror `Contexts.create`/`Contexts.get` (the REST v2
 * twins) use - an earlier version of this function left the GraphQL create
 * uncached while its own `remove` below evicts from that mirror, so a
 * context created here and never read back over REST would be invisible to
 * any operation that trusts the local store.
 */
export const create: CircleCIEndpoints['contextsCreateGraphQL'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		createContext: {
			context: CircleCIEndpointOutputs['contextsCreateGraphQL'];
		};
	}>(
		ctx,
		`mutation($input: CreateContextInput!) {
			createContext(input: $input) { context { id name createdAt } }
		}`,
		{
			input: {
				contextName: input.contextName,
				ownerId: input.ownerId,
				ownerType: input.ownerType,
			},
		},
	);
	const context = result.createContext.context;

	await cacheEntity(
		ctx.db.contexts,
		CircleCIContextEntity,
		toMirroredContext(context),
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.createGraphQL',
		auditPayload(input, ['ownerId', 'ownerType']),
		'completed',
	);
	return context;
};

/**
 * Deletes a context via GraphQL. Required eviction: CircleCI hard-deletes
 * contexts, confirmed live by a subsequent REST read returning 403 rather
 * than 200.
 *
 * **Logged before the eviction, not after.** The event asserts "the remote
 * context is gone", which is already true once the mutation above returns -
 * placing the log after a *required* eviction that can throw would lose the
 * audit record of a real, confirmed destructive action whenever the local
 * mirror write fails, leaving no trace that a customer's context (and its
 * secrets) were actually deleted. The eviction still runs, and still raises
 * on failure so the caller and the logs both learn the mirror needs manual
 * cleanup - it just no longer gets to suppress the fact that the deletion
 * itself succeeded.
 */
export const remove: CircleCIEndpoints['contextsDeleteGraphQL'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<Record<string, unknown>>(
		ctx,
		`mutation($input: DeleteContextInput!) { deleteContext(input: $input) { __typename } }`,
		{ input: { contextId: input.contextId } },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.deleteGraphQL',
		auditPayload(input, ['contextId']),
		'completed',
	);

	await evictEntity(ctx.db.contexts, input.contextId, LABEL, {
		required: true,
	});
	return result;
};

/**
 * Reads a context by id via GraphQL.
 *
 * A garbage id answers "Permission denied" here rather than a not-found
 * error - confirmed live - so a `PERMISSION_ERROR` from this call does not
 * necessarily mean the caller lacks access; it may mean the id does not
 * exist. CircleCI does not distinguish the two on this route.
 *
 * Cached on the same mirror as `create` above - see its doc comment.
 */
export const query: CircleCIEndpoints['contextsQuery'] = async (ctx, input) => {
	const result = await circleCIGraphQLCall<{
		context: CircleCIEndpointOutputs['contextsQuery'];
	}>(ctx, `query($id: ID!) { context(id: $id) { id name createdAt } }`, {
		id: input.contextId,
	});

	await cacheEntity(
		ctx.db.contexts,
		CircleCIContextEntity,
		toMirroredContext(result.context),
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.query',
		auditPayload(input, ['contextId']),
		'completed',
	);
	return result.context;
};

/** Stores (creates or updates) a context env var via GraphQL. The value is never logged. */
export const storeEnvVar: CircleCIEndpoints['contextsStoreEnvVar'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<Record<string, unknown>>(
		ctx,
		`mutation($input: StoreEnvironmentVariableInput!) { storeEnvironmentVariable(input: $input) { __typename } }`,
		{
			input: {
				contextId: input.contextId,
				variable: input.variable,
				value: input.value,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.storeEnvVar',
		auditPayload(input, ['contextId', 'variable']),
		'completed',
	);
	return result;
};

/** Removes a context env var via GraphQL. */
export const removeEnvVar: CircleCIEndpoints['contextsRemoveEnvVar'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<Record<string, unknown>>(
		ctx,
		`mutation($input: RemoveEnvironmentVariableInput!) { removeEnvironmentVariable(input: $input) { __typename } }`,
		{ input: { contextId: input.contextId, variable: input.variable } },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.removeEnvVar',
		auditPayload(input, ['contextId', 'variable']),
		'completed',
	);
	return result;
};
