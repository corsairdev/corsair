// Path parameter guard shared by every Klipfolio endpoint family. Rejects
// empty values, dot segments, and separators before substitution so a crafted
// identifier cannot escape the intended API path.
export const klipfolioPathParameter = (
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
		value === '-' ||
		/[\\/,;]/.test(value)
	) {
		throw new Error(`Invalid Klipfolio ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};

// Bulk variant for the operations Klipfolio documents with comma-separated
// identifiers in a single path placeholder (e.g. DELETE /users/{user_ids}).
// Each identifier is validated with the exact single-id rules, encoded, and
// rejoined with commas before substitution, so a crafted list cannot smuggle
// separators or dot segments into the path.
export const klipfolioBulkPathParameter = (
	template: string,
	name: string,
	// unknown: bulk identifiers arrive from untyped caller args as a
	// comma-separated string, validated per identifier below.
	value: unknown,
) => {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Invalid Klipfolio ${name}`);
	}
	const encodedIds = value.split(',').map((identifier) => {
		if (
			identifier.length === 0 ||
			identifier === '.' ||
			identifier === '..' ||
			identifier === '-' ||
			/[\\/,;]/.test(identifier)
		) {
			throw new Error(`Invalid Klipfolio ${name}`);
		}
		return encodeURIComponent(identifier);
	});
	return template.replace(`{${name}}`, encodedIds.join(','));
};
