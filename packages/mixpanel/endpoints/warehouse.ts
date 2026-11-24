import { z } from 'zod';
import { op } from './call';
import { IdSchema, LooseObject, okEnvelope, PropertiesSchema } from './common';

// Warehouse Connectors import tables from a data warehouse the project has
// already connected (Project Settings, Warehouse Sources). Listing works on a
// free project (live: empty); creating imports needs a connected source.

const ImportSchema = z
	.object({
		id: z.number().nullish(),
		import_type: z.string().nullish(),
		warehouse_source_id: z.number().nullish(),
		paused: z.boolean().nullish(),
		run_every: z.number().nullish(),
		sync_mode: z.string().nullish(),
	})
	.loose();

const ImportId = IdSchema.describe('The warehouse import id.');

const RunEvery = z
	.union([
		z.literal(0),
		z.literal(3600000000000),
		z.literal(86400000000000),
		z.literal(604800000000000),
	])
	.describe(
		'Sync interval in nanoseconds: 0 (manual), hourly, daily or weekly.',
	);

const SyncMode = z.enum(['time_based', 'mirror_mode', 'full_sync', 'one_time']);

const Common = {
	warehouse_source_id: IdSchema.describe('The connected warehouse source.'),
	table_params: PropertiesSchema.describe(
		'Where the table is, per warehouse (e.g. dataset_name and table_name for BigQuery).',
	),
	run_every: RunEvery.optional(),
	json_properties_column_name: z.string().optional(),
	property_mappings: z.record(z.string(), z.string()).optional(),
	databricks_params: LooseObject.optional(),
};

const base = (projectId: number) =>
	`/projects/${projectId}/warehouse-sources/imports`;

export const list = op({
	name: 'warehouseImports.list',
	input: z.object({}),
	output: okEnvelope(z.array(ImportSchema)),
	meta: {
		riskLevel: 'read',
		description: 'List the warehouse imports of the project',
	},
	toRequest: (_input, c) => ({
		service: 'app',
		method: 'GET',
		path: base(c.projectId),
	}),
});

export const get = op({
	name: 'warehouseImports.get',
	input: z.object({ import_id: ImportId }),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'read',
		description: 'Get one warehouse import with its settings',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/${input.import_id}`,
	}),
});

export const update = op({
	name: 'warehouseImports.update',
	input: z.object({
		import_id: ImportId,
		paused: z.boolean(),
		run_every: RunEvery,
		databricks_params: LooseObject.optional(),
	}),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'write',
		description: 'Pause, resume or reschedule a warehouse import',
	},
	toRequest: ({ import_id, ...body }, c) => ({
		service: 'app',
		method: 'PATCH',
		path: `${base(c.projectId)}/${import_id}`,
		body,
		mediaType: 'application/json',
	}),
});

export const remove = op({
	name: 'warehouseImports.delete',
	input: z.object({
		import_id: ImportId,
		delete_data: z
			.boolean()
			.optional()
			.describe(
				'True also deletes the data this import brought into Mixpanel.',
			),
	}),
	output: z.object({ status: z.string().nullish() }).loose(),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a warehouse import, and with delete_data the data it imported',
	},
	toRequest: ({ import_id, ...body }, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `${base(c.projectId)}/${import_id}`,
		body,
		mediaType: 'application/json',
	}),
});

export const createEventStream = op({
	name: 'warehouseImports.createEventStream',
	input: z
		.object({
			...Common,
			time_column_name: z.string().min(1),
			sync_mode: SyncMode,
			event_name: z
				.string()
				.optional()
				.describe('One event name for every row.'),
			event_column_name: z
				.string()
				.optional()
				.describe('Or a column holding the event name.'),
			user_column_name: z.string().optional(),
			company_column_name: z.string().optional(),
			device_column_name: z.string().optional(),
			insert_id_column_name: z.string().optional(),
			insert_time_column_name: z.string().optional(),
		})
		.loose(),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'write',
		description: 'Create an import that loads events from a warehouse table',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/event-stream`,
		body: { import_type: 'event_stream', ...input },
		mediaType: 'application/json',
	}),
});

export const createPeople = op({
	name: 'warehouseImports.createPeople',
	input: z
		.object({
			...Common,
			user_column_name: z.string().min(1),
			sync_mode: SyncMode,
			insert_time_column_name: z.string().optional(),
		})
		.loose(),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'write',
		description:
			'Create an import that loads user profiles from a warehouse table',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/people`,
		body: { import_type: 'people', ...input },
		mediaType: 'application/json',
	}),
});

export const createGroups = op({
	name: 'warehouseImports.createGroups',
	input: z
		.object({
			...Common,
			group_key: z.string().min(1),
			group_id_column: z.string().min(1),
			sync_mode: SyncMode,
			insert_time_column_name: z.string().optional(),
		})
		.loose(),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'write',
		description:
			'Create an import that loads group profiles from a warehouse table',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/groups`,
		body: { import_type: 'groups', ...input },
		mediaType: 'application/json',
	}),
});

export const createLookupTable = op({
	name: 'warehouseImports.createLookupTable',
	input: z
		.object({
			warehouse_source_id: Common.warehouse_source_id,
			table_params: Common.table_params,
			run_every: Common.run_every,
			databricks_params: Common.databricks_params,
			mixpanel_property: z
				.object({
					value: z.string().min(1),
					resourceType: z.string().min(1).describe('Events or People.'),
					customPropertyId: z.number().int().optional(),
				})
				.describe('The Mixpanel property the table joins on.'),
			property_key_column_name: z.string().min(1),
			sync_mode: z.enum(['full_sync', 'one_time']),
		})
		.loose(),
	output: okEnvelope(ImportSchema),
	meta: {
		riskLevel: 'write',
		description:
			'Create an import that loads a lookup table from a warehouse table',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/lookup-table`,
		body: { import_type: 'lookup_table', ...input },
		mediaType: 'application/json',
	}),
});

export const run = op({
	name: 'warehouseImports.run',
	input: z.object({ import_id: ImportId }),
	output: okEnvelope(z.object({ run_id: z.string().nullish() }).loose()),
	meta: {
		riskLevel: 'write',
		description: 'Start a sync of a warehouse import now',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'PUT',
		path: `${base(c.projectId)}/${input.import_id}/manual-sync`,
		body: {},
		mediaType: 'application/json',
	}),
});

export const history = op({
	name: 'warehouseImports.history',
	input: z.object({ import_id: ImportId }),
	output: okEnvelope(
		z.object({ runs: z.array(LooseObject).nullish() }).loose(),
	),
	meta: {
		riskLevel: 'read',
		description: 'List the past sync runs of a warehouse import',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/${input.import_id}/history`,
	}),
});
