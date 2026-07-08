/**
 * Escapes a string value for safe interpolation into a GAQL WHERE clause.
 * GAQL uses single-quoted string literals; this escapes backslashes and single quotes.
 */
export function escapeGaqlString(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Defence-in-depth: asserts a value contains only ASCII digits. */
export function assertDigitsOnly(value: string, label: string): void {
	if (!/^\d+$/.test(value)) {
		throw new Error(`${label} must contain only digits, got: ${value}`);
	}
}

/**
 * Validates that a Google Ads resource name matches the expected format.
 * @example assertResourceName('customers/123/offlineUserDataJobs/456', /^customers\/\d+\/offlineUserDataJobs\/\d+$/)
 */
export function assertResourceNameFormat(
	value: string,
	pattern: RegExp,
	label: string,
): void {
	if (!pattern.test(value)) {
		throw new Error(`${label} has invalid format: ${value}`);
	}
}
