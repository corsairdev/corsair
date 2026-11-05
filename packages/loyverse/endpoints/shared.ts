import type { LoyverseImageMediaType, LoyverseRequestOptions } from '../client';
import {
	makeLoyverseMetadataRequest,
	makeLoyverseRequest,
	uploadLoyverseImage,
} from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else the
 * concrete context exposes.
 *
 * Loyverse needs nothing beyond the token - there is no account id to resolve,
 * so unlike Harvest there is no resolution chain and no discovery fallback.
 */
type LoyverseCallContext = {
	key: string;
};

/** Issues an authenticated request against the versioned API. */
export async function loyverseCall<T>(
	ctx: LoyverseCallContext,
	endpoint: string,
	options: LoyverseRequestOptions = {},
): Promise<T> {
	return await makeLoyverseRequest<T>(endpoint, ctx.key, options);
}

/**
 * Issues a raw-binary image upload against the versioned API.
 *
 * Takes the already-decoded bytes rather than a base64 string so that the
 * decoding happens once, at the endpoint boundary where the input schema is.
 */
export async function loyverseUpload<T>(
	ctx: LoyverseCallContext,
	endpoint: string,
	image: Blob,
	mediaType?: LoyverseImageMediaType,
): Promise<T> {
	return await uploadLoyverseImage<T>(endpoint, ctx.key, image, mediaType);
}

/**
 * Reads an unauthenticated metadata document.
 *
 * Takes no context: these endpoints send no credential, and accepting one would
 * suggest the token matters here when it does not.
 */
export async function loyverseMetadataCall<T>(endpoint: string): Promise<T> {
	return await makeLoyverseMetadataRequest<T>(endpoint);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * This matters more than it looks. Loyverse distinguishes an absent field from
 * an explicit `null`, and its writes are upserts: sending `{"name": null}`
 * clears the field, whereas omitting it leaves the stored value alone.
 * Serialising `undefined` would produce neither, so unset fields are removed
 * before the body is built.
 *
 * The item update path shows why the distinction is load-bearing: omitting
 * `variants` on an item upsert is read as "set variants to empty" and rejected
 * with `Could not update variants to []`, so a caller has to be able to send an
 * array without this helper stripping it.
 */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/** Same as {@link compactBody}, for query strings. */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const compacted: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/** The filters the collection endpoints share. */
type CommonListFilters = {
	cursor?: string | undefined;
	limit?: number | undefined;
	show_deleted?: boolean | undefined;
	created_at_min?: string | undefined;
	created_at_max?: string | undefined;
	updated_at_min?: string | undefined;
	updated_at_max?: string | undefined;
};

/**
 * Builds a list query from the shared filters plus any resource-specific ones.
 *
 * Getting a parameter name wrong here fails **silently**: Loyverse ignores an
 * unrecognised query parameter rather than rejecting it, so `item_ids` instead of
 * `items_ids` returns the whole collection unfiltered with a 200. Every
 * resource-specific name below was therefore confirmed against the live API by
 * checking that the filter actually narrowed the result, not merely that the
 * request succeeded.
 *
 * The API is not consistent about pluralisation - `items_ids` and `variants_ids`
 * but `modifier_ids`, `discount_ids` and `tax_ids` - so the names cannot be
 * derived from the resource and are spelled out at each call site.
 */
export function listQuery(
	input: CommonListFilters,
	extra: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	return compactQuery({
		cursor: input.cursor,
		limit: input.limit,
		show_deleted: input.show_deleted,
		created_at_min: input.created_at_min,
		created_at_max: input.created_at_max,
		updated_at_min: input.updated_at_min,
		updated_at_max: input.updated_at_max,
		...extra,
	});
}

/**
 * Encodes an id filter.
 *
 * Loyverse takes multiple ids as one comma-separated parameter rather than a
 * repeated one, verified live: two ids joined with a comma returned exactly those
 * two records. An empty array is dropped rather than sent as an empty string,
 * which would filter everything out instead of nothing.
 */
export function csv(values: readonly string[] | undefined): string | undefined {
	return values && values.length > 0 ? values.join(',') : undefined;
}
