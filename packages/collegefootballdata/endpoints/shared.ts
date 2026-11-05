import type { CollegeFootballDataRequestOptions } from '../client';
import { makeCollegeFootballDataRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type CollegeFootballDataCallContext = {
	key: string;
};

/** Issues a College Football Data request under the plugin's API key. */
export async function collegeFootballDataCall<T>(
	ctx: CollegeFootballDataCallContext,
	path: string,
	options: CollegeFootballDataRequestOptions = {},
): Promise<T> {
	return await makeCollegeFootballDataRequest<T>(path, ctx.key, options);
}

/** Drops keys whose value is `undefined`. */
export function compactQuery<
	T extends Record<string, string | number | boolean | string[] | undefined>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
