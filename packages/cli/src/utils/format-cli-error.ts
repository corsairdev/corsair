/** Render an unknown thrown value as a single `[#corsair]:` diagnostic line. */
export function formatCliError(err: unknown): string {
	const message = err instanceof Error ? err.message : String(err);
	// Collapse newlines so a multiline message stays one diagnostic line.
	return `[#corsair]: ${message.replace(/\s*[\r\n]+\s*/g, ' ')}`;
}
