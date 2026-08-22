function pad(value: number): string {
	return String(value).padStart(2, '0');
}

export function formatUtcDateTime(date: Date): string {
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

const DEFAULT_WINDOW_MS = 31 * 24 * 60 * 60 * 1000;

/**
 * Start of the default dump window: 31 days back from `endTime` when the caller
 * supplied one, otherwise from now. Anchoring to the end matters - defaulting
 * to `now - 31d` against a historical `end_time` yields start > end, an
 * inverted range UniOne cannot satisfy.
 */
export function defaultEventDumpStartTime(endTime?: string): string {
	const anchor = endTime
		? Date.parse(endTime.replace(' ', 'T') + 'Z')
		: Date.now();
	const end = Number.isNaN(anchor) ? Date.now() : anchor;
	return formatUtcDateTime(new Date(end - DEFAULT_WINDOW_MS));
}
