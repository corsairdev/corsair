export function snakeToCamelKey(key: string): string {
	return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function camelToSnakeKey(key: string): string {
	return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

type KVValue = string | number | boolean | undefined;
type KV = Record<string, KVValue>;

export function convertQueryKeysToSnakeCase(query: KV): KV {
	const out: KV = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		out[camelToSnakeKey(key)] = value;
	}
	return out;
}

export function convertKeysToCamelCase(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(convertKeysToCamelCase);
	}

	if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
				snakeToCamelKey(key),
				convertKeysToCamelCase(nested),
			]),
		);
	}

	return value;
}
