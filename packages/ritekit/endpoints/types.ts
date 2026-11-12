import { z } from 'zod';

// Inputs use RiteKit's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field RiteKit adds or omits cannot fail a call
// that has already happened. Response shapes follow the samples in the published
// Postman collection at
// https://documenter.getpostman.com/view/2010712/SzS7Qku5 and the demo pages at
// https://ritekit.com/api-demo/.
//
// Every successful call carries `result: true`, a human `message` and sometimes
// a `code` that repeats 200. A refusal carries `result: false` with a `message`,
// an `info` hint and a `code`: see client.ts.

const UrlSchema = z.string().min(1).describe('An absolute http or https URL.');

const TextSchema = z.string().min(1).describe('Up to 1,000 characters.');

const ColorSchema = z
	.string()
	.min(1)
	.describe(
		'A CSS color, such as #000000 or transparent. The # is percent-encoded for you.',
	);

const HexColorSchema = z.string().describe('A hex color such as #2dbe60.');

/** The shared head of every answer. */
const EnvelopeSchema = z
	.object({
		result: z
			.boolean()
			.nullish()
			.describe(
				'True on success. A refusal is a non-2xx status, not a false here.',
			),
		message: z.string().nullish(),
		code: z
			.number()
			.nullish()
			.describe('Repeats the HTTP status when present.'),
	})
	.loose();

/**
 * One hashtag's real-time stats. `images`, `links` and `mentions` are the share
 * of the hashtag's tweets carrying an image, a link or a mention, given as a
 * percentage rather than a count, which is why they are fractional.
 */
export const HashtagStatsSchema = z
	.object({
		hashtag: z.string().nullish(),
		tag: z.string().nullish(),
		tweets: z.number().nullish(),
		exposure: z.number().nullish(),
		retweets: z.number().nullish(),
		images: z
			.number()
			.nullish()
			.describe('Percentage of tweets with an image.'),
		links: z.number().nullish().describe('Percentage of tweets with a link.'),
		mentions: z
			.number()
			.nullish()
			.describe('Percentage of tweets with a mention.'),
		mediaCount: z
			.number()
			.nullish()
			.describe('How many posts carry the hashtag, on the image endpoint.'),
		color: z
			.number()
			.nullish()
			.describe('0 unused, 1 overused, 2 good, 3 great, indexed into `color`.'),
	})
	.loose();

export type RiteKitHashtagStats = z.infer<typeof HashtagStatsSchema>;

/**
 * The four labels that `color` indexes into. RiteKit returns them in the same
 * response as the numbers they explain.
 */
const ColorLegendSchema = z
	.array(z.string())
	.describe(
		"The labels for a stats entry's `color`: unused, overused, good, great.",
	);

// ── hashtags.stats ────────────────────────────────────────────────────────

export const RITEKIT_MAX_HASHTAGS = 100;

const HashtagsStatsInputSchema = z.object({
	tags: z
		.array(z.string().min(1))
		.min(1)
		.max(RITEKIT_MAX_HASHTAGS)
		.describe(
			`Up to ${RITEKIT_MAX_HASHTAGS} hashtags, with or without the leading #.`,
		),
});

export type HashtagsStatsInput = z.infer<typeof HashtagsStatsInputSchema>;

const HashtagsStatsResponseSchema = EnvelopeSchema.extend({
	hashtags: z
		.array(z.string())
		.nullish()
		.describe('The tags as RiteKit read them.'),
	stats: z.array(HashtagStatsSchema).nullish(),
	color: ColorLegendSchema.nullish(),
});

export type HashtagsStatsResponse = z.infer<typeof HashtagsStatsResponseSchema>;

// ── hashtags.autoHashtag ──────────────────────────────────────────────────

export const RITEKIT_HASHTAG_POSITIONS = ['auto', 'end'] as const;

const HashtagsAutoInputSchema = z.object({
	post: TextSchema.describe('The post to add hashtags to.'),
	maxHashtags: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe("How many to add. Defaults to RiteKit's own choice."),
	hashtagPosition: z
		.enum(RITEKIT_HASHTAG_POSITIONS)
		.optional()
		.describe('auto places them in the sentence, end appends them.'),
});

export type HashtagsAutoInput = z.infer<typeof HashtagsAutoInputSchema>;

const HashtagsAutoResponseSchema = EnvelopeSchema.extend({
	post: z.string().nullish().describe('The post with hashtags added.'),
});

export type HashtagsAutoResponse = z.infer<typeof HashtagsAutoResponseSchema>;

// ── hashtags.suggestions ──────────────────────────────────────────────────

const HashtagsSuggestionsInputSchema = z.object({
	text: TextSchema.describe('A single word or a short block of text.'),
});

export type HashtagsSuggestionsInput = z.infer<
	typeof HashtagsSuggestionsInputSchema
>;

const HashtagsSuggestionsResponseSchema = EnvelopeSchema.extend({
	data: z.array(HashtagStatsSchema).nullish(),
});

export type HashtagsSuggestionsResponse = z.infer<
	typeof HashtagsSuggestionsResponseSchema
>;

// ── hashtags.forUrl ───────────────────────────────────────────────────────

const HashtagsForUrlInputSchema = z.object({
	url: UrlSchema.describe('The page to read hashtags from.'),
});

export type HashtagsForUrlInput = z.infer<typeof HashtagsForUrlInputSchema>;

// This route answers `hashtags` rather than `data`, and omits `code`.
const HashtagsForUrlResponseSchema = EnvelopeSchema.extend({
	hashtags: z.array(HashtagStatsSchema).nullish(),
});

export type HashtagsForUrlResponse = z.infer<
	typeof HashtagsForUrlResponseSchema
>;

// ── hashtags.suggestionsForImage ──────────────────────────────────────────

const HashtagsForImageInputSchema = z.object({
	image: UrlSchema.describe('A publicly reachable image URL.'),
});

export type HashtagsForImageInput = z.infer<typeof HashtagsForImageInputSchema>;

const HashtagsForImageResponseSchema = EnvelopeSchema.extend({
	data: z.array(HashtagStatsSchema).nullish(),
});

export type HashtagsForImageResponse = z.infer<
	typeof HashtagsForImageResponseSchema
>;

// ── hashtags.trending ─────────────────────────────────────────────────────

const HashtagsTrendingInputSchema = z.object({
	green: z
		.boolean()
		.optional()
		.describe('Only hashtags in the "good" or "great" color band.'),
	latin: z
		.boolean()
		.optional()
		.describe('Only hashtags in the Latin alphabet.'),
});

export type HashtagsTrendingInput = z.infer<typeof HashtagsTrendingInputSchema>;

const TrendingTagSchema = z
	.object({
		tag: z.string().nullish(),
		tweets: z.number().nullish(),
		retweets: z.number().nullish(),
		exposure: z.number().nullish(),
		links: z.number().nullish(),
		photos: z
			.number()
			.nullish()
			.describe('Named photos here, images elsewhere.'),
		mentions: z.number().nullish(),
		color: z.number().nullish(),
	})
	.loose();

const HashtagsTrendingResponseSchema = EnvelopeSchema.extend({
	tags: z.array(TrendingTagSchema).nullish(),
});

export type HashtagsTrendingResponse = z.infer<
	typeof HashtagsTrendingResponseSchema
>;

// ── hashtags.cleanInstagram ───────────────────────────────────────────────

const HashtagsCleanInstagramInputSchema = z.object({
	post: TextSchema.describe('A post whose hashtags should be checked.'),
});

export type HashtagsCleanInstagramInput = z.infer<
	typeof HashtagsCleanInstagramInputSchema
>;

const HashtagsCleanInstagramResponseSchema = EnvelopeSchema.extend({
	post: z
		.string()
		.nullish()
		.describe('The same post with the banned hashtags removed.'),
	bannedHashtags: z
		.array(z.string())
		.nullish()
		.describe('The hashtags that were removed, each with its leading #.'),
});

export type HashtagsCleanInstagramResponse = z.infer<
	typeof HashtagsCleanInstagramResponseSchema
>;

// ── emojis ────────────────────────────────────────────────────────────────

const EmojisSuggestionsInputSchema = z.object({
	text: TextSchema.describe('A short block of text to emoji-ify.'),
});

export type EmojisSuggestionsInput = z.infer<
	typeof EmojisSuggestionsInputSchema
>;

const EmojisSuggestionsResponseSchema = EnvelopeSchema.extend({
	emojis: z.array(z.string()).nullish().describe('Suggested emoji characters.'),
});

export type EmojisSuggestionsResponse = z.infer<
	typeof EmojisSuggestionsResponseSchema
>;

const EmojisAutoInputSchema = z.object({
	text: TextSchema.describe('A short block of text to emoji-ify.'),
});

export type EmojisAutoInput = z.infer<typeof EmojisAutoInputSchema>;

const EmojisAutoResponseSchema = EnvelopeSchema.extend({
	text: z.string().nullish().describe('The text with emoji added.'),
});

export type EmojisAutoResponse = z.infer<typeof EmojisAutoResponseSchema>;

// ── images.quote ──────────────────────────────────────────────────────────

const ImagesQuoteInputSchema = z.object({
	text: z.string().min(1).describe('The quote.'),
	author: z.string().min(1).describe('Who said it.'),
	width: z.number().int().min(1).optional().describe('Pixels, such as 400.'),
	height: z.number().int().min(1).optional().describe('Pixels, such as 400.'),
	textFont: z.string().optional().describe('A font name, such as Lora.'),
	textColor: ColorSchema.optional(),
	textFontWeight: z.number().int().optional().describe('Such as 400 or 700.'),
	authorFont: z.string().optional().describe('A font name, such as Lato.'),
	authorColor: ColorSchema.optional(),
	authorFontWeight: z.number().int().optional(),
	highlightEnabled: z
		.boolean()
		.optional()
		.describe('Highlights part of the quote.'),
	highlightColor: ColorSchema.optional().describe(
		'transparent leaves the text unhighlighted.',
	),
	backgroundColor1: ColorSchema.optional().describe(
		"The gradient's first stop.",
	),
	backgroundColor2: ColorSchema.optional().describe(
		"The gradient's second stop.",
	),
	logoUrl: z
		.string()
		.optional()
		.describe('An image drawn onto the quote, such as a brand logo.'),
});

export type ImagesQuoteInput = z.infer<typeof ImagesQuoteInputSchema>;

/**
 * The docs say these routes return "URL of an image"; live (11-12) they answer
 * with the image bytes (`image/png`, `image/gif`), as RiteKit's Python client
 * expects. The client returns them as a data URL.
 */
const RenderedImageSchema = z.object({
	url: z.string().describe('The image as a data URL (data:<type>;base64,...).'),
	contentType: z.string().describe('Such as image/png or image/gif.'),
	bytes: z.number().describe('Size of the image in bytes.'),
});

const ImagesQuoteResponseSchema = RenderedImageSchema.describe(
	'The rendered quote, a PNG.',
);

export type ImagesQuoteResponse = z.infer<typeof ImagesQuoteResponseSchema>;

// ── images.animate ────────────────────────────────────────────────────────

export const RITEKIT_ANIMATION_TYPES = ['glint'] as const;

const ImagesAnimateInputSchema = z.object({
	url: UrlSchema.describe('The still image to animate.'),
	type: z
		.enum(RITEKIT_ANIMATION_TYPES)
		.optional()
		.describe('The animation style. glint is the only one documented.'),
});

export type ImagesAnimateInput = z.infer<typeof ImagesAnimateInputSchema>;

const ImagesAnimateResponseSchema =
	RenderedImageSchema.describe('The animated GIF.');

export type ImagesAnimateResponse = z.infer<typeof ImagesAnimateResponseSchema>;

// ── images.extractTopImage ────────────────────────────────────────────────

const ImagesExtractInputSchema = z.object({
	url: UrlSchema.describe('The page to read the lead image from.'),
});

export type ImagesExtractInput = z.infer<typeof ImagesExtractInputSchema>;

const ImagesExtractResponseSchema = EnvelopeSchema.extend({
	top_image: z
		.string()
		.nullish()
		.describe("The page's lead image. Named in snake_case by RiteKit."),
});

export type ImagesExtractResponse = z.infer<typeof ImagesExtractResponseSchema>;

// ── links.listCtas ────────────────────────────────────────────────────────

const LinksListCtasInputSchema = z.object({});

export type LinksListCtasInput = z.infer<typeof LinksListCtasInputSchema>;

const CtaSchema = z
	.object({
		id: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Pass as links.shorten `cta`. bit.ly means no ad.'),
		name: z.string().nullish(),
		code: z.string().nullish(),
		default: z
			.number()
			.nullish()
			.describe("1 for the account's default Link Ad."),
	})
	.loose();

// Live 11-12: `{ result, list }`, with no message or code.
const LinksListCtasResponseSchema = z
	.object({
		result: z.boolean().nullish(),
		list: z.array(CtaSchema).nullish(),
	})
	.loose();

export type LinksListCtasResponse = z.infer<typeof LinksListCtasResponseSchema>;

// ── links.shortLink ───────────────────────────────────────────────────────

const LinksShortenInputSchema = z.object({
	url: UrlSchema.describe('The URL to shorten.'),
	cta: z
		.string()
		.min(1)
		.describe(
			'The Link Ad to attach: an id from links.listCtas, such as bit.ly for none. RiteKit answers 500 without one.',
		),
});

export type LinksShortenInput = z.infer<typeof LinksShortenInputSchema>;

const LinksShortenResponseSchema = z
	.object({
		result: z.boolean().nullish(),
		url: z.string().nullish().describe('The short link.'),
		original: z.string().nullish(),
		service: z.string().nullish().describe('rite.ly.'),
		ctaId: z.string().nullish(),
		limit: z
			.object({ remaining: z.number().nullish() })
			.loose()
			.nullish()
			.describe('Short links left on the plan.'),
	})
	.loose();

export type LinksShortenResponse = z.infer<typeof LinksShortenResponseSchema>;

// ── personInsights ────────────────────────────────────────────────────────

const EmailInputSchema = z.object({
	email: z.string().min(1).describe('An email address, not necessarily valid.'),
});

const EmailResponseSchema = EnvelopeSchema.extend({
	email: z.string().nullish().describe('The address as RiteKit read it.'),
});

const FreemailInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.describe(
			'An email address or a domain; the sample passes a full address under this name.',
		),
});

export type FreemailInput = z.infer<typeof FreemailInputSchema>;

const FreemailResponseSchema = EnvelopeSchema.extend({
	domain: z.string().nullish(),
	freemail: z
		.boolean()
		.nullish()
		.describe('True for a consumer provider such as gmail.com.'),
});

export type FreemailResponse = z.infer<typeof FreemailResponseSchema>;

const DisposableInputSchema = z.object({
	email: z.string().min(1),
});

export type DisposableInput = z.infer<typeof DisposableInputSchema>;

const DisposableResponseSchema = EmailResponseSchema.extend({
	disposable: z.boolean().nullish(),
});

export type DisposableResponse = z.infer<typeof DisposableResponseSchema>;

const EmailTypoInputSchema = z.object({
	email: z.string().min(1),
});

export type EmailTypoInput = z.infer<typeof EmailTypoInputSchema>;

const EmailTypoResponseSchema = EmailResponseSchema.extend({
	suggestions: z
		.array(z.string())
		.nullish()
		.describe('Likely corrections, most probable first.'),
});

export type EmailTypoResponse = z.infer<typeof EmailTypoResponseSchema>;

const NameFromEmailInputSchema = z.object({
	email: z.string().min(1),
});

export type NameFromEmailInput = z.infer<typeof NameFromEmailInputSchema>;

// The Postman sample shows `info` as { givenName, surname }; the live API (11-12)
// and RiteKit's Python client read it as one string, such as "John Doe".
const NameFromEmailResponseSchema = EmailResponseSchema.extend({
	info: z
		.union([
			z.string(),
			z
				.object({
					givenName: z.string().nullish(),
					surname: z.string().nullish(),
				})
				.loose(),
		])
		.nullish()
		.describe('The derived name: a string such as "John Doe" in live answers.'),
});

export type NameFromEmailResponse = z.infer<typeof NameFromEmailResponseSchema>;

// ── companies.logo ────────────────────────────────────────────────────────

export const RITEKIT_LOGO_BACKGROUNDS = ['remove', 'original', 'add'] as const;

const CompanyLogoInputSchema = z.object({
	domain: z.string().min(1).describe('The company site, such as evernote.com.'),
	generateFallbackLogo: z
		.boolean()
		.optional()
		.describe(
			"Generate a logo from the site's brand colors when no logo is found.",
		),
	squareLogoSize: z
		.number()
		.int()
		.min(1)
		.max(512)
		.optional()
		.describe('Pixels, 1 to 512.'),
	squareLogoBackground: z
		.enum(RITEKIT_LOGO_BACKGROUNDS)
		.optional()
		.describe('remove makes it transparent, add makes it solid.'),
});

export type CompanyLogoInput = z.infer<typeof CompanyLogoInputSchema>;

const LogoUrlSetSchema = z
	.object({
		svg: z.string().nullish(),
		png: z.string().nullish(),
	})
	.loose();

const CompanyLogoResponseSchema = EnvelopeSchema.extend({
	isGenerated: z
		.boolean()
		.nullish()
		.describe('True when no logo was found and one was generated.'),
	domain: z.string().nullish(),
	url: z.string().nullish().describe('The logo itself.'),
	permanentUrl: z
		.string()
		.nullish()
		.describe(
			'A stable URL that serves the image directly. Each view costs a credit.',
		),
	originalLogo: z
		.object({
			url: LogoUrlSetSchema.nullish(),
			permanentUrl: LogoUrlSetSchema.nullish(),
		})
		.loose()
		.nullish(),
	squareLogo: z
		.object({
			size: z.number().nullish(),
			background: z.string().nullish(),
			url: LogoUrlSetSchema.nullish(),
			permanentUrl: LogoUrlSetSchema.nullish(),
		})
		.loose()
		.nullish(),
	brandColors: z.array(HexColorSchema).nullish(),
});

export type CompanyLogoResponse = z.infer<typeof CompanyLogoResponseSchema>;

// ── companies.nameToDomain ────────────────────────────────────────────────

const CompanyNameInputSchema = z.object({
	name: z.string().min(1).describe('A company name or a domain.'),
});

export type CompanyNameInput = z.infer<typeof CompanyNameInputSchema>;

/**
 * The docs say this returns "an array of most probable domains"; live, they come
 * back under `data`, beside the name as RiteKit normalised it.
 */
const CompanyNameToDomainResponseSchema = EnvelopeSchema.extend({
	name: z.string().nullish().describe('The name as RiteKit read it.'),
	data: z
		.array(z.string())
		.nullish()
		.describe('The most probable domains, best first.'),
});

export type CompanyNameToDomainResponse = z.infer<
	typeof CompanyNameToDomainResponseSchema
>;

const CompanyBrandColorsResponseSchema = EnvelopeSchema.extend({
	name: z.string().nullish(),
	data: z
		.array(HexColorSchema)
		.nullish()
		.describe("The site's brand colors, most prominent first."),
});

export type CompanyBrandColorsResponse = z.infer<
	typeof CompanyBrandColorsResponseSchema
>;

// ── texts ─────────────────────────────────────────────────────────────────

const TextsExtractInputSchema = z.object({
	url: UrlSchema.describe('The article to read.'),
});

export type TextsExtractInput = z.infer<typeof TextsExtractInputSchema>;

const TextsExtractResponseSchema = z
	.object({
		result: z.boolean().nullish(),
		message: z.string().nullish(),
		url: z.string().nullish(),
		title: z.string().nullish(),
		text: z
			.string()
			.nullish()
			.describe('The article body, without headers, footers or columns.'),
	})
	.loose();

export type TextsExtractResponse = z.infer<typeof TextsExtractResponseSchema>;

const TextsPreviewInputSchema = z.object({
	url: UrlSchema.describe('The page to preview.'),
});

export type TextsPreviewInput = z.infer<typeof TextsPreviewInputSchema>;

const TextsPreviewResponseSchema = z
	.object({
		result: z.boolean().nullish(),
		message: z.string().nullish(),
		url: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		image: z.string().nullish(),
	})
	.loose();

export type TextsPreviewResponse = z.infer<typeof TextsPreviewResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RiteKitEndpointInputs = {
	hashtagsStats: HashtagsStatsInput;
	hashtagsAuto: HashtagsAutoInput;
	hashtagsSuggestions: HashtagsSuggestionsInput;
	hashtagsForUrl: HashtagsForUrlInput;
	hashtagsForImage: HashtagsForImageInput;
	hashtagsTrending: HashtagsTrendingInput;
	hashtagsCleanInstagram: HashtagsCleanInstagramInput;
	emojisSuggestions: EmojisSuggestionsInput;
	emojisAuto: EmojisAutoInput;
	imagesQuote: ImagesQuoteInput;
	imagesAnimate: ImagesAnimateInput;
	imagesExtractTopImage: ImagesExtractInput;
	linksListCtas: LinksListCtasInput;
	linksShorten: LinksShortenInput;
	personFreemail: FreemailInput;
	personDisposable: DisposableInput;
	personEmailTypo: EmailTypoInput;
	personNameFromEmail: NameFromEmailInput;
	companiesLogo: CompanyLogoInput;
	companiesNameToDomain: CompanyNameInput;
	companiesBrandColors: CompanyNameInput;
	textsExtractArticle: TextsExtractInput;
	textsLinkPreview: TextsPreviewInput;
};

export type RiteKitEndpointOutputs = {
	hashtagsStats: HashtagsStatsResponse;
	hashtagsAuto: HashtagsAutoResponse;
	hashtagsSuggestions: HashtagsSuggestionsResponse;
	hashtagsForUrl: HashtagsForUrlResponse;
	hashtagsForImage: HashtagsForImageResponse;
	hashtagsTrending: HashtagsTrendingResponse;
	hashtagsCleanInstagram: HashtagsCleanInstagramResponse;
	emojisSuggestions: EmojisSuggestionsResponse;
	emojisAuto: EmojisAutoResponse;
	imagesQuote: ImagesQuoteResponse;
	imagesAnimate: ImagesAnimateResponse;
	imagesExtractTopImage: ImagesExtractResponse;
	linksListCtas: LinksListCtasResponse;
	linksShorten: LinksShortenResponse;
	personFreemail: FreemailResponse;
	personDisposable: DisposableResponse;
	personEmailTypo: EmailTypoResponse;
	personNameFromEmail: NameFromEmailResponse;
	companiesLogo: CompanyLogoResponse;
	companiesNameToDomain: CompanyNameToDomainResponse;
	companiesBrandColors: CompanyBrandColorsResponse;
	textsExtractArticle: TextsExtractResponse;
	textsLinkPreview: TextsPreviewResponse;
};

export const RiteKitEndpointInputSchemas = {
	hashtagsStats: HashtagsStatsInputSchema,
	hashtagsAuto: HashtagsAutoInputSchema,
	hashtagsSuggestions: HashtagsSuggestionsInputSchema,
	hashtagsForUrl: HashtagsForUrlInputSchema,
	hashtagsForImage: HashtagsForImageInputSchema,
	hashtagsTrending: HashtagsTrendingInputSchema,
	hashtagsCleanInstagram: HashtagsCleanInstagramInputSchema,
	emojisSuggestions: EmojisSuggestionsInputSchema,
	emojisAuto: EmojisAutoInputSchema,
	imagesQuote: ImagesQuoteInputSchema,
	imagesAnimate: ImagesAnimateInputSchema,
	imagesExtractTopImage: ImagesExtractInputSchema,
	linksListCtas: LinksListCtasInputSchema,
	linksShorten: LinksShortenInputSchema,
	personFreemail: FreemailInputSchema,
	personDisposable: DisposableInputSchema,
	personEmailTypo: EmailTypoInputSchema,
	personNameFromEmail: NameFromEmailInputSchema,
	companiesLogo: CompanyLogoInputSchema,
	companiesNameToDomain: CompanyNameInputSchema,
	companiesBrandColors: CompanyNameInputSchema,
	textsExtractArticle: TextsExtractInputSchema,
	textsLinkPreview: TextsPreviewInputSchema,
} as const;

export const RiteKitEndpointOutputSchemas = {
	hashtagsStats: HashtagsStatsResponseSchema,
	hashtagsAuto: HashtagsAutoResponseSchema,
	hashtagsSuggestions: HashtagsSuggestionsResponseSchema,
	hashtagsForUrl: HashtagsForUrlResponseSchema,
	hashtagsForImage: HashtagsForImageResponseSchema,
	hashtagsTrending: HashtagsTrendingResponseSchema,
	hashtagsCleanInstagram: HashtagsCleanInstagramResponseSchema,
	emojisSuggestions: EmojisSuggestionsResponseSchema,
	emojisAuto: EmojisAutoResponseSchema,
	imagesQuote: ImagesQuoteResponseSchema,
	imagesAnimate: ImagesAnimateResponseSchema,
	imagesExtractTopImage: ImagesExtractResponseSchema,
	linksListCtas: LinksListCtasResponseSchema,
	linksShorten: LinksShortenResponseSchema,
	personFreemail: FreemailResponseSchema,
	personDisposable: DisposableResponseSchema,
	personEmailTypo: EmailTypoResponseSchema,
	personNameFromEmail: NameFromEmailResponseSchema,
	companiesLogo: CompanyLogoResponseSchema,
	companiesNameToDomain: CompanyNameToDomainResponseSchema,
	companiesBrandColors: CompanyBrandColorsResponseSchema,
	textsExtractArticle: TextsExtractResponseSchema,
	textsLinkPreview: TextsPreviewResponseSchema,
} as const;
