import type { AlphaVantageQuery } from '../client';

/**
 * Alpha Vantage reports an unknown ticker, an unsupported currency pair or an
 * out-of-range date by returning a well-formed envelope with nothing in it —
 * `{"Global Quote": {}}`, or a series envelope carrying only `Meta Data`. There
 * is no error key and the status is still 200, so emptiness has to be detected
 * here.
 *
 * The wording is matched by NOT_FOUND_ERROR in `error-handlers.ts`; keep the
 * two in step.
 */
export class AlphaVantageEmptyResultError extends Error {
	constructor(operation: string, subject: string) {
		super(`Alpha Vantage returned no data for ${subject} (${operation})`);
		this.name = 'AlphaVantageEmptyResultError';
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Throws when a plain object response carries no keys. */
export function assertNotEmpty(
	value: unknown,
	operation: string,
	subject: string,
): void {
	if (isRecord(value) && Object.keys(value).length === 0) {
		throw new AlphaVantageEmptyResultError(operation, subject);
	}
}

/**
 * Throws when a series envelope contains a `Meta Data` block but no series, or
 * a series with no points.
 */
export function assertSeriesHasData(
	envelope: unknown,
	operation: string,
	subject: string,
): void {
	if (!isRecord(envelope)) return;

	const seriesKeys = Object.keys(envelope).filter((key) => key !== 'Meta Data');
	if (seriesKeys.length === 0) {
		throw new AlphaVantageEmptyResultError(operation, subject);
	}

	const hasPoints = seriesKeys.some((key) => {
		const series = envelope[key];
		return isRecord(series) && Object.keys(series).length > 0;
	});
	if (!hasPoints) {
		throw new AlphaVantageEmptyResultError(operation, subject);
	}
}

/**
 * Alpha Vantage expects `true` / `false` as literal strings in the query
 * string, and omits the parameter entirely when it is not set.
 */
export function booleanParam(value: boolean | undefined): string | undefined {
	return value === undefined ? undefined : String(value);
}

/** Joins a list into the comma-separated form the API expects. */
export function listParam(
	values: readonly string[] | undefined,
): string | undefined {
	if (values === undefined || values.length === 0) return undefined;
	return values.join(',');
}

/**
 * Drops undefined entries so an unset optional never reaches the query string
 * as the literal `undefined`.
 */
export function compactQuery(query: AlphaVantageQuery): AlphaVantageQuery {
	const compacted: AlphaVantageQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			compacted[key] = value;
		}
	}
	return compacted;
}
