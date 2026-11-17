import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, tripadvisorGet } from '../client';
import type { TripadvisorContentApiContext } from '../context';
import {
	TripadvisorLocationEntity,
	TripadvisorPhotoEntity,
	TripadvisorReviewEntity,
} from '../schema/database';
import type {
	LocationInput,
	LocationListResponse,
	LocationResponse,
	NearbyInput,
	PhotoListResponse,
	ReviewListResponse,
	SearchInput,
} from './types';
import {
	LocationInputSchema,
	NearbyInputSchema,
	SearchInputSchema,
} from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function idText(value: unknown): string | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return text(value);
}

function numeric(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (
		typeof value === 'string' &&
		value.trim() &&
		Number.isFinite(Number(value))
	) {
		return Number(value);
	}
	return undefined;
}

async function save<T extends { id: string }>(
	table:
		| { upsertByEntityId: (id: string, row: T) => Promise<unknown> }
		| undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save Tripadvisor ${label}`);
	}
}

function locationOf(row: Record<string, unknown> | undefined) {
	return TripadvisorLocationEntity.safeParse({
		id: idText(row?.location_id),
		name: text(row?.name),
		rating: numeric(row?.rating),
		reviewCount: numeric(row?.num_reviews),
	});
}

function listLocations(body: unknown) {
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Tripadvisor locations response was not a list');
	return data.flatMap((item) => {
		const location = locationOf(asRecord(item));
		return location.success ? [location.data] : [];
	});
}

export const searchLocations: CorsairEndpoint<
	TripadvisorContentApiContext,
	SearchInput,
	LocationListResponse
> = async (ctx, input) => {
	const parsed = SearchInputSchema.parse(input ?? {});
	const body = await tripadvisorGet<unknown>(
		ctx.key,
		'/api/v1/location/search',
		{
			searchQuery: parsed.searchQuery,
			language: parsed.language ?? 'en',
		},
	);
	const locations = listLocations(body);
	for (const location of locations)
		await save(ctx.db?.locations, location, 'location');
	await logEventFromContext(
		ctx,
		'tripadvisorcontentapi.locations.search',
		{ count: locations.length },
		'completed',
	);
	return { locations };
};

export const searchNearby: CorsairEndpoint<
	TripadvisorContentApiContext,
	NearbyInput,
	LocationListResponse
> = async (ctx, input) => {
	const parsed = NearbyInputSchema.parse(input ?? {});
	const body = await tripadvisorGet<unknown>(
		ctx.key,
		'/api/v1/location/nearby_search',
		{
			latLong: parsed.latLong,
			language: parsed.language ?? 'en',
		},
	);
	const locations = listLocations(body);
	for (const location of locations)
		await save(ctx.db?.locations, location, 'location');
	await logEventFromContext(
		ctx,
		'tripadvisorcontentapi.locations.nearby',
		{ count: locations.length },
		'completed',
	);
	return { locations };
};

export const getLocation: CorsairEndpoint<
	TripadvisorContentApiContext,
	LocationInput,
	LocationResponse
> = async (ctx, input) => {
	const parsed = LocationInputSchema.parse(input ?? {});
	const body = await tripadvisorGet<unknown>(
		ctx.key,
		`/api/v1/location/${parsed.locationId}/details`,
		{ language: parsed.language ?? 'en' },
	);
	const location = locationOf(asRecord(body));
	if (!location.success)
		throw new Error('Tripadvisor location response was missing an id');
	await save(ctx.db?.locations, location.data, 'location');
	await logEventFromContext(
		ctx,
		'tripadvisorcontentapi.locations.get',
		{ count: 1 },
		'completed',
	);
	return { location: location.data };
};

export const listPhotos: CorsairEndpoint<
	TripadvisorContentApiContext,
	LocationInput,
	PhotoListResponse
> = async (ctx, input) => {
	const parsed = LocationInputSchema.parse(input ?? {});
	const body = await tripadvisorGet<unknown>(
		ctx.key,
		`/api/v1/location/${parsed.locationId}/photos`,
		{ language: parsed.language ?? 'en' },
	);
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Tripadvisor photos response was not a list');
	const photos = data.flatMap((item) => {
		const row = asRecord(item);
		const images = asRecord(row?.images);
		const large = asRecord(images?.large) ?? asRecord(images?.original);
		const photo = TripadvisorPhotoEntity.safeParse({
			id: idText(row?.id),
			width: numeric(large?.width),
			height: numeric(large?.height),
		});
		return photo.success ? [photo.data] : [];
	});
	for (const photo of photos) await save(ctx.db?.photos, photo, 'photo');
	await logEventFromContext(
		ctx,
		'tripadvisorcontentapi.photos.list',
		{ count: photos.length },
		'completed',
	);
	return { photos };
};

export const listReviews: CorsairEndpoint<
	TripadvisorContentApiContext,
	LocationInput,
	ReviewListResponse
> = async (ctx, input) => {
	const parsed = LocationInputSchema.parse(input ?? {});
	const body = await tripadvisorGet<unknown>(
		ctx.key,
		`/api/v1/location/${parsed.locationId}/reviews`,
		{ language: parsed.language ?? 'en' },
	);
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Tripadvisor reviews response was not a list');
	const reviews = data.flatMap((item) => {
		const row = asRecord(item);
		const review = TripadvisorReviewEntity.safeParse({
			id: idText(row?.id),
			rating: numeric(row?.rating),
			publishedDate: text(row?.published_date),
		});
		return review.success ? [review.data] : [];
	});
	for (const review of reviews) await save(ctx.db?.reviews, review, 'review');
	await logEventFromContext(
		ctx,
		'tripadvisorcontentapi.reviews.list',
		{ count: reviews.length },
		'completed',
	);
	return { reviews };
};
