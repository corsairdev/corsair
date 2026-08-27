const CLI_ERROR_PREFIX = '[#corsair]:';

export function formatCliError(err: unknown): string {
	const raw = err instanceof Error ? err.message : String(err);
	const collapsed = raw.replace(/\s*[\r\n]+\s*/g, ' ').trim();
	const body = collapsed.replace(/^\[#corsair\]:\s*/i, '').trim();
	return `${CLI_ERROR_PREFIX} ${body}`;
}
