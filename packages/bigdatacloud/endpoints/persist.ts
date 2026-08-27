/**
 * Safely execute an entity persistence callback without breaking the main endpoint flow.
 *
 * @param label - A descriptor for the operation being performed
 * @param callback - The async database operation to run
 */
export async function safely(
	label: string,
	callback: () => Promise<unknown>,
): Promise<void> {
	try {
		await callback();
	} catch (error) {
		console.warn(
			`[BigDataCloud DB Persistence] Failed to persist ${label}:`,
			error instanceof Error ? error.message : error,
		);
	}
}
