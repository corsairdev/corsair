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
 * Mirrors reference rows into the local cache.
 *
 * Every write is best-effort: a lookup must not fail because the local mirror
 * could not be written. Masked values are dropped rather than stored, because
 * "This field is for premium subscribers only." is not a fleet size, and a
 * cached row that says so would outlive the plan that produced it.
 */

/**
 * Minimal structural view of a Corsair entity store. Only the operation the
 * endpoints need is declared, so these helpers stay usable whatever else the
 * concrete store exposes.
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

/** Text field that is only stored when the provider actually sent text. */
function text(value: unknown): string | undefined {
	if (typeof value !== 'string' || isMaskedValue(value)) return undefined;
	return value;
}

/**
 * Narrows a nested payload to a plain record.
 *
 * Several of these responses nest a sub-object - an airline's fleet, a
 * country's currency, an animal's taxonomy - whose keys vary by row, so they
 * are read structurally rather than through a declared shape.
 */
function nested(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return undefined;
	}
	return value as Record<string, unknown>;
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
					iata: text(row.iata),
					icao: text(row.icao),
					name: text(row.name),
					city: text(row.city),
					country: text(row.country),
					region: text(row.region),
					latitude: asNumber(row.latitude),
					longitude: asNumber(row.longitude),
					timezone: text(row.timezone),
					captured_at: capturedAt,
				}),
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
		const fleet = nested(row.fleet);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					name: text(row.name),
					iata: text(row.iata),
					icao: text(row.icao),
					country: text(row.country),
					base: text(row.base),
					fleet_size: fleet ? asNumber(fleet.total) : undefined,
					logo_url: text(row.logo_url),
					captured_at: capturedAt,
				}),
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
					manufacturer: text(row.manufacturer),
					model: text(row.model),
					engine_type: text(row.engine_type),
					max_speed_knots: unmasked(row.max_speed_knots) ?? undefined,
					range_nautical_miles: unmasked(row.range_nautical_miles) ?? undefined,
					captured_at: capturedAt,
				}),
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
					make: text(row.make),
					model: text(row.model),
					year: unmasked(row.year) ?? undefined,
					fuel_type: text(row.fuel_type),
					vehicle_class: text(row.class),
					captured_at: capturedAt,
				}),
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
					vehicle_class: text(row.type),
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
					year: unmasked(row.year_start) ?? undefined,
					fuel_type: 'electric',
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
		const currency = nested(row.currency);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					iso2: text(row.iso2),
					name: text(row.name),
					capital: text(row.capital),
					region: text(row.region),
					currency_code: currency ? text(currency.code) : undefined,
					population: unmasked(row.population) ?? undefined,
					surface_area: unmasked(row.surface_area) ?? undefined,
					captured_at: capturedAt,
				}),
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
					region: text(row.region),
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
					name: text(row.name),
					country: text(row.country),
					city: text(row.city),
					state: text(row.state),
					website: text(row.website),
					institution_type: text(row.institution_type),
					captured_at: capturedAt,
				}),
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
					mic: text(row.mic),
					name: text(row.name),
					city: text(row.city),
					country: text(row.country),
					currency: text(row.currency),
					timezone: text(row.timezone),
					captured_at: capturedAt,
				}),
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
					ticker: text(row.ticker),
					company_name: text(row.company_name),
					sector: text(row.sector),
					sub_industry: text(row.sub_industry),
					headquarters: text(row.headquarters),
					date_added: text(row.date_added),
					cik: text(row.cik),
					captured_at: capturedAt,
				}),
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
					code: text(row.code),
					character: text(row.character),
					name: text(row.name),
					group: text(row.group),
					subgroup: text(row.subgroup),
					image: text(row.image),
					captured_at: capturedAt,
				}),
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
		const taxonomy = nested(row.taxonomy);
		const characteristics = nested(row.characteristics);
		await safely(
			() =>
				store.upsertByEntityId(id, {
					id,
					name: text(row.name),
					scientific_name: taxonomy
						? text(taxonomy.scientific_name)
						: undefined,
					family: taxonomy ? text(taxonomy.family) : undefined,
					habitat: characteristics ? text(characteristics.habitat) : undefined,
					diet: characteristics ? text(characteristics.diet) : undefined,
					locations: Array.isArray(row.locations)
						? row.locations.filter(
								(location): location is string => typeof location === 'string',
							)
						: undefined,
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
					name: text(row.name),
					mass: unmasked(row.mass) ?? undefined,
					radius: unmasked(row.radius) ?? undefined,
					period: unmasked(row.period) ?? undefined,
					temperature: unmasked(row.temperature) ?? undefined,
					distance_light_year: unmasked(row.distance_light_year) ?? undefined,
					captured_at: capturedAt,
				}),
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
					name: text(row.name),
					constellation: text(row.constellation),
					spectral_class: text(row.spectral_class),
					apparent_magnitude: unmasked(row.apparent_magnitude) ?? undefined,
					distance_light_year: unmasked(row.distance_light_year) ?? undefined,
					captured_at: capturedAt,
				}),
			`star ${id}`,
		);
	}
}
