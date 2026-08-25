/** Render an unknown thrown value as a single `[#corsair]:` diagnostic line. */
export function formatCliError(err: unknown): string {
	return `[#corsair]: ${err instanceof Error ? err.message : String(err)}`;
}
