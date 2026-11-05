import { z } from 'zod';

/**
 * Shared field builders for Inventory API entities.
 * Official JSON omits or nulls optional fields (`x-nullable` in swagger).
 * https://api.apaleo.com/swagger/inventory-v1/swagger.json
 */
export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const Id = z.string();
export const StrArray = z.array(z.string()).nullable().optional();

/** Locale map (`{ en: "Hotel Munich", de: "..." }`) used on GET property/unit-group. */
export const Localized = z
	.record(z.string(), z.string().nullable())
	.nullable()
	.optional();

/**
 * List items flatten `name`/`description` to a string; GET returns a locale map.
 * Accept both so list and get rows persist into the same entity.
 */
export const LocalizedOrString = z.union([
	z.string(),
	z.record(z.string(), z.string().nullable()),
]);
