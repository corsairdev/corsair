import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import { evictEntity, upsertEntity } from './persist';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

export const createCollection: AsinDataApiEndpoints['collectionsCreate'] =
	async (ctx, input) => {
		const raw = await makeAsinDataApiRequest<unknown>('collections', ctx.key, {
			method: 'POST',
			body: input,
		});

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsCreate.parse(raw);

		await upsertEntity(
			ctx.db.collections,
			response.collection.id,
			response.collection,
		);

		await logEventFromContext(
			ctx,
			'asindataapi.collections.create',
			{ name: input.name },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsCreate'];
	};

export const listCollections: AsinDataApiEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>('collections', ctx.key, {
		method: 'GET',
		query: input as Record<string, string | number | boolean | undefined>,
	});

	const response = AsinDataApiEndpointOutputSchemas.collectionsList.parse(raw);

	if (response.collections) {
		for (const col of response.collections) {
			await upsertEntity(ctx.db.collections, col.id, col);
		}
	}

	await logEventFromContext(
		ctx,
		'asindataapi.collections.list',
		{},
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['collectionsList'];
};

export const getCollection: AsinDataApiEndpoints['collectionsGet'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.collectionsGet.parse(raw);

	await upsertEntity(
		ctx.db.collections,
		response.collection.id,
		response.collection,
	);

	await logEventFromContext(
		ctx,
		'asindataapi.collections.get',
		{ collection_id: input.collection_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['collectionsGet'];
};

export const updateCollection: AsinDataApiEndpoints['collectionsUpdate'] =
	async (ctx, input) => {
		const { collection_id, ...fields } = input;
		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(collection_id)}`,
			ctx.key,
			{
				method: 'PUT',
				body: fields,
			},
		);

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsUpdate.parse(raw);

		await upsertEntity(
			ctx.db.collections,
			response.collection.id,
			response.collection,
		);

		await logEventFromContext(
			ctx,
			'asindataapi.collections.update',
			{ collection_id },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsUpdate'];
	};

export const deleteCollection: AsinDataApiEndpoints['collectionsDelete'] =
	async (ctx, input) => {
		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(input.collection_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsDelete.parse(raw);

		await evictEntity(ctx.db.collections, input.collection_id);

		await logEventFromContext(
			ctx,
			'asindataapi.collections.delete',
			{ collection_id: input.collection_id },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsDelete'];
	};

export const startCollection: AsinDataApiEndpoints['collectionsStart'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/start`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.collectionsStart.parse(raw);

	const latest = AsinDataApiEndpointOutputSchemas.collectionsGet.parse(
		await makeAsinDataApiRequest<unknown>(
			`collections/${encodeURIComponent(input.collection_id)}`,
			ctx.key,
			{ method: 'GET' },
		),
	);
	await upsertEntity(
		ctx.db.collections,
		latest.collection.id,
		latest.collection,
	);

	await logEventFromContext(
		ctx,
		'asindataapi.collections.start',
		{ collection_id: input.collection_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['collectionsStart'];
};

export const Collections = {
	create: createCollection,
	list: listCollections,
	get: getCollection,
	update: updateCollection,
	delete: deleteCollection,
	start: startCollection,
};
