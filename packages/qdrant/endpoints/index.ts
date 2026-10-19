import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import { makeQdrantRequest } from '../client';
import type { QdrantContext, QdrantEndpoints } from '../index';
import type {
	QdrantEndpointInputs,
	QdrantEndpointOutputs,
	QdrantEndpointParsedInputs,
} from './types';
import {
	QdrantEndpointInputSchemas,
	QdrantEndpointOutputSchemas,
} from './types';

type Key = keyof QdrantEndpointInputs;
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Route<K extends Key> = [
	method: Method,
	path: (input: QdrantEndpointParsedInputs[K]) => string,
	fixedQuery?: Record<string, boolean>,
];

const encode = encodeURIComponent;
type WithCollection = { collectionName: string };
const collection = (i: WithCollection) =>
	`/collections/${encode(i.collectionName)}`;
const points = (i: WithCollection) => `${collection(i)}/points`;

// Snapshots always wait: otherwise Qdrant answers without the snapshot.
const wait = { wait: true };

const routes: { [K in Key]: Route<K> } = {
	'collections.list': ['GET', () => '/collections'],
	'collections.get': ['GET', collection],
	'collections.exists': ['GET', (i) => `${collection(i)}/exists`],
	'collections.create': ['PUT', collection],
	'collections.update': ['PATCH', collection],
	'collections.delete': ['DELETE', collection],
	'aliases.list': ['GET', () => '/aliases'],
	'aliases.listForCollection': ['GET', (i) => `${collection(i)}/aliases`],
	'aliases.update': ['POST', () => '/collections/aliases'],
	'payloadIndexes.create': ['PUT', (i) => `${collection(i)}/index`],
	'payloadIndexes.delete': [
		'DELETE',
		(i) => `${collection(i)}/index/${encode(i.fieldName)}`,
	],
	'points.upsert': ['PUT', points],
	'points.get': ['POST', points],
	'points.delete': ['POST', (i) => `${points(i)}/delete`],
	'points.scroll': ['POST', (i) => `${points(i)}/scroll`],
	'points.count': ['POST', (i) => `${points(i)}/count`],
	'points.setPayload': ['POST', (i) => `${points(i)}/payload`],
	'points.overwritePayload': ['PUT', (i) => `${points(i)}/payload`],
	'points.deletePayload': ['POST', (i) => `${points(i)}/payload/delete`],
	'points.clearPayload': ['POST', (i) => `${points(i)}/payload/clear`],
	'points.updateVectors': ['PUT', (i) => `${points(i)}/vectors`],
	'points.deleteVectors': ['POST', (i) => `${points(i)}/vectors/delete`],
	'query.points': ['POST', (i) => `${points(i)}/query`],
	'query.batch': ['POST', (i) => `${points(i)}/query/batch`],
	'query.groups': ['POST', (i) => `${points(i)}/query/groups`],
	'query.facet': ['POST', (i) => `${collection(i)}/facet`],
	'snapshots.list': ['GET', (i) => `${collection(i)}/snapshots`],
	'snapshots.create': ['POST', (i) => `${collection(i)}/snapshots`, wait],
	'snapshots.delete': [
		'DELETE',
		(i) => `${collection(i)}/snapshots/${encode(i.snapshotName)}`,
		wait,
	],
};

const PATH_FIELDS = new Set(['collectionName', 'fieldName', 'snapshotName']);
const QUERY_FIELDS = new Set(['wait', 'ordering', 'timeout', 'consistency']);

/** Sends path fields in the URL, query fields in the query string and the rest as the body. */
function define<K extends Key>(
	key: K,
	[method, path, fixedQuery]: Route<K>,
): QdrantEndpoints[K] {
	return (async (ctx: QdrantContext, input: QdrantEndpointInputs[K]) => {
		const parsed = QdrantEndpointInputSchemas[key].parse(
			input,
		) as QdrantEndpointParsedInputs[K];

		const query: Record<string, string | number | boolean> = { ...fixedQuery };
		const body: Record<string, unknown> = {};
		for (const [field, value] of Object.entries(parsed)) {
			if (value === undefined || PATH_FIELDS.has(field)) continue;
			if (QUERY_FIELDS.has(field))
				query[field] = value as string | number | boolean;
			else body[field] = value;
		}

		// Inputs carry vectors and payloads, so they are never logged. A failed
		// event write must not fail a call that Qdrant already carried out.
		const { collectionName, timeout } = parsed as {
			collectionName?: string;
			timeout?: number;
		};
		const log = (status: 'completed' | 'failed') =>
			logEventFromContext(
				ctx,
				`qdrant.${key}`,
				collectionName ? { collectionName } : {},
				status,
			).catch((error: unknown) => console.warn('Failed to log event:', error));

		try {
			const output = await makeQdrantRequest(path(parsed), ctx.key, {
				baseUrl:
					ctx.options.baseUrl ??
					(await ctx.keys?.get_base_url?.()) ??
					undefined,
				method,
				body: method === 'GET' || method === 'DELETE' ? undefined : body,
				query,
				timeout,
				schema: QdrantEndpointOutputSchemas[key] as unknown as ZodType<
					QdrantEndpointOutputs[K]
				>,
			});
			await log('completed');
			return output;
		} catch (error) {
			await log('failed');
			throw error;
		}
	}) as QdrantEndpoints[K];
}

type GroupOf<K> = K extends `${infer G}.${string}` ? G : never;
type Group = GroupOf<Key>;
export type QdrantEndpointsNested = {
	[G in Group]: {
		[K in Key as K extends `${G}.${infer N}` ? N : never]: QdrantEndpoints[K];
	};
};

const nested: Record<string, Record<string, unknown>> = {};
for (const key of Object.keys(routes) as Key[]) {
	const [group = '', name = ''] = key.split('.');
	nested[group] ??= {};
	nested[group][name] = define(key, routes[key] as Route<typeof key>);
}
export const qdrantEndpointsNested = nested as unknown as QdrantEndpointsNested;
