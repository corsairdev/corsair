import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * Create a new Collection.
 *
 * Collections hold up to 15,000 requests and can be scheduled or run manually.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/create
 */
export const createCollection: AsinDataApiEndpoints['collectionsCreate'] =
	async (ctx, input) => {
		const raw = await makeAsinDataApiRequest<unknown>('collections', ctx.key, {
			method: 'POST',
			body: input,
		});

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsCreate.parse(raw);

		if (ctx.db.collections) {
			try {
				await ctx.db.collections.upsertByEntityId(response.collection.id, {
					id: response.collection.id,
					name: response.collection.name,
					status: response.collection.status,
					scheduleType: response.collection.schedule_type,
				});
			} catch (error) {
				console.warn('Failed to save collection to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'asindataapi.collections.create',
			{ name: input.name },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsCreate'];
	};

/**
 * List all Collections on the account (paginated).
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/list
 */
export const listCollections: AsinDataApiEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>('collections', ctx.key, {
		method: 'GET',
		query: input as Record<string, string | number | boolean | undefined>,
	});

	const response = AsinDataApiEndpointOutputSchemas.collectionsList.parse(raw);

	if (response.collections && ctx.db.collections) {
		try {
			for (const col of response.collections) {
				await ctx.db.collections.upsertByEntityId(col.id, {
					id: col.id,
					name: col.name,
					status: col.status,
					scheduleType: col.schedule_type,
				});
			}
		} catch (error) {
			console.warn('Failed to save collections to database:', error);
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

/**
 * Get details of a specific Collection by its id.
 *
 * Returns status, request counts, and all configuration fields.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/get
 */
export const getCollection: AsinDataApiEndpoints['collectionsGet'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.collectionsGet.parse(raw);

	if (ctx.db.collections) {
		try {
			await ctx.db.collections.upsertByEntityId(response.collection.id, {
				id: response.collection.id,
				name: response.collection.name,
				status: response.collection.status,
				scheduleType: response.collection.schedule_type,
			});
		} catch (error) {
			console.warn('Failed to save collection to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asindataapi.collections.get',
		{ id: input.id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['collectionsGet'];
};

/**
 * Update an existing Collection's configuration.
 *
 * Only works when the collection is not running.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/update
 */
export const updateCollection: AsinDataApiEndpoints['collectionsUpdate'] =
	async (ctx, input) => {
		const { id, ...fields } = input;
		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${id}`,
			ctx.key,
			{
				method: 'PUT',
				body: fields,
			},
		);

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsUpdate.parse(raw);

		if (ctx.db.collections) {
			try {
				await ctx.db.collections.upsertByEntityId(response.collection.id, {
					id: response.collection.id,
					name: response.collection.name,
					status: response.collection.status,
					scheduleType: response.collection.schedule_type,
				});
			} catch (error) {
				console.warn('Failed to save collection to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'asindataapi.collections.update',
			{ id },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsUpdate'];
	};

/**
 * Delete a Collection by its id.
 *
 * Only works when the collection is not running.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/delete
 */
export const deleteCollection: AsinDataApiEndpoints['collectionsDelete'] =
	async (ctx, input) => {
		const raw = await makeAsinDataApiRequest<unknown>(
			`collections/${input.id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		const response =
			AsinDataApiEndpointOutputSchemas.collectionsDelete.parse(raw);

		if (ctx.db.collections) {
			try {
				await ctx.db.collections.deleteByEntityId(input.id);
			} catch (error) {
				console.warn('Failed to delete collection from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'asindataapi.collections.delete',
			{ id: input.id },
			'completed',
		);
		return response as AsinDataApiEndpointOutputs['collectionsDelete'];
	};

/**
 * Start a Collection (runs all its requests immediately).
 *
 * Requires sufficient credits. Works for any schedule_type when idle.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/start
 */
export const startCollection: AsinDataApiEndpoints['collectionsStart'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.id}/start`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.collectionsStart.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.collections.start',
		{ id: input.id },
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
