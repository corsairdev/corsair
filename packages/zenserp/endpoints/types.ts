import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const EmptyInputSchema = z.object({}).strict();
const SearchOptions = {
	location: NonEmptyString.optional(),
	hl: NonEmptyString.optional(),
	gl: NonEmptyString.optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
	num: z.number().int().min(1).max(100).optional(),
	start: z.number().int().min(0).optional(),
};

export const GoogleSearchInputSchema = z.object({
	q: NonEmptyString,
	...SearchOptions,
});
export const BingSearchInputSchema = z.object({
	q: NonEmptyString,
	...SearchOptions,
});
export const YandexSearchInputSchema = z.object({
	q: NonEmptyString,
	...SearchOptions,
});
export const ReverseImageSearchInputSchema = z.object({
	imageUrl: z.string().url(),
	location: NonEmptyString.optional(),
	gl: NonEmptyString.optional(),
	hl: NonEmptyString.optional(),
});
export const ShoppingProductInputSchema = z.object({
	productId: NonEmptyString,
	location: NonEmptyString.optional(),
	gl: NonEmptyString.optional(),
	hl: NonEmptyString.optional(),
});
export const TrendsInputSchema = z.object({
	keywords: z.array(NonEmptyString).min(1).max(5),
	location: NonEmptyString.optional(),
	timeframe: NonEmptyString.optional(),
});
export const StatusInputSchema = EmptyInputSchema;
export const ListBatchesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export const ListCountriesInputSchema = EmptyInputSchema;
export const ListLocationsInputSchema = z.object({
	q: NonEmptyString.optional(),
});
export const ListSearchEnginesInputSchema = EmptyInputSchema;
export const ListLanguagesInputSchema = EmptyInputSchema;

const UnknownRecord = z.record(z.string(), z.unknown());
export const SearchResponseSchema = z
	.object({
		query: z.string().optional(),
		organic: z.array(UnknownRecord).optional(),
		paid: z.array(UnknownRecord).optional(),
		images: z.array(UnknownRecord).optional(),
		knowledge_graph: UnknownRecord.optional(),
	})
	.loose();
export const ShoppingProductResponseSchema = z
	.object({ product: UnknownRecord.optional() })
	.loose();
export const TrendsResponseSchema = z
	.object({ data: z.array(UnknownRecord).optional() })
	.loose();
export const StatusResponseSchema = z
	.object({ remaining_requests: z.number().int().min(0) })
	.loose();
export const BatchesResponseSchema = z.union([
	z.array(UnknownRecord),
	z.object({ data: z.array(UnknownRecord) }).loose(),
]);
export const CountriesResponseSchema = z.array(
	z
		.object({
			name: z.string().optional(),
			value: z.string().optional(),
			code: z.string().optional(),
		})
		.loose(),
);
export const LocationsResponseSchema = z.array(
	z
		.object({
			name: z.string().optional(),
			canonical_name: z.string().optional(),
			country_code: z.string().optional(),
		})
		.loose(),
);
export const SearchEnginesResponseSchema = z.array(
	z
		.object({ name: z.string().optional(), domain: z.string().optional() })
		.loose(),
);
export const LanguagesResponseSchema = z.array(
	z
		.object({
			name: z.string().optional(),
			value: z.string().optional(),
			code: z.string().optional(),
		})
		.loose(),
);

export type ZenserpEndpointInputs = {
	searchGoogle: z.infer<typeof GoogleSearchInputSchema>;
	searchBing: z.infer<typeof BingSearchInputSchema>;
	searchYandex: z.infer<typeof YandexSearchInputSchema>;
	searchReverseImage: z.infer<typeof ReverseImageSearchInputSchema>;
	shoppingGetProduct: z.infer<typeof ShoppingProductInputSchema>;
	trendsGet: z.infer<typeof TrendsInputSchema>;
	accountGetStatus: z.infer<typeof StatusInputSchema>;
	batchesList: z.infer<typeof ListBatchesInputSchema>;
	metadataListCountries: z.infer<typeof ListCountriesInputSchema>;
	metadataListLocations: z.infer<typeof ListLocationsInputSchema>;
	metadataListSearchEngines: z.infer<typeof ListSearchEnginesInputSchema>;
	metadataListLanguages: z.infer<typeof ListLanguagesInputSchema>;
};

export type ZenserpEndpointOutputs = {
	searchGoogle: z.infer<typeof SearchResponseSchema>;
	searchBing: z.infer<typeof SearchResponseSchema>;
	searchYandex: z.infer<typeof SearchResponseSchema>;
	searchReverseImage: z.infer<typeof SearchResponseSchema>;
	shoppingGetProduct: z.infer<typeof ShoppingProductResponseSchema>;
	trendsGet: z.infer<typeof TrendsResponseSchema>;
	accountGetStatus: z.infer<typeof StatusResponseSchema>;
	batchesList: z.infer<typeof BatchesResponseSchema>;
	metadataListCountries: z.infer<typeof CountriesResponseSchema>;
	metadataListLocations: z.infer<typeof LocationsResponseSchema>;
	metadataListSearchEngines: z.infer<typeof SearchEnginesResponseSchema>;
	metadataListLanguages: z.infer<typeof LanguagesResponseSchema>;
};

export const ZenserpEndpointInputSchemas = {
	searchGoogle: GoogleSearchInputSchema,
	searchBing: BingSearchInputSchema,
	searchYandex: YandexSearchInputSchema,
	searchReverseImage: ReverseImageSearchInputSchema,
	shoppingGetProduct: ShoppingProductInputSchema,
	trendsGet: TrendsInputSchema,
	accountGetStatus: StatusInputSchema,
	batchesList: ListBatchesInputSchema,
	metadataListCountries: ListCountriesInputSchema,
	metadataListLocations: ListLocationsInputSchema,
	metadataListSearchEngines: ListSearchEnginesInputSchema,
	metadataListLanguages: ListLanguagesInputSchema,
} as const;

export const ZenserpEndpointOutputSchemas = {
	searchGoogle: SearchResponseSchema,
	searchBing: SearchResponseSchema,
	searchYandex: SearchResponseSchema,
	searchReverseImage: SearchResponseSchema,
	shoppingGetProduct: ShoppingProductResponseSchema,
	trendsGet: TrendsResponseSchema,
	accountGetStatus: StatusResponseSchema,
	batchesList: BatchesResponseSchema,
	metadataListCountries: CountriesResponseSchema,
	metadataListLocations: LocationsResponseSchema,
	metadataListSearchEngines: SearchEnginesResponseSchema,
	metadataListLanguages: LanguagesResponseSchema,
} as const;
