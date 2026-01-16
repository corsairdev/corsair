// ─────────────────────────────────────────────────────────────────────────────
// Type Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Utility type that converts a union type to an intersection type.
 * This is useful for combining multiple plugin interfaces into a single client interface.
 * @template U - The union type to convert
 */
export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

/**
 * Bivariance hack for function types to ensure proper type inference.
 * This helps TypeScript correctly infer function parameters and return types.
 * @template Args - The function arguments array
 * @template R - The function return type
 */
export type Bivariant<Args extends unknown[], R> = {
	bivarianceHack(...args: Args): R;
}['bivarianceHack'];

// ─────────────────────────────────────────────────────────────────────────────
// UUID Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a UUID v4 string using crypto.randomUUID() if available,
 * otherwise falls back to a Math.random() implementation.
 * @returns A UUID v4 string
 */
export function generateUuidV4(): string {
	const cryptoAny = globalThis.crypto as unknown as
		| { randomUUID?: () => string }
		| undefined;
	if (cryptoAny?.randomUUID) {
		return cryptoAny.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempts to parse a value as JSON if it's a string, otherwise returns the value unchanged.
 * This is useful for handling database values that might be stored as JSON strings.
 * @param value - The value to parse
 * @returns The parsed value or the original value if parsing fails
 */
export function parseJsonLike(value: unknown): unknown {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}
