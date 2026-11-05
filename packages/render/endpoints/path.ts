export const renderPathParameter = (
	template: string,
	name: string,
	// unknown: adapters pass fields straight from parsed input; this function
	// is the check that the value is a safe, non-empty single path segment.
	value: unknown,
) => {
	if (
		typeof value !== 'string' ||
		value.length === 0 ||
		value === '.' ||
		value === '..' ||
		/[\\/]/.test(value)
	) {
		throw new Error(`Invalid Render ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};
