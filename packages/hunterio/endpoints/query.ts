// Hunter is a PHP API: nested filters and array values are transmitted in
// PHP bracket notation (`location[country][include][]=US`, `size[]=10-50`,
// `custom_attributes[last_product]=x`). The shared transport encodes arrays
// as repeated bare keys and objects as one-level brackets, so filter objects
// are flattened here into pre-bracketed keys first. Stricter typing for input values is not
// feasible because query parameters across 160 endpoints accept heterogeneous scalar, array, and nested object filter values.
export const toBracketQuery = (
	value: Record<string, unknown>,
): Record<string, unknown> => {
	const result: Record<string, unknown> = {};

	// Stricter typing for item is not feasible because query parameter values can be any JSON scalar, array, or nested object.
	const walk = (path: string, item: unknown): void => {
		if (item === undefined) return;
		if (Array.isArray(item)) {
			const hasObjects = item.some(
				(element) => element !== null && typeof element === 'object',
			);
			if (hasObjects) {
				item.forEach((element, index) => {
					walk(`${path}[${index}]`, element);
				});
				return;
			}
			result[`${path}[]`] = item;
			return;
		}
		if (item !== null && typeof item === 'object') {
			for (const [key, nested] of Object.entries(item)) {
				walk(`${path}[${key}]`, nested);
			}
			return;
		}
		result[path] = item;
	};

	for (const [key, item] of Object.entries(value)) {
		walk(key, item);
	}

	return result;
};
