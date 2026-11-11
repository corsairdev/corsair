import { z } from 'zod';

// Inputs use Yandex Translate's own field names, which are camelCase because
// the API is gRPC mapped to JSON.
// Reference: https://cloud.yandex.com/en/docs/translate/api-ref/
//
// Every call is a POST, including the reads — `languages` and `detect` take a
// body too, which is unusual but what the service expects.

/** A translated passage: the text and the language it was detected in. */
const TranslationSchema = z
	.object({
		text: z.string().nullish(),
		detectedLanguageCode: z
			.string()
			.nullish()
			.describe('The language the source was detected as.'),
	})
	.loose();

export type YandexTranslation = z.infer<typeof TranslationSchema>;

const TranslateOutputSchema = z
	.object({
		translations: z.array(TranslationSchema).nullish(),
	})
	.loose();

export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

// ── translate ─────────────────────────────────────────────────────────────

/**
 * Translates up to 10,000 characters in one call, across up to 1,000 separate
 * `texts`. `targetLanguageCode` is required; `sourceLanguageCode` is optional,
 * and leaving it out asks Yandex to detect it per text.
 */
const TranslateInputSchema = z
	.object({
		targetLanguageCode: z
			.string()
			.min(2)
			.describe('The language to translate into, such as `ru` or `en`.'),
		texts: z
			.array(z.string().min(1))
			.min(1)
			.max(1000)
			.describe('The passages to translate. Each is translated separately.'),
		sourceLanguageCode: z
			.string()
			.optional()
			.describe('The source language. Omit to detect it.'),
		format: z
			.enum(['PLAIN_TEXT', 'HTML'])
			.optional()
			.describe('How the text is interpreted. Defaults to PLAIN_TEXT.'),
		speller: z.boolean().optional().describe('Correct spelling in the result.'),
		folderId: z
			.string()
			.optional()
			.describe(
				'The folder the key belongs to. Only needed when the key is an IAM token covering several.',
			),
	})
	.superRefine((value, ctx) => {
		// The documented limit is 10,000 characters across every text.
		const total = value.texts.reduce((sum, text) => sum + text.length, 0);
		if (total > 10_000) {
			ctx.addIssue({
				code: 'custom',
				path: ['texts'],
				message: `The passages total ${total} characters; Yandex accepts at most 10,000 in one call.`,
			});
		}
	});

export type TranslateInput = z.infer<typeof TranslateInputSchema>;

// ── detect ────────────────────────────────────────────────────────────────

const DetectOutputSchema = z
	.object({
		detections: z
			.array(
				z
					.object({
						languageCode: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type DetectOutput = z.infer<typeof DetectOutputSchema>;

/**
 * Detects the language of each passage. It takes the same `texts` array and
 * answers one detection per entry, in order.
 */
const DetectInputSchema = z.object({
	texts: z.array(z.string().min(1)).min(1).max(1000),
	folderId: z.string().optional(),
});

export type DetectInput = z.infer<typeof DetectInputSchema>;

// ── languages ─────────────────────────────────────────────────────────────

/**
 * Lists the languages the service supports. `ui` narrows the names to that
 * language, and `hints` biases the list towards the given codes.
 */
const LanguagesInputSchema = z.object({
	ui: z
		.string()
		.optional()
		.describe('Return the display names in this language, e.g. `en`.'),
	hints: z
		.array(z.string().min(2))
		.min(1)
		.optional()
		.describe('Codes to include in the list even if not usually returned.'),
	folderId: z.string().optional(),
});

export type LanguagesInput = z.infer<typeof LanguagesInputSchema>;

const LanguagesOutputSchema = z
	.object({
		languages: z
			.array(
				z
					.object({
						code: z.string().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type LanguagesOutput = z.infer<typeof LanguagesOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type YandexEndpointInputs = {
	translate: TranslateInput;
	detectLanguages: DetectInput;
	listLanguages: LanguagesInput;
};

export type YandexEndpointOutputs = {
	translate: TranslateOutput;
	detectLanguages: DetectOutput;
	listLanguages: LanguagesOutput;
};

export const YandexEndpointInputSchemas = {
	translate: TranslateInputSchema,
	detectLanguages: DetectInputSchema,
	listLanguages: LanguagesInputSchema,
} as const;

export const YandexEndpointOutputSchemas = {
	translate: TranslateOutputSchema,
	detectLanguages: DetectOutputSchema,
	listLanguages: LanguagesOutputSchema,
} as const;
