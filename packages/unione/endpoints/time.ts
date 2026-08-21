function pad(value: number): string {
	return String(value).padStart(2, '0');
}

export function formatUtcDateTime(date: Date): string {
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export function defaultEventDumpStartTime(): string {
	return formatUtcDateTime(new Date(Date.now() - 31 * 24 * 60 * 60 * 1000));
}
