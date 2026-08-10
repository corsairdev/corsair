import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Admin API - Accounts
// ─────────────────────────────────────────────────────────────────────────────

export const AccountsGetInputSchema = z.object({
  name: z.string().describe('Account resource name (format: accounts/{account_id})'),
});

export const AccountsListInputSchema = z.object({
  pageSize: z.number().optional().describe('Number of accounts to return'),
  pageToken: z.string().optional().describe('Pagination token'),
});

export const AccountsGetResponseSchema = z.record(z.unknown());
export const AccountsListResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Admin API - Properties
// ─────────────────────────────────────────────────────────────────────────────

export const PropertiesGetInputSchema = z.object({
  name: z.string().describe('Property resource name (format: properties/{property_id})'),
});

export const PropertiesListInputSchema = z.object({
  filter: z.string().optional().describe('Filter expression'),
  pageSize: z.number().optional(),
  pageToken: z.string().optional(),
});

export const PropertiesCreateInputSchema = z.object({
  displayName: z.string().describe('Display name for the property'),
  parentAccount: z.string().describe('Parent account (format: accounts/{account_id})'),
  timeZone: z.string().describe('Reporting time zone'),
  currencyCode: z.string().optional().describe('Currency code'),
});

export const PropertiesUpdateInputSchema = z.object({
  name: z.string().describe('Property resource name'),
  displayName: z.string().optional(),
  timeZone: z.string().optional(),
  currencyCode: z.string().optional(),
  updateMask: z.string().optional().describe('Comma-separated list of fields to update'),
});

export const PropertiesGetResponseSchema = z.record(z.unknown());
export const PropertiesListResponseSchema = z.record(z.unknown());
export const PropertiesCreateResponseSchema = z.record(z.unknown());
export const PropertiesUpdateResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Admin API - Custom Dimensions & Metrics
// ─────────────────────────────────────────────────────────────────────────────

export const CustomDimensionsListInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  pageSize: z.number().optional(),
  pageToken: z.string().optional(),
});

export const CustomDimensionsCreateInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  customDimension: z.object({
    parameterName: z.string().describe('Parameter name'),
    displayName: z.string().describe('Display name'),
    description: z.string().optional(),
    scope: z.enum(['EVENT', 'USER', 'ITEM']).describe('Dimension scope'),
    disallowAdsPersonalization: z.boolean().optional(),
  }),
});

export const CustomMetricsListInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  pageSize: z.number().optional(),
  pageToken: z.string().optional(),
});

export const CustomMetricsCreateInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  customMetric: z.object({
    parameterName: z.string().describe('Parameter name'),
    displayName: z.string().describe('Display name'),
    description: z.string().optional(),
    measurementUnit: z.enum(['STANDARD', 'CURRENCY', 'FEET', 'METERS', 'KILOMETERS', 'MILES']),
    scope: z.enum(['EVENT']).describe('Metric scope'),
    restrictedMetricType: z.array(z.string()).optional(),
  }),
});

export const CustomDimensionsListResponseSchema = z.record(z.unknown());
export const CustomDimensionsCreateResponseSchema = z.record(z.unknown());
export const CustomMetricsListResponseSchema = z.record(z.unknown());
export const CustomMetricsCreateResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Admin API - Data Streams
// ─────────────────────────────────────────────────────────────────────────────

export const DataStreamsListInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  pageSize: z.number().optional(),
  pageToken: z.string().optional(),
});

export const DataStreamsGetInputSchema = z.object({
  name: z.string().describe('Data stream resource name'),
});

export const DataStreamsListResponseSchema = z.record(z.unknown());
export const DataStreamsGetResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Admin API - Audiences
// ─────────────────────────────────────────────────────────────────────────────

export const AudiencesListInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  pageSize: z.number().optional(),
  pageToken: z.string().optional(),
});

export const AudiencesCreateInputSchema = z.object({
  parent: z.string().describe('Property resource name'),
  audience: z.object({
    displayName: z.string().describe('Display name'),
    description: z.string().optional(),
    membershipDurationDays: z.number().optional(),
    filterClauses: z.array(z.object({
      clauseType: z.enum(['ORed', 'ANDed']),
      simpleOperand: z.object({
        scope: z.enum(['EVENT', 'USER']),
        filterExpression: z.string().describe('CE filter expression'),
      }).optional(),
    })).optional(),
    exclusionDurationMode: z.enum(['EXCLUSION_DURATION_MODE_UNSPECIFIED', 'EXCLUDE_TEMPORARILY', 'EXCLUDE_PERMANENTLY']).optional(),
  }),
});

export const AudiencesListResponseSchema = z.record(z.unknown());
export const AudiencesCreateResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Data API - Reporting
// ─────────────────────────────────────────────────────────────────────────────

export const RunReportInputSchema = z.object({
  property: z.string().describe('Property resource name'),
  dateRanges: z.array(z.object({
    startDate: z.string().describe('Start date (YYYY-MM-DD)'),
    endDate: z.string().describe('End date (YYYY-MM-DD)'),
    name: z.string().optional().describe('Range name'),
  })),
  metrics: z.array(z.object({
    name: z.string().describe('Metric name'),
  })),
  dimensions: z.array(z.object({
    name: z.string().describe('Dimension name'),
  })).optional(),
  filters: z.array(z.object({
    fieldName: z.string(),
    value: z.string(),
    stringFilter: z.object({
      matchType: z.enum(['EXACT', 'BEGINS_WITH', 'ENDS_WITH', 'CONTAINS', 'FULL_REGEXP', 'PARTIAL_REGEXP']),
      value: z.string(),
      caseSensitive: z.boolean().optional(),
    }).optional(),
  })).optional(),
  orderBys: z.array(z.object({
    metric: z.object({ metricName: z.string() }).optional(),
    dimension: z.object({ dimensionName: z.string(), orderType: z.enum(['ALPHABETIC', 'NUMERIC', 'DIMENSION_UNSPECIFIED']) }).optional(),
    desc: z.boolean().optional(),
  })).optional(),
  limit: z.number().optional().describe('Max rows to return'),
  offset: z.number().optional(),
  keepEmptyRows: z.boolean().optional(),
  returnPropertyQuota: z.boolean().optional(),
});

export const RunReportResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Data API - Realtime Reporting
// ─────────────────────────────────────────────────────────────────────────────

export const RunRealtimeReportInputSchema = z.object({
  property: z.string().describe('Property resource name'),
  metrics: z.array(z.object({
    name: z.string().describe('Metric name'),
  })),
  dimensions: z.array(z.object({
    name: z.string().describe('Dimension name'),
  })).optional(),
  minuteRanges: z.array(z.object({
    startMinutesAgo: z.number(),
    endMinutesAgo: z.number().optional(),
    name: z.string().optional(),
  })).optional(),
  limit: z.number().optional(),
  orderBys: z.array(z.object({
    metric: z.object({ metricName: z.string() }).optional(),
    dimension: z.object({ dimensionName: z.string() }).optional(),
    desc: z.boolean().optional(),
  })).optional(),
  returnPropertyQuota: z.boolean().optional(),
});

export const RunRealtimeReportResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Measurement Protocol
// ─────────────────────────────────────────────────────────────────────────────

export const MeasurementProtocolEventInputSchema = z.object({
  measurementId: z.string().describe('Measurement ID'),
  apiSecret: z.string().describe('API secret for the stream'),
  clientId: z.string().describe('Client ID'),
  userId: z.string().optional().describe('User ID'),
  events: z.array(z.object({
    name: z.string().describe('Event name'),
    params: z.record(z.unknown()).optional().describe('Event parameters'),
  })),
  userProperties: z.record(z.unknown()).optional(),
  timestamp: z.number().optional().describe('Event timestamp (milliseconds)'),
});

export const MeasurementProtocolEventResponseSchema = z.object({
  validationMessages: z.array(z.string()).optional(),
});

export const MeasurementProtocolValidateInputSchema = z.object({
  measurementId: z.string().describe('Measurement ID'),
  apiSecret: z.string().describe('API secret'),
  clientId: z.string().describe('Client ID'),
  events: z.array(z.object({
    name: z.string(),
    params: z.record(z.unknown()).optional(),
  })),
});

export const MeasurementProtocolValidateResponseSchema = z.record(z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input/Output Types
// ─────────────────────────────────────────────────────────────────────────────

export type GA4EndpointInputs = {
  accountsGet: z.infer<typeof AccountsGetInputSchema>;
  accountsList: z.infer<typeof AccountsListInputSchema>;
  propertiesGet: z.infer<typeof PropertiesGetInputSchema>;
  propertiesList: z.infer<typeof PropertiesListInputSchema>;
  propertiesCreate: z.infer<typeof PropertiesCreateInputSchema>;
  propertiesUpdate: z.infer<typeof PropertiesUpdateInputSchema>;
  customDimensionsList: z.infer<typeof CustomDimensionsListInputSchema>;
  customDimensionsCreate: z.infer<typeof CustomDimensionsCreateInputSchema>;
  customMetricsList: z.infer<typeof CustomMetricsListInputSchema>;
  customMetricsCreate: z.infer<typeof CustomMetricsCreateInputSchema>;
  dataStreamsList: z.infer<typeof DataStreamsListInputSchema>;
  dataStreamsGet: z.infer<typeof DataStreamsGetInputSchema>;
  audiencesList: z.infer<typeof AudiencesListInputSchema>;
  audiencesCreate: z.infer<typeof AudiencesCreateInputSchema>;
  runReport: z.infer<typeof RunReportInputSchema>;
  runRealtimeReport: z.infer<typeof RunRealtimeReportInputSchema>;
  measurementProtocolEvent: z.infer<typeof MeasurementProtocolEventInputSchema>;
  measurementProtocolValidate: z.infer<typeof MeasurementProtocolValidateInputSchema>;
};

export type GA4EndpointOutputs = {
  accountsGet: z.infer<typeof AccountsGetResponseSchema>;
  accountsList: z.infer<typeof AccountsListResponseSchema>;
  propertiesGet: z.infer<typeof PropertiesGetResponseSchema>;
  propertiesList: z.infer<typeof PropertiesListResponseSchema>;
  propertiesCreate: z.infer<typeof PropertiesCreateResponseSchema>;
  propertiesUpdate: z.infer<typeof PropertiesUpdateResponseSchema>;
  customDimensionsList: z.infer<typeof CustomDimensionsListResponseSchema>;
  customDimensionsCreate: z.infer<typeof CustomDimensionsCreateResponseSchema>;
  customMetricsList: z.infer<typeof CustomMetricsListResponseSchema>;
  customMetricsCreate: z.infer<typeof CustomMetricsCreateResponseSchema>;
  dataStreamsList: z.infer<typeof DataStreamsListResponseSchema>;
  dataStreamsGet: z.infer<typeof DataStreamsGetResponseSchema>;
  audiencesList: z.infer<typeof AudiencesListResponseSchema>;
  audiencesCreate: z.infer<typeof AudiencesCreateResponseSchema>;
  runReport: z.infer<typeof RunReportResponseSchema>;
  runRealtimeReport: z.infer<typeof RunRealtimeReportResponseSchema>;
  measurementProtocolEvent: z.infer<typeof MeasurementProtocolEventResponseSchema>;
  measurementProtocolValidate: z.infer<typeof MeasurementProtocolValidateResponseSchema>;
};

export const GA4EndpointInputSchemas = {
  accountsGet: AccountsGetInputSchema,
  accountsList: AccountsListInputSchema,
  propertiesGet: PropertiesGetInputSchema,
  propertiesList: PropertiesListInputSchema,
  propertiesCreate: PropertiesCreateInputSchema,
  propertiesUpdate: PropertiesUpdateInputSchema,
  customDimensionsList: CustomDimensionsListInputSchema,
  customDimensionsCreate: CustomDimensionsCreateInputSchema,
  customMetricsList: CustomMetricsListInputSchema,
  customMetricsCreate: CustomMetricsCreateInputSchema,
  dataStreamsList: DataStreamsListInputSchema,
  dataStreamsGet: DataStreamsGetInputSchema,
  audiencesList: AudiencesListInputSchema,
  audiencesCreate: AudiencesCreateInputSchema,
  runReport: RunReportInputSchema,
  runRealtimeReport: RunRealtimeReportInputSchema,
  measurementProtocolEvent: MeasurementProtocolEventInputSchema,
  measurementProtocolValidate: MeasurementProtocolValidateInputSchema,
} as const;

export const GA4EndpointOutputSchemas = {
  accountsGet: AccountsGetResponseSchema,
  accountsList: AccountsListResponseSchema,
  propertiesGet: PropertiesGetResponseSchema,
  propertiesList: PropertiesListResponseSchema,
  propertiesCreate: PropertiesCreateResponseSchema,
  propertiesUpdate: PropertiesUpdateResponseSchema,
  customDimensionsList: CustomDimensionsListResponseSchema,
  customDimensionsCreate: CustomDimensionsCreateResponseSchema,
  customMetricsList: CustomMetricsListResponseSchema,
  customMetricsCreate: CustomMetricsCreateResponseSchema,
  dataStreamsList: DataStreamsListResponseSchema,
  dataStreamsGet: DataStreamsGetResponseSchema,
  audiencesList: AudiencesListResponseSchema,
  audiencesCreate: AudiencesCreateResponseSchema,
  runReport: RunReportResponseSchema,
  runRealtimeReport: RunRealtimeReportResponseSchema,
  measurementProtocolEvent: MeasurementProtocolEventResponseSchema,
  measurementProtocolValidate: MeasurementProtocolValidateResponseSchema,
} as const;
