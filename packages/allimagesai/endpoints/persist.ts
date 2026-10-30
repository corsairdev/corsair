/**
 * Persisting a result is a side benefit of a call, never its purpose. A failing
 * or unconfigured entity store must not turn a successful All-Images.ai
 * response into a thrown error, so every write goes through `safely`.
 */
export async function safely(
	label: string,
	write: () => Promise<unknown>,
): Promise<void> {
	try {
		await write();
	} catch (error) {
		console.warn(`Failed to cache ${label} for allimagesai:`, error);
	}
}

/** Parses a provider timestamp, returning null rather than an Invalid Date. */
export function toDate(value: string | null | undefined): Date | null {
	if (!value) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}
