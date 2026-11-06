// Path parameter guard shared by every Lever endpoint family. Rejects empty
// values, dot segments, and separators before substitution so a crafted
// identifier cannot escape the intended API path.
export const leverPathParameter = (
	template: string,
	name: string,
	// unknown: callers reach this guard before schema parsing, so it must
	// reject non-string and malformed values rather than assume an input type.
	value: unknown,
) => {
	if (
		typeof value !== 'string' ||
		value.length === 0 ||
		value === '.' ||
		value === '..' ||
		/[\\/]/.test(value)
	) {
		throw new Error(`Invalid Lever ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};
