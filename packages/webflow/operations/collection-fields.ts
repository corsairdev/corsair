import type { WebflowOperation } from '../endpoints/operation-types';

export const collectionFieldsOperations = [
	{
		key: 'createCollectionField',
		group: 'collectionFields',
		name: 'createCollectionField',
		method: 'POST',
		path: '/collections/{collection_id}/fields',
		pathParams: ['collection_id'],
		riskLevel: 'write',
		description:
			'Create a custom field in a collection. Fields must be created one at a time',
	},
	{
		key: 'updateCollectionField',
		group: 'collectionFields',
		name: 'updateCollectionField',
		method: 'PATCH',
		path: '/collections/{collection_id}/fields/{field_id}',
		pathParams: ['collection_id', 'field_id'],
		riskLevel: 'write',
		description:
			"Update a custom field's display name, help text, or required status",
	},
	{
		key: 'deleteCollectionField',
		group: 'collectionFields',
		name: 'deleteCollectionField',
		method: 'DELETE',
		path: '/collections/{collection_id}/fields/{field_id}',
		pathParams: ['collection_id', 'field_id'],
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a custom field from a collection schema',
	},
] as const satisfies readonly WebflowOperation[];
