/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention, so anything put here is readable by everyone with
 * access to the log, for as long as the log is kept.
 *
 * The rule is therefore deny by default: a parameter's **value** is recorded
 * only if it appears in {@link LOGGABLE_KEYS} below. Everything else is
 * recorded by name, with a length where the value has one, so an operator can
 * still see what a call supplied without seeing what it contained.
 *
 * The earlier version of this file worked the other way round - it listed the
 * fields to hide - which meant a parameter nobody had thought about was logged
 * in full. Across 129 operations and 235 distinct parameters that is not a
 * list anyone can keep correct, and it put income, deductions, street
 * addresses, IBANs and routing numbers into the event log. Inverting it makes
 * the failure mode a missing field in an audit row rather than a caller's bank
 * details in permanent storage.
 *
 * The test in `logging.test.ts` walks the documented parameters of all 129
 * operations and asserts that nothing outside this list can reach a payload.
 */

/**
 * Parameters whose values may be recorded.
 *
 * The test each entry has to pass: it identifies a public thing or shapes the
 * query, and it says nothing about the caller - not their identity, their
 * location to street level, their money, their credentials or their documents.
 */
const LOGGABLE_KEYS = new Set([
	// Identifiers of public entities: a company, an airport, a security, a
	// commodity, a currency. Note `have` and `want` are ISO currency codes on
	// the conversion endpoint - the amount being converted is not logged.
	'bank',
	'brand',
	'cik',
	'code',
	'currency',
	'domain',
	'have',
	'iata',
	'icao',
	'make',
	'manufacturer',
	'mic',
	'model',
	'name',
	'names',
	'pair',
	'symbol',
	'ticker',
	'trim',
	'want',

	// Coarse geography. Deliberately excludes coordinates, postal codes and
	// street addresses, which locate a caller rather than name a place.
	'city',
	'continent',
	'country',
	'county',
	'locale',
	'province',
	'region',
	'regions',
	'state',
	'timezone',

	// Taxonomy and filters: what kind of thing was asked for.
	'activity',
	'author',
	'barking',
	'categories',
	'category',
	'children_friendly',
	'constellation',
	'difficulty',
	'energy',
	'engine_type',
	'equipments',
	'exclude',
	'exclude_categories',
	'family_friendly',
	'filing',
	'form_type',
	'gender',
	'grooming',
	'group',
	'has_iata',
	'has_lights',
	'insider_type',
	'level',
	'muscle',
	'nationality',
	'other_pets_friendly',
	'playfulness',
	'protectiveness',
	'scheduled_service',
	'sector',
	'shedding',
	'subgroup',
	'surface',
	'trainability',
	'transaction_type',
	'type',
	'unit',
	'work',
	'zodiac',

	// Dates and periods.
	'date',
	'date_added',
	'date_end',
	'date_start',
	'day',
	'end',
	'max_date',
	'max_transaction_date',
	'max_year',
	'min_date',
	'min_transaction_date',
	'min_year',
	'month',
	'period',
	'quarter',
	'start',
	'tax_year',
	'transaction_date',
	'year',

	// How the answer should be shaped or paged.
	'bg_color',
	'count',
	'exclude_numbers',
	'exclude_special_chars',
	'fg_color',
	'fields',
	'format',
	'height',
	'include_closed',
	'include_text',
	'length',
	'limit',
	'offset',
	'order',
	'paragraphs',
	'popular_only',
	'public_holidays',
	'qa_only',
	'quarter',
	'random',
	'seed',
	'show_upcoming',
	'size',
	'sort',
	'start_with_lorem_ipsum',
	'text_only',
	'weekend',
	'width',

	// Numeric search bounds over public reference data - a star's magnitude, a
	// country's GDP, an aircraft's range. None of these describe the caller.
	'max_absolute_magnitude',
	'max_age',
	'max_apparent_magnitude',
	'max_area',
	'max_distance_light_year',
	'max_elevation',
	'max_enrolled',
	'max_faculty_ratio',
	'max_fertility',
	'max_gdp',
	'max_gdp_growth',
	'max_height',
	'max_infant_mortality',
	'max_length',
	'max_life_expectancy',
	'max_mass',
	'max_net_worth',
	'max_period',
	'max_population',
	'max_radius',
	'max_range',
	'max_semi_major_axis',
	'max_speed',
	'max_temperature',
	'max_transaction_value',
	'max_tuition',
	'max_unemployment',
	'max_urban_pop_rate',
	'max_weight',
	'max_wingspan',
	'min_absolute_magnitude',
	'min_age',
	'min_apparent_magnitude',
	'min_area',
	'min_distance_light_year',
	'min_elevation',
	'min_enrolled',
	'min_faculty_ratio',
	'min_fertility',
	'min_gdp',
	'min_gdp_growth',
	'min_height',
	'min_infant_mortality',
	'min_length',
	'min_life_expectancy',
	'min_mass',
	'min_net_worth',
	'min_period',
	'min_population',
	'min_radius',
	'min_range',
	'min_runway_length',
	'min_semi_major_axis',
	'min_speed',
	'min_temperature',
	'min_transaction_value',
	'min_tuition',
	'min_unemployment',
	'min_urban_pop_rate',
	'min_weight',
	'min_wingspan',
	'distance',
	'duration',
	'rate',
]);

/** True when a parameter's value may be written to the event log. */
export function isLoggableKey(key: string): boolean {
	return LOGGABLE_KEYS.has(key);
}

/** The keys whose values may be logged, for the tests to assert against. */
export function loggableKeys(): string[] {
	return [...LOGGABLE_KEYS].sort();
}

/** Size of a value, for a field whose content must not be logged. */
function sizeOf(value: unknown): number | undefined {
	if (typeof value === 'string') return value.length;
	if (Array.isArray(value)) return value.length;
	return undefined;
}

/**
 * Builds an audit payload from an endpoint's input.
 *
 * `identifierKeys` names the fields an operation considers worth recording.
 * It is a hint, not an authority: a key is recorded by value only if it is
 * also loggable, so naming a field here can never widen what is stored.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};

	for (const key of identifierKeys) {
		const value = input[key];
		if (value === undefined) continue;
		if (!isLoggableKey(key)) continue;
		payload[key] = value;
	}

	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) {
		// Namespaced deliberately: `fields` is itself a parameter on the random
		// user endpoint, so a plain `fields` key here would overwrite the caller's
		// argument and leave the row ambiguous about which of the two it meant.
		payload.supplied_fields = supplied;
	}

	// Everything not recorded by value is recorded by size instead, so a call
	// is still traceable without its contents being readable.
	for (const key of supplied) {
		if (isLoggableKey(key)) continue;
		const size = sizeOf(input[key]);
		if (size !== undefined) {
			payload[`${key}_length`] = size;
		}
	}

	return payload;
}

/** Records how many rows an operation returned, without recording the rows. */
export function withCount(
	payload: Record<string, unknown>,
	result: unknown,
): Record<string, unknown> {
	if (Array.isArray(result)) {
		return { ...payload, result_count: result.length };
	}
	return payload;
}
