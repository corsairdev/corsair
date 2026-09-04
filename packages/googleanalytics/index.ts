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
	AccountsEndpoints,
	AudienceExportsEndpoints,
	AudienceListsEndpoints,
	AudiencesEndpoints,
	CalculatedMetricsEndpoints,
	ChannelGroupsEndpoints,
	ConversionEventsEndpoints,
	CustomDimensionsEndpoints,
	CustomMetricsEndpoints,
	DataStreamsEndpoints,
	ExpandedDataSetsEndpoints,
	KeyEventsEndpoints,
	LinksEndpoints,
	MeasurementProtocolEndpoints,
	PropertiesEndpoints,
	RecurringAudienceListsEndpoints,
	ReportingDataEndpoints,
	ReportsEndpoints,
	ReportTasksEndpoints,
} from './endpoints';
import type {
	GoogleAnalyticsEndpointInputs,
	GoogleAnalyticsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAnalyticsEndpointInputSchemas,
	GoogleAnalyticsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleAnalyticsSchema } from './schema';
import { createGoogleAnalyticsWebhookMatcher } from './webhooks/types';

export const googleAnalyticsAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type GoogleAnalyticsContext = CorsairPluginContext<
	typeof GoogleAnalyticsSchema,
	GoogleAnalyticsPluginOptions
>;

type GoogleAnalyticsEndpoint<K extends keyof GoogleAnalyticsEndpointOutputs> =
	CorsairEndpoint<
		GoogleAnalyticsContext,
		GoogleAnalyticsEndpointInputs[K],
		GoogleAnalyticsEndpointOutputs[K]
	>;

export type GoogleAnalyticsEndpoints = {
	accountsGet: GoogleAnalyticsEndpoint<'accountsGet'>;
	accountsList: GoogleAnalyticsEndpoint<'accountsList'>;
	accountsListV1Beta: GoogleAnalyticsEndpoint<'accountsListV1Beta'>;
	accountsListSummaries: GoogleAnalyticsEndpoint<'accountsListSummaries'>;
	accountsGetDataSharingSettings: GoogleAnalyticsEndpoint<'accountsGetDataSharingSettings'>;
	accountsProvisionAccountTicket: GoogleAnalyticsEndpoint<'accountsProvisionAccountTicket'>;

	propertiesGet: GoogleAnalyticsEndpoint<'propertiesGet'>;
	propertiesList: GoogleAnalyticsEndpoint<'propertiesList'>;
	propertiesListFiltered: GoogleAnalyticsEndpoint<'propertiesListFiltered'>;
	propertiesUpdate: GoogleAnalyticsEndpoint<'propertiesUpdate'>;
	propertiesCreateRollup: GoogleAnalyticsEndpoint<'propertiesCreateRollup'>;
	propertiesGetAttributionSettings: GoogleAnalyticsEndpoint<'propertiesGetAttributionSettings'>;
	propertiesGetDataRetentionSettings: GoogleAnalyticsEndpoint<'propertiesGetDataRetentionSettings'>;
	propertiesGetGoogleSignalsSettings: GoogleAnalyticsEndpoint<'propertiesGetGoogleSignalsSettings'>;
	propertiesGetPropertyQuotasSnapshot: GoogleAnalyticsEndpoint<'propertiesGetPropertyQuotasSnapshot'>;

	customDimensionsCreate: GoogleAnalyticsEndpoint<'customDimensionsCreate'>;
	customDimensionsGet: GoogleAnalyticsEndpoint<'customDimensionsGet'>;
	customDimensionsList: GoogleAnalyticsEndpoint<'customDimensionsList'>;
	customDimensionsArchive: GoogleAnalyticsEndpoint<'customDimensionsArchive'>;

	customMetricsCreate: GoogleAnalyticsEndpoint<'customMetricsCreate'>;
	customMetricsList: GoogleAnalyticsEndpoint<'customMetricsList'>;

	calculatedMetricsList: GoogleAnalyticsEndpoint<'calculatedMetricsList'>;

	keyEventsGet: GoogleAnalyticsEndpoint<'keyEventsGet'>;
	keyEventsList: GoogleAnalyticsEndpoint<'keyEventsList'>;

	conversionEventsList: GoogleAnalyticsEndpoint<'conversionEventsList'>;

	audiencesGet: GoogleAnalyticsEndpoint<'audiencesGet'>;
	audiencesList: GoogleAnalyticsEndpoint<'audiencesList'>;

	audienceListsCreate: GoogleAnalyticsEndpoint<'audienceListsCreate'>;
	audienceListsGet: GoogleAnalyticsEndpoint<'audienceListsGet'>;
	audienceListsList: GoogleAnalyticsEndpoint<'audienceListsList'>;
	audienceListsQuery: GoogleAnalyticsEndpoint<'audienceListsQuery'>;

	audienceExportsCreate: GoogleAnalyticsEndpoint<'audienceExportsCreate'>;
	audienceExportsGet: GoogleAnalyticsEndpoint<'audienceExportsGet'>;
	audienceExportsList: GoogleAnalyticsEndpoint<'audienceExportsList'>;
	audienceExportsQuery: GoogleAnalyticsEndpoint<'audienceExportsQuery'>;

	recurringAudienceListsCreate: GoogleAnalyticsEndpoint<'recurringAudienceListsCreate'>;
	recurringAudienceListsGet: GoogleAnalyticsEndpoint<'recurringAudienceListsGet'>;
	recurringAudienceListsList: GoogleAnalyticsEndpoint<'recurringAudienceListsList'>;

	dataStreamsList: GoogleAnalyticsEndpoint<'dataStreamsList'>;
	dataStreamsListMeasurementProtocolSecrets: GoogleAnalyticsEndpoint<'dataStreamsListMeasurementProtocolSecrets'>;
	dataStreamsListEventCreateRules: GoogleAnalyticsEndpoint<'dataStreamsListEventCreateRules'>;
	dataStreamsListSKAdNetworkConversionValueSchemas: GoogleAnalyticsEndpoint<'dataStreamsListSKAdNetworkConversionValueSchemas'>;

	linksListAdSense: GoogleAnalyticsEndpoint<'linksListAdSense'>;
	linksListBigQuery: GoogleAnalyticsEndpoint<'linksListBigQuery'>;
	linksListFirebase: GoogleAnalyticsEndpoint<'linksListFirebase'>;
	linksListGoogleAds: GoogleAnalyticsEndpoint<'linksListGoogleAds'>;
	linksListDV360Advertiser: GoogleAnalyticsEndpoint<'linksListDV360Advertiser'>;
	linksListDV360Proposals: GoogleAnalyticsEndpoint<'linksListDV360Proposals'>;
	linksListSearchAds360: GoogleAnalyticsEndpoint<'linksListSearchAds360'>;

	expandedDataSetsCreate: GoogleAnalyticsEndpoint<'expandedDataSetsCreate'>;
	expandedDataSetsList: GoogleAnalyticsEndpoint<'expandedDataSetsList'>;

	channelGroupsList: GoogleAnalyticsEndpoint<'channelGroupsList'>;

	reportingDataListAnnotations: GoogleAnalyticsEndpoint<'reportingDataListAnnotations'>;
	reportingDataListSubpropertyEventFilters: GoogleAnalyticsEndpoint<'reportingDataListSubpropertyEventFilters'>;
	reportingDataListSubpropertySyncConfigs: GoogleAnalyticsEndpoint<'reportingDataListSubpropertySyncConfigs'>;

	reportsRun: GoogleAnalyticsEndpoint<'reportsRun'>;
	reportsRunRealtime: GoogleAnalyticsEndpoint<'reportsRunRealtime'>;
	reportsRunPivot: GoogleAnalyticsEndpoint<'reportsRunPivot'>;
	reportsRunFunnel: GoogleAnalyticsEndpoint<'reportsRunFunnel'>;
	reportsBatchRun: GoogleAnalyticsEndpoint<'reportsBatchRun'>;
	reportsBatchRunPivot: GoogleAnalyticsEndpoint<'reportsBatchRunPivot'>;
	reportsCheckCompatibility: GoogleAnalyticsEndpoint<'reportsCheckCompatibility'>;
	reportsGetMetadata: GoogleAnalyticsEndpoint<'reportsGetMetadata'>;

	reportTasksCreate: GoogleAnalyticsEndpoint<'reportTasksCreate'>;
	reportTasksGet: GoogleAnalyticsEndpoint<'reportTasksGet'>;
	reportTasksQuery: GoogleAnalyticsEndpoint<'reportTasksQuery'>;
	reportTasksList: GoogleAnalyticsEndpoint<'reportTasksList'>;

	measurementProtocolSendEvents: GoogleAnalyticsEndpoint<'measurementProtocolSendEvents'>;
	measurementProtocolValidateEvents: GoogleAnalyticsEndpoint<'measurementProtocolValidateEvents'>;
};

export type GoogleAnalyticsBoundEndpoints = BindEndpoints<
	typeof googleAnalyticsEndpointsNested
>;

const googleAnalyticsWebhooksNested = {} as const;

export const googleAnalyticsEndpointsNested = {
	accounts: AccountsEndpoints,
	properties: PropertiesEndpoints,
	customDimensions: CustomDimensionsEndpoints,
	customMetrics: CustomMetricsEndpoints,
	calculatedMetrics: CalculatedMetricsEndpoints,
	keyEvents: KeyEventsEndpoints,
	conversionEvents: ConversionEventsEndpoints,
	audiences: AudiencesEndpoints,
	audienceLists: AudienceListsEndpoints,
	audienceExports: AudienceExportsEndpoints,
	recurringAudienceLists: RecurringAudienceListsEndpoints,
	dataStreams: DataStreamsEndpoints,
	links: LinksEndpoints,
	expandedDataSets: ExpandedDataSetsEndpoints,
	channelGroups: ChannelGroupsEndpoints,
	reportingData: ReportingDataEndpoints,
	reports: ReportsEndpoints,
	reportTasks: ReportTasksEndpoints,
	measurementProtocol: MeasurementProtocolEndpoints,
} as const;

export const googleanalyticsEndpointSchemas = {
	'accounts.get': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsGet,
	},
	'accounts.list': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsList,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsList,
	},
	'accounts.listV1Beta': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsListV1Beta,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsListV1Beta,
	},
	'accounts.listSummaries': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsListSummaries,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsListSummaries,
	},
	'accounts.getDataSharingSettings': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsGetDataSharingSettings,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsGetDataSharingSettings,
	},
	'accounts.provisionAccountTicket': {
		input: GoogleAnalyticsEndpointInputSchemas.accountsProvisionAccountTicket,
		output: GoogleAnalyticsEndpointOutputSchemas.accountsProvisionAccountTicket,
	},

	'properties.get': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesGet,
		output: GoogleAnalyticsEndpointOutputSchemas.propertiesGet,
	},
	'properties.list': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesList,
		output: GoogleAnalyticsEndpointOutputSchemas.propertiesList,
	},
	'properties.listFiltered': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesListFiltered,
		output: GoogleAnalyticsEndpointOutputSchemas.propertiesListFiltered,
	},
	'properties.update': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesUpdate,
		output: GoogleAnalyticsEndpointOutputSchemas.propertiesUpdate,
	},
	'properties.createRollup': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesCreateRollup,
		output: GoogleAnalyticsEndpointOutputSchemas.propertiesCreateRollup,
	},
	'properties.getAttributionSettings': {
		input: GoogleAnalyticsEndpointInputSchemas.propertiesGetAttributionSettings,
		output:
			GoogleAnalyticsEndpointOutputSchemas.propertiesGetAttributionSettings,
	},
	'properties.getDataRetentionSettings': {
		input:
			GoogleAnalyticsEndpointInputSchemas.propertiesGetDataRetentionSettings,
		output:
			GoogleAnalyticsEndpointOutputSchemas.propertiesGetDataRetentionSettings,
	},
	'properties.getGoogleSignalsSettings': {
		input:
			GoogleAnalyticsEndpointInputSchemas.propertiesGetGoogleSignalsSettings,
		output:
			GoogleAnalyticsEndpointOutputSchemas.propertiesGetGoogleSignalsSettings,
	},
	'properties.getPropertyQuotasSnapshot': {
		input:
			GoogleAnalyticsEndpointInputSchemas.propertiesGetPropertyQuotasSnapshot,
		output:
			GoogleAnalyticsEndpointOutputSchemas.propertiesGetPropertyQuotasSnapshot,
	},

	'customDimensions.create': {
		input: GoogleAnalyticsEndpointInputSchemas.customDimensionsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.customDimensionsCreate,
	},
	'customDimensions.get': {
		input: GoogleAnalyticsEndpointInputSchemas.customDimensionsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.customDimensionsGet,
	},
	'customDimensions.list': {
		input: GoogleAnalyticsEndpointInputSchemas.customDimensionsList,
		output: GoogleAnalyticsEndpointOutputSchemas.customDimensionsList,
	},
	'customDimensions.archive': {
		input: GoogleAnalyticsEndpointInputSchemas.customDimensionsArchive,
		output: GoogleAnalyticsEndpointOutputSchemas.customDimensionsArchive,
	},

	'customMetrics.create': {
		input: GoogleAnalyticsEndpointInputSchemas.customMetricsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.customMetricsCreate,
	},
	'customMetrics.list': {
		input: GoogleAnalyticsEndpointInputSchemas.customMetricsList,
		output: GoogleAnalyticsEndpointOutputSchemas.customMetricsList,
	},

	'calculatedMetrics.list': {
		input: GoogleAnalyticsEndpointInputSchemas.calculatedMetricsList,
		output: GoogleAnalyticsEndpointOutputSchemas.calculatedMetricsList,
	},

	'keyEvents.get': {
		input: GoogleAnalyticsEndpointInputSchemas.keyEventsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.keyEventsGet,
	},
	'keyEvents.list': {
		input: GoogleAnalyticsEndpointInputSchemas.keyEventsList,
		output: GoogleAnalyticsEndpointOutputSchemas.keyEventsList,
	},

	'conversionEvents.list': {
		input: GoogleAnalyticsEndpointInputSchemas.conversionEventsList,
		output: GoogleAnalyticsEndpointOutputSchemas.conversionEventsList,
	},

	'audiences.get': {
		input: GoogleAnalyticsEndpointInputSchemas.audiencesGet,
		output: GoogleAnalyticsEndpointOutputSchemas.audiencesGet,
	},
	'audiences.list': {
		input: GoogleAnalyticsEndpointInputSchemas.audiencesList,
		output: GoogleAnalyticsEndpointOutputSchemas.audiencesList,
	},

	'audienceLists.create': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceListsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceListsCreate,
	},
	'audienceLists.get': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceListsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceListsGet,
	},
	'audienceLists.list': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceListsList,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceListsList,
	},
	'audienceLists.query': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceListsQuery,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceListsQuery,
	},

	'audienceExports.create': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceExportsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceExportsCreate,
	},
	'audienceExports.get': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceExportsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceExportsGet,
	},
	'audienceExports.list': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceExportsList,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceExportsList,
	},
	'audienceExports.query': {
		input: GoogleAnalyticsEndpointInputSchemas.audienceExportsQuery,
		output: GoogleAnalyticsEndpointOutputSchemas.audienceExportsQuery,
	},

	'recurringAudienceLists.create': {
		input: GoogleAnalyticsEndpointInputSchemas.recurringAudienceListsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.recurringAudienceListsCreate,
	},
	'recurringAudienceLists.get': {
		input: GoogleAnalyticsEndpointInputSchemas.recurringAudienceListsGet,
		output: GoogleAnalyticsEndpointOutputSchemas.recurringAudienceListsGet,
	},
	'recurringAudienceLists.list': {
		input: GoogleAnalyticsEndpointInputSchemas.recurringAudienceListsList,
		output: GoogleAnalyticsEndpointOutputSchemas.recurringAudienceListsList,
	},

	'dataStreams.list': {
		input: GoogleAnalyticsEndpointInputSchemas.dataStreamsList,
		output: GoogleAnalyticsEndpointOutputSchemas.dataStreamsList,
	},
	'dataStreams.listMeasurementProtocolSecrets': {
		input:
			GoogleAnalyticsEndpointInputSchemas.dataStreamsListMeasurementProtocolSecrets,
		output:
			GoogleAnalyticsEndpointOutputSchemas.dataStreamsListMeasurementProtocolSecrets,
	},
	'dataStreams.listEventCreateRules': {
		input: GoogleAnalyticsEndpointInputSchemas.dataStreamsListEventCreateRules,
		output:
			GoogleAnalyticsEndpointOutputSchemas.dataStreamsListEventCreateRules,
	},
	'dataStreams.listSKAdNetworkConversionValueSchemas': {
		input:
			GoogleAnalyticsEndpointInputSchemas.dataStreamsListSKAdNetworkConversionValueSchemas,
		output:
			GoogleAnalyticsEndpointOutputSchemas.dataStreamsListSKAdNetworkConversionValueSchemas,
	},

	'links.listAdSense': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListAdSense,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListAdSense,
	},
	'links.listBigQuery': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListBigQuery,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListBigQuery,
	},
	'links.listFirebase': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListFirebase,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListFirebase,
	},
	'links.listGoogleAds': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListGoogleAds,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListGoogleAds,
	},
	'links.listDV360Advertiser': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListDV360Advertiser,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListDV360Advertiser,
	},
	'links.listDV360Proposals': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListDV360Proposals,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListDV360Proposals,
	},
	'links.listSearchAds360': {
		input: GoogleAnalyticsEndpointInputSchemas.linksListSearchAds360,
		output: GoogleAnalyticsEndpointOutputSchemas.linksListSearchAds360,
	},

	'expandedDataSets.create': {
		input: GoogleAnalyticsEndpointInputSchemas.expandedDataSetsCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.expandedDataSetsCreate,
	},
	'expandedDataSets.list': {
		input: GoogleAnalyticsEndpointInputSchemas.expandedDataSetsList,
		output: GoogleAnalyticsEndpointOutputSchemas.expandedDataSetsList,
	},

	'channelGroups.list': {
		input: GoogleAnalyticsEndpointInputSchemas.channelGroupsList,
		output: GoogleAnalyticsEndpointOutputSchemas.channelGroupsList,
	},

	'reportingData.listAnnotations': {
		input: GoogleAnalyticsEndpointInputSchemas.reportingDataListAnnotations,
		output: GoogleAnalyticsEndpointOutputSchemas.reportingDataListAnnotations,
	},
	'reportingData.listSubpropertyEventFilters': {
		input:
			GoogleAnalyticsEndpointInputSchemas.reportingDataListSubpropertyEventFilters,
		output:
			GoogleAnalyticsEndpointOutputSchemas.reportingDataListSubpropertyEventFilters,
	},
	'reportingData.listSubpropertySyncConfigs': {
		input:
			GoogleAnalyticsEndpointInputSchemas.reportingDataListSubpropertySyncConfigs,
		output:
			GoogleAnalyticsEndpointOutputSchemas.reportingDataListSubpropertySyncConfigs,
	},

	'reports.run': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsRun,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsRun,
	},
	'reports.runRealtime': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsRunRealtime,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsRunRealtime,
	},
	'reports.runPivot': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsRunPivot,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsRunPivot,
	},
	'reports.runFunnel': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsRunFunnel,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsRunFunnel,
	},
	'reports.batchRun': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsBatchRun,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsBatchRun,
	},
	'reports.batchRunPivot': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsBatchRunPivot,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsBatchRunPivot,
	},
	'reports.checkCompatibility': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsCheckCompatibility,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsCheckCompatibility,
	},
	'reports.getMetadata': {
		input: GoogleAnalyticsEndpointInputSchemas.reportsGetMetadata,
		output: GoogleAnalyticsEndpointOutputSchemas.reportsGetMetadata,
	},

	'reportTasks.create': {
		input: GoogleAnalyticsEndpointInputSchemas.reportTasksCreate,
		output: GoogleAnalyticsEndpointOutputSchemas.reportTasksCreate,
	},
	'reportTasks.get': {
		input: GoogleAnalyticsEndpointInputSchemas.reportTasksGet,
		output: GoogleAnalyticsEndpointOutputSchemas.reportTasksGet,
	},
	'reportTasks.query': {
		input: GoogleAnalyticsEndpointInputSchemas.reportTasksQuery,
		output: GoogleAnalyticsEndpointOutputSchemas.reportTasksQuery,
	},
	'reportTasks.list': {
		input: GoogleAnalyticsEndpointInputSchemas.reportTasksList,
		output: GoogleAnalyticsEndpointOutputSchemas.reportTasksList,
	},

	'measurementProtocol.sendEvents': {
		input: GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents,
		output: GoogleAnalyticsEndpointOutputSchemas.measurementProtocolSendEvents,
	},
	'measurementProtocol.validateEvents': {
		input:
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolValidateEvents,
		output:
			GoogleAnalyticsEndpointOutputSchemas.measurementProtocolValidateEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAnalyticsEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const googleAnalyticsEndpointMeta = {
	'accounts.get': {
		riskLevel: 'read',
		description: 'Lookup a single Google Analytics account',
	},
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List accounts accessible to the caller [DEPRECATED: use accounts.listV1Beta]',
	},
	'accounts.listV1Beta': {
		riskLevel: 'read',
		description: 'List accounts accessible to the caller (v1beta)',
	},
	'accounts.listSummaries': {
		riskLevel: 'read',
		description:
			'List summaries of all accessible accounts and their properties',
	},
	'accounts.getDataSharingSettings': {
		riskLevel: 'read',
		description: 'Get data sharing settings for an account',
	},
	'accounts.provisionAccountTicket': {
		riskLevel: 'write',
		description: 'Request a ticket for creating a Google Analytics account',
	},

	'properties.get': {
		riskLevel: 'read',
		description: 'Lookup a single GA4 property',
	},
	'properties.list': {
		riskLevel: 'read',
		description:
			'List child properties under an account [DEPRECATED: use properties.listFiltered]',
	},
	'properties.listFiltered': {
		riskLevel: 'read',
		description: 'List GA4 properties matching a filter',
	},
	'properties.update': {
		riskLevel: 'write',
		description: 'Update a GA4 property',
	},
	'properties.createRollup': {
		riskLevel: 'write',
		description: 'Create a roll-up property aggregating multiple properties',
	},
	'properties.getAttributionSettings': {
		riskLevel: 'read',
		description: 'Get attribution settings for a property',
	},
	'properties.getDataRetentionSettings': {
		riskLevel: 'read',
		description: 'Get data retention settings for a property',
	},
	'properties.getGoogleSignalsSettings': {
		riskLevel: 'read',
		description: 'Get Google Signals settings for a property',
	},
	'properties.getPropertyQuotasSnapshot': {
		riskLevel: 'read',
		description: 'Get a snapshot of property quota usage by category',
	},

	'customDimensions.create': {
		riskLevel: 'write',
		description: 'Create a custom dimension on a property',
	},
	'customDimensions.get': {
		riskLevel: 'read',
		description: 'Lookup a single custom dimension',
	},
	'customDimensions.list': {
		riskLevel: 'read',
		description: 'List custom dimensions on a property',
	},
	'customDimensions.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive a custom dimension on a property [DESTRUCTIVE · IRREVERSIBLE]',
	},

	'customMetrics.create': {
		riskLevel: 'write',
		description: 'Create a custom metric on a property',
	},
	'customMetrics.list': {
		riskLevel: 'read',
		description: 'List custom metrics on a property',
	},

	'calculatedMetrics.list': {
		riskLevel: 'read',
		description: 'List calculated metrics on a property',
	},

	'keyEvents.get': {
		riskLevel: 'read',
		description: 'Lookup a single key event (conversion)',
	},
	'keyEvents.list': {
		riskLevel: 'read',
		description: 'List key events on a property',
	},

	'conversionEvents.list': {
		riskLevel: 'read',
		description: 'List conversion events [DEPRECATED: use keyEvents.list]',
	},

	'audiences.get': {
		riskLevel: 'read',
		description: 'Lookup a single audience configuration',
	},
	'audiences.list': {
		riskLevel: 'read',
		description: 'List audiences on a property',
	},

	'audienceLists.create': {
		riskLevel: 'write',
		description: 'Create an audience list for later retrieval of users',
	},
	'audienceLists.get': {
		riskLevel: 'read',
		description: 'Get metadata about an audience list',
	},
	'audienceLists.list': {
		riskLevel: 'read',
		description: 'List audience lists on a property',
	},
	'audienceLists.query': {
		riskLevel: 'read',
		description: 'Retrieve user rows from an audience list',
	},

	'audienceExports.create': {
		riskLevel: 'write',
		description: 'Create an audience export for later retrieval of users',
	},
	'audienceExports.get': {
		riskLevel: 'read',
		description: 'Get metadata about an audience export',
	},
	'audienceExports.list': {
		riskLevel: 'read',
		description: 'List audience exports on a property',
	},
	'audienceExports.query': {
		riskLevel: 'read',
		description: 'Retrieve user rows from an audience export',
	},

	'recurringAudienceLists.create': {
		riskLevel: 'write',
		description: 'Create a recurring audience list that refreshes daily',
	},
	'recurringAudienceLists.get': {
		riskLevel: 'read',
		description: 'Get metadata about a recurring audience list',
	},
	'recurringAudienceLists.list': {
		riskLevel: 'read',
		description: 'List recurring audience lists on a property',
	},

	'dataStreams.list': {
		riskLevel: 'read',
		description: 'List data streams on a property',
	},
	'dataStreams.listMeasurementProtocolSecrets': {
		riskLevel: 'write',
		description: 'List measurement protocol secrets under a data stream',
	},
	'dataStreams.listEventCreateRules': {
		riskLevel: 'read',
		description: 'List event create rules on a web data stream',
	},
	'dataStreams.listSKAdNetworkConversionValueSchemas': {
		riskLevel: 'read',
		description:
			'List SKAdNetwork conversion value schemas on an iOS data stream',
	},

	'links.listAdSense': {
		riskLevel: 'read',
		description: 'List AdSense links on a property',
	},
	'links.listBigQuery': {
		riskLevel: 'read',
		description: 'List BigQuery links on a property',
	},
	'links.listFirebase': {
		riskLevel: 'read',
		description: 'List Firebase links on a property',
	},
	'links.listGoogleAds': {
		riskLevel: 'read',
		description: 'List Google Ads links on a property',
	},
	'links.listDV360Advertiser': {
		riskLevel: 'read',
		description: 'List Display & Video 360 advertiser links on a property',
	},
	'links.listDV360Proposals': {
		riskLevel: 'read',
		description:
			'List Display & Video 360 advertiser link proposals on a property',
	},
	'links.listSearchAds360': {
		riskLevel: 'read',
		description: 'List Search Ads 360 links on a property',
	},

	'expandedDataSets.create': {
		riskLevel: 'write',
		description: 'Create an expanded data set on a property',
	},
	'expandedDataSets.list': {
		riskLevel: 'read',
		description: 'List expanded data sets on a property',
	},

	'channelGroups.list': {
		riskLevel: 'read',
		description: 'List channel groups on a property',
	},

	'reportingData.listAnnotations': {
		riskLevel: 'read',
		description: 'List reporting data annotations on a property',
	},
	'reportingData.listSubpropertyEventFilters': {
		riskLevel: 'read',
		description: 'List subproperty event filters on a property',
	},
	'reportingData.listSubpropertySyncConfigs': {
		riskLevel: 'read',
		description: 'List subproperty sync configs on a property',
	},

	'reports.run': {
		riskLevel: 'read',
		description:
			'Run a customized GA4 report. Derive dimension/metric apiNames from reports.getMetadata',
	},
	'reports.runRealtime': {
		riskLevel: 'read',
		description: 'Run a realtime report (last 30-60 minutes)',
	},
	'reports.runPivot': {
		riskLevel: 'read',
		description: 'Run a customized pivot report',
	},
	'reports.runFunnel': {
		riskLevel: 'read',
		description: 'Run a customized funnel report',
	},
	'reports.batchRun': {
		riskLevel: 'read',
		description: 'Run multiple reports in a single batch request',
	},
	'reports.batchRunPivot': {
		riskLevel: 'read',
		description: 'Run multiple pivot reports in a single batch request',
	},
	'reports.checkCompatibility': {
		riskLevel: 'read',
		description: 'List dimensions and metrics compatible with a report request',
	},
	'reports.getMetadata': {
		riskLevel: 'read',
		description:
			'Get metadata for available dimensions and metrics. Use apiNames from here in report requests',
	},

	'reportTasks.create': {
		riskLevel: 'write',
		description: 'Create an asynchronous report task',
	},
	'reportTasks.get': {
		riskLevel: 'read',
		description: 'Get metadata about a report task',
	},
	'reportTasks.query': {
		riskLevel: 'read',
		description: 'Retrieve a report task content (only when ACTIVE)',
	},
	'reportTasks.list': {
		riskLevel: 'read',
		description: 'List report tasks on a property',
	},

	'measurementProtocol.sendEvents': {
		riskLevel: 'write',
		description:
			'Send events to GA4 via the Measurement Protocol. Requires the stream api_secret (not the OAuth token) plus measurementId (web) or firebaseAppId (app)',
	},
	'measurementProtocol.validateEvents': {
		riskLevel: 'read',
		description:
			'Validate Measurement Protocol events against the debug endpoint before sending. Requires the stream api_secret',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleAnalyticsEndpointsNested
>;

export type GoogleAnalyticsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleAnalyticsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleAnalyticsEndpointsNested>;
};

export type GoogleAnalyticsKeyBuilderContext =
	KeyBuilderContext<GoogleAnalyticsPluginOptions>;

export type BaseGoogleAnalyticsPlugin<T extends GoogleAnalyticsPluginOptions> =
	CorsairPlugin<
		'googleanalytics',
		typeof GoogleAnalyticsSchema,
		typeof googleAnalyticsEndpointsNested,
		typeof googleAnalyticsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleAnalyticsPlugin =
	BaseGoogleAnalyticsPlugin<GoogleAnalyticsPluginOptions>;

export type ExternalGoogleAnalyticsPlugin<
	T extends GoogleAnalyticsPluginOptions,
> = BaseGoogleAnalyticsPlugin<T>;

export function googleanalytics<const T extends GoogleAnalyticsPluginOptions>(
	incomingOptions: GoogleAnalyticsPluginOptions &
		T = {} as GoogleAnalyticsPluginOptions & T,
): ExternalGoogleAnalyticsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleanalytics',
		authConfig: googleAnalyticsAuthConfig,
		schema: GoogleAnalyticsSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/analytics',
				'https://www.googleapis.com/auth/analytics.edit',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleAnalyticsEndpointsNested,
		webhooks: googleAnalyticsWebhooksNested,
		endpointMeta: googleAnalyticsEndpointMeta,
		endpointSchemas: googleanalyticsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleAnalyticsKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'googleanalytics',
					tokenUrl: 'https://oauth2.googleapis.com/token',
				});
			}

			throw new AuthMissingError('googleanalytics', 'oauth_2');
		},
		pluginWebhookMatcher: createGoogleAnalyticsWebhookMatcher(),
	} satisfies InternalGoogleAnalyticsPlugin;
}

export type {
	GoogleAnalyticsEndpointInputs,
	GoogleAnalyticsEndpointOutputs,
} from './endpoints/types';

export * from './error-handlers';
export { GoogleAnalyticsSchema } from './schema';
export type {
	GoogleAnalyticsAccount,
	GoogleAnalyticsProperty,
} from './schema/database';
export type { GoogleAnalyticsWebhookOutputs } from './webhooks/types';
export { createGoogleAnalyticsWebhookMatcher } from './webhooks/types';
