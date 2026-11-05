import { logEventFromContext } from 'corsair/core';
import type { TinifyResponse } from '../client';
import {
	imageIdFromLocation,
	numberHeader,
	putAzureBlockBlob,
	readJson,
	TinypngAPIError,
	tinifyRequest,
} from '../client';
import type { TinypngEndpoints } from '../index';
import type { CompressAndStoreInAzureInput, ShrinkInput } from './types';
import {
	CompressAndStoreInAzureInputSchema,
	CompressAndStoreInAzureResponseSchema,
	OutputInputSchema,
	OutputResponseSchema,
	ShrinkInputSchema,
	ShrinkResponseSchema,
	TransformInputSchema,
	TransformResponseSchema,
} from './types';

async function shrinkSource(apiKey: string, source: ShrinkInput['source']) {
	const response = await tinifyRequest(apiKey, {
		method: 'POST',
		path: '/shrink',
		body:
			'url' in source
				? { source: { url: source.url } }
				: new Uint8Array(Buffer.from(source.base64, 'base64')),
	});
	const location = response.headers.get('location');
	const json = ShrinkResponseSchema.pick({ input: true, output: true }).parse(
		readJson(response),
	);
	return ShrinkResponseSchema.parse({
		imageId: imageIdFromLocation(location),
		outputUrl: location,
		compressionCount: numberHeader(response.headers, 'compression-count'),
		input: json.input,
		output: json.output,
	});
}

function imageFile(imageId: string, response: TinifyResponse) {
	return {
		imageId,
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		size: response.body.byteLength,
		width: numberHeader(response.headers, 'image-width'),
		height: numberHeader(response.headers, 'image-height'),
		compressionCount: numberHeader(response.headers, 'compression-count'),
	};
}

type OutputOptions = Pick<
	CompressAndStoreInAzureInput,
	'resize' | 'convert' | 'transform' | 'preserve'
>;

// GET returns the stored result. POST with options re-renders it, which
// Tinify bills as an extra compression for resize and convert.
function downloadOutput(
	apiKey: string,
	imageId: string,
	options: OutputOptions = {},
) {
	const hasOptions = Object.values(options).some((v) => v !== undefined);
	return tinifyRequest(apiKey, {
		method: hasOptions ? 'POST' : 'GET',
		path: `/output/${imageId}`,
		body: hasOptions ? options : undefined,
	});
}

export const shrink: TinypngEndpoints['shrink'] = async (ctx, input) => {
	const { source } = ShrinkInputSchema.parse(input);
	const result = await shrinkSource(ctx.key, source);
	try {
		await ctx.db?.images?.upsertByEntityId(result.imageId, {
			id: result.imageId,
			input: result.input,
			output: result.output,
			compression_count: result.compressionCount,
		});
	} catch (error) {
		console.warn('Failed to save image to database:', error);
	}
	await logEventFromContext(
		ctx,
		'tinypng.images.shrink',
		{ imageId: result.imageId, input: result.input, output: result.output },
		'completed',
	);
	return result;
};

export const output: TinypngEndpoints['output'] = async (ctx, input) => {
	const { imageId } = OutputInputSchema.parse(input);
	const response = await downloadOutput(ctx.key, imageId);
	const file = imageFile(imageId, response);
	await logEventFromContext(ctx, 'tinypng.images.output', file, 'completed');
	return OutputResponseSchema.parse({
		...file,
		base64: Buffer.from(response.body).toString('base64'),
	});
};

export const transform: TinypngEndpoints['transform'] = async (ctx, input) => {
	const { imageId, store, ...options } = TransformInputSchema.parse(input);
	const response = await tinifyRequest(ctx.key, {
		method: 'POST',
		path: `/output/${imageId}`,
		body: { ...options, store },
	});
	const file = imageFile(imageId, response);

	if (store) {
		const location = response.headers.get('location');
		const result = TransformResponseSchema.parse({
			stored: true,
			imageId,
			location,
			width: file.width,
			height: file.height,
			compressionCount: file.compressionCount,
		});
		if (result.stored) {
			try {
				await ctx.db?.storedOutputs?.upsertByEntityId(result.location, {
					id: result.location,
					image_id: imageId,
					service: store.service,
					width: result.width,
					height: result.height,
				});
			} catch (error) {
				console.warn('Failed to save stored output to database:', error);
			}
		}
		// The request body carries storage credentials. Only the result is logged.
		await logEventFromContext(
			ctx,
			'tinypng.images.transform',
			result,
			'completed',
		);
		return result;
	}

	await logEventFromContext(
		ctx,
		'tinypng.images.transform',
		{ stored: false, ...file },
		'completed',
	);
	return TransformResponseSchema.parse({
		stored: false,
		...file,
		base64: Buffer.from(response.body).toString('base64'),
	});
};

export const compressAndStoreInAzure: TinypngEndpoints['compressAndStoreInAzure'] =
	async (ctx, input) => {
		const { source, blobUrl, cacheControl, ...options } =
			CompressAndStoreInAzureInputSchema.parse(input);
		const { imageId } = await shrinkSource(ctx.key, source);
		const response = await downloadOutput(ctx.key, imageId, options).catch(
			(error) => {
				// Retrying the operation would shrink the same image again and bill a second compression.
				throw error instanceof TinypngAPIError
					? new TinypngAPIError(error.message, error.status, error.code, true)
					: error;
			},
		);
		const file = imageFile(imageId, response);
		const { etag } = await putAzureBlockBlob(
			blobUrl,
			response.body,
			file.contentType,
			cacheControl,
		);

		const url = new URL(blobUrl);
		const result = CompressAndStoreInAzureResponseSchema.parse({
			...file,
			// The SAS query string is a credential. It is not returned or logged.
			blobUrl: `${url.origin}${url.pathname}`,
			etag,
		});
		try {
			await ctx.db?.storedOutputs?.upsertByEntityId(result.blobUrl, {
				id: result.blobUrl,
				image_id: imageId,
				service: 'azure',
				width: result.width,
				height: result.height,
				content_type: result.contentType,
				size: result.size,
				etag: result.etag,
			});
		} catch (error) {
			console.warn('Failed to save stored output to database:', error);
		}
		await logEventFromContext(
			ctx,
			'tinypng.images.compressAndStoreInAzure',
			result,
			'completed',
		);
		return result;
	};
