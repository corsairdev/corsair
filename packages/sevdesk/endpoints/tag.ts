import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Tag = {
	getTags: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.getTags'],
		SevdeskEndpointOutputSchemas['tag.getTags'],
		'tag.getTags',
		'GET',
		'/Tag',
	),
	getTagById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.getTagById'],
		SevdeskEndpointOutputSchemas['tag.getTagById'],
		'tag.getTagById',
		'GET',
		'/Tag/{tagId}',
	),
	updateTag: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.updateTag'],
		SevdeskEndpointOutputSchemas['tag.updateTag'],
		'tag.updateTag',
		'PUT',
		'/Tag/{tagId}',
	),
	deleteTag: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.deleteTag'],
		SevdeskEndpointOutputSchemas['tag.deleteTag'],
		'tag.deleteTag',
		'DELETE',
		'/Tag/{tagId}',
	),
	createTag: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.createTag'],
		SevdeskEndpointOutputSchemas['tag.createTag'],
		'tag.createTag',
		'POST',
		'/Tag/Factory/create',
	),
	getTagRelations: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['tag.getTagRelations'],
		SevdeskEndpointOutputSchemas['tag.getTagRelations'],
		'tag.getTagRelations',
		'GET',
		'/TagRelation',
	),
} as const;
