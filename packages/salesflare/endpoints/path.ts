// Path parameter guard shared by every Salesflare endpoint family. Rejects
// empty values, dot segments, and separators before substitution so a crafted
// identifier cannot escape the intended API path.
export const salesflarePathParameter = (
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
		throw new Error(`Invalid Salesflare ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};
