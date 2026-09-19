import { z } from 'zod';

const AutomQuery = z.string().trim().min(1);
const AutomPage = z.number().int().min(1).optional();
const AutomLocale = z.string().trim().min(1).optional();

const GoogleCountriesInputSchema = z.object({
	query: AutomQuery,
});
const GoogleCountriesResponseSchema = z.array(
	z
		.object({
			country_code: z.string(),
			country_name: z.string(),
		})
		.passthrough(),
);

const GoogleLanguagesInputSchema = z.object({
	query: AutomQuery,
});
const GoogleLanguagesResponseSchema = z.array(
	z
		.object({
			language_code: z.string(),
			language_name: z.string(),
		})
		.passthrough(),
);

const GoogleLocationsInputSchema = z.object({
	query: AutomQuery,
});
const GoogleLocationsResponseSchema = z.array(
	z
		.object({
			id: z.string(),
			gps: z.array(z.number()),
			name: z.string(),
			reach: z.number(),
			google_id: z.number(),
			target_type: z.string(),
			country_code: z.string(),
			canonical_name: z.string(),
		})
		.passthrough(),
);

const GoogleImagesInputSchema = z.object({
	query: AutomQuery,
	page: AutomPage,
	gl: AutomLocale,
	hl: AutomLocale,
});
const GoogleImagesResponseSchema = z
	.object({
		images: z.array(
			z
				.object({
					url: z.string(),
					link: z.string(),
					title: z.string(),
					domain: z.string(),
					source: z.string(),
					position: z.number(),
					image_width: z.number(),
					image_height: z.number(),
				})
				.passthrough(),
		),
		search_parameters: z
			.object({
				q: z.string(),
				gl: z.string().optional(),
				hl: z.string().optional(),
				page: z.number(),
				engine: z.string(),
			})
			.passthrough(),
	})
	.passthrough();

export type GoogleCountriesInput = z.infer<typeof GoogleCountriesInputSchema>;
export type GoogleCountriesResponse = z.infer<
	typeof GoogleCountriesResponseSchema
>;

export type GoogleLanguagesInput = z.infer<typeof GoogleLanguagesInputSchema>;
export type GoogleLanguagesResponse = z.infer<
	typeof GoogleLanguagesResponseSchema
>;

export type GoogleLocationsInput = z.infer<typeof GoogleLocationsInputSchema>;
export type GoogleLocationsResponse = z.infer<
	typeof GoogleLocationsResponseSchema
>;

export type GoogleImagesInput = z.infer<typeof GoogleImagesInputSchema>;
export type GoogleImagesResponse = z.infer<typeof GoogleImagesResponseSchema>;

export type AutomEndpointInputs = {
	googleCountries: GoogleCountriesInput;
	googleLanguages: GoogleLanguagesInput;
	googleLocations: GoogleLocationsInput;
	googleImages: GoogleImagesInput;
};

export type AutomEndpointOutputs = {
	googleCountries: GoogleCountriesResponse;
	googleLanguages: GoogleLanguagesResponse;
	googleLocations: GoogleLocationsResponse;
	googleImages: GoogleImagesResponse;
};

export const AutomEndpointInputSchemas = {
	googleCountries: GoogleCountriesInputSchema,
	googleLanguages: GoogleLanguagesInputSchema,
	googleLocations: GoogleLocationsInputSchema,
	googleImages: GoogleImagesInputSchema,
} as const;

export const AutomEndpointOutputSchemas = {
	googleCountries: GoogleCountriesResponseSchema,
	googleLanguages: GoogleLanguagesResponseSchema,
	googleLocations: GoogleLocationsResponseSchema,
	googleImages: GoogleImagesResponseSchema,
} as const;
