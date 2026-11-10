import { asRecord } from 'corsair/core';
import { MeloAPIError } from '../client';

const LINK_BASE = 'https://api.stream.estate';

/**
 * Melo pages by number. A Hydra collection links the following page in
 * `hydra:view.hydra:next` (for example `/documents/properties?page=2`), so the
 * next page is that link's `page` query parameter, and it is absent on the last
 * page. A link without a usable `page` throws instead of ending the listing,
 * because a silent null would look like the last page.
 */
// unknown: raw is the response body; asRecord narrows it, and a body that is not
// an object is left for the output schema to reject.
export function nextPageOf(
	raw: unknown /* unknown: a Hydra collection body */,
): number | null {
	const view = asRecord(asRecord(raw)?.['hydra:view']);
	const next = view?.['hydra:next'];
	if (next === undefined || next === null) return null;
	if (typeof next !== 'string') {
		throw new MeloAPIError('Melo sent a hydra:next that is not a string');
	}
	let page: string | null;
	try {
		page = new URL(next, LINK_BASE).searchParams.get('page');
	} catch {
		page = null;
	}
	const value = page === null ? Number.NaN : Number(page);
	if (!Number.isInteger(value) || value < 1) {
		throw new MeloAPIError(
			`Melo sent a hydra:next without a usable page number: ${next}`,
		);
	}
	return value;
}

/** Adds `nextPage` beside the raw Hydra fields, which stay untouched. */
// unknown: raw is the response body; a body that is not an object is returned
// as it came so the output schema rejects it.
export function withNextPage(
	raw: unknown /* unknown: see nextPageOf */,
): unknown /* unknown: see above */ {
	const record = asRecord(raw);
	if (!record) return raw;
	return { ...record, nextPage: nextPageOf(record) };
}
