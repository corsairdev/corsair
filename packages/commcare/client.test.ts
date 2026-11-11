import {
	CommCareAPIError,
	describeCommCareError,
	makeCommCareRequest,
	segment,
} from './client';
import { badKey, upgradeRequiredPage, user } from './test-fixtures';

const DOMAIN = 'my-project';
const USERNAME = 'jdoe@my-project.commcarehq.org';
const API_KEY = 'cc-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<CommCareAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(CommCareAPIError);
	if (!(error instanceof CommCareAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeCommCareRequest', () => {
	it('authenticates with the ApiKey scheme and scopes to the domain', async () => {
		respond([user], 200);

		const result = await makeCommCareRequest(
			{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
			{ method: 'GET', path: `/a/${DOMAIN}/api/user/v1/`, replaySafe: true },
		);

		expect(result).toEqual([user]);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`https://www.commcarehq.org/a/${DOMAIN}/api/user/v1/`);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`ApiKey ${USERNAME}:${API_KEY}`);
	});

	it('POSTs a JSON body with the wire keys', async () => {
		respond({ id: 'new-id' }, 201);

		await makeCommCareRequest(
			{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
			{
				method: 'POST',
				path: `/a/${DOMAIN}/api/user/v1/`,
				body: {
					username: 'worker@my-project.commcarehq.org',
					password: 'pw',
					first_name: 'Jo',
				},
			},
		);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toMatchObject({
			first_name: 'Jo',
		});
	});

	it('sends multipart fields for the OpenRosa receiver', async () => {
		respond('<OpenRosaResponse></OpenRosaResponse>', 201);

		await makeCommCareRequest(
			{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
			{
				method: 'POST',
				path: `/a/${DOMAIN}/receiver/app-1/`,
				formData: { xml_submission_file: '<xform></xform>' },
			},
		);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeInstanceOf(FormData);
		expect((init.body as FormData).get('xml_submission_file')).toBe(
			'<xform></xform>',
		);
	});

	it('carries replaySafe onto the thrown error', async () => {
		respond({ message: 'boom' }, 503);
		const read = await failure(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'GET', path: '/a/x/api/user/v1/', replaySafe: true },
			),
		);
		expect(read.replaySafe).toBe(true);

		respond({ message: 'boom' }, 503);
		const write = await failure(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'POST', path: '/a/x/api/user/v1/', body: {} },
			),
		);
		expect(write.replaySafe).toBe(false);
	});

	it('reads the message from an error body', async () => {
		respond(badKey, 401);

		const error = await failure(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'GET', path: '/a/x/api/user/v1/' },
			),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('CommCare 401');
	});

	it('turns the HTML paywall page HQ answers with 200 into a 403', async () => {
		// Trimmed from the live case API on a project whose plan lacks API
		// access: 200, text/html, a full "Upgrade Required" page.
		fetchMock.mockResolvedValueOnce(
			new Response(upgradeRequiredPage, {
				status: 200,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			}),
		);

		const error = await failure(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'GET', path: `/a/${DOMAIN}/api/case/v2/`, replaySafe: true },
			),
		);
		expect(error.status).toBe(403);
		expect(error.message).toBe(
			'CommCare 403: Upgrade Required. HQ answered an HTML page instead of JSON, which it does when the project plan has no API access',
		);
		expect(error.message).not.toContain(API_KEY);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('still returns XML text bodies such as the OTA restore', async () => {
		respond('<OpenRosaResponse><message>ok</message></OpenRosaResponse>', 200, {
			'Content-Type': 'text/xml',
		});

		await expect(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'GET', path: `/a/${DOMAIN}/phone/restore/` },
			),
		).resolves.toContain('<OpenRosaResponse>');
	});

	it('does not leak the key through any error surface', async () => {
		respond(badKey, 401);

		const error = await failure(
			makeCommCareRequest(
				{ domain: DOMAIN, username: USERNAME, apiKey: API_KEY },
				{ method: 'GET', path: '/a/x/api/user/v1/' },
			),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});

	it('percent-encodes path segments', () => {
		expect(segment('a b')).toBe('a%20b');
	});
});

describe('describeCommCareError', () => {
	it('prefers the body message over the fallback', () => {
		expect(
			describeCommCareError(400, { message: 'No such case.' }, 'fallback'),
		).toContain('No such case.');
		expect(describeCommCareError(undefined, {}, 'fallback')).toBe('fallback');
	});
});
