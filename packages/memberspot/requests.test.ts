import { inspect } from 'node:util';
import type { MemberSpotContext } from './index';
import { memberspot } from './index';
import {
	COURSE_PROGRESS_BODY,
	COURSE_PROGRESS_DETAIL_BODY,
	errorBody,
	USER,
	USER_CREATED_BODY,
} from './test-fixtures';

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape; the output schema under test validates it, so a
 * per-call-site type would add ceremony without adding a check.
 */
function respondJson(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

let fetchMock: jest.SpyInstance;

/** A context with just what the endpoints read: key and options. */
function makeCtx(key = 'memberspot-test-key'): MemberSpotContext {
	const subset: Pick<MemberSpotContext, 'key' | 'options'> = {
		key,
		options: {},
	};
	// Safe: the endpoints read only key, options and db from the context.
	// A narrower type is not practical because a full CorsairPluginContext needs
	// the hub, keys and database.
	return { ...subset, db: {}, endpoints: {} } as MemberSpotContext;
}

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

const api = memberspot().endpoints as NonNullable<
	ReturnType<typeof memberspot>['endpoints']
>;

/** The request the client actually sent. */
function sent(index = 0): { url: URL; init: RequestInit } {
	const [rawUrl, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	return { url: new URL(rawUrl), init };
}

/**
 * The parsed request body. The record is unknown because each endpoint sends a
 * different DTO, and the assertion below is what names the fields it expects.
 */
function bodyOf(index = 0): Record<string, unknown> {
	const { init } = sent(index);
	return init.body === undefined || init.body === null
		? {}
		: (JSON.parse(String(init.body)) as Record<string, unknown>);
}

beforeEach(() => {
	// A call with no queued response throws instead of reaching MemberSpot.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

/**
 * One test per operation, asserting the path MemberSpot routes on plus the
 * method, the query and the body. The API mixes reads and writes on one host, so
 * a wrong verb is a silent wrong result rather than an error the types catch.
 */
describe('request shape per operation', () => {
	it('auth.check hits /api-auth with the key header', async () => {
		respondJson({ schoolId: 'school-1', name: 'Acme' });

		await api.auth.check(makeCtx(), {});

		const { url, init } = sent();
		expect(url.pathname).toBe('/api-auth');
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('X-API-KEY')).toBe(
			'memberspot-test-key',
		);
	});

	it('offers.list hits /v1/offers', async () => {
		respondJson([{ id: 'offer-1', name: 'Pro' }]);

		await api.offers.list(makeCtx(), {});

		expect(sent().url.pathname).toBe('/v1/offers');
	});

	it('courses.list hits /v1/courses', async () => {
		respondJson({ data: [{ id: 'course-1', name: 'Onboarding' }] });

		await api.courses.list(makeCtx(), {});

		expect(sent().url.pathname).toBe('/v1/courses');
	});

	it('exams.list hits /v1/exams', async () => {
		respondJson({ data: [{ examId: 'exam-1', name: 'Safety' }] });

		await api.exams.list(makeCtx(), {});

		expect(sent().url.pathname).toBe('/v1/exams');
	});

	it('exams.results sends the exam id in the path and pages by cursor', async () => {
		respondJson({ data: [] });

		await api.exams.results(makeCtx(), {
			id: 'exam-1',
			lastLoadedId: 'cursor-2',
			pageLength: 20,
		});

		const { url } = sent();
		expect(url.pathname).toBe('/v1/exams/exam-1/results');
		expect(url.searchParams.get('lastLoadedId')).toBe('cursor-2');
		expect(url.searchParams.get('pageLength')).toBe('20');
	});

	it('customProperties.list hits the custom-user-properties path', async () => {
		respondJson([{ id: 'prop-1', name: 'Department' }]);

		await api.customProperties.list(makeCtx(), {});

		expect(sent().url.pathname).toBe('/v1/custom-user-properties/list');
	});

	it('users.list sends its filters and page cursor', async () => {
		respondJson({ data: [] });

		await api.users.list(makeCtx(), {
			lastLoadedId: 'cursor-2',
			pageLength: 50,
			offerId: 'offer-1',
			courseId: 'course-1',
		});

		const { url } = sent();
		expect(url.pathname).toBe('/v1/users/list');
		expect(url.searchParams.get('lastLoadedId')).toBe('cursor-2');
		expect(url.searchParams.get('pageLength')).toBe('50');
		expect(url.searchParams.get('offerId')).toBe('offer-1');
		expect(url.searchParams.get('courseId')).toBe('course-1');
	});

	it('users.list forwards active: false, so only inactive members come back', async () => {
		respondJson({ data: [] });

		await api.users.list(makeCtx(), { active: false });

		expect(sent().url.searchParams.get('active')).toBe('false');
	});

	it('users.list leaves active out when the caller does not filter', async () => {
		respondJson({ data: [] });

		await api.users.list(makeCtx(), {});

		expect(sent().url.searchParams.has('active')).toBe(false);
	});

	it('users.findByEmail encodes the email into the path', async () => {
		respondJson(USER);

		await api.users.findByEmail(makeCtx(), { email: 'a+b@acme.example' });

		// The plus must be percent-encoded or the path breaks.
		expect(sent().url.pathname).toBe(
			'/v1/users/find-by-mail/a%2Bb%40acme.example',
		);
	});

	it('users.findByUid hits find-by-uid', async () => {
		respondJson(USER);

		await api.users.findByUid(makeCtx(), { uid: 'uid-1' });

		expect(sent().url.pathname).toBe('/v1/users/find-by-uid/uid-1');
	});

	it('users.offers hits /v1/users/offers/{uid}', async () => {
		respondJson({ uid: 'uid-1', offers: [] });

		await api.users.offers(makeCtx(), { uid: 'uid-1' });

		expect(sent().url.pathname).toBe('/v1/users/offers/uid-1');
	});

	it('users.loginToken hits the login-token path with the uid', async () => {
		respondJson({ token: 't', loginUrl: 'u' });

		await api.users.loginToken(makeCtx(), { uid: 'uid-1' });

		expect(sent().url.pathname).toBe('/v1/users/login-token/uid-1');
	});

	it('users.grantOffer posts the documented DTO', async () => {
		respondJson(USER_CREATED_BODY);

		await api.users.grantOffer(makeCtx(), {
			email: 'jordan@acme.example',
			firstname: 'Jordan',
			name: 'Miller',
			grantOffer: 'offer-1',
		});

		const { url, init } = sent();
		expect(url.pathname).toBe('/v1/users/grant-user-offer-by-mail');
		expect(init.method).toBe('POST');
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			firstname: 'Jordan',
			name: 'Miller',
			grantOffer: 'offer-1',
		});
	});

	it('users.grantOfferByUid sends the offer as grantOffer, the spec field', async () => {
		respondJson(USER_CREATED_BODY);

		await api.users.grantOfferByUid(makeCtx(), {
			uid: 'uid-1',
			offerId: 'offer-1',
		});

		expect(sent().url.pathname).toBe('/v1/users/grant-user-offer-by-uid');
		// GrantOfferByUidDto is { uid, grantOffer, orderId }; it has no offerId.
		expect(bodyOf()).toEqual({ uid: 'uid-1', grantOffer: 'offer-1' });
	});

	it('users.setOfferState posts email, offerId and active', async () => {
		respondJson({ success: true });

		await api.users.setOfferState(makeCtx(), {
			email: 'jordan@acme.example',
			offerId: 'offer-1',
			active: false,
		});

		expect(sent().url.pathname).toBe('/v1/users/set-offer-state');
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			offerId: 'offer-1',
			active: false,
		});
	});

	it('users.setOfferStateByUid posts the by-uid variant', async () => {
		respondJson({ success: true });

		await api.users.setOfferStateByUid(makeCtx(), {
			uid: 'uid-1',
			offerId: 'offer-1',
			active: true,
		});

		expect(sent().url.pathname).toBe('/v1/users/set-offer-state-by-uid');
		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			offerId: 'offer-1',
			active: true,
		});
	});

	it('users.setOrderState posts the email, order id and state, which is the whole DTO', async () => {
		respondJson({ success: true });

		await api.users.setOrderState(makeCtx(), {
			email: 'jordan@acme.example',
			orderId: 'order-9',
			active: true,
		});

		expect(sent().url.pathname).toBe('/v1/users/set-order-state');
		// SetOrderStateForUserDto is { email, orderId, active }: no offerId.
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			orderId: 'order-9',
			active: true,
		});
	});

	it('users.setOrderStateByUid posts the by-uid variant', async () => {
		respondJson({ success: true });

		await api.users.setOrderStateByUid(makeCtx(), {
			uid: 'uid-1',
			orderId: 'order-9',
			active: false,
		});

		expect(sent().url.pathname).toBe('/v1/users/set-order-state-by-uid');
		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			orderId: 'order-9',
			active: false,
		});
	});

	it('users.setOrderStateByOrderId sends the order id and state', async () => {
		respondJson({ success: true });

		await api.users.setOrderStateByOrderId(makeCtx(), {
			orderId: 'order-9',
			active: false,
		});

		expect(sent().url.pathname).toBe('/v1/users/set-order-state-by-order-id');
		expect(bodyOf()).toEqual({ orderId: 'order-9', active: false });
	});

	it('users.setOfferExpires uses PATCH with a nullable expiry', async () => {
		respondJson({ success: true });

		await api.users.setOfferExpires(makeCtx(), {
			uid: 'uid-1',
			offerId: 'offer-1',
			expiresAt: null,
		});

		const { url, init } = sent();
		expect(url.pathname).toBe('/v1/users/set-offer-expires');
		expect(init.method).toBe('PATCH');
		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			offerId: 'offer-1',
			expiresAt: null,
		});
	});

	it('users.setCourseStartDate uses PATCH with the course and date', async () => {
		respondJson({ success: true });

		await api.users.setCourseStartDate(makeCtx(), {
			uid: 'uid-1',
			courseId: 'course-1',
			startDate: '2026-03-01T00:00:00.000Z',
		});

		const { init } = sent();
		expect(init.method).toBe('PATCH');
		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			courseId: 'course-1',
			startDate: '2026-03-01T00:00:00.000Z',
		});
	});

	it('users.courseProgress pages by lastLoadedCourseId', async () => {
		respondJson(COURSE_PROGRESS_BODY);

		await api.users.courseProgress(makeCtx(), {
			email: 'jordan@acme.example',
			lastLoadedId: 'course-2',
			pageLength: 10,
		});

		const { url } = sent();
		expect(url.pathname).toBe(
			'/v1/users/course-progress/list/jordan%40acme.example',
		);
		// The inbound cursor is named differently from the outbound nextPage.
		expect(url.searchParams.get('lastLoadedCourseId')).toBe('course-2');
		expect(url.searchParams.get('pageLength')).toBe('10');
	});

	it('users.courseProgressByUid uses the by-uid list path', async () => {
		respondJson({ data: [] });

		await api.users.courseProgressByUid(makeCtx(), { uid: 'uid-1' });

		expect(sent().url.pathname).toBe(
			'/v1/users/course-progress/list-by-uid/uid-1',
		);
	});

	it('users.courseProgressDetail puts courseId before the email', async () => {
		respondJson(COURSE_PROGRESS_DETAIL_BODY);

		await api.users.courseProgressDetail(makeCtx(), {
			courseId: 'course-1',
			email: 'jordan@acme.example',
		});

		expect(sent().url.pathname).toBe(
			'/v1/users/course-progress/course-1/jordan%40acme.example',
		);
	});

	it('users.courseProgressDetailByUid puts courseId before by-uid', async () => {
		respondJson(COURSE_PROGRESS_DETAIL_BODY);

		await api.users.courseProgressDetailByUid(makeCtx(), {
			courseId: 'course-1',
			uid: 'uid-1',
		});

		expect(sent().url.pathname).toBe(
			'/v1/users/course-progress/course-1/by-uid/uid-1',
		);
	});

	it('users.setCustomProperties sends the map as an id/value array', async () => {
		respondJson({ success: true });

		await api.users.setCustomProperties(makeCtx(), {
			email: 'jordan@acme.example',
			properties: { department: 'Sales', region: 'EMEA' },
		});

		expect(sent().url.pathname).toBe('/v1/users/set-custom-user-properties');
		// SetCustomPropertyDto: { email, properties: [{ id, value }] }.
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			properties: [
				{ id: 'department', value: 'Sales' },
				{ id: 'region', value: 'EMEA' },
			],
		});
	});

	it('users.setCustomPropertiesByUid sends the array for a uid', async () => {
		respondJson({ success: true });

		await api.users.setCustomPropertiesByUid(makeCtx(), {
			uid: 'uid-1',
			properties: { department: 'Sales' },
		});

		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			properties: [{ id: 'department', value: 'Sales' }],
		});
	});

	it('users.setCustomProperty sends key and value', async () => {
		respondJson({ success: true });

		await api.users.setCustomProperty(makeCtx(), {
			email: 'jordan@acme.example',
			key: 'prop-1',
			value: 'Sales',
		});

		expect(sent().url.pathname).toBe('/v1/users/set-custom-property');
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			key: 'prop-1',
			value: 'Sales',
		});
	});

	it('users.setCustomPropertyByUid sends the by-uid variant', async () => {
		respondJson({ success: true });

		await api.users.setCustomPropertyByUid(makeCtx(), {
			uid: 'uid-1',
			key: 'prop-1',
		});

		expect(bodyOf()).toEqual({ uid: 'uid-1', key: 'prop-1' });
	});

	it('users.delete posts the emails, using POST not DELETE', async () => {
		respondJson({ success: true });

		await api.users.delete(makeCtx(), {
			emails: ['a@acme.example', 'b@acme.example'],
		});

		const { url, init } = sent();
		expect(url.pathname).toBe('/v1/users/delete-users');
		// The spec also exposes DELETE with a body; POST is the portable form.
		expect(init.method).toBe('POST');
		expect(bodyOf()).toEqual({
			emails: ['a@acme.example', 'b@acme.example'],
		});
	});

	it('users.deleteByUid posts the uids', async () => {
		respondJson({ success: true });

		await api.users.deleteByUid(makeCtx(), { uids: ['uid-1', 'uid-2'] });

		expect(sent().url.pathname).toBe('/v1/users/delete-users-by-uid');
		expect(bodyOf()).toEqual({ uids: ['uid-1', 'uid-2'] });
	});

	it('chapters.enableAccess posts email, courseId and chapterId', async () => {
		respondJson({ success: true });

		await api.chapters.enableAccess(makeCtx(), {
			email: 'jordan@acme.example',
			courseId: 'course-1',
			chapterId: 'chapter-1',
		});

		expect(sent().url.pathname).toBe('/v1/chapters/chapter-access/enable');
		// ApiChapterAccessDto requires courseId alongside chapterId.
		expect(bodyOf()).toEqual({
			email: 'jordan@acme.example',
			courseId: 'course-1',
			chapterId: 'chapter-1',
		});
	});

	it('chapters.enableAccessByUid posts uid, courseId and chapterId', async () => {
		respondJson({ success: true });

		await api.chapters.enableAccessByUid(makeCtx(), {
			uid: 'uid-1',
			courseId: 'course-1',
			chapterId: 'chapter-1',
		});

		expect(sent().url.pathname).toBe(
			'/v1/chapters/chapter-access/enable-by-uid',
		);
		expect(bodyOf()).toEqual({
			uid: 'uid-1',
			courseId: 'course-1',
			chapterId: 'chapter-1',
		});
	});
});

describe('input validation before sending', () => {
	// MemberSpot deletes the grant when `active` is not sent, so leaving the field
	// out must not be enough to remove access.
	it('rejects a grant-state write with no active value before sending', async () => {
		const ctx = makeCtx();
		// The types already require `active`; the cast lets the test send the
		// call an untyped caller (an agent's JSON) could still make.
		const withoutActive = (input: Record<string, string>) => input as never;
		const calls = [
			() =>
				api.users.setOfferState(
					ctx,
					withoutActive({ email: 'a@acme.example', offerId: 'offer-1' }),
				),
			() =>
				api.users.setOfferStateByUid(
					ctx,
					withoutActive({ uid: 'uid-1', offerId: 'offer-1' }),
				),
			() =>
				api.users.setOrderState(
					ctx,
					withoutActive({ email: 'a@acme.example', orderId: 'order-9' }),
				),
			() =>
				api.users.setOrderStateByUid(
					ctx,
					withoutActive({ uid: 'uid-1', orderId: 'order-9' }),
				),
			() =>
				api.users.setOrderStateByOrderId(
					ctx,
					withoutActive({ orderId: 'order-9' }),
				),
		];
		for (const send of calls) {
			await expect(send()).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('active: null removes the grant by leaving active out of the body', async () => {
		respondJson({ orderId: 'order-9' });
		await api.users.setOrderStateByOrderId(makeCtx(), {
			orderId: 'order-9',
			active: null,
		});
		expect(bodyOf()).toEqual({ orderId: 'order-9' });
	});

	it('active: null on set-offer-state also leaves the field out', async () => {
		respondJson({ uid: 'uid-1', offerId: 'offer-1' });
		await api.users.setOfferStateByUid(makeCtx(), {
			uid: 'uid-1',
			offerId: 'offer-1',
			active: null,
		});
		expect(bodyOf()).toEqual({ uid: 'uid-1', offerId: 'offer-1' });
	});

	it('keeps an email or uid property id inside the array, so it cannot retarget the write', async () => {
		respondJson({ success: true });
		await api.users.setCustomProperties(makeCtx(), {
			email: 'a@acme.example',
			properties: { email: 'b@acme.example' },
		});
		expect(bodyOf()).toEqual({
			email: 'a@acme.example',
			properties: [{ id: 'email', value: 'b@acme.example' }],
		});
	});

	it('accepts a property map with ordinary keys', async () => {
		respondJson({ success: true });
		await expect(
			api.users.setCustomProperties(makeCtx(), {
				email: 'a@acme.example',
				properties: { department: 'Sales', region: 'EMEA' },
			}),
		).resolves.toBeDefined();
	});

	it('rejects a delete list over the documented 10-user cap', async () => {
		const emails = Array.from({ length: 11 }, (_, i) => `u${i}@acme.example`);
		await expect(api.users.delete(makeCtx(), { emails })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts exactly 10 emails', async () => {
		respondJson({ success: true });
		const emails = Array.from({ length: 10 }, (_, i) => `u${i}@acme.example`);
		await expect(
			api.users.delete(makeCtx(), { emails }),
		).resolves.toBeDefined();
	});

	it('rejects an invalid email before sending', async () => {
		await expect(
			api.users.findByEmail(makeCtx(), { email: 'not-an-email' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a pageLength over the documented maximum of 100', async () => {
		await expect(
			api.users.list(makeCtx(), { pageLength: 101 }),
		).rejects.toThrow();
	});

	it('rejects a pageLength below 1', async () => {
		await expect(
			api.users.list(makeCtx(), { pageLength: 0 }),
		).rejects.toThrow();
	});
});

describe('error handling', () => {
	it('reports the provider message and status', async () => {
		respondJson(errorBody(401, 'Unauthorized'), 401);

		const error = await api.auth
			.check(makeCtx(), {})
			// unknown: a rejection can be any value; the assertion names the shape.
			.catch((caught: unknown) => caught);

		expect(error).toMatchObject({ status: 401 });
		expect((error as Error).message).toContain('Unauthorized');
	});

	it('treats a 400 missing key as an auth problem, not validation', async () => {
		respondJson(errorBody(400, 'API key is missing'), 400);

		const error = await api.auth
			.check(makeCtx(), {})
			// unknown: a rejection can be any value; the assertion names the shape.
			.catch((caught: unknown) => caught);

		// The status is 400, which is unusual for auth; the message is the signal.
		expect(error).toMatchObject({ status: 400 });
	});

	it('never puts the key in the message, a stringified error or inspect', async () => {
		respondJson(errorBody(401, 'Unauthorized'), 401);

		const error = await api.auth
			.check(makeCtx('super-secret-key'), {})
			// unknown: a rejection can be any value; the assertion names the shape.
			.catch((caught: unknown) => caught);

		expect((error as Error).message).not.toContain('super-secret-key');
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		expect(inspect(error)).not.toContain('super-secret-key');
	});
});

describe('reads that must not pass an empty or wrong-shaped reply', () => {
	it('auth.check rejects a reply without schoolId', async () => {
		respondJson({ id: 'school-1', name: 'Acme' });

		await expect(api.auth.check(makeCtx(), {})).rejects.toThrow();
	});

	it.each([
		['an empty body', ''],
		['an id-less object', { courseId: 'course-1', progress: 25 }],
	])('users.courseProgressDetailByUid rejects %s', async (_, body) => {
		fetchMock.mockResolvedValueOnce(
			typeof body === 'string'
				? new Response(body, { status: 200 })
				: new Response(JSON.stringify(body), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					}),
		);

		await expect(
			api.users.courseProgressDetailByUid(makeCtx(), {
				courseId: 'course-1',
				uid: 'uid-1',
			}),
		).rejects.toThrow();
	});
});

describe('write routes the spec documents with no response body', () => {
	/** A 200 with no content, which is what a NestJS handler returning void sends. */
	function respondEmpty() {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
	}

	it('users.delete resolves when MemberSpot answers 200 with no body', async () => {
		respondEmpty();
		await expect(
			api.users.delete(makeCtx(), { emails: ['a@acme.example'] }),
		).resolves.toEqual({});
	});

	it('users.deleteByUid resolves on an empty 200', async () => {
		respondEmpty();
		await expect(
			api.users.deleteByUid(makeCtx(), { uids: ['uid-1'] }),
		).resolves.toEqual({});
	});

	it('users.setOfferExpires and users.setCourseStartDate resolve on an empty 200', async () => {
		respondEmpty();
		await expect(
			api.users.setOfferExpires(makeCtx(), {
				uid: 'uid-1',
				offerId: 'offer-1',
				expiresAt: null,
			}),
		).resolves.toEqual({});
		respondEmpty();
		await expect(
			api.users.setCourseStartDate(makeCtx(), {
				uid: 'uid-1',
				courseId: 'course-1',
				startDate: '2026-12-01T00:00:00.000Z',
			}),
		).resolves.toEqual({});
	});

	it('still rejects an empty 200 from find-by-uid, the documented not-found answer', async () => {
		respondEmpty();
		await expect(
			api.users.findByUid(makeCtx(), { uid: 'missing' }),
		).rejects.toThrow();
	});

	/**
	 * What the live API sends (11-11): `content-type: text/html` with
	 * `content-length: 0`, 200 on the PATCH routes and 201 on the delete routes.
	 * The request layer reads a non-JSON body as text, so the endpoint sees ''.
	 */
	function respondEmptyText(status: number) {
		fetchMock.mockResolvedValueOnce(
			new Response('', {
				status,
				headers: { 'Content-Type': 'text/html', 'Content-Length': '0' },
			}),
		);
	}

	it('resolves the empty text/html reply the live write routes send', async () => {
		respondEmptyText(200);
		await expect(
			api.users.setOfferExpires(makeCtx(), {
				uid: 'uid-1',
				offerId: 'offer-1',
				expiresAt: '2026-12-11T00:00:00.000Z',
			}),
		).resolves.toEqual({});
		respondEmptyText(200);
		await expect(
			api.users.setCourseStartDate(makeCtx(), {
				uid: 'uid-1',
				courseId: 'course-1',
				startDate: '2026-12-01T00:00:00.000Z',
			}),
		).resolves.toEqual({});
		respondEmptyText(201);
		await expect(
			api.users.deleteByUid(makeCtx(), { uids: ['uid-1'] }),
		).resolves.toEqual({});
		respondEmptyText(201);
		await expect(
			api.users.delete(makeCtx(), { emails: ['a@acme.example'] }),
		).resolves.toEqual({});
	});

	it('still rejects the empty text/html reply find-by-uid sends for an unknown uid', async () => {
		respondEmptyText(200);
		await expect(
			api.users.findByUid(makeCtx(), { uid: 'missing' }),
		).rejects.toThrow();
	});
});

describe('chapter access replies', () => {
	/**
	 * Live (11-11), both chapter-access routes answer 201 with the bare body
	 * `true`, not the DTO echo the spec documents.
	 */
	function respondBareTrue(contentType: string) {
		fetchMock.mockResolvedValueOnce(
			new Response('true', {
				status: 201,
				headers: { 'Content-Type': contentType },
			}),
		);
	}

	it('chapters.enableAccess resolves the bare `true` reply as success', async () => {
		respondBareTrue('text/html');
		await expect(
			api.chapters.enableAccess(makeCtx(), {
				email: 'jordan@acme.example',
				courseId: 'course-1',
				chapterId: 'chapter-1',
			}),
		).resolves.toEqual({ success: true });
	});

	it('chapters.enableAccessByUid resolves `true` sent as JSON too', async () => {
		respondBareTrue('application/json');
		await expect(
			api.chapters.enableAccessByUid(makeCtx(), {
				uid: 'uid-1',
				courseId: 'course-1',
				chapterId: 'chapter-1',
			}),
		).resolves.toEqual({ success: true });
	});
});
