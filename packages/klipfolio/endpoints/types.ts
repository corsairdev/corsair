import { z } from 'zod';

// unknown: Klipfolio returns open-ended records whose nested fields the
// provider does not fully document; the documented { data, meta }
// envelope is validated and items stay extensible.
const DadataRecordSchemaUnused = undefined;
const KlipfolioRecordSchema = z.object({}).passthrough();
// Klipfolio success envelope for every operation.
const KlipfolioEnvelopeOutputSchema = z.object({
	// unknown: the data payload is provider-defined per operation
	// (arrays for lists, objects for single resources).
	data: z.unknown().optional(),
	// unknown: meta carries status/success plus operation-specific keys
	// such as the created-resource location.
	meta: z.record(z.string(), z.unknown()).optional(),
});

const ListClientsInputSchema = z
	.object({
		external_id: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const RetrieveClientInputSchema = z
	.object({
		id: z.string().min(1),
		full: z.boolean().optional(),
	})
	.passthrough();

const CreateClientInputSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		// unknown: one of 'setup', 'trial', 'active' or 'disabled'
		status: z.string().optional(),
		// unknown: optional
		seats: z.number().optional(),
		// unknown: optional
		custom_theme: z.boolean().optional(),
		// unknown: optional
		external_id: z.string().optional(),
	})
	.passthrough();

const UpdateClientInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: partial update supported - e.g. only status
		name: z.string().optional(),
		description: z.string().optional(),
		status: z.string().optional(),
		seats: z.number().optional(),
		custom_theme: z.boolean().optional(),
		external_id: z.string().optional(),
	})
	.passthrough();

const DeleteClientInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const EnableDirectBillingClientInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const ExtendTrialClientInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: shown in example ('7'); the docs' Fields row says None
		days: z.string().optional(),
	})
	.passthrough();

const RetrieveClientFeaturesInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const UpdateClientFeaturesInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: each item: { name: string (one of downloadable_reports, embeds, public_dashboards, scheduled_emails, published_dashboards, theming, domain_cloaking, sso), enabled: boolean }. Required flags not explicitly documented.
		features: z.array(z.unknown()).optional(),
	})
	.passthrough();

const RetrieveClientPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const UpdateClientPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: key/value pairs, e.g. {"prop1":"value1","prop2":"value2"}
		properties: z.record(z.string(), z.unknown()),
	})
	.passthrough();

const DeleteClientPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
	})
	.passthrough();

const RetrieveClientResourcesInputSchema = z
	.object({
		id: z.string().min(1),
		full: z.boolean().optional(),
	})
	.passthrough();

const UpdateClientResourcesInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: array of { name, value }. Allowed names: api.requests.perDay, dashboard.combined.total, company.seats, published.private.links. Required flags not documented.
		resources: z.array(z.unknown()).optional(),
	})
	.passthrough();

const RetrieveClientSettingsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const CreateClientSettingsInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: only documented parameter; supported locales include en, fr, de, it, ja, ko, zh, zh-CN, zh-TW, fr-FR, de-DE, it-IT, ja-JP, ko-KR, en-GB, en-US, en-CA, fr-CA
		'dpn.env.date.language.tag': z.string().optional(),
	})
	.passthrough();

const RetrieveClientShareRightsInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const SetClientShareRightsInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: array of objects with group_id (string) and can_manage (boolean); creates a new right if client isn't already shared with the group, else updates
		groups: z.array(z.unknown()).optional(),
	})
	.passthrough();

const DeleteClientShareRightInputSchema = z
	.object({
		id: z.string().min(1),
		groupId: z.string().min(1),
	})
	.passthrough();

const ListDatasourcesInputSchema = z
	.object({
		client_id: z.string().optional(),
	})
	.passthrough();

const RetrieveDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const CreateDatasourceInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		// unknown: e.g. xml, json
		format: z.string().optional(),
		// unknown: values include 'box', 'db', 'facebook', 'google_adwords', 'google_analytics', 'salesforce', 'shopify', 'simple_rest', 'xero', and others
		connector: z.string().optional(),
		// unknown: seconds, e.g. 1800, 14400
		refresh_interval: z.number().optional(),
		// unknown: connector-specific, e.g. endpoint_url, method, parameters
		properties: z.record(z.string(), z.unknown()).optional(),
		// unknown: optional
		client_id: z.string().optional(),
	})
	.passthrough();

const UpdateDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		refresh_interval: z.number().optional(),
	})
	.passthrough();

const DeleteDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const EnableDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const DisableDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

const ImportDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
		// unknown: target client account; required per the example
		client_id: z.string(),
	})
	.passthrough();

const DeleteInstancesDatasourceInputSchema = z
	.object({
		id: z.string().min(1),
		last_access: z.string().optional(),
		keep_latest_instance: z.boolean().optional(),
	})
	.passthrough();

const RetrieveDatasourcePropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const UpdateDatasourcePropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
		// unknown: keys/values are the datasource properties to set; existing properties updated, new ones created
		properties: z.record(z.string(), z.unknown()),
	})
	.passthrough();

const DeleteDatasourcePropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		client_id: z.string().optional(),
	})
	.passthrough();

const RetrieveDatasourceShareRightsInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const SetDatasourceShareRightsInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
		// unknown: items: { user_id: string, can_edit: boolean }; appears optional
		users: z.array(z.unknown()).optional(),
		// unknown: items: { group_id: string, can_edit: boolean }; mandatory - 400 'groups' missing in post data or poorly formatted post data
		groups: z.array(z.unknown()),
	})
	.passthrough();

const DeleteDatasourceShareRightInputSchema = z
	.object({
		id: z.string().min(1),
		groupId: z.string().min(1),
		client_id: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

const ListDatasourceInstancesInputSchema = z
	.object({
		datasource_id: z.string().optional(),
		client_id: z.string().optional(),
	})
	.passthrough();

const RetrieveDatasourceInstancesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const CreateDatasourceInstancesInputSchema = z
	.object({
		client_id: z.string().optional(),
		// unknown: required in examples
		datasource_id: z.string(),
		// unknown: optional
		properties: z.record(z.string(), z.unknown()).optional(),
		// unknown: creates a data source with no instance, then creates an instance that doesn't refresh and then push data to it
		no_refresh: z.boolean().optional(),
	})
	.passthrough();

const DeleteDatasourceInstancesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const RetrieveDatasourceInstancesDataInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const UpdateDatasourceInstancesDataInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
		// unknown: raw data or a file, passed via -d "<filename>"; no structured body fields documented
		'(raw data or file)': z.string(),
	})
	.passthrough();

const RefreshDatasourceInstancesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const RefreshDatasourceInputSchema = z
	.object({
		client_id: z.string().optional(),
		// unknown: list of data source IDs (required in practice; example shows 3 IDs)
		datasources: z.array(z.string()),
	})
	.passthrough();

const RetrieveDatasourceInstancesPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
	})
	.passthrough();

const UpdateDatasourceInstancesPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		client_id: z.string().optional(),
		// unknown: string-to-string key/value pairs to set; creates a property if it doesn't exist, or updates the existing one
		properties: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const DeleteDatasourceInstancesPropertiesInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		client_id: z.string().optional(),
	})
	.passthrough();

export const KlipfolioEndpointInputSchemas = {
	listClients: ListClientsInputSchema,
	retrieveClient: RetrieveClientInputSchema,
	createClient: CreateClientInputSchema,
	updateClient: UpdateClientInputSchema,
	deleteClient: DeleteClientInputSchema,
	enableDirectBillingClient: EnableDirectBillingClientInputSchema,
	extendTrialClient: ExtendTrialClientInputSchema,
	retrieveClientFeatures: RetrieveClientFeaturesInputSchema,
	updateClientFeatures: UpdateClientFeaturesInputSchema,
	retrieveClientProperties: RetrieveClientPropertiesInputSchema,
	updateClientProperties: UpdateClientPropertiesInputSchema,
	deleteClientProperties: DeleteClientPropertiesInputSchema,
	retrieveClientResources: RetrieveClientResourcesInputSchema,
	updateClientResources: UpdateClientResourcesInputSchema,
	retrieveClientSettings: RetrieveClientSettingsInputSchema,
	createClientSettings: CreateClientSettingsInputSchema,
	retrieveClientShareRights: RetrieveClientShareRightsInputSchema,
	setClientShareRights: SetClientShareRightsInputSchema,
	deleteClientShareRight: DeleteClientShareRightInputSchema,
	listDatasources: ListDatasourcesInputSchema,
	retrieveDatasource: RetrieveDatasourceInputSchema,
	createDatasource: CreateDatasourceInputSchema,
	updateDatasource: UpdateDatasourceInputSchema,
	deleteDatasource: DeleteDatasourceInputSchema,
	enableDatasource: EnableDatasourceInputSchema,
	disableDatasource: DisableDatasourceInputSchema,
	importDatasource: ImportDatasourceInputSchema,
	deleteInstancesDatasource: DeleteInstancesDatasourceInputSchema,
	retrieveDatasourceProperties: RetrieveDatasourcePropertiesInputSchema,
	updateDatasourceProperties: UpdateDatasourcePropertiesInputSchema,
	deleteDatasourceProperties: DeleteDatasourcePropertiesInputSchema,
	retrieveDatasourceShareRights: RetrieveDatasourceShareRightsInputSchema,
	setDatasourceShareRights: SetDatasourceShareRightsInputSchema,
	deleteDatasourceShareRight: DeleteDatasourceShareRightInputSchema,
	listDatasourceInstances: ListDatasourceInstancesInputSchema,
	retrieveDatasourceInstances: RetrieveDatasourceInstancesInputSchema,
	createDatasourceInstances: CreateDatasourceInstancesInputSchema,
	deleteDatasourceInstances: DeleteDatasourceInstancesInputSchema,
	retrieveDatasourceInstancesData: RetrieveDatasourceInstancesDataInputSchema,
	updateDatasourceInstancesData: UpdateDatasourceInstancesDataInputSchema,
	refreshDatasourceInstances: RefreshDatasourceInstancesInputSchema,
	refreshDatasource: RefreshDatasourceInputSchema,
	retrieveDatasourceInstancesProperties:
		RetrieveDatasourceInstancesPropertiesInputSchema,
	updateDatasourceInstancesProperties:
		UpdateDatasourceInstancesPropertiesInputSchema,
	deleteDatasourceInstancesProperties:
		DeleteDatasourceInstancesPropertiesInputSchema,
} as const;

export const KlipfolioEndpointOutputSchemas = {
	listClients: KlipfolioEnvelopeOutputSchema,
	retrieveClient: KlipfolioEnvelopeOutputSchema,
	createClient: KlipfolioEnvelopeOutputSchema,
	updateClient: KlipfolioEnvelopeOutputSchema,
	deleteClient: KlipfolioEnvelopeOutputSchema,
	enableDirectBillingClient: KlipfolioEnvelopeOutputSchema,
	extendTrialClient: KlipfolioEnvelopeOutputSchema,
	retrieveClientFeatures: KlipfolioEnvelopeOutputSchema,
	updateClientFeatures: KlipfolioEnvelopeOutputSchema,
	retrieveClientProperties: KlipfolioEnvelopeOutputSchema,
	updateClientProperties: KlipfolioEnvelopeOutputSchema,
	deleteClientProperties: KlipfolioEnvelopeOutputSchema,
	retrieveClientResources: KlipfolioEnvelopeOutputSchema,
	updateClientResources: KlipfolioEnvelopeOutputSchema,
	retrieveClientSettings: KlipfolioEnvelopeOutputSchema,
	createClientSettings: KlipfolioEnvelopeOutputSchema,
	retrieveClientShareRights: KlipfolioEnvelopeOutputSchema,
	setClientShareRights: KlipfolioEnvelopeOutputSchema,
	deleteClientShareRight: KlipfolioEnvelopeOutputSchema,
	listDatasources: KlipfolioEnvelopeOutputSchema,
	retrieveDatasource: KlipfolioEnvelopeOutputSchema,
	createDatasource: KlipfolioEnvelopeOutputSchema,
	updateDatasource: KlipfolioEnvelopeOutputSchema,
	deleteDatasource: KlipfolioEnvelopeOutputSchema,
	enableDatasource: KlipfolioEnvelopeOutputSchema,
	disableDatasource: KlipfolioEnvelopeOutputSchema,
	importDatasource: KlipfolioEnvelopeOutputSchema,
	deleteInstancesDatasource: KlipfolioEnvelopeOutputSchema,
	retrieveDatasourceProperties: KlipfolioEnvelopeOutputSchema,
	updateDatasourceProperties: KlipfolioEnvelopeOutputSchema,
	deleteDatasourceProperties: KlipfolioEnvelopeOutputSchema,
	retrieveDatasourceShareRights: KlipfolioEnvelopeOutputSchema,
	setDatasourceShareRights: KlipfolioEnvelopeOutputSchema,
	deleteDatasourceShareRight: KlipfolioEnvelopeOutputSchema,
	listDatasourceInstances: KlipfolioEnvelopeOutputSchema,
	retrieveDatasourceInstances: KlipfolioEnvelopeOutputSchema,
	createDatasourceInstances: KlipfolioEnvelopeOutputSchema,
	deleteDatasourceInstances: KlipfolioEnvelopeOutputSchema,
	retrieveDatasourceInstancesData: KlipfolioEnvelopeOutputSchema,
	updateDatasourceInstancesData: KlipfolioEnvelopeOutputSchema,
	refreshDatasourceInstances: KlipfolioEnvelopeOutputSchema,
	refreshDatasource: KlipfolioEnvelopeOutputSchema,
	retrieveDatasourceInstancesProperties: KlipfolioEnvelopeOutputSchema,
	updateDatasourceInstancesProperties: KlipfolioEnvelopeOutputSchema,
	deleteDatasourceInstancesProperties: KlipfolioEnvelopeOutputSchema,
} as const;

export type KlipfolioEndpointInputs = {
	[K in keyof typeof KlipfolioEndpointInputSchemas]: z.infer<
		(typeof KlipfolioEndpointInputSchemas)[K]
	>;
};

export type KlipfolioEndpointOutputs = {
	[K in keyof typeof KlipfolioEndpointOutputSchemas]: z.infer<
		(typeof KlipfolioEndpointOutputSchemas)[K]
	>;
};
