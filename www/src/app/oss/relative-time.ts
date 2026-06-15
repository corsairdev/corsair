const UNITS: Array<{ limit: number; divisor: number; suffix: string }> = [
	{ limit: 60, divisor: 1, suffix: 's' },
	{ limit: 3600, divisor: 60, suffix: 'm' },
	{ limit: 86400, divisor: 3600, suffix: 'h' },
	{ limit: 604800, divisor: 86400, suffix: 'd' },
	{ limit: 2629800, divisor: 604800, suffix: 'w' },
];

export function formatRelativeTime(iso: string, now = Date.now()): string {
	const seconds = Math.max(
		0,
		Math.floor((now - new Date(iso).getTime()) / 1000),
	);

	for (const unit of UNITS) {
		if (seconds < unit.limit) {
			return `${Math.max(1, Math.floor(seconds / unit.divisor))}${unit.suffix} ago`;
		}
	}

	return `${Math.floor(seconds / 2629800)}mo ago`;
}
