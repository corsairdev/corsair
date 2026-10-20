import type { ClaidAiContext } from '..';
import type { ClaidAiEndpointOutputs } from './types';

type ImageOutput = NonNullable<
	ClaidAiEndpointOutputs['imageGenerate']['data']['output']
>[number];

function imageId(image: ImageOutput): string | undefined {
	return (
		image.claid_storage_uri ?? image.object_uri ?? image.tmp_url ?? undefined
	);
}

async function saveImages(
	store: ClaidAiContext['db']['editedImages'],
	images: ImageOutput[],
) {
	for (const image of images) {
		const id = imageId(image);
		if (id) await store.upsertByEntityId(id, { id, ...image });
	}
}

export async function saveEditedImages(
	ctx: ClaidAiContext,
	response: ClaidAiEndpointOutputs['backgroundRemove'],
) {
	const output = response.data.output;
	if (!output) return;
	try {
		await saveImages(
			ctx.db.editedImages,
			Array.isArray(output) ? output : [output],
		);
	} catch (error) {
		console.warn('Failed to save edited images to database:', error);
	}
}

export async function saveGeneratedImages(
	ctx: ClaidAiContext,
	response: ClaidAiEndpointOutputs['imageGenerate'],
) {
	try {
		await saveImages(ctx.db.generatedImages, response.data.output ?? []);
	} catch (error) {
		console.warn('Failed to save generated images to database:', error);
	}
}

export async function saveImageTask(
	ctx: ClaidAiContext,
	response: ClaidAiEndpointOutputs['imageAiEdit'],
) {
	const { id, status, result_url, created_at } = response.data;
	try {
		await ctx.db.imageTasks.upsertByEntityId(String(id), {
			id: String(id),
			status,
			result_url,
			created_at,
		});
	} catch (error) {
		console.warn('Failed to save image task to database:', error);
	}
}

export async function saveStorages(
	ctx: ClaidAiContext,
	storages: ClaidAiEndpointOutputs['storageList']['data'],
) {
	try {
		for (const { id, name, type, created_at } of storages) {
			await ctx.db.storages.upsertByEntityId(String(id), {
				id: String(id),
				name,
				type,
				created_at,
			});
		}
	} catch (error) {
		console.warn('Failed to save storages to database:', error);
	}
}

export async function saveStorageTypes(
	ctx: ClaidAiContext,
	types: ClaidAiEndpointOutputs['storageTypes']['data'],
) {
	try {
		for (const type of types) {
			await ctx.db.storageTypes.upsertByEntityId(type, { id: type });
		}
	} catch (error) {
		console.warn('Failed to save storage types to database:', error);
	}
}

export async function deleteStorageRow(ctx: ClaidAiContext, storageId: number) {
	try {
		await ctx.db.storages.deleteByEntityId(String(storageId));
	} catch (error) {
		console.warn('Failed to remove storage from database:', error);
	}
}
