import type {
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	BatchEndpoints,
	ElementsEndpoints,
	PresentationsEndpoints,
	SlidesEndpoints,
	TextEndpoints,
} from './endpoints';
import type {
	GoogleSlidesEndpointInputs,
	GoogleSlidesEndpointOutputs,
} from './endpoints/types';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GoogleSlidesSchema } from './schema';

export type GoogleSlidesPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** A ready OAuth access token, useful for a short-lived smoke test. */
	key?: string;
	hooks?: InternalGoogleSlidesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleSlidesEndpointsNested>;
};

export type GoogleSlidesContext = CorsairPluginContext<
	typeof GoogleSlidesSchema,
	GoogleSlidesPluginOptions,
	undefined,
	typeof googleSlidesAuthConfig
>;

export type GoogleSlidesKeyBuilderContext = KeyBuilderContext<
	GoogleSlidesPluginOptions,
	typeof googleSlidesAuthConfig
>;

export type GoogleSlidesBoundEndpoints = BindEndpoints<
	typeof googleSlidesEndpointsNested
>;

type GoogleSlidesEndpoint<K extends keyof GoogleSlidesEndpointOutputs> =
	CorsairEndpoint<
		GoogleSlidesContext,
		GoogleSlidesEndpointInputs[K],
		GoogleSlidesEndpointOutputs[K]
	>;

export type GoogleSlidesEndpoints = {
	// presentations
	presentationsCreate: GoogleSlidesEndpoint<'presentationsCreate'>;
	presentationsGet: GoogleSlidesEndpoint<'presentationsGet'>;
	presentationsList: GoogleSlidesEndpoint<'presentationsList'>;
	presentationsCopy: GoogleSlidesEndpoint<'presentationsCopy'>;
	presentationsExport: GoogleSlidesEndpoint<'presentationsExport'>;
	presentationsDelete: GoogleSlidesEndpoint<'presentationsDelete'>;
	// slides
	slidesList: GoogleSlidesEndpoint<'slidesList'>;
	slidesGet: GoogleSlidesEndpoint<'slidesGet'>;
	slidesCreate: GoogleSlidesEndpoint<'slidesCreate'>;
	slidesDuplicate: GoogleSlidesEndpoint<'slidesDuplicate'>;
	slidesRemove: GoogleSlidesEndpoint<'slidesRemove'>;
	slidesMove: GoogleSlidesEndpoint<'slidesMove'>;
	slidesSetSkipped: GoogleSlidesEndpoint<'slidesSetSkipped'>;
	slidesThumbnail: GoogleSlidesEndpoint<'slidesThumbnail'>;
	slidesGetNotes: GoogleSlidesEndpoint<'slidesGetNotes'>;
	slidesSetNotes: GoogleSlidesEndpoint<'slidesSetNotes'>;
	// text
	textInsert: GoogleSlidesEndpoint<'textInsert'>;
	textReplaceAll: GoogleSlidesEndpoint<'textReplaceAll'>;
	textDelete: GoogleSlidesEndpoint<'textDelete'>;
	textUpdateStyle: GoogleSlidesEndpoint<'textUpdateStyle'>;
	textCreateBullets: GoogleSlidesEndpoint<'textCreateBullets'>;
	textRemoveBullets: GoogleSlidesEndpoint<'textRemoveBullets'>;
	// elements
	elementsCreateShape: GoogleSlidesEndpoint<'elementsCreateShape'>;
	elementsCreateImage: GoogleSlidesEndpoint<'elementsCreateImage'>;
	elementsCreateTable: GoogleSlidesEndpoint<'elementsCreateTable'>;
	elementsSetAltText: GoogleSlidesEndpoint<'elementsSetAltText'>;
	elementsUpdateTransform: GoogleSlidesEndpoint<'elementsUpdateTransform'>;
	elementsZOrder: GoogleSlidesEndpoint<'elementsZOrder'>;
	elementsGroup: GoogleSlidesEndpoint<'elementsGroup'>;
	elementsUngroup: GoogleSlidesEndpoint<'elementsUngroup'>;
	// batch
	batchUpdate: GoogleSlidesEndpoint<'batchUpdate'>;
};

const googleSlidesEndpointsNested = {
	presentations: PresentationsEndpoints,
	slides: SlidesEndpoints,
	text: TextEndpoints,
	elements: ElementsEndpoints,
	batch: BatchEndpoints,
} as const;

/**
 * Written out rather than derived from the tree: the docs generator looks these
 * paths up by key, and a derived key would read `presentationsExportPdf` while
 * the schema is named `presentationsExport`. The `satisfies` makes an endpoint
 * without schemas a compile error, so this cannot drift silently.
 */
export const googleSlidesEndpointSchemas = {
	'presentations.create': {
		input: GoogleSlidesEndpointInputSchemas.presentationsCreate,
		output: GoogleSlidesEndpointOutputSchemas.presentationsCreate,
	},
	'presentations.get': {
		input: GoogleSlidesEndpointInputSchemas.presentationsGet,
		output: GoogleSlidesEndpointOutputSchemas.presentationsGet,
	},
	'presentations.list': {
		input: GoogleSlidesEndpointInputSchemas.presentationsList,
		output: GoogleSlidesEndpointOutputSchemas.presentationsList,
	},
	'presentations.copy': {
		input: GoogleSlidesEndpointInputSchemas.presentationsCopy,
		output: GoogleSlidesEndpointOutputSchemas.presentationsCopy,
	},
	'presentations.exportPdf': {
		input: GoogleSlidesEndpointInputSchemas.presentationsExport,
		output: GoogleSlidesEndpointOutputSchemas.presentationsExport,
	},
	'presentations.delete': {
		input: GoogleSlidesEndpointInputSchemas.presentationsDelete,
		output: GoogleSlidesEndpointOutputSchemas.presentationsDelete,
	},
	'slides.list': {
		input: GoogleSlidesEndpointInputSchemas.slidesList,
		output: GoogleSlidesEndpointOutputSchemas.slidesList,
	},
	'slides.get': {
		input: GoogleSlidesEndpointInputSchemas.slidesGet,
		output: GoogleSlidesEndpointOutputSchemas.slidesGet,
	},
	'slides.create': {
		input: GoogleSlidesEndpointInputSchemas.slidesCreate,
		output: GoogleSlidesEndpointOutputSchemas.slidesCreate,
	},
	'slides.duplicate': {
		input: GoogleSlidesEndpointInputSchemas.slidesDuplicate,
		output: GoogleSlidesEndpointOutputSchemas.slidesDuplicate,
	},
	'slides.remove': {
		input: GoogleSlidesEndpointInputSchemas.slidesRemove,
		output: GoogleSlidesEndpointOutputSchemas.slidesRemove,
	},
	'slides.move': {
		input: GoogleSlidesEndpointInputSchemas.slidesMove,
		output: GoogleSlidesEndpointOutputSchemas.slidesMove,
	},
	'slides.setSkipped': {
		input: GoogleSlidesEndpointInputSchemas.slidesSetSkipped,
		output: GoogleSlidesEndpointOutputSchemas.slidesSetSkipped,
	},
	'slides.getThumbnail': {
		input: GoogleSlidesEndpointInputSchemas.slidesThumbnail,
		output: GoogleSlidesEndpointOutputSchemas.slidesThumbnail,
	},
	'slides.getNotes': {
		input: GoogleSlidesEndpointInputSchemas.slidesGetNotes,
		output: GoogleSlidesEndpointOutputSchemas.slidesGetNotes,
	},
	'slides.setNotes': {
		input: GoogleSlidesEndpointInputSchemas.slidesSetNotes,
		output: GoogleSlidesEndpointOutputSchemas.slidesSetNotes,
	},
	'text.insert': {
		input: GoogleSlidesEndpointInputSchemas.textInsert,
		output: GoogleSlidesEndpointOutputSchemas.textInsert,
	},
	'text.replaceAll': {
		input: GoogleSlidesEndpointInputSchemas.textReplaceAll,
		output: GoogleSlidesEndpointOutputSchemas.textReplaceAll,
	},
	'text.delete': {
		input: GoogleSlidesEndpointInputSchemas.textDelete,
		output: GoogleSlidesEndpointOutputSchemas.textDelete,
	},
	'text.updateStyle': {
		input: GoogleSlidesEndpointInputSchemas.textUpdateStyle,
		output: GoogleSlidesEndpointOutputSchemas.textUpdateStyle,
	},
	'text.createBullets': {
		input: GoogleSlidesEndpointInputSchemas.textCreateBullets,
		output: GoogleSlidesEndpointOutputSchemas.textCreateBullets,
	},
	'text.removeBullets': {
		input: GoogleSlidesEndpointInputSchemas.textRemoveBullets,
		output: GoogleSlidesEndpointOutputSchemas.textRemoveBullets,
	},
	'elements.createShape': {
		input: GoogleSlidesEndpointInputSchemas.elementsCreateShape,
		output: GoogleSlidesEndpointOutputSchemas.elementsCreateShape,
	},
	'elements.createImage': {
		input: GoogleSlidesEndpointInputSchemas.elementsCreateImage,
		output: GoogleSlidesEndpointOutputSchemas.elementsCreateImage,
	},
	'elements.createTable': {
		input: GoogleSlidesEndpointInputSchemas.elementsCreateTable,
		output: GoogleSlidesEndpointOutputSchemas.elementsCreateTable,
	},
	'elements.setAltText': {
		input: GoogleSlidesEndpointInputSchemas.elementsSetAltText,
		output: GoogleSlidesEndpointOutputSchemas.elementsSetAltText,
	},
	'elements.updateTransform': {
		input: GoogleSlidesEndpointInputSchemas.elementsUpdateTransform,
		output: GoogleSlidesEndpointOutputSchemas.elementsUpdateTransform,
	},
	'elements.zOrder': {
		input: GoogleSlidesEndpointInputSchemas.elementsZOrder,
		output: GoogleSlidesEndpointOutputSchemas.elementsZOrder,
	},
	'elements.group': {
		input: GoogleSlidesEndpointInputSchemas.elementsGroup,
		output: GoogleSlidesEndpointOutputSchemas.elementsGroup,
	},
	'elements.ungroup': {
		input: GoogleSlidesEndpointInputSchemas.elementsUngroup,
		output: GoogleSlidesEndpointOutputSchemas.elementsUngroup,
	},
	'batch.update': {
		input: GoogleSlidesEndpointInputSchemas.batchUpdate,
		output: GoogleSlidesEndpointOutputSchemas.batchUpdate,
	},
} satisfies RequiredPluginEndpointSchemas<typeof googleSlidesEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

/**
 * Google returns the deck on every read, and a write needs the slides scope,
 * so one scope set covers reads and writes. Drive is required for list, copy,
 * export and delete, which are Drive file calls rather than Slides calls.
 */
export const googleSlidesAuthConfig = {
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

const googleSlidesEndpointMeta = {
	'presentations.create': {
		riskLevel: 'write',
		description: 'Create a blank presentation',
	},
	'presentations.get': {
		riskLevel: 'read',
		description: 'Read a presentation with slide and layout counts',
	},
	'presentations.list': {
		riskLevel: 'read',
		description: 'List presentations in Drive, filtered and paged',
	},
	'presentations.copy': {
		riskLevel: 'write',
		description: 'Copy a presentation to a new file',
	},
	'presentations.exportPdf': {
		riskLevel: 'read',
		description: 'Export a presentation to PDF or PPTX as base64',
	},
	'presentations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a presentation from Drive [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'slides.list': {
		riskLevel: 'read',
		description: 'List the slides in a presentation, in order',
	},
	'slides.get': {
		riskLevel: 'read',
		description: 'Read one slide with its page elements',
	},
	'slides.create': {
		riskLevel: 'write',
		description: 'Add a slide from a predefined or named layout',
	},
	'slides.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a slide',
	},
	'slides.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a slide from a presentation [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'slides.move': {
		riskLevel: 'write',
		description: 'Move slides to a new position',
	},
	'slides.setSkipped': {
		riskLevel: 'write',
		description: 'Mark a slide skipped or unskipped in presentation mode',
	},
	'slides.getThumbnail': {
		riskLevel: 'read',
		description: 'Get a signed thumbnail URL for a slide, valid 30 minutes',
	},
	'slides.getNotes': {
		riskLevel: 'read',
		description: 'Read the speaker notes on a slide',
	},
	'slides.setNotes': {
		riskLevel: 'write',
		description: 'Replace the speaker notes on a slide',
	},
	'text.insert': {
		riskLevel: 'write',
		description: 'Insert text into a shape or table cell',
	},
	'text.replaceAll': {
		riskLevel: 'write',
		description: 'Find and replace text across slides, by string or regex',
	},
	'text.delete': {
		riskLevel: 'destructive',
		description: 'Delete a range of text from a shape or table cell',
	},
	'text.updateStyle': {
		riskLevel: 'write',
		description: 'Apply text styling such as bold, size or colour',
	},
	'text.createBullets': {
		riskLevel: 'write',
		description: 'Turn paragraphs into a bulleted or numbered list',
	},
	'text.removeBullets': {
		riskLevel: 'write',
		description: 'Remove list formatting from paragraphs',
	},
	'elements.createShape': {
		riskLevel: 'write',
		description: 'Add a shape or text box to a slide',
	},
	'elements.createImage': {
		riskLevel: 'write',
		description: 'Add an image to a slide from a public URL',
	},
	'elements.createTable': {
		riskLevel: 'write',
		description: 'Add an empty table to a slide',
	},
	'elements.setAltText': {
		riskLevel: 'write',
		description: 'Set the alt text on a page element',
	},
	'elements.updateTransform': {
		riskLevel: 'write',
		description: 'Move, scale or rotate a page element',
	},
	'elements.zOrder': {
		riskLevel: 'write',
		description: 'Change which elements sit in front of others',
	},
	'elements.group': {
		riskLevel: 'write',
		description: 'Group page elements into one object',
	},
	'elements.ungroup': {
		riskLevel: 'write',
		description: 'Ungroup previously grouped page elements',
	},
	'batch.update': {
		riskLevel: 'write',
		description:
			'Apply raw Slides batchUpdate requests atomically, for operations without a typed endpoint',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleSlidesEndpointsNested>;

export type BaseGoogleSlidesPlugin<T extends GoogleSlidesPluginOptions> =
	CorsairPlugin<
		'googleslides',
		typeof GoogleSlidesSchema,
		typeof googleSlidesEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof googleSlidesAuthConfig
	>;

export type InternalGoogleSlidesPlugin =
	BaseGoogleSlidesPlugin<GoogleSlidesPluginOptions>;

export type ExternalGoogleSlidesPlugin<T extends GoogleSlidesPluginOptions> =
	BaseGoogleSlidesPlugin<T>;

export function googleslides<const T extends GoogleSlidesPluginOptions>(
	incomingOptions: GoogleSlidesPluginOptions &
		T = {} as GoogleSlidesPluginOptions & T,
): ExternalGoogleSlidesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as GoogleSlidesPluginOptions & T;

	return {
		id: 'googleslides',
		authConfig: googleSlidesAuthConfig,
		schema: GoogleSlidesSchema,
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				// Batch edits and reads of presentation content.
				'https://www.googleapis.com/auth/presentations',
				// list, copy, export and delete are Drive file calls.
				'https://www.googleapis.com/auth/drive',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleSlidesEndpointsNested,
		// Google Slides sends no push notifications: Drive change feeds cover
		// file-level events only, and there is no slide-level delivery to verify.
		webhooks: {},
		endpointMeta: googleSlidesEndpointMeta,
		endpointSchemas: googleSlidesEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GoogleSlidesKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('googleslides', 'oauth_2');
			}
			if (options.key) return options.key;
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'googleslides',
					tokenUrl: 'https://oauth2.googleapis.com/token',
				});
			}
			throw new AuthMissingError('googleslides', 'oauth_2');
		},
	} satisfies InternalGoogleSlidesPlugin;
}

export type {
	GoogleSlidesEndpointInputs,
	GoogleSlidesEndpointOutputs,
} from './endpoints/types';
