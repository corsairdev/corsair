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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import {
	Charts,
	Comments,
	Files,
	Functions,
	Names,
	Ranges,
	Sessions,
	Tables,
	Worksheets,
} from './endpoints';
import type {
	ExcelEndpointInputs,
	ExcelEndpointOutputs,
} from './endpoints/types';
import {
	ExcelEndpointInputSchemas,
	ExcelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ExcelSchema } from './schema';

const MICROSOFT_TOKEN_URL =
	'https://login.microsoftonline.com/common/oauth2/v2.0/token';

export type ExcelPluginOptions = {
	authType?: PickAuth<'oauth_2' | 'managed'>;
	key?: string;
	hooks?: InternalExcelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof excelEndpointsNested>;
};

export type ExcelContext = CorsairPluginContext<
	typeof ExcelSchema,
	ExcelPluginOptions
>;

export type ExcelKeyBuilderContext = KeyBuilderContext<ExcelPluginOptions>;

export type ExcelBoundEndpoints = BindEndpoints<typeof excelEndpointsNested>;

type ExcelEndpoint<K extends keyof ExcelEndpointOutputs> = CorsairEndpoint<
	ExcelContext,
	ExcelEndpointInputs[K],
	ExcelEndpointOutputs[K]
>;

export type ExcelEndpoints = {
	sessionsCreate: ExcelEndpoint<'sessionsCreate'>;
	sessionsClose: ExcelEndpoint<'sessionsClose'>;
	sessionsRefresh: ExcelEndpoint<'sessionsRefresh'>;
	worksheetsList: ExcelEndpoint<'worksheetsList'>;
	worksheetsGet: ExcelEndpoint<'worksheetsGet'>;
	worksheetsAdd: ExcelEndpoint<'worksheetsAdd'>;
	worksheetsUpdate: ExcelEndpoint<'worksheetsUpdate'>;
	worksheetsDelete: ExcelEndpoint<'worksheetsDelete'>;
	rangesGet: ExcelEndpoint<'rangesGet'>;
	rangesUsed: ExcelEndpoint<'rangesUsed'>;
	rangesUpdate: ExcelEndpoint<'rangesUpdate'>;
	rangesClear: ExcelEndpoint<'rangesClear'>;
	tablesList: ExcelEndpoint<'tablesList'>;
	tablesGet: ExcelEndpoint<'tablesGet'>;
	tablesAdd: ExcelEndpoint<'tablesAdd'>;
	tablesUpdate: ExcelEndpoint<'tablesUpdate'>;
	tablesDelete: ExcelEndpoint<'tablesDelete'>;
	tablesListRows: ExcelEndpoint<'tablesListRows'>;
	tablesAddRows: ExcelEndpoint<'tablesAddRows'>;
	tablesDeleteRow: ExcelEndpoint<'tablesDeleteRow'>;
	tablesListColumns: ExcelEndpoint<'tablesListColumns'>;
	tablesAddColumn: ExcelEndpoint<'tablesAddColumn'>;
	tablesDeleteColumn: ExcelEndpoint<'tablesDeleteColumn'>;
	functionsCalculate: ExcelEndpoint<'functionsCalculate'>;
	filesCreate: ExcelEndpoint<'filesCreate'>;
	filesFind: ExcelEndpoint<'filesFind'>;
	chartsList: ExcelEndpoint<'chartsList'>;
	chartsGet: ExcelEndpoint<'chartsGet'>;
	chartsAdd: ExcelEndpoint<'chartsAdd'>;
	chartsUpdate: ExcelEndpoint<'chartsUpdate'>;
	chartsDelete: ExcelEndpoint<'chartsDelete'>;
	chartsSetData: ExcelEndpoint<'chartsSetData'>;
	namesList: ExcelEndpoint<'namesList'>;
	namesGet: ExcelEndpoint<'namesGet'>;
	namesAdd: ExcelEndpoint<'namesAdd'>;
	namesUpdate: ExcelEndpoint<'namesUpdate'>;
	namesRange: ExcelEndpoint<'namesRange'>;
	commentsList: ExcelEndpoint<'commentsList'>;
	commentsGet: ExcelEndpoint<'commentsGet'>;
	commentsListReplies: ExcelEndpoint<'commentsListReplies'>;
	commentsReply: ExcelEndpoint<'commentsReply'>;
};

const excelEndpointsNested = {
	sessions: {
		create: Sessions.create,
		close: Sessions.close,
		refresh: Sessions.refresh,
	},
	worksheets: {
		list: Worksheets.list,
		get: Worksheets.get,
		add: Worksheets.add,
		update: Worksheets.update,
		delete: Worksheets.delete,
	},
	ranges: {
		get: Ranges.get,
		usedRange: Ranges.usedRange,
		update: Ranges.update,
		clear: Ranges.clear,
	},
	tables: {
		list: Tables.list,
		get: Tables.get,
		add: Tables.add,
		update: Tables.update,
		delete: Tables.delete,
		listRows: Tables.listRows,
		addRows: Tables.addRows,
		deleteRow: Tables.deleteRow,
		listColumns: Tables.listColumns,
		addColumn: Tables.addColumn,
		deleteColumn: Tables.deleteColumn,
	},
	charts: {
		list: Charts.list,
		get: Charts.get,
		add: Charts.add,
		update: Charts.update,
		delete: Charts.delete,
		setData: Charts.setData,
	},
	names: {
		list: Names.list,
		get: Names.get,
		add: Names.add,
		update: Names.update,
		range: Names.range,
	},
	comments: {
		list: Comments.list,
		get: Comments.get,
		listReplies: Comments.listReplies,
		reply: Comments.reply,
	},
	functions: {
		calculate: Functions.calculate,
	},
	files: {
		create: Files.create,
		find: Files.find,
	},
} as const;

export const excelEndpointSchemas = {
	'sessions.create': {
		input: ExcelEndpointInputSchemas.sessionsCreate,
		output: ExcelEndpointOutputSchemas.sessionsCreate,
	},
	'sessions.close': {
		input: ExcelEndpointInputSchemas.sessionsClose,
		output: ExcelEndpointOutputSchemas.sessionsClose,
	},
	'sessions.refresh': {
		input: ExcelEndpointInputSchemas.sessionsRefresh,
		output: ExcelEndpointOutputSchemas.sessionsRefresh,
	},
	'worksheets.list': {
		input: ExcelEndpointInputSchemas.worksheetsList,
		output: ExcelEndpointOutputSchemas.worksheetsList,
	},
	'worksheets.get': {
		input: ExcelEndpointInputSchemas.worksheetsGet,
		output: ExcelEndpointOutputSchemas.worksheetsGet,
	},
	'worksheets.add': {
		input: ExcelEndpointInputSchemas.worksheetsAdd,
		output: ExcelEndpointOutputSchemas.worksheetsAdd,
	},
	'worksheets.update': {
		input: ExcelEndpointInputSchemas.worksheetsUpdate,
		output: ExcelEndpointOutputSchemas.worksheetsUpdate,
	},
	'worksheets.delete': {
		input: ExcelEndpointInputSchemas.worksheetsDelete,
		output: ExcelEndpointOutputSchemas.worksheetsDelete,
	},
	'ranges.get': {
		input: ExcelEndpointInputSchemas.rangesGet,
		output: ExcelEndpointOutputSchemas.rangesGet,
	},
	'ranges.usedRange': {
		input: ExcelEndpointInputSchemas.rangesUsed,
		output: ExcelEndpointOutputSchemas.rangesUsed,
	},
	'ranges.update': {
		input: ExcelEndpointInputSchemas.rangesUpdate,
		output: ExcelEndpointOutputSchemas.rangesUpdate,
	},
	'ranges.clear': {
		input: ExcelEndpointInputSchemas.rangesClear,
		output: ExcelEndpointOutputSchemas.rangesClear,
	},
	'tables.list': {
		input: ExcelEndpointInputSchemas.tablesList,
		output: ExcelEndpointOutputSchemas.tablesList,
	},
	'tables.get': {
		input: ExcelEndpointInputSchemas.tablesGet,
		output: ExcelEndpointOutputSchemas.tablesGet,
	},
	'tables.add': {
		input: ExcelEndpointInputSchemas.tablesAdd,
		output: ExcelEndpointOutputSchemas.tablesAdd,
	},
	'tables.update': {
		input: ExcelEndpointInputSchemas.tablesUpdate,
		output: ExcelEndpointOutputSchemas.tablesUpdate,
	},
	'tables.delete': {
		input: ExcelEndpointInputSchemas.tablesDelete,
		output: ExcelEndpointOutputSchemas.tablesDelete,
	},
	'tables.listRows': {
		input: ExcelEndpointInputSchemas.tablesListRows,
		output: ExcelEndpointOutputSchemas.tablesListRows,
	},
	'tables.addRows': {
		input: ExcelEndpointInputSchemas.tablesAddRows,
		output: ExcelEndpointOutputSchemas.tablesAddRows,
	},
	'tables.deleteRow': {
		input: ExcelEndpointInputSchemas.tablesDeleteRow,
		output: ExcelEndpointOutputSchemas.tablesDeleteRow,
	},
	'tables.listColumns': {
		input: ExcelEndpointInputSchemas.tablesListColumns,
		output: ExcelEndpointOutputSchemas.tablesListColumns,
	},
	'tables.addColumn': {
		input: ExcelEndpointInputSchemas.tablesAddColumn,
		output: ExcelEndpointOutputSchemas.tablesAddColumn,
	},
	'tables.deleteColumn': {
		input: ExcelEndpointInputSchemas.tablesDeleteColumn,
		output: ExcelEndpointOutputSchemas.tablesDeleteColumn,
	},
	'functions.calculate': {
		input: ExcelEndpointInputSchemas.functionsCalculate,
		output: ExcelEndpointOutputSchemas.functionsCalculate,
	},
	'files.create': {
		input: ExcelEndpointInputSchemas.filesCreate,
		output: ExcelEndpointOutputSchemas.filesCreate,
	},
	'files.find': {
		input: ExcelEndpointInputSchemas.filesFind,
		output: ExcelEndpointOutputSchemas.filesFind,
	},
	'charts.list': {
		input: ExcelEndpointInputSchemas.chartsList,
		output: ExcelEndpointOutputSchemas.chartsList,
	},
	'charts.get': {
		input: ExcelEndpointInputSchemas.chartsGet,
		output: ExcelEndpointOutputSchemas.chartsGet,
	},
	'charts.add': {
		input: ExcelEndpointInputSchemas.chartsAdd,
		output: ExcelEndpointOutputSchemas.chartsAdd,
	},
	'charts.update': {
		input: ExcelEndpointInputSchemas.chartsUpdate,
		output: ExcelEndpointOutputSchemas.chartsUpdate,
	},
	'charts.delete': {
		input: ExcelEndpointInputSchemas.chartsDelete,
		output: ExcelEndpointOutputSchemas.chartsDelete,
	},
	'charts.setData': {
		input: ExcelEndpointInputSchemas.chartsSetData,
		output: ExcelEndpointOutputSchemas.chartsSetData,
	},
	'names.list': {
		input: ExcelEndpointInputSchemas.namesList,
		output: ExcelEndpointOutputSchemas.namesList,
	},
	'names.get': {
		input: ExcelEndpointInputSchemas.namesGet,
		output: ExcelEndpointOutputSchemas.namesGet,
	},
	'names.add': {
		input: ExcelEndpointInputSchemas.namesAdd,
		output: ExcelEndpointOutputSchemas.namesAdd,
	},
	'names.update': {
		input: ExcelEndpointInputSchemas.namesUpdate,
		output: ExcelEndpointOutputSchemas.namesUpdate,
	},
	'names.range': {
		input: ExcelEndpointInputSchemas.namesRange,
		output: ExcelEndpointOutputSchemas.namesRange,
	},
	'comments.list': {
		input: ExcelEndpointInputSchemas.commentsList,
		output: ExcelEndpointOutputSchemas.commentsList,
	},
	'comments.get': {
		input: ExcelEndpointInputSchemas.commentsGet,
		output: ExcelEndpointOutputSchemas.commentsGet,
	},
	'comments.listReplies': {
		input: ExcelEndpointInputSchemas.commentsListReplies,
		output: ExcelEndpointOutputSchemas.commentsListReplies,
	},
	'comments.reply': {
		input: ExcelEndpointInputSchemas.commentsReply,
		output: ExcelEndpointOutputSchemas.commentsReply,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof excelEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const excelEndpointMeta = {
	'sessions.create': {
		riskLevel: 'write',
		description: 'Open a persistent or temporary Excel workbook session',
	},
	'sessions.close': {
		riskLevel: 'write',
		description: 'Close an Excel workbook session',
	},
	'sessions.refresh': {
		riskLevel: 'write',
		description: 'Keep an Excel workbook session alive',
	},
	'worksheets.list': {
		riskLevel: 'read',
		description: 'List worksheets in a workbook',
	},
	'worksheets.get': {
		riskLevel: 'read',
		description: 'Get one worksheet by name or id',
	},
	'worksheets.add': {
		riskLevel: 'write',
		description: 'Add a worksheet',
	},
	'worksheets.update': {
		riskLevel: 'write',
		description: 'Rename a worksheet or change its position',
	},
	'worksheets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a worksheet',
	},
	'ranges.get': {
		riskLevel: 'read',
		description: 'Read a cell range',
	},
	'ranges.usedRange': {
		riskLevel: 'read',
		description: 'Read the used range of a worksheet',
	},
	'ranges.update': {
		riskLevel: 'write',
		description: 'Write values, formulas, or number formats into a range',
	},
	'ranges.clear': {
		riskLevel: 'write',
		description: 'Clear values or formatting in a range',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List tables in a workbook or worksheet',
	},
	'tables.get': {
		riskLevel: 'read',
		description: 'Get one table by name or id',
	},
	'tables.add': {
		riskLevel: 'write',
		description: 'Create a table from a range',
	},
	'tables.update': {
		riskLevel: 'write',
		description: 'Rename a table or change its header, total, or style',
	},
	'tables.delete': {
		riskLevel: 'destructive',
		description: 'Delete a table',
	},
	'tables.listRows': {
		riskLevel: 'read',
		description: 'List rows in a table',
	},
	'tables.addRows': {
		riskLevel: 'write',
		description: 'Insert one or more rows into a table',
	},
	'tables.deleteRow': {
		riskLevel: 'destructive',
		description: 'Delete a table row by index',
	},
	'tables.listColumns': {
		riskLevel: 'read',
		description: 'List columns in a table',
	},
	'tables.addColumn': {
		riskLevel: 'write',
		description: 'Insert a column into a table',
	},
	'tables.deleteColumn': {
		riskLevel: 'destructive',
		description: 'Delete a table column',
	},
	'functions.calculate': {
		riskLevel: 'read',
		description: 'Run an Excel worksheet function such as SUM or VLOOKUP',
	},
	'files.create': {
		riskLevel: 'write',
		description: 'Upload a blank .xlsx workbook to OneDrive or SharePoint',
	},
	'files.find': {
		riskLevel: 'read',
		description: 'Search OneDrive or SharePoint for .xlsx files',
	},
	'charts.list': {
		riskLevel: 'read',
		description: 'List charts on a worksheet',
	},
	'charts.get': {
		riskLevel: 'read',
		description: 'Get one chart by name or id',
	},
	'charts.add': {
		riskLevel: 'write',
		description: 'Add a chart from a cell range',
	},
	'charts.update': {
		riskLevel: 'write',
		description: 'Rename a chart or move and resize it',
	},
	'charts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a chart',
	},
	'charts.setData': {
		riskLevel: 'write',
		description: 'Point a chart at a different cell range',
	},
	'names.list': {
		riskLevel: 'read',
		description: 'List named ranges in a workbook or worksheet',
	},
	'names.get': {
		riskLevel: 'read',
		description: 'Get one named range',
	},
	'names.add': {
		riskLevel: 'write',
		description: 'Define a named range',
	},
	'names.update': {
		riskLevel: 'write',
		description: 'Change a named range comment or visibility',
	},
	'names.range': {
		riskLevel: 'read',
		description: 'Read the cells a named range points at',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments in a workbook',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get one comment',
	},
	'comments.listReplies': {
		riskLevel: 'read',
		description: 'List replies on a comment',
	},
	'comments.reply': {
		riskLevel: 'write',
		description: 'Reply to a comment',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof excelEndpointsNested>;

export const excelAuthConfig = {
	oauth_2: {},
	managed: {},
} as const satisfies PluginAuthConfig;

export type BaseExcelPlugin<T extends ExcelPluginOptions> = CorsairPlugin<
	'excel',
	typeof ExcelSchema,
	typeof excelEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalExcelPlugin = BaseExcelPlugin<ExcelPluginOptions>;

export type ExternalExcelPlugin<T extends ExcelPluginOptions> =
	BaseExcelPlugin<T>;

export function excel<const T extends ExcelPluginOptions>(
	// T is chosen by the caller, so the empty default has no value of
	// type ExcelPluginOptions & T without this assertion.
	incomingOptions: ExcelPluginOptions & T = {} as ExcelPluginOptions & T,
): ExternalExcelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'excel',
		authConfig: excelAuthConfig,
		schema: ExcelSchema,
		options,
		oauthConfig: {
			providerName: 'Microsoft',
			authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
			tokenUrl: MICROSOFT_TOKEN_URL,
			scopes: ['offline_access', 'User.Read', 'Files.ReadWrite'],
		},
		hooks: options.hooks,
		endpoints: excelEndpointsNested,
		webhooks: {},
		endpointMeta: excelEndpointMeta,
		endpointSchemas: excelEndpointSchemas,
		errorHandlers: {
			...(({ DEFAULT: _builtInDefault, ...rest }) => rest)(errorHandlers),
			...(({ DEFAULT: _customDefault, ...rest }) => rest)(
				options.errorHandlers ?? {},
			),
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: ExcelKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'excel',
					tokenUrl: MICROSOFT_TOKEN_URL,
				});
			}
			if (source === 'endpoint' && ctx.authType === 'managed') {
				if (!ctx.hub) {
					throw new Error(
						'[auth-missing:excel:managed]: Hub config is required for managed auth. Pass hub: { ... } to createCorsair().',
					);
				}
				const managedContext = {
					keys: ctx.keys,
					hub: ctx.hub,
					plugin: 'excel',
					tenantId: ctx.tenantId,
				};
				const result = await getManagedAccessToken(managedContext);
				await attachManagedRefreshAuth(ctx, managedContext);
				return result.accessToken;
			}
			throw new AuthMissingError('excel', 'oauth_2');
		},
	} satisfies InternalExcelPlugin;
}

export { EXCEL_API_BASE, ExcelAPIError } from './client';
export type {
	DriveItemOutput,
	FilesCreateInput,
	FunctionResultOutput,
	FunctionsCalculateInput,
	RangeOutput,
	RangesClearInput,
	RangesGetInput,
	RangesUpdateInput,
	RangesUsedInput,
	SessionOutput,
	SessionsCloseInput,
	SessionsCreateInput,
	SessionsRefreshInput,
	TableColumnOutput,
	TableListOutput,
	TableOutput,
	TableRowOutput,
	TablesAddColumnInput,
	TablesAddInput,
	TablesAddRowsInput,
	TablesDeleteColumnInput,
	TablesDeleteInput,
	TablesDeleteRowInput,
	TablesGetInput,
	TablesListInput,
	TablesUpdateInput,
	WorksheetListOutput,
	WorksheetOutput,
	WorksheetsAddInput,
	WorksheetsDeleteInput,
	WorksheetsGetInput,
	WorksheetsListInput,
	WorksheetsUpdateInput,
} from './endpoints/types';
