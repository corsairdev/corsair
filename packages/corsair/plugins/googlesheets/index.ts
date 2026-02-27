import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from '../../core';
import type { PickAuth } from '../../core/constants';
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
	sheetsAppendRow: GoogleSheetsEndpoint<'sheetsAppendRow'>;
	sheetsAppendOrUpdateRow: GoogleSheetsEndpoint<'sheetsAppendOrUpdateRow'>;
	sheetsGetRows: GoogleSheetsEndpoint<'sheetsGetRows'>;
	sheetsUpdateRow: GoogleSheetsEndpoint<'sheetsUpdateRow'>;
	sheetsClearSheet: GoogleSheetsEndpoint<'sheetsClearSheet'>;
	sheetsCreateSheet: GoogleSheetsEndpoint<'sheetsCreateSheet'>;
	sheetsDeleteSheet: GoogleSheetsEndpoint<'sheetsDeleteSheet'>;
	sheetsDeleteRowsOrColumns: GoogleSheetsEndpoint<'sheetsDeleteRowsOrColumns'>;
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
} satisfies RequiredPluginEndpointSchemas<typeof googleSheetsEndpointsNested>;

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
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleSheetsEndpointsNested,
		webhooks: googleSheetsWebhooksNested,
		endpointMeta: googleSheetsEndpointMeta,
		endpointSchemas: googlesheetsEndpointSchemas,
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
					throw new Error('No refresh token. Cannot get access token.');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('No client id or client secret');
				}

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

				return result.accessToken;
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
