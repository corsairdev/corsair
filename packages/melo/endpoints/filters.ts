import { z } from 'zod';

export const TransactionTypeSchema = z
	.union([z.literal(0), z.literal(1)])
	.describe('Type of transaction. Sell `0`, Rent `1`.');

export const PropertyTypeSchema = z
	.union([
		z.literal(0),
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
		z.literal(6),
	])
	.describe(
		'Type of property. Apartment `0`, House `1`, Building `2`, Parking `3`, Office `4`, Land `5`, Shop `6`.',
	);

export const PublisherTypeSchema = z
	.union([z.literal(0), z.literal(1)])
	.describe('Type of publisher. Individual `0`, Professional `1`.');

export const FeesResponsibilitySchema = z
	.union([z.literal(0), z.literal(1)])
	.describe('Responsibility for fees. `0` for seller, `1` for buyer.');

export const GeoAccuracySchema = z
	.union([z.literal(1), z.literal(2)])
	.describe(
		'Geocoding confidence level: `1` (house-number level), `2` (neighborhood level).',
	);

export const EnergyCategorySchema = z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

export const SortModeSchema = z.enum(['property', 'advert']);

export const AggregationIntervalSchema = z.enum(['month', 'year']);

export const DirectionSchema = z.enum(['asc', 'desc']);

export const SubscribedEventSchema = z.enum([
	'ad.update.price',
	'ad.update.surface',
	'ad.update.pictures',
	'ad.update.expired',
	'property.ad.create',
	'property.ad.update',
]);

/**
 * The spec types every date filter as `date-time`, but its own examples send
 * `2020-01-10` and `2021-05-07 12:42:42`, so an RFC 3339 check would reject
 * values the API documents.
 */
export const DateTimeSchema = z.string().min(1);

const ExpressionTermSchema = z
	.object({
		word: z.string().min(1).describe('The word or phrase to match.'),
		options: z
			.object({
				includes: z
					.boolean()
					.optional()
					.describe('true to require the word, false to exclude it.'),
				strict: z
					.boolean()
					.optional()
					.describe('true to match the word exactly.'),
			})
			// Strict so a mistyped option (`strcit`) is an input error rather than
			// a field that is silently dropped: the request would otherwise go out
			// with no filter, and a search would be saved that matches everything.
			.strict()
			.optional(),
	})
	.strict();

/** One OR group: every term in the array must match (AND). */
export const ExpressionGroupSchema = z.array(ExpressionTermSchema);

/** One polygon: an array of `[lon, lat]` points. */
export const GeoShapeSchema = z.array(z.tuple([z.number(), z.number()]));

export const PAGE_SIZE_MAX = 30;

export const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('The collection page number. Defaults to 1.');

export const PropertyFilterShape = {
	advertPriceMin: z
		.number()
		.optional()
		.describe(
			'Minimum price of advert. Filters properties based on any non expired adverts prices.',
		),
	advertPriceMax: z
		.number()
		.optional()
		.describe(
			'Maximum price of advert. Filters properties based on any non expired adverts prices.',
		),
	bedroomMin: z
		.number()
		.int()
		.optional()
		.describe('Minimum number of bedrooms in the property.'),
	bedroomMax: z
		.number()
		.int()
		.optional()
		.describe('Maximum number of bedrooms in the property.'),
	budgetMin: z.number().optional().describe('Minimum budget for the property.'),
	budgetMax: z.number().optional().describe('Maximum budget for the property.'),
	condominiumFeesMin: z
		.number()
		.optional()
		.describe('Minimum condominium fees for the property.'),
	condominiumFeesMax: z
		.number()
		.optional()
		.describe('Maximum condominium fees for the property.'),
	constructionYearMin: z
		.number()
		.int()
		.optional()
		.describe('Minimum construction year of the property.'),
	constructionYearMax: z
		.number()
		.int()
		.optional()
		.describe('Maximum construction year of the property.'),
	energyCategories: z
		.array(EnergyCategorySchema)
		.optional()
		.describe('The energy efficiency categories of the property.'),
	energyValueMin: z
		.number()
		.optional()
		.describe('Minimum energy value of the property.'),
	energyValueMax: z
		.number()
		.optional()
		.describe('Maximum energy value of the property.'),
	eventPriceVariationFromCreatedAt: DateTimeSchema.optional().describe(
		'Date from which an event of type price is created — inclusive.',
	),
	eventPriceVariationToCreatedAt: DateTimeSchema.optional().describe(
		'Date before which an event of type price is created — inclusive.',
	),
	eventPriceVariationMin: z
		.number()
		.optional()
		.describe('Minimum percent variation of an event of type price.'),
	eventPriceVariationMax: z
		.number()
		.optional()
		.describe('Maximum percent variation of an event of type price.'),
	eventSurfaceVariationFromCreatedAt: DateTimeSchema.optional().describe(
		'Date from which an event of type surface is created — inclusive.',
	),
	eventSurfaceVariationToCreatedAt: DateTimeSchema.optional().describe(
		'Date before which an event of type surface is created — inclusive.',
	),
	eventSurfaceVariationMin: z
		.number()
		.optional()
		.describe('Minimum percent variation of an event of type surface.'),
	eventSurfaceVariationMax: z
		.number()
		.optional()
		.describe('Maximum percent variation of an event of type surface.'),
	excludedCities: z
		.array(z.string())
		.optional()
		.describe('Cities to be excluded.'),
	excludedInseeCodes: z
		.array(z.string())
		.optional()
		.describe('Insee codes to be excluded.'),
	excludedProperties: z
		.array(z.string())
		.optional()
		.describe('Properties to be excluded.'),
	excludedZipcodes: z
		.array(z.string())
		.optional()
		.describe('Zipcodes to be excluded.'),
	expressions: z
		.array(ExpressionGroupSchema)
		.optional()
		.describe(
			'Full-text rules on the title or description of the property: an array of OR groups, each an array of AND terms `{ word, options: { includes, strict } }`. Sent as `expressions[group][term][word]` and `expressions[group][term][options][includes|strict]`.',
		),
	feesPercentageMin: z
		.number()
		.optional()
		.describe('Minimum percentage of fees.'),
	feesPercentageMax: z
		.number()
		.optional()
		.describe('Maximum percentage of fees.'),
	feesResponsibility: FeesResponsibilitySchema.optional().describe(
		'Responsibility for fees. `0` for seller, `1` for buyer.',
	),
	floorQuantityMin: z
		.number()
		.int()
		.optional()
		.describe('Minimum number of floors in the property.'),
	floorQuantityMax: z
		.number()
		.int()
		.optional()
		.describe('Maximum number of floors in the property.'),
	fromDate: DateTimeSchema.optional().describe(
		'Date from which the property is created — inclusive.',
	),
	toDate: DateTimeSchema.optional().describe(
		'Date until which the property is created — inclusive.',
	),
	fromUpdatedAt: DateTimeSchema.optional().describe(
		'Date from which the property is updated — inclusive.',
	),
	toUpdatedAt: DateTimeSchema.optional().describe(
		'Date until which the property is updated — inclusive.',
	),
	furnished: z
		.boolean()
		.optional()
		.describe('Filter for furnished properties.'),
	geoAccuracy: z
		.array(GeoAccuracySchema)
		.optional()
		.describe(
			'Filters properties by geocoding confidence level: `1` (house-number level), `2` (neighborhood level).',
		),
	geoShapes: z
		.array(GeoShapeSchema)
		.optional()
		.describe(
			'Geographic areas to filter on: an array of polygons, each an array of `[lon, lat]` points. Sent as `geoShapes[polygon][point][0|1]`.',
		),
	greenHouseGasCategories: z
		.array(EnergyCategorySchema)
		.optional()
		.describe('Green house gas performance letter array of the property.'),
	greenHouseGasValueMin: z
		.number()
		.optional()
		.describe('Minimum value of green house gas of the property.'),
	greenHouseGasValueMax: z
		.number()
		.optional()
		.describe('Maximum value of green house gas of the property.'),
	includedCities: z
		.array(z.string())
		.optional()
		.describe(
			'Located in given cities. Use `indicators.locations` to get the city IRIs, for example `/cities/30953`.',
		),
	includedDepartments: z
		.array(z.string())
		.optional()
		.describe(
			'Located in given departments. Use `indicators.locations` to get the department IRIs, for example `/departments/77`.',
		),
	includedInseeCodes: z
		.array(z.string())
		.optional()
		.describe('Located in given insee codes.'),
	includedZipcodes: z
		.array(z.string())
		.optional()
		.describe('Located in given zipcodes.'),
	inventoryPriceMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given inventory price.'),
	inventoryPriceMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given inventory price.'),
	lat: z
		.number()
		.optional()
		.describe('Latitude. Will work if latitude exists in the property.'),
	lon: z
		.number()
		.optional()
		.describe('Longitude. Will work if longitude exists in the property.'),
	radius: z
		.number()
		.optional()
		.describe(
			'Distance expressed in kilometers. Will work if latitude & longitude parameters are also set.',
		),
	lotCountMin: z
		.number()
		.int()
		.optional()
		.describe('Greater than or equal to given lot count.'),
	lotCountMax: z
		.number()
		.int()
		.optional()
		.describe('Lower than or equal to given lot count.'),
	priceExcludingFeesMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given price excluding fees.'),
	priceExcludingFeesMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given price excluding fees.'),
	pricePerMeterMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given price per meter.'),
	pricePerMeterMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given price per meter.'),
	propertyTypes: z
		.array(PropertyTypeSchema)
		.optional()
		.describe(
			'Type of property. Apartment `0`, House `1`, Building `2`, Parking `3`, Office `4`, Land `5`, Shop `6`.',
		),
	publisherTypes: z
		.array(PublisherTypeSchema)
		.optional()
		.describe('Type of publisher. Individual `0`, Professional `1`.'),
	rentalChargesMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given rental charges amount.'),
	rentalChargesMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given rental charges amount.'),
	rentalPledgeMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given rental pledge amount.'),
	rentalPledgeMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given rental pledge amount.'),
	renterFeesMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given renter fees.'),
	renterFeesMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given renter fees.'),
	roomMin: z
		.number()
		.int()
		.optional()
		.describe('Minimum rooms of the property.'),
	roomMax: z
		.number()
		.int()
		.optional()
		.describe('Maximum rooms of the property.'),
	sortMode: SortModeSchema.optional().describe(
		'Whether to sort results by properties or by adverts. If `property`, `fromDate`/`toDate` apply to the property root object; if `advert`, they apply to the nested adverts.',
	),
	surfaceMin: z
		.number()
		.optional()
		.describe('Greater than or equal to given surface.'),
	surfaceMax: z
		.number()
		.optional()
		.describe('Lower than or equal to given surface.'),
	transactionType: TransactionTypeSchema.optional().describe(
		'Type of transaction. Sell `0`, Rent `1`.',
	),
	withCoherentPrice: z
		.boolean()
		.nullable()
		.optional()
		.describe(
			'Price coherence filter. `true` returns properties whose price passes our coherence checks; `false` returns properties flagged as incoherent — both also include properties whose price has not been assessed. Set to `null` (or send an empty value) to disable filtering. If omitted, defaults to `true`.',
		),
	withLocation: z
		.boolean()
		.optional()
		.describe('Having a latitude and longitude.'),
	withVirtualTour: z
		.boolean()
		.optional()
		.describe('Having a virtual tour video link.'),
	expired: z
		.boolean()
		.optional()
		.describe(
			"Whether to show properties that are expired. A property is considered expired when all its adverts are expired. Default is `null` which returns all properties no matter if they're expired or not.",
		),
};

export const PropertyListOnlyFilterShape = {
	fromExpiredAt: DateTimeSchema.optional().describe(
		'Date from which the advert is expired — inclusive.',
	),
	toExpiredAt: DateTimeSchema.optional().describe(
		'Date until which the advert is expired — inclusive.',
	),
	excludedSites: z
		.array(z.string())
		.optional()
		.describe('Source sites to be excluded.'),
	includedSites: z
		.array(z.string())
		.optional()
		.describe('Source sites to be included.'),
	landSurfaceMin: z.number().optional().describe('Minimum land surface.'),
	landSurfaceMax: z.number().optional().describe('Maximum land surface.'),
};
