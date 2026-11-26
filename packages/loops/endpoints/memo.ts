/** Builds a value on first call and returns the same one after. */
export function memo<T>(build: () => T): () => T {
	let value: T | undefined;
	return () => {
		if (value === undefined) value = build();
		return value;
	};
}

/**
 * Joins schema maps without reading them: a spread would call every getter
 * and build every lazy schema at import.
 */
export function joinLazy<A extends object, B extends object>(
	a: A,
	b: B,
): A & B {
	return Object.defineProperties(
		{},
		{
			...Object.getOwnPropertyDescriptors(a),
			...Object.getOwnPropertyDescriptors(b),
		},
	) as A & B;
}
