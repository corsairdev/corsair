// Path parameter guard shared by every PDF-API.io endpoint family. Rejects
// empty values, dot segments, and separators before substitution so a crafted
// identifier cannot escape the intended API path.
export const pdfApiPathParameter = (
	template: string,
	name: string,
	// unknown: identifiers arrive from untyped caller args, so the guard
	// validates the string shape before any substitution happens.
	value: unknown,
) => {
	if (
		typeof value !== 'string' ||
		value.length === 0 ||
		value === '.' ||
		value === '..' ||
		/[\\/]/.test(value)
	) {
		throw new Error(`Invalid PdfApi ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};
