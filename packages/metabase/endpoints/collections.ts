import { createMetabaseEndpoint, encodeCollectionId } from './base';
import {
	CollectionDeleteResponseSchema,
	CollectionGraphSchema,
	CollectionGraphUpdateResponseSchema,
	CollectionItemsMetadataSchema,
	CollectionItemsResponseSchema,
	CollectionSchema,
	CollectionTreeNodeSchema,
	DashboardQuestionCandidatesSchema,
	MetabaseEndpointInputSchemas,
	MetabaseEndpointOutputSchemas,
	MoveCandidatesResponseSchema,
} from './types';

const collectionList = createMetabaseEndpoint(
	'collections.list',
	MetabaseEndpointInputSchemas.collectionList,
	MetabaseEndpointOutputSchemas.collectionList,
	(input) => ({
		method: 'GET',
		path: '/api/collection',
		query: input.query,
	}),
);

const collectionCreate = createMetabaseEndpoint(
	'collections.create',
	MetabaseEndpointInputSchemas.collectionCreate,
	CollectionSchema,
	(input) => ({
		method: 'POST',
		path: '/api/collection',
		body: input.body,
	}),
);

const collectionGet = createMetabaseEndpoint(
	'collections.get',
	MetabaseEndpointInputSchemas.collectionGet,
	CollectionSchema,
	(input) => ({
		method: 'GET',
		path: `/api/collection/${encodeCollectionId(input.path.id)}`,
	}),
);

const collectionUpdate = createMetabaseEndpoint(
	'collections.update',
	MetabaseEndpointInputSchemas.collectionUpdate,
	CollectionSchema,
	(input) => ({
		method: 'PUT',
		path: `/api/collection/${encodeCollectionId(input.path.id)}`,
		body: input.body,
	}),
);

const collectionDelete = createMetabaseEndpoint(
	'collections.delete',
	MetabaseEndpointInputSchemas.collectionDelete,
	CollectionDeleteResponseSchema,
	(input) => ({
		method: 'DELETE',
		path: `/api/collection/${encodeCollectionId(input.path.id)}`,
	}),
);

const collectionGraphGet = createMetabaseEndpoint(
	'collectionPermissions.getGraph',
	MetabaseEndpointInputSchemas.collectionGraphGet,
	CollectionGraphSchema,
	(input) => ({
		method: 'GET',
		path: '/api/collection/graph',
		query: input.query,
	}),
);

const collectionGraphUpdate = createMetabaseEndpoint(
	'collectionPermissions.updateGraph',
	MetabaseEndpointInputSchemas.collectionGraphUpdate,
	CollectionGraphUpdateResponseSchema,
	(input) => ({
		method: 'PUT',
		path: '/api/collection/graph',
		query: input.query,
		body: input.body,
	}),
);

const collectionRootGet = createMetabaseEndpoint(
	'collections.getRoot',
	MetabaseEndpointInputSchemas.collectionRootGet,
	CollectionSchema,
	(input) => ({
		method: 'GET',
		path: '/api/collection/root',
		query: input.query,
	}),
);

const collectionRootItems = createMetabaseEndpoint(
	'collections.listRootItems',
	MetabaseEndpointInputSchemas.collectionRootItems,
	CollectionItemsResponseSchema,
	(input) => ({
		method: 'GET',
		path: '/api/collection/root/items',
		query: input.query,
	}),
);

const collectionRootItemsMetadata = createMetabaseEndpoint(
	'collections.getRootItemsMetadata',
	MetabaseEndpointInputSchemas.collectionRootItemsMetadata,
	CollectionItemsMetadataSchema,
	(input) => ({
		method: 'GET',
		path: '/api/collection/root/items/metadata',
		query: input.query,
	}),
);

const collectionRootCandidates = createMetabaseEndpoint(
	'collections.listRootDashboardQuestionCandidates',
	MetabaseEndpointInputSchemas.collectionRootCandidates,
	DashboardQuestionCandidatesSchema,
	(input) => ({
		method: 'GET',
		path: '/api/collection/root/dashboard-question-candidates',
		query: input.query,
	}),
);

const collectionRootMoveCandidates = createMetabaseEndpoint(
	'collections.moveRootDashboardQuestionCandidates',
	MetabaseEndpointInputSchemas.collectionRootMoveCandidates,
	MoveCandidatesResponseSchema,
	(input) => ({
		method: 'POST',
		path: '/api/collection/root/move-dashboard-question-candidates',
		body: input.body,
	}),
);

const collectionTrashGet = createMetabaseEndpoint(
	'collections.getTrash',
	MetabaseEndpointInputSchemas.collectionTrashGet,
	CollectionSchema,
	() => ({ method: 'GET', path: '/api/collection/trash' }),
);

const collectionTree = createMetabaseEndpoint(
	'collections.getTree',
	MetabaseEndpointInputSchemas.collectionTree,
	CollectionTreeNodeSchema.array(),
	(input) => ({
		method: 'GET',
		path: '/api/collection/tree',
		query: input.query,
	}),
);

const collectionCandidates = createMetabaseEndpoint(
	'collections.listDashboardQuestionCandidates',
	MetabaseEndpointInputSchemas.collectionCandidates,
	DashboardQuestionCandidatesSchema,
	(input) => ({
		method: 'GET',
		path: `/api/collection/${encodeCollectionId(input.path.id)}/dashboard-question-candidates`,
		query: input.query,
	}),
);

const collectionMoveCandidates = createMetabaseEndpoint(
	'collections.moveDashboardQuestionCandidates',
	MetabaseEndpointInputSchemas.collectionMoveCandidates,
	MoveCandidatesResponseSchema,
	(input) => ({
		method: 'POST',
		path: `/api/collection/${encodeCollectionId(input.path.id)}/move-dashboard-question-candidates`,
		body: input.body,
	}),
);

const collectionItems = createMetabaseEndpoint(
	'collections.listItems',
	MetabaseEndpointInputSchemas.collectionItems,
	CollectionItemsResponseSchema,
	(input) => ({
		method: 'GET',
		path: `/api/collection/${encodeCollectionId(input.path.id)}/items`,
		query: input.query,
	}),
);

const collectionItemsMetadata = createMetabaseEndpoint(
	'collections.getItemsMetadata',
	MetabaseEndpointInputSchemas.collectionItemsMetadata,
	CollectionItemsMetadataSchema,
	(input) => ({
		method: 'GET',
		path: `/api/collection/${encodeCollectionId(input.path.id)}/items/metadata`,
		query: input.query,
	}),
);

export const Collections = {
	list: collectionList,
	create: collectionCreate,
	get: collectionGet,
	update: collectionUpdate,
	delete: collectionDelete,
	tree: collectionTree,
	root: {
		get: collectionRootGet,
		items: {
			list: collectionRootItems,
			metadata: collectionRootItemsMetadata,
		},
		candidates: {
			list: collectionRootCandidates,
			move: collectionRootMoveCandidates,
		},
	},
	trash: { get: collectionTrashGet },
	items: {
		list: collectionItems,
		metadata: collectionItemsMetadata,
	},
	candidates: {
		list: collectionCandidates,
		move: collectionMoveCandidates,
	},
} as const;

export const CollectionPermissions = {
	graph: {
		get: collectionGraphGet,
		update: collectionGraphUpdate,
	},
} as const;
