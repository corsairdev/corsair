// Path parameter guard shared by every Mixmax endpoint family. Rejects
// empty values, dot segments, and separators before substitution so a crafted
// identifier cannot escape the intended API path.
export const mixmaxPathParameter = (
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
		throw new Error(`Invalid Mixmax ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};

// Guard for the one identifier Mixmax documents as containing slashes: the
// meeting summary id passed to GET /v1/meetings/transcripts/{id}
// (`meetingSummaryId/transcriptId/date`). The reference says to URL encode
// the id before appending it, so the whole value is percent-encoded and its
// slashes travel as `%2F` inside a single path segment. Each part must still
// be non-empty and free of dot segments and backslashes, so a value that a
// server decodes early cannot climb out of the intended path.
export const mixmaxMultiSegmentPathParameter = (
	template: string,
	name: string,
	// unknown: identifiers arrive from untyped caller args, so the guard
	// validates the string shape before any substitution happens.
	value: unknown,
) => {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Invalid Mixmax ${name}`);
	}
	const segments = value.split('/');
	if (
		segments.some(
			(segment) =>
				segment.length === 0 ||
				segment === '.' ||
				segment === '..' ||
				segment.includes('\\'),
		)
	) {
		throw new Error(`Invalid Mixmax ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};
