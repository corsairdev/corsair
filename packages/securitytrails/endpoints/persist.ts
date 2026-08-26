/**
 * Caching helpers.
 *
 * Persisting a result is a side benefit of a lookup, never its purpose. A
 * failing or unconfigured entity store must not turn a successful
 * SecurityTrails response into a thrown error, so every write goes through
 * `safely`.
 */
export async function safely(
	label: string,
	write: () => Promise<unknown>,
): Promise<void> {
	try {
		await write();
	} catch (error) {
		console.warn(`Failed to cache ${label} for securitytrails:`, error);
	}
}

/** Unix seconds → Date, the encoding SecurityTrails uses for certificate validity. */
export function fromUnixSeconds(
	seconds: number | null | undefined,
): Date | null {
	if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
	return new Date(seconds * 1000);
}

/** Earliest of a set of `first_seen` strings, ignoring absent values. */
export function earliestDate(
	values: Array<string | null | undefined>,
): Date | null {
	const timestamps = values
		.filter(
			(value): value is string => typeof value === 'string' && value !== '',
		)
		.map((value) => new Date(value).getTime())
		.filter((time) => Number.isFinite(time));

	if (timestamps.length === 0) return null;
	return new Date(Math.min(...timestamps));
}
