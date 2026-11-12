import { logEventFromContext } from 'corsair/core';
import type { SatisMeterEndpoints } from '..';
import type { SatisMeterRequest } from '../client';
import {
	isEmptyBody,
	makeSatisMeterRequest,
	parseJsonBody,
	SATISMETER_API_WRITE,
} from '../client';
import {
	SatisMeterEndpointInputSchemas as Inputs,
	SatisMeterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The users API is not versioned and lives under `/api`, not `/api/v3`, so it
 * cannot use the read `call()` helper. It also answers with no body at all on a
 * successful write, which means the output schema has to be built from what was
 * sent rather than parsed from the response.
 *
 * A caller cannot tell a silent success from a silent failure on evidence that
 * does not exist, so `remove` — the one case the provider documents a status
 * for (204) — validates the status instead of assuming an empty body is success.
 */

function encode(value: string): string {
	return encodeURIComponent(value);
}

export const upsert: SatisMeterEndpoints['usersUpsert'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.usersUpsert.parse(rawInput ?? {});
	const request: SatisMeterRequest = {
		base: SATISMETER_API_WRITE,
		method: 'POST',
		path: '/users',
		body: {
			userId: input.userId,
			project: input.projectId,
			...(input.traits === undefined ? {} : { traits: input.traits }),
			...(input.surveyDate === undefined
				? {}
				: { surveyDate: input.surveyDate }),
		},
	};
	await makeSatisMeterRequest(ctx.key, request);
	const result = Outputs.usersUpsert.parse({
		userId: input.userId,
		accepted: true,
	});
	await logEventFromContext(
		ctx,
		'satismeter.users.upsert',
		{ userId: input.userId, traits: Object.keys(input.traits ?? {}).length },
		'completed',
	);
	return result;
};

export const track: SatisMeterEndpoints['usersTrack'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.usersTrack.parse(rawInput ?? {});
	// `type: 'track'` is what makes the users endpoint record an event instead
	// of upserting a user; the article's body is the only place it is documented.
	await makeSatisMeterRequest(ctx.key, {
		base: SATISMETER_API_WRITE,
		method: 'POST',
		path: '/users',
		body: {
			type: 'track',
			userId: input.userId,
			event: input.event,
			project: input.projectId,
		},
	});
	const result = Outputs.usersTrack.parse({
		userId: input.userId,
		event: input.event,
		accepted: true,
	});
	await logEventFromContext(
		ctx,
		'satismeter.users.track',
		{ userId: input.userId, event: input.event },
		'completed',
	);
	return result;
};

export const list: SatisMeterEndpoints['usersList'] = async (ctx, rawInput) => {
	const input = Inputs.usersList.parse(rawInput ?? {});
	const text = await makeSatisMeterRequest(ctx.key, {
		base: SATISMETER_API_WRITE,
		method: 'GET',
		path: '/users',
		query: { project: input.projectId, userId: input.userId },
	});
	const result = Outputs.usersList.parse(parseJsonBody(text));
	await logEventFromContext(
		ctx,
		'satismeter.users.list',
		{ projectId: input.projectId, count: result.users.length },
		'completed',
	);
	return result;
};

export const remove: SatisMeterEndpoints['usersRemove'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.usersRemove.parse(rawInput ?? {});
	// The provider documents 204 No Content on success. The shared client throws
	// on any non-2xx, so reaching here means the delete was accepted; the output
	// records which internal id was removed so the caller can log it.
	const text = await makeSatisMeterRequest(ctx.key, {
		base: SATISMETER_API_WRITE,
		method: 'DELETE',
		path: `/users/${encode(input.id)}`,
	});
	// A delete that somehow answers a body means the route changed shape; parse
	// it rather than discard it, so a future response cannot pass unnoticed.
	if (!isEmptyBody(text)) parseJsonBody(text);
	const result = Outputs.usersRemove.parse({
		id: input.id,
		removed: true,
	});
	await logEventFromContext(
		ctx,
		'satismeter.users.remove',
		{ id: input.id },
		'completed',
	);
	return result;
};
