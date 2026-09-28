export function q(
	input: Record<string, unknown>,
	keys: string[],
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const key of keys) {
		const value = input[key];
		if (value !== undefined) {
			query[key] = value as string | number | boolean;
		}
	}
	return query;
}

export function enc(value: string): string {
	return encodeURIComponent(value);
}
