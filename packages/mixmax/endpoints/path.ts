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

// Multi-segment path parameter guard for the identifiers Mixmax documents as
// containing slashes (e.g. GET /v1/meetings/transcripts/{id} takes
// `meetingSummaryId/transcriptId/date`). Each segment must be non-empty and
// free of dot segments and backslashes, then every segment is percent-encoded
// individually and rejoined with `/`, so the substitution cannot climb out of
// the intended path.
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
			(segment) => segment.length === 0 || segment === '.' || segment === '..',
		)
	) {
		throw new Error(`Invalid Mixmax ${name}`);
	}
	return template.replace(
		`{${name}}`,
		segments.map((segment) => encodeURIComponent(segment)).join('/'),
	);
};
