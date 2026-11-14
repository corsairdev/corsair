import {
	FiberyEndpointInputSchemas as Inputs,
	FiberyEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { fiberyEndpointSchemas } from './index';
import { FiberySchema } from './schema';

const id = '019dcf9a-c5ab-7292-9bdb-8956eea1b532';
const inputFixtures = [
	[Inputs.schemaQuery, {}],
	[Inputs.databaseCreate, { database: { 'fibery/name': 'CRM/Lead' } }],
	[Inputs.databaseRename, { fromName: 'CRM/Lead', toName: 'CRM/Prospect' }],
	[Inputs.databaseDelete, { name: 'CRM/Lead' }],
	[
		Inputs.fieldCreate,
		{ holderType: 'CRM/Lead', name: 'CRM/Summary', type: 'fibery/text' },
	],
	[Inputs.enumCreate, { name: 'CRM/Status_CRM/Lead' }],
	[
		Inputs.fieldRename,
		{
			holderType: 'CRM/Lead',
			fromName: 'CRM/Summary',
			toName: 'CRM/Description',
		},
	],
	[Inputs.fieldDelete, { holderType: 'CRM/Lead', name: 'CRM/Description' }],
	[
		Inputs.fieldSetMeta,
		{
			holderType: 'CRM/Lead',
			name: 'CRM/Description',
			key: 'fibery/required?',
			value: false,
		},
	],
	[Inputs.installMixins, { types: { 'CRM/Lead': ['fibery/rank-mixin'] } }],
	[
		Inputs.entityQuery,
		{
			query: {
				'q/from': 'CRM/Lead',
				'q/select': ['fibery/id'],
				'q/limit': 100,
			},
		},
	],
	[Inputs.entityCreate, { type: 'CRM/Lead', entity: { 'CRM/Name': 'Sample' } }],
	[
		Inputs.entityUpdate,
		{ type: 'CRM/Lead', entity: { 'fibery/id': id, 'CRM/Name': 'Updated' } },
	],
	[Inputs.entityDelete, { type: 'CRM/Lead', id }],
	[
		Inputs.entityUpsert,
		{
			type: 'CRM/Lead',
			entities: [{ 'fibery/id': id }],
			conflictField: 'CRM/Name',
			conflictAction: 'skip-create',
		},
	],
	[
		Inputs.collectionAdd,
		{ type: 'CRM/Lead', field: 'CRM/Contacts', entityId: id, itemIds: [id] },
	],
	[
		Inputs.collectionRemove,
		{ type: 'CRM/Lead', field: 'CRM/Contacts', entityId: id, itemIds: [id] },
	],
	[
		Inputs.collectionSet,
		{ type: 'CRM/Lead', field: 'CRM/Contacts', entityId: id, itemIds: [] },
	],
	[
		Inputs.collectionReset,
		{ type: 'CRM/Lead', field: 'CRM/Contacts', entityId: id },
	],
	[Inputs.documentGet, { secret: id }],
	[Inputs.documentGetBatch, { secrets: [id] }],
	[Inputs.documentUpdate, { secret: id, content: 'Text' }],
	[
		Inputs.documentUpdateBatch,
		{ documents: [{ secret: id, content: 'Text' }] },
	],
	[
		Inputs.fileUpload,
		{ name: 'note.txt', contentType: 'text/plain', base64: 'SGVsbG8=' },
	],
	[Inputs.fileDownload, { secret: id }],
	[Inputs.fileSignUrls, { secrets: [id] }],
	[Inputs.viewsQuery, {}],
	[Inputs.viewsCreate, { views: [{ 'fibery/id': id }] }],
	[
		Inputs.viewsUpdate,
		{ updates: [{ id, values: { 'fibery/name': 'New name' } }] },
	],
	[Inputs.viewsDelete, { ids: [id] }],
	[Inputs.historySearch, { limit: 50, where: [] }],
] as const;

const outputFixtures = [
	[Outputs.schemaQuery, {}],
	[Outputs.databaseCreate, null],
	[Outputs.databaseRename, 'ok'],
	[Outputs.databaseDelete, null],
	[Outputs.fieldCreate, null],
	[Outputs.enumCreate, null],
	[Outputs.fieldRename, null],
	[Outputs.fieldDelete, null],
	[Outputs.fieldSetMeta, null],
	[Outputs.installMixins, null],
	[Outputs.entityQuery, []],
	[Outputs.entityCreate, {}],
	[Outputs.entityUpdate, {}],
	[Outputs.entityDelete, null],
	[Outputs.entityUpsert, []],
	[Outputs.collectionAdd, 'ok'],
	[Outputs.collectionRemove, 'ok'],
	[Outputs.collectionSet, 'ok'],
	[Outputs.collectionReset, 'ok'],
	[Outputs.documentGet, { secret: id, content: 'Text' }],
	[Outputs.documentGetBatch, [{ secret: id, content: 'Text' }]],
	[Outputs.documentUpdate, null],
	[Outputs.documentUpdateBatch, null],
	[
		Outputs.fileUpload,
		{
			'fibery/id': id,
			'fibery/name': 'note.txt',
			'fibery/content-type': 'text/plain',
			'fibery/secret': id,
			'fibery/content-length': 5,
			'fibery/rank': 0,
		},
	],
	[
		Outputs.fileDownload,
		{ kind: 'binary', contentType: 'text/plain', base64: 'SGVsbG8=' },
	],
	[
		Outputs.fileSignUrls,
		{
			items: [
				{
					secret: id,
					url: 'https://files.fibery.io/signed',
					expiresAt: '2026-01-01T00:00:00Z',
				},
			],
		},
	],
	[Outputs.viewsQuery, []],
	[Outputs.viewsCreate, []],
	[Outputs.viewsUpdate, []],
	[Outputs.viewsDelete, null],
	[Outputs.historySearch, { items: [], nextPage: { hasNext: false } }],
] as const;

describe('Fibery schema and endpoint schemas', () => {
	it('declares a semver version and empty persistence schema', () => {
		expect(FiberySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(FiberySchema.entities).toEqual({});
	});

	it('keeps endpoint registration and schema maps complete and aligned', () => {
		expect(Object.keys(fiberyEndpointSchemas)).toHaveLength(31);
		expect(Object.keys(Inputs)).toHaveLength(31);
		expect(Object.keys(Outputs)).toHaveLength(31);
	});

	it.each(inputFixtures)(
		'accepts documented input fixtures',
		(schema, input) => {
			expect(schema.safeParse(input).success).toBe(true);
		},
	);

	it.each(outputFixtures)(
		'accepts documented response fixtures',
		(schema, output) => {
			expect(schema.safeParse(output).success).toBe(true);
		},
	);

	it('accepts a top-level count query without q/limit, but not an entity list', () => {
		expect(
			Inputs.entityQuery.safeParse({
				query: { 'q/from': 'CRM/Lead', 'q/select': ['q/count', ['fibery/id']] },
			}).success,
		).toBe(true);
		expect(
			Inputs.entityQuery.safeParse({
				query: { 'q/from': 'CRM/Lead', 'q/select': ['fibery/id'] },
			}).success,
		).toBe(false);
	});

	it('accepts the documented field not-in history filter', () => {
		expect(
			Inputs.historySearch.safeParse({
				limit: 50,
				where: [
					{
						field: 'field',
						operator: 'not-in',
						value: [
							{ field: ':hidden', options: { includeSoftDeleted: true } },
							{ field: 'fibery/rank' },
						],
					},
				],
			}).success,
		).toBe(true);
	});

	it('parses the live document, file upload and upsert shapes', () => {
		// Trimmed from the live API (11-13): documents carry modificationDate, json content is an object.
		const md = {
			secret: id,
			content: 'corsair-plugin-test body',
			modificationDate: '2026-11-13T18:58:59.842Z',
		};
		expect(Outputs.documentGet.safeParse(md).success).toBe(true);
		expect(Outputs.documentGetBatch.safeParse([md]).success).toBe(true);
		expect(
			Outputs.documentGet.safeParse({
				...md,
				content: { doc: { type: 'doc', content: [{ type: 'paragraph' }] } },
			}).success,
		).toBe(true);
		expect(
			Outputs.fileUpload.safeParse({
				'fibery/id': id,
				'fibery/name': 'corsair-plugin-test.txt',
				'fibery/content-type': 'text/plain',
				'fibery/secret': id,
				'fibery/content-length': 24,
				'fibery/rank': 0,
				'fibery/temp?': true,
				'fibery/checksum': 'abc123',
			}).success,
		).toBe(true);
		expect(
			Inputs.entityUpsert.safeParse({
				type: 'CRM/Lead',
				entities: [{ 'CRM/Name': 'No id' }],
				conflictField: 'CRM/Name',
				conflictAction: 'update-latest',
			}).success,
		).toBe(false);
	});

	it('rejects undocumented request properties and invalid response shapes', () => {
		expect(
			Inputs.entityQuery.safeParse({
				query: {
					'q/from': 'CRM/Lead',
					'q/select': ['fibery/id'],
					'q/limit': 10,
				},
				callbackUrl: 'https://invalid.test/hook',
			}).success,
		).toBe(false);
		expect(
			Inputs.historySearch.safeParse({ limit: 50, where: [], callback: true })
				.success,
		).toBe(false);
		expect(
			Inputs.historySearch.safeParse({
				limit: 50,
				where: [{ field: 'unknown', operator: '=', value: 'x' }],
			}).success,
		).toBe(false);
		expect(
			Inputs.historySearch.safeParse({
				limit: 50,
				timeframe: {
					start: '2024-01-01T00:00:00.000Z',
					end: '2025-01-02T00:00:00.000Z',
				},
			}).success,
		).toBe(false);
		expect(
			Outputs.documentGet.safeParse({ secret: id, content: 42 }).success,
		).toBe(false);
		expect(
			Outputs.fileDownload.safeParse({
				kind: 'binary',
				contentType: 'text/plain',
			}).success,
		).toBe(false);
	});
});

describe('Fibery entity write results', () => {
	it.each([false, 'ok', [], null])(
		'rejects %p as an entity create or update result',
		(value) => {
			expect(Outputs.entityCreate.safeParse(value).success).toBe(false);
			expect(Outputs.entityUpdate.safeParse(value).success).toBe(false);
		},
	);
});
