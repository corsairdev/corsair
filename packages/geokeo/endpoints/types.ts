import { z } from 'zod';

/**
 * Geokeo answers `results` with a `status` beside it, and the coordinates come
 * back as **strings**, not numbers:
 *
 * ```json
 * "geometry": { "location": { "lat": "40.74843124430164", "lng": "-73.9856567114413" } }
 * ```
 *
 * A reverse lookup also adds `distance` as one string with the unit glued on,
 * such as `"0.0010302984507433km"`. The schemas keep the documented shapes, and
 * the parsed numbers are offered as separate fields so a caller does not have
 * to parse them again.
 */
const CoordinateSchema = z.object({
	lat: z.string(),
	lng: z.string(),
});

const ViewportCornerSchema = z.object({
	lat: z.string(),
	lng: z.string(),
});

const AddressComponentsSchema = z.object({
	/** The place's own name, which is not always present. */
	name: z.string().optional(),
	island: z.string().optional(),
	neighbourhood: z.string().optional(),
	street: z.string().optional(),
	subdistrict: z.string().optional(),
	district: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postcode: z.string().optional(),
	country: z.string().optional(),
});

const ResultSchema = z.object({
	/** An OpenStreetMap class, such as `tourism` or `office`. */
	class: z.string().optional(),
	/** An OpenStreetMap type within that class, such as `attraction` or `yes`. */
	type: z.string().optional(),
	address_components: AddressComponentsSchema,
	formatted_address: z.string(),
	geometry: z.object({
		location: CoordinateSchema,
		viewport: z
			.object({
				northeast: ViewportCornerSchema,
				southwest: ViewportCornerSchema,
			})
			.optional(),
	}),
	/** A link to the same point on openstreetmap.org. */
	osmurl: z.string().optional(),
	/** Only on a reverse lookup: the distance from the query point, unit glued on. */
	distance: z.string().optional(),
	/** The latitude as a number, read from `geometry.location.lat`. */
	lat: z.number().nullable().optional(),
	/** The longitude as a number, read from `geometry.location.lng`. */
	lng: z.number().nullable().optional(),
	/** The distance in kilometres, with the unit stripped from `distance`. */
	distance_km: z.number().nullable().optional(),
});

const GeocodeResponseSchema = z.object({
	results: z.array(ResultSchema),
	/** A link to the credits page, which every answer carries. */
	credits: z.string().optional(),
	/** `ok`, or one of the documented codes. */
	status: z.string(),
});

/**
 * The coordinates as numbers, read from the string form Geokeo sends. A value
 * that is not a finite number becomes null rather than NaN, so a caller can
 * tell "absent" from "broken".
 */
export function parseCoordinate(value: string | undefined): number | null {
	// `Number('')` is 0, so an empty string has to be rejected before converting.
	if (value === undefined || value.trim() === '') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

/**
 * The distance on a reverse result, in kilometres. Geokeo sends it as one
 * string such as `"0.0010302984507433km"`, so the unit is stripped here.
 */
export function parseDistanceKm(value: string | undefined): number | null {
	// `Number('')` is 0, so an empty string has to be rejected before converting.
	if (value === undefined || value.trim() === '') return null;
	const parsed = Number(value.replace(/km$/i, ''));
	return Number.isFinite(parsed) ? parsed : null;
}

const CountrySchema = z
	.string()
	.length(2, 'Use a two-letter ISO 3166-1 alpha-2 country code, such as US')
	.optional()
	.describe('Restricts the search to one country, such as `us` or `de`');

const FormatSchema = z
	.enum(['json', 'xml'])
	.optional()
	.describe('Defaults to `json`; XML would not parse into these schemas');

const ForwardGeocodeInputSchema = z.object({
	q: z
		.string()
		.min(1, 'A query is required')
		.max(50, 'Geokeo documents a 50 character limit on the query')
		.describe(
			'What to look up, up to 50 characters, such as `empire state building`',
		),
	country: CountrySchema,
	format: FormatSchema,
});

const ReverseGeocodeInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of the point to reverse'),
	lng: z
		.number()
		.min(-180)
		.max(180)
		.describe('Longitude of the point to reverse'),
	format: FormatSchema,
});

export type GeokeoForwardGeocodeInput = z.infer<
	typeof ForwardGeocodeInputSchema
>;
export type GeokeoReverseGeocodeInput = z.infer<
	typeof ReverseGeocodeInputSchema
>;
export type GeokeoGeocodeResponse = z.infer<typeof GeocodeResponseSchema>;
export type GeokeoResult = z.infer<typeof ResultSchema>;
export type GeokeoAddressComponents = z.infer<typeof AddressComponentsSchema>;

export type GeokeoEndpointInputs = {
	forwardGeocode: GeokeoForwardGeocodeInput;
	reverseGeocode: GeokeoReverseGeocodeInput;
};

export type GeokeoEndpointOutputs = {
	forwardGeocode: GeokeoGeocodeResponse;
	reverseGeocode: GeokeoGeocodeResponse;
};

export const GeokeoEndpointInputSchemas = {
	forwardGeocode: ForwardGeocodeInputSchema,
	reverseGeocode: ReverseGeocodeInputSchema,
} as const;

export const GeokeoEndpointOutputSchemas = {
	forwardGeocode: GeocodeResponseSchema,
	reverseGeocode: GeocodeResponseSchema,
} as const;
