import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { BlackbaudAPIError, makeBlackbaudRequest } from '../client';
import type {
	BlackbaudEndpointOutputs,
	ListMembershipsInput,
	MembershipRecord,
} from './types';

// SKY API returns at most 500 records per call; junction scans always use
// full pages so a caller-provided small limit cannot shrink the range.
// Ref: https://developer.blackbaud.com/skyapi/docs/basics#pagination
const SEARCH_PAGE_SIZE = 500;
// DOS guard: 20 pages cover 10,000 memberships. Exhaustion throws instead
// of returning [] so a still-unscanned membership is never reported absent.
const MAX_SEARCH_PAGES = 20;

// Constituent API list (ListConstituentMemberships). No single-membership GET
// exists on the Membership API (bare item route 404s; only sub-resource ops
// like fundraisers/renew exist), so junction filtering happens client-side.
// Ref: https://learn.microsoft.com/en-us/connectors/blackbaudconstituent
export const listMemberships: BlackbaudEndpoints['listMemberships'] = async (
	ctx,
	input,
) => {
	if (input.member_junction_id === undefined) {
		const response = await fetchMembershipPage(ctx, input, {
			limit: input.limit,
			offset: input.offset,
		});
		await logEventFromContext(
			ctx,
			'blackbaud.memberships.list',
			{ constituent_id: input.constituent_id, count: response.count },
			'completed',
		);
		return response;
	}

	const found = await searchMembershipPages(ctx, input);
	await logEventFromContext(
		ctx,
		'blackbaud.memberships.list',
		{ constituent_id: input.constituent_id, count: found.length },
		'completed',
	);
	return {
		count: found.length,
		value: found,
	};
};

function fetchMembershipPage(
	ctx: Parameters<BlackbaudEndpoints['listMemberships']>[0],
	input: ListMembershipsInput,
	paging: { limit: number | undefined; offset: number | undefined },
): Promise<BlackbaudEndpointOutputs['listMemberships']> {
	return makeBlackbaudRequest<BlackbaudEndpointOutputs['listMemberships']>(
		`constituent/v1/constituents/${encodeURIComponent(input.constituent_id)}/memberships`,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: paging.limit,
				offset: paging.offset,
			},
			subscriptionKey: ctx.options.subscriptionKey,
		},
	);
}

function matchesJunction(
	record: MembershipRecord,
	junctionId: string,
): boolean {
	return record.id === junctionId || record.member_junction_id === junctionId;
}

async function searchMembershipPages(
	ctx: Parameters<BlackbaudEndpoints['listMemberships']>[0],
	input: ListMembershipsInput,
): Promise<MembershipRecord[]> {
	const junctionId = input.member_junction_id ?? '';
	let offset = 0;
	for (let page = 0; page < MAX_SEARCH_PAGES; page++) {
		const response = await fetchMembershipPage(ctx, input, {
			limit: SEARCH_PAGE_SIZE,
			offset,
		});
		const found = response.value.filter((record) =>
			matchesJunction(record, junctionId),
		);
		if (found.length > 0) {
			return found;
		}
		// Stop only on a short (or empty) page. response.count is ignored
		// on purpose: its scope (page-local vs collection-total) is not
		// documented for this list, and trusting it can end the scan early.
		// An exact multiple of the page size costs one extra empty fetch.
		if (response.value.length < SEARCH_PAGE_SIZE) {
			return [];
		}
		offset += SEARCH_PAGE_SIZE;
	}
	// Edge case: an exact multiple of the page size (e.g. exactly 10,000
	// memberships) fills every page, so the loop above cannot see the
	// terminating short/empty page. One confirmatory fetch decides: an empty
	// (or short) page proves the whole collection was scanned and the
	// junction is truly absent; a full page proves records remain beyond the
	// cap and absence there is still unknown.
	const tail = await fetchMembershipPage(ctx, input, {
		limit: SEARCH_PAGE_SIZE,
		offset,
	});
	if (tail.value.length < SEARCH_PAGE_SIZE) {
		return [];
	}
	throw new BlackbaudAPIError(
		`member_junction_id '${junctionId}' not found within the first ${MAX_SEARCH_PAGES * SEARCH_PAGE_SIZE} memberships for constituent '${input.constituent_id}'; absence beyond that range is unknown`,
		{ code: 'SEARCH_RANGE_EXCEEDED' },
	);
}
