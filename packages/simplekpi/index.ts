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
	BreakdownItems,
	CategoryKpis,
	KpiCategories,
	KpiEntries,
	Kpis,
	KpiUnits,
	Lookups,
	Reports,
	Users,
} from './endpoints';
import type {
	SimplekpiEndpointInputs,
	SimplekpiEndpointOutputs,
} from './endpoints/types';
import {
	SimplekpiEndpointInputSchemas,
	SimplekpiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SimplekpiSchema } from './schema';

export type SimplekpiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSimplekpiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simplekpiEndpointsNested>;
};

export type SimplekpiContext = CorsairPluginContext<
	typeof SimplekpiSchema,
	SimplekpiPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SimplekpiEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SimplekpiKeyBuilderContext =
	KeyBuilderContext<SimplekpiPluginOptions>;

export type SimplekpiBoundEndpoints = BindEndpoints<
	typeof simplekpiEndpointsNested
>;

type SimplekpiEndpoint<K extends keyof SimplekpiEndpointOutputs> =
	CorsairEndpoint<
		SimplekpiContext,
		SimplekpiEndpointInputs[K],
		SimplekpiEndpointOutputs[K]
	>;

export type SimplekpiEndpoints = {
	kpisList: SimplekpiEndpoint<'kpisList'>;
	kpisCreate: SimplekpiEndpoint<'kpisCreate'>;
	kpisGet: SimplekpiEndpoint<'kpisGet'>;
	kpisUpdate: SimplekpiEndpoint<'kpisUpdate'>;
	kpisDelete: SimplekpiEndpoint<'kpisDelete'>;
	kpiCategoriesList: SimplekpiEndpoint<'kpiCategoriesList'>;
	kpiCategoriesCreate: SimplekpiEndpoint<'kpiCategoriesCreate'>;
	kpiCategoriesGet: SimplekpiEndpoint<'kpiCategoriesGet'>;
	kpiCategoriesUpdate: SimplekpiEndpoint<'kpiCategoriesUpdate'>;
	kpiCategoriesDelete: SimplekpiEndpoint<'kpiCategoriesDelete'>;
	categoryKpisList: SimplekpiEndpoint<'categoryKpisList'>;
	categoryKpisCreate: SimplekpiEndpoint<'categoryKpisCreate'>;
	categoryKpisGet: SimplekpiEndpoint<'categoryKpisGet'>;
	categoryKpisUpdate: SimplekpiEndpoint<'categoryKpisUpdate'>;
	categoryKpisDelete: SimplekpiEndpoint<'categoryKpisDelete'>;
	breakdownItemsList: SimplekpiEndpoint<'breakdownItemsList'>;
	breakdownItemsCreate: SimplekpiEndpoint<'breakdownItemsCreate'>;
	breakdownItemsGet: SimplekpiEndpoint<'breakdownItemsGet'>;
	breakdownItemsUpdate: SimplekpiEndpoint<'breakdownItemsUpdate'>;
	breakdownItemsDelete: SimplekpiEndpoint<'breakdownItemsDelete'>;
	kpiEntriesList: SimplekpiEndpoint<'kpiEntriesList'>;
	kpiEntriesCreate: SimplekpiEndpoint<'kpiEntriesCreate'>;
	kpiEntriesGet: SimplekpiEndpoint<'kpiEntriesGet'>;
	kpiEntriesUpdate: SimplekpiEndpoint<'kpiEntriesUpdate'>;
	kpiEntriesDelete: SimplekpiEndpoint<'kpiEntriesDelete'>;
	kpiEntriesCreateBatch: SimplekpiEndpoint<'kpiEntriesCreateBatch'>;
	kpiFrequenciesList: SimplekpiEndpoint<'kpiFrequenciesList'>;
	kpiFrequenciesGet: SimplekpiEndpoint<'kpiFrequenciesGet'>;
	kpiIconsList: SimplekpiEndpoint<'kpiIconsList'>;
	kpiIconsGet: SimplekpiEndpoint<'kpiIconsGet'>;
	kpiUnitsList: SimplekpiEndpoint<'kpiUnitsList'>;
	kpiUnitsCreate: SimplekpiEndpoint<'kpiUnitsCreate'>;
	kpiUnitsGet: SimplekpiEndpoint<'kpiUnitsGet'>;
	kpiUnitsUpdate: SimplekpiEndpoint<'kpiUnitsUpdate'>;
	kpiUnitsDelete: SimplekpiEndpoint<'kpiUnitsDelete'>;
	reportsAllDataEntries: SimplekpiEndpoint<'reportsAllDataEntries'>;
	usersList: SimplekpiEndpoint<'usersList'>;
	usersGet: SimplekpiEndpoint<'usersGet'>;
};

const simplekpiEndpointsNested = {
	kpis: {
		list: Kpis.list,
		create: Kpis.create,
		get: Kpis.get,
		update: Kpis.update,
		delete: Kpis.remove,
	},
	kpiCategories: {
		list: KpiCategories.list,
		create: KpiCategories.create,
		get: KpiCategories.get,
		update: KpiCategories.update,
		delete: KpiCategories.remove,
		kpis: {
			list: CategoryKpis.list,
			create: CategoryKpis.create,
			get: CategoryKpis.get,
			update: CategoryKpis.update,
			delete: CategoryKpis.remove,
		},
	},
	breakdownItems: {
		list: BreakdownItems.list,
		create: BreakdownItems.create,
		get: BreakdownItems.get,
		update: BreakdownItems.update,
		delete: BreakdownItems.remove,
	},
	kpiEntries: {
		list: KpiEntries.list,
		create: KpiEntries.create,
		get: KpiEntries.get,
		update: KpiEntries.update,
		delete: KpiEntries.remove,
		createBatch: KpiEntries.createBatch,
	},
	kpiFrequencies: {
		list: Lookups.frequenciesList,
		get: Lookups.frequenciesGet,
	},
	kpiIcons: {
		list: Lookups.iconsList,
		get: Lookups.iconsGet,
	},
	kpiUnits: {
		list: KpiUnits.list,
		create: KpiUnits.create,
		get: KpiUnits.get,
		update: KpiUnits.update,
		delete: KpiUnits.remove,
	},
	reports: {
		allDataEntries: Reports.allDataEntries,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
} as const;

export const simplekpiEndpointSchemas = {
	'kpis.list': {
		input: SimplekpiEndpointInputSchemas.kpisList,
		output: SimplekpiEndpointOutputSchemas.kpisList,
	},
	'kpis.create': {
		input: SimplekpiEndpointInputSchemas.kpisCreate,
		output: SimplekpiEndpointOutputSchemas.kpisCreate,
	},
	'kpis.get': {
		input: SimplekpiEndpointInputSchemas.kpisGet,
		output: SimplekpiEndpointOutputSchemas.kpisGet,
	},
	'kpis.update': {
		input: SimplekpiEndpointInputSchemas.kpisUpdate,
		output: SimplekpiEndpointOutputSchemas.kpisUpdate,
	},
	'kpis.delete': {
		input: SimplekpiEndpointInputSchemas.kpisDelete,
		output: SimplekpiEndpointOutputSchemas.kpisDelete,
	},
	'kpiCategories.list': {
		input: SimplekpiEndpointInputSchemas.kpiCategoriesList,
		output: SimplekpiEndpointOutputSchemas.kpiCategoriesList,
	},
	'kpiCategories.create': {
		input: SimplekpiEndpointInputSchemas.kpiCategoriesCreate,
		output: SimplekpiEndpointOutputSchemas.kpiCategoriesCreate,
	},
	'kpiCategories.get': {
		input: SimplekpiEndpointInputSchemas.kpiCategoriesGet,
		output: SimplekpiEndpointOutputSchemas.kpiCategoriesGet,
	},
	'kpiCategories.update': {
		input: SimplekpiEndpointInputSchemas.kpiCategoriesUpdate,
		output: SimplekpiEndpointOutputSchemas.kpiCategoriesUpdate,
	},
	'kpiCategories.delete': {
		input: SimplekpiEndpointInputSchemas.kpiCategoriesDelete,
		output: SimplekpiEndpointOutputSchemas.kpiCategoriesDelete,
	},
	'kpiCategories.kpis.list': {
		input: SimplekpiEndpointInputSchemas.categoryKpisList,
		output: SimplekpiEndpointOutputSchemas.categoryKpisList,
	},
	'kpiCategories.kpis.create': {
		input: SimplekpiEndpointInputSchemas.categoryKpisCreate,
		output: SimplekpiEndpointOutputSchemas.categoryKpisCreate,
	},
	'kpiCategories.kpis.get': {
		input: SimplekpiEndpointInputSchemas.categoryKpisGet,
		output: SimplekpiEndpointOutputSchemas.categoryKpisGet,
	},
	'kpiCategories.kpis.update': {
		input: SimplekpiEndpointInputSchemas.categoryKpisUpdate,
		output: SimplekpiEndpointOutputSchemas.categoryKpisUpdate,
	},
	'kpiCategories.kpis.delete': {
		input: SimplekpiEndpointInputSchemas.categoryKpisDelete,
		output: SimplekpiEndpointOutputSchemas.categoryKpisDelete,
	},
	'breakdownItems.list': {
		input: SimplekpiEndpointInputSchemas.breakdownItemsList,
		output: SimplekpiEndpointOutputSchemas.breakdownItemsList,
	},
	'breakdownItems.create': {
		input: SimplekpiEndpointInputSchemas.breakdownItemsCreate,
		output: SimplekpiEndpointOutputSchemas.breakdownItemsCreate,
	},
	'breakdownItems.get': {
		input: SimplekpiEndpointInputSchemas.breakdownItemsGet,
		output: SimplekpiEndpointOutputSchemas.breakdownItemsGet,
	},
	'breakdownItems.update': {
		input: SimplekpiEndpointInputSchemas.breakdownItemsUpdate,
		output: SimplekpiEndpointOutputSchemas.breakdownItemsUpdate,
	},
	'breakdownItems.delete': {
		input: SimplekpiEndpointInputSchemas.breakdownItemsDelete,
		output: SimplekpiEndpointOutputSchemas.breakdownItemsDelete,
	},
	'kpiEntries.list': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesList,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesList,
	},
	'kpiEntries.create': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesCreate,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesCreate,
	},
	'kpiEntries.get': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesGet,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesGet,
	},
	'kpiEntries.update': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesUpdate,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesUpdate,
	},
	'kpiEntries.delete': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesDelete,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesDelete,
	},
	'kpiEntries.createBatch': {
		input: SimplekpiEndpointInputSchemas.kpiEntriesCreateBatch,
		output: SimplekpiEndpointOutputSchemas.kpiEntriesCreateBatch,
	},
	'kpiFrequencies.list': {
		input: SimplekpiEndpointInputSchemas.kpiFrequenciesList,
		output: SimplekpiEndpointOutputSchemas.kpiFrequenciesList,
	},
	'kpiFrequencies.get': {
		input: SimplekpiEndpointInputSchemas.kpiFrequenciesGet,
		output: SimplekpiEndpointOutputSchemas.kpiFrequenciesGet,
	},
	'kpiIcons.list': {
		input: SimplekpiEndpointInputSchemas.kpiIconsList,
		output: SimplekpiEndpointOutputSchemas.kpiIconsList,
	},
	'kpiIcons.get': {
		input: SimplekpiEndpointInputSchemas.kpiIconsGet,
		output: SimplekpiEndpointOutputSchemas.kpiIconsGet,
	},
	'kpiUnits.list': {
		input: SimplekpiEndpointInputSchemas.kpiUnitsList,
		output: SimplekpiEndpointOutputSchemas.kpiUnitsList,
	},
	'kpiUnits.create': {
		input: SimplekpiEndpointInputSchemas.kpiUnitsCreate,
		output: SimplekpiEndpointOutputSchemas.kpiUnitsCreate,
	},
	'kpiUnits.get': {
		input: SimplekpiEndpointInputSchemas.kpiUnitsGet,
		output: SimplekpiEndpointOutputSchemas.kpiUnitsGet,
	},
	'kpiUnits.update': {
		input: SimplekpiEndpointInputSchemas.kpiUnitsUpdate,
		output: SimplekpiEndpointOutputSchemas.kpiUnitsUpdate,
	},
	'kpiUnits.delete': {
		input: SimplekpiEndpointInputSchemas.kpiUnitsDelete,
		output: SimplekpiEndpointOutputSchemas.kpiUnitsDelete,
	},
	'reports.allDataEntries': {
		input: SimplekpiEndpointInputSchemas.reportsAllDataEntries,
		output: SimplekpiEndpointOutputSchemas.reportsAllDataEntries,
	},
	'users.list': {
		input: SimplekpiEndpointInputSchemas.usersList,
		output: SimplekpiEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: SimplekpiEndpointInputSchemas.usersGet,
		output: SimplekpiEndpointOutputSchemas.usersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof simplekpiEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const simplekpiEndpointMeta = {
	'kpis.list': {
		riskLevel: 'read',
		description:
			'List the KPIs on the account with their frequency, unit, icon, value direction and aggregate function; page until a page comes back short',
	},
	'kpis.create': {
		riskLevel: 'write',
		description:
			'Create a KPI. icon_id and unit_id must be real ids from kpiIcons and kpiUnits even though the contract does not mark them mandatory',
	},
	'kpis.get': {
		riskLevel: 'read',
		description:
			'Read one KPI by id, with its frequency, unit, icon, value direction and aggregate function',
	},
	'kpis.update': {
		riskLevel: 'write',
		description:
			'Replace a KPI wholesale. Anything left out is reset to its default rather than kept, so read it first and send it back changed',
	},
	'kpis.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a KPI and every entry recorded against it; this cannot be undone',
	},
	'kpiCategories.list': {
		riskLevel: 'read',
		description: 'List the KPI categories on the account',
	},
	'kpiCategories.create': {
		riskLevel: 'write',
		description: 'Create a KPI category, which groups KPIs on the dashboard',
	},
	'kpiCategories.get': {
		riskLevel: 'read',
		description: 'Read one KPI category by id, with its name and sort order',
	},
	'kpiCategories.update': {
		riskLevel: 'write',
		description:
			'Replace a KPI category; anything left out is reset to its default',
	},
	'kpiCategories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a KPI category; the KPIs in it are affected and this cannot be undone',
	},
	'kpiCategories.kpis.list': {
		riskLevel: 'read',
		description: 'List the KPIs inside one category',
	},
	'kpiCategories.kpis.create': {
		riskLevel: 'write',
		description:
			'Create a KPI inside one category; it lands in the category in the path even when the body names another',
	},
	'kpiCategories.kpis.get': {
		riskLevel: 'read',
		description:
			'Read one KPI through its category. A KPI under a different category answers 404',
	},
	'kpiCategories.kpis.update': {
		riskLevel: 'write',
		description:
			'Replace a KPI through its category. Anything left out is reset to its default',
	},
	'kpiCategories.kpis.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a KPI through its category, with every entry recorded against it; this cannot be undone',
	},
	'breakdownItems.list': {
		riskLevel: 'read',
		description:
			'List the breakdown items a KPI can be broken down by, optionally only those under one breakdown',
	},
	'breakdownItems.create': {
		riskLevel: 'write',
		description:
			'Create a breakdown item, such as a person, team, product or region; its id is what an entry sends as source_id',
	},
	'breakdownItems.get': {
		riskLevel: 'read',
		description:
			'Read one breakdown item by id, with the breakdown it belongs to',
	},
	'breakdownItems.update': {
		riskLevel: 'write',
		description:
			'Replace a breakdown item; anything left out is reset to its default',
	},
	'breakdownItems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a breakdown item, which removes that slice from the KPIs that use it; this cannot be undone',
	},
	'kpiEntries.list': {
		riskLevel: 'read',
		description:
			'List KPI entries, filtered by user, KPI, breakdown source and date range; narrow by KPI and dates or the response gets large',
	},
	'kpiEntries.create': {
		riskLevel: 'write',
		description:
			'Write or update one KPI entry. kpi_id, source_id and entry_date identify it, so the same trio again updates rather than duplicating. A write with every value empty answers stored: false',
	},
	'kpiEntries.get': {
		riskLevel: 'read',
		description: 'Read one KPI entry by id, with its actual, target and notes',
	},
	'kpiEntries.update': {
		riskLevel: 'write',
		description:
			'Change one KPI entry named in the path; the setActual, setTarget and setNotes flags choose which values are written',
	},
	'kpiEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one KPI entry; this cannot be undone',
	},
	'kpiEntries.createBatch': {
		riskLevel: 'write',
		description:
			'Write many KPI entries in one request. It answers 200 even when every row was rejected, so rows_added is the only signal; a batch that stored nothing throws',
	},
	'kpiFrequencies.list': {
		riskLevel: 'read',
		description:
			'List the frequencies a KPI can use: D daily, W weekly, M monthly, Q quarterly, Y yearly',
	},
	'kpiFrequencies.get': {
		riskLevel: 'read',
		description: 'Read one KPI frequency by its id, such as W for weekly',
	},
	'kpiIcons.list': {
		riskLevel: 'read',
		description:
			'List the icons a KPI can use, which is where a valid icon_id comes from',
	},
	'kpiIcons.get': {
		riskLevel: 'read',
		description:
			'Read one KPI icon by id, which is what a KPI sends as icon_id',
	},
	'kpiUnits.list': {
		riskLevel: 'read',
		description:
			'List the units a KPI can use, with their entry and display formats',
	},
	'kpiUnits.create': {
		riskLevel: 'write',
		description:
			'Create a KPI unit with a numeric entry format and a display format',
	},
	'kpiUnits.get': {
		riskLevel: 'read',
		description: 'Read one KPI unit by id, with its entry and display formats',
	},
	'kpiUnits.update': {
		riskLevel: 'write',
		description:
			'Replace a KPI unit; anything left out is reset to its default',
	},
	'kpiUnits.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a KPI unit; KPIs using it are affected, and this cannot be undone',
	},
	'reports.allDataEntries': {
		riskLevel: 'read',
		description:
			"Read actuals and targets as one row per KPI, breakdown source and period, already aggregated to each KPI's own frequency",
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List the people on the account with their role and status; read-only, because people are added in the app',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user by id, which is what an entry sends as user_id',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof simplekpiEndpointsNested
>;

export type BaseSimplekpiPlugin<T extends SimplekpiPluginOptions> =
	CorsairPlugin<
		'simplekpi',
		typeof SimplekpiSchema,
		typeof simplekpiEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSimplekpiPlugin =
	BaseSimplekpiPlugin<SimplekpiPluginOptions>;

export type ExternalSimplekpiPlugin<T extends SimplekpiPluginOptions> =
	BaseSimplekpiPlugin<T>;

export function simplekpi<const T extends SimplekpiPluginOptions>(
	incomingOptions: SimplekpiPluginOptions & T = {} as SimplekpiPluginOptions &
		T,
): ExternalSimplekpiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simplekpi',
		schema: SimplekpiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: simplekpiEndpointsNested,
		webhooks: {},
		endpointMeta: simplekpiEndpointMeta,
		endpointSchemas: simplekpiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SimplekpiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('simplekpi', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSimplekpiPlugin;
}

export { SimplekpiAPIError } from './client';

export type {
	CategoryKpisCreateInput,
	KpiEntriesBatchInput,
	KpiEntriesCreateInput,
	SimplekpiBreakdownItem,
	SimplekpiEndpointInputs,
	SimplekpiEndpointOutputs,
	SimplekpiKpi,
	SimplekpiKpiCategory,
	SimplekpiKpiEntry,
	SimplekpiKpiEntryBatchResponse,
	SimplekpiKpiEntryWriteResponse,
	SimplekpiKpiFrequency,
	SimplekpiKpiIcon,
	SimplekpiKpiUnit,
	SimplekpiNothingStored,
	SimplekpiReportRow,
	SimplekpiUser,
} from './endpoints/types';
