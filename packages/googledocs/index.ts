import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getValidAccessToken } from './client';
import {
	DocumentsEndpoints,
	StructureEndpoints,
	TablesEndpoints,
	TextEndpoints,
} from './endpoints';
import type {
	GoogleDocsEndpointInputs,
	GoogleDocsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleDocsEndpointInputSchemas,
	GoogleDocsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleDocsSchema } from './schema';
import { ChangeWebhooks } from './webhooks';
import { matchGoogleDocsTenantWebhook } from './webhooks/tenant-matcher';
import type {
	GoogleDocsEventName,
	GoogleDocsWebhookOutputs,
	GoogleDocsWebhookPayload,
	PubSubNotification,
} from './webhooks/types';
import {
	DocsChangedEventSchema,
	decodePubSubMessage,
	PubSubNotificationSchema,
} from './webhooks/types';

export type GoogleDocsContext = CorsairPluginContext<
	typeof GoogleDocsSchema,
	GoogleDocsPluginOptions
>;

type GoogleDocsEndpoint<K extends keyof GoogleDocsEndpointInputs> =
	CorsairEndpoint<
		GoogleDocsContext,
		GoogleDocsEndpointInputs[K],
		GoogleDocsEndpointOutputs[K]
	>;

export type GoogleDocsEndpoints = {
	[K in keyof GoogleDocsEndpointInputs]: GoogleDocsEndpoint<K>;
};

export type GoogleDocsBoundEndpoints = BindEndpoints<
	typeof googleDocsEndpointsNested
>;

type GoogleDocsWebhook<K extends keyof GoogleDocsWebhookOutputs> =
	CorsairWebhook<
		GoogleDocsContext,
		GoogleDocsWebhookPayload,
		GoogleDocsWebhookOutputs[K]
	>;

export type GoogleDocsWebhooks = {
	docChanged: GoogleDocsWebhook<'docChanged'>;
};

export type GoogleDocsBoundWebhooks = BindWebhooks<
	typeof googleDocsWebhooksNested
>;

const googleDocsEndpointsNested = {
	documents: DocumentsEndpoints,
	text: TextEndpoints,
	structure: StructureEndpoints,
	tables: TablesEndpoints,
} as const;

const googleDocsWebhooksNested = {
	docChanged: ChangeWebhooks.docChanged,
} as const;

export type GoogleDocsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleDocsPlugin['hooks'];
	webhookHooks?: InternalGoogleDocsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/** Restrict which of the 10 triggers fire. Undefined = all enabled. */
	webhookEvents?: GoogleDocsEventName[];
	/** Parameters for the content-based triggers. */
	triggers?: {
		keyword?: string;
		wordCountThreshold?: number;
		countBy?: 'words' | 'characters';
		placeholder?: string;
		searchQuery?: string;
	};
	/**
	 * Permission configuration. Overrides use dot-notation paths from the
	 * endpoint tree; invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleDocsEndpointsNested>;
};

export type GoogleDocsKeyBuilderContext =
	KeyBuilderContext<GoogleDocsPluginOptions>;

// Programmatic build keeps the 35 schema entries in lockstep with the nested
// endpoint tree (group.name), so a new endpoint can't drift out of sync.
export const googledocsEndpointSchemas = Object.fromEntries(
	(
		Object.entries(googleDocsEndpointsNested) as [
			string,
			Record<string, unknown>,
		][]
	).flatMap(([group, endpoints]) =>
		Object.keys(endpoints).map((name) => [
			`${group}.${name}`,
			{
				input:
					GoogleDocsEndpointInputSchemas[
						name as keyof typeof GoogleDocsEndpointInputSchemas
					],
				output:
					GoogleDocsEndpointOutputSchemas[
						name as keyof typeof GoogleDocsEndpointOutputSchemas
					],
			},
		]),
	),
);

const googledocsWebhookSchemas = {
	docChanged: {
		description:
			'A Google Doc was created, updated, deleted, or matched a content trigger',
		payload: PubSubNotificationSchema,
		response: DocsChangedEventSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

const googledocsEndpointMeta = {
	'documents.createDocument': {
		riskLevel: 'write',
		description: 'Create a Google Doc with an optional title and initial text',
	},
	'documents.createBlankDocument': {
		riskLevel: 'write',
		description:
			'Create a blank Google Doc [DEPRECATED: prefer documents.createDocument]',
	},
	'documents.createDocumentMarkdown': {
		riskLevel: 'write',
		description: 'Create a Google Doc initialized from Markdown text',
	},
	'documents.copyDocument': {
		riskLevel: 'write',
		description: 'Copy an existing Google Doc',
	},
	'documents.getDocument': {
		riskLevel: 'read',
		description: 'Retrieve a Google Doc by id',
	},
	'documents.getDocumentPlaintext': {
		riskLevel: 'read',
		description: 'Retrieve a Google Doc as best-effort plain text',
	},
	'documents.updateDocumentMarkdown': {
		riskLevel: 'write',
		description: 'Replace a Google Doc content with Markdown text',
	},
	'documents.updateDocumentSectionMarkdown': {
		riskLevel: 'write',
		description: 'Replace a section of a Google Doc with Markdown text',
	},
	'documents.updateDocumentStyle': {
		riskLevel: 'write',
		description: 'Update the page size, margins, and global document style',
	},
	'documents.updateExistingDocument': {
		riskLevel: 'write',
		description:
			'Apply batchUpdate edits (insert/delete/format) to a Google Doc',
	},
	'documents.updateDocumentBatch': {
		riskLevel: 'write',
		description:
			'Apply batchUpdate edits [DEPRECATED: prefer documents.updateExistingDocument]',
	},
	'documents.exportDocumentAsPdf': {
		riskLevel: 'read',
		description: 'Export a Google Doc as PDF (Drive enforces a 10MB limit)',
	},
	'documents.searchDocuments': {
		riskLevel: 'read',
		description: 'Search Google Docs by name, content, or date filters',
	},
	'documents.listSpreadsheetCharts': {
		riskLevel: 'read',
		description: 'List charts in a Google Sheets spreadsheet for embedding',
	},
	'text.insertText': {
		riskLevel: 'write',
		description:
			'Insert text at a location or append to the end of a Google Doc',
	},
	'text.replaceAllText': {
		riskLevel: 'write',
		description: 'Replace all occurrences of a string in a Google Doc',
	},
	'text.deleteContentRange': {
		riskLevel: 'destructive',
		description: 'Delete a content range from a Google Doc',
	},
	'text.insertInlineImage': {
		riskLevel: 'write',
		description: 'Insert an inline image from a URI into a Google Doc',
	},
	'text.replaceImage': {
		riskLevel: 'write',
		description: 'Replace an existing image in a Google Doc',
	},
	'text.insertPageBreak': {
		riskLevel: 'write',
		description: 'Start a new page at a location in a Google Doc',
	},
	'structure.createHeader': {
		riskLevel: 'write',
		description: 'Create a header',
	},
	'structure.createFooter': {
		riskLevel: 'write',
		description: 'Create a footer',
	},
	'structure.createFootnote': {
		riskLevel: 'write',
		description: 'Create a footnote',
	},
	'structure.createNamedRange': {
		riskLevel: 'write',
		description: 'Create a named range',
	},
	'structure.createParagraphBullets': {
		riskLevel: 'write',
		description: 'Add bullets to a range of paragraphs',
	},
	'structure.deleteParagraphBullets': {
		riskLevel: 'write',
		description: 'Remove bullets from a range of paragraphs',
	},
	'structure.deleteHeader': {
		riskLevel: 'destructive',
		description: 'Delete a header',
	},
	'structure.deleteFooter': {
		riskLevel: 'destructive',
		description: 'Delete a footer',
	},
	'structure.deleteNamedRange': {
		riskLevel: 'destructive',
		description: 'Delete a named range by id or name',
	},
	'tables.insertTable': {
		riskLevel: 'write',
		description: 'Insert a table into a Google Doc',
	},
	'tables.insertTableColumn': {
		riskLevel: 'write',
		description: 'Insert a column into a table',
	},
	'tables.deleteTableColumn': {
		riskLevel: 'destructive',
		description: 'Delete a column from a table',
	},
	'tables.deleteTableRow': {
		riskLevel: 'destructive',
		description: 'Delete a row from a table',
	},
	'tables.unmergeTableCells': {
		riskLevel: 'write',
		description: 'Unmerge previously merged table cells',
	},
	'tables.updateTableRowStyle': {
		riskLevel: 'write',
		description: 'Update the style of table rows',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleDocsEndpointsNested>;

export const googledocsAuthConfig = {
	oauth_2: {
		account: ['channel_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleDocsPlugin<T extends GoogleDocsPluginOptions> =
	CorsairPlugin<
		'googledocs',
		typeof GoogleDocsSchema,
		typeof googleDocsEndpointsNested,
		typeof googleDocsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleDocsPlugin =
	BaseGoogleDocsPlugin<GoogleDocsPluginOptions>;

export type ExternalGoogleDocsPlugin<T extends GoogleDocsPluginOptions> =
	BaseGoogleDocsPlugin<T>;

export function googledocs<const T extends GoogleDocsPluginOptions>(
	incomingOptions: GoogleDocsPluginOptions & T = {} as GoogleDocsPluginOptions &
		T,
): ExternalGoogleDocsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googledocs',
		authConfig: googledocsAuthConfig,
		schema: GoogleDocsSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/documents',
				'https://www.googleapis.com/auth/drive',
				// listSpreadsheetCharts reads via the Sheets API, which does not
				// accept Docs/Drive scopes; without this every call 403s.
				'https://www.googleapis.com/auth/spreadsheets.readonly',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleDocsEndpointsNested,
		webhooks: googleDocsWebhooksNested,
		endpointMeta: googledocsEndpointMeta,
		endpointSchemas: googledocsEndpointSchemas,
		webhookSchemas: googledocsWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleDocsKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new AuthMissingError('googledocs', 'oauth_2');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('[corsair:googledocs] No client id or client secret');
				}

				try {
					const result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});

					if (result.refreshed) {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
					}
					// _refreshAuth is read by makeAuthenticatedGoogleRequest on a 401; it is not
					// on the typed CorsairPluginContext, so the closure is attached ad hoc here.
					(ctx as Record<string, unknown>)._refreshAuth = async () => {
						const freshResult = await getValidAccessToken({
							accessToken: null,
							expiresAt: null,
							refreshToken,
							clientId: res.client_id!,
							clientSecret: res.client_secret!,
							forceRefresh: true,
						});
						await ctx.keys.set_access_token(freshResult.accessToken);
						await ctx.keys.set_expires_at(String(freshResult.expiresAt));
						return freshResult.accessToken;
					};

					return result.accessToken;
				} catch (error) {
					throw new Error(
						`[corsair:googledocs] Failed to get valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			throw new AuthMissingError('googledocs', 'oauth_2');
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const isFromGoogle =
				headers.from === 'noreply@google.com' ||
				(typeof headers['user-agent'] === 'string' &&
					headers['user-agent'].includes('APIs-Google'));

			if (!isFromGoogle) return false;

			// Docs rides the same Drive changes feed as googledrive, so a bare
			// "resourceUri contains drive" check would claim googledrive's pushes
			// too. The CLI prefixes Docs watch channel ids with "googledocs-";
			// require that prefix (from the header on direct pushes, or the
			// decoded channel id on Pub/Sub-wrapped ones) to claim the delivery.
			const isDocsChannel = (channelId: unknown) =>
				typeof channelId === 'string' && channelId.startsWith('googledocs-');

			if (isDocsChannel(headers['x-goog-channel-id'])) return true;

			const body = request.body as PubSubNotification;
			if (!body?.message?.data) return false;

			try {
				const decoded = decodePubSubMessage(body.message.data);
				return (
					!!decoded.resourceUri &&
					decoded.resourceUri.includes('drive') &&
					isDocsChannel(decoded.id)
				);
			} catch {
				return false;
			}
		},
		pluginTenantWebhookMatcher: matchGoogleDocsTenantWebhook,
	} satisfies InternalGoogleDocsPlugin;
}

export type {
	GoogleDocsEndpointInputs,
	GoogleDocsEndpointOutputs,
} from './endpoints/types';

export type {
	DocsChangedEvent,
	GoogleDocsEventName,
	GoogleDocsWebhookOutputs,
	GoogleDocsWebhookPayload,
	PubSubMessage,
	PubSubNotification,
} from './webhooks/types';
