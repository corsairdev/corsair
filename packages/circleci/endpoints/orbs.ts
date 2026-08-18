import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCIGraphQLCall, circleCIV3ListCall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * The orb registry: orbs, orb versions, categories and namespace listings.
 *
 * Deliberately not mirrored anywhere in this plugin - it is a shared public
 * catalogue, not this account's data, the same reasoning that kept Habitica's
 * content catalogue out of its mirror. Every read here goes to the API.
 *
 * Most of this family is GraphQL, confirmed live with introspection disabled
 * by reading field-not-found and missing-argument errors rather than a
 * schema dump - see `CIRCLECI-PLAN.md` for the individual probes.
 */

/** Fetches an orb's metadata, versions and visibility by its full reference. */
export const getDetails: CircleCIEndpoints['orbGetDetails'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orb: CircleCIEndpointOutputs['orbGetDetails'] | null;
	}>(
		ctx,
		`query($name: String!) { orb(name: $name) { id name isPrivate versions(count: 20) { id version } } }`,
		{ name: input.name },
	);

	await logEventFromContext(
		ctx,
		'circleci.orbs.getDetails',
		{ ...auditPayload(input, ['name']), found: result.orb !== null },
		'completed',
	);
	if (!result.orb) throw new Error(`Orb not found: ${input.name}`);
	return result.orb;
};

/**
 * Fetches one orb version's metadata and source YAML.
 *
 * **Same route as `querySource` below, deliberately.** `CIRCLECI_GET_ORB_VERSION`
 * and `CIRCLECI_QUERY_ORB_SOURCE` are two catalog ids over one GraphQL field,
 * `orbVersion(orbVersionRef:)`, which returns `{id, version, source}` as a
 * unit - a GraphQL selection set could narrow either call to fewer fields, but
 * both catalog operations' own output shapes declare all three, so there is
 * nothing to gain by splitting the query. Same treatment as the
 * `LIST_INSIGHTS_SUMMARY`/`QUERY_PLAN_METRICS` alias in `insights.ts`: kept as
 * two operations because the catalog lists them as two, each with its own
 * audit event, rather than collapsed into one.
 */
export const getVersion: CircleCIEndpoints['orbGetVersion'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orbVersion: CircleCIEndpointOutputs['orbGetVersion'] | null;
	}>(
		ctx,
		`query($ref: String!) { orbVersion(orbVersionRef: $ref) { id version source } }`,
		{ ref: input.orbVersionRef },
	);

	await logEventFromContext(
		ctx,
		'circleci.orbs.getVersion',
		{
			...auditPayload(input, ['orbVersionRef']),
			found: result.orbVersion !== null,
		},
		'completed',
	);
	if (!result.orbVersion) {
		throw new Error(`Orb version not found: ${input.orbVersionRef}`);
	}
	return result.orbVersion;
};

/** Fetches an orb's id (and its namespace's id) by name. */
export const queryId: CircleCIEndpoints['orbQueryId'] = async (ctx, input) => {
	const result = await circleCIGraphQLCall<{
		orb: CircleCIEndpointOutputs['orbQueryId'] | null;
	}>(ctx, `query($name: String!) { orb(name: $name) { id name } }`, {
		name: input.name,
	});

	await logEventFromContext(
		ctx,
		'circleci.orbs.queryId',
		{ ...auditPayload(input, ['name']), found: result.orb !== null },
		'completed',
	);
	if (!result.orb) throw new Error(`Orb not found: ${input.name}`);
	return result.orb;
};

/**
 * Checks whether an orb exists and, if so, its visibility.
 *
 * `orb(name:)` answers a nonexistent name with `data: {orb: null}` and no
 * `errors` entry - confirmed live against a deliberately fake orb name - so a
 * null orb is the existence signal, not an error to catch.
 */
export const queryExists: CircleCIEndpoints['orbQueryExists'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orb: { id: string; isPrivate: boolean | null } | null;
	}>(ctx, `query($name: String!) { orb(name: $name) { id isPrivate } }`, {
		name: input.name,
	});

	await logEventFromContext(
		ctx,
		'circleci.orbs.queryExists',
		{ ...auditPayload(input, ['name']), exists: result.orb !== null },
		'completed',
	);
	return { exists: result.orb !== null, isPrivate: result.orb?.isPrivate };
};

/** Fetches an orb's latest published version. */
export const queryLatestVersion: CircleCIEndpoints['orbQueryLatestVersion'] =
	async (ctx, input) => {
		const result = await circleCIGraphQLCall<{
			orb: {
				versions: CircleCIEndpointOutputs['orbQueryLatestVersion'][];
			} | null;
		}>(
			ctx,
			`query($name: String!) { orb(name: $name) { versions(count: 1) { id version } } }`,
			{ name: input.name },
		);

		const latest = result.orb?.versions?.[0];
		await logEventFromContext(
			ctx,
			'circleci.orbs.queryLatestVersion',
			{ ...auditPayload(input, ['name']), found: latest !== undefined },
			'completed',
		);
		if (!latest)
			throw new Error(`Orb not found or has no versions: ${input.name}`);
		return latest;
	};

/**
 * Fetches an orb version's source YAML.
 *
 * Same route as `getVersion` above - see that function's doc comment for why.
 */
export const querySource: CircleCIEndpoints['orbQuerySource'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orbVersion: CircleCIEndpointOutputs['orbQuerySource'] | null;
	}>(
		ctx,
		`query($ref: String!) { orbVersion(orbVersionRef: $ref) { id version source } }`,
		{ ref: input.orbVersionRef },
	);

	await logEventFromContext(
		ctx,
		'circleci.orbs.querySource',
		{
			...auditPayload(input, ['orbVersionRef']),
			found: result.orbVersion !== null,
		},
		'completed',
	);
	if (!result.orbVersion) {
		throw new Error(`Orb version not found: ${input.orbVersionRef}`);
	}
	return result.orbVersion;
};

/**
 * Lists orbs across the whole registry, paginated.
 *
 * Requests `pageInfo { hasNextPage endCursor }` alongside the edges and
 * returns it to the caller - the same two fields `queryCategoryId` below
 * already reads to keep paging internally, confirmed live to exist on this
 * connection. An earlier version of this function accepted `first`/`after`
 * as input but never requested or returned `pageInfo`, so a caller had no
 * way to know whether more orbs existed or what cursor to ask for next. Pass
 * the returned `endCursor` back as this operation's `after` input to
 * continue.
 */
export const listOrbs: CircleCIEndpoints['orbListOrbs'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orbs: {
			edges: {
				node: CircleCIEndpointOutputs['orbListOrbs']['items'][number];
			}[];
			pageInfo?: { hasNextPage: boolean; endCursor: string | null };
		};
	}>(
		ctx,
		`query($first: Int, $after: String) { orbs(first: $first, after: $after) { edges { node { id name isPrivate } } pageInfo { hasNextPage endCursor } } }`,
		compact({ first: input.first, after: input.after }),
	);
	const items = result.orbs.edges.map((edge) => edge.node);

	await logEventFromContext(
		ctx,
		'circleci.orbs.listOrbs',
		{ ...auditPayload(input, []), returned: items.length },
		'completed',
	);
	return { items, pageInfo: result.orbs.pageInfo };
};

/**
 * Lists orb categories, paginated.
 *
 * Same `pageInfo` treatment as `listOrbs` above - see its doc comment. Pass
 * the returned `endCursor` back as this operation's `after` input to
 * continue.
 */
export const listCategories: CircleCIEndpoints['orbListCategories'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orbCategories: {
			edges: {
				node: CircleCIEndpointOutputs['orbListCategories']['items'][number];
			}[];
			pageInfo?: { hasNextPage: boolean; endCursor: string | null };
		};
	}>(
		ctx,
		`query($first: Int, $after: String) { orbCategories(first: $first, after: $after) { edges { node { id name } } pageInfo { hasNextPage endCursor } } }`,
		compact({ first: input.first, after: input.after }),
	);
	const items = result.orbCategories.edges.map((edge) => edge.node);

	await logEventFromContext(
		ctx,
		'circleci.orbs.listCategories',
		{ returned: items.length },
		'completed',
	);
	return { items, pageInfo: result.orbCategories.pageInfo };
};

/**
 * Fetches a category's id by name.
 *
 * The catalog describes this as a name lookup, but `orbCategories` only
 * accepts `first`/`after` - confirmed live from the server's own
 * `"defined-arguments":["first","after"]` error on an unknown `name`
 * argument. There is no server-side name filter, so this pages through the
 * full list and filters client-side - capped at 500 to bound the cost of a
 * name that does not exist, which would otherwise page to the end regardless.
 */
export const queryCategoryId: CircleCIEndpoints['orbQueryCategoryId'] = async (
	ctx,
	input,
) => {
	const PAGE_SIZE = 50;
	const MAX_SCANNED = 500;
	let after: string | undefined;
	let scanned = 0;
	let found: CircleCIEndpointOutputs['orbQueryCategoryId'] | undefined;

	while (scanned < MAX_SCANNED) {
		const page = await circleCIGraphQLCall<{
			orbCategories: {
				edges: { node: { id: string; name: string } }[];
				pageInfo?: { hasNextPage: boolean; endCursor: string | null };
			};
		}>(
			ctx,
			`query($first: Int, $after: String) {
				orbCategories(first: $first, after: $after) {
					edges { node { id name } }
					pageInfo { hasNextPage endCursor }
				}
			}`,
			compact({ first: PAGE_SIZE, after }),
		);

		scanned += page.orbCategories.edges.length;
		found = page.orbCategories.edges.find(
			(e) => e.node.name === input.name,
		)?.node;
		if (found) break;

		// A page with no edges has nothing left to gain from continuing, even
		// if `hasNextPage` claims otherwise - guards against looping forever on
		// a bound (`scanned`) that a zero-edge page never advances.
		if (page.orbCategories.edges.length === 0) break;
		if (!page.orbCategories.pageInfo?.hasNextPage) break;

		const nextCursor = page.orbCategories.pageInfo.endCursor ?? undefined;
		// A missing cursor, or one identical to the one just used, cannot move
		// this loop forward: `endCursor: null` would restart from the first
		// page (`after` resets to `undefined`), and a repeated cursor would
		// refetch the same page - either way, real pagination has stopped even
		// though the server claims `hasNextPage: true`. Confirmed introspection
		// is disabled on this schema, so this is defended against rather than
		// assumed impossible.
		if (nextCursor === undefined || nextCursor === after) break;
		after = nextCursor;
	}

	await logEventFromContext(
		ctx,
		'circleci.orbs.queryCategoryId',
		{ ...auditPayload(input, ['name']), found: found !== undefined, scanned },
		'completed',
	);
	if (!found) throw new Error(`Orb category not found: ${input.name}`);
	return found;
};

/**
 * Lists orb packages from the REST v3 registry, optionally scoped to a
 * namespace. `filter[namespace_id]=`, `filter[certified]=`,
 * `filter[visibility]=`, and `page[cursor]=` all confirmed live via
 * `circleci-cli`'s own `ListOrbPackages` and a direct fetch of the global
 * (unfiltered) form, which returned real orb data.
 *
 * Uses `circleCIV3ListCall`, not `circleCIV3Call`: the real response is
 * `{"data": [...], "page": {"next", "prev"}}`, and `circleCIV3Call`'s
 * `{"data": T}` unwrap would discard `page` entirely - an earlier version of
 * this function did exactly that, leaving a caller with no way to tell an
 * incomplete page from the whole registry. Pass the returned `page.next`
 * back as this operation's `pageCursor` input to continue.
 */
export const listNamespaceOrbs: CircleCIEndpoints['orbListNamespaceOrbs'] =
	async (ctx, input) => {
		const result = await circleCIV3ListCall<
			CircleCIEndpointOutputs['orbListNamespaceOrbs']['items'][number]
		>(ctx, 'orb/packages', {
			query: compact({
				'filter[namespace_id]': input.namespaceId,
				'filter[certified]': input.certified,
				'filter[visibility]': input.private ? 'private' : undefined,
				'page[cursor]': input.pageCursor,
			}),
		});

		await logEventFromContext(
			ctx,
			'circleci.orbs.listNamespaceOrbs',
			{
				...auditPayload(input, ['namespaceId', 'certified']),
				returned: result.items.length,
			},
			'completed',
		);
		return result;
	};

/**
 * Validates orb YAML using the `orbConfig` GraphQL query - confirmed live,
 * matching the catalog description's explicit "using the orbConfig GraphQL
 * query" rather than the REST v3 `orb/packages/validate` route, which
 * validates a different thing (an orb about to be published, not an
 * arbitrary YAML string).
 */
export const validateConfig: CircleCIEndpoints['orbValidateConfig'] = async (
	ctx,
	input,
) => {
	const result = await circleCIGraphQLCall<{
		orbConfig: CircleCIEndpointOutputs['orbValidateConfig'];
	}>(
		ctx,
		`query($yaml: String!) { orbConfig(orbYaml: $yaml) { valid errors { message } sourceYaml } }`,
		{ yaml: input.orbYaml },
	);

	await logEventFromContext(
		ctx,
		'circleci.orbs.validateConfig',
		{ valid: result.orbConfig.valid },
		'completed',
	);
	return result.orbConfig;
};
