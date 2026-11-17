/**
 * Simple Analytics answers JSON of several shapes plus plain-text errors, and
 * the endpoint's zod schema is what gives each data shape its type. These
 * aliases name the untyped step in between, so the reasoning is written once.
 */

/** A parsed JSON value before any schema has looked at it. */
export type UnknownJson = unknown; // unknown: JSON.parse returns any of these

/** A JSON object whose keys are not known in advance. */
// unknown: the keys and their value types arrive with the response.
export type JsonObject = Record<string, UnknownJson>;

/** Narrows any value to a JSON object: JSON.parse also returns arrays and null. */
export function isJsonObject(value: UnknownJson): value is JsonObject {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}
