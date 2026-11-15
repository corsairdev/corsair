import { z } from 'zod';

/**
 * Rocketlane expresses a filter as a query key `field.operator` with a scalar
 * value, so every filter object has to be flattened into that shape. The
 * operator is appended verbatim, which is why each input schema names the
 * operators it accepts rather than taking a free-form string.
 */
export function filterOf(
	field: string,
	// unknown: the caller's filter value, already validated by the input schema.
	value: unknown,
): Record<string, string | number | boolean> {
	const record = asFilterRecord(value);
	if (!record) return {};

	const out: Record<string, string | number | boolean> = {};
	for (const [operator, raw] of Object.entries(record)) {
		if (raw === undefined || raw === null) continue;
		if (Array.isArray(raw)) {
			// `oneOf`/`noneOf` take a comma-separated list.
			const joined = raw.filter(
				(part) => typeof part === 'string' || typeof part === 'number',
			);
			if (joined.length > 0) out[`${field}.${operator}`] = joined.join(',');
			continue;
		}
		if (
			typeof raw === 'string' ||
			typeof raw === 'number' ||
			typeof raw === 'boolean'
		) {
			out[`${field}.${operator}`] = raw;
		}
	}
	return out;
}

/** Narrows a filter object to its entries. */
function asFilterRecord(
	// unknown: a filter object whose operators the input schema has validated,
	// but whose values are a union of scalar and list forms.
	value: unknown,
): Record<string, unknown> | null {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return null;
	}
	// unknown: narrowed to an object above; the operator names are read by the
	// caller and their values are re-checked there.
	return value as Record<string, unknown>;
}

/**
 * A projection is a repeated `includeFields` query parameter, not a
 * comma-separated one, so it is kept out of `filterOf` and passed separately.
 */
export const IncludeFieldsSchema = z
	.array(z.string())
	.optional()
	.describe('Return only these fields; a repeated query parameter.');
