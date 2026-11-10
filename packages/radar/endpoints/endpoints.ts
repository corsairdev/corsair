import { asRecord } from 'corsair/core';
import type { RadarEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { deletedShape, listShape, singleShape } from './shape';
import {
	RadarEndpointInputSchemas as Inputs,
	RadarEndpointOutputSchemas as Outputs,
} from './types';

export const geocodeForward: RadarEndpoints['geocodeForward'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocode.forward',
			input: Inputs.geocodeForward,
			output: Outputs.geocodeForward,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/geocode/forward',
			replayable: true,
			query: queryOf({
				query: parsed.query,
				// These are comma-separated lists on the wire.
				layers: parsed.layers?.join(','),
				country: parsed.country?.join(','),
				lang: parsed.lang,
			}),
		}),
		{
			shape: (raw) => ({ addresses: asRecord(raw)?.addresses }),
			log: (_, result) => ({ count: result.addresses.length }),
		},
	);

export const geocodeReverse: RadarEndpoints['geocodeReverse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocode.reverse',
			input: Inputs.geocodeReverse,
			output: Outputs.geocodeReverse,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/geocode/reverse',
			replayable: true,
			query: queryOf({
				coordinates: parsed.coordinates,
				layers: parsed.layers?.join(','),
			}),
		}),
		{
			shape: (raw) => ({ addresses: asRecord(raw)?.addresses }),
			log: (_, result) => ({ count: result.addresses.length }),
		},
	);

export const searchPlaces: RadarEndpoints['searchPlaces'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'search.places',
			input: Inputs.searchPlaces,
			output: Outputs.searchPlaces,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/search/places',
			replayable: true,
			query: queryOf({
				near: parsed.near,
				query: parsed.query,
				chains: parsed.chains?.join(','),
				categories: parsed.categories?.join(','),
				groups: parsed.groups?.join(','),
				limit: parsed.limit,
				country: parsed.country?.join(','),
				lang: parsed.lang,
			}),
		}),
		{
			shape: (raw) => ({ places: asRecord(raw)?.places }),
			log: (_, result) => ({ count: result.places.length }),
		},
	);

export const searchGeofences: RadarEndpoints['searchGeofences'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'search.geofences',
			input: Inputs.searchGeofences,
			output: Outputs.searchGeofences,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/search/geofences',
			replayable: true,
			query: queryOf({
				near: parsed.near,
				radius: parsed.radius,
				tags: parsed.tags?.join(','),
				externalIds: parsed.externalIds?.join(','),
				limit: parsed.limit,
			}),
		}),
		{
			shape: (raw) => ({ geofences: asRecord(raw)?.geofences }),
			log: (_, result) => ({ count: result.geofences.length }),
		},
	);

export const usersList: RadarEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/users',
			replayable: true,
			query: queryOf({
				limit: parsed.limit,
				updatedBefore: parsed.updated_before,
				updatedAfter: parsed.updated_after,
			}),
		}),
		{
			shape: listShape('users'),
			log: (_, result) => ({
				count: result.users.length,
				hasMore: result.has_more,
			}),
		},
	);

export const usersGet: RadarEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/users/${segment(parsed.user_id)}`,
			replayable: true,
		}),
		{
			// Radar answers `{ meta, user }`, so the record is already named.
			shape: singleShape('user'),
			log: (_, result) => ({ userId: result.user._id ?? '' }),
		},
	);

export const geofencesList: RadarEndpoints['geofencesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geofences.list',
			input: Inputs.geofencesList,
			output: Outputs.geofencesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/geofences',
			replayable: true,
			query: queryOf({
				limit: parsed.limit,
				updatedBefore: parsed.updated_before,
				updatedAfter: parsed.updated_after,
				tag: parsed.tag,
				externalId: parsed.external_id,
			}),
		}),
		{
			shape: listShape('geofences'),
			log: (_, result) => ({
				count: result.geofences.length,
				hasMore: result.has_more,
			}),
		},
	);

export const geofencesGet: RadarEndpoints['geofencesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geofences.get',
			input: Inputs.geofencesGet,
			output: Outputs.geofencesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/geofences/${segment(parsed.geofence_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('geofence'),
			log: (_, result) => ({ geofenceId: result.geofence._id ?? '' }),
		},
	);

/**
 * A circle or isochrone takes a centre and a radius; a polygon takes a closed
 * ring. The input schema has already enforced the pairing, so the body only
 * renames each form to the wire spelling that Radar expects.
 */
export const geofencesUpsert: RadarEndpoints['geofencesUpsert'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'geofences.upsert',
			input: Inputs.geofencesUpsert,
			output: Outputs.geofencesUpsert,
		},
		input,
		(parsed) => {
			// An id updates by `_id`; otherwise the tag and external id make up
			// the path, which is what makes this an upsert.
			const path = parsed.geofence_id
				? `/geofences/${segment(parsed.geofence_id)}`
				: `/geofences/${segment(parsed.tag)}/${segment(parsed.external_id)}`;
			const coordinates =
				parsed.type === 'polygon' ? parsed.ring : parsed.center;
			return {
				method: 'PUT',
				path,
				replayable: false,
				body: queryOf({
					description: parsed.description,
					type: parsed.type,
					coordinates,
					address: parsed.address,
					radius: parsed.radius,
					metadata: parsed.metadata,
				}),
			};
		},
		{
			shape: singleShape('geofence'),
			log: (_, result) => ({ geofenceId: result.geofence._id ?? '' }),
		},
	);

export const geofencesDelete: RadarEndpoints['geofencesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'geofences.delete',
			input: Inputs.geofencesDelete,
			output: Outputs.geofencesDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/geofences/${segment(parsed.geofence_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('geofence_id'),
			log: (parsed) => ({ geofenceId: parsed.geofence_id }),
		},
	);

export const tripsList: RadarEndpoints['tripsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trips.list',
			input: Inputs.tripsList,
			output: Outputs.tripsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/trips',
			replayable: true,
			query: queryOf({
				limit: parsed.limit,
				status: parsed.status?.join(','),
				userId: parsed.user_id,
				externalId: parsed.external_id?.join(','),
				destinationGeofenceTag: parsed.destination_geofence_tag,
				destinationGeofenceExternalId: parsed.destination_geofence_external_id,
				includeLocations: parsed.include_locations,
				createdAfter: parsed.created_after,
				createdBefore: parsed.created_before,
				updatedAfter: parsed.updated_after,
				updatedBefore: parsed.updated_before,
				sortBy: parsed.sort_by,
				delayed: parsed.delayed,
			}),
		}),
		{
			shape: listShape('trips'),
			log: (_, result) => ({
				count: result.trips.length,
				hasMore: result.has_more,
			}),
		},
	);

export const tripsGet: RadarEndpoints['tripsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trips.get',
			input: Inputs.tripsGet,
			output: Outputs.tripsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/trips/${segment(parsed.trip_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('trip'),
			log: (_, result) => ({
				tripId: result.trip._id ?? '',
				status: result.trip.status ?? undefined,
			}),
		},
	);

export const tripsCreate: RadarEndpoints['tripsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trips.create',
			input: Inputs.tripsCreate,
			output: Outputs.tripsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/trips',
			replayable: false,
			body: queryOf({
				externalId: parsed.external_id,
				mode: parsed.mode,
				userId: parsed.user_id,
				destinationGeofenceTag: parsed.destination_geofence_tag,
				destinationGeofenceExternalId: parsed.destination_geofence_external_id,
				approachingThreshold: parsed.approaching_threshold,
				scheduledArrivalAt: parsed.scheduled_arrival_at,
			}),
		}),
		{
			shape: singleShape('trip'),
			log: (_, result) => ({ tripId: result.trip._id ?? '' }),
		},
	);

export const tripsUpdate: RadarEndpoints['tripsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trips.update',
			input: Inputs.tripsUpdate,
			output: Outputs.tripsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/trips/${segment(parsed.trip_id)}`,
			replayable: false,
			body: queryOf({
				status: parsed.status,
				mode: parsed.mode,
				destinationGeofenceTag: parsed.destination_geofence_tag,
				destinationGeofenceExternalId: parsed.destination_geofence_external_id,
				approachingThreshold: parsed.approaching_threshold,
				scheduledArrivalAt: parsed.scheduled_arrival_at,
			}),
		}),
		{
			shape: singleShape('trip'),
			log: (parsed, result) => ({
				tripId: result.trip._id ?? parsed.trip_id,
				status: result.trip.status ?? undefined,
			}),
		},
	);

export const track: RadarEndpoints['track'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'track',
			input: Inputs.track,
			output: Outputs.track,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/track',
			// `track` creates or updates a user, so a replay could double-write.
			replayable: false,
			body: queryOf({
				deviceId: parsed.device_id,
				userId: parsed.user_id,
				latitude: parsed.latitude,
				longitude: parsed.longitude,
				accuracy: parsed.accuracy,
				foreground: parsed.foreground,
				stopped: parsed.stopped,
				description: parsed.description,
				deviceType: parsed.device_type,
				deviceOS: parsed.device_os,
				deviceMake: parsed.device_make,
				deviceModel: parsed.device_model,
				altitude: parsed.altitude,
				verticalAccuracy: parsed.vertical_accuracy,
				updatedAt: parsed.updated_at,
				replayed: parsed.replayed,
				metadata: parsed.metadata,
			}),
		}),
		{
			shape: (raw) => {
				const record = asRecord(raw);
				return {
					track: {
						user: record?.user,
						// Radar names the generated events array at the top level.
						events: record?.events,
					},
				};
			},
			// A position is personal data, so only the ids and counts are logged.
			log: (_, result) => ({
				userId: result.track.user?._id ?? '',
				events: result.track.events?.length ?? 0,
			}),
		},
	);

export const eventsConversion: RadarEndpoints['eventsConversion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.conversion',
			input: Inputs.eventsConversion,
			output: Outputs.eventsConversion,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/events',
			replayable: false,
			body: queryOf({
				name: parsed.name,
				userId: parsed.user_id,
				deviceId: parsed.device_id,
				installId: parsed.install_id,
				revenue: parsed.revenue,
				createdAt: parsed.created_at,
				metadata: parsed.metadata,
			}),
		}),
		{
			shape: singleShape('event'),
			log: (_, result) => ({
				eventId: result.event._id ?? '',
				name: result.event.name ?? '',
			}),
		},
	);
