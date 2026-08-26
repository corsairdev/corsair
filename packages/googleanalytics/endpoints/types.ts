import { z } from 'zod';
import {
	GoogleAnalyticsAccount,
	GoogleAnalyticsProperty,
} from '../schema/database';

const LooseObject = z.record(z.string(), z.unknown());
export type GoogleAnalyticsLoose = z.infer<typeof LooseObject>;

const ResourceBody = z.unknown();

const FilterExpression = z.unknown();

const ReportSubStructure = z.unknown();

const ListParams = z.object({
	pageSize: z.number().int().min(1).max(1000).optional(),
	pageToken: z.string().optional(),
	showDeleted: z.boolean().optional(),
});

const DateRange = z
	.object({
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const Dimension = z
	.object({
		name: z.string(),
		dimensionExpression: FilterExpression.optional(),
	})
	.loose();

const Metric = z
	.object({
		name: z.string().optional(),
		expression: z.string().optional(),
		invisible: z.boolean().optional(),
	})
	.loose();

const NameInput = z.object({ name: z.string() });

const ParentListInput = ListParams.extend({
	parent: z.string(),
}).loose();

const AccountsGetInputSchema = NameInput;
const AccountsListInputSchema = ListParams.loose();
const AccountsListV1BetaInputSchema = ListParams.loose();
const AccountsListSummariesInputSchema = ListParams.loose();
const AccountsGetDataSharingSettingsInputSchema = NameInput;
const AccountsProvisionAccountTicketInputSchema = z
	.object({
		account: ResourceBody.optional(),
		redirectUri: z.string().optional(),
	})
	.loose();

const AccountsListResponseSchema = z.object({
	accounts: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const AccountSummariesListResponseSchema = z.object({
	accountSummaries: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const PropertiesGetInputSchema = NameInput;
const PropertiesListInputSchema = ListParams.extend({
	filter: z.string().min(1),
}).loose();
const PropertiesListFilteredInputSchema = ListParams.extend({
	filter: z.string().min(1),
}).loose();
const PropertiesUpdateInputSchema = z
	.object({
		property: z.object({ name: z.string() }).loose(),
		updateMask: z.string().optional(),
	})
	.loose();
const PropertiesCreateRollupInputSchema = z
	.object({
		rollupProperty: ResourceBody.optional(),
		sourceProperties: z.array(z.string()).optional(),
	})
	.loose();
const PropertiesGetAttributionSettingsInputSchema = NameInput;
const PropertiesGetDataRetentionSettingsInputSchema = NameInput;
const PropertiesGetGoogleSignalsSettingsInputSchema = NameInput;
const PropertiesGetPropertyQuotasSnapshotInputSchema = NameInput;

const PropertiesListResponseSchema = z.object({
	properties: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const CustomDimensionsCreateInputSchema = z
	.object({
		parent: z.string(),
		customDimension: ResourceBody.optional(),
	})
	.loose();
const CustomDimensionsArchiveInputSchema = NameInput;

const CustomDimensionsListResponseSchema = z.object({
	customDimensions: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const CustomMetricsCreateInputSchema = z
	.object({
		parent: z.string(),
		customMetric: ResourceBody.optional(),
	})
	.loose();

const CustomMetricsListResponseSchema = z.object({
	customMetrics: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const CalculatedMetricsListResponseSchema = z.object({
	calculatedMetrics: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const KeyEventsListResponseSchema = z.object({
	keyEvents: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const ConversionEventsListResponseSchema = z.object({
	conversionEvents: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const AudiencesListResponseSchema = z.object({
	audiences: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const AudienceListCreateInputSchema = z
	.object({
		parent: z.string(),
		audienceList: ResourceBody.optional(),
	})
	.loose();
const AudienceListQueryInputSchema = z
	.object({
		name: z.string(),
		offset: z.number().optional(),
		limit: z.number().optional(),
		returnAllRows: z.boolean().optional(),
	})
	.loose();

const AudienceListsListResponseSchema = z.object({
	audienceLists: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const AudienceExportCreateInputSchema = z
	.object({
		parent: z.string(),
		audienceExport: ResourceBody.optional(),
	})
	.loose();
const AudienceExportQueryInputSchema = z
	.object({
		name: z.string(),
		offset: z.number().optional(),
		limit: z.number().optional(),
	})
	.loose();

const AudienceExportsListResponseSchema = z.object({
	audienceExports: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const RecurringAudienceListCreateInputSchema = z
	.object({
		parent: z.string(),
		recurringAudienceList: ResourceBody.optional(),
	})
	.loose();

const RecurringAudienceListsListResponseSchema = z.object({
	recurringAudienceLists: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const DataStreamsListResponseSchema = z.object({
	dataStreams: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const MeasurementProtocolSecretsListResponseSchema = z.object({
	measurementProtocolSecrets: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const EventCreateRulesListResponseSchema = z.object({
	eventCreateRules: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const SKAdNetworkConversionValueSchemasListResponseSchema = z.object({
	sKAdNetworkConversionValueSchemas: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const AdSenseLinksListResponseSchema = z.object({
	adSenseLinks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const BigQueryLinksListResponseSchema = z.object({
	bigqueryLinks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const FirebaseLinksListResponseSchema = z.object({
	firebaseLinks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const GoogleAdsLinksListResponseSchema = z.object({
	googleAdsLinks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const DV360AdvertiserLinksListResponseSchema = z.object({
	displayVideo360AdvertiserLinks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const DV360LinkProposalsListResponseSchema = z.object({
	displayVideo360AdvertiserLinkProposals: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});
const SearchAds360LinksListResponseSchema = z.object({
	searchAds360Links: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const ExpandedDataSetCreateInputSchema = z
	.object({
		parent: z.string(),
		expandedDataSet: ResourceBody.optional(),
	})
	.loose();

const ExpandedDataSetsListResponseSchema = z.object({
	expandedDataSets: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const ChannelGroupsListResponseSchema = z.object({
	channelGroups: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const ReportingDataAnnotationsListResponseSchema = z.object({
	reportingDataAnnotations: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const SubpropertyEventFiltersListResponseSchema = z.object({
	subpropertyEventFilters: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const SubpropertySyncConfigsListResponseSchema = z.object({
	subpropertySyncConfigs: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const ReportRequestBase = z.object({
	dateRanges: z.array(DateRange).optional(),
	dimensions: z.array(Dimension).optional(),
	metrics: z.array(Metric).optional(),
	dimensionFilter: FilterExpression.optional(),
	metricFilter: FilterExpression.optional(),
	orderBys: z.array(ReportSubStructure).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	metricAggregations: z.array(z.string()).optional(),
	currencyCode: z.string().optional(),
	keepEmptyRows: z.boolean().optional(),
	returnPropertyQuota: z.boolean().optional(),
});

const ReportsRunInputSchema = ReportRequestBase.extend({
	property: z.string(),
}).loose();

const ReportsRunRealtimeInputSchema = z
	.object({
		property: z.string(),
		dimensions: z.array(Dimension).optional(),
		metrics: z.array(Metric).optional(),
		dimensionFilter: FilterExpression.optional(),
		metricFilter: FilterExpression.optional(),
		orderBys: z.array(ReportSubStructure).optional(),
		limit: z.number().optional(),
		metricAggregations: z.array(z.string()).optional(),
		returnPropertyQuota: z.boolean().optional(),
		minuteRanges: z.array(ReportSubStructure).optional(),
	})
	.loose();

const ReportsRunPivotInputSchema = z
	.object({
		property: z.string(),
		dateRanges: z.array(DateRange).optional(),
		dimensions: z.array(Dimension).optional(),
		metrics: z.array(Metric).optional(),
		pivots: z.array(ReportSubStructure).optional(),
		dimensionFilter: FilterExpression.optional(),
		metricFilter: FilterExpression.optional(),
		orderBys: z.array(ReportSubStructure).optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		returnPropertyQuota: z.boolean().optional(),
	})
	.loose();

const ReportsRunFunnelInputSchema = z
	.object({
		property: z.string(),
		funnel: ReportSubStructure.optional(),
	})
	.loose();

const ReportsBatchRunInputSchema = z
	.object({
		property: z.string(),
		requests: z.array(ReportRequestBase).optional(),
	})
	.loose();

const ReportsBatchRunPivotInputSchema = z
	.object({
		property: z.string(),
		requests: z.array(ReportSubStructure).optional(),
	})
	.loose();

const ReportsCheckCompatibilityInputSchema = z
	.object({
		property: z.string(),
		dateRanges: z.array(DateRange).optional(),
		dimensions: z.array(Dimension).optional(),
		metrics: z.array(Metric).optional(),
		dimensionFilter: FilterExpression.optional(),
		metricFilter: FilterExpression.optional(),
		offset: z.number().optional(),
		limit: z.number().optional(),
		orderBys: z.array(ReportSubStructure).optional(),
		returnPropertyQuota: z.boolean().optional(),
	})
	.loose();

const ReportsGetMetadataInputSchema = NameInput;

const ReportTaskCreateInputSchema = z
	.object({
		parent: z.string(),
		reportTask: ResourceBody.optional(),
	})
	.loose();
const ReportTaskQueryInputSchema = z
	.object({
		name: z.string(),
		offset: z.number().optional(),
		limit: z.number().optional(),
	})
	.loose();

const ReportTasksListResponseSchema = z.object({
	reportTasks: z.array(LooseObject).optional(),
	nextPageToken: z.string().optional(),
});

const MeasurementProtocolEventsInputSchema = z
	.object({
		apiSecret: z.string(),
		measurementId: z.string().optional(),
		firebaseAppId: z.string().optional(),
		clientId: z.string().optional(),
		appInstanceId: z.string().optional(),
		userId: z.string().optional(),
		timestampMicros: z.number().optional(),
		userProperties: z.record(z.string(), z.unknown()).optional(),
		consent: ResourceBody.optional(),
		events: z.array(
			z.object({ name: z.string(), params: ResourceBody.optional() }).loose(),
		),
	})
	.loose()
	.refine(
		(data) => Boolean(data.measurementId) !== Boolean(data.firebaseAppId),
		{
			message:
				'Exactly one of measurementId (web) or firebaseAppId (Firebase app) is required',
		},
	)
	.superRefine((data, ctx) => {
		if (data.measurementId && !data.clientId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'clientId is required when measurementId (web stream) is set',
				path: ['clientId'],
			});
		}
		if (data.firebaseAppId && !data.appInstanceId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'appInstanceId is required when firebaseAppId (Firebase app stream) is set',
				path: ['appInstanceId'],
			});
		}
	});

export const GoogleAnalyticsEndpointInputSchemas = {
	accountsGet: AccountsGetInputSchema,
	accountsList: AccountsListInputSchema,
	accountsListV1Beta: AccountsListV1BetaInputSchema,
	accountsListSummaries: AccountsListSummariesInputSchema,
	accountsGetDataSharingSettings: AccountsGetDataSharingSettingsInputSchema,
	accountsProvisionAccountTicket: AccountsProvisionAccountTicketInputSchema,

	propertiesGet: PropertiesGetInputSchema,
	propertiesList: PropertiesListInputSchema,
	propertiesListFiltered: PropertiesListFilteredInputSchema,
	propertiesUpdate: PropertiesUpdateInputSchema,
	propertiesCreateRollup: PropertiesCreateRollupInputSchema,
	propertiesGetAttributionSettings: PropertiesGetAttributionSettingsInputSchema,
	propertiesGetDataRetentionSettings:
		PropertiesGetDataRetentionSettingsInputSchema,
	propertiesGetGoogleSignalsSettings:
		PropertiesGetGoogleSignalsSettingsInputSchema,
	propertiesGetPropertyQuotasSnapshot:
		PropertiesGetPropertyQuotasSnapshotInputSchema,

	customDimensionsCreate: CustomDimensionsCreateInputSchema,
	customDimensionsGet: NameInput,
	customDimensionsList: ParentListInput,
	customDimensionsArchive: CustomDimensionsArchiveInputSchema,

	customMetricsCreate: CustomMetricsCreateInputSchema,
	customMetricsList: ParentListInput,

	calculatedMetricsList: ParentListInput,

	keyEventsGet: NameInput,
	keyEventsList: ParentListInput,

	conversionEventsList: ParentListInput,

	audiencesGet: NameInput,
	audiencesList: ParentListInput,

	audienceListsCreate: AudienceListCreateInputSchema,
	audienceListsGet: NameInput,
	audienceListsList: ParentListInput,
	audienceListsQuery: AudienceListQueryInputSchema,

	audienceExportsCreate: AudienceExportCreateInputSchema,
	audienceExportsGet: NameInput,
	audienceExportsList: ParentListInput,
	audienceExportsQuery: AudienceExportQueryInputSchema,

	recurringAudienceListsCreate: RecurringAudienceListCreateInputSchema,
	recurringAudienceListsGet: NameInput,
	recurringAudienceListsList: ParentListInput,

	dataStreamsList: ParentListInput,
	dataStreamsListMeasurementProtocolSecrets: ParentListInput,
	dataStreamsListEventCreateRules: ParentListInput,
	dataStreamsListSKAdNetworkConversionValueSchemas: ParentListInput,

	linksListAdSense: ParentListInput,
	linksListBigQuery: ParentListInput,
	linksListFirebase: ParentListInput,
	linksListGoogleAds: ParentListInput,
	linksListDV360Advertiser: ParentListInput,
	linksListDV360Proposals: ParentListInput,
	linksListSearchAds360: ParentListInput,

	expandedDataSetsCreate: ExpandedDataSetCreateInputSchema,
	expandedDataSetsList: ParentListInput,

	channelGroupsList: ParentListInput,

	reportingDataListAnnotations: ParentListInput,
	reportingDataListSubpropertyEventFilters: ParentListInput,
	reportingDataListSubpropertySyncConfigs: ParentListInput,

	reportsRun: ReportsRunInputSchema,
	reportsRunRealtime: ReportsRunRealtimeInputSchema,
	reportsRunPivot: ReportsRunPivotInputSchema,
	reportsRunFunnel: ReportsRunFunnelInputSchema,
	reportsBatchRun: ReportsBatchRunInputSchema,
	reportsBatchRunPivot: ReportsBatchRunPivotInputSchema,
	reportsCheckCompatibility: ReportsCheckCompatibilityInputSchema,
	reportsGetMetadata: ReportsGetMetadataInputSchema,

	reportTasksCreate: ReportTaskCreateInputSchema,
	reportTasksGet: NameInput,
	reportTasksQuery: ReportTaskQueryInputSchema,
	reportTasksList: ParentListInput,

	measurementProtocolSendEvents: MeasurementProtocolEventsInputSchema,
	measurementProtocolValidateEvents: MeasurementProtocolEventsInputSchema,
} as const;

export const GoogleAnalyticsEndpointOutputSchemas = {
	accountsGet: GoogleAnalyticsAccount.loose(),
	accountsList: AccountsListResponseSchema,
	accountsListV1Beta: AccountsListResponseSchema,
	accountsListSummaries: AccountSummariesListResponseSchema,
	accountsGetDataSharingSettings: LooseObject,
	accountsProvisionAccountTicket: LooseObject,

	propertiesGet: GoogleAnalyticsProperty.loose(),
	propertiesList: PropertiesListResponseSchema,
	propertiesListFiltered: PropertiesListResponseSchema,
	propertiesUpdate: LooseObject,
	propertiesCreateRollup: LooseObject,
	propertiesGetAttributionSettings: LooseObject,
	propertiesGetDataRetentionSettings: LooseObject,
	propertiesGetGoogleSignalsSettings: LooseObject,
	propertiesGetPropertyQuotasSnapshot: LooseObject,

	customDimensionsCreate: LooseObject,
	customDimensionsGet: LooseObject,
	customDimensionsList: CustomDimensionsListResponseSchema,
	customDimensionsArchive: LooseObject,

	customMetricsCreate: LooseObject,
	customMetricsList: CustomMetricsListResponseSchema,

	calculatedMetricsList: CalculatedMetricsListResponseSchema,

	keyEventsGet: LooseObject,
	keyEventsList: KeyEventsListResponseSchema,

	conversionEventsList: ConversionEventsListResponseSchema,

	audiencesGet: LooseObject,
	audiencesList: AudiencesListResponseSchema,

	audienceListsCreate: LooseObject,
	audienceListsGet: LooseObject,
	audienceListsList: AudienceListsListResponseSchema,
	audienceListsQuery: LooseObject,

	audienceExportsCreate: LooseObject,
	audienceExportsGet: LooseObject,
	audienceExportsList: AudienceExportsListResponseSchema,
	audienceExportsQuery: LooseObject,

	recurringAudienceListsCreate: LooseObject,
	recurringAudienceListsGet: LooseObject,
	recurringAudienceListsList: RecurringAudienceListsListResponseSchema,

	dataStreamsList: DataStreamsListResponseSchema,
	dataStreamsListMeasurementProtocolSecrets:
		MeasurementProtocolSecretsListResponseSchema,
	dataStreamsListEventCreateRules: EventCreateRulesListResponseSchema,
	dataStreamsListSKAdNetworkConversionValueSchemas:
		SKAdNetworkConversionValueSchemasListResponseSchema,

	linksListAdSense: AdSenseLinksListResponseSchema,
	linksListBigQuery: BigQueryLinksListResponseSchema,
	linksListFirebase: FirebaseLinksListResponseSchema,
	linksListGoogleAds: GoogleAdsLinksListResponseSchema,
	linksListDV360Advertiser: DV360AdvertiserLinksListResponseSchema,
	linksListDV360Proposals: DV360LinkProposalsListResponseSchema,
	linksListSearchAds360: SearchAds360LinksListResponseSchema,

	expandedDataSetsCreate: LooseObject,
	expandedDataSetsList: ExpandedDataSetsListResponseSchema,

	channelGroupsList: ChannelGroupsListResponseSchema,

	reportingDataListAnnotations: ReportingDataAnnotationsListResponseSchema,
	reportingDataListSubpropertyEventFilters:
		SubpropertyEventFiltersListResponseSchema,
	reportingDataListSubpropertySyncConfigs:
		SubpropertySyncConfigsListResponseSchema,

	reportsRun: LooseObject,
	reportsRunRealtime: LooseObject,
	reportsRunPivot: LooseObject,
	reportsRunFunnel: LooseObject,
	reportsBatchRun: LooseObject,
	reportsBatchRunPivot: LooseObject,
	reportsCheckCompatibility: LooseObject,
	reportsGetMetadata: LooseObject,

	reportTasksCreate: LooseObject,
	reportTasksGet: LooseObject,
	reportTasksQuery: LooseObject,
	reportTasksList: ReportTasksListResponseSchema,

	measurementProtocolSendEvents: LooseObject,
	measurementProtocolValidateEvents: LooseObject,
} as const;

export type GoogleAnalyticsEndpointInputs = {
	[K in keyof typeof GoogleAnalyticsEndpointInputSchemas]: z.infer<
		(typeof GoogleAnalyticsEndpointInputSchemas)[K]
	>;
};

export type GoogleAnalyticsEndpointOutputs = {
	[K in keyof typeof GoogleAnalyticsEndpointOutputSchemas]: z.infer<
		(typeof GoogleAnalyticsEndpointOutputSchemas)[K]
	>;
};
