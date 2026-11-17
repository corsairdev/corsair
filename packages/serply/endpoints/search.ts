import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { serplyGet } from '../client';
import type { SerplyContext } from '../context';
import {
	SerplyArticleEntity,
	SerplyImageEntity,
	SerplyPlaceEntity,
} from '../schema/database';
import type {
	ArticleResponse,
	ImageInput,
	ImageResponse,
	PlaceResponse,
	QueryInput,
	ScholarInput,
} from './types';
import {
	ImageInputSchema,
	QueryInputSchema,
	ScholarInputSchema,
} from './types';

// unknown: a field of an untrusted response row, checked here.
function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: a field of an untrusted response row, checked here.
function optionalNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// unknown: any response node; returns it as a record when it is an object.
function record(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? // unknown: an untrusted response node, read field by field.
			(value as Record<string, unknown>)
		: undefined;
}

async function requireKey(ctx: SerplyContext): Promise<string> {
	if (!ctx.key) throw new AuthMissingError('serply', 'api_key');
	return ctx.key;
}

export const searchImages: CorsairEndpoint<
	SerplyContext,
	ImageInput,
	ImageResponse
> = async (ctx, input) => {
	const key = await requireKey(ctx);
	const parsed = ImageInputSchema.parse(input ?? {});
	// unknown: checked below for an `image_results` array.
	const body = await serplyGet<unknown>(key, '/v1/image', {
		q: parsed.q,
		num: parsed.num === undefined ? undefined : String(parsed.num),
	});
	const rows = record(body);
	const list = rows?.image_results;
	if (!Array.isArray(list)) {
		throw new Error('Serply image response had no image_results array');
	}
	const images = list.flatMap((item) => {
		const row = record(item);
		const image = record(row?.image);
		const link = record(row?.link);
		const original = record(row?.original_image);
		const href = optionalString(link?.href);
		// One page can host several images, so the row is keyed by the image
		// itself; the hosting page is only the last resort.
		const id =
			optionalString(original?.src) ?? optionalString(image?.src) ?? href;
		if (!id) return [];
		const parsedRow = SerplyImageEntity.safeParse({
			id,
			src: optionalString(image?.src),
			alt: optionalString(image?.alt),
			title: optionalString(link?.title),
			domain: optionalString(link?.domain),
			originalSrc: optionalString(original?.src),
			width: optionalString(original?.width),
			height: optionalString(original?.height),
		});
		return parsedRow.success ? [parsedRow.data] : [];
	});
	if (ctx.db?.images) {
		for (const row of images) {
			try {
				await ctx.db.images.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save Serply image');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'serply.images.search',
		{ count: images.length },
		'completed',
	);
	return { images };
};

export const searchPlaces: CorsairEndpoint<
	SerplyContext,
	QueryInput,
	PlaceResponse
> = async (ctx, input) => {
	const key = await requireKey(ctx);
	const parsed = QueryInputSchema.parse(input ?? {});
	// unknown: checked below for a `places` array.
	const body = await serplyGet<unknown>(
		key,
		`/v1/maps/search/${encodeURIComponent(parsed.q)}`,
	);
	const rows = record(body);
	const list = rows?.places;
	if (!Array.isArray(list)) {
		throw new Error('Serply maps response had no places array');
	}
	const places = list.flatMap((item) => {
		const row = record(item);
		if (!row) return [];
		const id = optionalString(row.place_id) ?? optionalString(row.data_id);
		if (!id) return [];
		const parsedRow = SerplyPlaceEntity.safeParse({
			id,
			name: optionalString(row.name),
			latitude: optionalNumber(row.latitude),
			longitude: optionalNumber(row.longitude),
			rating: optionalNumber(row.rating),
			address: optionalString(row.address),
		});
		return parsedRow.success ? [parsedRow.data] : [];
	});
	if (ctx.db?.places) {
		for (const row of places) {
			try {
				await ctx.db.places.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save Serply place');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'serply.places.search',
		{ count: places.length },
		'completed',
	);
	return { places };
};

export const searchArticles: CorsairEndpoint<
	SerplyContext,
	ScholarInput,
	ArticleResponse
> = async (ctx, input) => {
	const key = await requireKey(ctx);
	const parsed = ScholarInputSchema.parse(input ?? {});
	// unknown: checked below for an `articles` array.
	const body = await serplyGet<unknown>(key, '/v1/scholar', {
		q: parsed.q,
		num: parsed.num === undefined ? undefined : String(parsed.num),
		start: parsed.start === undefined ? undefined : String(parsed.start),
	});
	const rows = record(body);
	const list = rows?.articles;
	if (!Array.isArray(list)) {
		throw new Error('Serply scholar response had no articles array');
	}
	const articles = list.flatMap((item) => {
		const row = record(item);
		const id = optionalString(row?.id);
		if (!id) return [];
		const parsedRow = SerplyArticleEntity.safeParse({
			id,
			title: optionalString(row?.title),
			link: optionalString(row?.link),
		});
		return parsedRow.success ? [parsedRow.data] : [];
	});
	if (ctx.db?.articles) {
		for (const row of articles) {
			try {
				await ctx.db.articles.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save Serply article');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'serply.articles.search',
		{ count: articles.length },
		'completed',
	);
	return { articles };
};
