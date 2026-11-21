import type { z } from 'zod';
import type { JsonValue } from './client';
import {
	CollectionDeleteResponseSchema,
	CollectionGraphSchema,
	CollectionItemsResponseSchema,
	CollectionSchema,
	CollectionTreeNodeSchema,
	DashboardQuestionCandidatesSchema,
	MetabaseEndpointInputSchemas,
	MetabaseEndpointOutputSchemas,
	MoveCandidatesResponseSchema,
} from './endpoints/types';
import { MetabaseSchema } from './schema';
import { metabaseEntities } from './schema/database';

const validInputs: Array<[string, z.ZodType, JsonValue]> = [
	[
		'collectionList',
		MetabaseEndpointInputSchemas.collectionList,
		{ query: { archived: true } },
	],
	[
		'collectionCreate',
		MetabaseEndpointInputSchemas.collectionCreate,
		{ body: { name: 'Finance' } },
	],
	[
		'collectionGet',
		MetabaseEndpointInputSchemas.collectionGet,
		{ path: { id: 8 } },
	],
	[
		'collectionUpdate',
		MetabaseEndpointInputSchemas.collectionUpdate,
		{ path: { id: 8 }, body: { archived: false } },
	],
	[
		'collectionDelete',
		MetabaseEndpointInputSchemas.collectionDelete,
		{ path: { id: 8 } },
	],
	[
		'collectionGraphGet',
		MetabaseEndpointInputSchemas.collectionGraphGet,
		{ query: { namespace: 'analytics' } },
	],
	[
		'collectionGraphUpdate',
		MetabaseEndpointInputSchemas.collectionGraphUpdate,
		{ body: { groups: { '2': { '8': 'read' } }, revision: 1 } },
	],
	['collectionRootGet', MetabaseEndpointInputSchemas.collectionRootGet, {}],
	[
		'collectionRootItems',
		MetabaseEndpointInputSchemas.collectionRootItems,
		{ query: { models: ['dashboard'] } },
	],
	[
		'collectionRootItemsMetadata',
		MetabaseEndpointInputSchemas.collectionRootItemsMetadata,
		{ query: { archived: false } },
	],
	[
		'collectionRootCandidates',
		MetabaseEndpointInputSchemas.collectionRootCandidates,
		{},
	],
	[
		'collectionRootMoveCandidates',
		MetabaseEndpointInputSchemas.collectionRootMoveCandidates,
		{ body: { card_ids: [15] } },
	],
	['collectionTrashGet', MetabaseEndpointInputSchemas.collectionTrashGet, {}],
	[
		'collectionTree',
		MetabaseEndpointInputSchemas.collectionTree,
		{ query: { shallow: true } },
	],
	[
		'collectionCandidates',
		MetabaseEndpointInputSchemas.collectionCandidates,
		{ path: { id: 8 } },
	],
	[
		'collectionMoveCandidates',
		MetabaseEndpointInputSchemas.collectionMoveCandidates,
		{ path: { id: 8 }, body: { card_ids: [15] } },
	],
	[
		'collectionItems',
		MetabaseEndpointInputSchemas.collectionItems,
		{ path: { id: 8 }, query: { 'pinned-state': 'is_pinned' } },
	],
	[
		'collectionItemsMetadata',
		MetabaseEndpointInputSchemas.collectionItemsMetadata,
		{ path: { id: 8 }, query: { models: ['collection'] } },
	],
];

const validOutputs: Array<[string, z.ZodType, JsonValue]> = [
	[
		'collectionList',
		MetabaseEndpointOutputSchemas.collectionList,
		[{ id: 8, name: 'Finance' }],
	],
	[
		'collectionCreate',
		MetabaseEndpointOutputSchemas.collectionCreate,
		{ id: 8, name: 'Finance' },
	],
	[
		'collectionGet',
		MetabaseEndpointOutputSchemas.collectionGet,
		{ id: 8, name: 'Finance' },
	],
	[
		'collectionUpdate',
		MetabaseEndpointOutputSchemas.collectionUpdate,
		{ id: 8, name: 'Finance' },
	],
	['collectionDelete', MetabaseEndpointOutputSchemas.collectionDelete, 1],
	[
		'collectionGraphGet',
		MetabaseEndpointOutputSchemas.collectionGraphGet,
		{ groups: { '2': { '8': 'read' } }, revision: 1 },
	],
	[
		'collectionGraphUpdate',
		MetabaseEndpointOutputSchemas.collectionGraphUpdate,
		{ revision: 2 },
	],
	[
		'collectionRootGet',
		MetabaseEndpointOutputSchemas.collectionRootGet,
		{ id: 'root', name: 'Root' },
	],
	[
		'collectionRootItems',
		MetabaseEndpointOutputSchemas.collectionRootItems,
		{ total: 0, data: [], models: [] },
	],
	[
		'collectionRootItemsMetadata',
		MetabaseEndpointOutputSchemas.collectionRootItemsMetadata,
		{ available_models: [], total_items: 0 },
	],
	[
		'collectionRootCandidates',
		MetabaseEndpointOutputSchemas.collectionRootCandidates,
		{ data: [], total: 0 },
	],
	[
		'collectionRootMoveCandidates',
		MetabaseEndpointOutputSchemas.collectionRootMoveCandidates,
		{ moved: [] },
	],
	[
		'collectionTrashGet',
		MetabaseEndpointOutputSchemas.collectionTrashGet,
		{ id: 'trash', name: 'Trash' },
	],
	[
		'collectionTree',
		MetabaseEndpointOutputSchemas.collectionTree,
		[{ id: 8, name: 'Finance', children: true }],
	],
	[
		'collectionCandidates',
		MetabaseEndpointOutputSchemas.collectionCandidates,
		{ data: [], total: 0 },
	],
	[
		'collectionMoveCandidates',
		MetabaseEndpointOutputSchemas.collectionMoveCandidates,
		{ moved: [15] },
	],
	[
		'collectionItems',
		MetabaseEndpointOutputSchemas.collectionItems,
		{ total: 0, data: [], models: [] },
	],
	[
		'collectionItemsMetadata',
		MetabaseEndpointOutputSchemas.collectionItemsMetadata,
		{ available_models: ['collection'], total_items: 1 },
	],
];

describe('Metabase schema', () => {
	it('uses an empty persistence schema', () => {
		expect(MetabaseSchema.entities).toBe(metabaseEntities);
		expect(MetabaseSchema.entities).toEqual({});
	});

	it('keeps every endpoint input and output schema registered', () => {
		const inputKeys = Object.keys(MetabaseEndpointInputSchemas).sort();
		const outputKeys = Object.keys(MetabaseEndpointOutputSchemas).sort();
		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toHaveLength(18);
	});

	it.each(validInputs)('validates input schema %s', (_name, schema, value) => {
		expect(schema.safeParse(value).success).toBe(true);
	});

	it.each(validOutputs)(
		'validates output schema %s',
		(_name, schema, value) => {
			expect(schema.safeParse(value).success).toBe(true);
		},
	);

	it('rejects undocumented request keys and invalid collection filters', () => {
		expect(
			MetabaseEndpointInputSchemas.collectionList.safeParse({
				query: { archived: true, extra: true },
			}).success,
		).toBe(false);
		expect(
			MetabaseEndpointInputSchemas.collectionItems.safeParse({
				path: { id: 8 },
				query: { 'pinned-state': 'maybe' },
			}).success,
		).toBe(false);
		expect(
			MetabaseEndpointInputSchemas.collectionRootItems.safeParse({
				query: { models: ['unsupported-model'] },
			}).success,
		).toBe(false);
		expect(
			MetabaseEndpointInputSchemas.collectionGet.safeParse({
				path: { id: '..' },
			}).success,
		).toBe(false);
	});

	it('matches nullable collection IDs, optional response fields, and recursive trees', () => {
		expect(
			CollectionSchema.safeParse({ id: 'root', name: 'Root', can_write: true })
				.success,
		).toBe(true);
		expect(
			CollectionTreeNodeSchema.safeParse({
				id: 1,
				name: 'Parent',
				children: [{ id: 2, name: 'Child', children: false }],
				here: ['collection'],
			}).success,
		).toBe(true);
		expect(
			CollectionTreeNodeSchema.safeParse({ id: 1, children: [] }).success,
		).toBe(false);
	});

	it('preserves JSON-only heterogeneous collection item values', () => {
		expect(
			CollectionItemsResponseSchema.safeParse({
				total: 1,
				data: [{ id: 1, model: 'dashboard', metadata: { pinned: true } }],
				models: ['dashboard'],
			}).success,
		).toBe(true);
		expect(
			CollectionItemsResponseSchema.safeParse({
				total: 1,
				data: ['dashboard'],
				models: [],
			}).success,
		).toBe(false);
	});

	it('validates graph permissions, candidate details, and destructive delete output', () => {
		expect(
			CollectionGraphSchema.safeParse({ groups: { '1': { '8': 'write' } } })
				.success,
		).toBe(true);
		expect(
			CollectionGraphSchema.safeParse({ groups: { '1': { '8': 'admin' } } })
				.success,
		).toBe(false);
		expect(
			DashboardQuestionCandidatesSchema.safeParse({ data: [], total: 0 })
				.success,
		).toBe(true);
		expect(
			DashboardQuestionCandidatesSchema.safeParse({
				data: [{ id: 1 }],
				total: 1,
			}).success,
		).toBe(false);
		expect(CollectionDeleteResponseSchema.safeParse(0).success).toBe(true);
		expect(CollectionDeleteResponseSchema.safeParse(-1).success).toBe(false);
		expect(MoveCandidatesResponseSchema.safeParse({ moved: [1] }).success).toBe(
			true,
		);
	});
});
