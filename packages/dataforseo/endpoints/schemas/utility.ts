import { z } from 'zod';
import { Num, Strings, Text } from './shared';

const LocationFields = {
	location_code: z.number(),
	location_name: z.string(),
	location_code_parent: Num,
	country_iso_code: Text,
	location_type: Text,
};

export const SerpLocation = z.object(LocationFields);

export const SerpLanguage = z.object({
	language_name: z.string(),
	language_code: z.string(),
});

export const LabsLocation = z.object({
	...LocationFields,
	available_languages: z
		.array(
			z.object({
				available_sources: Strings,
				language_name: Text,
				language_code: Text,
				keywords: Num,
				serps: Num,
			}),
		)
		.nullish(),
});

// The per-endpoint rate and price tables in this response are not modelled.
export const UserData = z.object({
	login: z.string(),
	timezone: Text,
	money: z.object({ total: Num, balance: Num }).nullish(),
	backlinks_subscription_expiry_date: Text,
	llm_mentions_subscription_expiry_date: Text,
});

export const SerpLocationsInput = z.object({
	country: z
		.string()
		.regex(/^[A-Za-z]{2}$/, 'Expected an ISO 3166-1 alpha-2 country code')
		.optional(),
});

export const EmptyInput = z.object({});
