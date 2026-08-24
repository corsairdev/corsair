import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	AudioBibles,
	AudioBooks,
	AudioChapters,
	Bibles,
	Books,
	Chapters,
	Passages,
	Search,
	Sections,
	Verses,
} from './endpoints';
import type {
	ApiBibleEndpointInputs,
	ApiBibleEndpointOutputs,
} from './endpoints/types';
import {
	ApiBibleEndpointInputSchemas,
	ApiBibleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApiBibleSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type ApiBiblePluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalApiBiblePlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the API.Bible plugin.
	 * All endpoints are read-only, so the default mode is effectively 'open'.
	 */
	permissions?: PluginPermissionsConfig<typeof apiBibleEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type ApiBibleContext = CorsairPluginContext<
	typeof ApiBibleSchema,
	ApiBiblePluginOptions
>;

export type ApiBibleKeyBuilderContext =
	KeyBuilderContext<ApiBiblePluginOptions>;

export type ApiBibleBoundEndpoints = BindEndpoints<
	typeof apiBibleEndpointsNested
>;

type ApiBibleEndpoint<K extends keyof ApiBibleEndpointOutputs> =
	CorsairEndpoint<
		ApiBibleContext,
		ApiBibleEndpointInputs[K],
		ApiBibleEndpointOutputs[K]
	>;

export type ApiBibleEndpoints = {
	biblesList: ApiBibleEndpoint<'biblesList'>;
	biblesGet: ApiBibleEndpoint<'biblesGet'>;
	booksList: ApiBibleEndpoint<'booksList'>;
	booksGet: ApiBibleEndpoint<'booksGet'>;
	chaptersList: ApiBibleEndpoint<'chaptersList'>;
	chaptersGet: ApiBibleEndpoint<'chaptersGet'>;
	chaptersListSections: ApiBibleEndpoint<'chaptersListSections'>;
	versesList: ApiBibleEndpoint<'versesList'>;
	versesGet: ApiBibleEndpoint<'versesGet'>;
	passagesGet: ApiBibleEndpoint<'passagesGet'>;
	sectionsList: ApiBibleEndpoint<'sectionsList'>;
	sectionsGet: ApiBibleEndpoint<'sectionsGet'>;
	searchQuery: ApiBibleEndpoint<'searchQuery'>;
	audioBiblesList: ApiBibleEndpoint<'audioBiblesList'>;
	audioBiblesGet: ApiBibleEndpoint<'audioBiblesGet'>;
	audioBooksList: ApiBibleEndpoint<'audioBooksList'>;
	audioBooksGet: ApiBibleEndpoint<'audioBooksGet'>;
	audioChaptersList: ApiBibleEndpoint<'audioChaptersList'>;
	audioChaptersGet: ApiBibleEndpoint<'audioChaptersGet'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const apiBibleEndpointsNested = {
	bibles: {
		list: Bibles.list,
		get: Bibles.get,
	},
	books: {
		list: Books.list,
		get: Books.get,
	},
	chapters: {
		list: Chapters.list,
		get: Chapters.get,
		listSections: Chapters.listSections,
	},
	verses: {
		list: Verses.list,
		get: Verses.get,
	},
	passages: {
		get: Passages.get,
	},
	sections: {
		list: Sections.list,
		get: Sections.get,
	},
	search: {
		query: Search.query,
	},
	audioBibles: {
		list: AudioBibles.list,
		get: AudioBibles.get,
	},
	audioBooks: {
		list: AudioBooks.list,
		get: AudioBooks.get,
	},
	audioChapters: {
		list: AudioChapters.list,
		get: AudioChapters.get,
	},
} as const;

// No webhooks — API.Bible is a pull-based API
const apiBibleWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const apiBibleEndpointSchemas = {
	'bibles.list': {
		input: ApiBibleEndpointInputSchemas.biblesList,
		output: ApiBibleEndpointOutputSchemas.biblesList,
	},
	'bibles.get': {
		input: ApiBibleEndpointInputSchemas.biblesGet,
		output: ApiBibleEndpointOutputSchemas.biblesGet,
	},
	'books.list': {
		input: ApiBibleEndpointInputSchemas.booksList,
		output: ApiBibleEndpointOutputSchemas.booksList,
	},
	'books.get': {
		input: ApiBibleEndpointInputSchemas.booksGet,
		output: ApiBibleEndpointOutputSchemas.booksGet,
	},
	'chapters.list': {
		input: ApiBibleEndpointInputSchemas.chaptersList,
		output: ApiBibleEndpointOutputSchemas.chaptersList,
	},
	'chapters.get': {
		input: ApiBibleEndpointInputSchemas.chaptersGet,
		output: ApiBibleEndpointOutputSchemas.chaptersGet,
	},
	'chapters.listSections': {
		input: ApiBibleEndpointInputSchemas.chaptersListSections,
		output: ApiBibleEndpointOutputSchemas.chaptersListSections,
	},
	'verses.list': {
		input: ApiBibleEndpointInputSchemas.versesList,
		output: ApiBibleEndpointOutputSchemas.versesList,
	},
	'verses.get': {
		input: ApiBibleEndpointInputSchemas.versesGet,
		output: ApiBibleEndpointOutputSchemas.versesGet,
	},
	'passages.get': {
		input: ApiBibleEndpointInputSchemas.passagesGet,
		output: ApiBibleEndpointOutputSchemas.passagesGet,
	},
	'sections.list': {
		input: ApiBibleEndpointInputSchemas.sectionsList,
		output: ApiBibleEndpointOutputSchemas.sectionsList,
	},
	'sections.get': {
		input: ApiBibleEndpointInputSchemas.sectionsGet,
		output: ApiBibleEndpointOutputSchemas.sectionsGet,
	},
	'search.query': {
		input: ApiBibleEndpointInputSchemas.searchQuery,
		output: ApiBibleEndpointOutputSchemas.searchQuery,
	},
	'audioBibles.list': {
		input: ApiBibleEndpointInputSchemas.audioBiblesList,
		output: ApiBibleEndpointOutputSchemas.audioBiblesList,
	},
	'audioBibles.get': {
		input: ApiBibleEndpointInputSchemas.audioBiblesGet,
		output: ApiBibleEndpointOutputSchemas.audioBiblesGet,
	},
	'audioBooks.list': {
		input: ApiBibleEndpointInputSchemas.audioBooksList,
		output: ApiBibleEndpointOutputSchemas.audioBooksList,
	},
	'audioBooks.get': {
		input: ApiBibleEndpointInputSchemas.audioBooksGet,
		output: ApiBibleEndpointOutputSchemas.audioBooksGet,
	},
	'audioChapters.list': {
		input: ApiBibleEndpointInputSchemas.audioChaptersList,
		output: ApiBibleEndpointOutputSchemas.audioChaptersList,
	},
	'audioChapters.get': {
		input: ApiBibleEndpointInputSchemas.audioChaptersGet,
		output: ApiBibleEndpointOutputSchemas.audioChaptersGet,
	},
} satisfies RequiredPluginEndpointSchemas<typeof apiBibleEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Risk-level metadata for each API.Bible endpoint.
 * All endpoints are read-only — they only fetch scripture content.
 */
const apiBibleEndpointMeta = {
	'bibles.list': {
		riskLevel: 'read',
		description: 'List supported Bible versions',
	},
	'bibles.get': {
		riskLevel: 'read',
		description: 'Get details for a specific Bible version',
	},
	'books.list': {
		riskLevel: 'read',
		description: 'List all books of a Bible version',
	},
	'books.get': {
		riskLevel: 'read',
		description: 'Get a specific book of a Bible version',
	},
	'chapters.list': {
		riskLevel: 'read',
		description: 'List all chapters of a book',
	},
	'chapters.get': {
		riskLevel: 'read',
		description: 'Get a chapter with its text content',
	},
	'chapters.listSections': {
		riskLevel: 'read',
		description: 'List sections (usfm headings) within a chapter',
	},
	'verses.list': {
		riskLevel: 'read',
		description: 'List all verses of a chapter',
	},
	'verses.get': {
		riskLevel: 'read',
		description: 'Get a single verse with its text content',
	},
	'passages.get': {
		riskLevel: 'read',
		description:
			'Get one or more verses of scripture text by passage reference',
	},
	'sections.list': {
		riskLevel: 'read',
		description: 'List sections (usfm headings) of a book',
	},
	'sections.get': {
		riskLevel: 'read',
		description: 'Get a section with its text content',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Search for verses within a Bible version',
	},
	'audioBibles.list': {
		riskLevel: 'read',
		description: 'List audio Bible versions',
	},
	'audioBibles.get': {
		riskLevel: 'read',
		description: 'Get a specific audio Bible version',
	},
	'audioBooks.list': {
		riskLevel: 'read',
		description: 'List all books of an audio Bible',
	},
	'audioBooks.get': {
		riskLevel: 'read',
		description: 'Get a specific book of an audio Bible',
	},
	'audioChapters.list': {
		riskLevel: 'read',
		description: 'List all chapters of an audio book',
	},
	'audioChapters.get': {
		riskLevel: 'read',
		description: 'Get an audio chapter (includes an mp3 resource URL)',
	},
} satisfies RequiredPluginEndpointMeta<typeof apiBibleEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const apiBibleAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseApiBiblePlugin<T extends ApiBiblePluginOptions> = CorsairPlugin<
	'apibible',
	typeof ApiBibleSchema,
	typeof apiBibleEndpointsNested,
	typeof apiBibleWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApiBiblePlugin = BaseApiBiblePlugin<ApiBiblePluginOptions>;

export type ExternalApiBiblePlugin<T extends ApiBiblePluginOptions> =
	BaseApiBiblePlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function apibible<const T extends ApiBiblePluginOptions>(
	incomingOptions: ApiBiblePluginOptions &
		// Safe: T extends ApiBiblePluginOptions, so an empty object is a valid no-op default
		// when no options are passed. TypeScript requires the cast because it cannot verify T = {}.
		T = {} as ApiBiblePluginOptions & T,
): ExternalApiBiblePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apibible',
		authConfig: apiBibleAuthConfig,
		schema: ApiBibleSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: apiBibleEndpointsNested,
		webhooks: apiBibleWebhooksNested,
		endpointMeta: apiBibleEndpointMeta,
		endpointSchemas: apiBibleEndpointSchemas,
		// No webhooks — API.Bible is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApiBibleKeyBuilderContext, source) => {
			const authType = ctx.authType;

			// Direct key from options takes priority
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Retrieve from key manager (absent when no DB-backed account keys)
			if (source === 'endpoint' && authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				// Missing manager or stored key → Corsair auth path (connect link), not TypeError.
				if (!res) {
					throw new AuthMissingError('apibible', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('apibible', 'api_key');
		},
	} satisfies InternalApiBiblePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export * from './endpoints/types';
