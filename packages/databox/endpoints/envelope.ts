import { asRecord } from 'corsair/core';

/** Reads `data` out of the `{ requestId, status, data }` envelope. */
// unknown: a success body is arbitrary JSON until the endpoint schema parses it.
export function envelopeData(
	raw: unknown,
): Record<string, unknown> | null | undefined {
	return asRecord(asRecord(raw)?.data);
}

// unknown: the pagination block is an untyped object until read one field at a
// time.
function readNumber(
	record: Record<string, unknown> | null | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' ? value : undefined;
}

/** Reads `page`, `pageSize` and `totalItems` from a list envelope's data. */
// unknown: a success body is arbitrary JSON until the endpoint schema parses it.
export function readPagination(
	data: Record<string, unknown> | null | undefined,
): {
	page: number | undefined;
	pageSize: number | undefined;
	totalItems: number | undefined;
} {
	const pagination = asRecord(data?.pagination);
	return {
		page: readNumber(pagination, 'page'),
		pageSize: readNumber(pagination, 'pageSize'),
		totalItems: readNumber(pagination, 'totalItems'),
	};
}

/**
 * Databox pages by zero-based `page`/`pageSize` with a `totalItems` count, so
 * the next page exists while the returned one is not the last.
 */
export function nextPageOf(
	page: number | undefined,
	pageSize: number | undefined,
	totalItems: number | undefined,
): number | null {
	if (
		page === undefined ||
		pageSize === undefined ||
		totalItems === undefined
	) {
		return null;
	}
	if (pageSize <= 0) return null;
	return (page + 1) * pageSize < totalItems ? page + 1 : null;
}

/**
 * Builds the shape callback for a list endpoint: pulls `items` and
 * `pagination` out of the envelope and adds a computed `nextPage`. `items`,
 * `page` and `pageSize` stay required in the output schema, so a body that
 * lacks any of them fails the output parse instead of reading as an empty
 * page. The reference marks `items` nullable on some lists (data sources,
 * metrics), so an explicit null reads as an empty page.
 */
export function shapeList(itemsKey: string) {
	// unknown: the envelope is documented but a proxy can answer anything.
	return (raw: unknown): unknown => {
		const data = envelopeData(raw);
		const { page, pageSize, totalItems } = readPagination(data);
		return {
			[itemsKey]: data?.items === null ? [] : data?.items,
			page,
			pageSize,
			totalItems,
			nextPage: nextPageOf(page, pageSize, totalItems),
		};
	};
}
