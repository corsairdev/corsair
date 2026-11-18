// Copies an input without the named keys, for event-log payloads that keep
// paging and sort options but leave out search text and addresses.
export function omit<T extends object, K extends keyof T>(
	input: T,
	...keys: K[]
): Omit<T, K> {
	const copy = { ...input };
	for (const key of keys) delete copy[key];
	return copy;
}
