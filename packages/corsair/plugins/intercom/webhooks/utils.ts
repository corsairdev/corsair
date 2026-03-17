// Normalizes Intercom timestamp values to unix seconds.
// Intercom webhook item fields can be unix numbers, numeric strings, or ISO date strings.
// Returns undefined for null/undefined/unparseable values so optional fields stay clean.
export function toUnixTimestamp(val: unknown): number | undefined {
	if (val === null || val === undefined) return undefined;
	if (typeof val === 'number' && !isNaN(val)) return val;
	if (typeof val === 'string') {
		const ms = new Date(val).getTime();
		if (!isNaN(ms)) return Math.floor(ms / 1000);
	}
	return undefined;
}
