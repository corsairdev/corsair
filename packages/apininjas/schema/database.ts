import { z } from 'zod';

/**
 * Locally mirrored API Ninjas reference data.
 *
 * The reason for a mirror here is quota rather than latency. The free tier
 * allows 3,000 calls a month, and the calls an agent repeats most are lookups
 * of data that does not change - the same airport, the same country, the same
 * S&P 500 membership. Caching those is the difference between a plugin that
 * lasts the month and one that stops halfway through it.
 *
 * Only reference data is stored. Every price (`stockprice`, `cryptoprice`,
 * `bitcoin`, `commodityprice`, `exchangerate`, `marketcap`, `mortgagerate`,
 * `interestrate`), everything random or daily, every generator, and every
 * user-supplied lookup (sentiment, email validation, IP lookup) is deliberately
 * left out: those are either point-in-time values or caller data, and a stale
 * copy of them would be wrong rather than merely old.
 *
 * Nothing in this API deletes, so there is no delete to evict on. Each row
 * carries `captured_at` instead, which lets a caller decide how old is too old.
 *
 * Values arrive as strings on many of these endpoints, and the free tier
 * replaces individual values with prose, so almost every field is optional and
 * accepts both the documented type and a string.
 */

/** Airports, keyed by ICAO/ident - the identifiers do not change. */
export const ApiNinjasAirportEntity = z.object({
	id: z.string(),
	iata: z.string().nullable().optional(),
	icao: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	timezone: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasAirportEntity = z.infer<typeof ApiNinjasAirportEntity>;

/** Airlines, keyed by IATA code. */
export const ApiNinjasAirlineEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	iata: z.string().nullable().optional(),
	icao: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	base: z.string().nullable().optional(),
	fleet_size: z.number().nullable().optional(),
	logo_url: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasAirlineEntity = z.infer<typeof ApiNinjasAirlineEntity>;

/** Aircraft models, keyed by manufacturer and model. */
export const ApiNinjasAircraftEntity = z.object({
	id: z.string(),
	manufacturer: z.string().nullable().optional(),
	model: z.string().nullable().optional(),
	engine_type: z.string().nullable().optional(),
	max_speed_knots: z.union([z.number(), z.string()]).nullable().optional(),
	range_nautical_miles: z.union([z.number(), z.string()]).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasAircraftEntity = z.infer<typeof ApiNinjasAircraftEntity>;

/**
 * Road vehicles from the car, motorcycle and electric-vehicle endpoints, which
 * return three different shapes for the same idea. `kind` keeps them apart.
 */
export const ApiNinjasVehicleEntity = z.object({
	id: z.string(),
	kind: z.enum(['car', 'motorcycle', 'electric']),
	make: z.string().nullable().optional(),
	model: z.string().nullable().optional(),
	year: z.union([z.number(), z.string()]).nullable().optional(),
	fuel_type: z.string().nullable().optional(),
	vehicle_class: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasVehicleEntity = z.infer<typeof ApiNinjasVehicleEntity>;

/** Countries, keyed by ISO 3166-1 alpha-2 code. */
export const ApiNinjasCountryEntity = z.object({
	id: z.string(),
	iso2: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	capital: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	currency_code: z.string().nullable().optional(),
	population: z.union([z.number(), z.string()]).nullable().optional(),
	surface_area: z.union([z.number(), z.string()]).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasCountryEntity = z.infer<typeof ApiNinjasCountryEntity>;

/** Cities, keyed by name and country - the endpoint returns no identifier. */
export const ApiNinjasCityEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	population: z.union([z.number(), z.string()]).nullable().optional(),
	is_capital: z.union([z.boolean(), z.string()]).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasCityEntity = z.infer<typeof ApiNinjasCityEntity>;

/** Universities, keyed by name and country. */
export const ApiNinjasUniversityEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	institution_type: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasUniversityEntity = z.infer<
	typeof ApiNinjasUniversityEntity
>;

/** Stock exchanges, keyed by Market Identifier Code. */
export const ApiNinjasStockExchangeEntity = z.object({
	id: z.string(),
	mic: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	timezone: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasStockExchangeEntity = z.infer<
	typeof ApiNinjasStockExchangeEntity
>;

/** S&P 500 membership, keyed by ticker. Changes a handful of times a year. */
export const ApiNinjasSp500Entity = z.object({
	id: z.string(),
	ticker: z.string().nullable().optional(),
	company_name: z.string().nullable().optional(),
	sector: z.string().nullable().optional(),
	sub_industry: z.string().nullable().optional(),
	headquarters: z.string().nullable().optional(),
	date_added: z.string().nullable().optional(),
	cik: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasSp500Entity = z.infer<typeof ApiNinjasSp500Entity>;

/** Emoji, keyed by Unicode code point. */
export const ApiNinjasEmojiEntity = z.object({
	id: z.string(),
	code: z.string().nullable().optional(),
	character: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	group: z.string().nullable().optional(),
	subgroup: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasEmojiEntity = z.infer<typeof ApiNinjasEmojiEntity>;

/** Animal species, keyed by common name. */
export const ApiNinjasAnimalEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	scientific_name: z.string().nullable().optional(),
	family: z.string().nullable().optional(),
	habitat: z.string().nullable().optional(),
	diet: z.string().nullable().optional(),
	locations: z.array(z.string()).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasAnimalEntity = z.infer<typeof ApiNinjasAnimalEntity>;

/** Planets and exoplanets, keyed by name. */
export const ApiNinjasPlanetEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	mass: z.union([z.number(), z.string()]).nullable().optional(),
	radius: z.union([z.number(), z.string()]).nullable().optional(),
	period: z.union([z.number(), z.string()]).nullable().optional(),
	temperature: z.union([z.number(), z.string()]).nullable().optional(),
	distance_light_year: z.union([z.number(), z.string()]).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasPlanetEntity = z.infer<typeof ApiNinjasPlanetEntity>;

/** Stars, keyed by name. */
export const ApiNinjasStarEntity = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	constellation: z.string().nullable().optional(),
	spectral_class: z.string().nullable().optional(),
	apparent_magnitude: z.union([z.number(), z.string()]).nullable().optional(),
	distance_light_year: z.union([z.number(), z.string()]).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasStarEntity = z.infer<typeof ApiNinjasStarEntity>;
