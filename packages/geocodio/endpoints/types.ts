import { z } from 'zod';

/**
 * Geocodio answers a `results` array even for a single lookup, and adds
 * `_warnings` when something is worth saying without failing. Each result
 * carries the parsed components beside the formatted address, so a caller can
 * read one field rather than re-parse a string.
 */
const AddressComponentsSchema = z.object({
	number: z.string().optional(),
	predirectional: z.string().optional(),
	street: z.string().optional(),
	suffix: z.string().optional(),
	postdirectional: z.string().optional(),
	unit_type: z.string().optional(),
	unit_number: z.string().optional(),
	/** The street line as Geocodio normalized it, including the number. */
	formatted_street: z.string().optional(),
	city: z.string().optional(),
	county: z.string().optional(),
	state_province: z.string().optional(),
	postal_code: z.string().optional(),
	/** The country's full name, such as `United States`. */
	country: z.string().optional(),
	/** The country code, such as `US`. */
	nation: z.string().optional(),
	building_name: z.string().optional(),
	sublocality: z.string().optional(),
});

const LocationSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});

/**
 * One distance cell, which a destination in a geocode answer also uses. The
 * spec documents `id: null` for a destination sent without an ID and
 * `duration_seconds: null` for a straight-line distance.
 */
const DistanceCellSchema = z.object({
	query: z.string().optional(),
	location: z.array(z.number()).optional(),
	id: z.string().nullable().optional(),
	distance_miles: z.number().optional(),
	distance_km: z.number().optional(),
	duration_seconds: z.number().nullable().optional(),
	// unknown: the geocode of this point has the full result shape, data
	// appends included; a caller that needs it reads it as a record.
	geocode: z.record(z.string(), z.unknown()).optional(),
});

const GeocodeResultSchema = z.object({
	/** A key stable across lookups, or null when Geocodio has none for the match. */
	stable_address_key: z.string().nullable().optional(),
	address_components: AddressComponentsSchema,
	/** The address split into lines, ready to print. */
	address_lines: z.array(z.string()).optional(),
	formatted_address: z.string(),
	location: LocationSchema,
	/** A score from 0 to 1 for how sure the match is. */
	accuracy: z.number(),
	/** `rooftop`, `range_interpolation`, `nearest_street`, `place` and so on. */
	accuracy_type: z.string(),
	/** How the match was made, or null when Geocodio could not tell. */
	match_type: z.string().nullable().optional(),
	source: z.string().optional(),
	// unknown: each data append (timezone, census, cd, acs-*, school and so on)
	// has its own nested shape and Geocodio adds appends over time, so the
	// values stay untyped and are keyed by the append's name.
	fields: z.record(z.string(), z.unknown()).optional(),
	/** Present when the request also asked for distances. */
	destinations: z.array(DistanceCellSchema).optional(),
});

const GeocodeResponseSchema = z.object({
	results: z.array(GeocodeResultSchema),
	_warnings: z.array(z.string()).optional(),
});

/**
 * A batch answers one entry per input, in input order: the query as sent and
 * the single-lookup answer for it under `response`. An entry Geocodio could
 * not use answers an empty `results` list with the reason in `error`, such as
 * `Could not geocode address. No matches found.`, rather than failing the batch.
 */
const BatchGeocodeResponseSchema = z.object({
	results: z.array(
		z.object({
			query: z.string(),
			response: GeocodeResponseSchema.extend({
				error: z.string().optional(),
				reference: z.string().optional(),
			}),
		}),
	),
	_warnings: z.array(z.string()).optional(),
});

const ParseResponseSchema = z.object({
	address_components: AddressComponentsSchema,
	formatted_address: z.string().optional(),
});

const DistanceResponseSchema = z.object({
	// unknown: the origin's `location` pair and its full geocode result.
	origin: z.record(z.string(), z.unknown()).optional(),
	mode: z.string().optional(),
	/** One entry per destination, in the order they were sent. */
	destinations: z.array(DistanceCellSchema),
	_warnings: z.array(z.string()).optional(),
});

const DistanceMatrixRowSchema = z.object({
	// unknown: the origin's query, `location` pair and full geocode result.
	origin: z.record(z.string(), z.unknown()).optional(),
	destinations: z.array(DistanceCellSchema),
});

const DistanceMatrixResponseSchema = z.object({
	mode: z.string().optional(),
	results: z.array(DistanceMatrixRowSchema),
	_warnings: z.array(z.string()).optional(),
});

const DistanceJobSchema = z.object({
	identifier: z.string(),
	name: z.string().optional(),
	created_at: z.string().optional(),
	origins_type: z.string().optional(),
	origins_count: z.number().optional(),
	destinations_type: z.string().optional(),
	destinations_count: z.number().optional(),
	distance_mode: z.string().optional(),
	calculation_type: z.string().optional(),
	/** Such as `PROCESSING` or `COMPLETED`; kept a string so a new state parses. */
	status: z.string().optional(),
	/** Null until the job finishes, then the URL to download the result. */
	download_url: z.string().nullable().optional(),
	total_calculations: z.number().optional(),
	calculations_completed: z.number().optional(),
	progress: z.number().optional(),
	status_message: z.string().nullable().optional(),
	time_left: z.string().nullable().optional(),
	is_expired: z.boolean().optional(),
});

/** `GET /distance-jobs/{identifier}` wraps the job in `data`. */
const JobResponseSchema = z.object({
	data: DistanceJobSchema,
	_warnings: z.array(z.string()).optional(),
});

/** Deleting a job answers a confirmation message, not the job. */
const JobDeleteResponseSchema = z.object({
	message: z.string().optional(),
	_warnings: z.array(z.string()).optional(),
});

const JobListResponseSchema = z.object({
	data: z.array(DistanceJobSchema),
	// unknown: Laravel's pagination links (`first`, `last`, `prev`, `next`).
	links: z.record(z.string(), z.unknown()).optional(),
	// unknown: Laravel's pagination meta (`current_page`, `last_page`, `total`
	// and a `links` array), which only paging reads.
	meta: z.record(z.string(), z.unknown()).optional(),
	_warnings: z.array(z.string()).optional(),
});

const ListStatusSchema = z.object({
	/** Such as `PROCESSING` or `COMPLETED`; kept a string so a new state parses. */
	state: z.string().optional(),
	progress: z.number().optional(),
	message: z.string().nullable().optional(),
	time_left_description: z.string().nullable().optional(),
	time_left_seconds: z.union([z.string(), z.number()]).nullable().optional(),
});

const ListSchema = z.object({
	/** A number, such as `148`. */
	id: z.number(),
	status: ListStatusSchema.optional(),
	file: z
		.object({
			estimated_rows_count: z.number().nullable().optional(),
			filename: z.string().nullable().optional(),
		})
		.optional(),
	fields: z.array(z.string()).optional(),
	/** Null while the list is still processing. */
	download_url: z.string().nullable().optional(),
	expires_at: z.string().nullable().optional(),
	_warnings: z.array(z.string()).optional(),
});

/** Deleting a list answers `{ success: true }`, not the list. */
const ListDeleteResponseSchema = z.object({
	success: z.boolean(),
	_warnings: z.array(z.string()).optional(),
});

const ListCollectionSchema = z.object({
	current_page: z.number().optional(),
	current_page_url: z.string().nullable().optional(),
	per_page: z.number().optional(),
	from: z.number().optional(),
	to: z.number().optional(),
	data: z.array(ListSchema),
	next_page_url: z.string().nullable().optional(),
	prev_page_url: z.string().nullable().optional(),
	first_page_url: z.string().nullable().optional(),
	path: z.string().optional(),
	_warnings: z.array(z.string()).optional(),
});

/**
 * The fields a geocode can append. Each name is one of Geocodio's data
 * appends, and asking for it adds a key under the result's `fields`. They
 * travel as one comma-separated `fields` parameter.
 */
const FieldsSchema = z
	.array(z.string().min(1))
	.optional()
	.describe(
		'Data appends to add to each result, such as `timezone`, `congressional_district`, `stateleg`, `school`, `census`, `zip4`, or a Census ACS name',
	);

const CountrySchema = z
	.string()
	.min(2)
	.optional()
	.describe(
		'Restricts and formats the lookup as `US`, `CA`, `MX`, `GB`, `AU` or `NZ`, which also changes how an address is parsed',
	);

const DistanceUnitsSchema = z
	.enum(['miles', 'km'])
	.optional()
	.describe('Which distance figure to order and filter by');

const ForwardGeocodeInputSchema = z
	.object({
		q: z
			.string()
			.min(1)
			.optional()
			.describe(
				'A single-line address, such as `1109 N Highland St, Arlington, VA 22201`',
			),
		street: z
			.string()
			.min(1)
			.optional()
			.describe('The street line, without the city'),
		street2: z.string().optional().describe('The unit, suite or floor'),
		city: z.string().min(1).optional().describe('The city'),
		county: z.string().min(1).optional().describe('The county'),
		state_province: z
			.string()
			.min(1)
			.optional()
			.describe('The state or province'),
		postal_code: z
			.string()
			.min(1)
			.optional()
			.describe('The ZIP or postal code'),
		country: CountrySchema,
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('How many matches to return, at most 100'),
		fields: FieldsSchema,
		enterprise: z
			.boolean()
			.optional()
			.describe('Uses api.enterprise.geocod.io, for accounts that have one'),
	})
	.describe(
		'Send either a single `q`, or the components (`street`, `city`, `state_province` and so on)',
	);

const ReverseGeocodeInputSchema = z.object({
	q: z
		.string()
		.min(1, 'A coordinate pair is required')
		.describe('A `lat,lng` pair, such as `38.886665,-77.094733`'),
	fields: FieldsSchema,
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const BatchGeocodeInputSchema = z.object({
	addresses: z
		.array(z.string().min(1))
		.min(1, 'Send at least one address')
		.max(10_000, 'Geocodio accepts at most 10,000 addresses in a batch')
		.describe('The addresses to geocode in one request'),
	fields: FieldsSchema,
	country: CountrySchema,
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const BatchReverseInputSchema = z.object({
	coordinates: z
		.array(z.string().min(1))
		.min(1, 'Send at least one coordinate pair')
		.max(10_000, 'Geocodio accepts at most 10,000 coordinates in a batch')
		.describe('The `lat,lng` pairs to reverse geocode in one request'),
	fields: FieldsSchema,
	country: CountrySchema,
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const ParseInputSchema = z.object({
	q: z
		.string()
		.min(1, 'An address is required')
		.describe('An address to split into its components, without geocoding it'),
});

const DistanceInputSchema = z.object({
	origin: z
		.string()
		.min(1, 'An origin is required')
		.describe('The starting address or `lat,lng` pair'),
	destinations: z
		.array(z.string().min(1))
		.min(1, 'At least one destination is required')
		.describe('The addresses or `lat,lng` pairs to measure from the origin'),
	mode: z
		.enum(['driving', 'haversine', 'straightline'])
		.optional()
		.describe(
			'`driving` follows roads and gives a duration; `haversine` and `straightline` are the as-the-crow-flies distance',
		),
	units: z
		.enum(['miles', 'km'])
		.optional()
		.describe('Which distance figure to use'),
	max_results: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Caps the destinations returned'),
	max_distance: z
		.number()
		.optional()
		.describe('Drops destinations farther than this'),
	max_duration: z
		.number()
		.int()
		.optional()
		.describe('Drops destinations slower than this'),
	min_distance: z
		.number()
		.optional()
		.describe('Drops destinations nearer than this'),
	min_duration: z
		.number()
		.int()
		.optional()
		.describe('Drops destinations faster than this'),
	order_by: z
		.enum(['distance', 'duration'])
		.optional()
		.describe('Which figure to sort by'),
	sort_order: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
	country: CountrySchema,
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const DistanceMatrixInputSchema = z.object({
	origins: z
		.array(z.string().min(1))
		.min(1, 'At least one origin is required')
		.describe('The starting addresses or `lat,lng` pairs, one row each'),
	destinations: z
		.array(z.string().min(1))
		.min(1, 'At least one destination is required')
		.describe('The addresses or `lat,lng` pairs, one column each'),
	calculation_type: z
		.enum(['matrix', 'pairs'])
		.optional()
		.describe(
			'`matrix` measures every origin against every destination; `pairs` pairs each origin with the destination at the same position',
		),
	mode: z
		.enum(['driving', 'haversine', 'straightline'])
		.optional()
		.describe(
			'`driving` follows roads and gives a duration; `haversine` and `straightline` are the as-the-crow-flies distance',
		),
	units: DistanceUnitsSchema,
	max_results: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Caps the cells returned'),
	max_distance: z.number().optional().describe('Drops cells farther than this'),
	max_duration: z
		.number()
		.int()
		.optional()
		.describe('Drops cells slower than this'),
	min_distance: z.number().optional().describe('Drops cells nearer than this'),
	min_duration: z
		.number()
		.int()
		.optional()
		.describe('Drops cells faster than this'),
	order_by: z
		.enum(['distance', 'duration'])
		.optional()
		.describe('Which figure to sort by'),
	sort_order: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
});

const JobListInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('The page of jobs to read'),
});

const ListIdSchema = z
	.union([z.number().int().min(1), z.string().min(1, 'A list ID is required')])
	.describe('The list ID, as `lists.all` returns it');

const JobGetInputSchema = z.object({
	identifier: z
		.string()
		.min(1, 'A job identifier is required')
		.describe('The job ID'),
});

const JobDeleteInputSchema = z.object({
	identifier: z
		.string()
		.min(1, 'A job identifier is required')
		.describe('The job ID'),
});

const ListGetInputSchema = z.object({
	id: ListIdSchema,
});

const ListDeleteInputSchema = z.object({
	id: ListIdSchema,
});

const ListAllInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('The page of lists to read'),
});

export type GeocodioForwardGeocodeInput = z.infer<
	typeof ForwardGeocodeInputSchema
>;
export type GeocodioReverseGeocodeInput = z.infer<
	typeof ReverseGeocodeInputSchema
>;
export type GeocodioBatchGeocodeInput = z.infer<typeof BatchGeocodeInputSchema>;
export type GeocodioBatchReverseInput = z.infer<typeof BatchReverseInputSchema>;
export type GeocodioParseInput = z.infer<typeof ParseInputSchema>;
export type GeocodioDistanceInput = z.infer<typeof DistanceInputSchema>;
export type GeocodioDistanceMatrixInput = z.infer<
	typeof DistanceMatrixInputSchema
>;
export type GeocodioJobListInput = z.infer<typeof JobListInputSchema>;
export type GeocodioJobGetInput = z.infer<typeof JobGetInputSchema>;
export type GeocodioJobDeleteInput = z.infer<typeof JobDeleteInputSchema>;
export type GeocodioListGetInput = z.infer<typeof ListGetInputSchema>;
export type GeocodioListDeleteInput = z.infer<typeof ListDeleteInputSchema>;
export type GeocodioListAllInput = z.infer<typeof ListAllInputSchema>;

export type GeocodioGeocodeResponse = z.infer<typeof GeocodeResponseSchema>;
export type GeocodioBatchGeocodeResponse = z.infer<
	typeof BatchGeocodeResponseSchema
>;
export type GeocodioJobResponse = z.infer<typeof JobResponseSchema>;
export type GeocodioJobDeleteResponse = z.infer<typeof JobDeleteResponseSchema>;
export type GeocodioListDeleteResponse = z.infer<
	typeof ListDeleteResponseSchema
>;
export type GeocodioParseResponse = z.infer<typeof ParseResponseSchema>;
export type GeocodioDistanceResponse = z.infer<typeof DistanceResponseSchema>;
export type GeocodioDistanceMatrixResponse = z.infer<
	typeof DistanceMatrixResponseSchema
>;
export type GeocodioJobListResponse = z.infer<typeof JobListResponseSchema>;
export type GeocodioJob = z.infer<typeof DistanceJobSchema>;
export type GeocodioListResponse = z.infer<typeof ListCollectionSchema>;
export type GeocodioList = z.infer<typeof ListSchema>;
export type GeocodioGeocodeResult = z.infer<typeof GeocodeResultSchema>;
export type GeocodioAddressComponents = z.infer<typeof AddressComponentsSchema>;
export type GeocodioDistanceCell = z.infer<typeof DistanceCellSchema>;

export type GeocodioEndpointInputs = {
	forwardGeocode: GeocodioForwardGeocodeInput;
	reverseGeocode: GeocodioReverseGeocodeInput;
	batchGeocode: GeocodioBatchGeocodeInput;
	batchReverse: GeocodioBatchReverseInput;
	parse: GeocodioParseInput;
	distance: GeocodioDistanceInput;
	distanceMatrix: GeocodioDistanceMatrixInput;
	jobsList: GeocodioJobListInput;
	jobGet: GeocodioJobGetInput;
	jobDelete: GeocodioJobDeleteInput;
	listsAll: GeocodioListAllInput;
	listGet: GeocodioListGetInput;
	listDelete: GeocodioListDeleteInput;
};

export type GeocodioEndpointOutputs = {
	forwardGeocode: GeocodioGeocodeResponse;
	reverseGeocode: GeocodioGeocodeResponse;
	batchGeocode: GeocodioBatchGeocodeResponse;
	batchReverse: GeocodioBatchGeocodeResponse;
	parse: GeocodioParseResponse;
	distance: GeocodioDistanceResponse;
	distanceMatrix: GeocodioDistanceMatrixResponse;
	jobsList: GeocodioJobListResponse;
	jobGet: GeocodioJobResponse;
	jobDelete: GeocodioJobDeleteResponse;
	listsAll: GeocodioListResponse;
	listGet: GeocodioList;
	listDelete: GeocodioListDeleteResponse;
};

export const GeocodioEndpointInputSchemas = {
	forwardGeocode: ForwardGeocodeInputSchema,
	reverseGeocode: ReverseGeocodeInputSchema,
	batchGeocode: BatchGeocodeInputSchema,
	batchReverse: BatchReverseInputSchema,
	parse: ParseInputSchema,
	distance: DistanceInputSchema,
	distanceMatrix: DistanceMatrixInputSchema,
	jobsList: JobListInputSchema,
	jobGet: JobGetInputSchema,
	jobDelete: JobDeleteInputSchema,
	listsAll: ListAllInputSchema,
	listGet: ListGetInputSchema,
	listDelete: ListDeleteInputSchema,
} as const;

export const GeocodioEndpointOutputSchemas = {
	forwardGeocode: GeocodeResponseSchema,
	reverseGeocode: GeocodeResponseSchema,
	batchGeocode: BatchGeocodeResponseSchema,
	batchReverse: BatchGeocodeResponseSchema,
	parse: ParseResponseSchema,
	distance: DistanceResponseSchema,
	distanceMatrix: DistanceMatrixResponseSchema,
	jobsList: JobListResponseSchema,
	jobGet: JobResponseSchema,
	jobDelete: JobDeleteResponseSchema,
	listsAll: ListCollectionSchema,
	listGet: ListSchema,
	listDelete: ListDeleteResponseSchema,
} as const;
