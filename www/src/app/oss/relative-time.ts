const MONTH_SECONDS = 2_629_800; // average Gregorian month (30.44 days)
const YEAR_SECONDS = 31_536_000; // 365 days

const UNITS: Array<{ limit: number; divisor: number; suffix: string }> = [
	{ limit: 60, divisor: 1, suffix: 's' },
	{ limit: 3600, divisor: 60, suffix: 'm' },
	{ limit: 86400, divisor: 3600, suffix: 'h' },
	{ limit: 604800, divisor: 86400, suffix: 'd' },
	{ limit: MONTH_SECONDS, divisor: 604800, suffix: 'w' },
	{ limit: YEAR_SECONDS, divisor: MONTH_SECONDS, suffix: 'mo' },
];

export function formatRelativeTime(iso: string, now = Date.now()): string {
	const timestamp = new Date(iso).getTime();
	if (!Number.isFinite(timestamp)) {
		return '—';
	}

	const seconds = Math.floor((now - timestamp) / 1000);
	if (seconds < 1) {
		return 'just now';
	}

	for (const unit of UNITS) {
		if (seconds < unit.limit) {
			return `${Math.floor(seconds / unit.divisor)}${unit.suffix} ago`;
		}
	}

	return `${Math.floor(seconds / YEAR_SECONDS)}y ago`;
}
