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
	/** The street line as Geoapify normalized it, including the number. */
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

/** One distance cell, which a destination in a geocode answer also uses. */
const DistanceCellSchema = z.object({
	query: z.string().optional(),
	location: z.array(z.number()).optional(),
	id: z.string().optional(),
	distance_miles: z.number().optional(),
	distance_km: z.number().optional(),
	duration_seconds: z.number().optional(),
});

const GeocodeResultSchema = z.object({
	/** A key stable across lookups, which other APIs accept as input. */
	stable_address_key: z.string().optional(),
	address_components: AddressComponentsSchema,
	/** The address split into lines, ready to print. */
	address_lines: z.array(z.string()).optional(),
	formatted_address: z.string(),
	location: LocationSchema,
	/** A score from 0 to 1 for how sure the match is. */
	accuracy: z.number(),
	/** `rooftop`, `range_interpolation`, `nearest_street`, `place` and so on. */
	accuracy_type: z.string(),
	/** `exact` or `non_exact`, or null when Geoapify could not tell. */
	match_type: z.string().nullable().optional(),
	source: z.string().optional(),
	/** The data appends that were requested, keyed by their name. */
	fields: z.record(z.string(), z.unknown()).optional(),
	/** Present when the request also asked for distances. */
	destinations: z.array(DistanceCellSchema).optional(),
});

const GeocodeResponseSchema = z.object({
	results: z.array(GeocodeResultSchema),
	_warnings: z.array(z.string()).optional(),
});

const ParseResponseSchema = z.object({
	address_components: AddressComponentsSchema,
	formatted_address: z.string().optional(),
});

const DistanceResponseSchema = z.object({
	origin: z.record(z.string(), z.unknown()).optional(),
	mode: z.string().optional(),
	/** One entry per destination, in the order they were sent. */
	destinations: z.array(DistanceCellSchema),
	_warnings: z.array(z.string()).optional(),
});

const DistanceMatrixRowSchema = z.object({
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
	status: z.string().optional(),
	/** The URL to poll for the result once the job finishes. */
	download_url: z.string().optional(),
	expires_at: z.string().optional(),
	created_at: z.string().optional(),
	completed_at: z.string().optional(),
	callback_url: z.string().optional(),
});

const JobListResponseSchema = z.object({
	data: z.array(DistanceJobSchema),
	links: z.record(z.string(), z.unknown()).optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
	_warnings: z.array(z.string()).optional(),
});

const ListSchema = z.object({
	id: z.string(),
	status: z.string().optional(),
	file: z.record(z.string(), z.unknown()).optional(),
	fields: z.array(z.string()).optional(),
	download_url: z.string().optional(),
	expires_at: z.string().optional(),
	_warnings: z.array(z.string()).optional(),
});

const ListCollectionSchema = z.object({
	current_page: z.number().optional(),
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
 * The fields a geocode can append. Each name is one of Geoapify's data
 * appends, and asking for it adds a key under the result's `fields`.
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

const DistanceModeSchema = z
	.enum(['driving', 'straightline'])
	.optional()
	.describe(
		'`driving` follows roads and gives a duration; `straightline` is the as-the-crow-flies distance',
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
	country: CountrySchema.optional().describe(
		'Restricts the lookup to one country, which sharpens a border case',
	),
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const BatchGeocodeInputSchema = z.object({
	addresses: z
		.array(z.string().min(1))
		.min(1, 'Send at least one address')
		.max(10_000, 'Geoapify accepts at most 10,000 addresses in a batch')
		.describe('The addresses to geocode in one request'),
	fields: FieldsSchema,
	country: CountrySchema,
	enterprise: z.boolean().optional().describe('Uses the enterprise host'),
});

const BatchReverseInputSchema = z.object({
	coordinates: z
		.array(z.string().min(1))
		.min(1, 'Send at least one coordinate pair')
		.max(10_000, 'Geoapify accepts at most 10,000 coordinates in a batch')
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
		.enum(['matrix', 'one-to-one'])
		.optional()
		.describe(
			'`matrix` measures every origin against every destination; `one-to-one` pairs each origin with one destination',
		),
	mode: DistanceModeSchema,
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
	country: CountrySchema,
});

const JobListInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('The page of jobs to read'),
});

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
	id: z.string().min(1, 'A list ID is required').describe('The list ID'),
});

const ListDeleteInputSchema = z.object({
	id: z.string().min(1, 'A list ID is required').describe('The list ID'),
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
	batchGeocode: GeocodioGeocodeResponse;
	batchReverse: GeocodioGeocodeResponse;
	parse: GeocodioParseResponse;
	distance: GeocodioDistanceResponse;
	distanceMatrix: GeocodioDistanceMatrixResponse;
	jobsList: GeocodioJobListResponse;
	jobGet: GeocodioJob;
	jobDelete: GeocodioJob;
	listsAll: GeocodioListResponse;
	listGet: GeocodioList;
	listDelete: GeocodioList;
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
	batchGeocode: GeocodeResponseSchema,
	batchReverse: GeocodeResponseSchema,
	parse: ParseResponseSchema,
	distance: DistanceResponseSchema,
	distanceMatrix: DistanceMatrixResponseSchema,
	jobsList: JobListResponseSchema,
	jobGet: DistanceJobSchema,
	jobDelete: DistanceJobSchema,
	listsAll: ListCollectionSchema,
	listGet: ListSchema,
	listDelete: ListSchema,
} as const;
