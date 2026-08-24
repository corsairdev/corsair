/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Alpha Vantage inputs are less sensitive than a
 * write API's — they are tickers and intervals, not user-authored content — but
 * a watchlist is still information about the caller, and `NEWS_SENTIMENT`
 * carries free-text topics. Only explicitly named identifier fields are
 * recorded; the names of the remaining supplied fields are kept without their
 * values so an operator can still see what a call requested.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};

	for (const key of identifierKeys) {
		if (input[key] !== undefined) {
			payload[key] = input[key];
		}
	}

	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) {
		payload.fields = supplied;
	}

	return payload;
}
