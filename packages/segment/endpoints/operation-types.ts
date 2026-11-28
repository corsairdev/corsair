// Generated from Segment's OpenAPI spec (https://docs.segmentapis.com/,
// fetched 2026-11-28); segment-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type SegmentJsonValue =
	| null
	| boolean
	| number
	| string
	| SegmentJsonValue[]
	| { [key: string]: SegmentJsonValue | undefined };

export const SEGMENT_OPERATION_IDS = [
	'activations.batchQuery',
	'activations.create',
	'activations.delete',
	'activations.get',
	'activations.list',
	'activations.update',
	'audiences.create',
	'audiences.createPreview',
	'audiences.delete',
	'audiences.destinations.add',
	'audiences.destinations.list',
	'audiences.destinations.listSupported',
	'audiences.destinations.remove',
	'audiences.destinations.update',
	'audiences.get',
	'audiences.getPreview',
	'audiences.list',
	'audiences.listConsumers',
	'audiences.run',
	'audiences.schedules.create',
	'audiences.schedules.delete',
	'audiences.schedules.get',
	'audiences.schedules.list',
	'audiences.schedules.update',
	'audiences.update',
	'auditTrail.list',
	'catalog.getDestination',
	'catalog.getSource',
	'catalog.getWarehouse',
	'catalog.listDestinations',
	'catalog.listSources',
	'catalog.listWarehouses',
	'computedTraits.create',
	'computedTraits.delete',
	'computedTraits.get',
	'computedTraits.list',
	'computedTraits.update',
	'credentials.create',
	'credentials.delete',
	'credentials.get',
	'credentials.list',
	'credentials.listConsumers',
	'credentials.update',
	'customerInsights.createDownload',
	'dbt.triggerModelSync',
	'deliveryOverview.getFailedDelivery',
	'deliveryOverview.getFailedOnIngest',
	'deliveryOverview.getFilteredAtDestination',
	'deliveryOverview.getFilteredAtSource',
	'deliveryOverview.getSuccessfulDelivery',
	'deliveryOverview.getSuccessfullyReceived',
	'destinations.create',
	'destinations.delete',
	'destinations.filters.create',
	'destinations.filters.delete',
	'destinations.filters.get',
	'destinations.filters.list',
	'destinations.filters.preview',
	'destinations.filters.update',
	'destinations.get',
	'destinations.getDeliveryMetrics',
	'destinations.list',
	'destinations.subscriptions.create',
	'destinations.subscriptions.delete',
	'destinations.subscriptions.get',
	'destinations.subscriptions.list',
	'destinations.subscriptions.update',
	'destinations.update',
	'events.getVolume',
	'filters.create',
	'filters.delete',
	'filters.get',
	'filters.list',
	'filters.update',
	'functions.create',
	'functions.delete',
	'functions.deploy',
	'functions.get',
	'functions.getVersion',
	'functions.insertInstances.create',
	'functions.insertInstances.delete',
	'functions.insertInstances.get',
	'functions.insertInstances.list',
	'functions.insertInstances.update',
	'functions.list',
	'functions.listVersions',
	'functions.restoreVersion',
	'functions.update',
	'invites.create',
	'invites.delete',
	'invites.list',
	'labels.create',
	'labels.delete',
	'labels.list',
	'livePlugins.create',
	'livePlugins.deleteCode',
	'livePlugins.getLatest',
	'profilesSync.create',
	'profilesSync.delete',
	'profilesSync.list',
	'profilesSync.listSelectiveSyncs',
	'profilesSync.update',
	'profilesSync.updateSelectiveSync',
	'regulations.create',
	'regulations.createForCloudSource',
	'regulations.createForSource',
	'regulations.get',
	'regulations.list',
	'regulations.listForSource',
	'regulations.listSuppressions',
	'reverseEtl.models.create',
	'reverseEtl.models.delete',
	'reverseEtl.models.get',
	'reverseEtl.models.list',
	'reverseEtl.models.update',
	'reverseEtl.syncs.cancel',
	'reverseEtl.syncs.create',
	'reverseEtl.syncs.get',
	'reverseEtl.syncs.list',
	'roles.list',
	'sources.addLabels',
	'sources.create',
	'sources.createWriteKey',
	'sources.delete',
	'sources.get',
	'sources.getSchemaSettings',
	'sources.list',
	'sources.listConnectedDestinations',
	'sources.listConnectedWarehouses',
	'sources.removeWriteKey',
	'sources.replaceLabels',
	'sources.update',
	'sources.updateSchemaSettings',
	'spaces.get',
	'spaces.list',
	'spaces.schema.listEntityPaths',
	'spaces.schema.listEntityProperties',
	'spaces.schema.listEntityPropertySampleValues',
	'spaces.schema.listEventProperties',
	'spaces.schema.listEventPropertySampleValues',
	'spaces.schema.listEvents',
	'spaces.schema.listTraitSampleValues',
	'spaces.schema.listTraits',
	'testing.echo',
	'tracking.alias',
	'tracking.batch',
	'tracking.group',
	'tracking.identify',
	'tracking.page',
	'tracking.screen',
	'tracking.track',
	'trackingPlans.addSource',
	'trackingPlans.create',
	'trackingPlans.delete',
	'trackingPlans.get',
	'trackingPlans.list',
	'trackingPlans.listRules',
	'trackingPlans.listSources',
	'trackingPlans.removeRules',
	'trackingPlans.removeSource',
	'trackingPlans.replaceRules',
	'trackingPlans.update',
	'trackingPlans.updateRules',
	'transformations.create',
	'transformations.delete',
	'transformations.get',
	'transformations.list',
	'transformations.update',
	'usage.getDailyApiCalls',
	'usage.getDailyApiCallsBySource',
	'usage.getDailyMtu',
	'usage.getDailyMtuBySource',
	'userGroups.addPermissions',
	'userGroups.addUsers',
	'userGroups.create',
	'userGroups.delete',
	'userGroups.get',
	'userGroups.list',
	'userGroups.listInvites',
	'userGroups.listUsers',
	'userGroups.removeUsers',
	'userGroups.replacePermissions',
	'userGroups.replaceUsers',
	'userGroups.update',
	'users.addPermissions',
	'users.delete',
	'users.get',
	'users.list',
	'users.listGroups',
	'users.replacePermissions',
	'warehouses.addSourceConnection',
	'warehouses.create',
	'warehouses.delete',
	'warehouses.get',
	'warehouses.getAdvancedSyncSchedule',
	'warehouses.getConnectionState',
	'warehouses.list',
	'warehouses.listConnectedSources',
	'warehouses.listSelectiveSyncs',
	'warehouses.listSourceSyncs',
	'warehouses.listSyncs',
	'warehouses.removeSourceConnection',
	'warehouses.replaceAdvancedSyncSchedule',
	'warehouses.update',
	'warehouses.updateSelectiveSync',
	'warehouses.validate',
	'workspaces.get',
] as const;

export type SegmentOperationId = (typeof SEGMENT_OPERATION_IDS)[number];

/** Defines the advanced sync schedule for a Warehouse. */
export type SegmentAdvancedWarehouseSyncScheduleV1InputInput = {
	/** A list that contains the times when syncs should occur. */
	times: Array<SegmentWarehouseAdvancedSyncV1Input>;
	/** A TZ-database timezone for this sync schedule. */
	timezone: string;
};

/** Defines a label that you may apply to resources within a Workspace. */
export type SegmentAllowedLabelBetaInput = {
	/** The key identifier for this label. */
	key: string;
	/** The value of this label. */
	value: string;
	/** A description of what this label represents. */
	description?: string;
};

export type SegmentAudienceDefinitionInput = {
	/** The target entity relationship slug, only applicable for linked audiences. Use ```profile``` when the targeting the profile. Note that the value defaults to profile if not specified. Also note, that the value will be returned as null if the target entity is removed from the data graph. */
	targetEntity?: string | null;
	/** The query language string defining the audience segmentation criteria. For guidance on using the query language, see the [Segment documentation site](https://segment.com/docs/api/public-api/query-language). */
	query: string;
};

export type SegmentAudienceDefinitionWithoutTargetEntityInput = {
	/** The query language string defining the audience segmentation criteria. For guidance on using the query language, see the [Segment documentation site](https://segment.com/docs/api/public-api/query-language). */
	query: string;
};

export type SegmentAudienceOptionsInput = {
	/** Determines whether data prior to the audience being created is included when determining audience membership. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including historical data and… */
	includeHistoricalData?: boolean;
	/** The set of profile external identifiers being used to determine audience membership. Profiles will only be considered for audience membership if the profile has at least one external id whose key matches a value in this set. If unspecified, a default set of external identifiers will be used:… */
	filterByExternalIds?: Array<string>;
	/** If specified, the value of this field indicates the number of days (specified from the date the audience was created) that event data will be included from when determining audience membership. If not specified, the default is set to the maximum event window size, or 7 days if no window… */
	backfillEventDataDays?: number;
};

/** Options which should be applied when segmenting audience previews. */
export type SegmentCreateAudiencePreviewOptionsInput = {
	/** The set of profile external identifiers being used to determine audience preview membership. Profiles will only be considered for audience preview membership if the profile has at least one external id whose key matches a value in this set. If unspecified, a default set of external identifiers… */
	filterByExternalIds?: Array<string>;
	/** If specified, the value of this field indicates the number of days (specified from the date the audience preview was created) that event data will be included from when determining audience preview membership. If not specified, the default is set to the maximum event window size, or 7 days if no… */
	backfillEventDataDays?: number;
};

/** A key-value object that contains type-specific settings for a Credential, plus a required `type` discriminator (for example `Snowflake`, `Redshift`) that determines which fields are expected. */
export type SegmentCredentialSettingsV1Input = Record<string, SegmentJsonValue>;

/** The `DeliveryOverviewDestinationFilterBy` object is a map of the filterable fields and their values. */
export type SegmentDeliveryOverviewDestinationFilterByInput = {
	/** A list of strings of discard reasons. See [Discard Record Documentation](https://segment.com/docs/connections/delivery-overview/#troubleshooting) for valid error codes. */
	discardReason?: Array<string>;
	/** A list of strings of event names. */
	eventName?: Array<string>;
	/** A list of strings of event types. Valid options are: `alias`, `group`, `identify`, `page`, `screen`, and `track`. */
	eventType?: Array<string>;
	/** A list of strings of app versions. */
	appVersion?: Array<string>;
	/** A list of strings of subscription IDs for Actions Destinations. */
	subscriptionId?: Array<string>;
	/** A list of strings of event context IDs from a Linked Audience mapping/activation. */
	activationId?: Array<string>;
	/** A list of strings of audience IDs for a Linked Audience. */
	audienceId?: Array<string>;
	/** A list of strings of space IDs for a Linked Audience. */
	spaceId?: Array<string>;
};

/** The `DeliveryOverviewSourceFilterBy` object is a map of the filterable fields and their values. */
export type SegmentDeliveryOverviewSourceFilterByInput = {
	/** A list of strings of discard reasons. See [Discard Record Documentation](https://segment.com/docs/connections/delivery-overview/#troubleshooting) for valid error codes. */
	discardReason?: Array<string>;
	/** A list of strings of event names. */
	eventName?: Array<string>;
	/** A list of strings of event types. Valid options are: `alias`, `group`, `identify`, `page`, `screen`, and `track`. */
	eventType?: Array<string>;
	/** A list of strings of app versions. */
	appVersion?: Array<string>;
};

/** The `DeliveryOverviewSuccessfullyReceivedFilterBy` object is a map of the filterable fields and their values for the Successfully Received pipeline step. */
export type SegmentDeliveryOverviewSuccessfullyReceivedFilterByInput = {
	/** A list of strings of event names. */
	eventName?: Array<string>;
	/** A list of strings of event types. Valid options are: `alias`, `group`, `identify`, `page`, `screen`, and `track`. */
	eventType?: Array<string>;
	/** A list of strings of app versions. */
	appVersion?: Array<string>;
};

/** Represents a Destination filter action. */
export type SegmentDestinationFilterActionV1Input = {
	/** The kind of Transformation to apply to any matched properties. */
	type: 'ALLOW_PROPERTIES' | 'DROP' | 'DROP_PROPERTIES' | 'SAMPLE';
	/** A dictionary of paths to object keys that this filter applies to. The literal string '' represents the top level of the object. */
	fields?: Record<string, SegmentJsonValue>;
	/** A decimal between 0 and 1 used for 'sample' type events and influences the likelihood of sampling to occur. */
	percent?: number;
	/** The JSON path to a property within a payload object from which Segment generates a deterministic sampling rate. */
	path?: string;
};

/** The Destination Input Object. */
export type SegmentDestinationInputInput = {
	/** The Destination id. Use the List Destinations endpoint to look up available ids. */
	id: string;
	/** The category of the Destination. Possible values: destination, warehouse. */
	type: string;
};

/** Destination Subscription Configuration. */
export type SegmentDestinationSubscriptionConfigurationInput = {
	/** The id for the action that Segment should perform on the Destination. The action cannot be changed once the Activation exists. When updating, this field is still required, but supplying a different value has no effect. */
	actionId: string;
	/** The action/mapping settings. */
	settings?: SegmentDestinationSubscriptionFieldsInput;
};

/** Represents settings used to configure an action subscription. */
export type SegmentDestinationSubscriptionFieldsInput = Record<
	string,
	SegmentJsonValue
>;

/** The input parameters for updating a Destination subscription. */
export type SegmentDestinationSubscriptionUpdateInputInput = {
	/** The user-defined name for the subscription. */
	name?: string;
	/** The fql statement. */
	trigger?: string;
	/** Is the subscription enabled. */
	enabled?: boolean;
	/** The fields used for configuring this action. */
	settings?: SegmentDestinationSubscriptionFieldsInput;
	/** (Reverse ETL only) The reverse ETL model to attach this subscription to. */
	reverseETLModelId?: string;
	/** (Reverse ETL only) The schedule for the subscription being attached to ReverseETL model. Schedule configuration is at https://docs.segmentapis.com/tag/Reverse-ETL#section/Sync-schedule-JSON-configuration. */
	reverseETLSchedule?: SegmentReverseEtlScheduleDefinitionInput;
};

export type SegmentEventPropertyTypeInput = 'CONTEXT' | 'PROPERTY';

export type SegmentFQLDefinedPropertyV1Input = {
	/** The FQL expression used to compute the property. */
	fql: string;
	/** The new property name. */
	propertyName: string;
};

export type SegmentFunctionSettingV1Input = {
	/** The name of this Function Setting. */
	name: string;
	/** The label for this Function Setting. */
	label: string;
	/** A description of this Function Setting. */
	description: string;
	/** The type of this Function Setting. */
	type: 'ARRAY' | 'BOOLEAN' | 'STRING' | 'TEXT_MAP';
	/** Whether this Function Setting is required. */
	required: boolean;
	/** Whether this Function Setting contains sensitive information. */
	sensitive: boolean;
};

export type SegmentGroupSourceSettingsV1Input = {
	/** Enable to allow unplanned group traits. Config API note: equal to `allowUnplannedGroupTraits`. */
	allowUnplannedTraits?: boolean;
	/** Enable to allow group traits on violations. Config API note: equal to `allowGroupTraitsOnViolations`. */
	allowTraitsOnViolations?: boolean;
	/** The common group event on violations. Config API note: equal to `commonGroupEventOnViolations`. */
	commonEventOnViolations?: 'ALLOW' | 'BLOCK' | 'OMIT_TRAITS';
};

export type SegmentHashPropertiesConfigurationInput = {
	/** Which algorithm to use to hash to properties. */
	algorithm: string;
	/** Optional key to hash with. */
	key?: string;
	/** Optional encoding to use for the hashing. */
	encoding?: 'BASE16' | 'BASE64' | 'BASE64URL' | 'HEX';
	/** The paths to the properties to be hashed. */
	paths: Array<string>;
};

/** The identifier sync configuration input. */
export type SegmentIDSyncConfigurationInputInput = {
	/** The id type to sync. Examples: user_id, email, anonymous_id. */
	externalId: string;
	/** The rule for selecting which identifiers to sync from a profile. Possible values: first: Syncs only the oldest recorded value. last: Syncs only the most recently updated value. all: Syncs every value found on the profile (sends multiple events). */
	strategy: string;
	/** Optional destination-specific identifier to map to (for example, "Email_Address_c"). */
	mapTo?: string;
};

export type SegmentIdentifySourceSettingsV1Input = {
	/** Enable to allow unplanned identify traits. Config API note: equal to `allowUnplannedIdentifyTraits`. */
	allowUnplannedTraits?: boolean;
	/** Enable to allow identify traits on violations. Config API note: equal to `allowIdentifyTraitsOnViolations`. */
	allowTraitsOnViolations?: boolean;
	/** The common identify event on violations. Config API note: equal to `commonIdentifyEventOnViolations`. */
	commonEventOnViolations?: 'ALLOW' | 'BLOCK' | 'OMIT_TRAITS';
};

/** Defines a permission to apply to the user in an invite. */
export type SegmentInvitePermissionV1Input = {
	/** The id of the role. */
	roleId: string;
	/** The resources to grant the invited users access to. */
	resources?: Array<SegmentResourceV1Input>;
	/** The labels that determine which resources to grant users access to. */
	labels?: Array<SegmentAllowedLabelBetaInput>;
};

/** Defines an invitation to join a Workspace. */
export type SegmentInviteV1Input = {
	/** The invited user's email to attach the permissions to. */
	email: string;
	/** The permissions to attach to the invited user. */
	permissions?: Array<SegmentInvitePermissionV1Input>;
};

/** A label lets Workspace owners assign permissions to users, and grant these users access to groups. A Workspace owner may use labels to grant users access to groups of resources. When you add a label to a Source or Personas Spaces, any users granted access to that label gain access to those… */
export type SegmentLabelV1Input = {
	/** The key that represents the name of this label. */
	key: string;
	/** The value associated with the key of this label. */
	value: string;
	/** An optional description of the purpose of this label. */
	description?: string;
};

/** Sort criteria input for list audience consumers. */
export type SegmentListAudienceConsumersSortInputInput = {
	/** Field to sort by. */
	field: 'CREATED_AT' | 'NAME' | 'UPDATED_AT';
	/** Sort direction (ascending or descending). */
	direction: 'ASC' | 'DESC';
};

/** Search criteria input for list audience consumers. */
export type SegmentListAudienceSearchInputInput = {
	/** Field to filter by. */
	type: 'DEFINITION' | 'KEY' | 'NAME';
	/** Text to match against the selected field (max 255 characters). When searching by KEY, a prefix match is used. For all other options, a full wildcard search will be used. */
	query: string;
};

/** Fork of Autobahn's PaginationInput. Count is limited to 200 in this fork. Pagination parameters. Every resource that returns a list of items in its `Output` object may contain a `PaginationInput` in its `Input` object. Required, though some of its fields are optional. */
export type SegmentListAudiencesPaginationInputInput = {
	/** The page to request. Acceptable values to use here are in PaginationOutput objects, in the `current`, `next`, and `previous` keys. Consumers of the API must treat this value as opaque. */
	cursor?: string;
	/** The number of items to retrieve in a page, between 1 and 200. */
	count: number;
};

/** Pagination for list filters. */
export type SegmentListFiltersPaginationInputInput = {
	/** The offset. */
	cursor?: number;
	/** The number of items to retrieve in a page, between 1 and 10. */
	count: number;
};

/** Pagination parameters. Every resource that returns a list of items in its `Output` object may contain a `PaginationInput` in its `Input` object. Required, though some of its fields are optional. */
export type SegmentPaginationInputInput = {
	/** The page to request. Acceptable values to use here are in PaginationOutput objects, in the `current`, `next`, and `previous` keys. Consumers of the API must treat this value as opaque. */
	cursor?: string;
	/** The number of items to retrieve in a page, between 1 and 1000. */
	count: number;
};

/** Configures a periodic schedule interval. */
export type SegmentPeriodicConfigInput = {
	/** Go duration format string, only supporting units "d" (days), "h" (hours) and "m" (minutes). Acceptable values are: - 15m - 30m - 1h - 2h - 4h - 6h - 8h - 12h - 1d */
	interval: string;
};

/** The input for a permission, associated with a resource and/or labels. */
export type SegmentPermissionInputV1Input = {
	/** The role id of this permission. */
	roleId: string;
	/** The resources to link the selected role to. */
	resources: Array<SegmentPermissionResourceV1Input>;
};

/** The most basic representation of a resource belonging to a set of permissions. */
export type SegmentPermissionResourceV1Input = {
	/** The id of this resource. */
	id: string;
	/** The type for this resource. */
	type: 'FUNCTION' | 'SOURCE' | 'SPACE' | 'WAREHOUSE' | 'WORKSPACE';
	/** The labels that further refine access to this resource. Labels are exclusive to Workspace-level permissions. */
	labels?: Array<SegmentAllowedLabelBetaInput>;
};

/** The Personalization Input Object. */
export type SegmentPersonalizationInputInput = {
	/** The profile traits included in the event sent to the Destination. Applies to both Classic and Linked Audiences. For a Classic audience this is the only form of personalization available, whereas a Linked Audience can also personalize on entities. */
	profile?: {
		/** The profile traits to include in the event sent to the Destination. */
		properties?: Array<string>;
		/** Maps a profile trait to the name it should be sent under. Each key is a trait, and each value is the name used in the event. */
		mapping?: { [key: string]: string };
	};
	/** The entities, and the properties of each entity, to include in the event sent to the Destination. Only applicable to Linked Audiences. Providing entities for a Classic audience returns a 400 error, as Classic audiences support profile properties only. */
	entities?: Array<SegmentPersonalizationInputEntityInput>;
	/** Sync entity property changes to the Destination. Only applicable if activationType is "Audience Membership Changed". */
	syncEntityPropertyChanges?: boolean;
};

/** The Personalization Input Entity. */
export type SegmentPersonalizationInputEntityInput = {
	/** The entity properties to include in the event sent to the Destination. */
	properties: Array<string>;
	/** The relationship slug for the entity. */
	relationshipSlug: string;
};

/** A simplified Destination filter that includes the if and actions for a DestinationFilterV1. */
export type SegmentPreviewDestinationFilterV1Input = {
	/** A FQL statement which determines if the provided filter's actions will apply to the provided JSON payload. The literal string "all" will result in this filter to all events. For guidance on using FQL, see the Segment documentation site. */
	if: string;
	/** The filtering action to take on events that match the "if" statement. Action types must be one of: "drop", "allow_properties", "drop_properties" or "sample". */
	actions: Array<SegmentDestinationFilterActionV1Input>;
};

export type SegmentPropertyRenameV1Input = {
	/** The old name of the property. */
	oldName: string;
	/** The new name to rename the property. */
	newName: string;
};

export type SegmentPropertyValueTransformationV1Input = {
	/** The property paths. The maximum number of paths is 10. */
	propertyPaths: Array<string>;
	/** The new value of the property paths. */
	propertyValue: string;
};

/** Represents the parameters needed to identify a rule on the backend-side. */
export type SegmentRemoveRuleV1Input = {
	/** The type for this Tracking Plan rule. */
	type: 'COMMON' | 'GROUP' | 'IDENTIFY' | 'PAGE' | 'SCREEN' | 'TRACK';
	/** Key to this rule (free-form string like 'Button clicked'). */
	key?: string;
	/** Version of this rule. */
	version: number;
};

/** Represents a permission's resource. */
export type SegmentResourceV1Input = {
	/** The id of this resource. */
	id: string;
	/** The kind of resource this permission applies to. */
	type: 'FUNCTION' | 'SOURCE' | 'SPACE' | 'WAREHOUSE' | 'WORKSPACE';
};

export type SegmentReverseEtlCronScheduleConfigInput = {
	/** 5 field cron string expression. The cron expression must be larger than 15 minutes. */
	spec: string;
	/** Timezone respected by the cron string. Format must be in IANA Timezone Identifier. Example: 'America/Los_Angeles'. */
	timezone: string;
};

/** Definition for a schedule triggered by dbt Cloud job events. */
export type SegmentReverseEtlDbtCloudScheduleConfigInput = {
	/** The dbt Cloud job used to trigger a sync for a Reverse ETL Connection. */
	jobId: string;
	/** The dbt Cloud account where the job belongs to. */
	accountId: string;
};

/** Definition for periodic interval. */
export type SegmentReverseEtlPeriodicScheduleConfigInput = {
	/** Duration is specified as a string, EG: 15m, 3h25m30s. */
	interval: string;
};

/** Defines a configuration object used for scheduling, which can vary depending on the configured strategy. */
export type SegmentReverseEtlScheduleDefinitionInput = {
	/** Strategy supports: Periodic, Specific Days, Manual, CRON and DBT_CLOUD. */
	strategy: 'CRON' | 'DBT_CLOUD' | 'MANUAL' | 'PERIODIC' | 'SPECIFIC_DAYS';
	/** Config contains interval duration in case of periodic or day and hours in case of specific_days. Empty if strategy is MANUAL. */
	config?:
		| (
				| SegmentReverseEtlPeriodicScheduleConfigInput
				| SegmentReverseEtlSpecificTimeScheduleConfigInput
				| SegmentReverseEtlCronScheduleConfigInput
				| SegmentReverseEtlDbtCloudScheduleConfigInput
		  )
		| null;
};

/** Definition for specific day and time schedule. Days is list of numbered day of the week and hours is a list of hour of the day. The corresponding Timezone is also input as string. */
export type SegmentReverseEtlSpecificTimeScheduleConfigInput = {
	/** Days of the week. */
	days: Array<number>;
	/** Hours of the day. */
	hours: Array<number>;
	/** Timezone for the specified times. */
	timezone: string;
};

/** Represents a rule to add to a Tracking Plan. */
export type SegmentRuleInputV1Input = {
	/** The type for this Tracking Plan rule. */
	type: 'COMMON' | 'GROUP' | 'IDENTIFY' | 'PAGE' | 'SCREEN' | 'TRACK';
	/** Key to this rule (free-form string like 'Button clicked'). */
	key?: string;
	/** JSON Schema of this rule. */
	jsonSchema: SegmentJsonValue;
	/** Version of this rule. */
	version: number;
};

/** A key-value object that contains instance-specific settings for a Source. The `options` field in the Source metadata defines the schema of this object. */
export type SegmentSourceSettingsV1Input = Record<string, SegmentJsonValue>;

/** Overrides the enabled or disabled state of the specified collection and / or properties within the schema. */
export type SegmentSpaceWarehouseSchemaOverrideInput = {
	/** The collection within the Source. */
	collection: string;
	/** Represents the overridden enabled state for the listed collection and / or properties. */
	enabled: boolean;
	/** A map that contains the properties within the collection to which the Warehouse should sync. */
	property?: string;
};

/** Configures a schedule for specific days and times. */
export type SegmentSpecificDaysConfigInput = {
	/** Days of week for schedule (0=Sunday, 6=Saturday). */
	days: Array<number>;
	/** Hours of day for schedule (0-23). */
	hours: Array<number>;
	/** TZ database time zone identifier; for example, America/New_York. */
	timezone: string;
};

export type SegmentTrackSourceSettingsV1Input = {
	/** Enable to allow unplanned track events. Config API note: equal to `allowUnplannedTrackEvents`. */
	allowUnplannedEvents?: boolean;
	/** Enable to allow unplanned track event properties. Config API note: equal to `allowUnplannedTrackEventProperties`. */
	allowUnplannedEventProperties?: boolean;
	/** Allow track event on violations. Config API note: equal to `allowTrackEventOnViolations`. */
	allowEventOnViolations?: boolean;
	/** Enable to allow track properties on violations. Config API note: equal to `allowTrackEventPropertiesOnViolations`. */
	allowPropertiesOnViolations?: boolean;
	/** The common track event on violations. Config API note: equal to `commonTrackEventOnViolations`. */
	commonEventOnViolations?: 'ALLOW' | 'BLOCK' | 'OMIT_PROPERTIES';
};

export type SegmentTraitDefinitionInput = {
	/** The underlying data type being aggregated for this computed trait. Possible values: users, accounts. */
	type: 'ACCOUNTS' | 'USERS';
	/** The query language string defining the computed trait aggregation criteria. For guidance on using the query language, see the [Segment documentation site](https://segment.com/docs/api/public-api/query-language). */
	query: string;
};

export type SegmentTraitOptionsInput = {
	/** Determines whether data prior to the computed trait being created is included when determining the computed trait value. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including historical… */
	includeHistoricalData?: boolean;
	/** Determines whether anonymous users should be included when determining the computed trait value. */
	includeAnonymousUsers?: boolean;
	/** If specified, the value of this field indicates the number of days, specified from the date the audience was created, that event data will be included from when determining audience membership. If unspecified, defer to the value of `includeHistoricalData` to determine whether historical data is… */
	backfillDurationDays?: number;
};

export type SegmentUpsertRuleV1Input = {
	/** This rule's new intended key. */
	newKey?: string;
	/** The type for this Tracking Plan rule. */
	type: 'COMMON' | 'GROUP' | 'IDENTIFY' | 'PAGE' | 'SCREEN' | 'TRACK';
	/** Key to this rule (free-form string like 'Button clicked'). */
	key?: string;
	/** JSON Schema of this rule. */
	jsonSchema: SegmentJsonValue;
	/** Version of this rule. */
	version: number;
};

/** Determines the time of day at which a Warehouse should sync. */
export type SegmentWarehouseAdvancedSyncV1Input = {
	/** The hour of day for which to enable/disable a sync, between 0 and 23. */
	hourOfDay: number;
	/** Enable to the sync at the specified hour. */
	enabled: boolean;
};

/** A key-value object that contains instance-specific Warehouse settings. */
export type SegmentWarehouseSettingsV1Input = Record<string, SegmentJsonValue>;

/** A key-value object that contains the settings for a Warehouse, derived from its associated Credential. */
export type SegmentWarehouseSettingsV2Input = Record<string, SegmentJsonValue>;

/** Represents the override for a Source/collection/property? path to apply to a Warehouse. */
export type SegmentWarehouseSyncOverrideV1Input = {
	/** The id of the Source this schema item applies to. */
	sourceId: string;
	/** The collection the schema item override applies to. */
	collection?: string;
	/** Enable to apply the override. */
	enabled: boolean;
	/** A property within the collection to which the override applies. */
	property?: string;
};

/** A snapshot of the number of API calls for a given Workspace. */
export type SegmentAPICallSnapshotV1 = {
	/** A bigint of the number of API calls in this snapshot. */
	apiCalls?: string | null;
	/** Timestamp of this snapshot within the billing cycle in the ISO-8601 format. */
	timestamp?: string | null;
};

/** A permission governing access to a resource. */
export type SegmentAccessPermissionV1 = {
	/** The id of the role that applies to this permission. */
	roleId?: string | null;
	/** The name of the role that applies to this permission. */
	roleName?: string | null;
	/** The resources included with this permission. */
	resources?: Array<SegmentPermissionResourceV1> | null;
};

/** A class that encapsulates the complete activation output with full details. */
export type SegmentActivationOutput = {
	/** The activation id. */
	id?: string | null;
	/** Activation Enabled Status. */
	enabled?: boolean | null;
	/** The WORKSPACE id. */
	workspaceId?: string | null;
	/** The space id. */
	spaceId?: string | null;
	/** The audience id. */
	audienceId?: string | null;
	/** The connection id. */
	connectionId?: string | null;
	/** Determines when an event is sent to the Destination. Possible values: - **Audience Entered**: Sends an event when a profile or entity enters the audience. - **Audience Exited**: Sends an event when a profile or entity exits the audience. - **Audience Membership Changed**: Sends an event for both… */
	activationType?: string | null;
	/** Activation name. For Warehouse Destinations, this is the table name. */
	activationName?: string | null;
	/** Human-readable label for the activation. Only present for Warehouse Destinations that have a display name configured. When null, the activationName serves as the label. */
	displayName?: string | null;
	/** The data points used to enrich the event. Defines which profile traits and/or entity properties are included in the event sent to the Destination. For Action Destinations, any traits or properties specified here must also be included in the destinationMapping to define which Destination fields… */
	personalization?: SegmentPersonalizationOutput | null;
	/** The action and data mapping configured for the Destination. Only present for Action Destinations. Action id: The action performed on the Destination. Settings/Mapping: How event data populates specific fields in the Destination. */
	destinationMapping?: SegmentDestinationSubscriptionConfiguration | null;
	/** Indicates if a full resync is currently pending or in progress. */
	performResync?: boolean | null;
	/** When the activation was created, as an ISO-8601 string. */
	createdAt?: string | null;
	/** When the activation was last updated, as an ISO-8601 string. Advances on every update, including changes to only the personalization or destinationMapping. */
	updatedAt?: string | null;
};

/** Activation output for create. */
export type SegmentAddActivationToAudienceAlphaOutput = {
	activation?: SegmentActivationOutput | null;
};

/** Output of adding a schedule to an audience. */
export type SegmentAddAudienceScheduleToAudienceOutput = {
	/** The audience schedule. */
	audienceSchedule?: SegmentAudienceSchedule | null;
};

/** Response indicating whether the connection was successful. */
export type SegmentAddConnectionFromSourceToWarehouseV1Output = {
	/** The status of the connection between the Source and Warehouse. */
	status?: string | null;
};

export type SegmentAddDestinationToAudienceAlphaOutput = {
	/** The connection that was created. */
	connection?: {
		/** The id of the connection that was created. */
		id?: string | null;
	} | null;
	/** Identifier sync configuration. Defines which external ids to sync and their selection strategies. Maximum 5 items allowed. If omitted, the default will be last email and last user_id, or all email and all user_id depending on the Destination. */
	idSyncConfiguration?: Array<SegmentIDSyncConfigurationInput> | null;
	/** The settings that a Destination requires to create audiences on a third-party platform. These settings are Destination-specific. Use the List Supported Destinations from Audience endpoint to find the required connection settings. */
	connectionSettings?: SegmentJsonValue | null;
};

/** Applies an existing label to an existing Source. */
export type SegmentAddLabelsToSourceV1Output = {
	/** All labels applied to the Source. */
	labels?: Array<SegmentLabelV1> | null;
};

/** Returns the group's permissions, including the added permissions. */
export type SegmentAddPermissionsToUserGroupV1Output = {
	/** The updated set of permissions assigned to the user group. */
	permissions?: Array<SegmentAccessPermissionV1> | null;
};

/** Returns the user's permissions, including the added permissions. */
export type SegmentAddPermissionsToUserV1Output = {
	/** The new permissions. */
	permissions?: Array<SegmentAccessPermissionV1> | null;
};

/** Connects a Source to a Tracking Plan. */
export type SegmentAddSourceToTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** Returns the updated user group. */
export type SegmentAddUsersToUserGroupV1Output = {
	/** The updated the user group. */
	userGroup?: SegmentUserGroupV1 | null;
};

/** Defines the advanced sync schedule for a Warehouse. */
export type SegmentAdvancedWarehouseSyncScheduleV1Output = {
	/** A list that contains the times when syncs should occur. */
	times?: Array<SegmentWarehouseAdvancedSyncV1> | null;
	/** A TZ-database timezone for this sync schedule. */
	timezone?: string | null;
};

/** Defines a label that you may apply to resources within a Workspace. */
export type SegmentAllowedLabelBeta = {
	/** The key identifier for this label. */
	key?: string | null;
	/** The value of this label. */
	value?: string | null;
	/** A description of what this label represents. */
	description?: string | null;
};

/** Associated entities. */
export type SegmentAssociatedEntities = {
	[key: string]: Array<SegmentEntityDetails>;
};

export type SegmentAudienceComputeCadence = {
	/** The cadence type on which the audience's membership is computed. If 'BATCH', the audience is computed on a periodic basis. If 'REALTIME', the audience is continously computed. */
	type?: string | null;
};

export type SegmentAudienceDefinition = {
	/** The target entity relationship slug, only applicable for linked audiences. Use ```profile``` when the targeting the profile. Note that the value defaults to profile if not specified. Also note, that the value will be returned as null if the target entity is removed from the data graph. */
	targetEntity?: string | null;
	/** The query language string defining the audience segmentation criteria. For guidance on using the query language, see the [Segment documentation site](https://segment.com/docs/api/public-api/query-language). */
	query?: string | null;
};

export type SegmentAudienceOptions = {
	/** Determines whether data prior to the audience being created is included when determining audience membership. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including historical data and… */
	includeHistoricalData?: boolean | null;
	/** The set of profile external identifiers being used to determine audience membership. Profiles will only be considered for audience membership if the profile has at least one external id whose key matches a value in this set. If unspecified, a default set of external identifiers will be used:… */
	filterByExternalIds?: Array<string> | null;
	/** If specified, the value of this field indicates the number of days (specified from the date the audience was created) that event data will be included from when determining audience membership. If not specified, the default is set to the maximum event window size, or 7 days if no window… */
	backfillEventDataDays?: number | null;
};

export type SegmentAudienceOptionsWithLookback = {
	/** The set of profile external identifiers being used to determine audience membership. Profiles will only be considered for audience membership if the profile has at least one external id whose key matches a value in this set. */
	filterByExternalIds?: Array<string> | null;
	/** Determines whether data prior to the audience being created is included when determining audience membership. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including historical data and… */
	includeHistoricalData?: boolean | null;
	/** If specified, the value of this field indicates the number of days (specified from the date the audience was created) that event data will be included from when determining audience membership. If not specified, the default is set to the maximum event window size, or 7 days if no window… */
	backfillEventDataDays?: number | null;
};

/** An audience preview. */
export type SegmentAudiencePreview = {
	/** Unique identifier for tracking and retrieving results of an audience preview. */
	id?: string | null;
	/** The audience type of the preview. Possible values: USERS, ACCOUNTS, LINKED. */
	audienceType?: string | null;
	/** Definition that was used to calculate the audience preview. */
	definition?: SegmentAudienceDefinition | null;
	/** Options that were used to calculate the audience preview. */
	options?: SegmentReadAudiencePreviewOptions | null;
	/** Status for the audience preview. */
	status?: string | null;
	/** Sampled result membership for the audience preview. Only has a value if the status is 'COMPLETED'. */
	results?: Array<SegmentAudiencePreviewResult> | null;
	/** Result membership size for the audience preview. Only has a value if status is 'COMPLETED'. */
	size?: SegmentAudienceSize | null;
	/** Explanation of why the audience preview failed. Only has a value if status is 'FAILED'. */
	failureReason?: string | null;
};

/** Result membership object for an audience preview with `audienceType: ACCOUNTS`. */
export type SegmentAudiencePreviewAccountResult = {
	/** Account id. */
	id?: string | null;
};

/** Result membership object for an audience preview with `audienceType: USERS` or `audienceType: LINKED`. */
export type SegmentAudiencePreviewEntitiesResult = {
	/** Entity id. */
	id?: string | null;
	/** The entity primary key column name. */
	idProperty?: string | null;
	/** The entity relationship slug. */
	relationshipSlug?: string | null;
	/** The entity properties. */
	properties?: SegmentEntityProperties | null;
	/** Related entities that are one level deeper will only be returned if those entities are referenced in the audience definition. */
	entities?: Record<string, SegmentJsonValue> | null;
	/** Related list of profiles. */
	profiles?: Array<SegmentProfile> | null;
	/** Indicates if only a subset of the profiles associated with the entity were returned. */
	profilesTruncated?: boolean | null;
};

/** Identifier for an audience preview. */
export type SegmentAudiencePreviewIdentifier = {
	/** Unique identifier for tracking and retrieving results of an audience preview. */
	id?: string | null;
};

/** Result membership object for an audience preview with `audienceType: USERS` or `audienceType: LINKED`. */
export type SegmentAudiencePreviewProfileResult = {
	/** Segment id. */
	id?: string | null;
	/** The entities associated with the profile. Will only have a value if the audience preview has `audienceType: LINKED` and entities are referenced in the audience preview's definition. */
	entities?: SegmentAssociatedEntities | null;
};

export type SegmentAudiencePreviewResult =
	| SegmentAudiencePreviewProfileResult
	| SegmentAudiencePreviewAccountResult
	| SegmentAudiencePreviewEntitiesResult;

/** Run information for force execute audience output. */
export type SegmentAudienceRunInfo = {
	/** The workflow id of the execution workflow that was started. */
	id?: string | null;
};

/** Defines an Audience Schedule. */
export type SegmentAudienceSchedule = {
	/** Distinct identifier for the schedule. */
	id?: string | null;
	/** Strategy of the audience schedule (periodic or specific days). */
	strategy?: string | null;
	/** Configuration for PERIODIC or SPECIFIC_DAYS strategies. */
	config?: (SegmentPeriodicConfig | SegmentSpecificDaysConfig) | null;
	/** The next scheduled execution time (RFC3339). */
	nextExecution?: string | null;
};

export type SegmentAudienceSize = {
	/** The total audience membership count. Refer to the type field to determine the unit for this field (profiles, accounts, etc). */
	count?: number | null;
	/** The unit type for the count(s) being returned. */
	type?: string | null;
	/** The unique audience membership count. */
	uniqueCount?: number | null;
};

/** Defines an Audience. */
export type SegmentAudienceSummary = {
	/** Audience id. */
	id?: string | null;
	/** Space id for the audience. */
	spaceId?: string | null;
	/** Name of the audience. */
	name?: string | null;
	/** Description of the audience. */
	description?: string | null;
	/** Key for the audience. */
	key?: string | null;
	/** Enabled/disabled status for the audience. */
	enabled?: boolean | null;
	/** Query language definition and type. */
	definition?: SegmentAudienceDefinition | null;
	/** Status for the audience. Possible values: Backfilling, Computing, Disabled, Error, Failed, Live, Locked, Not Computing, Preparing, Awaiting Destinations. */
	status?: string | null;
	/** User id who created the audience. */
	createdBy?: string | null;
	/** User id who last updated the audience. */
	updatedBy?: string | null;
	/** Date the audience was created. */
	createdAt?: string | null;
	/** Date the audience was last updated. */
	updatedAt?: string | null;
	/** Denotes the type of audience product. */
	audienceType?: string | null;
	/** Options which should be applied when segmenting audiences. */
	options?: SegmentAudienceOptions | null;
};

export type SegmentAudienceSummaryWithAudienceTypeAndLookback = {
	/** Details the cadence on which the audience's membership is computed. */
	computeCadence?: SegmentAudienceComputeCadence | null;
	/** Object containing details about audience membership size(s). */
	size?: SegmentAudienceSize | null;
	/** Options which should be applied when segmenting audiences. */
	options?: SegmentAudienceOptionsWithLookback | null;
	/** List of schedules for the audience. */
	schedules?: Array<SegmentAudienceSchedule> | null;
	/** Audience id. */
	id?: string | null;
	/** Space id for the audience. */
	spaceId?: string | null;
	/** Name of the audience. */
	name?: string | null;
	/** Description of the audience. */
	description?: string | null;
	/** Key for the audience. */
	key?: string | null;
	/** Enabled/disabled status for the audience. */
	enabled?: boolean | null;
	/** Query language definition and type. */
	definition?: SegmentAudienceDefinition | null;
	/** Status for the audience. Possible values: Backfilling, Computing, Disabled, Error, Failed, Live, Locked, Not Computing, Preparing, Awaiting Destinations. */
	status?: string | null;
	/** User id who created the audience. */
	createdBy?: string | null;
	/** User id who last updated the audience. */
	updatedBy?: string | null;
	/** Date the audience was created. */
	createdAt?: string | null;
	/** Date the audience was last updated. */
	updatedAt?: string | null;
	/** Denotes the type of audience product. */
	audienceType?: string | null;
};

/** Represents an Audit Trail event. */
export type SegmentAuditEventV1 = {
	/** Unique identifier for this audit trail event. */
	id?: string | null;
	/** The timestamp of this event in ISO-8601 format. */
	timestamp?: string | null;
	/** The type of this event. */
	type?: string | null;
	/** The user or API token that triggered this event. */
	actor?: string | null;
	/** The email of the user that triggered this event. */
	actorEmail?: string | null;
	/** The identifier of the resource affected by this event. */
	resourceId?: string | null;
	/** The kind of resource affected by this event. */
	resourceType?: string | null;
	/** The name of the resource affected by this event. */
	resourceName?: string | null;
};

/** Output for listing activations in bulk across many audiences. */
export type SegmentBatchQueryActivationsForSpaceAlphaOutput = {
	/** Activation results across all valid requested audiences. */
	activations?: Array<SegmentActivationOutput> | null;
	/** Audience IDs from the request that could not be resolved, with why - for example not found, or wrong space. When `audienceIds` was omitted from the request (space-scan mode), this never contains a caller-supplied bad id - there isn't one to be wrong - but it can still contain per-activation… */
	errors?: Array<{
		audienceId?: string | null;
		message?: string | null;
	}> | null;
	/** Present when pagination input is present in the `audienceIds`-provided path. Always present in the space-scan path (`audienceIds` omitted). */
	pagination?: SegmentPaginationOutput | null;
};

/** The breakdown of a metric. */
export type SegmentBreakdownBeta = {
	/** The name of the metric. */
	metricName?: string | null;
	/** Number of occurrences of the metric. */
	value?: number | null;
};

/** CancelReverseETLSyncForModelOutput either will return an error or a "CANCELLING" status. */
export type SegmentCancelReverseETLSyncForModelOutput = {
	/** The id of the Model. */
	modelId?: string | null;
	/** The id of the Sync. */
	syncId?: string | null;
	/** A place holder for a machine-friendly category for an error, if applicable. - "SyncAlreadyCanceled" - "SyncFinishedCannotCancel" */
	errorCode?: string | null;
	/** A place holder for a human-readable description of the error, if applicable. - "sync already canceled" - "sync already finished". */
	errorMessage?: string | null;
	/** If no error, status will be CANCELLING, as the extract/load might take some time to cancel. */
	status?: string | null;
};

/** Defines a Computed trait. */
export type SegmentComputedTraitSummary = {
	/** Computed trait id. */
	id?: string | null;
	/** Space id for the computed trait. */
	spaceId?: string | null;
	/** Name of the computed trait. */
	name?: string | null;
	/** Description of the computed trait. */
	description?: string | null;
	/** Key for the computed trait. */
	key?: string | null;
	/** Enabled/disabled status for the computed trait. */
	enabled?: boolean | null;
	/** Query language definition and type. */
	definition?: SegmentComputedTraitsDefinition | null;
	/** Status for the computed trait. Possible values: Backfilling, Computing, Failed, Live, Awaiting Destinations, Disabled. */
	status?: string | null;
	/** User id who created the computed trait. */
	createdBy?: string | null;
	/** User id who last updated the computed trait. */
	updatedBy?: string | null;
	/** The timestamp of the computed trait's creation. */
	createdAt?: string | null;
	/** The timestamp of the computed trait's last change. */
	updatedAt?: string | null;
	/** Options which should be applied when segmenting traits. */
	options?: SegmentTraitOptions | null;
};

/** Defines an computed trait definition. */
export type SegmentComputedTraitsDefinition = {
	/** The query language string defining the computed trait aggregation criteria. For guidance on using the query language, see the [Segment documentation site](https://segment.com/docs/api/public-api/query-language). */
	query?: string | null;
	/** The underlying data type being aggregated for this computed trait. Possible values: users, accounts. */
	type?: string | null;
};

/** The contact info for Integration Owners. */
export type SegmentContact = {
	/** Name of this contact. */
	name?: string | null;
	/** Email of this contact. */
	email?: string | null;
	/** Role of this contact. */
	role?: string | null;
	/** Whether this is a primary contact. */
	isPrimary?: boolean | null;
};

/** Audience output for create. */
export type SegmentCreateAudienceOutput = {
	/** The audience summary output. */
	audience?: SegmentAudienceSummary | null;
};

/** Output when creating an audience preview. */
export type SegmentCreateAudiencePreviewOutput = {
	/** The audience preview identifier. The audience preview results are calculated asyncronously and can be obtained by polling the getAudiencePreview endpoint. */
	audiencePreview?: SegmentAudiencePreviewIdentifier | null;
};

/** The output of a create Cloud Source regulation call. */
export type SegmentCreateCloudSourceRegulationV1Output = {
	/** The id of the created regulation. */
	regulateId?: string | null;
};

/** Computed Trait output for create. */
export type SegmentCreateComputedTraitAlphaOutput = {
	/** The computed trait summary output. */
	computedTrait?: SegmentComputedTraitSummary | null;
};

/** Returns the newly created Credential. */
export type SegmentCreateCredentialV1Output = {
	/** The newly created Credential. */
	credential?: SegmentCredentialV1 | null;
};

/** Output for the createDbtModelSyncTriggerBySourceId endpoint. */
export type SegmentCreateDbtModelSyncTriggerOutput = {
	/** The dbt model sync trigger. */
	dbtModelSyncTrigger?: SegmentDbtModelSyncTrigger | null;
};

/** Returns a newly created Destination subscription. */
export type SegmentCreateDestinationSubscriptionAlphaOutput = {
	/** The Destination subscription. */
	destinationSubscription?: SegmentDestinationSubscription | null;
};

/** Creates a new Destination. */
export type SegmentCreateDestinationV1Output = {
	/** The created Destination. */
	destination?: SegmentDestinationV1 | null;
};

export type SegmentCreateDownloadAlphaOutput = {
	/** An object containing the downloaded data. */
	download?: SegmentDownload | null;
};

/** Output for CreateDestinationFiltersV1. */
export type SegmentCreateFilterForDestinationV1Output = {
	/** The newly created Destination filter. */
	filter?: SegmentDestinationFilterV1 | null;
};

/** Output for CreateFilter. */
export type SegmentCreateFilterForSpaceOutput = {
	filter?: SegmentFilter | null;
};

/** Updates the deployment for a Source Function instance. */
export type SegmentCreateFunctionDeploymentV1Output = {
	/** The status of the operation. */
	functionDeployment?: {
		status?: string | null;
	} | null;
};

/** Create a Function. */
export type SegmentCreateFunctionV1Output = {
	/** A Function object. */
	function?: SegmentFunctionV1 | null;
};

/** Creates an insert Function instance. */
export type SegmentCreateInsertFunctionInstanceAlphaOutput = {
	/** The created instance. */
	insertFunctionInstance?: SegmentInsertFunctionInstanceAlpha | null;
};

/** Returns the emails of the invited users. */
export type SegmentCreateInvitesV1Output = {
	/** The list of emails invited to the Workspace. */
	emails?: Array<string> | null;
};

/** Result of creating a new label in the current Workspace. */
export type SegmentCreateLabelV1Output = {
	/** The newly created label. */
	label?: SegmentLabelV1 | null;
};

/** Output for CreateLivePlugin. */
export type SegmentCreateLivePluginAlphaOutput = {
	/** The created Live Plugin. */
	livePlugin?: SegmentLivePluginsAlpha | null;
};

/** Returns the newly created Warehouse. */
export type SegmentCreateProfilesWarehouseAlphaOutput = {
	/** The newly created Warehouse. */
	profilesWarehouse?: SegmentProfilesWarehouseAlpha | null;
};

/** Output for triggering a manual sync for a RETL connection. */
export type SegmentCreateReverseETLManualSyncOutput = {
	/** The reverse ETL connection job that was manually started. */
	reverseETLManualSync?: SegmentReverseETLManualSyncJobOutput | null;
};

/** Defines the results of creating a Model. */
export type SegmentCreateReverseEtlModelOutput = {
	/** The created Model. */
	reverseEtlModel?: SegmentReverseEtlModel | null;
};

/** The output of a create Source regulation call. */
export type SegmentCreateSourceRegulationV1Output = {
	/** The id of the created regulation. */
	regulateId?: string | null;
};

/** Returns a newly created Source. */
export type SegmentCreateSourceV1Output = {
	/** The newly created Source. */
	source?: SegmentSourceV1 | null;
};

/** Result of a CreateTrackingPlan call. */
export type SegmentCreateTrackingPlanV1Output = {
	/** The created Tracking Plan. */
	trackingPlan?: SegmentTrackingPlanV1 | null;
};

/** The output of a created Transformation. */
export type SegmentCreateTransformationV1Output = {
	/** The created Transformation. */
	transformation?: SegmentTransformationV1 | null;
};

/** Returns the newly created user group. */
export type SegmentCreateUserGroupV1Output = {
	/** The newly created user group. */
	userGroup?: SegmentUserGroupV1 | null;
};

/** Returns the status of a Warehouse connection settings after an attempt to connect to it. */
export type SegmentCreateValidationInWarehouseV2Output = {
	/** Represents the status for the current connection settings. */
	status?: string | null;
};

/** Returns the newly created Warehouse. */
export type SegmentCreateWarehouseV2Output = {
	/** The newly created Warehouse. */
	warehouse?: SegmentWarehouseV2 | null;
};

/** The output of a create Workspace regulation call. */
export type SegmentCreateWorkspaceRegulationV1Output = {
	/** The id of the created regulation. */
	regulateId?: string | null;
};

/** Returns the updated Source. */
export type SegmentCreateWriteKeyForSourceAlphaOutput = {
	/** The Source with a new write key appended to it. */
	source?: SegmentSourceAlpha | null;
};

/** A key-value object that contains type-specific settings for a Credential, plus a required `type` discriminator (for example `Snowflake`, `Redshift`) that determines which fields are expected. */
export type SegmentCredentialSettingsV1 = Record<string, SegmentJsonValue>;

/** Defines a reusable Credential that can be used to connect one or more Warehouses to a data Warehouse. */
export type SegmentCredentialV1 = {
	/** The id of the Credential. */
	id?: string | null;
	/** The id of the Workspace that owns this Credential. */
	workspaceId?: string | null;
	/** A human-readable name for this Credential. */
	name?: string | null;
	/** The settings associated with this Credential. `settings.type` determines the Credential type (for example `Snowflake` or `Redshift`) and which other settings fields are expected. Sensitive fields are redacted in responses. */
	settings?: SegmentCredentialSettingsV1 | null;
	/** The time this Credential was created. */
	createdAt?: string | null;
	/** The time this Credential was last updated. */
	updatedAt?: string | null;
};

/** Defines the dbt Model Sync Trigger. */
export type SegmentDbtModelSyncTrigger = {
	/** The id of the dbt model sync. */
	id?: string | null;
	/** The Source id that was triggered. */
	sourceId?: string | null;
	/** The status of the trigger. */
	status?: string | null;
};

/** Returns the status of a Credential deletion. */
export type SegmentDeleteCredentialV1Output = {
	/** The status of the Credential deletion operation. */
	status?: string | null;
};

/** Returns the status of a Destination deletion. */
export type SegmentDeleteDestinationV1Output = {
	/** The status of the Warehouse deletion operation. */
	status?: string | null;
};

/** Output for DeleteFilterById. */
export type SegmentDeleteFilterByIdOutput = {
	/** Filter deleted by filter id. */
	deleted?: boolean | null;
};

/** Delete a single Function. */
export type SegmentDeleteFunctionV1Output = {
	/** The status of the operation. */
	status?: string | null;
};

/** Delete an insert Function instance. */
export type SegmentDeleteInsertFunctionInstanceAlphaOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Returns the status of the removal operation. */
export type SegmentDeleteInvitesV1Output = {
	/** The status of the invite deletion operation. */
	status?: string | null;
};

/** Returns the status of a label deletion. */
export type SegmentDeleteLabelV1Output = {
	/** The status of the label deletion operation. */
	status?: string | null;
};

/** Output for DeleteLivePlugin. */
export type SegmentDeleteLivePluginCodeAlphaOutput = {
	/** The status of the delete operation. */
	status?: string | null;
};

/** Defines the result of getting a Model. */
export type SegmentDeleteReverseEtlModelOutput = {
	/** The result of the deletion. */
	status?: string | null;
};

/** Returns the status of a Source deletion. */
export type SegmentDeleteSourceV1Output = {
	/** The status of the Source deletion operation. */
	status?: string | null;
};

/** Result of a DeleteTrackingPlan call. */
export type SegmentDeleteTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** The output of delete Transformation. */
export type SegmentDeleteTransformationV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** Returns the status of the completed deletion operation. */
export type SegmentDeleteUserGroupV1Output = {
	/** A flag indicating the status of a successful deletion operation. */
	status?: string | null;
};

/** Returns the status of the removal operation. */
export type SegmentDeleteUsersV1Output = {
	/** A flag that indicates the status of a successful deletion operation. */
	status?: string | null;
};

/** Returns the status of a Warehouse deletion. */
export type SegmentDeleteWarehouseV1Output = {
	/** The status of the Warehouse deletion operation. */
	status?: string | null;
};

/** Defines the summary of delivery metrics for a Destination. */
export type SegmentDeliveryMetricsSummaryBeta = {
	/** The Source id. Config API note: analogous to `parent`. */
	sourceId?: string | null;
	/** The Destination metadata id. */
	destinationMetadataId?: string | null;
	/** The summary of event delivery metrics for the requested Destination. */
	metrics?: Array<SegmentMetricBeta> | null;
};

/** Series within DeliveryOverviewMetricsDataset. */
export type SegmentDeliveryOverviewMetricsDatapoint = {
	/** The timestamp corresponding to the beginning of the window given by the requested granularity. */
	time?: string | null;
	/** Holds the number of events within the specified granularity and group By options. */
	count?: number | null;
	/** The number of retried events that were successfully delivered. */
	retryCount?: number | null;
};

/** Dataset within GetDeliveryOverviewMetricsBetaOutput. */
export type SegmentDeliveryOverviewMetricsDataset = {
	/** The name of the event if group By[] included 'event Name' in the request. */
	eventName?: string | null;
	/** The version of the app if group By[] included 'app Version' in the request. */
	appVersion?: string | null;
	/** The event type if group By[] included 'event Type' in the request. */
	eventType?: string | null;
	/** The discard reason for dropped events if group By[] included 'discard Reason' in the request. */
	discardReason?: string | null;
	/** Holds the count of all event counts over the time frame of the series. */
	total?: number | null;
	/** A list of the event counts broken down by the requested granularity, time frame, and group By options. */
	series?: Array<SegmentDeliveryOverviewMetricsDatapoint> | null;
	/** The number of events successfully delivered upon retry. */
	totalRetryCount?: number | null;
};

/** Represents a Destination filter action. */
export type SegmentDestinationFilterActionV1 = {
	/** The kind of Transformation to apply to any matched properties. */
	type?: string | null;
	/** A dictionary of paths to object keys that this filter applies to. The literal string '' represents the top level of the object. */
	fields?: Record<string, SegmentJsonValue> | null;
	/** A decimal between 0 and 1 used for 'sample' type events and influences the likelihood of sampling to occur. */
	percent?: number | null;
	/** The JSON path to a property within a payload object from which Segment generates a deterministic sampling rate. */
	path?: string | null;
};

/** Represents a Destination filter. */
export type SegmentDestinationFilterV1 = {
	/** The unique id of this filter. */
	id?: string | null;
	/** The id of the Source associated with this filter. */
	sourceId?: string | null;
	/** The id of the Destination associated with this filter. */
	destinationId?: string | null;
	/** A condition that defines whether to apply this filter to a payload. */
	if?: string | null;
	/** A list of actions this filter performs. */
	actions?: Array<SegmentDestinationFilterActionV1> | null;
	/** A title for this filter. */
	title?: string | null;
	/** A description for this filter. */
	description?: string | null;
	/** When set to true, this filter is active. */
	enabled?: boolean | null;
	/** The timestamp of this filter's creation. */
	createdAt?: string | null;
	/** The timestamp of this filter's last change. */
	updatedAt?: string | null;
};

/** Represents a field used in configuring an action. */
export type SegmentDestinationMetadataActionFieldV1 = {
	/** The primary key of the field. */
	id?: string | null;
	/** The order this particular field is (used in the UI for displaying the fields in a specified order). */
	sortOrder?: number | null;
	/** A unique machine-readable key for the field. Should ideally match the expected key in the action\'s API request. */
	fieldKey?: string | null;
	/** A human-readable label for this value. */
	label?: string | null;
	/** The data type for this value. */
	type?: string | null;
	/** A human-readable description of this value. You can use Markdown. */
	description?: string | null;
	/** An example value displayed but not saved. */
	placeholder?: string | null;
	/** A default value that is saved the first time an action is created. */
	defaultValue?: SegmentJsonValue | null;
	/** Whether this field is required. */
	required?: boolean | null;
	/** Whether a user can provide multiples of this field. */
	multiple?: boolean | null;
	/** A list of machine-readable value/label pairs to populate a static dropdown. */
	choices?: SegmentJsonValue | null;
	/** Whether this field should execute a dynamic request to fetch choices to populate a dropdown. When true, `choices` is ignored. */
	dynamic?: boolean | null;
	/** Whether this field allows null values. */
	allowNull?: boolean | null;
	/** Whether the action field should be hidden or not. */
	hidden?: boolean | null;
};

/** Represents an Action, a building block of behavior that can be performed by the Destination. */
export type SegmentDestinationMetadataActionV1 = {
	/** The primary key of the action. */
	id?: string | null;
	/** A machine-readable key unique to the action definition. */
	slug?: string | null;
	/** A human-readable name for the action. */
	name?: string | null;
	/** A human-readable description of the action. May include Markdown. */
	description?: string | null;
	/** The platform on which this action runs. */
	platform?: string | null;
	/** Whether the action should be hidden. */
	hidden?: boolean | null;
	/** The default value used as the trigger when connecting this action. */
	defaultTrigger?: string | null;
	/** The fields expected in order to perform the action. */
	fields?: Array<SegmentDestinationMetadataActionFieldV1> | null;
};

/** Represents a component this Destination provides. */
export type SegmentDestinationMetadataComponentV1 = {
	/** The component type. */
	type?: string | null;
	/** Link to the repository hosting the code for this component. */
	code?: string | null;
	/** The owner of this component. Either 'SEGMENT' or 'PARTNER'. */
	owner?: string | null;
};

/** Represents features that a given Destination supports. */
export type SegmentDestinationMetadataFeaturesV1 = {
	/** This Destination's support level for cloud mode instances. The values '0' and 'NONE', and '1' and 'SINGLE' are equivalent. */
	cloudModeInstances?: string | null;
	/** This Destination's support level for device mode instances. Support for multiple device mode instances is currently not planned. The values '0' and 'NONE', and '1' and 'SINGLE' are equivalent. */
	deviceModeInstances?: string | null;
	/** Whether this Destination supports replays. */
	replay?: boolean | null;
	/** Whether this Destination supports browser unbundling. */
	browserUnbundling?: boolean | null;
	/** Whether this Destination supports public browser unbundling. */
	browserUnbundlingPublic?: boolean | null;
};

/** Represents methods that a given Destination supports. */
export type SegmentDestinationMetadataMethodsV1 = {
	/** Identifies if the Destination supports the `pageview` method. */
	pageview?: boolean | null;
	/** Identifies if the Destination supports the `identify` method. */
	identify?: boolean | null;
	/** Identifies if the Destination supports the `alias` method. */
	alias?: boolean | null;
	/** Identifies if the Destination supports the `track` method. */
	track?: boolean | null;
	/** Identifies if the Destination supports the `group` method. */
	group?: boolean | null;
};

/** Represents platforms that a given Destination supports. */
export type SegmentDestinationMetadataPlatformsV1 = {
	/** Whether this Destination supports browser events. */
	browser?: boolean | null;
	/** Whether this Destination supports server events. */
	server?: boolean | null;
	/** Whether this Destination supports mobile events. */
	mobile?: boolean | null;
	/** Whether this Destination supports Warehouse events. */
	warehouse?: boolean | null;
	/** Whether this Destination supports cloud app object events. */
	cloudAppObject?: boolean | null;
	/** Whether this Destination supports linked audiences. */
	linkedAudiences?: boolean | null;
};

/** Represents a set of defaults for a Destination subscription. */
export type SegmentDestinationMetadataSubscriptionPresetV1 = {
	/** The unique identifier for the Destination Action to trigger. */
	actionId?: string | null;
	/** The name of the subscription. */
	name?: string | null;
	/** The default settings for action fields. */
	fields?: Record<string, SegmentJsonValue> | null;
	/** FQL string that describes what events should trigger an action. See https://segment.com/docs/config-api/fql/ for more information regarding Segment's Filter Query Language (FQL). */
	trigger?: string | null;
};

/** Represents a Destination within Segment. A Destination is a target for Segment to forward data to, and represents a tool or storage Destination. */
export type SegmentDestinationMetadataV1 = {
	/** The id of the Destination metadata. Config API note: analogous to `name`. */
	id?: string | null;
	/** The user-friendly name of the Destination. Config API note: equal to `displayName`. */
	name?: string | null;
	/** The description of the Destination. */
	description?: string | null;
	/** The slug used to identify the Destination in the Segment app. */
	slug?: string | null;
	/** The Destination's logos. */
	logos?: SegmentLogosBeta | null;
	/** Options configured for the Destination. */
	options?: Array<SegmentIntegrationOptionBeta> | null;
	/** Support status of the Destination. */
	status?: string | null;
	/** A list of names previously used by the Destination. */
	previousNames?: Array<string> | null;
	/** A list of categories with which the Destination is associated. */
	categories?: Array<string> | null;
	/** A website URL for this Destination. */
	website?: string | null;
	/** A list of components this Destination provides. */
	components?: Array<SegmentDestinationMetadataComponentV1> | null;
	/** Features that this Destination supports. Config API note: holds `browserUnbundling` fields. */
	supportedFeatures?: SegmentDestinationMetadataFeaturesV1 | null;
	/** Methods that this Destination supports. Config API note: equal to `methods`. */
	supportedMethods?: SegmentDestinationMetadataMethodsV1 | null;
	/** Platforms from which the Destination receives events. Config API note: equal to `platforms`. */
	supportedPlatforms?: SegmentDestinationMetadataPlatformsV1 | null;
	/** Actions available for the Destination. */
	actions?: Array<SegmentDestinationMetadataActionV1> | null;
	/** Predefined Destination subscriptions that can optionally be applied when connecting a new instance of the Destination. */
	presets?: Array<SegmentDestinationMetadataSubscriptionPresetV1> | null;
	/** Contact info for Integration Owners. */
	contacts?: Array<SegmentContact> | null;
	/** Partner Owned flag. */
	partnerOwned?: boolean | null;
	/** A list of supported regions for this Destination. */
	supportedRegions?: Array<string> | null;
	/** The list of regional endpoints for this Destination. */
	regionEndpoints?: Array<string> | null;
	/** This Destination's support for multiple instance types. */
	multiInstanceSupportedVersion?: string | null;
};

/** DestinationStatus represents status of each Destination in a stream. */
export type SegmentDestinationStatusV1 = {
	name?: string | null;
	id?: string | null;
	status?: string | null;
	errString?: string | null;
	finishedAt?: string | null;
};

export type SegmentDestinationSubscription = {
	/** The unique identifier for the subscription. */
	id?: string | null;
	/** The name of the subscription. */
	name?: string | null;
	/** The unique identifier for the Destination action to trigger. */
	actionId?: string | null;
	/** The URL-friendly key for the associated Destination action. */
	actionSlug?: string | null;
	/** The associated Destination instance id. */
	destinationId?: string | null;
	/** Is the subscription enabled. */
	enabled?: boolean | null;
	/** The customer settings for action fields. */
	settings?: SegmentDestinationSubscriptionFields | null;
	/** FQL string that describes what events should trigger a Destination action. */
	trigger?: string | null;
	/** The unique identifier for the linked ReverseETLModel, if this part of a Reverse ETL connection. */
	modelId?: string | null;
	/** The schedule for the Reverse ETL subscription. */
	reverseETLSchedule?: SegmentReverseEtlScheduleDefinition | null;
};

/** Destination Subscription Configuration. */
export type SegmentDestinationSubscriptionConfiguration = {
	/** The id for the action that Segment should perform on the Destination. The action cannot be changed once the Activation exists. When updating, this field is still required, but supplying a different value has no effect. */
	actionId?: string | null;
	/** The action/mapping settings. */
	settings?: SegmentDestinationSubscriptionFields | null;
};

/** Represents settings used to configure an action subscription. */
export type SegmentDestinationSubscriptionFields = Record<
	string,
	SegmentJsonValue
>;

/** Business tools or apps that you can connect to the data flowing through Segment. This is equal to the Destination object in Config API, with the following fields omitted: - catalogId - createTime - updateTime - connectionMode. */
export type SegmentDestinationV1 = {
	/** The unique identifier of this instance of a Destination. Config API note: analogous to `name`. */
	id?: string | null;
	/** The name of this instance of a Destination. Config API note: equal to `displayName`. */
	name?: string | null;
	/** Whether this instance of a Destination receives data. */
	enabled?: boolean | null;
	/** The metadata of the Destination of which this Destination is an instance of. For example, Google Analytics or Amplitude. */
	metadata?: SegmentDestinationMetadataV1 | null;
	/** The id of a Source connected to this instance of a Destination. Config API note: analogous to `parent`. */
	sourceId?: string | null;
	/** The collection of settings associated with a Destination. Config API note: equal to `config`. */
	settings?: Record<string, SegmentJsonValue> | null;
};

export type SegmentDownload = {
	/** List of presigned URLs from S3. */
	urls?: Array<string> | null;
};

/** Echo response. */
export type SegmentEchoV1Output = {
	/** The HTTP method used for this round-trip. Currently, this endpoint supports only `get` and `post` methods. */
	method?: string | null;
	/** The string passed in the `message` input field. */
	message?: string | null;
	/** The request's HTTP headers. */
	headers?: Record<string, SegmentJsonValue> | null;
};

/** Entity details. */
export type SegmentEntityDetails = {
	/** The entity primary key value. */
	id?: string | null;
	/** The entity primary key column name. */
	idProperty?: string | null;
	/** The entity relationship slug. */
	relationshipSlug?: string | null;
	/** The entity properties. */
	properties?: SegmentEntityProperties | null;
	/** Related entities that are one level deeper will only be returned if those entities are referenced in the audience definition. */
	entities?: Record<string, SegmentJsonValue> | null;
};

export type SegmentEntityPathAlpha = {
	/** The id of the entity path. */
	id?: string | null;
	/** The display name of the entity. */
	entityName?: string | null;
	/** The display name of the path (root → node). */
	pathName?: string | null;
	/** The slug of the entity. */
	entitySlug?: string | null;
	/** Ordered slugs for all relationships from root to this node. */
	relationshipSlugs?: Array<string> | null;
	/** Slugs of child relationships from this node. */
	childRelationshipSlugs?: Array<string> | null;
	/** Full slug path from root to this node, colon-delimited (for example "rel-a:rel-b"). Empty string for root nodes. */
	parentRelationshipSlugPath?: string | null;
};

/** Entity properties. */
export type SegmentEntityProperties = Record<string, SegmentJsonValue>;

export type SegmentEntityPropertyAlpha = {
	/** Property name. */
	name?: string | null;
	/** Whether this is a primary key. */
	primaryKey?: boolean | null;
	/** The data type of the property. */
	dataType?: string | null;
	/** Sample values. Only present when includeSampleValues is true. */
	samples?: Array<string> | null;
};

export type SegmentEventAlpha = {
	/** Event name. */
	name?: string | null;
	/** Event type. */
	type?: SegmentEventType | null;
	/** ISO timestamp of when the event was last seen. */
	lastSeenAt?: string | null;
};

export type SegmentEventPropertyAlpha = {
	/** Property name. */
	name?: string | null;
	/** Property type. */
	type?: SegmentEventPropertyType | null;
	/** The event this property belongs to. */
	eventName?: string | null;
	/** ISO timestamp of when the property was last seen. */
	lastSeenAt?: string | null;
	/** Sample values for this property. Only present when includeSampleValues is true. */
	samples?: Array<string> | null;
};

export type SegmentEventPropertyType = string;

/** Source represents a Segment Source. */
export type SegmentEventSourceV1 = {
	/** The id of the Source where the events came from. */
	id?: string | null;
	/** The name of the Source, if applicable. */
	name?: string | null;
	/** The slug of the Source, if applicable. */
	slug?: string | null;
};

export type SegmentEventType = string;

export type SegmentFQLDefinedPropertyV1 = {
	/** The FQL expression used to compute the property. */
	fql?: string | null;
	/** The new property name. */
	propertyName?: string | null;
};

/** Filter output. */
export type SegmentFilter = {
	/** The newly created filter id. */
	id?: string | null;
	/** The Workspace id to create the filter. */
	workspaceId?: string | null;
	/** The Integration id of the resource. */
	integrationId?: string | null;
	/** Whether the filter is enabled. */
	enabled?: boolean | null;
	/** The name of the filter. */
	name?: string | null;
	/** The description of the filter. */
	description?: string | null;
	/** The "if" statement for a filter. */
	if?: string | null;
	/** Whether the event is dropped. */
	drop?: boolean | null;
	/** The timestamp of this filter's creation. */
	createdAt?: string | null;
	/** The timestamp of this filter's last change. */
	updatedAt?: string | null;
};

/** Output when forcing execution of an audience run. */
export type SegmentForceExecuteAudienceRunOutput = {
	/** The run information. */
	run?: SegmentAudienceRunInfo | null;
};

/** Forward-only pagination — `previous` is omitted because this endpoint does not support backward traversal. */
export type SegmentForwardOnlyPaginationOutput = {
	/** A pointer to the next page. This does not return when you retrieve the last page. Consumers of the API must treat this value as opaque. */
	next?: string | null;
	/** The current cursor within a collection. Consumers of the API must treat this value as opaque. */
	current?: string | null;
	/** The total number of entries available in the collection. If calculating it impacts performance, the response may omit this field. */
	totalEntries?: number | null;
};

export type SegmentFunctionSettingV1 = {
	/** The name of this Function Setting. */
	name?: string | null;
	/** The label for this Function Setting. */
	label?: string | null;
	/** A description of this Function Setting. */
	description?: string | null;
	/** The type of this Function Setting. */
	type?: string | null;
	/** Whether this Function Setting is required. */
	required?: boolean | null;
	/** Whether this Function Setting contains sensitive information. */
	sensitive?: boolean | null;
};

/** Represents a Function. */
export type SegmentFunctionV1 = {
	/** An identifier for this Function. */
	id?: string | null;
	/** The Function type. Config API note: equal to `type`. */
	resourceType?: string | null;
	/** The time this Function was created. */
	createdAt?: string | null;
	/** The id of the user who created this Function. */
	createdBy?: string | null;
	/** The Function code. */
	code?: string | null;
	/** The time of this Function's last deployment. */
	deployedAt?: string | null;
	/** The list of settings for this Function. */
	settings?: Array<SegmentFunctionSettingV1> | null;
	/** A display name for this Function. */
	displayName?: string | null;
	/** A description for this Function. */
	description?: string | null;
	/** The URL of the logo for this Function. */
	logoUrl?: string | null;
	/** The preview webhook URL for this Function. */
	previewWebhookUrl?: string | null;
	/** The max count of the batch for this Function. */
	batchMaxCount?: number | null;
	/** The catalog id of this Function. */
	catalogId?: string | null;
	/** Whether the deployment of this Function is the latest version. */
	isLatestVersion?: boolean | null;
};

/** Output for getting an activation from space and audience. */
export type SegmentGetActivationFromAudienceOutput = {
	activation?: SegmentActivationOutput | null;
};

/** Returns the advanced sync schedule for a Warehouse. */
export type SegmentGetAdvancedSyncScheduleFromWarehouseV1Output = {
	/** Indicates if an advanced sync schedule is enabled for this Warehouse. */
	enabled?: boolean | null;
	/** The schedule that contains the schedule overrides for the specified Warehouse, if enabled. */
	schedule?: SegmentAdvancedWarehouseSyncScheduleV1Output | null;
};

/** Audience output for get. */
export type SegmentGetAudienceOutput = {
	/** The audience summary output. */
	audience?: SegmentAudienceSummaryWithAudienceTypeAndLookback | null;
};

/** Output when reading an audience preview. */
export type SegmentGetAudiencePreviewOutput = {
	/** The audience preview. */
	audiencePreview?: SegmentAudiencePreview | null;
};

/** Output for get audience schedule. */
export type SegmentGetAudienceScheduleFromSpaceAndAudienceOutput = {
	/** The audience schedule. */
	audienceSchedule?: SegmentAudienceSchedule | null;
};

/** Computed Trait output for get and update. */
export type SegmentGetComputedTraitAlphaOutput = {
	/** The computed trait summary output. */
	computedTrait?: SegmentComputedTraitSummary | null;
};

/** Returns the status of a Warehouse connection settings after an attempt to connect to it. */
export type SegmentGetConnectionStateFromWarehouseV1Output = {
	/** Represents the status for the current connection settings. */
	connectionState?: string | null;
};

/** Returns a Credential. */
export type SegmentGetCredentialV1Output = {
	/** The returned Credential object. */
	credential?: SegmentCredentialV1 | null;
};

/** Returns a list of daily aggregations of Source level API calls counts. */
export type SegmentGetDailyPerSourceAPICallsUsageV1Output = {
	/** The list of daily per Source API calls count aggregates. */
	dailyPerSourceAPICallsUsage?: Array<SegmentSourceAPICallSnapshotV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of daily aggregations of Source level MTU counts. */
export type SegmentGetDailyPerSourceMTUUsageV1Output = {
	/** The list of daily per Source MTU count aggregates. */
	dailyPerSourceMTUUsage?: Array<SegmentUsersPerSourceSnapshotV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of daily aggregations of Workspace MTU counts. */
export type SegmentGetDailyWorkspaceAPICallsUsageV1Output = {
	/** The list of daily Workspace API calls count aggregates. */
	dailyWorkspaceAPICallsUsage?: Array<SegmentAPICallSnapshotV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of daily aggregations of Workspace MTU counts. */
export type SegmentGetDailyWorkspaceMTUUsageV1Output = {
	/** The list of daily Workspace MTU count aggregates. */
	dailyWorkspaceMTUUsage?: Array<SegmentMtuSnapshotV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output of the Delivery Overview public API endpoints. */
export type SegmentGetDeliveryOverviewMetricsBetaOutput = {
	/** The total number of events for the returned dataset. */
	total?: number | null;
	/** Represents the list of series broken down by the dimensions and time frame requested. */
	dataset?: Array<SegmentDeliveryOverviewMetricsDataset> | null;
	/** The result object used to specify the page cursor and count. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a Destination catalog item. */
export type SegmentGetDestinationMetadataV1Output = {
	/** The catalog item matched by id. */
	destinationMetadata?: SegmentDestinationMetadataV1 | null;
};

/** Returns a single Destination by its id. */
export type SegmentGetDestinationV1Output = {
	/** The Destination looked up. */
	destination?: SegmentDestinationV1 | null;
};

/** Returns a list of all Destination catalog items contained within a given page. */
export type SegmentGetDestinationsCatalogV1Output = {
	/** All Destination catalog items contained within the requested page. */
	destinationsCatalog?: Array<SegmentDestinationMetadataV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** GetEventsVolumeFromWorkspaceV1Output represents the results given the input query. */
export type SegmentGetEventsVolumeFromWorkspaceV1Output = {
	/** Observability event volume path. */
	path?: string | null;
	/** Input query returned. */
	query?: SegmentGetEventsVolumeFromWorkspaceV1Query | null;
	/** The resultant list of series broken down by the dimensions requested over the time frame requested and ordered by the total count of events in all series. Note: The limit of entries returned is 5000. */
	result?: Array<SegmentSourceEventVolumeV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** GetEventVolumeOutputQuery represents the input query sent to output. */
export type SegmentGetEventsVolumeFromWorkspaceV1Query = {
	/** Workspace being requested. */
	workspaceId?: string | null;
	/** Granularity corresponds to the requested bucket granularity. */
	granularity?: string | null;
	/** StartTime is the ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. */
	startTime?: string | null;
	/** EndTime is the ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. */
	endTime?: string | null;
	/** GroupBy is a comma-delimited list of strings representing the dimensions to group the result by. The current options are: `eventName` or `eventType`. */
	groupBy?: Array<string> | null;
	/** List of strings which allow you to restrict the result to just the given Sources. */
	sourceId?: Array<string> | null;
	/** EventName is a list of strings which allow you to restrict the result to just the given event names. */
	eventName?: Array<string> | null;
	/** EventType is a list of strings which allow you to restrict the result to just the given event types. */
	eventType?: Array<string> | null;
	/** AppVersion is a list of strings which allow you to restrict the result to just the given application versions. */
	appVersion?: Array<string> | null;
	/** Limit is the total number of items in the result. */
	limit?: number | null;
};

/** Output for GetFilterById. */
export type SegmentGetFilterByIdOutput = {
	filter?: SegmentFilter | null;
};

/** Output for GetDestinationFiltersV1. */
export type SegmentGetFilterInDestinationV1Output = {
	/** The requested Destination filter. */
	filter?: SegmentDestinationFilterV1 | null;
};

/** Gets a single Function. */
export type SegmentGetFunctionV1Output = {
	/** A Function object. */
	function?: SegmentFunctionV1 | null;
};

/** Get Function version output. */
export type SegmentGetFunctionVersionAlphaOutput = {
	/** Functions version. */
	version?: SegmentVersion | null;
};

/** Returns the insert Function instance. */
export type SegmentGetInsertFunctionInstanceAlphaOutput = {
	/** The insert Function instance. */
	insertFunctionInstance?: SegmentInsertFunctionInstanceAlpha | null;
};

/** Output for GetLatestFromLivePlugins. */
export type SegmentGetLatestFromLivePluginsAlphaOutput = {
	/** The latest version of Live Plugin bundle. */
	livePlugin?: SegmentLivePluginsAlpha | null;
};

/** The regulate request returned. */
export type SegmentGetRegulationV1Output = {
	/** The regulate request. */
	regulation?: {
		/** The id of the regulate request. */
		id?: string | null;
		/** The id of the Workspace that the regulate request belongs to. */
		workspaceId?: string | null;
		/** The current status of the regulate request. */
		overallStatus?: string | null;
		/** The timestamp of when the request finished. */
		finishedAt?: string | null;
		/** The timestamp of the creation of the request. */
		createdAt?: string | null;
		/** The status of each stream including all the Destinations that correspond to the stream. */
		streamStatus?: Array<SegmentStreamStatusV1> | null;
	} | null;
};

/** Output for triggering a manual sync for a RETL connection. */
export type SegmentGetReverseETLSyncStatusOutput = {
	/** The status of the reverse ETL connection job. */
	reverseETLSyncStatus?: SegmentReverseETLSyncStatus | null;
};

/** Defines the result of getting a Model. */
export type SegmentGetReverseEtlModelOutput = {
	/** The requested Model. */
	reverseEtlModel?: SegmentReverseEtlModel | null;
};

/** Returns the Source catalog item looked up by id. */
export type SegmentGetSourceMetadataV1Output = {
	/** The catalog item matched by id. */
	sourceMetadata?: SegmentSourceMetadataV1 | null;
};

/** Returns a Source. */
export type SegmentGetSourceV1Output = {
	/** The returned Source object. */
	source?: SegmentSourceV1 | null;
	/** The id of the Tracking Plan connected to the Source. */
	trackingPlanId?: string | null;
};

/** Returns a list of all Source catalog items contained within a given page. */
export type SegmentGetSourcesCatalogV1Output = {
	/** All Source catalog items contained within the requested page. */
	sourcesCatalog?: Array<SegmentSourceMetadataV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the getSpaceById endpoint. */
export type SegmentGetSpaceAlphaOutput = {
	/** Space matching the given id. */
	space?: SegmentSpace | null;
};

/** Returns a subscription for a given subscription id. */
export type SegmentGetSubscriptionFromDestinationAlphaOutput = {
	/** The Destination subscription. */
	subscription?: SegmentDestinationSubscription | null;
};

/** Gets a single Tracking Plan. */
export type SegmentGetTrackingPlanV1Output = {
	/** The requested Tracking Plan. */
	trackingPlan?: SegmentTrackingPlanV1 | null;
};

/** The output of Transformation retrieval. */
export type SegmentGetTransformationV1Output = {
	/** The retrieved Transformation. */
	transformation?: SegmentTransformationV1 | null;
};

/** Returns a user group with the given id. */
export type SegmentGetUserGroupV1Output = {
	/** The user group returned from the query. */
	userGroup?: SegmentUserGroupV1 | null;
};

/** Returns the user. */
export type SegmentGetUserV1Output = {
	/** The user object. */
	user?: SegmentUserV1 | null;
};

/** Returns a Warehouse catalog item looked up by id. */
export type SegmentGetWarehouseMetadataV1Output = {
	/** The Warehouse catalog item. */
	warehouseMetadata?: SegmentWarehouseMetadataV1 | null;
};

/** Returns a Warehouse. */
export type SegmentGetWarehouseV2Output = {
	/** The returned Warehouse object. */
	warehouse?: SegmentWarehouseV2 | null;
};

/** Returns a list of all Warehouse catalog items contained within a given page. */
export type SegmentGetWarehousesCatalogV1Output = {
	/** All Warehouse catalog items contained within the requested page. */
	warehousesCatalog?: Array<SegmentWarehouseMetadataV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Represents the output of loading the Workspace. */
export type SegmentGetWorkspaceV1Output = {
	/** The Workspace. */
	workspace?: SegmentWorkspaceV1 | null;
};

export type SegmentGroupSourceSettingsV1 = {
	/** Enable to allow unplanned group traits. Config API note: equal to `allowUnplannedGroupTraits`. */
	allowUnplannedTraits?: boolean | null;
	/** Enable to allow group traits on violations. Config API note: equal to `allowGroupTraitsOnViolations`. */
	allowTraitsOnViolations?: boolean | null;
	/** The common group event on violations. Config API note: equal to `commonGroupEventOnViolations`. */
	commonEventOnViolations?: string | null;
};

export type SegmentHashPropertiesConfiguration = {
	/** Which algorithm to use to hash to properties. */
	algorithm?: string | null;
	/** Optional key to hash with. */
	key?: string | null;
	/** Optional encoding to use for the hashing. */
	encoding?: string | null;
	/** The paths to the properties to be hashed. */
	paths?: Array<string> | null;
};

/** The identifier sync configuration input. */
export type SegmentIDSyncConfigurationInput = {
	/** The id type to sync. Examples: user_id, email, anonymous_id. */
	externalId?: string | null;
	/** The rule for selecting which identifiers to sync from a profile. Possible values: first: Syncs only the oldest recorded value. last: Syncs only the most recently updated value. all: Syncs every value found on the profile (sends multiple events). */
	strategy?: string | null;
	/** Optional destination-specific identifier to map to (for example, "Email_Address_c"). */
	mapTo?: string | null;
};

export type SegmentIdentifySourceSettingsV1 = {
	/** Enable to allow unplanned identify traits. Config API note: equal to `allowUnplannedIdentifyTraits`. */
	allowUnplannedTraits?: boolean | null;
	/** Enable to allow identify traits on violations. Config API note: equal to `allowIdentifyTraitsOnViolations`. */
	allowTraitsOnViolations?: boolean | null;
	/** The common identify event on violations. Config API note: equal to `commonIdentifyEventOnViolations`. */
	commonEventOnViolations?: string | null;
};

export type SegmentInsertFunctionInstanceAlpha = {
	id?: string | null;
	name?: string | null;
	integrationId?: string | null;
	classId?: string | null;
	enabled?: boolean | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	settings?: Record<string, SegmentJsonValue> | null;
	encryptedSettings?: Record<string, SegmentJsonValue> | null;
};

/** Describes an Integration option field required to set up a Segment Integration such as Sources, Destinations, or warehouses. */
export type SegmentIntegrationOptionBeta = {
	/** The name identifying this option in the context of a Segment Integration. */
	name?: string | null;
	/** Defines the type for this option in the schema. Types are most commonly strings, but may also represent other primitive types, such as booleans, and numbers, as well as complex types, such as objects and arrays. */
	type?: string | null;
	/** Whether this is a required option when setting up the Integration. */
	required?: boolean | null;
	/** An optional short text description of the field. */
	description?: string | null;
	/** An optional default value for the field. */
	defaultValue?: SegmentJsonValue | null;
	/** An optional label for this field. */
	label?: string | null;
};

/** A label lets Workspace owners assign permissions to users, and grant these users access to groups. A Workspace owner may use labels to grant users access to groups of resources. When you add a label to a Source or Personas Spaces, any users granted access to that label gain access to those… */
export type SegmentLabelV1 = {
	/** The key that represents the name of this label. */
	key?: string | null;
	/** The value associated with the key of this label. */
	value?: string | null;
	/** An optional description of the purpose of this label. */
	description?: string | null;
};

/** Output for listing activations from space and audience. */
export type SegmentListActivationsFromAudienceOutput = {
	/** A list of activation results. */
	activations?: Array<SegmentActivationOutput> | null;
	/** An optional pagination object that is present when pagination input is present. */
	pagination?: SegmentPaginationOutput | null;
};

/** List Audience consumers output. */
export type SegmentListAudienceConsumersFromSpaceAndAudienceOutput = {
	/** The list of audience consumers. */
	audiences?: Array<SegmentAudienceSummary> | null;
	/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output for list audience schedules. */
export type SegmentListAudienceSchedulesFromSpaceAndAudienceOutput = {
	/** A list of audience schedules. */
	audienceSchedules?: Array<SegmentAudienceSchedule> | null;
};

/** List audiences endpoint output. */
export type SegmentListAudiencesOutput = {
	/** A list of audience summary results. */
	audiences?: Array<SegmentAudienceSummaryWithAudienceTypeAndLookback> | null;
	/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Audit Trail events for the current Workspace. */
export type SegmentListAuditEventsV1Output = {
	/** Audit trail events for the current Workspace. */
	events?: Array<SegmentAuditEventV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** List computed traits endpoint output. */
export type SegmentListComputedTraitsAlphaOutput = {
	/** A list of computed trait summary results. */
	computedTraits?: Array<SegmentComputedTraitSummary> | null;
	/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Destinations connected to a Source. */
export type SegmentListConnectedDestinationsFromSourceV1Output = {
	/** A list that contains the Destinations connected to the Source. */
	destinations?: Array<SegmentDestinationV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Sources connected to a Warehouse. */
export type SegmentListConnectedSourcesFromWarehouseV1Output = {
	/** A list that contains the Sources connected to the requested Warehouse. */
	sources?: Array<SegmentSourceV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Warehouses connected to a Source. */
export type SegmentListConnectedWarehousesFromSourceV1Output = {
	/** A list that contains the Warehouses connected to the Source. */
	warehouses?: Array<SegmentWarehouseV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the Warehouses and Sources that consume a Credential. The two lists are paginated independently, so a caller can page through one without affecting the other. */
export type SegmentListCredentialConsumersV1Output = {
	/** The Warehouses that use this Credential. */
	warehouses?: Array<SegmentWarehouseV1> | null;
	/** Information about the pagination of the Warehouses list. */
	warehousesPagination?: SegmentPaginationOutput | null;
	/** The Sources that use this Credential. */
	sources?: Array<SegmentSourceV1> | null;
	/** Information about the pagination of the Sources list. */
	sourcesPagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Credentials that belong to a Workspace. */
export type SegmentListCredentialsV1Output = {
	/** A list of Credentials that belong to the Workspace. */
	credentials?: Array<SegmentCredentialV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output to retrieve event delivery metrics summary for a Destination. */
export type SegmentListDeliveryMetricsSummaryFromDestinationBetaOutput = {
	/** The delivery metrics summary returned. */
	deliveryMetricsSummary?: SegmentDeliveryMetricsSummaryBeta | null;
};

/** Output to List all Destinations from an Audience. */
export type SegmentListDestinationsFromAudienceAlphaOutput = {
	/** A list of connection results. */
	connections?: Array<SegmentSimpleDestination> | null;
	/** An optional pagination object that is present when pagination input is present. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns all Destinations connected to the current Workspace. */
export type SegmentListDestinationsV1Output = {
	/** The list that contains the Destinations connected to the Workspace. */
	destinations?: Array<SegmentDestinationV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the listEntityPaths endpoint. */
export type SegmentListEntityPathsAlphaOutput = {
	/** List of entity paths in the space. */
	entityPaths?: Array<SegmentEntityPathAlpha> | null;
	/** Pagination metadata. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the listEvents endpoint. */
export type SegmentListEventsAlphaOutput = {
	/** List of events in the space. */
	events?: Array<SegmentEventAlpha> | null;
	/** Pagination metadata. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output for ListFiltersByIntegrationId. */
export type SegmentListFiltersForSpaceOutput = {
	/** Filter output. */
	filters?: Array<SegmentFilter> | null;
	/** Pagination parameters. */
	pagination?: SegmentListFiltersPaginationOutput | null;
};

/** Output for ListDestinationFiltersV1. */
export type SegmentListFiltersFromDestinationV1Output = {
	/** A list of the filters that belong to the specified Destination instance. */
	filters?: Array<SegmentDestinationFilterV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Pagination for list filters. */
export type SegmentListFiltersPaginationOutput = {
	/** Current. */
	current?: number | null;
	/** Next. */
	next?: number | null;
	/** Total entries. */
	totalEntries?: number | null;
};

/** Represents a Function in a list. */
export type SegmentListFunctionItemV1 = {
	/** An identifier for this Function. */
	id?: string | null;
	/** The Function type. Config API note: equal to `type`. */
	resourceType?: string | null;
	/** The time this Function was created. */
	createdAt?: string | null;
	/** The id of the user who created this Function. */
	createdBy?: string | null;
	/** A display name for this Function. */
	displayName?: string | null;
	/** A description for this Function. */
	description?: string | null;
	/** The URL of the logo for this Function. */
	logoUrl?: string | null;
	/** The catalog id of this Function. */
	catalogId?: string | null;
};

/** Lists Versions of a Function. */
export type SegmentListFunctionVersionsAlphaOutput = {
	/** An array of Functions. */
	versions?: Array<SegmentVersion> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Lists Functions in a Workspace. */
export type SegmentListFunctionsV1Output = {
	/** An array of Functions. */
	functions?: Array<SegmentListFunctionItemV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of insert Function instances connected to the insert Function. */
export type SegmentListInsertFunctionInstancesAlphaOutput = {
	/** All insert Function instances found. */
	instances?: Array<SegmentInsertFunctionInstanceAlpha> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the emails of invitees to a user group with the given group id. */
export type SegmentListInvitesFromUserGroupV1Output = {
	/** The emails of the invitees to the user group. */
	emails?: Array<string> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the list of invites. */
export type SegmentListInvitesV1Output = {
	/** The list of invites. */
	invites?: Array<string> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns all available labels for the current Workspace. */
export type SegmentListLabelsV1Output = {
	/** All labels associated with the current Workspace. */
	labels?: Array<SegmentLabelV1> | null;
};

/** Returns all Profiles Warehouse based on spaceID and pagination. */
export type SegmentListProfilesWarehouseInSpaceAlphaOutput = {
	/** A list of Warehouses that belong to the Workspace. */
	profilesWarehouses?: Array<SegmentProfilesWarehouseAlpha> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the listPropertiesFromEntity endpoint. */
export type SegmentListPropertiesFromEntityAlphaOutput = {
	/** List of properties for the entity. */
	entityProperties?: Array<SegmentEntityPropertyAlpha> | null;
	/** Pagination metadata. Supports forward-only pagination. */
	pagination?: SegmentForwardOnlyPaginationOutput | null;
};

/** Response for the listPropertiesFromEvent endpoint. */
export type SegmentListPropertiesFromEventAlphaOutput = {
	/** List of properties for the event. */
	eventProperties?: Array<SegmentEventPropertyAlpha> | null;
	/** Pagination metadata. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output of all Source-scoped regulations. */
export type SegmentListRegulationsFromSourceV1Output = {
	/** List of Workspace-scoped regulations with statuses. */
	regulations?: Array<SegmentRegulationListEntryV1> | null;
};

/** The reverse ETL sync statuses that were looked up. */
export type SegmentListReverseETLSyncStatusesFromModelAndSubscriptionIdOutput =
	{
		/** The reverse ETL sync statuses that were looked up of the subscription id. */
		syncStatuses?: Array<SegmentReverseETLSyncStatus> | null;
		/** Optional pagination params. Present when output is paginated. */
		pagination?: SegmentPaginationOutput | null;
	};

/** Defines the result of listing Models. */
export type SegmentListReverseEtlModelsOutput = {
	/** A list of Models that belong to the Workspace. */
	models?: Array<SegmentReverseEtlModel> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the list of roles. */
export type SegmentListRolesV1Output = {
	/** The list of roles. */
	roles?: Array<SegmentRoleV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Lists a Tracking Plan's rules. */
export type SegmentListRulesFromTrackingPlanV1Output = {
	/** Rules associated with the given Tracking Plan. */
	rules?: Array<SegmentRuleV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the listSampleValuesFromEntityProperty endpoint. */
export type SegmentListSampleValuesFromEntityPropertyAlphaOutput = {
	/** Top values for the property (up to 1000). */
	sampleValues?: Array<string> | null;
};

/** Response for the listSampleValuesFromEventProperty endpoint. */
export type SegmentListSampleValuesFromEventPropertyAlphaOutput = {
	/** Sample values for the property (up to 1000). */
	sampleValues?: Array<string> | null;
};

/** Response for the listSampleValuesFromTrait endpoint. */
export type SegmentListSampleValuesFromTraitAlphaOutput = {
	/** Top values for the trait (up to 1000). */
	sampleValues?: Array<string> | null;
};

/** Returns a list of settings for the Source. */
export type SegmentListSchemaSettingsInSourceV1Output = {
	/** Source id. Config API note: analogous to `parent` and `name`. */
	sourceId?: string | null;
	/** The Source settings. */
	settings?: SegmentSourceSettingsOutputV1 | null;
};

/** Results containing the Selective Sync configuration for a Warehouse. */
export type SegmentListSelectiveSyncsFromWarehouseAndSourceV1Output = {
	/** Represents a list of Source, collection, and properties synced to the Warehouse. */
	items?: Array<SegmentWarehouseSelectiveSyncItemV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Results containing the Selective Sync configuration for a Space Warehouse Connection. */
export type SegmentListSelectiveSyncsFromWarehouseAndSpaceAlphaOutput = {
	/** Represents a list of collections and properties synced to the Warehouse. */
	items?: Array<SegmentSpaceWarehouseSelectiveSyncItemAlpha> | null;
	/** Optional. Represents the enabled state of all event tables. */
	enableEventTables?: boolean | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Lists all Sources associated with a Tracking Plan. */
export type SegmentListSourcesFromTrackingPlanV1Output = {
	/** A paginated list of Sources associated with the Tracking Plan. */
	sources?: Array<SegmentSourceV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Sources that belong to the current Workspace. */
export type SegmentListSourcesV1Output = {
	/** A list of Sources that belong to the Workspace. */
	sources?: Array<SegmentSourceV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the list spaces endpoint. */
export type SegmentListSpacesAlphaOutput = {
	/** A list of spaces. */
	spaces?: Array<SegmentSpace> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output for ListDestinationSubscriptionsAlpha. */
export type SegmentListSubscriptionsFromDestinationAlphaOutput = {
	/** A list of Destination subscriptions. */
	subscriptions?: Array<SegmentDestinationSubscription> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

export type SegmentListSupportedDestinationsFromAudienceAlphaOutput = {
	/** The Destinations available for activation. */
	destinations?: Record<string, SegmentJsonValue> | null;
	/** Optional pagination. */
	pagination?: SegmentPaginationOutput | null;
};

/** The output of a list suppressed call for a Workspace. */
export type SegmentListSuppressionsV1Output = {
	/** An array that lists the suppressions from the Workspace. Config API note: equal to `attributes`. */
	suppressed?: Array<{
		subjectType?: string | null;
		subjectIds?: Array<string> | null;
	}> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list that contains the most recent syncs for a Warehouse-source pair, filtered and constrained by a given set of pagination parameters. */
export type SegmentListSyncsFromWarehouseAndSourceV1Output = {
	/** A list that contains the latest syncs for the specified Warehouse-source pair. */
	reports?: Array<SegmentSyncV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns an overview page that contains the last syncs for a Warehouse. */
export type SegmentListSyncsFromWarehouseV1Output = {
	/** A list that contains the latest syncs for the specified Warehouse. */
	reports?: Array<SegmentSyncV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Lists the Tracking Plans associated with the current Workspace. */
export type SegmentListTrackingPlansV1Output = {
	/** A paginated list of Tracking Plans. */
	trackingPlans?: Array<SegmentTrackingPlanV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Response for the listTraits endpoint. */
export type SegmentListTraitsAlphaOutput = {
	/** List of traits in the space. */
	traits?: Array<SegmentTraitAlpha> | null;
	/** Pagination metadata. Supports forward-only pagination. */
	pagination?: SegmentForwardOnlyPaginationOutput | null;
};

/** Lists the Transformations associated with the current Workspace. */
export type SegmentListTransformationsV1Output = {
	/** A paginated list of Transformations. */
	transformations?: Array<SegmentTransformationV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns all user groups the user belongs to. */
export type SegmentListUserGroupsFromUserV1Output = {
	/** The user groups that the user belongs to. */
	groups?: Array<SegmentMinimalUserGroupV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of user groups with the given Workspace id. */
export type SegmentListUserGroupsV1Output = {
	/** The user group returned from the query. */
	userGroups?: Array<SegmentUserGroupV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the members of a user group with the given group id. */
export type SegmentListUsersFromUserGroupV1Output = {
	/** The users of the user group. */
	users?: Array<SegmentMinimalUserV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns the list of users. */
export type SegmentListUsersV1Output = {
	/** The list of users. */
	users?: Array<SegmentUserV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Returns a list of Warehouses that belong to a Workspace. */
export type SegmentListWarehousesV2Output = {
	/** A list of Warehouses that belong to the Workspace. */
	warehouses?: Array<SegmentWarehouseV2> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Output of all Workspace-scoped regulations in a given Workspace. */
export type SegmentListWorkspaceRegulationsV1Output = {
	/** List of Workspace-scoped regulations with statuses. */
	regulations?: Array<SegmentRegulationListEntryV1> | null;
	/** Information about the pagination of this response. */
	pagination?: SegmentPaginationOutput | null;
};

/** Represents a Live Plugin bundle. */
export type SegmentLivePluginsAlpha = {
	/** The Live Plugin id. */
	id?: string | null;
	/** The Source id. */
	sourceId?: string | null;
	/** Creation date. */
	createdAt?: string | null;
	/** Creating user's id. */
	createdBy?: string | null;
	/** The CDN URL that can be used to fetch your latest Live Plugin bundle. */
	downloadURL?: string | null;
	/** Revision number associated with the latest Live Plugin. */
	version?: number | null;
	/** The code of the Live Plugin. */
	code?: string | null;
};

/** Represents a logo. */
export type SegmentLogosBeta = {
	/** The default URL for this logo. */
	default?: string | null;
	/** The logo mark. */
	mark?: string | null;
	/** The alternative text for this logo. */
	alt?: string | null;
};

/** The event delivery metric. */
export type SegmentMetricBeta = {
	/** The name of the metric. */
	metricName?: string | null;
	/** Number of occurrences of the metric. */
	total?: number | null;
	/** Breakdown of metrics within a metric. */
	breakdown?: Array<SegmentBreakdownBeta> | null;
};

/** The least amount of information needed to identify a user group. */
export type SegmentMinimalUserGroupV1 = {
	/** The id of the user group. */
	id?: string | null;
	/** The name of the user group. */
	name?: string | null;
};

/** A user belonging to a Segment Workspace. */
export type SegmentMinimalUserV1 = {
	/** The unique identifier of this user. Config API note: analogous to `name`. */
	id?: string | null;
	/** The human-readable name of this user. */
	name?: string | null;
	/** The email address associated with this user. */
	email?: string | null;
};

/** A snapshot of MTU metrics within the given usage period. */
export type SegmentMtuSnapshotV1 = {
	/** The start of the usage period, in unix time (seconds since epoch). */
	periodStart?: number | null;
	/** The end of the usage period, in unix time (seconds since epoch). */
	periodEnd?: number | null;
	/** A bigint of the number of anonymous users in this snapshot. */
	anonymous?: string | null;
	/** A bigint of the number of anonymous identified users in this snapshot. */
	anonymousIdentified?: string | null;
	/** A bigint of the number of identified users in this snapshot. */
	identified?: string | null;
	/** A bigint of the number of never identified users in this snapshot. */
	neverIdentified?: string | null;
	/** The timestamp of this snapshot within the billing cycle, in the ISO-8601 format. */
	timestamp?: string | null;
};

/** Pagination metadata for a list response. Responses return this object alongside a list of resources, which provides the necessary metadata for manipulating a paginated collection. In operations that return lists, it's always present, though some of its fields might not be. */
export type SegmentPaginationOutput = {
	/** The current cursor within a collection. Consumers of the API must treat this value as opaque. */
	current?: string | null;
	/** A pointer to the next page. This does not return when you retrieve the last page. Consumers of the API must treat this value as opaque. */
	next?: string | null;
	/** A pointer to the previous page. This does not return when you retrieve the first page. Consumers of the API must treat this value as opaque. */
	previous?: string | null;
	/** The total number of entries available in the collection. If calculating it impacts performance, the response may omit this field. */
	totalEntries?: number | null;
};

/** Configures a periodic schedule interval. */
export type SegmentPeriodicConfig = {
	/** Go duration format string, only supporting units "d" (days), "h" (hours) and "m" (minutes). Acceptable values are: - 15m - 30m - 1h - 2h - 4h - 6h - 8h - 12h - 1d */
	interval?: string | null;
};

/** The most basic representation of a resource belonging to a set of permissions. */
export type SegmentPermissionResourceV1 = {
	/** The id of this resource. */
	id?: string | null;
	/** The type for this resource. */
	type?: string | null;
	/** The labels that further refine access to this resource. Labels are exclusive to Workspace-level permissions. */
	labels?: Array<SegmentAllowedLabelBeta> | null;
};

/** A registered set of permissions for a subject, extending a role to a resource. */
export type SegmentPermissionV1 = {
	/** The name of the role associated with this permission. */
	roleName?: string | null;
	/** The id of the role associated with this permission. */
	roleId?: string | null;
	/** The resources associated with this permission. */
	resources?: Array<SegmentPermissionResourceV1> | null;
	/** The labels to attach to this permission. */
	labels?: Array<SegmentAllowedLabelBeta> | null;
};

/** The Personalization Input Entity. */
export type SegmentPersonalizationInputEntity = {
	/** The entity properties to include in the event sent to the Destination. */
	properties?: Array<string> | null;
	/** The relationship slug for the entity. */
	relationshipSlug?: string | null;
};

/** The Personalization Object. */
export type SegmentPersonalizationOutput = {
	/** The profile traits included in the event sent to the Destination. Applies to both Classic and Linked Audiences. For a Classic audience this is the only form of personalization available, whereas a Linked Audience can also personalize on entities. */
	profile?: {
		/** The profile traits included in the event sent to the Destination. */
		properties?: Array<string> | null;
		/** Maps a profile trait to the name it should be sent under. Each key is a trait, and each value is the name used in the event. */
		mapping?: { [key: string]: string } | null;
	} | null;
	/** The entities, and the properties of each entity, included in the event sent to the Destination. Only applicable to Linked Audiences. */
	entities?: Array<SegmentPersonalizationInputEntity> | null;
	/** Sync entity property changes to the Destination. Only applicable if activationType is "Audience Membership Changed". */
	syncEntityPropertyChanges?: boolean | null;
};

/** Preview output from applying the Destination filter. Segment modifies or nullifies payloads depending on the provided filter actions. */
export type SegmentPreviewDestinationFilterV1Output = {
	/** The pre-filter JSON input. */
	inputPayload?: Record<string, SegmentJsonValue> | null;
	/** The filtered JSON output. */
	result?: Record<string, SegmentJsonValue> | null;
};

/** A Segment profile. */
export type SegmentProfile = {
	/** The id of the profile. */
	id?: string | null;
};

/** Defines a Profiles data Warehouse used as a Destination for Segment data. */
export type SegmentProfilesWarehouseAlpha = {
	/** The id of the Warehouse. */
	id?: string | null;
	/** The Space id. */
	spaceId?: string | null;
	/** The metadata for the Warehouse. */
	metadata?: SegmentWarehouseMetadataV1 | null;
	/** The id of the Workspace that owns this Warehouse. */
	workspaceId?: string | null;
	/** When set to true, this Warehouse receives data. */
	enabled?: boolean | null;
	/** The settings associated with this Warehouse. Common settings are connection-related configuration used to connect to it, for example host, username, and port. */
	settings?: SegmentWarehouseSettingsV1 | null;
	/** The custom schema name that Segment uses on the Warehouse side. */
	schemaName?: string | null;
};

export type SegmentPropertyRenameV1 = {
	/** The old name of the property. */
	oldName?: string | null;
	/** The new name to rename the property. */
	newName?: string | null;
};

export type SegmentPropertyValueTransformationV1 = {
	/** The property paths. The maximum number of paths is 10. */
	propertyPaths?: Array<string> | null;
	/** The new value of the property paths. */
	propertyValue?: string | null;
};

/** Options which should be applied when segmenting audience previews. */
export type SegmentReadAudiencePreviewOptions = {
	/** The set of profile external identifiers being used to determine audience preview membership. Profiles will only be considered for audience preview membership if the profile has at least one external id whose key matches a value in this set. */
	filterByExternalIds?: Array<string> | null;
	/** Determines whether data prior to the audience preview being created is included when determining audience preview membership. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including… */
	includeHistoricalData?: boolean | null;
	/** If specified, the value of this field indicates the number of days (specified from the date the audience preview was created) that event data will be included from when determining audience preview membership. If unspecified, defer to the value of `includeHistoricalData` to determine whether… */
	backfillEventDataDays?: number | null;
};

export type SegmentRegulationListEntryV1 = {
	/** The id of the regulate request. */
	id?: string | null;
	/** The subject type. */
	subjectType?: string | null;
	/** The list of `userId` or `objectId` values of the subjects to regulate. */
	subjects?: Array<string> | null;
	/** The current status of the regulate request. */
	status?: string | null;
	/** The timestamp of the creation of the request. */
	createdAt?: string | null;
	/** The regulation type. */
	regulationType?: string | null;
	/** The timestamp of when the request finished. */
	finishedAt?: string | null;
};

/** Output for removing an activation from audience. */
export type SegmentRemoveActivationFromAudienceOutput = {
	/** Deletion status. */
	status?: string | null;
};

/** Delete audience endpoint output. */
export type SegmentRemoveAudienceFromSpaceOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Output for remove audience schedule. */
export type SegmentRemoveAudienceScheduleFromAudienceOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Delete computed trait endpoint output. */
export type SegmentRemoveComputedTraitFromSpaceAlphaOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Output for removing a Destination from an Audience. */
export type SegmentRemoveDestinationFromAudienceAlphaOutput = {
	/** The status of the removal operation. */
	status?: string | null;
};

/** Output for DeleteDestinationFilterV1. */
export type SegmentRemoveFilterFromDestinationV1Output = {
	/** The status of delete operation. */
	status?: string | null;
};

/** Returns the status of a Warehouse deletion. */
export type SegmentRemoveProfilesWarehouseFromSpaceAlphaOutput = {
	/** The status of the Warehouse deletion operation. */
	status?: string | null;
};

/** Remove specified rules from a Tracking Plan. */
export type SegmentRemoveRulesFromTrackingPlanV1Output = {
	/** The status of the operation. */
	status?: string | null;
};

/** Response indicating whether the disconnection was successful. */
export type SegmentRemoveSourceConnectionFromWarehouseV1Output = {
	/** The status of the request to disconnect the Source and Warehouse. */
	status?: string | null;
};

/** Disconnects a Source from a Tracking Plan. */
export type SegmentRemoveSourceFromTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** Returns a Destination deletion flag. */
export type SegmentRemoveSubscriptionFromDestinationAlphaOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Returns the status of the removal operation. */
export type SegmentRemoveUsersFromUserGroupV1Output = {
	/** The status of the user removal from user group operation. */
	status?: string | null;
};

/** Returns the updated Source. */
export type SegmentRemoveWriteKeyFromSourceAlphaOutput = {
	/** The status of the operation. */
	status?: string | null;
};

/** Returns the advanced sync schedule for a Warehouse. */
export type SegmentReplaceAdvancedSyncScheduleForWarehouseV1Output = {
	/** Indicates if an advanced sync schedule is enabled for the Warehouse. */
	enabled?: boolean | null;
	/** The schedule that contains the overrides for the Warehouse, if enabled. */
	schedule?: SegmentAdvancedWarehouseSyncScheduleV1Output | null;
};

/** Response from replacing a list of labels in a Source. */
export type SegmentReplaceLabelsInSourceV1Output = {
	/** All labels replaced in the Source. */
	labels?: Array<SegmentLabelV1> | null;
};

/** Returns the user group's permissions, including the updated permissions. */
export type SegmentReplacePermissionsForUserGroupV1Output = {
	/** The updated permissions. */
	permissions?: Array<SegmentAccessPermissionV1> | null;
};

/** Returns the user's permissions, including the updated permissions. */
export type SegmentReplacePermissionsForUserV1Output = {
	/** The updated permissions. */
	permissions?: Array<SegmentAccessPermissionV1> | null;
};

/** Replaces Tracking Plan rules. */
export type SegmentReplaceRulesInTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** Returns the updated user group. */
export type SegmentReplaceUsersInUserGroupV1Output = {
	/** The updated the user group. */
	userGroup?: SegmentUserGroupV1 | null;
};

/** Restore version output. */
export type SegmentRestoreFunctionVersionAlphaOutput = {
	/** Restored version. */
	version?: SegmentVersion | null;
};

/** StartJobOutput returns the result of triggering the specified job. */
export type SegmentReverseETLManualSyncJobOutput = {
	/** A datetime that indicates when the job was triggered. */
	startedAt?: string | null;
	/** The unique id for the sync that was triggered. */
	syncId?: string | null;
};

/** Defines the result of getting the sync status of a RETL connection. */
export type SegmentReverseETLSyncStatus = {
	/** The id of the sync. */
	syncId?: string | null;
	/** The Model id of the sync. */
	modelId?: string | null;
	/** The Source id of the sync. */
	sourceId?: string | null;
	/** The status of the sync. It currently can be IN_PROGRESS, FAIL, SUCCESS, PARTIAL_SUCCESS. */
	syncStatus?: string | null;
	/** The duration of the sync. */
	duration?: string | null;
	/** When the sync started. */
	startedAt?: string | null;
	/** When the sync started. */
	finishedAt?: string | null;
	/** Object with extract phase details. */
	extractPhase?: SegmentSyncExtractPhase | null;
	/** Object with load phase details. */
	loadPhase?: SegmentSyncLoadPhase | null;
	/** Error message if applicable. */
	error?: string | null;
	/** Error code indicates a fatal sync error code, if applicable. */
	errorCode?: string | null;
};

export type SegmentReverseEtlCronScheduleConfig = {
	/** 5 field cron string expression. The cron expression must be larger than 15 minutes. */
	spec?: string | null;
	/** Timezone respected by the cron string. Format must be in IANA Timezone Identifier. Example: 'America/Los_Angeles'. */
	timezone?: string | null;
};

/** Definition for a schedule triggered by dbt Cloud job events. */
export type SegmentReverseEtlDbtCloudScheduleConfig = {
	/** The dbt Cloud job used to trigger a sync for a Reverse ETL Connection. */
	jobId?: string | null;
	/** The dbt Cloud account where the job belongs to. */
	accountId?: string | null;
};

/** Defines a Reverse ETL Model. */
export type SegmentReverseEtlModel = {
	/** The id of the Model. */
	id?: string | null;
	/** The id for the attached Source. */
	sourceId?: string | null;
	/** A short, human-readable description of the Model. */
	name?: string | null;
	/** A longer, more descriptive explanation of the Model. */
	description?: string | null;
	/** Indicates whether the Model should have syncs enabled. When disabled, no syncs will be triggered, regardless of the enabled status of the attached destinations/subscriptions. */
	enabled?: boolean | null;
	/** The SQL query that will be executed to extract data from the connected Source. */
	query?: string | null;
	/** Indicates the column named in `query` that should be used to uniquely identify the extracted records. */
	queryIdentifierColumn?: string | null;
};

/** Definition for periodic interval. */
export type SegmentReverseEtlPeriodicScheduleConfig = {
	/** Duration is specified as a string, EG: 15m, 3h25m30s. */
	interval?: string | null;
};

/** Defines a configuration object used for scheduling, which can vary depending on the configured strategy. */
export type SegmentReverseEtlScheduleDefinition = {
	/** Strategy supports: Periodic, Specific Days, Manual, CRON and DBT_CLOUD. */
	strategy?: string | null;
	/** Config contains interval duration in case of periodic or day and hours in case of specific_days. Empty if strategy is MANUAL. */
	config?:
		| (
				| SegmentReverseEtlPeriodicScheduleConfig
				| SegmentReverseEtlSpecificTimeScheduleConfig
				| SegmentReverseEtlCronScheduleConfig
				| SegmentReverseEtlDbtCloudScheduleConfig
		  )
		| null;
};

/** Definition for specific day and time schedule. Days is list of numbered day of the week and hours is a list of hour of the day. The corresponding Timezone is also input as string. */
export type SegmentReverseEtlSpecificTimeScheduleConfig = {
	/** Days of the week. */
	days?: Array<number> | null;
	/** Hours of the day. */
	hours?: Array<number> | null;
	/** Timezone for the specified times. */
	timezone?: string | null;
};

/** Represents a role. */
export type SegmentRoleV1 = {
	/** The unique identifier of the role. */
	id?: string | null;
	/** The human-readable name of the role. */
	name?: string | null;
	/** The human-readable description of the role. */
	description?: string | null;
};

/** Represents a rule from a Tracking Plan. */
export type SegmentRuleV1 = {
	/** The type for this Tracking Plan rule. */
	type?: string | null;
	/** Key to this rule (free-form string like 'Button clicked'). */
	key?: string | null;
	/** JSON Schema of this rule. */
	jsonSchema?: SegmentJsonValue | null;
	/** Version of this rule. */
	version?: number | null;
	/** The timestamp of this rule's creation. */
	createdAt?: string | null;
	/** The timestamp of this rule's last change. */
	updatedAt?: string | null;
	/** The timestamp of this rule's deprecation. */
	deprecatedAt?: string | null;
};

export type SegmentSimpleDestination = {
	/** The id of the Integration. */
	id?: string | null;
	/** The name of the Destination. */
	name?: string | null;
	/** The Source of the Destination. */
	sourceId?: string | null;
	/** Whether the Integration is enabled or not. */
	enabled?: boolean | null;
	/** When the Integration connection was created. */
	createdAt?: string | null;
	/** When the Integration connection was last updated. */
	updatedAt?: string | null;
	/** The Destination settings. */
	settings?: Record<string, SegmentJsonValue> | null;
	/** The Destination id. */
	destinationId?: string | null;
	/** The Destination metadata. */
	metadata?: {
		id?: string | null;
		name?: string | null;
		slug?: string | null;
	} | null;
	/** Identifier sync configuration. Defines which external ids to sync and their selection strategies. Maximum 5 items allowed. If omitted, the default will be last email and last user_id, or all email and all user_id depending on the Destination. */
	idSyncConfiguration?: Array<SegmentIDSyncConfigurationInput> | null;
	/** The settings that a Destination requires to create audiences on a third-party platform. These settings are Destination-specific. Use the List Supported Destinations from Audience endpoint to find the required connection settings. */
	connectionSettings?: SegmentJsonValue | null;
};

/** A snapshot of the number of API calls for a given Source in a Workspace. */
export type SegmentSourceAPICallSnapshotV1 = {
	/** The Source id. */
	sourceId?: string | null;
	/** A bigint of the number of API calls in this snapshot. */
	apiCalls?: string | null;
	/** Timestamp of this snapshot within the billing cycle in the ISO-8601 format. */
	timestamp?: string | null;
};

/** Defines a data Source for Segment data. */
export type SegmentSourceAlpha = {
	/** The id of the Source. Config API note: analogous to `name`. */
	id?: string | null;
	/** The slug used to identify the Source in the Segment app. Config API note: equal to `name`. */
	slug?: string | null;
	/** The name of the Source. Config API note: equal to `displayName`. */
	name?: string | null;
	/** The metadata for the Source. Config API note: includes `catalogName` and `catalogId`. */
	metadata?: SegmentSourceMetadataV1 | null;
	/** The id of the Workspace that owns the Source. Config API note: equal to `parent`. */
	workspaceId?: string | null;
	/** Enable to receive data from the Source. */
	enabled?: boolean | null;
	/** The write keys used to send data from the Source. This field is left empty when the current token does not have the 'source admin' permission. */
	writeKeys?: Array<string> | null;
	/** The settings associated with the Source. */
	settings?: SegmentSourceSettingsAlpha | null;
	/** A list of labels applied to the Source. */
	labels?: Array<SegmentLabelV1> | null;
};

/** SourceEventVolumeDatapoint represents an individual timestamp/event count pair corresponding to a window of time designated by the granularity. */
export type SegmentSourceEventVolumeDatapointV1 = {
	/** The timestamp that corresponds to the beginning of the window given by the requested granularity. */
	time?: string | null;
	/** The number of valid events Segment received in the given window, after the events completed the validation process. */
	count?: number | null;
};

/** SourceEventVolume represents a time series of event volume for a Workspace broken down by the dimensions which the customer specifies (optional parameters). */
export type SegmentSourceEventVolumeV1 = {
	/** The Source where the events originated. */
	source?: SegmentEventSourceV1 | null;
	/** The name of the event, if applicable. */
	eventName?: string | null;
	/** The event type, if applicable. */
	eventType?: string | null;
	/** The total count for all events in the requested time frame. */
	total?: number | null;
	/** A list of the event counts broken down by the requested granularity. */
	series?: Array<SegmentSourceEventVolumeDatapointV1> | null;
};

/** A website, server library, mobile SDK, or cloud application which can send data into Segment. */
export type SegmentSourceMetadataV1 = {
	/** The id for this Source metadata in the Segment catalog. Config API note: analogous to `name`. */
	id?: string | null;
	/** The user-friendly name of this Source. Config API note: equal to `displayName`. */
	name?: string | null;
	/** The slug that identifies this Source in the Segment app. Config API note: equal to `name`. */
	slug?: string | null;
	/** The description of this Source. */
	description?: string | null;
	/** The logos for this Source. */
	logos?: SegmentLogosBeta | null;
	/** Options for this Source. */
	options?: Array<SegmentIntegrationOptionBeta> | null;
	/** A list of categories this Source belongs to. */
	categories?: Array<string> | null;
	/** True if this is a Cloud Event Source. */
	isCloudEventSource?: boolean | null;
	/** Support status of the Source. */
	status?: string | null;
	/** Partner Owned flag. */
	partnerOwned?: boolean | null;
};

/** A key-value object that contains instance-specific settings for a Source. The `options` field in the Source metadata defines the schema of this object. */
export type SegmentSourceSettingsAlpha = Record<string, SegmentJsonValue>;

/** The output of Source settings. */
export type SegmentSourceSettingsOutputV1 = {
	/** Track settings. */
	track?: SegmentTrackSourceSettingsV1 | null;
	/** Identify settings. */
	identify?: SegmentIdentifySourceSettingsV1 | null;
	/** Group settings. */
	group?: SegmentGroupSourceSettingsV1 | null;
	/** SourceId to forward violations to. */
	forwardingViolationsTo?: string | null;
	/** SourceId to forward blocked events to. */
	forwardingBlockedEventsTo?: string | null;
};

/** A key-value object that contains instance-specific settings for a Source. The `options` field in the Source metadata defines the schema of this object. */
export type SegmentSourceSettingsV1 = Record<string, SegmentJsonValue>;

/** Defines a data Source for Segment data. */
export type SegmentSourceV1 = {
	/** The id of the Source. Config API note: analogous to `name`. */
	id?: string | null;
	/** The slug used to identify the Source in the Segment app. Config API note: equal to `name`. */
	slug?: string | null;
	/** The name of the Source. Config API note: equal to `displayName`. */
	name?: string | null;
	/** The metadata for the Source. Config API note: includes `catalogName` and `catalogId`. */
	metadata?: SegmentSourceMetadataV1 | null;
	/** The id of the Workspace that owns the Source. Config API note: equal to `parent`. */
	workspaceId?: string | null;
	/** Enable to receive data from the Source. */
	enabled?: boolean | null;
	/** The write keys used to send data from the Source. This field is left empty when the current token does not have the 'source admin' permission. */
	writeKeys?: Array<string> | null;
	/** The settings associated with the Source. */
	settings?: SegmentSourceSettingsV1 | null;
	/** A list of labels applied to the Source. */
	labels?: Array<SegmentLabelV1> | null;
};

export type SegmentSpace = {
	id?: string | null;
	slug?: string | null;
	name?: string | null;
};

/** Represents an entry in the Space Warehouse Selective Sync schema for a Warehouse and Space pair. */
export type SegmentSpaceWarehouseSelectiveSyncItemAlpha = {
	/** The collection within the Source. */
	collection?: string | null;
	/** The id of the Warehouse this sync belongs to. */
	warehouseId?: string | null;
	/** The Enabled flag ok telling whether the Collection is enabled or not. */
	enabled?: boolean | null;
	/** A map that contains the properties within the collection to which the Warehouse should sync. */
	properties?: Record<string, SegmentJsonValue> | null;
};

/** Configures a schedule for specific days and times. */
export type SegmentSpecificDaysConfig = {
	/** Days of week for schedule (0=Sunday, 6=Saturday). */
	days?: Array<number> | null;
	/** Hours of day for schedule (0-23). */
	hours?: Array<number> | null;
	/** TZ database time zone identifier; for example, America/New_York. */
	timezone?: string | null;
};

/** StreamStatus represents status of each stream including all the Destinations corresponding to the stream. */
export type SegmentStreamStatusV1 = {
	id?: string | null;
	destinationStatus?: Array<SegmentDestinationStatusV1> | null;
};

/** Object representing the extract phase + details. */
export type SegmentSyncExtractPhase = {
	/** Counts the subset of records with status=new, which indicates records that were created/inserted/added. */
	addedCount?: string | null;
	/** Counts the subset of records with status=updated, which indicates records that were modified/updated. */
	updatedCount?: string | null;
	/** Counts the subset of records with status=deleted, which indicates records that were deleted/removed. */
	deletedCount?: string | null;
	/** Counts the total number of records/rows handled by extract, across all statuses. */
	extractCount?: string | null;
	/** Error code indicates a fatal sync error code, if applicable. */
	errorCode?: string | null;
	/** Time that the extract phase started. */
	startedAt?: string | null;
	/** Time that the extract phase finished. */
	finishedAt?: string | null;
};

/** Object representing the load phase + details. */
export type SegmentSyncLoadPhase = {
	/** Counts the subset of records successfully delivered to the downstream Destination. */
	deliverSuccessCount?: string | null;
	/** Counts the subset of records status that failed to be delivered by either receiving a permanent error (for example, 400 Bad Request) or by exhausting all retries for temporary errors (for example, 429 Too Many Requests). */
	deliverFailureCount?: string | null;
	/** Error code indicates a fatal sync error code, if applicable. */
	errorCode?: string | null;
	/** Time that the load phase started. */
	startedAt?: string | null;
	/** Time that the load phase finished. */
	finishedAt?: string | null;
};

/** Represents a notice within a sync for a Source and Warehouse pair. */
export type SegmentSyncNoticeV1 = {
	/** The severity of the notice. */
	level?: string | null;
	/** The human-readable message that describes the notice. */
	message?: string | null;
	/** The timestamp of this sync notice's creation. */
	createdAt?: string | null;
};

/** Represents a sync between a Source and Warehouse. A sync occurs when data from a Source is loaded into a Warehouse. */
export type SegmentSyncV1 = {
	/** The id of the Source loaded in the sync. */
	sourceId?: string | null;
	/** The start time of the sync. */
	start?: string | null;
	/** The time the sync completed. Returns null if unfinished. */
	end?: string | null;
	/** The status of the sync. */
	status?: string | null;
	/** The duration of the sync in seconds. Returns the partial duration if the sync has not finished yet. */
	duration?: number | null;
	/** The human-readable counterpart of `duration`. */
	humanDuration?: string | null;
	/** The number of rows synced into the Warehouse. */
	count?: number | null;
	/** Notices that contain the events that occurred during the sync. */
	notices?: Array<SegmentSyncNoticeV1> | null;
};

export type SegmentTrackSourceSettingsV1 = {
	/** Enable to allow unplanned track events. Config API note: equal to `allowUnplannedTrackEvents`. */
	allowUnplannedEvents?: boolean | null;
	/** Enable to allow unplanned track event properties. Config API note: equal to `allowUnplannedTrackEventProperties`. */
	allowUnplannedEventProperties?: boolean | null;
	/** Allow track event on violations. Config API note: equal to `allowTrackEventOnViolations`. */
	allowEventOnViolations?: boolean | null;
	/** Enable to allow track properties on violations. Config API note: equal to `allowTrackEventPropertiesOnViolations`. */
	allowPropertiesOnViolations?: boolean | null;
	/** The common track event on violations. Config API note: equal to `commonTrackEventOnViolations`. */
	commonEventOnViolations?: string | null;
};

/** Represents a Tracking Plan. */
export type SegmentTrackingPlanV1 = {
	/** The Tracking Plan's identifier. Config API note: analogous to `name`. */
	id?: string | null;
	/** The Tracking Plan's name. Config API note: equal to `displayName`. */
	name?: string | null;
	/** URL-friendly slug of this Tracking Plan. Config API note: equal to `name`. */
	slug?: string | null;
	/** The Tracking Plan's description. */
	description?: string | null;
	/** The Tracking Plan's type. */
	type?: string | null;
	/** The timestamp of the last change to the Tracking Plan. Config API note: equal to `updateTime`. */
	updatedAt?: string | null;
	/** The timestamp of this Tracking Plan's creation. Config API note: equal to `createTime`. */
	createdAt?: string | null;
};

export type SegmentTraitAlpha = {
	/** Trait key. */
	trait?: string | null;
	/** Trait type. */
	type?: SegmentTraitType | null;
	/** ISO timestamp of when the trait was last seen. */
	lastSeenAt?: string | null;
	/** Sample values for this trait. Only present when includeSampleValues is true. */
	samples?: Array<string> | null;
};

export type SegmentTraitOptions = {
	/** Determines whether data prior to the computed trait being created is included when determining the computed trait value. Note that including historical data may be needed in order to properly handle the definition specified. In these cases, Segment will automatically handle including historical… */
	includeHistoricalData?: boolean | null;
	/** Determines whether anonymous users should be included when determining the computed trait value. */
	includeAnonymousUsers?: boolean | null;
	/** If specified, the value of this field indicates the number of days, specified from the date the audience was created, that event data will be included from when determining audience membership. If unspecified, defer to the value of `includeHistoricalData` to determine whether historical data is… */
	backfillDurationDays?: number | null;
};

export type SegmentTraitType = string;

/** Represents a Transformation. */
export type SegmentTransformationV1 = {
	/** The id of the Transformation. */
	id?: string | null;
	/** The name of the Transformation. */
	name?: string | null;
	/** The Source associated with the Transformation. */
	sourceId?: string | null;
	/** The optional Destination metadata associated with the Transformation. */
	destinationMetadataId?: string | null;
	/** If the Transformation is enabled. */
	enabled?: boolean | null;
	/** If statement ([FQL](https://segment.com/docs/config-api/fql/)) to match events. For standard event matchers, use the following: Track -\> "event='\<eventName\>'" Identify -\> "type='identify'" Group -\> "type='group'" */
	if?: string | null;
	/** Optional boolean value if the Transformation should drop the event entirely when the if statement matches, ignores all other transforms. */
	drop?: boolean | null;
	/** Optional new event name for renaming events. Works only for 'track' event type. */
	newEventName?: string | null;
	/** Optional array for renaming properties collected by your events. */
	propertyRenames?: Array<SegmentPropertyRenameV1> | null;
	/** Optional array for transforming properties and values collected by your events. Limited to 10 properties. */
	propertyValueTransformations?: Array<SegmentPropertyValueTransformationV1> | null;
	/** Optional array for defining new properties in FQL. Limited to 1 property right now. */
	fqlDefinedProperties?: Array<SegmentFQLDefinedPropertyV1> | null;
	/** Optional array for allowing properties from your events. */
	allowProperties?: Array<string> | null;
	/** Optional object for hashing properties within an event. */
	hashPropertiesConfiguration?: SegmentHashPropertiesConfiguration | null;
};

/** Output for updating an activation for audience. */
export type SegmentUpdateActivationForAudienceOutput = {
	activation?: SegmentActivationOutput | null;
};

/** Audience output for update. */
export type SegmentUpdateAudienceForSpaceOutput = {
	/** The audience summary output. */
	audience?: SegmentAudienceSummary | null;
};

/** Output of updating a schedule for an audience. */
export type SegmentUpdateAudienceScheduleForAudienceOutput = {
	/** The updated audience schedule. */
	audienceSchedule?: SegmentAudienceSchedule | null;
};

/** Computed Trait output for get and update. */
export type SegmentUpdateComputedTraitForSpaceAlphaOutput = {
	/** The computed trait summary output. */
	computedTrait?: SegmentComputedTraitSummary | null;
};

/** Returns the updated Credential. */
export type SegmentUpdateCredentialV1Output = {
	/** The updated Credential. */
	credential?: SegmentCredentialV1 | null;
};

/** Output for updating a Destination for an Audience. */
export type SegmentUpdateDestinationForAudienceAlphaOutput = {
	/** The Destination that was updated. */
	destination?: {
		/** The id of the Destination that was updated. */
		id?: string | null;
	} | null;
	/** The id sync configuration for the Destination - array of external ids with their strategies. */
	idSyncConfiguration?: Array<SegmentIDSyncConfigurationInput> | null;
	/** The settings that a Destination requires to create audiences on a third-party platform. */
	connectionSettings?: SegmentJsonValue | null;
};

/** Returns the updated Destination. */
export type SegmentUpdateDestinationV1Output = {
	/** The updated Destination. */
	destination?: SegmentDestinationV1 | null;
};

/** Output for UpdateFilterById. */
export type SegmentUpdateFilterByIdOutput = {
	filter?: SegmentFilter | null;
};

/** Output for UpdateDestinationFilterV1. */
export type SegmentUpdateFilterForDestinationV1Output = {
	/** The updated Destination filter. */
	filter?: SegmentDestinationFilterV1 | null;
};

/** Create a Function. */
export type SegmentUpdateFunctionV1Output = {
	/** The updated Function object. */
	function?: SegmentFunctionV1 | null;
};

/** Returns the updated insert Function instance. */
export type SegmentUpdateInsertFunctionInstanceAlphaOutput = {
	/** The updated instance. */
	insertFunctionInstance?: SegmentInsertFunctionInstanceAlpha | null;
};

/** Returns the updated Warehouse. */
export type SegmentUpdateProfilesWarehouseForSpaceWarehouseAlphaOutput = {
	/** The updated Warehouse. */
	profilesWarehouse?: SegmentProfilesWarehouseAlpha | null;
};

/** Defines the results of updating a Model. */
export type SegmentUpdateReverseEtlModelOutput = {
	/** The created Model. */
	reverseEtlModel?: SegmentReverseEtlModel | null;
};

/** Updates Tracking Plan rules. Non-existent rules are added. */
export type SegmentUpdateRulesInTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** Output of the Source with updated settings. */
export type SegmentUpdateSchemaSettingsInSourceV1Output = {
	/** The id of the updated Source. Config API note: analogous to `parent` and `name`. */
	sourceId?: string | null;
	/** The output of Source settings. */
	settings?: SegmentSourceSettingsOutputV1 | null;
};

/** Results from a SelectiveSync patch to a Space Warehouse connection. */
export type SegmentUpdateSelectiveSyncForWarehouseAndSpaceAlphaOutput = {
	/** Status of the update operation. */
	status?: string | null;
};

/** Results from updating the schema for a Warehouse/source pair. */
export type SegmentUpdateSelectiveSyncForWarehouseV1Output = {
	/** Status of the update operation. */
	status?: string | null;
	/** Warnings returned by the operation. */
	warnings?: Array<string> | null;
};

/** Returns the updated Source. */
export type SegmentUpdateSourceV1Output = {
	/** The updated Source. */
	source?: SegmentSourceV1 | null;
};

/** Returns the updated Destination subscription. */
export type SegmentUpdateSubscriptionForDestinationAlphaOutput = {
	/** The Destination subscription. */
	subscription?: SegmentDestinationSubscription | null;
};

/** Result of an UpdateTrackingPlan call. */
export type SegmentUpdateTrackingPlanV1Output = {
	/** The operation status. */
	status?: string | null;
};

/** The output of an updated Transformation. */
export type SegmentUpdateTransformationV1Output = {
	/** The updated Transformation. */
	transformation?: SegmentTransformationV1 | null;
};

/** Returns the updated user group. */
export type SegmentUpdateUserGroupV1Output = {
	/** The updated user group. */
	userGroup?: SegmentUserGroupV1 | null;
};

/** Returns the updated Warehouse. */
export type SegmentUpdateWarehouseV2Output = {
	/** The updated Warehouse. */
	warehouse?: SegmentWarehouseV2 | null;
};

/** A set of users with a set of shared permissions. */
export type SegmentUserGroupV1 = {
	/** The number of members in the user group. */
	memberCount?: number | null;
	/** The permissions associated with the user group. */
	permissions?: Array<SegmentPermissionV1> | null;
	/** The id of the user group. */
	id?: string | null;
	/** The name of the user group. */
	name?: string | null;
};

/** A user belonging to a Segment Workspace. */
export type SegmentUserV1 = {
	/** The unique identifier of this user. Config API note: analogous to `name`. */
	id?: string | null;
	/** The human-readable name of this user. */
	name?: string | null;
	/** The email address associated with this user. */
	email?: string | null;
	/** The permissions associated with this user. */
	permissions?: Array<SegmentPermissionV1> | null;
};

/** A snapshot of MTU metrics for a given Source within the given usage period. */
export type SegmentUsersPerSourceSnapshotV1 = {
	/** The Source id. */
	sourceId?: string | null;
	/** The start of the usage period, in unix time (seconds since epoch). */
	periodStart?: number | null;
	/** The end of the usage period, in unix time (seconds since epoch). */
	periodEnd?: number | null;
	/** A bigint of the number of anonymous users in this snapshot. */
	anonymous?: string | null;
	/** A bigint of the number of anonymous identified users in this snapshot. */
	anonymousIdentified?: string | null;
	/** A bigint of the number of identified users in this snapshot. */
	identified?: string | null;
	/** A bigint of the number of never identified users in this snapshot. */
	neverIdentified?: string | null;
	/** The timestamp of this snapshot within the billing cycle, in the ISO-8601 format. */
	timestamp?: string | null;
};

/** Represents a Function Version in a list. */
export type SegmentVersion = {
	/** An identifier for this version. */
	id?: string | null;
	/** Author of this version. */
	author?: string | null;
	/** Source code of this version. */
	code?: string | null;
	/** The deployed status of this version. */
	isDeployed?: boolean | null;
	/** The time of this Version's creation. */
	createdAt?: string | null;
	/** The time of this Version's latest update. */
	updatedAt?: string | null;
	/** The time of this Version's last deployment. */
	deployedAt?: string | null;
};

/** Determines the time of day at which a Warehouse should sync. */
export type SegmentWarehouseAdvancedSyncV1 = {
	/** The hour of day for which to enable/disable a sync, between 0 and 23. */
	hourOfDay?: number | null;
	/** Enable to the sync at the specified hour. */
	enabled?: boolean | null;
};

/** The metadata for an instance of Segment’s data Warehouse product. */
export type SegmentWarehouseMetadataV1 = {
	/** The id of this object. */
	id?: string | null;
	/** The name of this object. */
	name?: string | null;
	/** A human-readable, unique identifier for object. */
	slug?: string | null;
	/** A description, in English, of this object. */
	description?: string | null;
	/** Logo information for this object. */
	logos?: SegmentLogosBeta | null;
	/** The Integration options for this object. */
	options?: Array<SegmentIntegrationOptionBeta> | null;
};

/** Represents an entry in the Warehouse Selective Sync schema for a Warehouse and Source pair. */
export type SegmentWarehouseSelectiveSyncItemV1 = {
	/** The Source id attached to this Warehouse. */
	sourceId?: string | null;
	/** The collection within the Source. */
	collection?: string | null;
	/** The id of the Warehouse this sync belongs to. */
	warehouseId?: string | null;
	/** Whether this Selective Sync item is enabled. */
	enabled?: boolean | null;
	/** A map that contains the properties within the collection to which the Warehouse should sync. */
	properties?: Record<string, SegmentJsonValue> | null;
};

/** A key-value object that contains instance-specific Warehouse settings. */
export type SegmentWarehouseSettingsV1 = Record<string, SegmentJsonValue>;

/** A key-value object that contains the settings for a Warehouse, derived from its associated Credential. */
export type SegmentWarehouseSettingsV2 = Record<string, SegmentJsonValue>;

/** Defines a data Warehouse used as a Destination for Segment data. */
export type SegmentWarehouseV1 = {
	/** The id of the Warehouse. */
	id?: string | null;
	/** The metadata for the Warehouse. */
	metadata?: SegmentWarehouseMetadataV1 | null;
	/** The id of the Workspace that owns this Warehouse. */
	workspaceId?: string | null;
	/** When set to true, this Warehouse receives data. */
	enabled?: boolean | null;
	/** The settings associated with this Warehouse. Common settings are connection-related configuration used to connect to it, for example host, username, and port. */
	settings?: SegmentWarehouseSettingsV1 | null;
};

/** Defines a data Warehouse used as a Destination for Segment data. Unlike the v1 Warehouse, a v2 Warehouse always has a Credential — its connection settings are always derived from that Credential rather than being stored directly on the Warehouse. There is no `metadataId`; the Warehouse type is… */
export type SegmentWarehouseV2 = {
	/** The id of the Warehouse. */
	id?: string | null;
	/** The id of the Workspace that owns this Warehouse. */
	workspaceId?: string | null;
	/** A human-readable name for this Warehouse. */
	name?: string | null;
	/** When set to true, this Warehouse receives data. */
	enabled?: boolean | null;
	/** The id of the Credential this Warehouse is connected to. */
	credentialId?: string | null;
	/** The settings for this Warehouse, derived from its associated Credential. Sensitive fields are redacted. */
	settings?: SegmentWarehouseSettingsV2 | null;
	/** The time this Warehouse was created. */
	createdAt?: string | null;
	/** The time this Warehouse was last updated. */
	updatedAt?: string | null;
};

/** An organized group of Sources and Destinations managed by a team. */
export type SegmentWorkspaceV1 = {
	/** The unique identifier. */
	id?: string | null;
	/** The URL-friendly slug. */
	slug?: string | null;
	/** The human-readable name. */
	name?: string | null;
};

export type SegmentOperationInputs = {
	'activations.batchQuery': {
		spaceId: string;
		/** Audience IDs to list activations for. Max 100 IDs per call. Duplicates are de-duplicated server-side but still count toward the cap. Omit (or pass an empty array) to scan every audience in the space instead - see the `pagination` doc below for how that changes what a "page" means. Omitting this… */
		audienceIds?: Array<string>;
		/** Optional pagination. When `audienceIds` is provided, this paginates the combined activation result set across those audiences (`count` = activations per page). When `audienceIds` is omitted, this paginates the space's *audiences* instead, fully expanding each page's activations (`count` =… */
		pagination?: SegmentPaginationInputInput;
	};
	'activations.create': {
		spaceId: string;
		audienceId: string;
		connectionId: string;
		/** Determines whether an activation is enabled. */
		enabled?: boolean;
		/** Determines whether to perform a full resync upon creation. If true, the entire audience is resent to the Destination from scratch. If false, only future changes will be synced. */
		performResync: boolean;
		/** Determines when an event is sent to the Destination. Possible values: - **Audience Entered**: Sends an event when a profile or entity enters the audience. - **Audience Exited**: Sends an event when a profile or entity exits the audience. - **Audience Membership Changed**: Sends an event for both… */
		activationType: string;
		/** Activation name. For Warehouse Destinations, this is used as the table name. */
		activationName: string;
		/** Optional human-readable label for the activation. Only supported for Warehouse Destinations. When omitted, the activationName is used as the label. */
		displayName?: string;
		/** The data points used to enrich the event. Defines which profile traits and/or entity properties are included in the event sent to the Destination. For Action Destinations, any traits or properties specified here must also be included in the destinationMapping to define which Destination fields… */
		personalization?: SegmentPersonalizationInputInput;
		/** Defines the specific action and data mapping for the Destination. Only applicable for Action Destinations. Action id: Specifies which action to perform on the Destination (for example: add contact, update list). Settings/Mapping: Defines how event data (including personalization traits)… */
		destinationMapping?: SegmentDestinationSubscriptionConfigurationInput;
	};
	'activations.delete': {
		spaceId: string;
		audienceId: string;
		id: string;
	};
	'activations.get': {
		spaceId: string;
		audienceId: string;
		id: string;
	};
	'activations.list': {
		spaceId: string;
		audienceId: string;
		/** Optional pagination. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'activations.update': {
		spaceId: string;
		audienceId: string;
		id: string;
		/** Determines whether an activation is enabled. */
		enabled?: boolean;
		/** Activation name. For Warehouse Destinations, this is used as the table name. Omit this field to leave the name unchanged. An empty string is ignored rather than applied. */
		activationName?: string;
		/** Optional human-readable label for the activation. Only supported for Warehouse Destinations. Send null to clear. When omitted, the activationName is used as the label. */
		displayName?: string | null;
		/** The data points used to enrich the event. Defines which profile traits and/or entity properties are included in the event sent to the Destination. For Action Destinations, any traits or properties specified here must also be included in the destinationMapping to define which Destination fields… */
		personalization?: SegmentPersonalizationInputInput;
		/** Defines the specific action and data mapping for the Destination. Only applicable for Action Destinations. Action id: Specifies which action to perform on the Destination (for example: add contact, update list). Settings/Mapping: Defines how event data (including personalization traits)… */
		destinationMapping?: SegmentDestinationSubscriptionConfigurationInput;
		/** Determines whether to perform a full resync after the update. If true, the entire audience is resent to the Destination using the updated configuration. If false, the update applies only to future syncs. */
		performResync?: boolean;
	};
	'audiences.create': {
		spaceId: string;
		/** Name of the audience. */
		name: string;
		/** Determines whether a computation is enabled. */
		enabled?: boolean;
		/** Description of the audience. */
		description?: string;
		/** Query language definition. */
		definition: SegmentAudienceDefinitionInput;
		/** Denotes the type of audience product. Possible values: USERS, ACCOUNTS, LINKED. */
		audienceType: 'ACCOUNTS' | 'LINKED' | 'USERS';
		/** Represents the options of Including Anonymous users and Historical Data. */
		options?: SegmentAudienceOptionsInput;
	};
	'audiences.createPreview': {
		spaceId: string;
		/** Query language definition. */
		definition: SegmentAudienceDefinitionInput;
		/** Denotes the type of audience product. Possible values: USERS, ACCOUNTS, LINKED. */
		audienceType: 'ACCOUNTS' | 'LINKED' | 'USERS';
		/** Options which should be applied when segmenting audiences. */
		options?: SegmentCreateAudiencePreviewOptionsInput;
	};
	'audiences.delete': {
		spaceId: string;
		id: string;
	};
	'audiences.destinations.add': {
		spaceId: string;
		audienceId: string;
		/** The Destination. */
		destination: SegmentDestinationInputInput;
		/** Identifier sync configuration. Defines which external ids to sync and their selection strategies. Maximum 5 items allowed. If omitted, the default will be last email and last user_id, or all email and all user_id depending on the Destination. */
		idSyncConfiguration?: Array<SegmentIDSyncConfigurationInputInput>;
		/** The settings that a Destination requires to create audiences on a third-party platform. These settings are Destination-specific. Use the List Supported Destinations from Audience endpoint to find the required connection settings. */
		connectionSettings?: SegmentJsonValue;
	};
	'audiences.destinations.list': {
		spaceId: string;
		audienceId: string;
		/** Optional pagination. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'audiences.destinations.listSupported': {
		spaceId: string;
		audienceType: string;
		/** Optional destination slug to filter results. This parameter exists in alpha. */
		slug?: string;
		/** Optional destination action id to filter results. This parameter exists in alpha. */
		actionId?: string;
	};
	'audiences.destinations.remove': {
		spaceId: string;
		audienceId: string;
		destinationId: string;
	};
	'audiences.destinations.update': {
		spaceId: string;
		audienceId: string;
		destinationId: string;
		/** Identifier sync configuration - array of external IDs to sync with their strategies. Maximum 5 items allowed. The supplied array replaces the entire stored configuration, so include every external id that should remain. Omitting mapTo on an entry clears any value stored for it. An empty array is… */
		idSyncConfiguration?: Array<SegmentIDSyncConfigurationInputInput>;
		/** The settings that a Destination requires to create audiences on a third-party platform. The supplied object replaces the stored settings outright, so include every setting that should remain. Settings that are omitted are removed. An empty object is treated the same as omitting the field and… */
		connectionSettings?: SegmentJsonValue;
	};
	'audiences.get': {
		spaceId: string;
		id: string;
		/** Additional resource to include, support schedules only. This parameter exists in alpha. */
		include?: 'schedules';
	};
	'audiences.getPreview': {
		spaceId: string;
		id: string;
	};
	'audiences.list': {
		spaceId: string;
		/** Optional search criteria This parameter exists in alpha. */
		search?: SegmentListAudienceSearchInputInput;
		/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. This parameter exists in alpha. */
		pagination?: SegmentListAudiencesPaginationInputInput;
		/** Additional resource to include, support schedules only. This parameter exists in alpha. */
		include?: 'schedules';
	};
	'audiences.listConsumers': {
		spaceId: string;
		id: string;
		/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** Optional search criteria This parameter exists in alpha. */
		search?: SegmentListAudienceSearchInputInput;
		/** Optional sort criteria This parameter exists in alpha. */
		sort?: SegmentListAudienceConsumersSortInputInput;
	};
	'audiences.run': {
		spaceId: string;
		audienceId: string;
	};
	'audiences.schedules.create': {
		spaceId: string;
		id: string;
		/** Strategy of the audience schedule (periodic or specific days). */
		strategy: 'PERIODIC' | 'SPECIFIC_DAYS';
		/** Configuration for PERIODIC or SPECIFIC_DAYS strategies. */
		config:
			| (SegmentPeriodicConfigInput | SegmentSpecificDaysConfigInput)
			| null;
	};
	'audiences.schedules.delete': {
		spaceId: string;
		id: string;
		scheduleId: string;
	};
	'audiences.schedules.get': {
		spaceId: string;
		id: string;
		scheduleId: string;
	};
	'audiences.schedules.list': {
		spaceId: string;
		id: string;
	};
	'audiences.schedules.update': {
		spaceId: string;
		id: string;
		scheduleId: string;
		/** Strategy of the audience schedule (periodic or specific days). */
		strategy: 'PERIODIC' | 'SPECIFIC_DAYS';
		/** Configuration for PERIODIC or SPECIFIC_DAYS strategies. */
		config:
			| (SegmentPeriodicConfigInput | SegmentSpecificDaysConfigInput)
			| null;
	};
	'audiences.update': {
		spaceId: string;
		id: string;
		/** Enabled/disabled status for the audience. */
		enabled?: boolean;
		/** The name of the computation. */
		name?: string;
		/** The description of the computation. */
		description?: string;
		/** Represents the Compute Query Language definition of the computation and type of computation. */
		definition?: SegmentAudienceDefinitionWithoutTargetEntityInput;
		/** Represents the options of Including Anonymous users and Historical Data. */
		options?: SegmentAudienceOptionsInput;
	};
	'auditTrail.list': {
		/** Filter response to events that happened after this time. This parameter exists in v1. */
		startTime?: string;
		/** Filter response to events that happened before this time. Defaults to the current time, or the end time from the pagination cursor. This parameter exists in v1. */
		endTime?: string;
		/** Filter response to events that affect a specific resource, for example, a single Source. This parameter exists in v1. */
		resourceId?: string;
		/** Filter response to events that affect a specific type, for example, Sources, Warehouses, and Tracking Plans. This parameter exists in v1. */
		resourceType?: string;
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'catalog.getDestination': {
		destinationMetadataId: string;
	};
	'catalog.getSource': {
		sourceMetadataId: string;
	};
	'catalog.getWarehouse': {
		warehouseMetadataId: string;
	};
	'catalog.listDestinations': {
		/** Required pagination parameters used to filter the Destinations catalog. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'catalog.listSources': {
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'catalog.listWarehouses': {
		/** Optional pagination params used to filter the Warehouses catalog. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'computedTraits.create': {
		spaceId: string;
		/** The name of the computation. */
		name: string;
		/** Determines whether a computation is enabled. */
		enabled?: boolean;
		/** The description of the computation. */
		description?: string;
		/** Represents the Compute Query Language definition of the computation and type of computation. */
		definition: SegmentTraitDefinitionInput;
		/** Options which should be applied when aggregating computed traits. */
		options?: SegmentTraitOptionsInput;
	};
	'computedTraits.delete': {
		spaceId: string;
		id: string;
	};
	'computedTraits.get': {
		spaceId: string;
		id: string;
	};
	'computedTraits.list': {
		spaceId: string;
		/** Information about the pagination of this response. [See pagination](https://docs.segmentapis.com/tag/Pagination/#section/Pagination-parameters) for more info. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'computedTraits.update': {
		spaceId: string;
		id: string;
		/** Enabled/disabled status for the computed trait. */
		enabled?: boolean;
		/** The name of the computation. */
		name?: string;
		/** The description of the computation. */
		description?: string;
		/** Query language definition and type. Note: The definition for a Computed Trait updated using the API is not editable through the Segment App. */
		definition?: SegmentTraitDefinitionInput;
	};
	'credentials.create': {
		/** A human-readable name for this Credential. */
		name: string;
		/** A key-value object that contains type-specific settings for this Credential. `settings.type` is required and determines the Credential type (for example `Snowflake` or `Redshift`). Different types require different settings; see the `settings.type` discriminator in the OpenAPI spec for the full… */
		settings: SegmentCredentialSettingsV1Input;
	};
	'credentials.delete': {
		credentialId: string;
	};
	'credentials.get': {
		credentialId: string;
	};
	'credentials.list': {
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'credentials.listConsumers': {
		credentialId: string;
		/** Defines the pagination parameters for the list of Warehouses. This parameter exists in v1. */
		warehousesPagination?: SegmentPaginationInputInput;
		/** Defines the pagination parameters for the list of Sources. This parameter exists in v1. */
		sourcesPagination?: SegmentPaginationInputInput;
	};
	'credentials.update': {
		credentialId: string;
		/** An optional human-readable name to associate with this Credential. */
		name?: string;
		/** A key-value object that contains type-specific settings for this Credential. Supports partial updates — only the fields you want to change need to be provided. `settings.type` cannot be changed. */
		settings?: SegmentCredentialSettingsV1Input;
	};
	'customerInsights.createDownload': {
		/** The collection's unique id. */
		collectionId: string;
		/** The ISO8601 formatted timestamp corresponding to a specific hour and day to retrieve data for. E.g.: 2025-05-07T23:00:00Z Objects are bucketed by hour and a month of data is retained. */
		hour: string;
	};
	'dbt.triggerModelSync': {
		/** The Source id to trigger a dbt model sync. */
		sourceId: string;
	};
	'deliveryOverview.getFailedDelivery': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The id tied to a Workspace Destination. This parameter exists in beta. */
		destinationConfigId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, `discard Reason`, `app Version`, `subscription Id`, `activationId`, `audienceId`, and `spaceId`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, `discard Reason`, `app Version`, `subscription Id`, `activationId`, `audienceId`, and/or `spaceId` that can be applied in addition to a `group By`. This parameter exists in beta. */
		filter?: SegmentDeliveryOverviewDestinationFilterByInput;
		/** Params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'deliveryOverview.getFailedOnIngest': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, `discard Reason`, and/or `appVersion`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, `discard Reason`, and/or `app Version` that can be applied in addition to a `group By`. This parameter exists in beta. */
		filter?: SegmentDeliveryOverviewSourceFilterByInput;
		/** Optional params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'deliveryOverview.getFilteredAtDestination': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The id tied to a Workspace Destination. This parameter exists in beta. */
		destinationConfigId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, `discard Reason`, `app Version`, `subscription Id`, `activationId`, `audienceId`, and `spaceId`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, `discard Reason`, `app Version`, `subscription Id`, `activationId`, `audienceId`, and/or `spaceId` that can be applied in addition to a `group By`. This parameter exists in beta. */
		filter?: SegmentDeliveryOverviewDestinationFilterByInput;
		/** Params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'deliveryOverview.getFilteredAtSource': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, `discard Reason`, and `app Version`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, `discard Reason`, and/or `app Version` that can be applied in addition to a `group By`. This parameter exists in beta. */
		filter?: SegmentDeliveryOverviewSourceFilterByInput;
		/** Optional params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'deliveryOverview.getSuccessfulDelivery': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The id tied to a Workspace Destination. This parameter exists in beta. */
		destinationConfigId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, `discard Reason`, `app Version`, `subscription Id`, `activationId`, `audienceId`, and `spaceId`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, `discard Reason`, `appVersion`, `subscription Id`, `activationId`, `audienceId`, or `spaceId` that can be applied in addition to a `group By`. If you would like to view retry attempts for a successful delivery, you can filter `discard Reason`… */
		filter?: SegmentDeliveryOverviewDestinationFilterByInput;
		/** Params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'deliveryOverview.getSuccessfullyReceived': {
		/** The sourceId for the Workspace. This parameter exists in beta. */
		sourceId: string;
		/** The ISO8601 formatted timestamp corresponding to the beginning of the requested time frame, inclusive. This parameter exists in beta. */
		startTime: string;
		/** The ISO8601 formatted timestamp corresponding to the end of the requested time frame, noninclusive. This parameter exists in beta. */
		endTime: string;
		/** A comma-delimited list of strings representing one or more dimensions to group the result by. Valid options are: `event Name`, `event Type`, and/or `app Version`. This parameter exists in beta. */
		groupBy?: Array<string>;
		/** The size of each bucket in the requested window. Based on the granularity chosen, there are restrictions on the time range you can query: **Minute**: - Max time range: 4 hours - Oldest possible start time: 48 hours in the past **Hour**: - Max Time range: 14 days - Oldest possible start time: 30… */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** An optional filter for `event Name`, `event Type`, and/or `app Version` that can be applied in addition to a `group By`. This parameter exists in beta. */
		filter?: SegmentDeliveryOverviewSuccessfullyReceivedFilterByInput;
		/** Optional params to specify the page cursor and count. This parameter exists in beta. */
		pagination?: SegmentPaginationInputInput;
	};
	'destinations.create': {
		/** The id of the Source to connect to this Destination instance. Config API note: analogous to `parent`. */
		sourceId: string;
		/** The id of the metadata to link to the new Destination. */
		metadataId: string;
		/** Whether this Destination should receive data. */
		enabled?: boolean;
		/** Defines the display name of the Destination. Config API note: equal to `displayName`. */
		name?: string;
		/** An object that contains settings for the Destination based on the "required" and "advanced" settings present in the Destination metadata. Config API note: equal to `config`. */
		settings: Record<string, SegmentJsonValue>;
	};
	'destinations.delete': {
		destinationId: string;
	};
	'destinations.filters.create': {
		destinationId: string;
		/** The id of the Source associated with this filter. */
		sourceId: string;
		/** The filter's condition. */
		if: string;
		/** Actions for the Destination filter. */
		actions: Array<SegmentDestinationFilterActionV1Input>;
		/** The title of the filter. */
		title: string;
		/** The description of the filter. */
		description?: string;
		/** When set to true, the Destination filter is active. */
		enabled: boolean;
	};
	'destinations.filters.delete': {
		destinationId: string;
		filterId: string;
	};
	'destinations.filters.get': {
		destinationId: string;
		filterId: string;
	};
	'destinations.filters.list': {
		destinationId: string;
		/** Pagination options. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'destinations.filters.preview': {
		/** The filter to preview. */
		filter: SegmentPreviewDestinationFilterV1Input;
		/** The JSON payload to apply the filter to. */
		payload: Record<string, SegmentJsonValue>;
	};
	'destinations.filters.update': {
		destinationId: string;
		filterId: string;
		/** The FQL if condition to update. */
		if?: string;
		/** Actions for this Destination filter. */
		actions?: Array<SegmentDestinationFilterActionV1Input>;
		/** The title to update. */
		title?: string;
		/** The description of this filter. */
		description?: string | null;
		/** When set to true, this Destination filter is active. */
		enabled?: boolean;
	};
	'destinations.get': {
		destinationId: string;
	};
	'destinations.getDeliveryMetrics': {
		destinationId: string;
		/** The id of the Source linked to the Destination. Config API note: analogous to `parent`. This parameter exists in beta. */
		sourceId: string;
		/** Filter events that happened after this time. Defaults to: - 1 hour ago if granularity is `MINUTE`. - 7 days ago if granularity is `HOUR`. - 30 days ago if granularity is `DAY`. This parameter exists in beta. */
		startTime?: string;
		/** Filter events that happened before this time. Defaults to now if not set. This parameter exists in beta. */
		endTime?: string;
		/** The granularity to filter metrics to. Either `MINUTE`, `HOUR` or `DAY`. Defaults to `MINUTE` if not set. This parameter exists in beta. */
		granularity?: 'DAY' | 'HOUR' | 'MINUTE';
	};
	'destinations.list': {
		/** Required pagination params for the request. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'destinations.subscriptions.create': {
		destinationId: string;
		/** A user-defined name for the subscription. */
		name: string;
		/** The associated action id the subscription should trigger. */
		actionId: string;
		/** The FQL statement. */
		trigger: string;
		/** Is the subscription enabled. */
		enabled: boolean;
		/** The fields used for configuring this action. */
		settings?: SegmentDestinationSubscriptionFieldsInput;
		/** When creating a Reverse ETL connection, indicates the Model being used to extract data. */
		modelId?: string;
	};
	'destinations.subscriptions.delete': {
		destinationId: string;
		id: string;
	};
	'destinations.subscriptions.get': {
		destinationId: string;
		id: string;
	};
	'destinations.subscriptions.list': {
		destinationId: string;
		/** Pagination options. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'destinations.subscriptions.update': {
		destinationId: string;
		id: string;
		/** A set of valid Destination input params required for updating. */
		input: SegmentDestinationSubscriptionUpdateInputInput;
	};
	'destinations.update': {
		destinationId: string;
		/** Defines the display name of the Destination. Config API note: equal to `displayName`. */
		name?: string | null;
		/** Whether this Destination should receive data. */
		enabled?: boolean;
		/** An optional object that contains settings for the Destination based on the "required" and "advanced" settings present in the Destination metadata. Config API note: equal to `config`. */
		settings?: Record<string, SegmentJsonValue>;
	};
	'events.getVolume': {
		/** The size of each bucket in the requested window. This parameter exists in v1. */
		granularity: 'DAY' | 'HOUR' | 'MINUTE';
		/** The ISO8601 formatted timestamp that corresponds to the beginning of the requested time frame, inclusive. This parameter exists in v1. */
		startTime: string;
		/** The ISO8601 formatted timestamp that corresponds to the end of the requested time frame, noninclusive. Segment recommends that you lag queries 1 minute behind clock time to reduce the risk for latency to impact the counts. This parameter exists in v1. */
		endTime: string;
		/** A comma-delimited list of strings that represents the dimensions to group the result by. The options are: `eventName`, `eventType` and `source`. This parameter exists in v1. */
		groupBy?: Array<string>;
		/** A list of strings which filters the results to the given SourceIds. This parameter exists in v1. */
		sourceId?: Array<string>;
		/** A list of strings which filters the results to the given EventNames. This parameter exists in v1. */
		eventName?: Array<string>;
		/** A list of strings which filters the results to the given EventTypes. This parameter exists in v1. */
		eventType?: Array<string>;
		/** A list of strings which filters the results to the given AppVersions. This parameter exists in v1. */
		appVersion?: Array<string>;
		/** Pagination input for event volume by Workspace. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'filters.create': {
		/** The Space id to filter on. */
		integrationId: string;
		/** Whether the filter is enabled. */
		enabled?: boolean;
		/** The name of the filter. */
		name: string;
		/** The description of the filter. */
		description?: string;
		/** The "if" statement for a filter. */
		if: string;
		/** Whether the event is dropped. */
		drop?: boolean;
	};
	'filters.delete': {
		id: string;
	};
	'filters.get': {
		id: string;
	};
	'filters.list': {
		/** The Space Id for which to fetch filters This parameter exists in beta. */
		integrationId: string;
		/** Pagination parameters. This parameter exists in beta. */
		pagination?: SegmentListFiltersPaginationInputInput;
	};
	'filters.update': {
		id: string;
		/** The Integration id of the resource. */
		integrationId: string;
		/** Whether the filter is enabled. */
		enabled?: boolean;
		/** The name of the filter. */
		name?: string;
		/** The description of the filter. */
		description?: string;
		/** The "if" statement for a filter. */
		if?: string;
		/** Whether the event is dropped. */
		drop?: boolean;
	};
	'functions.create': {
		/** The Function code. */
		code: string;
		/** The list of settings for this Function. */
		settings?: Array<SegmentFunctionSettingV1Input>;
		/** A display name for this Function. Note that Destination Functions append the Workspace to the display name. */
		displayName: string;
		/** The URL of the logo for this Function. */
		logoUrl?: string;
		/** The Function type. Config API note: equal to `type`. */
		resourceType:
			| 'DESTINATION'
			| 'INSERT_DESTINATION'
			| 'INSERT_SOURCE'
			| 'INSERT_TRANSFORMATION'
			| 'SOURCE';
		/** A description for this Function. */
		description?: string;
	};
	'functions.delete': {
		functionId: string;
	};
	'functions.deploy': {
		functionId: string;
	};
	'functions.get': {
		functionId: string;
	};
	'functions.getVersion': {
		functionId: string;
		versionId: string;
	};
	'functions.insertInstances.create': {
		/** Insert Function id to which this instance is associated. Note: Remove the ifnd_/ifns_ prefix from the id. */
		functionId: string;
		/** The Source or Destination id to be connected. */
		integrationId: string;
		/** Whether this insert Function instance should be enabled for the Destination. */
		enabled?: boolean;
		/** Defines the display name of the insert Function instance. */
		name: string;
		/** An object that contains settings for this insert Function instance based on the settings present in the insert Function class. */
		settings: Record<string, SegmentJsonValue>;
	};
	'functions.insertInstances.delete': {
		instanceId: string;
	};
	'functions.insertInstances.get': {
		instanceId: string;
	};
	'functions.insertInstances.list': {
		/** Pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** The insert Function class id to lookup. This parameter exists in alpha. */
		functionId: string;
	};
	'functions.insertInstances.update': {
		instanceId: string;
		/** Whether this insert Function instance should be enabled for the Destination. */
		enabled?: boolean;
		/** Defines the display name of the insert Function instance. */
		name?: string;
		/** An object that contains settings for this insert Function instance based on the settings present in the insert Function class. */
		settings: Record<string, SegmentJsonValue>;
	};
	'functions.list': {
		/** Pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
		/** The Function type. Config API note: equal to `type`. This parameter exists in v1. */
		resourceType:
			| 'DESTINATION'
			| 'INSERT_DESTINATION'
			| 'INSERT_SOURCE'
			| 'INSERT_TRANSFORMATION'
			| 'SOURCE';
	};
	'functions.listVersions': {
		functionId: string;
		/** Pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'functions.restoreVersion': {
		functionId: string;
		/** An identifier for this version. */
		versionId: string;
	};
	'functions.update': {
		functionId: string;
		/** The Function code. */
		code?: string;
		/** The list of settings for this Function. */
		settings?: Array<SegmentFunctionSettingV1Input>;
		/** A display name for this Function. */
		displayName?: string;
		/** A logo for this Function. */
		logoUrl?: string;
		/** A description for this Function. */
		description?: string;
	};
	'invites.create': {
		/** The list of invites. */
		invites: Array<SegmentInviteV1Input>;
	};
	'invites.delete': {
		/** The list of emails to delete invites for. This parameter exists in v1. */
		emails: Array<string>;
	};
	'invites.list': {
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'labels.create': {
		/** The new label to create in the Workspace. */
		label: SegmentLabelV1Input;
	};
	'labels.delete': {
		key: string;
		value: string;
	};
	'labels.list': Record<string, never>;
	'livePlugins.create': {
		sourceId: string;
		/** The Live Plugin code to be uploaded. */
		code: string;
	};
	'livePlugins.deleteCode': {
		sourceId: string;
	};
	'livePlugins.getLatest': {
		sourceId: string;
	};
	'profilesSync.create': {
		spaceId: string;
		/** The Warehouse metadata to use. */
		metadataId: string;
		/** An optional human-readable name for this Warehouse. */
		name?: string;
		/** Enable to allow this Warehouse to receive data. Defaults to true. */
		enabled?: boolean;
		/** A key-value object that contains instance-specific settings for a Warehouse. Different kinds of Warehouses require different settings. The required and optional settings for a Warehouse are described in the `options` object of the associated Warehouse metadata. You can find the full list of… */
		settings: SegmentWarehouseSettingsV1Input;
		/** The custom schema name that Segment uses on the Warehouse side. The space slug value is default otherwise. The schema name cannot be an existing schema name in the Warehouse. To use an existing schema name, please create a profiles Warehouse through the Segment app UI. */
		schemaName?: string;
	};
	'profilesSync.delete': {
		spaceId: string;
		warehouseId: string;
	};
	'profilesSync.list': {
		spaceId: string;
		/** Defines the pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'profilesSync.listSelectiveSyncs': {
		spaceId: string;
		warehouseId: string;
		/** Defines the pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'profilesSync.update': {
		spaceId: string;
		warehouseId: string;
		/** An optional human-readable name for this Warehouse. */
		name?: string;
		/** Enable to allow this Warehouse to receive data. Defaults to true. */
		enabled?: boolean;
		/** A key-value object that contains instance-specific settings for a Warehouse. Different kinds of Warehouses require different settings. The required and optional settings for a Warehouse are described in the `options` object of the associated Warehouse metadata. You can find the full list of… */
		settings: SegmentWarehouseSettingsV1Input;
		/** The custom schema name that Segment uses on the Warehouse side. The space slug value is default otherwise. */
		schemaName?: string;
	};
	'profilesSync.updateSelectiveSync': {
		spaceId: string;
		warehouseId: string;
		/** A list of sync Schema overrides to apply to this Space Warehouse. Note: Selective Sync is not supported if the enableEventTables flag is false. */
		syncOverrides?: Array<SegmentSpaceWarehouseSchemaOverrideInput>;
		/** A flag to enable or disable all event Tables. This field is optional. */
		enableEventTables?: boolean;
	};
	'regulations.create': {
		/** The regulation type to create. */
		regulationType:
			| 'DELETE_INTERNAL'
			| 'DELETE_ONLY'
			| 'SUPPRESS_ONLY'
			| 'SUPPRESS_WITH_DELETE'
			| 'SUPPRESS_WITH_DELETE_INTERNAL'
			| 'UNSUPPRESS';
		/** The subject type. Use `objectId` for Cloud Source regulations. */
		subjectType: 'OBJECT_ID' | 'USER_ID';
		/** The list of `userId` or `objectId` values of the subjects to regulate. Config API note: equal to `parent` but allows an array. */
		subjectIds: Array<string>;
	};
	'regulations.createForCloudSource': {
		sourceId: string;
		/** The regulation type to create. */
		regulationType:
			| 'DELETE_INTERNAL'
			| 'DELETE_ONLY'
			| 'SUPPRESS_ONLY'
			| 'SUPPRESS_WITH_DELETE'
			| 'SUPPRESS_WITH_DELETE_INTERNAL'
			| 'UNSUPPRESS';
		/** The subject type. Must be `objectId` for Cloud Sources. */
		subjectType: 'OBJECT_ID';
		/** The list of `userId` or `objectId` values of the subjects to regulate. Config API note: equal to `parent` but allows an array. */
		subjectIds: Array<string>;
		/** The Cloud Source collection to regulate. */
		collection: string;
	};
	'regulations.createForSource': {
		sourceId: string;
		/** The regulation type to create. Please note that `DELETE_ARCHIVE_ONLY` is only supported for limited Workspaces for Source-scoped regulations. */
		regulationType:
			| 'DELETE_ARCHIVE_ONLY'
			| 'DELETE_INTERNAL'
			| 'DELETE_ONLY'
			| 'SUPPRESS_ONLY'
			| 'SUPPRESS_WITH_DELETE'
			| 'SUPPRESS_WITH_DELETE_INTERNAL'
			| 'UNSUPPRESS';
		/** The subject type. Note: `ANONYMOUS_ID` is only supported for limited Workspaces for Source-scoped regulations. `ANONYMOUS_ID` is only supported when regulationType is `DELETE_ARCHIVE_ONLY`. */
		subjectType: 'ANONYMOUS_ID' | 'USER_ID';
		/** The list of `userId` or `objectId` or `anonymousId` values of the subjects to regulate. Config API note: equal to `parent` but allows an array. */
		subjectIds: Array<string>;
	};
	'regulations.get': {
		regulateId: string;
	};
	'regulations.list': {
		/** The status on which to filter the returned regulations. This parameter exists in v1. */
		status?:
			| 'FAILED'
			| 'FINISHED'
			| 'INITIALIZED'
			| 'INVALID'
			| 'NOT_SUPPORTED'
			| 'PARTIAL_SUCCESS'
			| 'RUNNING';
		/** The regulation types on which to filter returned regulations. This parameter exists in v1. */
		regulationTypes?: Array<
			| 'DELETE_INTERNAL'
			| 'DELETE_ONLY'
			| 'SUPPRESS_ONLY'
			| 'SUPPRESS_WITH_DELETE'
			| 'SUPPRESS_WITH_DELETE_INTERNAL'
			| 'UNSUPPRESS'
		>;
		/** Pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'regulations.listForSource': {
		sourceId: string;
		/** The status on which to filter returned regulations. This parameter exists in v1. */
		status?:
			| 'FAILED'
			| 'FINISHED'
			| 'INITIALIZED'
			| 'INVALID'
			| 'NOT_SUPPORTED'
			| 'PARTIAL_SUCCESS'
			| 'RUNNING';
		/** The regulation types on which to filter returned regulations. This parameter exists in v1. */
		regulationTypes?: Array<
			| 'DELETE_ARCHIVE_ONLY'
			| 'DELETE_INTERNAL'
			| 'DELETE_ONLY'
			| 'SUPPRESS_ONLY'
			| 'SUPPRESS_WITH_DELETE'
			| 'SUPPRESS_WITH_DELETE_INTERNAL'
			| 'UNSUPPRESS'
		>;
		/** Pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'regulations.listSuppressions': {
		/** Pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'reverseEtl.models.create': {
		/** Indicates which Source to attach this model to. */
		sourceId: string;
		/** A short, human-readable description of the Model. */
		name: string;
		/** A longer, more descriptive explanation of the Model. */
		description: string;
		/** Indicates whether the Model should have syncs enabled. When disabled, no syncs will be triggered, regardless of the enabled status of the attached destinations/subscriptions. */
		enabled: boolean;
		/** The SQL query that will be executed to extract data from the connected Source. */
		query: string;
		/** Indicates the column named in `query` that should be used to uniquely identify the extracted records. */
		queryIdentifierColumn: string;
	};
	'reverseEtl.models.delete': {
		modelId: string;
	};
	'reverseEtl.models.get': {
		modelId: string;
	};
	'reverseEtl.models.list': {
		/** Defines the pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'reverseEtl.models.update': {
		modelId: string;
		/** A short, human-readable description of the Model. */
		name?: string;
		/** A longer, more descriptive explanation of the Model. */
		description?: string;
		/** Indicates whether the Model should have syncs enabled. When disabled, no syncs will be triggered, regardless of the enabled status of the attached destinations/subscriptions. */
		enabled?: boolean;
		/** The SQL query that will be executed to extract data from the connected Source. */
		query?: string;
		/** Indicates the column named in `query` that should be used to uniquely identify the extracted records. */
		queryIdentifierColumn?: string;
	};
	'reverseEtl.syncs.cancel': {
		modelId: string;
		syncId: string;
		/** The reason for canceling the sync. - IncorrectModel = 0 - IncorrectDest = 1 - IncorrectKeys = 2 - IncorrectMapping = 3 - Other = 4 */
		reasonForCanceling?: number;
	};
	'reverseEtl.syncs.create': {
		/** The id of the Source. */
		sourceId: string;
		/** The id of the Model. */
		modelId: string;
		/** The id of the Subscription. */
		subscriptionId: string;
	};
	'reverseEtl.syncs.get': {
		modelId: string;
		syncId: string;
	};
	'reverseEtl.syncs.list': {
		modelId: string;
		subscriptionId: string;
		/** The number of items to retrieve in a page, between 1 and 100. Default is 10 This parameter exists in alpha. */
		count?: number;
		/** The page to request. Acceptable values to use are from the `current`, `next`, and `previous` keys. This parameter exists in alpha. */
		cursor?: string;
	};
	'roles.list': {
		/** Pagination for roles. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'sources.addLabels': {
		sourceId: string;
		/** The labels to associate with a Source. */
		labels: Array<SegmentLabelV1Input>;
	};
	'sources.create': {
		/** The slug by which to identify the Source in the Segment app. */
		slug: string;
		/** Enable to allow this Source to send data. Defaults to true. */
		enabled: boolean;
		/** The id of the Source metadata from which this instance of the Source derives. All Source metadata is available under `/catalog/sources`. */
		metadataId: string;
		/** A key-value object that contains instance-specific settings for the Source. "websiteUrl" and "apiHost" can be configured here for the relevant Sources. */
		settings?: SegmentSourceSettingsV1Input;
		/** Whether to disconnect all Warehouses from the Source. */
		disconnectAllWarehouses?: boolean;
	};
	'sources.createWriteKey': {
		sourceId: string;
	};
	'sources.delete': {
		sourceId: string;
	};
	'sources.get': {
		sourceId: string;
	};
	'sources.getSchemaSettings': {
		sourceId: string;
	};
	'sources.list': {
		/** Defines the pagination parameters. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'sources.listConnectedDestinations': {
		sourceId: string;
		/** Required pagination params for the request. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'sources.listConnectedWarehouses': {
		sourceId: string;
		/** Required pagination params for the request. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'sources.removeWriteKey': {
		sourceId: string;
		writeKey: string;
	};
	'sources.replaceLabels': {
		sourceId: string;
		/** The list of labels to replace in the Source. */
		labels: Array<SegmentLabelV1Input>;
	};
	'sources.update': {
		sourceId: string;
		/** An optional human-readable name to associate with the Source. Config API note: equal to `displayName`. */
		name?: string;
		/** Enable to allow the Source to send data. */
		enabled?: boolean;
		/** The slug that identifies the Source. Config API note: equal to `name`. */
		slug?: string;
		/** A key-value object that contains instance-specific settings for the Source. Different kinds of Sources require different kinds of input. The settings input for a Source comes from the `options` object associated with this instance of a Source. You can find the full list of required settings by… */
		settings?: SegmentSourceSettingsV1Input;
	};
	'sources.updateSchemaSettings': {
		sourceId: string;
		/** Track settings. */
		track?: SegmentTrackSourceSettingsV1Input;
		/** Identify settings. */
		identify?: SegmentIdentifySourceSettingsV1Input;
		/** Group settings. */
		group?: SegmentGroupSourceSettingsV1Input;
		/** Source id to forward violations to. */
		forwardingViolationsTo?: string;
		/** Source id to forward blocked events to. */
		forwardingBlockedEventsTo?: string;
	};
	'spaces.get': {
		spaceId: string;
	};
	'spaces.list': {
		/** Pagination params This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
	};
	'spaces.schema.listEntityPaths': {
		spaceId: string;
		/** Pagination params. Defaults to count 200. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** Filter paths by entity name or path name. This parameter exists in alpha. */
		search?: string;
	};
	'spaces.schema.listEntityProperties': {
		spaceId: string;
		entitySlug: string;
		/** Pagination params. Defaults to count 200. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** When true, include sample values for each property. Defaults to false. This parameter exists in alpha. */
		includeSampleValues?: boolean;
		/** Max number of sample values to return per property. Defaults to 20, min 1, max 100. This parameter exists in alpha. */
		samplesCount?: number;
	};
	'spaces.schema.listEntityPropertySampleValues': {
		spaceId: string;
		entitySlug: string;
		propertyName: string;
	};
	'spaces.schema.listEventProperties': {
		spaceId: string;
		eventName: string;
		/** Pagination params. Defaults to count 200. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** Field to sort by. Defaults to 'lastSeenAt'. This parameter exists in alpha. */
		sortBy?: 'lastSeenAt' | 'name';
		/** Sort direction. Defaults to 'desc'. This parameter exists in alpha. */
		sortDir?: 'asc' | 'desc';
		/** Filter properties by name substring. This parameter exists in alpha. */
		search?: string;
		/** When true, include sample values for each property. Defaults to false. This parameter exists in alpha. */
		includeSampleValues?: boolean;
		/** Max number of sample values to return per property. Defaults to 20, min 1, max 100. This parameter exists in alpha. */
		samplesCount?: number;
	};
	'spaces.schema.listEventPropertySampleValues': {
		spaceId: string;
		eventName: string;
		propertyName: string;
		/** The property type. This parameter exists in alpha. */
		propertyType: SegmentEventPropertyTypeInput;
	};
	'spaces.schema.listEvents': {
		spaceId: string;
		/** Pagination params. Defaults to count 200. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** Field to sort by. Defaults to 'lastSeenAt'. This parameter exists in alpha. */
		sortBy?: 'lastSeenAt' | 'name';
		/** Sort direction. Defaults to 'desc'. This parameter exists in alpha. */
		sortDir?: 'asc' | 'desc';
		/** Filter events by name substring. This parameter exists in alpha. */
		search?: string;
	};
	'spaces.schema.listTraitSampleValues': {
		spaceId: string;
		traitKey: string;
		/** Collection to get trait values for. Defaults to 'users'. This parameter exists in alpha. */
		collection?: 'accounts' | 'users';
	};
	'spaces.schema.listTraits': {
		spaceId: string;
		/** Pagination params. Defaults to count 200. This parameter exists in alpha. */
		pagination?: SegmentPaginationInputInput;
		/** Field to sort by. Defaults to 'trait'. This parameter exists in alpha. */
		sortBy?: 'lastSeenAt' | 'trait';
		/** Sort direction. Defaults to 'asc'. This parameter exists in alpha. */
		sortDir?: 'asc' | 'desc';
		/** Filter traits by key substring. This parameter exists in alpha. */
		search?: string;
		/** Collection to list traits for. Defaults to 'users'. This parameter exists in alpha. */
		collection?: 'accounts' | 'users';
		/** When true, include sample values for each trait. Defaults to false. This parameter exists in alpha. */
		includeSampleValues?: boolean;
		/** Max number of sample values to return per trait. Defaults to 20, min 1, max 100. This parameter exists in alpha. */
		samplesCount?: number;
	};
	'testing.echo': {
		/** Sets the response `message` field. The response contains this field's entry. This parameter exists in alpha. */
		message: string;
		/** The desired response delay, in milliseconds. This parameter exists in alpha. */
		delay?: number;
		/** If `true`, returns an HTTP `4xx` error that contains the string in `message`. This parameter exists in alpha. */
		triggerError?: boolean;
		/** If `true`, returns an HTTP `4xx` error that contains the value of the `message` field in the error message array. This has no effect if the request sets `triggerError`. This parameter exists in alpha. */
		triggerMultipleErrors?: boolean;
		/** If `true`, triggers a `500` error. This has no effect if the request sets either `triggerError` or `triggerMultipleErrors`. This parameter exists in alpha. */
		triggerUnexpectedError?: boolean;
		/** Sets the HTTP status code to return. This parameter exists in alpha. */
		statusCode?: number;
	};
	'tracking.alias': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** The id the user had before. */
		previousId: string;
	};
	'tracking.batch': {
		/** The calls, each with its `type`. */
		batch: Array<{
			/** The call this message is. */
			type: 'identify' | 'track' | 'page' | 'screen' | 'group' | 'alias';
			/** Your id for the user. Send userId, anonymousId or both. */
			userId?: string;
			/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
			anonymousId?: string;
			/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
			context?: Record<string, SegmentJsonValue>;
			/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
			integrations?: Record<string, SegmentJsonValue>;
			/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
			timestamp?: string;
			/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
			messageId?: string;
			/** The name of the action, such as "Order Completed". */
			event?: string;
			/** The name of the page, such as "Home". */
			name?: string;
			/** Properties of the event: revenue, currency, product ids and so on. */
			properties?: Record<string, SegmentJsonValue>;
			/** What you know about the user: email, name, plan, createdAt and any custom traits. */
			traits?: Record<string, SegmentJsonValue>;
			/** Your id for the group. */
			groupId?: string;
			/** The id the user had before. */
			previousId?: string;
		}>;
		/** Context merged into every message of the batch. */
		context?: Record<string, SegmentJsonValue>;
		/** Destination switches applied to every message of the batch. */
		integrations?: Record<string, SegmentJsonValue>;
	};
	'tracking.group': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId?: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** Your id for the group. */
		groupId: string;
		/** Traits of the group: name, industry, employees, plan. */
		traits?: Record<string, SegmentJsonValue>;
	};
	'tracking.identify': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId?: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** What you know about the user: email, name, plan, createdAt and any custom traits. */
		traits?: Record<string, SegmentJsonValue>;
	};
	'tracking.page': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId?: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** The name of the page, such as "Home". */
		name?: string;
		/** Properties of the page: url, path, referrer, title and custom properties. */
		properties?: Record<string, SegmentJsonValue>;
	};
	'tracking.screen': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId?: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** The name of the screen, such as "Checkout". */
		name?: string;
		/** Properties of the screen. */
		properties?: Record<string, SegmentJsonValue>;
	};
	'tracking.track': {
		/** Your id for the user. Send userId, anonymousId or both. */
		userId?: string;
		/** A pseudo-unique id for a user you have not identified yet (a session or device id). Send userId, anonymousId or both. */
		anonymousId?: string;
		/** Extra information about the call: ip, userAgent, locale, library, page, campaign, device and so on. Context fields Segment reads are listed in the Common fields spec. */
		context?: Record<string, SegmentJsonValue>;
		/** Turns destinations on or off for this call: `{ "All": false, "Mixpanel": true }`. */
		integrations?: Record<string, SegmentJsonValue>;
		/** When the event happened, ISO 8601. Left out, Segment uses the time it received the call. Use it when you send historical data. */
		timestamp?: string;
		/** A unique id for the message; Segment drops repeats of the same messageId. Left out, Segment makes one. */
		messageId?: string;
		/** The name of the action, such as "Order Completed". */
		event: string;
		/** Properties of the event: revenue, currency, product ids and so on. */
		properties?: Record<string, SegmentJsonValue>;
	};
	'trackingPlans.addSource': {
		trackingPlanId: string;
		/** The id of the Source associated with the Tracking Plan. Config API note: analogous to `sourceName`. */
		sourceId: string;
	};
	'trackingPlans.create': {
		/** The Tracking Plan's name. Config API note: equal to `displayName`. */
		name: string;
		/** The Tracking Plan's description. */
		description?: string;
		/** The Tracking Plan's type. */
		type: 'ENGAGE' | 'LIVE' | 'PROPERTY_LIBRARY' | 'RULE_LIBRARY' | 'TEMPLATE';
	};
	'trackingPlans.delete': {
		trackingPlanId: string;
	};
	'trackingPlans.get': {
		trackingPlanId: string;
	};
	'trackingPlans.list': {
		/** Requests Tracking Plans of a certain type. If omitted, lists all types. This parameter exists in v1. */
		type?: 'ENGAGE' | 'LIVE' | 'PROPERTY_LIBRARY' | 'RULE_LIBRARY' | 'TEMPLATE';
		/** Pagination options. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'trackingPlans.listRules': {
		trackingPlanId: string;
		/** Pagination options. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'trackingPlans.listSources': {
		trackingPlanId: string;
		/** Pagination options. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'trackingPlans.removeRules': {
		trackingPlanId: string;
		/** Rules to delete. This parameter exists in v1. */
		rules: Array<SegmentRemoveRuleV1Input>;
	};
	'trackingPlans.removeSource': {
		trackingPlanId: string;
		/** The id of the Source associated with the Tracking Plan. Config API note: analogous to `sourceName`. This parameter exists in v1. */
		sourceId: string;
	};
	'trackingPlans.replaceRules': {
		trackingPlanId: string;
		/** Rules to replace. */
		rules: Array<SegmentRuleInputV1Input>;
	};
	'trackingPlans.update': {
		trackingPlanId: string;
		/** The Tracking Plan's name. Config API note: equal to `displayName`. */
		name?: string;
		/** The Tracking Plan's description. */
		description?: string;
	};
	'trackingPlans.updateRules': {
		trackingPlanId: string;
		/** Rules to update or insert. */
		rules: Array<SegmentUpsertRuleV1Input>;
	};
	'transformations.create': {
		/** The name of the Transformation. */
		name: string;
		/** The Source to be associated with the Transformation. */
		sourceId: string;
		/** The optional Destination metadata id to be associated with the Transformation. */
		destinationMetadataId?: string;
		/** If the Transformation should be enabled. */
		enabled: boolean;
		/** If statement ([FQL](https://segment.com/docs/config-api/fql/)) to match events. For standard event matchers, use the following: Track -\> "event='\<eventName\>'" Identify -\> "type='identify'" Group -\> "type='group'" */
		if: string;
		/** Optional boolean value if the Transformation should drop the event entirely when the if statement matches, ignores all other transforms. */
		drop?: boolean;
		/** Optional new event name for renaming events. Works only for 'track' event type. */
		newEventName?: string;
		/** Optional array for renaming properties collected by your events. */
		propertyRenames?: Array<SegmentPropertyRenameV1Input>;
		/** Optional array for transforming properties and values collected by your events. Limited to 10 properties. */
		propertyValueTransformations?: Array<SegmentPropertyValueTransformationV1Input>;
		/** Optional array for defining new properties in [FQL](https://segment.com/docs/config-api/fql/). Currently limited to 1 property. */
		fqlDefinedProperties?: Array<SegmentFQLDefinedPropertyV1Input>;
		/** Optional array for allowing properties from your events. */
		allowProperties?: Array<string>;
		/** Optional object for hashing properties within an event. */
		hashPropertiesConfiguration?: SegmentHashPropertiesConfigurationInput;
	};
	'transformations.delete': {
		transformationId: string;
	};
	'transformations.get': {
		transformationId: string;
	};
	'transformations.list': {
		/** Pagination options. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'transformations.update': {
		transformationId: string;
		/** The name of the Transformation. */
		name?: string;
		/** The optional Source to be associated with the Transformation. */
		sourceId?: string;
		/** The optional Destination metadata to be associated with the Transformation. */
		destinationMetadataId?: string;
		/** If the Transformation should be enabled. */
		enabled?: boolean;
		/** If statement ([FQL](https://segment.com/docs/config-api/fql/)) to match events. For standard event matchers, use the following: Track -\> "event='\<eventName\>'" Identify -\> "type='identify'" Group -\> "type='group'" */
		if?: string;
		/** Optional boolean value if the Transformation should drop the event entirely when the if statement matches, ignores all other transforms. */
		drop?: boolean;
		/** Optional new event name for renaming events. Works only for 'track' event type. */
		newEventName?: string;
		/** Optional array for renaming properties collected by your events. */
		propertyRenames?: Array<SegmentPropertyRenameV1Input>;
		/** Optional array for transforming properties and values collected by your events. Limited to 10 properties. */
		propertyValueTransformations?: Array<SegmentPropertyValueTransformationV1Input>;
		/** Optional array for updating properties defined in [FQL](https://segment.com/docs/config-api/fql/). Currently limited to 1 property. */
		fqlDefinedProperties?: Array<SegmentFQLDefinedPropertyV1Input>;
		/** Optional array for allowing properties from your events. */
		allowProperties?: Array<string>;
		/** Optional object for hashing properties within an event. */
		hashPropertiesConfiguration?: SegmentHashPropertiesConfigurationInput;
	};
	'usage.getDailyApiCalls': {
		/** The start of the usage month in the ISO-8601 format. This parameter exists in v1. */
		period: string;
		/** Pagination input for Workspace API call counts. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'usage.getDailyApiCallsBySource': {
		/** The start of the usage month in the ISO-8601 format. This parameter exists in v1. */
		period: string;
		/** Pagination input for per Source API calls counts. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'usage.getDailyMtu': {
		/** The start of the usage month, in the ISO-8601 format. This parameter exists in v1. */
		period: string;
		/** Pagination input for Workspace MTU counts. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'usage.getDailyMtuBySource': {
		/** The start of the usage month, in the ISO-8601 format. This parameter exists in v1. */
		period: string;
		/** Pagination input for per Source MTU counts. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'userGroups.addPermissions': {
		userGroupId: string;
		/** The permissions to add. */
		permissions: Array<SegmentPermissionInputV1Input>;
	};
	'userGroups.addUsers': {
		userGroupId: string;
		/** The email addresses of the users and invites to add. */
		emails: Array<string>;
	};
	'userGroups.create': {
		/** The name of the user group to create. */
		name: string;
	};
	'userGroups.delete': {
		userGroupId: string;
	};
	'userGroups.get': {
		userGroupId: string;
	};
	'userGroups.list': {
		/** Pagination for user groups. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'userGroups.listInvites': {
		userGroupId: string;
		/** Pagination for invites to the group. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'userGroups.listUsers': {
		userGroupId: string;
		/** Pagination for members of a group. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'userGroups.removeUsers': {
		userGroupId: string;
		/** The list of emails to remove from the user group. This parameter exists in v1. */
		emails: Array<string>;
	};
	'userGroups.replacePermissions': {
		userGroupId: string;
		/** The permissions to replace with. */
		permissions: Array<SegmentPermissionInputV1Input>;
	};
	'userGroups.replaceUsers': {
		userGroupId: string;
		/** The email addresses of the users and invites to replace. */
		emails: Array<string>;
	};
	'userGroups.update': {
		userGroupId: string;
		/** The intended value to rename the user group to. */
		name: string;
	};
	'users.addPermissions': {
		userId: string;
		/** The permissions to add. */
		permissions: Array<SegmentPermissionInputV1Input>;
	};
	'users.delete': {
		/** The ids of the users to remove. This parameter exists in v1. */
		userIds: Array<string>;
	};
	'users.get': {
		userId: string;
	};
	'users.list': {
		/** Pagination for users. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'users.listGroups': {
		userId: string;
		/** Pagination for groups. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'users.replacePermissions': {
		userId: string;
		/** The permissions to add. */
		permissions: Array<SegmentPermissionInputV1Input>;
	};
	'warehouses.addSourceConnection': {
		warehouseId: string;
		sourceId: string;
	};
	'warehouses.create': {
		/** The id of the Credential to connect this Warehouse to. The Warehouse's type and connection settings are derived from this Credential. */
		credentialId: string;
		/** An optional human-readable name for this Warehouse. */
		name?: string;
		/** Enable to allow this Warehouse to receive data. Defaults to true. */
		enabled?: boolean;
	};
	'warehouses.delete': {
		warehouseId: string;
	};
	'warehouses.get': {
		warehouseId: string;
	};
	'warehouses.getAdvancedSyncSchedule': {
		warehouseId: string;
	};
	'warehouses.getConnectionState': {
		warehouseId: string;
	};
	'warehouses.list': {
		/** Defines the pagination parameters. This parameter exists in v2. */
		pagination?: SegmentPaginationInputInput;
	};
	'warehouses.listConnectedSources': {
		warehouseId: string;
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'warehouses.listSelectiveSyncs': {
		warehouseId: string;
		sourceId: string;
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'warehouses.listSourceSyncs': {
		warehouseId: string;
		sourceId: string;
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'warehouses.listSyncs': {
		warehouseId: string;
		/** Defines the pagination parameters. This parameter exists in v1. */
		pagination?: SegmentPaginationInputInput;
	};
	'warehouses.removeSourceConnection': {
		warehouseId: string;
		sourceId: string;
	};
	'warehouses.replaceAdvancedSyncSchedule': {
		warehouseId: string;
		/** Enable to turn on an advanced sync schedule for the Warehouse. */
		enabled: boolean;
		/** The full sync schedule for the Warehouse. */
		schedule?: SegmentAdvancedWarehouseSyncScheduleV1InputInput;
	};
	'warehouses.update': {
		warehouseId: string;
		/** An optional human-readable name to associate with this Warehouse. */
		name?: string;
		/** Enable to allow this Warehouse to receive data. */
		enabled?: boolean;
		/** The id of a Credential to connect this Warehouse to. Swapping the Credential re-derives this Warehouse's connection settings and re-validates the connection. The Credential must be the same type as the Warehouse's existing type — a Warehouse's type cannot be changed after creation, so a… */
		credentialId?: string;
	};
	'warehouses.updateSelectiveSync': {
		warehouseId: string;
		/** A list of sync schema overrides to apply to this Warehouse. */
		syncOverrides: Array<SegmentWarehouseSyncOverrideV1Input>;
	};
	'warehouses.validate': {
		/** The id of the Credential to validate the connection with. The Warehouse type is derived from this Credential. */
		credentialId: string;
		/** Optional settings overrides to check, layered on top of the Credential's own settings. */
		settings?: SegmentWarehouseSettingsV2Input;
	};
	'workspaces.get': Record<string, never>;
};

export type SegmentOperationOutputs = {
	'activations.batchQuery': {
		data?: SegmentBatchQueryActivationsForSpaceAlphaOutput | null;
	};
	'activations.create': {
		data?: SegmentAddActivationToAudienceAlphaOutput | null;
	};
	'activations.delete': {
		data?: SegmentRemoveActivationFromAudienceOutput | null;
	};
	'activations.get': {
		data?: SegmentGetActivationFromAudienceOutput | null;
	};
	'activations.list': {
		data?: SegmentListActivationsFromAudienceOutput | null;
	};
	'activations.update': {
		data?: SegmentUpdateActivationForAudienceOutput | null;
	};
	'audiences.create': {
		data?: SegmentCreateAudienceOutput | null;
	};
	'audiences.createPreview': {
		data?: SegmentCreateAudiencePreviewOutput | null;
	};
	'audiences.delete': {
		data?: SegmentRemoveAudienceFromSpaceOutput | null;
	};
	'audiences.destinations.add': {
		data?: SegmentAddDestinationToAudienceAlphaOutput | null;
	};
	'audiences.destinations.list': {
		data?: SegmentListDestinationsFromAudienceAlphaOutput | null;
	};
	'audiences.destinations.listSupported': {
		data?: SegmentListSupportedDestinationsFromAudienceAlphaOutput | null;
	};
	'audiences.destinations.remove': {
		data?: SegmentRemoveDestinationFromAudienceAlphaOutput | null;
	};
	'audiences.destinations.update': {
		data?: SegmentUpdateDestinationForAudienceAlphaOutput | null;
	};
	'audiences.get': {
		data?: SegmentGetAudienceOutput | null;
	};
	'audiences.getPreview': {
		data?: SegmentGetAudiencePreviewOutput | null;
	};
	'audiences.list': {
		data?: SegmentListAudiencesOutput | null;
	};
	'audiences.listConsumers': {
		data?: SegmentListAudienceConsumersFromSpaceAndAudienceOutput | null;
	};
	'audiences.run': {
		data?: SegmentForceExecuteAudienceRunOutput | null;
	};
	'audiences.schedules.create': {
		data?: SegmentAddAudienceScheduleToAudienceOutput | null;
	};
	'audiences.schedules.delete': {
		data?: SegmentRemoveAudienceScheduleFromAudienceOutput | null;
	};
	'audiences.schedules.get': {
		data?: SegmentGetAudienceScheduleFromSpaceAndAudienceOutput | null;
	};
	'audiences.schedules.list': {
		data?: SegmentListAudienceSchedulesFromSpaceAndAudienceOutput | null;
	};
	'audiences.schedules.update': {
		data?: SegmentUpdateAudienceScheduleForAudienceOutput | null;
	};
	'audiences.update': {
		data?: SegmentUpdateAudienceForSpaceOutput | null;
	};
	'auditTrail.list': {
		data?: SegmentListAuditEventsV1Output | null;
	};
	'catalog.getDestination': {
		data?: SegmentGetDestinationMetadataV1Output | null;
	};
	'catalog.getSource': {
		data?: SegmentGetSourceMetadataV1Output | null;
	};
	'catalog.getWarehouse': {
		data?: SegmentGetWarehouseMetadataV1Output | null;
	};
	'catalog.listDestinations': {
		data?: SegmentGetDestinationsCatalogV1Output | null;
	};
	'catalog.listSources': {
		data?: SegmentGetSourcesCatalogV1Output | null;
	};
	'catalog.listWarehouses': {
		data?: SegmentGetWarehousesCatalogV1Output | null;
	};
	'computedTraits.create': {
		data?: SegmentCreateComputedTraitAlphaOutput | null;
	};
	'computedTraits.delete': {
		data?: SegmentRemoveComputedTraitFromSpaceAlphaOutput | null;
	};
	'computedTraits.get': {
		data?: SegmentGetComputedTraitAlphaOutput | null;
	};
	'computedTraits.list': {
		data?: SegmentListComputedTraitsAlphaOutput | null;
	};
	'computedTraits.update': {
		data?: SegmentUpdateComputedTraitForSpaceAlphaOutput | null;
	};
	'credentials.create': {
		data?: SegmentCreateCredentialV1Output | null;
	};
	'credentials.delete': {
		data?: SegmentDeleteCredentialV1Output | null;
	};
	'credentials.get': {
		data?: SegmentGetCredentialV1Output | null;
	};
	'credentials.list': {
		data?: SegmentListCredentialsV1Output | null;
	};
	'credentials.listConsumers': {
		data?: SegmentListCredentialConsumersV1Output | null;
	};
	'credentials.update': {
		data?: SegmentUpdateCredentialV1Output | null;
	};
	'customerInsights.createDownload': {
		data?: SegmentCreateDownloadAlphaOutput | null;
	};
	'dbt.triggerModelSync': {
		data?: SegmentCreateDbtModelSyncTriggerOutput | null;
	};
	'deliveryOverview.getFailedDelivery': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'deliveryOverview.getFailedOnIngest': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'deliveryOverview.getFilteredAtDestination': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'deliveryOverview.getFilteredAtSource': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'deliveryOverview.getSuccessfulDelivery': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'deliveryOverview.getSuccessfullyReceived': {
		data?: SegmentGetDeliveryOverviewMetricsBetaOutput | null;
	};
	'destinations.create': {
		data?: SegmentCreateDestinationV1Output | null;
	};
	'destinations.delete': {
		data?: SegmentDeleteDestinationV1Output | null;
	};
	'destinations.filters.create': {
		data?: SegmentCreateFilterForDestinationV1Output | null;
	};
	'destinations.filters.delete': {
		data?: SegmentRemoveFilterFromDestinationV1Output | null;
	};
	'destinations.filters.get': {
		data?: SegmentGetFilterInDestinationV1Output | null;
	};
	'destinations.filters.list': {
		data?: SegmentListFiltersFromDestinationV1Output | null;
	};
	'destinations.filters.preview': {
		data?: SegmentPreviewDestinationFilterV1Output | null;
	};
	'destinations.filters.update': {
		data?: SegmentUpdateFilterForDestinationV1Output | null;
	};
	'destinations.get': {
		data?: SegmentGetDestinationV1Output | null;
	};
	'destinations.getDeliveryMetrics': {
		data?: SegmentListDeliveryMetricsSummaryFromDestinationBetaOutput | null;
	};
	'destinations.list': {
		data?: SegmentListDestinationsV1Output | null;
	};
	'destinations.subscriptions.create': {
		data?: SegmentCreateDestinationSubscriptionAlphaOutput | null;
	};
	'destinations.subscriptions.delete': {
		data?: SegmentRemoveSubscriptionFromDestinationAlphaOutput | null;
	};
	'destinations.subscriptions.get': {
		data?: SegmentGetSubscriptionFromDestinationAlphaOutput | null;
	};
	'destinations.subscriptions.list': {
		data?: SegmentListSubscriptionsFromDestinationAlphaOutput | null;
	};
	'destinations.subscriptions.update': {
		data?: SegmentUpdateSubscriptionForDestinationAlphaOutput | null;
	};
	'destinations.update': {
		data?: SegmentUpdateDestinationV1Output | null;
	};
	'events.getVolume': {
		data?: SegmentGetEventsVolumeFromWorkspaceV1Output | null;
	};
	'filters.create': {
		data?: SegmentCreateFilterForSpaceOutput | null;
	};
	'filters.delete': {
		data?: SegmentDeleteFilterByIdOutput | null;
	};
	'filters.get': {
		data?: SegmentGetFilterByIdOutput | null;
	};
	'filters.list': {
		data?: SegmentListFiltersForSpaceOutput | null;
	};
	'filters.update': {
		data?: SegmentUpdateFilterByIdOutput | null;
	};
	'functions.create': {
		data?: SegmentCreateFunctionV1Output | null;
	};
	'functions.delete': {
		data?: SegmentDeleteFunctionV1Output | null;
	};
	'functions.deploy': {
		data?: SegmentCreateFunctionDeploymentV1Output | null;
	};
	'functions.get': {
		data?: SegmentGetFunctionV1Output | null;
	};
	'functions.getVersion': {
		data?: SegmentGetFunctionVersionAlphaOutput | null;
	};
	'functions.insertInstances.create': {
		data?: SegmentCreateInsertFunctionInstanceAlphaOutput | null;
	};
	'functions.insertInstances.delete': {
		data?: SegmentDeleteInsertFunctionInstanceAlphaOutput | null;
	};
	'functions.insertInstances.get': {
		data?: SegmentGetInsertFunctionInstanceAlphaOutput | null;
	};
	'functions.insertInstances.list': {
		data?: SegmentListInsertFunctionInstancesAlphaOutput | null;
	};
	'functions.insertInstances.update': {
		data?: SegmentUpdateInsertFunctionInstanceAlphaOutput | null;
	};
	'functions.list': {
		data?: SegmentListFunctionsV1Output | null;
	};
	'functions.listVersions': {
		data?: SegmentListFunctionVersionsAlphaOutput | null;
	};
	'functions.restoreVersion': {
		data?: SegmentRestoreFunctionVersionAlphaOutput | null;
	};
	'functions.update': {
		data?: SegmentUpdateFunctionV1Output | null;
	};
	'invites.create': {
		data?: SegmentCreateInvitesV1Output | null;
	};
	'invites.delete': {
		data?: SegmentDeleteInvitesV1Output | null;
	};
	'invites.list': {
		data?: SegmentListInvitesV1Output | null;
	};
	'labels.create': {
		data?: SegmentCreateLabelV1Output | null;
	};
	'labels.delete': {
		data?: SegmentDeleteLabelV1Output | null;
	};
	'labels.list': {
		data?: SegmentListLabelsV1Output | null;
	};
	'livePlugins.create': {
		data?: SegmentCreateLivePluginAlphaOutput | null;
	};
	'livePlugins.deleteCode': {
		data?: SegmentDeleteLivePluginCodeAlphaOutput | null;
	};
	'livePlugins.getLatest': {
		data?: SegmentGetLatestFromLivePluginsAlphaOutput | null;
	};
	'profilesSync.create': {
		data?: SegmentCreateProfilesWarehouseAlphaOutput | null;
	};
	'profilesSync.delete': {
		data?: SegmentRemoveProfilesWarehouseFromSpaceAlphaOutput | null;
	};
	'profilesSync.list': {
		data?: SegmentListProfilesWarehouseInSpaceAlphaOutput | null;
	};
	'profilesSync.listSelectiveSyncs': {
		data?: SegmentListSelectiveSyncsFromWarehouseAndSpaceAlphaOutput | null;
	};
	'profilesSync.update': {
		data?: SegmentUpdateProfilesWarehouseForSpaceWarehouseAlphaOutput | null;
	};
	'profilesSync.updateSelectiveSync': {
		data?: SegmentUpdateSelectiveSyncForWarehouseAndSpaceAlphaOutput | null;
	};
	'regulations.create': {
		data?: SegmentCreateWorkspaceRegulationV1Output | null;
	};
	'regulations.createForCloudSource': {
		data?: SegmentCreateCloudSourceRegulationV1Output | null;
	};
	'regulations.createForSource': {
		data?: SegmentCreateSourceRegulationV1Output | null;
	};
	'regulations.get': {
		data?: SegmentGetRegulationV1Output | null;
	};
	'regulations.list': {
		data?: SegmentListWorkspaceRegulationsV1Output | null;
	};
	'regulations.listForSource': {
		data?: SegmentListRegulationsFromSourceV1Output | null;
	};
	'regulations.listSuppressions': {
		data?: SegmentListSuppressionsV1Output | null;
	};
	'reverseEtl.models.create': {
		data?: SegmentCreateReverseEtlModelOutput | null;
	};
	'reverseEtl.models.delete': {
		data?: SegmentDeleteReverseEtlModelOutput | null;
	};
	'reverseEtl.models.get': {
		data?: SegmentGetReverseEtlModelOutput | null;
	};
	'reverseEtl.models.list': {
		data?: SegmentListReverseEtlModelsOutput | null;
	};
	'reverseEtl.models.update': {
		data?: SegmentUpdateReverseEtlModelOutput | null;
	};
	'reverseEtl.syncs.cancel': {
		data?: SegmentCancelReverseETLSyncForModelOutput | null;
	};
	'reverseEtl.syncs.create': {
		data?: SegmentCreateReverseETLManualSyncOutput | null;
	};
	'reverseEtl.syncs.get': {
		data?: SegmentGetReverseETLSyncStatusOutput | null;
	};
	'reverseEtl.syncs.list': {
		data?: SegmentListReverseETLSyncStatusesFromModelAndSubscriptionIdOutput | null;
	};
	'roles.list': {
		data?: SegmentListRolesV1Output | null;
	};
	'sources.addLabels': {
		data?: SegmentAddLabelsToSourceV1Output | null;
	};
	'sources.create': {
		data?: SegmentCreateSourceV1Output | null;
	};
	'sources.createWriteKey': {
		data?: SegmentCreateWriteKeyForSourceAlphaOutput | null;
	};
	'sources.delete': {
		data?: SegmentDeleteSourceV1Output | null;
	};
	'sources.get': {
		data?: SegmentGetSourceV1Output | null;
	};
	'sources.getSchemaSettings': {
		data?: SegmentListSchemaSettingsInSourceV1Output | null;
	};
	'sources.list': {
		data?: SegmentListSourcesV1Output | null;
	};
	'sources.listConnectedDestinations': {
		data?: SegmentListConnectedDestinationsFromSourceV1Output | null;
	};
	'sources.listConnectedWarehouses': {
		data?: SegmentListConnectedWarehousesFromSourceV1Output | null;
	};
	'sources.removeWriteKey': {
		data?: SegmentRemoveWriteKeyFromSourceAlphaOutput | null;
	};
	'sources.replaceLabels': {
		data?: SegmentReplaceLabelsInSourceV1Output | null;
	};
	'sources.update': {
		data?: SegmentUpdateSourceV1Output | null;
	};
	'sources.updateSchemaSettings': {
		data?: SegmentUpdateSchemaSettingsInSourceV1Output | null;
	};
	'spaces.get': {
		data?: SegmentGetSpaceAlphaOutput | null;
	};
	'spaces.list': {
		data?: SegmentListSpacesAlphaOutput | null;
	};
	'spaces.schema.listEntityPaths': {
		data?: SegmentListEntityPathsAlphaOutput | null;
	};
	'spaces.schema.listEntityProperties': {
		data?: SegmentListPropertiesFromEntityAlphaOutput | null;
	};
	'spaces.schema.listEntityPropertySampleValues': {
		data?: SegmentListSampleValuesFromEntityPropertyAlphaOutput | null;
	};
	'spaces.schema.listEventProperties': {
		data?: SegmentListPropertiesFromEventAlphaOutput | null;
	};
	'spaces.schema.listEventPropertySampleValues': {
		data?: SegmentListSampleValuesFromEventPropertyAlphaOutput | null;
	};
	'spaces.schema.listEvents': {
		data?: SegmentListEventsAlphaOutput | null;
	};
	'spaces.schema.listTraitSampleValues': {
		data?: SegmentListSampleValuesFromTraitAlphaOutput | null;
	};
	'spaces.schema.listTraits': {
		data?: SegmentListTraitsAlphaOutput | null;
	};
	'testing.echo': {
		data?: SegmentEchoV1Output | null;
	};
	'tracking.alias': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.batch': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.group': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.identify': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.page': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.screen': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'tracking.track': {
		/** True when Segment accepted the call. */
		success?: boolean | null;
	};
	'trackingPlans.addSource': {
		data?: SegmentAddSourceToTrackingPlanV1Output | null;
	};
	'trackingPlans.create': {
		data?: SegmentCreateTrackingPlanV1Output | null;
	};
	'trackingPlans.delete': {
		data?: SegmentDeleteTrackingPlanV1Output | null;
	};
	'trackingPlans.get': {
		data?: SegmentGetTrackingPlanV1Output | null;
	};
	'trackingPlans.list': {
		data?: SegmentListTrackingPlansV1Output | null;
	};
	'trackingPlans.listRules': {
		data?: SegmentListRulesFromTrackingPlanV1Output | null;
	};
	'trackingPlans.listSources': {
		data?: SegmentListSourcesFromTrackingPlanV1Output | null;
	};
	'trackingPlans.removeRules': {
		data?: SegmentRemoveRulesFromTrackingPlanV1Output | null;
	};
	'trackingPlans.removeSource': {
		data?: SegmentRemoveSourceFromTrackingPlanV1Output | null;
	};
	'trackingPlans.replaceRules': {
		data?: SegmentReplaceRulesInTrackingPlanV1Output | null;
	};
	'trackingPlans.update': {
		data?: SegmentUpdateTrackingPlanV1Output | null;
	};
	'trackingPlans.updateRules': {
		data?: SegmentUpdateRulesInTrackingPlanV1Output | null;
	};
	'transformations.create': {
		data?: SegmentCreateTransformationV1Output | null;
	};
	'transformations.delete': {
		data?: SegmentDeleteTransformationV1Output | null;
	};
	'transformations.get': {
		data?: SegmentGetTransformationV1Output | null;
	};
	'transformations.list': {
		data?: SegmentListTransformationsV1Output | null;
	};
	'transformations.update': {
		data?: SegmentUpdateTransformationV1Output | null;
	};
	'usage.getDailyApiCalls': {
		data?: SegmentGetDailyWorkspaceAPICallsUsageV1Output | null;
	};
	'usage.getDailyApiCallsBySource': {
		data?: SegmentGetDailyPerSourceAPICallsUsageV1Output | null;
	};
	'usage.getDailyMtu': {
		data?: SegmentGetDailyWorkspaceMTUUsageV1Output | null;
	};
	'usage.getDailyMtuBySource': {
		data?: SegmentGetDailyPerSourceMTUUsageV1Output | null;
	};
	'userGroups.addPermissions': {
		data?: SegmentAddPermissionsToUserGroupV1Output | null;
	};
	'userGroups.addUsers': {
		data?: SegmentAddUsersToUserGroupV1Output | null;
	};
	'userGroups.create': {
		data?: SegmentCreateUserGroupV1Output | null;
	};
	'userGroups.delete': {
		data?: SegmentDeleteUserGroupV1Output | null;
	};
	'userGroups.get': {
		data?: SegmentGetUserGroupV1Output | null;
	};
	'userGroups.list': {
		data?: SegmentListUserGroupsV1Output | null;
	};
	'userGroups.listInvites': {
		data?: SegmentListInvitesFromUserGroupV1Output | null;
	};
	'userGroups.listUsers': {
		data?: SegmentListUsersFromUserGroupV1Output | null;
	};
	'userGroups.removeUsers': {
		data?: SegmentRemoveUsersFromUserGroupV1Output | null;
	};
	'userGroups.replacePermissions': {
		data?: SegmentReplacePermissionsForUserGroupV1Output | null;
	};
	'userGroups.replaceUsers': {
		data?: SegmentReplaceUsersInUserGroupV1Output | null;
	};
	'userGroups.update': {
		data?: SegmentUpdateUserGroupV1Output | null;
	};
	'users.addPermissions': {
		data?: SegmentAddPermissionsToUserV1Output | null;
	};
	'users.delete': {
		data?: SegmentDeleteUsersV1Output | null;
	};
	'users.get': {
		data?: SegmentGetUserV1Output | null;
	};
	'users.list': {
		data?: SegmentListUsersV1Output | null;
	};
	'users.listGroups': {
		data?: SegmentListUserGroupsFromUserV1Output | null;
	};
	'users.replacePermissions': {
		data?: SegmentReplacePermissionsForUserV1Output | null;
	};
	'warehouses.addSourceConnection': {
		data?: SegmentAddConnectionFromSourceToWarehouseV1Output | null;
	};
	'warehouses.create': {
		data?: SegmentCreateWarehouseV2Output | null;
	};
	'warehouses.delete': {
		data?: SegmentDeleteWarehouseV1Output | null;
	};
	'warehouses.get': {
		data?: SegmentGetWarehouseV2Output | null;
	};
	'warehouses.getAdvancedSyncSchedule': {
		data?: SegmentGetAdvancedSyncScheduleFromWarehouseV1Output | null;
	};
	'warehouses.getConnectionState': {
		data?: SegmentGetConnectionStateFromWarehouseV1Output | null;
	};
	'warehouses.list': {
		data?: SegmentListWarehousesV2Output | null;
	};
	'warehouses.listConnectedSources': {
		data?: SegmentListConnectedSourcesFromWarehouseV1Output | null;
	};
	'warehouses.listSelectiveSyncs': {
		data?: SegmentListSelectiveSyncsFromWarehouseAndSourceV1Output | null;
	};
	'warehouses.listSourceSyncs': {
		data?: SegmentListSyncsFromWarehouseAndSourceV1Output | null;
	};
	'warehouses.listSyncs': {
		data?: SegmentListSyncsFromWarehouseV1Output | null;
	};
	'warehouses.removeSourceConnection': {
		data?: SegmentRemoveSourceConnectionFromWarehouseV1Output | null;
	};
	'warehouses.replaceAdvancedSyncSchedule': {
		data?: SegmentReplaceAdvancedSyncScheduleForWarehouseV1Output | null;
	};
	'warehouses.update': {
		data?: SegmentUpdateWarehouseV2Output | null;
	};
	'warehouses.updateSelectiveSync': {
		data?: SegmentUpdateSelectiveSyncForWarehouseV1Output | null;
	};
	'warehouses.validate': {
		data?: SegmentCreateValidationInWarehouseV2Output | null;
	};
	'workspaces.get': {
		data?: SegmentGetWorkspaceV1Output | null;
	};
};
