import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Create a new Collection.
 *
 * Collections hold up to 15,000 requests and can be scheduled or run manually.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/create
 */
export const createCollection: AsinDataApiEndpoints['collectionsCreate'] =
	async (ctx, input) => {
		const response = await makeAsinDataApiRequest<
			AsinDataApiEndpointOutputs['collectionsCreate']
		>('collections', ctx.key, {
			method: 'POST',
			body: input,
		});

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
		return response;
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
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['collectionsList']
	>('collections', ctx.key, {
		method: 'GET',
		query: input as Record<string, string | number | boolean | undefined>,
	});

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
	return response;
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
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['collectionsGet']
	>(`collections/${input.id}`, ctx.key, { method: 'GET' });

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
	return response;
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
		const response = await makeAsinDataApiRequest<
			AsinDataApiEndpointOutputs['collectionsUpdate']
		>(`collections/${id}`, ctx.key, {
			method: 'PUT',
			body: fields,
		});

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
		return response;
	};

/**
 * Delete a Collection by its id.
 *
 * Only works when the collection is not running.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/delete
 */
export const deleteCollection: AsinDataApiEndpoints['collectionsDelete'] =
	async (ctx, input) => {
		const response = await makeAsinDataApiRequest<
			AsinDataApiEndpointOutputs['collectionsDelete']
		>(`collections/${input.id}`, ctx.key, { method: 'DELETE' });

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
		return response;
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
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['collectionsStart']
	>(`collections/${input.id}/start`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'asindataapi.collections.start',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const Collections = {
	create: createCollection,
	list: listCollections,
	get: getCollection,
	update: updateCollection,
	delete: deleteCollection,
	start: startCollection,
};
