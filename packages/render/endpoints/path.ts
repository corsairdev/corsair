// unknown: path values come from parsed inputs; checked to be a safe,
// non-empty single segment before use.
export const renderPathParameter = (
	template: string,
	name: string,
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
