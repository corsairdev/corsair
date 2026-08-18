import type {
	ApiNinjasAircraftEntity,
	ApiNinjasAirlineEntity,
	ApiNinjasAirportEntity,
	ApiNinjasAnimalEntity,
	ApiNinjasCityEntity,
	ApiNinjasCountryEntity,
	ApiNinjasEmojiEntity,
	ApiNinjasPlanetEntity,
	ApiNinjasSp500Entity,
	ApiNinjasStarEntity,
	ApiNinjasStockExchangeEntity,
	ApiNinjasUniversityEntity,
	ApiNinjasVehicleEntity,
} from '../schema/database';
import { asNumber, entityId, isMaskedValue, keyed, unmasked } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Mirrors official reference fields into the local cache.
 *
 * Writes are best-effort. Masked free-tier prose is dropped. Field names
 * match the official JSON keys — see `schema/database.ts`.
 */

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[APININJAS] failed to cache ${what}:`, error);
	}
}

function text(value: unknown): string | undefined {
	if (typeof value !== 'string' || isMaskedValue(value)) return undefined;
	return value;
}

function clean(value: unknown): unknown {
	if (value === undefined || value === null || isMaskedValue(value)) {
		return undefined;
	}
	if (Array.isArray(value)) {
		const items = value
			.map(clean)
			.filter((item) => item !== undefined && item !== null);
		return items.length ? items : undefined;
	}
	if (typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [key, item] of Object.entries(value)) {
			const next = clean(item);
			if (next !== undefined && next !== null) out[key] = next;
		}
		return Object.keys(out).length ? out : undefined;
	}
	return value;
}

function nested(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return undefined;
	}
	const cleaned = clean(value);
	if (!cleaned || typeof cleaned !== 'object' || Array.isArray(cleaned)) {
		return undefined;
	}
	return cleaned as Record<string, unknown>;
}

function strings(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const cleaned = clean(value);
	if (!Array.isArray(cleaned)) return undefined;
	const items = cleaned.filter(
		(item): item is string => typeof item === 'string',
	);
	return items.length ? items : undefined;
}

const OBJECT_KEYS = new Set([
	'fleet',
	'currency',
	'taxonomy',
	'characteristics',
	'runways',
]);

function copy(
	row: Record<string, unknown>,
	keys: readonly string[],
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const key of keys) {
		const value = unmasked(row[key]);
		if (value === undefined || value === null) continue;
		if (OBJECT_KEYS.has(key) || typeof value === 'object') {
			if (Array.isArray(value)) {
				const items = strings(value) ?? clean(value);
				if (Array.isArray(items) && items.length) out[key] = items;
				continue;
			}
			const object = nested(value);
			if (object) out[key] = object;
			continue;
		}
		out[key] = value;
	}
	return out;
}

type AirportRow = ApiNinjasEndpointOutputs['transportAirports'][number];
type AirlineRow = ApiNinjasEndpointOutputs['transportAirlines'][number];
type AircraftRow = ApiNinjasEndpointOutputs['transportAircraft'][number];
type CountryRow = ApiNinjasEndpointOutputs['locationCountry'][number];
type CityRow = ApiNinjasEndpointOutputs['locationCities'][number];
type UniversityRow = ApiNinjasEndpointOutputs['locationUniversities'][number];
type StockExchangeRow =
	ApiNinjasEndpointOutputs['marketsStockExchanges'][number];
type Sp500Row = ApiNinjasEndpointOutputs['marketsSp500'][number];
type EmojiRow = ApiNinjasEndpointOutputs['utilityEmoji'][number];
type AnimalRow = ApiNinjasEndpointOutputs['referenceAnimals'][number];
type PlanetRow = ApiNinjasEndpointOutputs['referencePlanets'][number];
type StarRow = ApiNinjasEndpointOutputs['referenceStars'][number];
type CarRow = ApiNinjasEndpointOutputs['transportCars'][number];
type MotorcycleRow = ApiNinjasEndpointOutputs['transportMotorcycles'][number];
type ElectricVehicleRow =
	ApiNinjasEndpointOutputs['transportElectricVehicles'][number];

const AIRPORT_FIELDS = [
	'iata',
	'icao',
	'ident',
	'name',
	'city',
	'region',
	'region_code',
	'country',
	'country_name',
	'continent',
	'elevation_ft',
	'elevation_m',
	'timezone',
	'type',
	'size',
	'scheduled_service',
	'is_closed',
	'gps_code',
	'local_code',
	'home_link',
	'wikipedia_link',
	'keywords',
	'num_runways',
	'longest_runway_ft',
	'runways',
	'estimated_annual_passengers',
] as const;

const AIRLINE_FIELDS = [
	'name',
	'iata',
	'icao',
	'country',
	'year_created',
	'base',
	'fleet',
	'logo_url',
	'brandmark_url',
	'tail_logo_url',
] as const;

const AIRCRAFT_FIELDS = [
	'manufacturer',
	'model',
	'engine_type',
	'engine_thrust_lb_ft',
	'max_speed_knots',
	'cruise_speed_knots',
	'ceiling_ft',
	'takeoff_ground_run_ft',
	'landing_ground_roll_ft',
	'gross_weight_lbs',
	'empty_weight_lbs',
	'length_ft',
	'height_ft',
	'wing_span_ft',
	'range_nautical_miles',
] as const;

const COUNTRY_FIELDS = [
	'name',
	'iso2',
	'capital',
	'region',
	'currency',
	'gdp',
	'gdp_per_capita',
	'gdp_growth',
	'population',
	'pop_density',
	'pop_growth',
	'surface_area',
	'urban_population',
	'urban_population_growth',
	'unemployment',
	'fertility',
	'infant_mortality',
	'life_expectancy_male',
	'life_expectancy_female',
	'sex_ratio',
	'employment_services',
	'employment_industry',
	'employment_agriculture',
	'imports',
	'exports',
	'co2_emissions',
	'forested_area',
	'tourists',
	'homicide_rate',
	'threatened_species',
	'internet_users',
	'refugees',
	'primary_school_enrollment_female',
	'primary_school_enrollment_male',
	'secondary_school_enrollment_female',
	'secondary_school_enrollment_male',
	'post_secondary_enrollment_female',
	'post_secondary_enrollment_male',
	'telephone_country_codes',
] as const;

const UNIVERSITY_FIELDS = [
	'name',
	'degree_types',
	'address',
	'city',
	'state',
	'postal_code',
	'country',
	'county',
	'timezone',
	'latitude',
	'longitude',
	'phone',
	'email',
	'website',
	'institution_type',
	'years',
	'enrollment',
	'student_faculty_ratio',
	'tuition',
] as const;

const EXCHANGE_FIELDS = [
	'mic',
	'name',
	'city',
	'country',
	'iso2',
	'description',
	'address',
	'website',
	'founded',
	'num_listings',
	'market_cap_usd',
	'market_cap',
	'currency',
	'timezone',
	'market_open',
	'market_close',
	'is_market_open',
	'closed_reason',
] as const;

const SP500_FIELDS = [
	'ticker',
	'company_name',
	'sector',
	'sub_industry',
	'headquarters',
	'date_added',
	'cik',
] as const;

const EMOJI_FIELDS = [
	'code',
	'character',
	'image',
	'name',
	'group',
	'subgroup',
] as const;

const PLANET_FIELDS = [
	'name',
	'mass',
	'radius',
	'period',
	'semi_major_axis',
	'temperature',
	'distance_light_year',
	'host_star_mass',
	'host_star_temperature',
] as const;

const STAR_FIELDS = [
	'name',
	'constellation',
	'right_ascension',
	'declination',
	'apparent_magnitude',
	'absolute_magnitude',
	'distance_light_year',
	'spectral_class',
] as const;

const CAR_FIELDS = [
	'make',
	'model',
	'year',
	'class',
	'fuel_type',
	'city_mpg',
	'combination_mpg',
	'highway_mpg',
	'cylinders',
	'displacement',
	'drive',
	'transmission',
] as const;

export async function cacheAirports(
	store: EntityStore<ApiNinjasAirportEntity> | undefined,
	rows: AirportRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.ident ?? row.icao ?? row.iata ?? row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, AIRPORT_FIELDS),
					latitude: asNumber(row.latitude),
					longitude: asNumber(row.longitude),
					captured_at: capturedAt,
				} as ApiNinjasAirportEntity),
			`airport ${id}`,
		);
	}
}

export async function cacheAirlines(
	store: EntityStore<ApiNinjasAirlineEntity> | undefined,
	rows: AirlineRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.iata ?? row.icao ?? row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, AIRLINE_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasAirlineEntity),
			`airline ${id}`,
		);
	}
}

export async function cacheAircraft(
	store: EntityStore<ApiNinjasAircraftEntity> | undefined,
	rows: AircraftRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.manufacturer, row.model)) continue;
		const id = entityId(row.manufacturer, row.model);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, AIRCRAFT_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasAircraftEntity),
			`aircraft ${id}`,
		);
	}
}

export async function cacheCars(
	store: EntityStore<ApiNinjasVehicleEntity> | undefined,
	rows: CarRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.make, row.model, row.year)) continue;
		const id = entityId('car', row.make, row.model, row.year);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					kind: 'car',
					...copy(row, CAR_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasVehicleEntity),
			`car ${id}`,
		);
	}
}

export async function cacheMotorcycles(
	store: EntityStore<ApiNinjasVehicleEntity> | undefined,
	rows: MotorcycleRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.make, row.model, row.year)) continue;
		const id = entityId('motorcycle', row.make, row.model, row.year);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					kind: 'motorcycle',
					make: text(row.make),
					model: text(row.model),
					year: unmasked(row.year) ?? undefined,
					type: text(row.type),
					displacement: unmasked(row.displacement) ?? undefined,
					transmission: text(row.transmission),
					captured_at: capturedAt,
				}),
			`motorcycle ${id}`,
		);
	}
}

export async function cacheElectricVehicles(
	store: EntityStore<ApiNinjasVehicleEntity> | undefined,
	rows: ElectricVehicleRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.make, row.model, row.year_start)) continue;
		const id = entityId('electric', row.make, row.model, row.year_start);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					kind: 'electric',
					make: text(row.make),
					model: text(row.model),
					year_start: unmasked(row.year_start) ?? undefined,
					drive: text(row.drive),
					battery_capacity: text(row.battery_capacity),
					electric_range: unmasked(row.electric_range) ?? undefined,
					captured_at: capturedAt,
				}),
			`electric vehicle ${id}`,
		);
	}
}

export async function cacheCountries(
	store: EntityStore<ApiNinjasCountryEntity> | undefined,
	rows: CountryRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.iso2 ?? row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, COUNTRY_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasCountryEntity),
			`country ${id}`,
		);
	}
}

export async function cacheCities(
	store: EntityStore<ApiNinjasCityEntity> | undefined,
	rows: CityRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.name, row.country)) continue;
		const id = entityId(row.name, row.country);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					name: text(row.name),
					country: text(row.country),
					latitude: asNumber(row.latitude),
					longitude: asNumber(row.longitude),
					population: unmasked(row.population) ?? undefined,
					is_capital: unmasked(row.is_capital) ?? undefined,
					captured_at: capturedAt,
				}),
			`city ${id}`,
		);
	}
}

export async function cacheUniversities(
	store: EntityStore<ApiNinjasUniversityEntity> | undefined,
	rows: UniversityRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		if (!keyed(row.name, row.country)) continue;
		const id = entityId(row.name, row.country);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, UNIVERSITY_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasUniversityEntity),
			`university ${id}`,
		);
	}
}

export async function cacheStockExchanges(
	store: EntityStore<ApiNinjasStockExchangeEntity> | undefined,
	rows: StockExchangeRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.mic ?? row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row as Record<string, unknown>, EXCHANGE_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasStockExchangeEntity),
			`stock exchange ${id}`,
		);
	}
}

export async function cacheSp500(
	store: EntityStore<ApiNinjasSp500Entity> | undefined,
	rows: Sp500Row[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.ticker);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, SP500_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasSp500Entity),
			`S&P 500 constituent ${id}`,
		);
	}
}

export async function cacheEmoji(
	store: EntityStore<ApiNinjasEmojiEntity> | undefined,
	rows: EmojiRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.code ?? row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, EMOJI_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasEmojiEntity),
			`emoji ${id}`,
		);
	}
}

export async function cacheAnimals(
	store: EntityStore<ApiNinjasAnimalEntity> | undefined,
	rows: AnimalRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					name: text(row.name),
					taxonomy: nested(row.taxonomy),
					characteristics: nested(row.characteristics),
					locations: strings(row.locations),
					captured_at: capturedAt,
				}),
			`animal ${id}`,
		);
	}
}

export async function cachePlanets(
	store: EntityStore<ApiNinjasPlanetEntity> | undefined,
	rows: PlanetRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, PLANET_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasPlanetEntity),
			`planet ${id}`,
		);
	}
}

export async function cacheStars(
	store: EntityStore<ApiNinjasStarEntity> | undefined,
	rows: StarRow[],
	capturedAt: Date,
) {
	if (!store) return;
	for (const row of rows) {
		const id = entityId(row.name);
		if (!id) continue;
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					...copy(row, STAR_FIELDS),
					captured_at: capturedAt,
				} as ApiNinjasStarEntity),
			`star ${id}`,
		);
	}
}
