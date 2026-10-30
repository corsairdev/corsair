import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCIGraphQLCall, circleCIV3Call } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Checks whether a namespace name exists.
 *
 * `GET /api/v3/namespaces?filter[name]=` (v3's JSON:API filter convention,
 * confirmed live - not a flat `?name=`), judged by 200 versus 404 rather than
 * a boolean field in the body. A namespace `name` query on `graphql-unstable`
 * is not real - confirmed live with `Cannot query field 'namespace' on type
 * 'QueryRoot'` - so despite the "Query" in its catalog name, this operation
 * is v3 REST, not GraphQL.
 */
export const queryExists: CircleCIEndpoints['namespaceQueryExists'] = async (
	ctx,
	input,
) => {
	let exists: boolean;
	try {
		await circleCIV3Call(ctx, 'namespaces', {
			query: { 'filter[name]': input.name },
		});
		exists = true;
	} catch (error) {
		// `wrapError` in `client.ts` always throws a `CircleCIAPIError`, so a
		// nullish or non-object rejection is not currently reachable through
		// this call - but a bare `(error as {status}).status` would still
		// throw a `TypeError` if one ever were, masking the original failure
		// with an unrelated crash. Guarded rather than assumed.
		const status =
			error != null && typeof error === 'object' && 'status' in error
				? (error as { status?: unknown }).status
				: undefined;
		if (status === 404) exists = false;
		else throw error;
	}

	await logEventFromContext(
		ctx,
		'circleci.namespace.queryExists',
		{ ...auditPayload(input, ['name']), exists },
		'completed',
	);
	return { exists };
};

/**
 * Deletes a namespace and all its orbs. The name is resolved to an id first,
 * matching `circleci-cli`'s own `DeleteNamespace`. Irreversible and never
 * exercised live.
 */
export const remove: CircleCIEndpoints['namespaceDelete'] = async (
	ctx,
	input,
) => {
	const found = await circleCIV3Call<{ id: string }>(ctx, 'namespaces', {
		query: { 'filter[name]': input.name },
	});

	const result = await circleCIV3Call<
		CircleCIEndpointOutputs['namespaceDelete']
	>(ctx, `namespaces/${found.id}`, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'circleci.namespace.delete',
		auditPayload(input, ['name']),
		'completed',
	);
	return result;
};

/** Renames a namespace. The current name is resolved to an id first. */
export const rename: CircleCIEndpoints['namespaceRename'] = async (
	ctx,
	input,
) => {
	const found = await circleCIV3Call<{ id: string }>(ctx, 'namespaces', {
		query: { 'filter[name]': input.name },
	});

	const result = await circleCIV3Call<
		CircleCIEndpointOutputs['namespaceRename']
	>(ctx, `namespaces/${found.id}/rename`, {
		method: 'POST',
		body: { name: input.newName },
	});

	await logEventFromContext(
		ctx,
		'circleci.namespace.rename',
		auditPayload(input, ['name', 'newName']),
		'completed',
	);
	return result;
};

/**
 * Removes a namespace alias by name, via GraphQL.
 *
 * Not present anywhere in the current, actively-maintained `circleci-cli` -
 * confirmed by searching the whole repository - but the field is real and
 * live on `graphql-unstable`, answering genuine business errors ("Namespace
 * not found with name ...") rather than a schema error. Orphaned from
 * official tooling, not from the API itself.
 *
 * **`errors` here is a mutation-payload field, not the top-level GraphQL
 * `errors[]` array `circleCIGraphQLCall` already throws on.** This is the
 * "business error" the doc paragraph above names: the mutation answers 200
 * with no transport-level failure, and the outcome is only visible by
 * reading this field. An earlier version of this function never read it,
 * so a genuine failure - a name that does not exist - logged `completed`
 * and returned the error payload as if it were a successful `EmptyResult`.
 */
export const deleteAlias: CircleCIEndpoints['namespaceDeleteAlias'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		deleteNamespaceAlias: { errors?: { message: string }[] };
	}>(
		ctx,
		`mutation($name: String!) { deleteNamespaceAlias(name: $name) { errors { message } } }`,
		{
			name: input.name,
		},
	);

	const businessErrors = result.deleteNamespaceAlias.errors;
	if (businessErrors && businessErrors.length > 0) {
		throw new Error(
			`Failed to delete namespace alias "${input.name}": ${businessErrors
				.map((e) => e.message)
				.join('; ')}`,
		);
	}

	await logEventFromContext(
		ctx,
		'circleci.namespace.deleteAlias',
		auditPayload(input, ['name']),
		'completed',
	);
	return {};
};
