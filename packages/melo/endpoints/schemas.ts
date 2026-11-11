import { z } from 'zod';
import {
	FeesResponsibilitySchema,
	PropertyTypeSchema,
	PublisherTypeSchema,
	SubscribedEventSchema,
	TransactionTypeSchema,
} from './filters';

/**
 * The API is PHP: an empty associative array is encoded as `[]` rather than
 * `{}`, and the points-of-interest example sends `"attributes": []`.
 */
const emptyArray = z.array(z.never());

// Output enums stay open: a property type, publisher type or event code that
// Melo adds later must not fail a call that already succeeded (and, on
// searches.create, hide the id of a search that was saved). The documented
// values stay listed for docs and types. Inputs keep the strict schemas.
const openNumber = <T extends z.ZodType<number>>(documented: T) =>
	z
		.union([documented, z.number().int()])
		.describe(`${documented.description ?? ''} Other values may appear later.`);
const OpenPropertyTypeSchema = openNumber(PropertyTypeSchema);
const OpenPublisherTypeSchema = openNumber(PublisherTypeSchema);
const OpenTransactionTypeSchema = openNumber(TransactionTypeSchema);
const OpenFeesResponsibilitySchema = openNumber(FeesResponsibilitySchema);
const OpenSubscribedEventSchema = z
	.union([SubscribedEventSchema, z.string()])
	.describe('An event code; other codes may appear later.');

// Every response field is optional in the OpenAPI spec, which has no examples
// of its own, so output fields are `.nullish()` and objects are `.loose()`.
// The one required field on a collection is `hydra:member`.

/** An IRI string, or an object: the spec says object, its own examples say string. */
const IriOrObjectSchema = z.union([z.string(), z.object({}).loose()]);

export const GeoPointSchema = z
	.object({
		lat: z.number().nullish(),
		lon: z.number().nullish(),
	})
	.loose();

const CodeIdNameSchema = z
	.object({
		code: z.string().nullish(),
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const EnergyRatingSchema = z
	.object({
		category: z.string().nullish(),
		value: z.number().nullish(),
	})
	.loose();

const ContactSchema = z
	.object({
		agency: z.string().nullish(),
		email: z.string().nullish(),
		fax: z.string().nullish(),
		name: z.string().nullish(),
		phone: z.string().nullish(),
		reference: z.string().nullish(),
	})
	.loose();

const AdvertEventSchema = z
	.object({
		createdAt: z.string().nullish(),
		fieldName: z.string().nullish(),
		fieldNewValue: z.string().nullish(),
		fieldOldValue: z.string().nullish(),
		percentVariation: z.number().nullish(),
	})
	.loose();

const PublisherSchema = z
	.object({
		category: z.string().nullish(),
		name: z.string().nullish(),
		type: OpenPublisherTypeSchema.nullish(),
	})
	.loose();

export const AdvertSchema = z
	.object({
		condominiumFees: z.number().nullish(),
		constructionYear: z.number().nullish(),
		contact: ContactSchema.nullish(),
		createdAt: z.string().nullish(),
		description: z.string().nullish(),
		elevator: z.boolean().nullish(),
		energy: EnergyRatingSchema.nullish(),
		events: z.array(AdvertEventSchema).nullish(),
		features: z.array(z.string()).nullish(),
		feesPercentage: z.number().nullish(),
		feesResponsibility: OpenFeesResponsibilitySchema.nullish(),
		floor: z.number().nullish(),
		floorQuantity: z.number().nullish(),
		furnished: z.boolean().nullish(),
		greenHouseGas: EnergyRatingSchema.nullish(),
		inventoryPrice: z.number().nullish(),
		landSurface: z.number().nullish(),
		lastCrawledAt: z.string().nullish(),
		lotCount: z.number().nullish(),
		pictures: z.array(z.string()).nullish(),
		picturesRemote: z.array(z.string()).nullish(),
		price: z.number().nullish(),
		priceExcludingFees: z.number().nullish(),
		publisher: PublisherSchema.nullish(),
		rentalCharges: z.number().nullish(),
		rentalPledge: z.number().nullish(),
		renterFees: z.number().nullish(),
		surface: z.number().nullish(),
		title: z.string().nullish(),
		updatedAt: z.string().nullish(),
		url: z.string().nullish(),
		uuid: z.string().nullish(),
		virtualTour: z.string().nullish(),
	})
	.loose();

const CityDetailsSchema = z
	.object({
		cityParentId: z.number().nullish(),
		country: CodeIdNameSchema.nullish(),
		department: CodeIdNameSchema.nullish(),
		groupedCityNames: z.array(z.string()).nullish(),
		groupedCityZipcodes: z.array(z.string()).nullish(),
		hasGroupedByName: z.boolean().nullish(),
		hasGroupedByZipcode: z.boolean().nullish(),
		id: z.number().nullish(),
		insee: z.string().nullish(),
		location: GeoPointSchema.nullish(),
		name: z.string().nullish(),
		open: z.boolean().nullish(),
		originalName: z.string().nullish(),
		region: CodeIdNameSchema.nullish(),
		zipcode: z.string().nullish(),
	})
	.loose();

const StationLineSchema = z
	.object({
		color: z.string().nullish(),
		id: z.number().nullish(),
		name: z.string().nullish(),
		number: z.string().nullish(),
		routeName: z.string().nullish(),
	})
	.loose();

const StationSchema = z
	.object({
		id: z.number().nullish(),
		lines: z.array(StationLineSchema).nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const PropertyDocumentSchema = z
	.object({
		'@context': z.string().nullish(),
		'@id': z.string().nullish(),
		'@type': z.string().nullish(),
		adverts: z.array(AdvertSchema).nullish(),
		bedroom: z.number().nullish(),
		city: CityDetailsSchema.nullish(),
		createdAt: z.string().nullish(),
		description: z.string().nullish(),
		elevator: z.boolean().nullish(),
		expired: z
			.boolean()
			.nullish()
			.describe('A property is expired when all its adverts are expired.'),
		expiredAt: z.string().nullish(),
		floor: z.number().nullish(),
		furnished: z.boolean().nullish(),
		landSurface: z.number().nullish(),
		lastCrawledAdvert: z.string().nullish(),
		lastCrawledAt: z.string().nullish(),
		locations: GeoPointSchema.nullish(),
		pictures: z.array(z.string()).nullish(),
		price: z.number().nullish(),
		pricePerMeter: z.number().nullish(),
		property: z.string().nullish(),
		propertyType: OpenPropertyTypeSchema.nullish(),
		publisherTypes: z.array(OpenPublisherTypeSchema).nullish(),
		room: z.number().nullish(),
		stations: z.array(StationSchema).nullish(),
		surface: z.number().nullish(),
		title: z.string().nullish(),
		transactionType: OpenTransactionTypeSchema.nullish(),
		updatedAt: z.string().nullish(),
		uuid: z.string().nullish(),
	})
	.loose();

export type MeloPropertyDocument = z.infer<typeof PropertyDocumentSchema>;

const HydraViewSchema = z
	.object({
		'@id': z.string().nullish(),
		'@type': z.string().nullish(),
		'hydra:first': z.string().nullish(),
		'hydra:last': z.string().nullish(),
		'hydra:next': z
			.string()
			.nullish()
			.describe('Link to the next page; absent on the last page.'),
	})
	.loose();

const HydraSearchSchema = z
	.object({
		'@type': z.string().nullish(),
		'hydra:template': z.string().nullish(),
		'hydra:variableRepresentation': z.string().nullish(),
		'hydra:mapping': z.array(z.object({}).loose()).nullish(),
	})
	.loose();

const nextPageDescription =
	'The page number to request next, read from `hydra:view.hydra:next`; null on the last page.';

const hydraCollectionShape = {
	'@context': z.string().nullish(),
	'@id': z.string().nullish(),
	'@type': z.string().nullish(),
	'hydra:totalItems': z.number().nullish(),
	'hydra:view': HydraViewSchema.nullish(),
	'hydra:search': HydraSearchSchema.nullish(),
};

/** A Hydra collection that is not paged: the member list and its envelope. */
export function hydraList<Member extends z.ZodType>(member: Member) {
	return z
		.object({ ...hydraCollectionShape, 'hydra:member': z.array(member) })
		.loose();
}

/** A paged Hydra collection: the same, plus the derived `nextPage`. */
export function collectionOutput<Member extends z.ZodType>(member: Member) {
	return z
		.object({
			...hydraCollectionShape,
			'hydra:member': z.array(member),
			nextPage: z.number().int().nullable().describe(nextPageDescription),
		})
		.loose();
}

export const PropertyCollectionSchema = collectionOutput(
	PropertyDocumentSchema,
);

export const PricePerMeterIndicatorSchema = z
	.object({
		average: z.number().nullish(),
		average_min: z.number().nullish(),
		average_max: z.number().nullish(),
		median: z.number().nullish(),
		series: z
			.union([z.record(z.string(), z.number()), emptyArray])
			.nullish()
			.describe('Price per meter keyed by period, for example `2023-01`.'),
	})
	.loose();

export const PointOfInterestSchema = z
	.object({
		lat: z.number().nullish(),
		lon: z.number().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		attributes: z
			.union([z.object({}).loose(), emptyArray])
			.nullish()
			.describe(
				'Category-specific attributes, for example `schoolType`; an empty array when there are none.',
			),
	})
	.loose();

export const CitySchema = z
	.object({
		'@id': z.string().nullish(),
		'@type': z.string().nullish(),
		zipcode: z.string().nullish(),
		insee: z.string().nullish(),
		article: z.string().nullish(),
		name: z.string().nullish(),
		libelle: z.string().nullish(),
		department: z.string().nullish().describe('IRI, e.g. `/departments/1`.'),
		cityParent: z.object({}).loose().nullish(),
		originalName: z.string().nullish(),
	})
	.loose();

/**
 * `id` is a string in the spec and its example but an integer in a real
 * answer (`/public/location-autocomplete?query=paris` returned `37008`), so
 * both are accepted. `location`, `zipcode`, `insee` and `code` arrive null on
 * a department.
 */
export const LocationSchema = z
	.object({
		'@id': z
			.string()
			.nullish()
			.describe(
				'IRI to use in the `includedCities` / `includedDepartments` filters.',
			),
		'@type': z.string().nullish(),
		code: z.string().nullish(),
		displayName: z.string().nullish(),
		groupedCityNames: z.array(z.string()).nullish(),
		groupedCityZipcodes: z.array(z.string()).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		insee: z.string().nullish(),
		libelle: z.string().nullish(),
		location: GeoPointSchema.nullish(),
		name: z.string().nullish(),
		zipcode: z.string().nullish(),
	})
	.loose();

export const SearchSchema = z
	.object({
		'@context': z.string().nullish(),
		'@id': z.string().nullish(),
		'@type': z.string().nullish(),
		bedroomMin: z.number().nullish(),
		bedroomMax: z.number().nullish(),
		budgetMax: z.number().nullish(),
		budgetMin: z.number().nullish(),
		createdAt: z.string().nullish(),
		endpointRecipient: z.string().nullish(),
		eventEndpoint: z.string().nullish(),
		excludedCities: z.array(IriOrObjectSchema).nullish(),
		excludedSiteCategories: z.array(IriOrObjectSchema).nullish(),
		expressions: z
			.array(z.union([IriOrObjectSchema, z.array(IriOrObjectSchema)]))
			.nullish(),
		furnished: z.boolean().nullish(),
		hidePropertyContact: z.boolean().nullish(),
		includedCities: z.array(IriOrObjectSchema).nullish(),
		includedDepartments: z.array(IriOrObjectSchema).nullish(),
		includedSiteCategories: z.array(IriOrObjectSchema).nullish(),
		landSurfaceMax: z.number().nullish(),
		landSurfaceMin: z.number().nullish(),
		lastAlertAt: z.string().nullish(),
		lat: z.number().nullish(),
		lon: z.number().nullish(),
		notificationEnabled: z.boolean().nullish(),
		notificationRecipient: z.string().nullish(),
		pricePerMeterMax: z.number().nullish(),
		pricePerMeterMin: z.number().nullish(),
		propertyTypes: z.array(OpenPropertyTypeSchema).nullish(),
		publisherTypes: z.array(OpenPublisherTypeSchema).nullish(),
		radius: z.number().nullish(),
		roomMin: z.number().nullish(),
		roomMax: z.number().nullish(),
		subscribedEvents: z.array(OpenSubscribedEventSchema).nullish(),
		surfaceMax: z.number().nullish(),
		surfaceMin: z.number().nullish(),
		title: z.string().nullish(),
		token: z.string().nullish(),
		transactionType: OpenTransactionTypeSchema.nullish(),
		updatedAt: z.string().nullish(),
		user: z.string().nullish(),
		withCoherentPrice: z.boolean().nullish(),
		withVirtualTour: z.boolean().nullish(),
	})
	.loose();

export type MeloSearch = z.infer<typeof SearchSchema>;
