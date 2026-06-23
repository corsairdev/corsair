export type CallableProperty = (...args: readonly unknown[]) => unknown;

export function getCallableProperty(
	value: unknown,
	key: string,
): CallableProperty | undefined {
	if (!value || typeof value !== 'object') return undefined;

	const property = (value as Record<string, unknown>)[key];
	return typeof property === 'function'
		? (...args) => Reflect.apply(property, value, args)
		: undefined;
}
