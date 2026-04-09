import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import type {
	GoogleSheetsEndpointInputs,
	GoogleSheetsEndpointOutputs,
} from './endpoints';
import { SheetsEndpoints, SpreadsheetsEndpoints } from './endpoints';
import {
	GoogleSheetsEndpointInputSchemas,
	GoogleSheetsEndpointOutputSchemas,
} from './endpoints/types';
import { GoogleSheetsSchema } from './schema';
import type {
	GoogleSheetsWebhookOutputs,
	GoogleSheetsWebhookPayload,
	RangeUpdatedEvent,
} from './webhooks';
import { RowWebhooks } from './webhooks';
import {
	GoogleAppsScriptWebhookPayloadSchema,
	RangeUpdatedEventSchema,
} from './webhooks/types';

export type GoogleSheetsContext = CorsairPluginContext<
	typeof GoogleSheetsSchema,
	GoogleSheetsPluginOptions
>;

type GoogleSheetsEndpoint<K extends keyof GoogleSheetsEndpointOutputs> =
	CorsairEndpoint<
		GoogleSheetsContext,
		GoogleSheetsEndpointInputs[K],
		GoogleSheetsEndpointOutputs[K]
	>;

export type GoogleSheetsEndpoints = {
	spreadsheetsCreate: GoogleSheetsEndpoint<'spreadsheetsCreate'>;
	spreadsheetsDelete: GoogleSheetsEndpoint<'spreadsheetsDelete'>;
	spreadsheetsList: GoogleSheetsEndpoint<'spreadsheetsList'>;
	sheetsAppendRow: GoogleSheetsEndpoint<'sheetsAppendRow'>;
	sheetsAppendOrUpdateRow: GoogleSheetsEndpoint<'sheetsAppendOrUpdateRow'>;
	sheetsGetRows: GoogleSheetsEndpoint<'sheetsGetRows'>;
	sheetsUpdateRow: GoogleSheetsEndpoint<'sheetsUpdateRow'>;
	sheetsClearSheet: GoogleSheetsEndpoint<'sheetsClearSheet'>;
	sheetsCreateSheet: GoogleSheetsEndpoint<'sheetsCreateSheet'>;
	sheetsDeleteSheet: GoogleSheetsEndpoint<'sheetsDeleteSheet'>;
	sheetsDeleteRowsOrColumns: GoogleSheetsEndpoint<'sheetsDeleteRowsOrColumns'>;
	sheetsListSheetsInSpreadsheet: GoogleSheetsEndpoint<'sheetsListSheetsInSpreadsheet'>;
};

export type GoogleSheetsBoundEndpoints = BindEndpoints<
	typeof googleSheetsEndpointsNested
>;

type GoogleSheetsWebhook<
	K extends keyof GoogleSheetsWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleSheetsContext,
	GoogleSheetsWebhookPayload<TEvent>,
	GoogleSheetsWebhookOutputs[K]
>;

export type GoogleSheetsWebhooks = {
	rangeUpdated: GoogleSheetsWebhook<'rangeUpdated', RangeUpdatedEvent>;
};

export type GoogleSheetsBoundWebhooks = BindWebhooks<
	typeof googleSheetsWebhooksNested
>;

const googleSheetsEndpointsNested = {
	spreadsheets: {
		create: SpreadsheetsEndpoints.create,
		delete: SpreadsheetsEndpoints.delete,
		list: SpreadsheetsEndpoints.list,
	},
	sheets: {
		appendRow: SheetsEndpoints.appendRow,
		appendOrUpdateRow: SheetsEndpoints.appendOrUpdateRow,
		getRows: SheetsEndpoints.getRows,
		updateRow: SheetsEndpoints.updateRow,
		clearSheet: SheetsEndpoints.clearSheet,
		createSheet: SheetsEndpoints.createSheet,
		deleteSheet: SheetsEndpoints.deleteSheet,
		deleteRowsOrColumns: SheetsEndpoints.deleteRowsOrColumns,
		listSheetsInSpreadsheet: SheetsEndpoints.listSheetsInSpreadsheet,
	},
} as const;

export const googlesheetsEndpointSchemas = {
	'spreadsheets.create': {
		input: GoogleSheetsEndpointInputSchemas.spreadsheetsCreate,
		output: GoogleSheetsEndpointOutputSchemas.spreadsheetsCreate,
	},
	'spreadsheets.delete': {
		input: GoogleSheetsEndpointInputSchemas.spreadsheetsDelete,
		output: GoogleSheetsEndpointOutputSchemas.spreadsheetsDelete,
	},
	'spreadsheets.list': {
		input: GoogleSheetsEndpointInputSchemas.spreadsheetsList,
		output: GoogleSheetsEndpointOutputSchemas.spreadsheetsList,
	},
	'sheets.appendRow': {
		input: GoogleSheetsEndpointInputSchemas.sheetsAppendRow,
		output: GoogleSheetsEndpointOutputSchemas.sheetsAppendRow,
	},
	'sheets.appendOrUpdateRow': {
		input: GoogleSheetsEndpointInputSchemas.sheetsAppendOrUpdateRow,
		output: GoogleSheetsEndpointOutputSchemas.sheetsAppendOrUpdateRow,
	},
	'sheets.getRows': {
		input: GoogleSheetsEndpointInputSchemas.sheetsGetRows,
		output: GoogleSheetsEndpointOutputSchemas.sheetsGetRows,
	},
	'sheets.updateRow': {
		input: GoogleSheetsEndpointInputSchemas.sheetsUpdateRow,
		output: GoogleSheetsEndpointOutputSchemas.sheetsUpdateRow,
	},
	'sheets.clearSheet': {
		input: GoogleSheetsEndpointInputSchemas.sheetsClearSheet,
		output: GoogleSheetsEndpointOutputSchemas.sheetsClearSheet,
	},
	'sheets.createSheet': {
		input: GoogleSheetsEndpointInputSchemas.sheetsCreateSheet,
		output: GoogleSheetsEndpointOutputSchemas.sheetsCreateSheet,
	},
	'sheets.deleteSheet': {
		input: GoogleSheetsEndpointInputSchemas.sheetsDeleteSheet,
		output: GoogleSheetsEndpointOutputSchemas.sheetsDeleteSheet,
	},
	'sheets.deleteRowsOrColumns': {
		input: GoogleSheetsEndpointInputSchemas.sheetsDeleteRowsOrColumns,
		output: GoogleSheetsEndpointOutputSchemas.sheetsDeleteRowsOrColumns,
	},
	'sheets.listSheetsInSpreadsheet': {
		input: GoogleSheetsEndpointInputSchemas.sheetsListSheetsInSpreadsheet,
		output: GoogleSheetsEndpointOutputSchemas.sheetsListSheetsInSpreadsheet,
	},
} as const;

const googleSheetsWebhooksNested = {
	rangeUpdated: RowWebhooks.rangeUpdated,
} as const;

export type GoogleSheetsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleSheetsPlugin['hooks'];
	webhookHooks?: InternalGoogleSheetsPlugin['webhookHooks'];
	/**
	 * Permission configuration for the Google Sheets plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Google Sheets endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleSheetsEndpointsNested>;
};

export type GoogleSheetsKeyBuilderContext =
	KeyBuilderContext<GoogleSheetsPluginOptions>;

const googlesheetsWebhookSchemas = {
	rangeUpdated: {
		description: 'A range of cells in a Google Sheet was updated',
		payload: GoogleAppsScriptWebhookPayloadSchema,
		response: RangeUpdatedEventSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Google Sheets endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const googleSheetsEndpointMeta = {
	'spreadsheets.create': {
		riskLevel: 'write',
		description: 'Create a new spreadsheet',
	},
	'spreadsheets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a spreadsheet [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'spreadsheets.list': {
		riskLevel: 'read',
		description: 'List all spreadsheets in Google Drive',
	},
	'sheets.appendRow': {
		riskLevel: 'write',
		description: 'Append a new row to a sheet',
	},
	'sheets.appendOrUpdateRow': {
		riskLevel: 'write',
		description: 'Append a new row or update an existing one',
	},
	'sheets.getRows': {
		riskLevel: 'read',
		description: 'Read rows from a sheet',
	},
	'sheets.updateRow': {
		riskLevel: 'write',
		description: 'Update an existing row in a sheet',
	},
	'sheets.clearSheet': {
		riskLevel: 'destructive',
		description: 'Clear all data from a sheet [DESTRUCTIVE]',
	},
	'sheets.createSheet': {
		riskLevel: 'write',
		description: 'Add a new sheet tab to a spreadsheet',
	},
	'sheets.deleteSheet': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a sheet tab and all its data [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'sheets.deleteRowsOrColumns': {
		riskLevel: 'destructive',
		description: 'Delete rows or columns from a sheet [DESTRUCTIVE]',
	},
	'sheets.listSheetsInSpreadsheet': {
		riskLevel: 'read',
		description: 'List all sheet tabs in a spreadsheet',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleSheetsEndpointsNested>;

export type BaseGoogleSheetsPlugin<T extends GoogleSheetsPluginOptions> =
	CorsairPlugin<
		'googlesheets',
		typeof GoogleSheetsSchema,
		typeof googleSheetsEndpointsNested,
		typeof googleSheetsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleSheetsPlugin =
	BaseGoogleSheetsPlugin<GoogleSheetsPluginOptions>;

export type ExternalGoogleSheetsPlugin<T extends GoogleSheetsPluginOptions> =
	BaseGoogleSheetsPlugin<T>;

export function googlesheets<const T extends GoogleSheetsPluginOptions>(
	incomingOptions: GoogleSheetsPluginOptions &
		T = {} as GoogleSheetsPluginOptions & T,
): ExternalGoogleSheetsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlesheets',
		schema: GoogleSheetsSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets',
				'https://www.googleapis.com/auth/drive.readonly',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleSheetsEndpointsNested,
		webhooks: googleSheetsWebhooksNested,
		endpointMeta: googleSheetsEndpointMeta,
		endpointSchemas: googlesheetsEndpointSchemas,
		webhookSchemas: googlesheetsWebhookSchemas,
		keyBuilder: async (ctx: GoogleSheetsKeyBuilderContext) => {
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
					throw new Error(
						'[corsair:googlesheets] No refresh token. Cannot get access token.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:googlesheets] No client id or client secret',
					);
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
						`[corsair:googlesheets] Failed to get valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const body = request.body as RangeUpdatedEvent;
			if (!body) return false;
			const hasSpreadsheetId = typeof body?.spreadsheetId === 'string';
			const hasSheetsEventType = body?.eventType === 'rangeUpdated';
			return hasSpreadsheetId || hasSheetsEventType;
		},
	} satisfies InternalGoogleSheetsPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleAppsScriptWebhookPayload,
	GoogleSheetsEventName,
	GoogleSheetsWebhookEvent,
	GoogleSheetsWebhookOutputs,
	GoogleSheetsWebhookPayload,
	RangeUpdatedEvent,
} from './webhooks/types';
export { createGoogleSheetsWebhookMatcher } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleSheetsEndpointInputs,
	GoogleSheetsEndpointOutputs,
} from './endpoints/types';
