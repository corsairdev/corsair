import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Companies,
	Emojis,
	Hashtags,
	Images,
	Links,
	Person,
	Texts,
} from './endpoints';
import type {
	RiteKitEndpointInputs,
	RiteKitEndpointOutputs,
} from './endpoints/types';
import {
	RiteKitEndpointInputSchemas,
	RiteKitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RiteKitSchema } from './schema';

export type RiteKitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRiteKitPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ritekitEndpointsNested>;
};

export type RiteKitContext = CorsairPluginContext<
	typeof RiteKitSchema,
	RiteKitPluginOptions
>;

export type RiteKitKeyBuilderContext = KeyBuilderContext<RiteKitPluginOptions>;

export type RiteKitBoundEndpoints = BindEndpoints<
	typeof ritekitEndpointsNested
>;

type RiteKitEndpoint<K extends keyof RiteKitEndpointOutputs> = CorsairEndpoint<
	RiteKitContext,
	RiteKitEndpointInputs[K],
	RiteKitEndpointOutputs[K]
>;

export type RiteKitEndpoints = {
	hashtagsStats: RiteKitEndpoint<'hashtagsStats'>;
	hashtagsAuto: RiteKitEndpoint<'hashtagsAuto'>;
	hashtagsSuggestions: RiteKitEndpoint<'hashtagsSuggestions'>;
	hashtagsForUrl: RiteKitEndpoint<'hashtagsForUrl'>;
	hashtagsForImage: RiteKitEndpoint<'hashtagsForImage'>;
	hashtagsTrending: RiteKitEndpoint<'hashtagsTrending'>;
	hashtagsCleanInstagram: RiteKitEndpoint<'hashtagsCleanInstagram'>;
	emojisSuggestions: RiteKitEndpoint<'emojisSuggestions'>;
	emojisAuto: RiteKitEndpoint<'emojisAuto'>;
	imagesQuote: RiteKitEndpoint<'imagesQuote'>;
	imagesAnimate: RiteKitEndpoint<'imagesAnimate'>;
	imagesExtractTopImage: RiteKitEndpoint<'imagesExtractTopImage'>;
	linksShorten: RiteKitEndpoint<'linksShorten'>;
	personFreemail: RiteKitEndpoint<'personFreemail'>;
	personDisposable: RiteKitEndpoint<'personDisposable'>;
	personEmailTypo: RiteKitEndpoint<'personEmailTypo'>;
	personNameFromEmail: RiteKitEndpoint<'personNameFromEmail'>;
	companiesLogo: RiteKitEndpoint<'companiesLogo'>;
	companiesNameToDomain: RiteKitEndpoint<'companiesNameToDomain'>;
	companiesBrandColors: RiteKitEndpoint<'companiesBrandColors'>;
	textsExtractArticle: RiteKitEndpoint<'textsExtractArticle'>;
	textsLinkPreview: RiteKitEndpoint<'textsLinkPreview'>;
};

const ritekitEndpointsNested = {
	hashtags: {
		stats: Hashtags.stats,
		auto: Hashtags.auto,
		suggestions: Hashtags.suggestions,
		forUrl: Hashtags.forUrl,
		forImage: Hashtags.forImage,
		trending: Hashtags.trending,
		cleanInstagram: Hashtags.cleanInstagram,
	},
	emojis: {
		suggestions: Emojis.suggestions,
		auto: Emojis.auto,
	},
	images: {
		quote: Images.quote,
		animate: Images.animate,
		extractTopImage: Images.extractTopImage,
	},
	links: {
		shorten: Links.shorten,
	},
	person: {
		freemail: Person.freemail,
		disposable: Person.disposable,
		emailTypo: Person.emailTypo,
		nameFromEmail: Person.nameFromEmail,
	},
	companies: {
		logo: Companies.logo,
		nameToDomain: Companies.nameToDomain,
		brandColors: Companies.brandColors,
	},
	texts: {
		extractArticle: Texts.extractArticle,
		linkPreview: Texts.linkPreview,
	},
} as const;

export const ritekitEndpointSchemas = {
	'hashtags.stats': {
		input: RiteKitEndpointInputSchemas.hashtagsStats,
		output: RiteKitEndpointOutputSchemas.hashtagsStats,
	},
	'hashtags.auto': {
		input: RiteKitEndpointInputSchemas.hashtagsAuto,
		output: RiteKitEndpointOutputSchemas.hashtagsAuto,
	},
	'hashtags.suggestions': {
		input: RiteKitEndpointInputSchemas.hashtagsSuggestions,
		output: RiteKitEndpointOutputSchemas.hashtagsSuggestions,
	},
	'hashtags.forUrl': {
		input: RiteKitEndpointInputSchemas.hashtagsForUrl,
		output: RiteKitEndpointOutputSchemas.hashtagsForUrl,
	},
	'hashtags.forImage': {
		input: RiteKitEndpointInputSchemas.hashtagsForImage,
		output: RiteKitEndpointOutputSchemas.hashtagsForImage,
	},
	'hashtags.trending': {
		input: RiteKitEndpointInputSchemas.hashtagsTrending,
		output: RiteKitEndpointOutputSchemas.hashtagsTrending,
	},
	'hashtags.cleanInstagram': {
		input: RiteKitEndpointInputSchemas.hashtagsCleanInstagram,
		output: RiteKitEndpointOutputSchemas.hashtagsCleanInstagram,
	},
	'emojis.suggestions': {
		input: RiteKitEndpointInputSchemas.emojisSuggestions,
		output: RiteKitEndpointOutputSchemas.emojisSuggestions,
	},
	'emojis.auto': {
		input: RiteKitEndpointInputSchemas.emojisAuto,
		output: RiteKitEndpointOutputSchemas.emojisAuto,
	},
	'images.quote': {
		input: RiteKitEndpointInputSchemas.imagesQuote,
		output: RiteKitEndpointOutputSchemas.imagesQuote,
	},
	'images.animate': {
		input: RiteKitEndpointInputSchemas.imagesAnimate,
		output: RiteKitEndpointOutputSchemas.imagesAnimate,
	},
	'images.extractTopImage': {
		input: RiteKitEndpointInputSchemas.imagesExtractTopImage,
		output: RiteKitEndpointOutputSchemas.imagesExtractTopImage,
	},
	'links.shorten': {
		input: RiteKitEndpointInputSchemas.linksShorten,
		output: RiteKitEndpointOutputSchemas.linksShorten,
	},
	'person.freemail': {
		input: RiteKitEndpointInputSchemas.personFreemail,
		output: RiteKitEndpointOutputSchemas.personFreemail,
	},
	'person.disposable': {
		input: RiteKitEndpointInputSchemas.personDisposable,
		output: RiteKitEndpointOutputSchemas.personDisposable,
	},
	'person.emailTypo': {
		input: RiteKitEndpointInputSchemas.personEmailTypo,
		output: RiteKitEndpointOutputSchemas.personEmailTypo,
	},
	'person.nameFromEmail': {
		input: RiteKitEndpointInputSchemas.personNameFromEmail,
		output: RiteKitEndpointOutputSchemas.personNameFromEmail,
	},
	'companies.logo': {
		input: RiteKitEndpointInputSchemas.companiesLogo,
		output: RiteKitEndpointOutputSchemas.companiesLogo,
	},
	'companies.nameToDomain': {
		input: RiteKitEndpointInputSchemas.companiesNameToDomain,
		output: RiteKitEndpointOutputSchemas.companiesNameToDomain,
	},
	'companies.brandColors': {
		input: RiteKitEndpointInputSchemas.companiesBrandColors,
		output: RiteKitEndpointOutputSchemas.companiesBrandColors,
	},
	'texts.extractArticle': {
		input: RiteKitEndpointInputSchemas.textsExtractArticle,
		output: RiteKitEndpointOutputSchemas.textsExtractArticle,
	},
	'texts.linkPreview': {
		input: RiteKitEndpointInputSchemas.textsLinkPreview,
		output: RiteKitEndpointOutputSchemas.textsLinkPreview,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ritekitEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const ritekitEndpointMeta = {
	'hashtags.stats': {
		riskLevel: 'read',
		description:
			'Read real-time stats for up to 100 hashtags: tweets per hour, exposure, retweets and the share carrying images, links and mentions',
	},
	'hashtags.auto': {
		riskLevel: 'read',
		description:
			'Return a post with hashtags added, either inside the sentence or appended',
	},
	'hashtags.suggestions': {
		riskLevel: 'read',
		description:
			'Suggest hashtags for a single word or a short block of text, ranked by semantic relevance and real-time popularity',
	},
	'hashtags.forUrl': {
		riskLevel: 'read',
		description: 'Suggest hashtags for the content of a URL',
	},
	'hashtags.forImage': {
		riskLevel: 'read',
		description:
			'Suggest hashtags for an image, from its content and its engagement',
	},
	'hashtags.trending': {
		riskLevel: 'read',
		description:
			'List hashtags currently trending, optionally only the ones worth using and only Latin-alphabet tags',
	},
	'hashtags.cleanInstagram': {
		riskLevel: 'read',
		description:
			'Remove the hashtags Instagram has banned from a post and report which were dropped',
	},
	'emojis.suggestions': {
		riskLevel: 'read',
		description: 'Suggest emoji for a short block of text',
	},
	'emojis.auto': {
		riskLevel: 'read',
		description: 'Return a block of text with emoji added',
	},
	'images.quote': {
		riskLevel: 'read',
		description:
			'Render a quote as an image with chosen fonts, colors, gradient and an optional logo, returning its URL',
	},
	'images.animate': {
		riskLevel: 'read',
		description: 'Turn a still image into an animated GIF and return its URL',
	},
	'images.extractTopImage': {
		riskLevel: 'read',
		description: "Return a page's lead image URL",
	},
	'links.shorten': {
		riskLevel: 'write',
		description:
			'Create a rite.ly short link, optionally with a Link Ad attached, and report the plan balance',
	},
	'person.freemail': {
		riskLevel: 'read',
		description:
			'Report whether an address is on a consumer email provider rather than a company domain',
	},
	'person.disposable': {
		riskLevel: 'read',
		description:
			'Report whether an address belongs to a disposable email service',
	},
	'person.emailTypo': {
		riskLevel: 'read',
		description:
			'Suggest likely corrections for an address whose domain looks mistyped',
	},
	'person.nameFromEmail': {
		riskLevel: 'read',
		description: "Derive a person's given name and surname from their address",
	},
	'companies.logo': {
		riskLevel: 'read',
		description:
			"Return a company's logo from its domain, with square and original variants, brand colors and a stable URL",
	},
	'companies.nameToDomain': {
		riskLevel: 'read',
		description:
			'Return the most probable domains for a company name, best first',
	},
	'companies.brandColors': {
		riskLevel: 'read',
		description: "Return a company's brand colors from its domain or name",
	},
	'texts.extractArticle': {
		riskLevel: 'read',
		description:
			"Extract an article's title and body from a URL, dropping headers, footers and columns",
	},
	'texts.linkPreview': {
		riskLevel: 'read',
		description: 'Return the title, description and image for a URL preview',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ritekitEndpointsNested>;

export type BaseRiteKitPlugin<T extends RiteKitPluginOptions> = CorsairPlugin<
	'ritekit',
	typeof RiteKitSchema,
	typeof ritekitEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRiteKitPlugin = BaseRiteKitPlugin<RiteKitPluginOptions>;

export type ExternalRiteKitPlugin<T extends RiteKitPluginOptions> =
	BaseRiteKitPlugin<T>;

export function ritekit<const T extends RiteKitPluginOptions>(
	incomingOptions: RiteKitPluginOptions & T = {} as RiteKitPluginOptions & T,
): ExternalRiteKitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ritekit',
		schema: RiteKitSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ritekitEndpointsNested,
		webhooks: {},
		endpointMeta: ritekitEndpointMeta,
		endpointSchemas: ritekitEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RiteKitKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ritekit', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRiteKitPlugin;
}

export { RiteKitAPIError } from './client';

export type {
	CompanyBrandColorsResponse,
	CompanyLogoInput,
	CompanyLogoResponse,
	CompanyNameInput,
	CompanyNameToDomainResponse,
	DisposableInput,
	DisposableResponse,
	EmailTypoInput,
	EmailTypoResponse,
	EmojisAutoInput,
	EmojisAutoResponse,
	EmojisSuggestionsInput,
	EmojisSuggestionsResponse,
	FreemailInput,
	FreemailResponse,
	HashtagsAutoInput,
	HashtagsAutoResponse,
	HashtagsCleanInstagramInput,
	HashtagsCleanInstagramResponse,
	HashtagsForImageInput,
	HashtagsForImageResponse,
	HashtagsForUrlInput,
	HashtagsForUrlResponse,
	HashtagsStatsInput,
	HashtagsStatsResponse,
	HashtagsSuggestionsInput,
	HashtagsSuggestionsResponse,
	HashtagsTrendingInput,
	HashtagsTrendingResponse,
	ImagesAnimateInput,
	ImagesAnimateResponse,
	ImagesExtractInput,
	ImagesExtractResponse,
	ImagesQuoteInput,
	ImagesQuoteResponse,
	LinksShortenInput,
	LinksShortenResponse,
	NameFromEmailInput,
	NameFromEmailResponse,
	RiteKitEndpointInputs,
	RiteKitEndpointOutputs,
	RiteKitHashtagStats,
	TextsExtractInput,
	TextsExtractResponse,
	TextsPreviewInput,
	TextsPreviewResponse,
} from './endpoints/types';
