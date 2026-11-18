import { asRecord } from 'corsair/core';
import type { NiftyimagesEndpoints } from '..';
import { segment } from '../client';
import { asList, call } from './call';
import {
	NiftyimagesEndpointInputSchemas as Inputs,
	NiftyimagesEndpointOutputSchemas as Outputs,
} from './types';

/**
 * NiftyImages answers these with a 200 and no body. Any other status already
 * threw, so a 2xx is the provider's own success signal.
 */
const done = () => ({ success: true as const });

// ── Data Store ────────────────────────────────────────────────────────────

/** Lists the Data Store's fields, their types and which are unique. */
export const storeFields: NiftyimagesEndpoints['storeFields'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'store.fields',
			input: Inputs.storeFields,
			output: Outputs.storeFields,
		},
		input,
		() => ({ method: 'GET', path: '/Store' }),
		{
			shape: (raw) => ({ fields: asList(raw, 'Data Store field') }),
			log: (_, result) => ({ count: result.fields.length }),
		},
	);

/**
 * Adds a record, or updates the one whose unique fields match. Keys that are
 * not Data Store fields are ignored by NiftyImages.
 */
export const storeAddRecord: NiftyimagesEndpoints['storeAddRecord'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'store.addRecord',
			input: Inputs.storeAddRecord,
			output: Outputs.storeAddRecord,
		},
		input,
		({ record }) => ({
			method: 'POST',
			path: '/Store/AddRecord',
			body: record,
		}),
		{
			shape: (raw) => ({ record: raw }),
			// A record holds subscriber data, so only the field count is logged.
			log: (_, result) => ({ fields: Object.keys(result.record).length }),
		},
	);

/** Deletes the record with this id (the value of its unique field). */
export const storeDeleteById: NiftyimagesEndpoints['storeDeleteById'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'store.deleteById',
			input: Inputs.storeDeleteById,
			output: Outputs.storeDeleteById,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: '/Store/DeleteID',
			query: { id: String(id) },
		}),
		{ shape: done },
	);

/**
 * Deletes the record whose unique fields match the ones given. Use it when the
 * store has more than one unique field.
 */
export const storeDeleteRecord: NiftyimagesEndpoints['storeDeleteRecord'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'store.deleteRecord',
			input: Inputs.storeDeleteRecord,
			output: Outputs.storeDeleteRecord,
		},
		input,
		({ record }) => ({
			method: 'DELETE',
			path: '/Store/DeleteRecord',
			body: record,
		}),
		{ shape: done },
	);

// ── Timers ────────────────────────────────────────────────────────────────

/** Moves a countdown timer's target date. */
export const timerUpdate: NiftyimagesEndpoints['timerUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.updateTargetDate',
			input: Inputs.timerUpdate,
			output: Outputs.timerUpdate,
		},
		input,
		(body) => ({ method: 'PUT', path: '/Timer/Update', body }),
		{
			log: (_, result) => ({
				target: result.UpdatedTargetUtc ?? undefined,
			}),
		},
	);

// ── Maps ──────────────────────────────────────────────────────────────────

export const mapsList: NiftyimagesEndpoints['mapsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'maps.list', input: Inputs.mapsList, output: Outputs.mapsList },
		input,
		() => ({ method: 'GET', path: '/Maps' }),
		{
			shape: (raw) => ({ images: asList(raw, 'map') }),
			log: (_, result) => ({ count: result.images.length }),
		},
	);

/** A map's location counts (searchable, not, queued), opens and clicks. */
export const mapsGet: NiftyimagesEndpoints['mapsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'maps.get', input: Inputs.mapsGet, output: Outputs.mapsGet },
		input,
		({ url }) => ({ method: 'GET', path: '/Maps/Details', query: { url } }),
		{
			log: (_, result) => ({
				locations: result.LocationsGood ?? undefined,
			}),
		},
	);

/** Finds locations in a map by address, location id, NiftyID or lat/lng. */
export const mapsSearch: NiftyimagesEndpoints['mapsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maps.searchLocations',
			input: Inputs.mapsSearch,
			output: Outputs.mapsSearch,
		},
		input,
		({ url, address, locationID, lat, lng, niftyID }) => ({
			method: 'GET',
			path: '/Maps/GetLocations',
			query: { url, address, locationID, lat, lng, niftyID },
		}),
		{
			shape: (raw) => ({ locations: asList(raw, 'location') }),
			log: (_, result) => ({ count: result.locations.length }),
		},
	);

/** Adds a location; NiftyImages geocodes it in the background. */
export const mapsAddLocation: NiftyimagesEndpoints['mapsAddLocation'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maps.addLocation',
			input: Inputs.mapsAddLocation,
			output: Outputs.mapsAddLocation,
		},
		input,
		({ url, ...body }) => ({
			method: 'POST',
			path: '/Maps/AddLocation',
			query: { url },
			body,
		}),
	);

/** Updates a location found by NiftyID or LocationID. */
export const mapsUpdateLocation: NiftyimagesEndpoints['mapsUpdateLocation'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maps.updateLocation',
			input: Inputs.mapsUpdateLocation,
			output: Outputs.mapsUpdateLocation,
		},
		input,
		({ url, ...body }) => ({
			method: 'PUT',
			path: '/Maps/UpdateLocation',
			query: { url },
			body,
		}),
	);

export const mapsDeleteLocation: NiftyimagesEndpoints['mapsDeleteLocation'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maps.deleteLocation',
			input: Inputs.mapsDeleteLocation,
			output: Outputs.mapsDeleteLocation,
		},
		input,
		({ url, locationID, niftyID }) => ({
			method: 'DELETE',
			path: '/Maps/DeleteLocation',
			query: { url, locationID, niftyID },
		}),
		{ shape: done },
	);

// ── Bee Plugin and widget users ───────────────────────────────────────────

export const beeUsers: NiftyimagesEndpoints['beeUsers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'beePlugin.users',
			input: Inputs.beeUsers,
			output: Outputs.beeUsers,
		},
		input,
		({ pluginKey, startDate, endDate }) => ({
			method: 'GET',
			path: `/BeePlugin/${segment(pluginKey)}/Users`,
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ users: asList(raw, 'Bee Plugin user') }),
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const beeUserImages: NiftyimagesEndpoints['beeUserImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'beePlugin.userImages',
			input: Inputs.beeUserImages,
			output: Outputs.beeUserImages,
		},
		input,
		({ pluginKey, user, startDate, endDate }) => ({
			method: 'GET',
			path: `/BeePlugin/${segment(pluginKey)}/Users/${segment(user)}`,
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ images: asList(raw, 'Bee Plugin image') }),
			log: (_, result) => ({ count: result.images.length }),
		},
	);

/** Suspends or reinstates a Bee Plugin user; the body is a bare boolean. */
export const beeSuspendUser: NiftyimagesEndpoints['beeSuspendUser'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'beePlugin.suspendUser',
			input: Inputs.beeSuspendUser,
			output: Outputs.beeSuspendUser,
		},
		input,
		({ pluginKey, user, suspend }) => ({
			method: 'PUT',
			path: `/BeePlugin/${segment(pluginKey)}/Users/${segment(user)}`,
			body: suspend,
		}),
		{ shape: done, log: ({ suspend }) => ({ suspend }) },
	);

/** Suspends or reinstates a widget user; the body is a bare boolean. */
export const widgetSuspendUser: NiftyimagesEndpoints['widgetSuspendUser'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'widgets.suspendUser',
			input: Inputs.widgetSuspendUser,
			output: Outputs.widgetSuspendUser,
		},
		input,
		({ widgetKey, user, suspend }) => ({
			method: 'PUT',
			path: `/Widgets/${segment(widgetKey)}/Users/${segment(user)}`,
			body: suspend,
		}),
		{ shape: done, log: ({ widgetKey, suspend }) => ({ widgetKey, suspend }) },
	);

// ── Images ────────────────────────────────────────────────────────────────

/** Pages through every personalized image and timer, newest first. */
export const imagesList: NiftyimagesEndpoints['imagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.list',
			input: Inputs.imagesList,
			output: Outputs.imagesList,
		},
		input,
		({ pageSize, pageNumber }) => ({
			method: 'GET',
			path: '/Images',
			query: { pageSize, pageNumber },
		}),
		{
			shape: (raw) => ({ images: asList(raw, 'image') }),
			log: (_, result) => ({ count: result.images.length }),
		},
	);

/** Opens per image over a window (30 days by default). */
export const imagesStats: NiftyimagesEndpoints['imagesStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.stats',
			input: Inputs.imagesStats,
			output: Outputs.imagesStats,
		},
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			path: '/Images/AllStats',
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ images: asList(raw, 'image') }),
			log: (_, result) => ({ count: result.images.length }),
		},
	);

export const imagesGet: NiftyimagesEndpoints['imagesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'images.get', input: Inputs.imagesGet, output: Outputs.imagesGet },
		input,
		({ url }) => ({ method: 'GET', path: '/Image', query: { url } }),
		{
			shape: (raw) => {
				if (!asRecord(raw)) throw new Error('Expected a NiftyImages image');
				return raw;
			},
		},
	);

/** Deletes a personalized image or timer; emails that embed it stop rendering. */
export const imagesDelete: NiftyimagesEndpoints['imagesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'images.delete',
			input: Inputs.imagesDelete,
			output: Outputs.imagesDelete,
		},
		input,
		({ url }) => ({ method: 'DELETE', path: '/Image', query: { url } }),
		{ shape: done },
	);

// ── Photoshop images ──────────────────────────────────────────────────────

export const psdGet: NiftyimagesEndpoints['psdGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'psd.get', input: Inputs.psdGet, output: Outputs.psdGet },
		input,
		({ url }) => ({ method: 'GET', path: '/Psd', query: { url } }),
		{ log: (_, result) => ({ layers: result.Layers?.length ?? 0 }) },
	);

/** Changes a Photoshop image's name, text variables or layers by layer name. */
export const psdUpdate: NiftyimagesEndpoints['psdUpdate'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'psd.update', input: Inputs.psdUpdate, output: Outputs.psdUpdate },
		input,
		({ url, ...body }) => ({
			method: 'PUT',
			path: '/Psd',
			query: { url },
			body,
		}),
		{ log: (_, result) => ({ layers: result.Layers?.length ?? 0 }) },
	);
