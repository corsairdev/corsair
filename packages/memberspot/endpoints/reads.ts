import type { MemberSpotContext, MemberSpotEndpoints } from '..';
import { bodyOf, call } from './call';
import {
	MemberSpotEndpointInputSchemas as Inputs,
	MemberSpotEndpointOutputSchemas as Outputs,
} from './types';

// ── auth ──────────────────────────────────────────────────────────────────

/** Returns the school the key belongs to, which is the cheapest key check. */
export const authCheck: MemberSpotEndpoints['authCheck'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'auth.check',
			input: Inputs.authCheck,
			output: Outputs.authCheck,
		},
		input,
		() => ({ action: '/api-auth', replaySafe: true }),
		{ log: (_, result) => ({ schoolId: result.schoolId ?? undefined }) },
	);

// ── catalog reads ─────────────────────────────────────────────────────────

export const offersList: MemberSpotEndpoints['offersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.list',
			input: Inputs.offersList,
			output: Outputs.offersList,
		},
		input,
		() => ({ action: '/v1/offers', replaySafe: true }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const coursesList: MemberSpotEndpoints['coursesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'courses.list',
			input: Inputs.coursesList,
			output: Outputs.coursesList,
		},
		input,
		() => ({ action: '/v1/courses', replaySafe: true }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const examsList: MemberSpotEndpoints['examsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exams.list',
			input: Inputs.examsList,
			output: Outputs.examsList,
		},
		input,
		() => ({ action: '/v1/exams', replaySafe: true }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const customPropertiesList: MemberSpotEndpoints['customPropertiesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'customProperties.list',
				input: Inputs.customPropertiesList,
				output: Outputs.customPropertiesList,
			},
			input,
			() => ({ action: '/v1/custom-user-properties/list', replaySafe: true }),
			{ log: (_, result) => ({ count: result.length }) },
		);

// ── users: reads ──────────────────────────────────────────────────────────

export const usersList: MemberSpotEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			action: '/v1/users/list',
			query: {
				lastLoadedId: parsed.lastLoadedId,
				pageLength: parsed.pageLength,
				offerId: parsed.offerId,
				courseId: parsed.courseId,
				active: parsed.active,
			},
			replaySafe: true,
		}),
		{
			// The cursor is called `lastLoadedId` on the way in and `nextPage` on the
			// way out, so the mapping is worth stating once.
			log: (_, result) => ({
				count: result.data.length,
				hasMore: result.nextPage !== null && result.nextPage !== undefined,
			}),
		},
	);

export const usersFindByEmail: MemberSpotEndpoints['usersFindByEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.findByEmail',
			input: Inputs.usersFindByEmail,
			output: Outputs.usersFindByEmail,
		},
		input,
		(parsed) => ({
			action: `/v1/users/find-by-mail/${encodeURIComponent(parsed.email)}`,
			replaySafe: true,
		}),
		{ log: (_, result) => ({ uid: result.uid }) },
	);

export const usersFindByUid: MemberSpotEndpoints['usersFindByUid'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.findByUid',
			input: Inputs.usersFindByUid,
			output: Outputs.usersFindByUid,
		},
		input,
		(parsed) => ({
			action: `/v1/users/find-by-uid/${encodeURIComponent(parsed.uid)}`,
			replaySafe: true,
		}),
		{ log: (_, result) => ({ uid: result.uid }) },
	);

export const usersOffers: MemberSpotEndpoints['usersOffers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.offers',
			input: Inputs.usersOffers,
			output: Outputs.usersOffers,
		},
		input,
		(parsed) => ({
			action: `/v1/users/offers/${encodeURIComponent(parsed.uid)}`,
			replaySafe: true,
		}),
		{ log: (_, result) => ({ offers: result.offers.length }) },
	);

export const usersLoginToken: MemberSpotEndpoints['usersLoginToken'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.loginToken',
			input: Inputs.usersLoginToken,
			output: Outputs.usersLoginToken,
		},
		input,
		(parsed) => ({
			action: `/v1/users/login-token/${encodeURIComponent(parsed.uid)}`,
			// A GET that mints a token. Replaying it only re-mints, so it is safe,
			// but the token itself must never be logged.
			replaySafe: true,
		}),
		{ log: () => ({ minted: true }) },
	);

export const usersCourseProgress: MemberSpotEndpoints['usersCourseProgress'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.courseProgress',
			input: Inputs.usersCourseProgress,
			output: Outputs.usersCourseProgress,
		},
		input,
		(parsed) => ({
			action: `/v1/users/course-progress/list/${encodeURIComponent(parsed.email)}`,
			query: {
				lastLoadedCourseId: parsed.lastLoadedId,
				pageLength: parsed.pageLength,
			},
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const usersCourseProgressByUid: MemberSpotEndpoints['usersCourseProgressByUid'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.courseProgressByUid',
				input: Inputs.usersCourseProgressByUid,
				output: Outputs.usersCourseProgressByUid,
			},
			input,
			(parsed) => ({
				action: `/v1/users/course-progress/list-by-uid/${encodeURIComponent(parsed.uid)}`,
				query: {
					lastLoadedCourseId: parsed.lastLoadedId,
					pageLength: parsed.pageLength,
				},
				replaySafe: true,
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const usersCourseProgressDetail: MemberSpotEndpoints['usersCourseProgressDetail'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.courseProgressDetail',
				input: Inputs.usersCourseProgressDetail,
				output: Outputs.usersCourseProgressDetail,
			},
			input,
			(parsed) => ({
				action: `/v1/users/course-progress/${encodeURIComponent(parsed.courseId)}/${encodeURIComponent(parsed.email)}`,
				replaySafe: true,
			}),
			{ log: (_, result) => ({ courseId: result.courseId ?? undefined }) },
		);

export const usersCourseProgressDetailByUid: MemberSpotEndpoints['usersCourseProgressDetailByUid'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.courseProgressDetailByUid',
				input: Inputs.usersCourseProgressDetailByUid,
				output: Outputs.usersCourseProgressDetailByUid,
			},
			input,
			(parsed) => ({
				action: `/v1/users/course-progress/${encodeURIComponent(parsed.courseId)}/by-uid/${encodeURIComponent(parsed.uid)}`,
				replaySafe: true,
			}),
			{ log: (_, result) => ({ courseId: result.courseId ?? undefined }) },
		);

// ── users: writes ─────────────────────────────────────────────────────────

export const usersGrantOffer: MemberSpotEndpoints['usersGrantOffer'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.grantOffer',
			input: Inputs.usersGrantOffer,
			output: Outputs.usersGrantOffer,
		},
		input,
		(parsed) => ({
			action: '/v1/users/grant-user-offer-by-mail',
			method: 'POST',
			body: bodyOf({
				email: parsed.email,
				firstname: parsed.firstname,
				name: parsed.name,
				grantOffer: parsed.grantOffer,
				orderId: parsed.orderId,
			}),
			// The provider upserts by email and reports `isNew`, so a replay cannot
			// create a second user.
			replaySafe: true,
		}),
		{ log: (_, result) => ({ uid: result.uid, isNew: result.isNew }) },
	);

export const usersGrantOfferByUid: MemberSpotEndpoints['usersGrantOfferByUid'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.grantOfferByUid',
				input: Inputs.usersGrantOfferByUid,
				output: Outputs.usersGrantOfferByUid,
			},
			input,
			(parsed) => ({
				action: '/v1/users/grant-user-offer-by-uid',
				method: 'POST',
				// GrantOfferByUidDto names the offer `grantOffer`, as the by-mail route
				// does; the input keeps `offerId` to match the other by-uid writes.
				body: bodyOf({
					uid: parsed.uid,
					grantOffer: parsed.offerId,
					orderId: parsed.orderId,
				}),
				replaySafe: true,
			}),
			{ log: (_, result) => ({ uid: result.uid }) },
		);

/** set-offer-state and its by-uid twin share a body shape. */
function setOfferState(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		// Either variant: both are objects with offerId and an active flag.
		schema:
			| typeof Inputs.usersSetOfferState
			| typeof Inputs.usersSetOfferStateByUid;
		output: typeof Outputs.usersSetOfferState;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.schema,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'POST',
			body: bodyOf({
				email: 'email' in parsed ? parsed.email : undefined,
				uid: 'uid' in parsed ? parsed.uid : undefined,
				offerId: parsed.offerId,
				// null means delete, which MemberSpot reads from a missing field.
				active: parsed.active ?? undefined,
			}),
			// Setting an absolute state is idempotent by definition.
			replaySafe: true,
		}),
		{ log: (parsed) => ({ offerId: parsed.offerId }) },
	);
}

export const usersSetOfferState: MemberSpotEndpoints['usersSetOfferState'] = (
	ctx,
	input,
) =>
	setOfferState(ctx, input, {
		event: 'users.setOfferState',
		action: '/v1/users/set-offer-state',
		schema: Inputs.usersSetOfferState,
		output: Outputs.usersSetOfferState,
	});

export const usersSetOfferStateByUid: MemberSpotEndpoints['usersSetOfferStateByUid'] =
	(ctx, input) =>
		setOfferState(ctx, input, {
			event: 'users.setOfferStateByUid',
			action: '/v1/users/set-offer-state-by-uid',
			schema: Inputs.usersSetOfferStateByUid,
			output: Outputs.usersSetOfferStateByUid,
		});

function setOrderState(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		schema:
			| typeof Inputs.usersSetOrderState
			| typeof Inputs.usersSetOrderStateByUid
			| typeof Inputs.usersSetOrderStateByOrderId;
		output: typeof Outputs.usersSetOrderState;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.schema,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'POST',
			body: bodyOf({
				email: 'email' in parsed ? parsed.email : undefined,
				uid: 'uid' in parsed ? parsed.uid : undefined,
				orderId: parsed.orderId,
				// null means delete, which MemberSpot reads from a missing field.
				active: parsed.active ?? undefined,
			}),
			replaySafe: true,
		}),
		{ log: (parsed) => ({ orderId: parsed.orderId }) },
	);
}

export const usersSetOrderState: MemberSpotEndpoints['usersSetOrderState'] = (
	ctx,
	input,
) =>
	setOrderState(ctx, input, {
		event: 'users.setOrderState',
		action: '/v1/users/set-order-state',
		schema: Inputs.usersSetOrderState,
		output: Outputs.usersSetOrderState,
	});

export const usersSetOrderStateByUid: MemberSpotEndpoints['usersSetOrderStateByUid'] =
	(ctx, input) =>
		setOrderState(ctx, input, {
			event: 'users.setOrderStateByUid',
			action: '/v1/users/set-order-state-by-uid',
			schema: Inputs.usersSetOrderStateByUid,
			output: Outputs.usersSetOrderStateByUid,
		});

export const usersSetOrderStateByOrderId: MemberSpotEndpoints['usersSetOrderStateByOrderId'] =
	(ctx, input) =>
		setOrderState(ctx, input, {
			event: 'users.setOrderStateByOrderId',
			action: '/v1/users/set-order-state-by-order-id',
			schema: Inputs.usersSetOrderStateByOrderId,
			output: Outputs.usersSetOrderStateByOrderId,
		});

function setOfferExpires(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		output: typeof Outputs.usersSetOfferExpires;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: Inputs.usersSetOfferExpires,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'PATCH',
			body: bodyOf({
				uid: 'uid' in parsed ? parsed.uid : undefined,
				offerId: parsed.offerId,
				expiresAt: parsed.expiresAt,
			}),
			replaySafe: true,
		}),
		{ log: (parsed) => ({ offerId: parsed.offerId }) },
	);
}

export const usersSetOfferExpires: MemberSpotEndpoints['usersSetOfferExpires'] =
	(ctx, input) =>
		setOfferExpires(ctx, input, {
			event: 'users.setOfferExpires',
			action: '/v1/users/set-offer-expires',
			output: Outputs.usersSetOfferExpires,
		});

export const usersSetCourseStartDate: MemberSpotEndpoints['usersSetCourseStartDate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.setCourseStartDate',
				input: Inputs.usersSetCourseStartDate,
				output: Outputs.usersSetCourseStartDate,
			},
			input,
			(parsed) => ({
				action: '/v1/users/set-course-start-date',
				method: 'PATCH',
				body: bodyOf({
					uid: parsed.uid,
					courseId: parsed.courseId,
					startDate: parsed.startDate,
				}),
				replaySafe: true,
			}),
			{ log: (parsed) => ({ courseId: parsed.courseId }) },
		);

function setCustomProperties(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		schema:
			| typeof Inputs.usersSetCustomProperties
			| typeof Inputs.usersSetCustomPropertiesByUid;
		output: typeof Outputs.usersSetCustomProperties;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.schema,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'POST',
			body: bodyOf({
				email: 'email' in parsed ? parsed.email : undefined,
				uid: 'uid' in parsed ? parsed.uid : undefined,
				// SetCustomPropertyDto takes `properties: [{ id, value }]`.
				properties: Object.entries(parsed.properties).map(([id, value]) => ({
					id,
					value,
				})),
			}),
			// Values are absolute, so writing the same set twice is the same state.
			replaySafe: true,
		}),
		{ log: (parsed) => ({ keys: Object.keys(parsed.properties).length }) },
	);
}

export const usersSetCustomProperties: MemberSpotEndpoints['usersSetCustomProperties'] =
	(ctx, input) =>
		setCustomProperties(ctx, input, {
			event: 'users.setCustomProperties',
			action: '/v1/users/set-custom-user-properties',
			schema: Inputs.usersSetCustomProperties,
			output: Outputs.usersSetCustomProperties,
		});

export const usersSetCustomPropertiesByUid: MemberSpotEndpoints['usersSetCustomPropertiesByUid'] =
	(ctx, input) =>
		setCustomProperties(ctx, input, {
			event: 'users.setCustomPropertiesByUid',
			action: '/v1/users/set-custom-user-properties-by-uid',
			schema: Inputs.usersSetCustomPropertiesByUid,
			output: Outputs.usersSetCustomPropertiesByUid,
		});

function setCustomProperty(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		schema:
			| typeof Inputs.usersSetCustomProperty
			| typeof Inputs.usersSetCustomPropertyByUid;
		output: typeof Outputs.usersSetCustomProperty;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.schema,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'POST',
			body: bodyOf({
				email: 'email' in parsed ? parsed.email : undefined,
				uid: 'uid' in parsed ? parsed.uid : undefined,
				key: parsed.key,
				value: parsed.value,
			}),
			replaySafe: true,
		}),
		{ log: (parsed) => ({ key: parsed.key }) },
	);
}

export const usersSetCustomProperty: MemberSpotEndpoints['usersSetCustomProperty'] =
	(ctx, input) =>
		setCustomProperty(ctx, input, {
			event: 'users.setCustomProperty',
			action: '/v1/users/set-custom-property',
			schema: Inputs.usersSetCustomProperty,
			output: Outputs.usersSetCustomProperty,
		});

export const usersSetCustomPropertyByUid: MemberSpotEndpoints['usersSetCustomPropertyByUid'] =
	(ctx, input) =>
		setCustomProperty(ctx, input, {
			event: 'users.setCustomPropertyByUid',
			action: '/v1/users/set-custom-property-by-uid',
			schema: Inputs.usersSetCustomPropertyByUid,
			output: Outputs.usersSetCustomPropertyByUid,
		});

function deleteUsers(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		byUid: boolean;
		output: typeof Outputs.usersDelete;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.byUid ? Inputs.usersDeleteByUid : Inputs.usersDelete,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			// The spec also exposes a DELETE with a body; POST is used because it is
			// the form every client supports.
			method: 'POST',
			body: operation.byUid
				? bodyOf({ uids: (parsed as { uids: string[] }).uids })
				: bodyOf({ emails: (parsed as { emails: string[] }).emails }),
			// Deleting an already-deleted user is a no-op, so a replay is harmless.
			replaySafe: true,
		}),
		{
			log: () => ({ deleted: true }),
		},
	);
}

export const usersDelete: MemberSpotEndpoints['usersDelete'] = (ctx, input) =>
	deleteUsers(ctx, input, {
		event: 'users.delete',
		action: '/v1/users/delete-users',
		byUid: false,
		output: Outputs.usersDelete,
	});

export const usersDeleteByUid: MemberSpotEndpoints['usersDeleteByUid'] = (
	ctx,
	input,
) =>
	deleteUsers(ctx, input, {
		event: 'users.deleteByUid',
		action: '/v1/users/delete-users-by-uid',
		byUid: true,
		output: Outputs.usersDeleteByUid,
	});

// ── exams ─────────────────────────────────────────────────────────────────

export const examResults: MemberSpotEndpoints['examResults'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exams.results',
			input: Inputs.examResults,
			output: Outputs.examResults,
		},
		input,
		(parsed) => ({
			action: `/v1/exams/${encodeURIComponent(parsed.id)}/results`,
			query: {
				lastLoadedId: parsed.lastLoadedId,
				pageLength: parsed.pageLength,
			},
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

// ── chapters ──────────────────────────────────────────────────────────────

function chapterAccess(
	ctx: MemberSpotContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		event: string;
		action: string;
		byUid: boolean;
		output: typeof Outputs.chaptersEnableAccess;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.byUid
				? Inputs.chaptersEnableAccessByUid
				: Inputs.chaptersEnableAccess,
			output: operation.output,
		},
		input,
		(parsed) => ({
			action: operation.action,
			method: 'POST',
			body: bodyOf({
				email: 'email' in parsed ? parsed.email : undefined,
				uid: 'uid' in parsed ? parsed.uid : undefined,
				courseId: parsed.courseId,
				chapterId: parsed.chapterId,
			}),
			// Enabling access that is already enabled is the same state.
			replaySafe: true,
		}),
		{
			log: (parsed) => ({ chapterId: parsed.chapterId }),
			normalize: chapterAccessReply,
		},
	);
}

/**
 * The spec says both chapter-access routes echo the request DTO, but live
 * (11-11) they answer 201 with the bare body `true`, as text/html. The request
 * layer hands that over as the string 'true' (a boolean, if it ever comes as
 * JSON), so it is mapped onto the `{ success }` shape the other writes return.
 */
// unknown: the raw body, before the output schema has checked it.
function chapterAccessReply(raw: unknown): unknown {
	if (raw === true || raw === 'true') return { success: true };
	if (raw === false || raw === 'false') return { success: false };
	return raw;
}

export const chaptersEnableAccess: MemberSpotEndpoints['chaptersEnableAccess'] =
	(ctx, input) =>
		chapterAccess(ctx, input, {
			event: 'chapters.enableAccess',
			action: '/v1/chapters/chapter-access/enable',
			byUid: false,
			output: Outputs.chaptersEnableAccess,
		});

export const chaptersEnableAccessByUid: MemberSpotEndpoints['chaptersEnableAccessByUid'] =
	(ctx, input) =>
		chapterAccess(ctx, input, {
			event: 'chapters.enableAccessByUid',
			action: '/v1/chapters/chapter-access/enable-by-uid',
			byUid: true,
			output: Outputs.chaptersEnableAccessByUid,
		});
