import type { ApiRequestOptions } from 'corsair/http';
import { makeParmaRequest } from '../client';
import type { ParmaContext } from '../index';
import type { ParmaEndpointInputs, ParmaEndpointOutputs } from './types';
import {
	ParmaEndpointInputSchemas as inputs,
	ParmaEndpointOutputSchemas as outputs,
} from './types';

type Operation = keyof ParmaEndpointInputs;
type RequestBuilder<K extends Operation> = (
	input: ParmaEndpointInputs[K],
) => ApiRequestOptions;

function endpoint<K extends Operation>(name: K, build: RequestBuilder<K>) {
	return async (
		context: ParmaContext,
		input: ParmaEndpointInputs[K],
	): Promise<ParmaEndpointOutputs[K]> => {
		const validated = inputs[name].parse(input) as ParmaEndpointInputs[K];
		const result = await makeParmaRequest(context.key ?? '', build(validated));
		return outputs[name].parse(result) as ParmaEndpointOutputs[K];
	};
}
const path = (id: string) => encodeURIComponent(id);
const get = (
	url: string,
	query?: Record<string, string | undefined>,
): ApiRequestOptions => ({ method: 'GET', url, query });
const write = (
	method: 'POST' | 'PATCH',
	url: string,
	body: Record<string, unknown>,
): ApiRequestOptions => ({ method, url, body, mediaType: 'application/json' });

export const ParmaOperations = {
	listDeals: endpoint('listDeals', (q) => get('/api/v1/deals', q)),
	getDeal: endpoint('getDeal', ({ id }) => get(`/api/v1/deals/${path(id)}`)),
	listGroups: endpoint('listGroups', (q) => get('/api/v1/groups', q)),
	listNotes: endpoint('listNotes', (q) => get('/api/v1/notes', q)),
	createNote: endpoint('createNote', (body) =>
		write('POST', '/api/v1/notes', body),
	),
	updateNote: endpoint('updateNote', ({ id, ...body }) =>
		write('PATCH', `/api/v1/notes/${path(id)}`, body),
	),
	listPipelines: endpoint('listPipelines', () => get('/api/v1/pipelines')),
	getPipeline: endpoint('getPipeline', ({ id }) =>
		get(`/api/v1/pipelines/${path(id)}`),
	),
	listRelationshipGroups: endpoint(
		'listRelationshipGroups',
		({ relationship_id }) =>
			get(`/api/v1/relationships/${path(relationship_id)}/groups`),
	),
	addRelationshipGroup: endpoint(
		'addRelationshipGroup',
		({ relationship_id, group_id }) =>
			write('POST', `/api/v1/relationships/${path(relationship_id)}/groups`, {
				group_id,
			}),
	),
	removeRelationshipGroup: endpoint(
		'removeRelationshipGroup',
		({ relationship_id, relationship_group_id }) => ({
			method: 'DELETE',
			url: `/api/v1/relationships/${path(relationship_id)}/groups/${path(relationship_group_id)}`,
		}),
	),
	listRelationshipNotes: endpoint(
		'listRelationshipNotes',
		({ relationship_id, page }) =>
			get(`/api/v1/relationships/${path(relationship_id)}/notes`, { page }),
	),
	listRelationships: endpoint('listRelationships', (q) =>
		get('/api/v1/relationships', q),
	),
	createRelationship: endpoint('createRelationship', (body) =>
		write('POST', '/api/v1/relationships', body),
	),
	getRelationship: endpoint('getRelationship', ({ id }) =>
		get(`/api/v1/relationships/${path(id)}`),
	),
	updateRelationship: endpoint('updateRelationship', ({ id, ...body }) =>
		write('PATCH', `/api/v1/relationships/${path(id)}`, body),
	),
	deleteRelationship: endpoint('deleteRelationship', ({ id }) => ({
		method: 'DELETE',
		url: `/api/v1/relationships/${path(id)}`,
	})),
	listStages: endpoint('listStages', () => get('/api/v1/stages')),
	getStage: endpoint('getStage', ({ id }) => get(`/api/v1/stages/${path(id)}`)),
	listUsers: endpoint('listUsers', () => get('/api/v1/users')),
	getUser: endpoint('getUser', ({ id }) => get(`/api/v1/users/${path(id)}`)),
	getCurrentUser: endpoint('getCurrentUser', () => get('/api/v1/users/me')),
};
