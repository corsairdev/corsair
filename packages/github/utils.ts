export function snakeToCamelKey(key: string): string {
	return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
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
