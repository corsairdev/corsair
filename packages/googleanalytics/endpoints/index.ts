import {
	get as accountsGet,
	getDataSharingSettings as accountsGetDataSharingSettings,
	list as accountsList,
	listSummaries as accountsListSummaries,
	listV1Beta as accountsListV1Beta,
	provisionAccountTicket as accountsProvisionAccountTicket,
} from './accounts';
import {
	create as audienceExportsCreate,
	get as audienceExportsGet,
	list as audienceExportsList,
	query as audienceExportsQuery,
} from './audience-exports';
import {
	create as audienceListsCreate,
	get as audienceListsGet,
	list as audienceListsList,
	query as audienceListsQuery,
} from './audience-lists';
import { get as audiencesGet, list as audiencesList } from './audiences';
import { list as calculatedMetricsList } from './calculated-metrics';
import { list as channelGroupsList } from './channel-groups';
import { list as conversionEventsList } from './conversion-events';
import {
	archive as customDimensionsArchive,
	create as customDimensionsCreate,
	get as customDimensionsGet,
	list as customDimensionsList,
} from './custom-dimensions';
import {
	create as customMetricsCreate,
	list as customMetricsList,
} from './custom-metrics';
import {
	list as dataStreamsList,
	listEventCreateRules as dataStreamsListEventCreateRules,
	listMeasurementProtocolSecrets as dataStreamsListMeasurementProtocolSecrets,
	listSKAdNetworkConversionValueSchemas as dataStreamsListSKAdNetworkConversionValueSchemas,
} from './data-streams';
import {
	create as expandedDataSetsCreate,
	list as expandedDataSetsList,
} from './expanded-data-sets';
import { get as keyEventsGet, list as keyEventsList } from './key-events';
import {
	listAdSense as linksListAdSense,
	listBigQuery as linksListBigQuery,
	listDV360Advertiser as linksListDV360Advertiser,
	listDV360Proposals as linksListDV360Proposals,
	listFirebase as linksListFirebase,
	listGoogleAds as linksListGoogleAds,
	listSearchAds360 as linksListSearchAds360,
} from './links';
import {
	sendEvents as measurementProtocolSendEvents,
	validateEvents as measurementProtocolValidateEvents,
} from './measurement-protocol';
import {
	createRollup as propertiesCreateRollup,
	get as propertiesGet,
	getAttributionSettings as propertiesGetAttributionSettings,
	getDataRetentionSettings as propertiesGetDataRetentionSettings,
	getGoogleSignalsSettings as propertiesGetGoogleSignalsSettings,
	getPropertyQuotasSnapshot as propertiesGetPropertyQuotasSnapshot,
	list as propertiesList,
	listFiltered as propertiesListFiltered,
	update as propertiesUpdate,
} from './properties';
import {
	create as recurringAudienceListsCreate,
	get as recurringAudienceListsGet,
	list as recurringAudienceListsList,
} from './recurring-audience-lists';
import {
	create as reportTasksCreate,
	get as reportTasksGet,
	list as reportTasksList,
	query as reportTasksQuery,
} from './report-tasks';
import {
	listAnnotations as reportingDataListAnnotations,
	listSubpropertyEventFilters as reportingDataListSubpropertyEventFilters,
	listSubpropertySyncConfigs as reportingDataListSubpropertySyncConfigs,
} from './reporting-data';
import {
	batchRun as reportsBatchRun,
	batchRunPivot as reportsBatchRunPivot,
	checkCompatibility as reportsCheckCompatibility,
	getMetadata as reportsGetMetadata,
	run as reportsRun,
	runFunnel as reportsRunFunnel,
	runPivot as reportsRunPivot,
	runRealtime as reportsRunRealtime,
} from './reports';

export const AccountsEndpoints = {
	get: accountsGet,
	list: accountsList,
	listV1Beta: accountsListV1Beta,
	listSummaries: accountsListSummaries,
	getDataSharingSettings: accountsGetDataSharingSettings,
	provisionAccountTicket: accountsProvisionAccountTicket,
};

export const PropertiesEndpoints = {
	get: propertiesGet,
	list: propertiesList,
	listFiltered: propertiesListFiltered,
	update: propertiesUpdate,
	createRollup: propertiesCreateRollup,
	getAttributionSettings: propertiesGetAttributionSettings,
	getDataRetentionSettings: propertiesGetDataRetentionSettings,
	getGoogleSignalsSettings: propertiesGetGoogleSignalsSettings,
	getPropertyQuotasSnapshot: propertiesGetPropertyQuotasSnapshot,
};

export const CustomDimensionsEndpoints = {
	create: customDimensionsCreate,
	get: customDimensionsGet,
	list: customDimensionsList,
	archive: customDimensionsArchive,
};

export const CustomMetricsEndpoints = {
	create: customMetricsCreate,
	list: customMetricsList,
};

export const CalculatedMetricsEndpoints = {
	list: calculatedMetricsList,
};

export const KeyEventsEndpoints = {
	get: keyEventsGet,
	list: keyEventsList,
};

export const ConversionEventsEndpoints = {
	list: conversionEventsList,
};

export const AudiencesEndpoints = {
	get: audiencesGet,
	list: audiencesList,
};

export const AudienceListsEndpoints = {
	create: audienceListsCreate,
	get: audienceListsGet,
	list: audienceListsList,
	query: audienceListsQuery,
};

export const AudienceExportsEndpoints = {
	create: audienceExportsCreate,
	get: audienceExportsGet,
	list: audienceExportsList,
	query: audienceExportsQuery,
};

export const RecurringAudienceListsEndpoints = {
	create: recurringAudienceListsCreate,
	get: recurringAudienceListsGet,
	list: recurringAudienceListsList,
};

export const DataStreamsEndpoints = {
	list: dataStreamsList,
	listMeasurementProtocolSecrets: dataStreamsListMeasurementProtocolSecrets,
	listEventCreateRules: dataStreamsListEventCreateRules,
	listSKAdNetworkConversionValueSchemas:
		dataStreamsListSKAdNetworkConversionValueSchemas,
};

export const LinksEndpoints = {
	listAdSense: linksListAdSense,
	listBigQuery: linksListBigQuery,
	listFirebase: linksListFirebase,
	listGoogleAds: linksListGoogleAds,
	listDV360Advertiser: linksListDV360Advertiser,
	listDV360Proposals: linksListDV360Proposals,
	listSearchAds360: linksListSearchAds360,
};

export const ExpandedDataSetsEndpoints = {
	create: expandedDataSetsCreate,
	list: expandedDataSetsList,
};

export const ChannelGroupsEndpoints = {
	list: channelGroupsList,
};

export const ReportingDataEndpoints = {
	listAnnotations: reportingDataListAnnotations,
	listSubpropertyEventFilters: reportingDataListSubpropertyEventFilters,
	listSubpropertySyncConfigs: reportingDataListSubpropertySyncConfigs,
};

export const ReportsEndpoints = {
	run: reportsRun,
	runRealtime: reportsRunRealtime,
	runPivot: reportsRunPivot,
	runFunnel: reportsRunFunnel,
	batchRun: reportsBatchRun,
	batchRunPivot: reportsBatchRunPivot,
	checkCompatibility: reportsCheckCompatibility,
	getMetadata: reportsGetMetadata,
};

export const ReportTasksEndpoints = {
	create: reportTasksCreate,
	get: reportTasksGet,
	query: reportTasksQuery,
	list: reportTasksList,
};

export const MeasurementProtocolEndpoints = {
	sendEvents: measurementProtocolSendEvents,
	validateEvents: measurementProtocolValidateEvents,
};

export * from './types';
