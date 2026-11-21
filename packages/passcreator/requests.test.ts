import { logEventFromContext } from 'corsair/core';
import { Passes, Templates, Webhooks } from './endpoints';
import {
	pass,
	publicKeyResponse,
	template,
	webhookSubscription,
	writeResult,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pc-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.passcreator.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('passes', () => {
	it('create POSTs properties with the template query', async () => {
		respond(pass, 201);
		await invoke(Passes.create, {
			passtemplate: 'tmpl_1',
			properties: { firstname: 'John' },
		});
		const sent = lastRequest();
		expectAuthenticated('/api/pass', 'POST');
		expect(sent.query['passtemplate']).toBe('tmpl_1');
		expect(sent.query['zapierStyle']).toBe('true');
		expect(JSON.parse(sent.body as string)).toEqual({ firstname: 'John' });
	});

	it('list GETs the passes of a template with cursor params', async () => {
		respond({
			query: {
				start: 2,
				pageSize: 50,
				self: 'https://app.passcreator.com/api/pass/list/tmpl_1',
			},
			total: 1,
			results: [pass],
		});
		await invoke(Passes.list, {
			templateUid: 'tmpl_1',
			start: 2,
			pageSize: 50,
			createdSince: '2021-07-01 15:30',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/pass/list/tmpl_1');
		expect(sent.query['start']).toBe('2');
		expect(sent.query['pageSize']).toBe('50');
		expect(sent.query['createdSince']).toBe('2021-07-01 15:30');
	});

	it('get reads one pass by barcode value', async () => {
		respond(pass);
		await invoke(Passes.get, { passUid: 'CUSTOMER-12345' });
		expectAuthenticated('/api/pass/CUSTOMER-12345');
	});

	it('update POSTs properties with zapierStyle and answers 204', async () => {
		respond(undefined, 204);
		const result = (await invoke(Passes.update, {
			passUid: 'uid1',
			properties: { firstname: 'Jane' },
		})) as { passUid: string; success: boolean };
		expect(result).toEqual({ passUid: 'uid1', success: true });
		expectAuthenticated('/api/pass/uid1', 'POST');
		expect(lastRequest().query['zapierStyle']).toBe('true');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			firstname: 'Jane',
		});
	});

	it('update PUTs { voided } when only the voided flag changes', async () => {
		respond(undefined, 204);
		await invoke(Passes.update, { passUid: 'uid1', voided: true });
		expectAuthenticated('/api/pass/uid1', 'PUT');
		expect(JSON.parse(lastRequest().body as string)).toEqual({ voided: true });
	});

	it('update POSTs properties and voided together', async () => {
		respond(undefined, 204);
		await invoke(Passes.update, {
			passUid: 'uid1',
			properties: { firstname: 'Jane' },
			voided: false,
		});
		expectAuthenticated('/api/pass/uid1', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			firstname: 'Jane',
			voided: false,
		});
	});

	it('delete DELETEs the pass and accepts the empty 200', async () => {
		respond(undefined, 200);
		const result = (await invoke(Passes.remove, { passUid: 'uid1' })) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
		expectAuthenticated('/api/pass/uid1', 'DELETE');
	});

	it('search GETs matching passes', async () => {
		respond([pass]);
		await invoke(Passes.search, {
			templateUid: 'tmpl_1',
			searchTerm: 'johnny',
		});
		expectAuthenticated('/api/pass/search/tmpl_1/johnny');
	});

	it('uris GETs the resource URIs', async () => {
		respond({ passPage: 'https://app.passcreator.com/en/p/x' });
		await invoke(Passes.uris, { passUid: 'uid1' });
		expectAuthenticated('/api/pass/geturis/uid1');
	});

	it('statistics GETs usage statistics', async () => {
		respond({ created: 12, inactive: 1 });
		await invoke(Passes.statistics, {
			templateUid: 'tmpl_1',
			timeFrame: 'day',
			day: 'today',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/pass/statistics/tmpl_1');
		expect(sent.query['timeFrame']).toBe('day');
		expect(sent.query['day']).toBe('today');
	});

	it('activeHistory GETs the history', async () => {
		respond([{ date: '2025-01-15', active: 7, inactive: 4 }]);
		await invoke(Passes.activeHistory, {
			templateUid: 'tmpl_1',
			day: '2025-01-15',
		});
		expectAuthenticated('/api/pass/statistics/tmpl_1/activehistory/2025-01-15');
	});

	it('enableDownload POSTs and answers 204', async () => {
		respond(undefined, 204);
		const result = (await invoke(Passes.enableDownload, {
			passUid: 'uid1',
		})) as {
			passUid: string;
			success: boolean;
		};
		expect(result).toEqual({ passUid: 'uid1', success: true });
		expectAuthenticated('/api/pass/uid1/enabledownload', 'POST');
	});

	it('pushNotification POSTs pushNotificationText and accepts the 204', async () => {
		respond(undefined, 204);
		await invoke(Passes.pushNotification, {
			passUid: 'uid1',
			message: 'Your coupon is expiring',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/pass/uid1/sendpushnotification', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			pushNotificationText: 'Your coupon is expiring',
		});
	});

	it('sendEmail POSTs to the deliver route and accepts the empty 200', async () => {
		respond(undefined, 200);
		await invoke(Passes.sendEmail, {
			passUid: 'uid1',
			email: 'john.doe@example.com',
		});
		expectAuthenticated(
			'/api/pass/deliver/uid1/email/john.doe@example.com',
			'POST',
		);
	});
});

describe('sendEmail answers', () => {
	it('refuses a body that is not the documented empty answer', async () => {
		respond(['unexpected']);
		await expect(
			invoke(Passes.sendEmail, {
				passUid: 'uid1',
				email: 'john.doe@example.com',
			}),
		).rejects.toThrow('unexpected response body');
	});
});

describe('templates', () => {
	it('list GETs all templates', async () => {
		respond([template]);
		const result = (await invoke(Templates.list, {})) as unknown[]; // unknown: template objects are provider-shaped
		expect(result).toHaveLength(1);
		expectAuthenticated('/api/pass-template');
	});

	it('fields GETs the field information', async () => {
		respond([{ id: 'f1', name: 'firstname', type: 'text' }]);
		await invoke(Templates.fields, { templateUid: 'tmpl_1' });
		const sent = lastRequest();
		expectAuthenticated('/api/pass-template/tmpl_1');
		expect(sent.query['zapierStyle']).toBe('true');
	});

	it('copy POSTs to the copy route', async () => {
		respond({ identifier: 'tmpl_copy' }, 201);
		await invoke(Templates.copy, { templateUid: 'tmpl_1', name: 'Copy' });
		expectAuthenticated('/api/pass-template/copy/tmpl_1', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({ name: 'Copy' });
		// The API requires a name for the copy.
		await expect(
			invoke(Templates.copy, { templateUid: 'tmpl_1' }),
		).rejects.toThrow();
	});

	it('delete DELETEs the template and accepts the empty 200', async () => {
		respond(undefined, 200);
		const result = (await invoke(Templates.remove, {
			templateUid: 'tmpl_1',
		})) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
		expectAuthenticated('/api/pass-template/tmpl_1', 'DELETE');
	});

	it('movePass POSTs to the v2 move route', async () => {
		respond(writeResult);
		await invoke(Templates.movePass, {
			passUid: 'uid1',
			targetTemplateIdentifier: 'tmpl_2',
		});
		expectAuthenticated('/api/v2/pass/uid1/movetotemplate/tmpl_2', 'POST');
	});
});

describe('webhooks', () => {
	it('subscribe POSTs the subscription body', async () => {
		respond({}, 201);
		await invoke(Webhooks.subscribe, {
			target_url: 'https://example.com/webhooks/passcreator',
			event: 'pass_created',
		});
		const sent = lastRequest();
		expectAuthenticated('/api/hook/subscribe', 'POST');
		// signPayload defaults to true: the receiver rejects unsigned deliveries.
		expect(JSON.parse(sent.body as string)).toEqual({
			target_url: 'https://example.com/webhooks/passcreator',
			event: 'pass_created',
			signPayload: true,
		});
	});

	it('subscribe scopes to a template through the path, not the body', async () => {
		respond({}, 201);
		await invoke(Webhooks.subscribe, {
			target_url: 'https://example.com/webhooks/passcreator',
			event: 'pass_created',
			pass_template: 'tmpl_1',
		});
		expectAuthenticated('/api/hook/subscribe/tmpl_1', 'POST');
		expect(JSON.parse(lastRequest().body as string)).not.toHaveProperty(
			'pass_template',
		);
	});

	it('unsubscribe POSTs the target_url and accepts {}', async () => {
		respond({});
		const result = await invoke(Webhooks.unsubscribe, {
			target_url: 'https://example.com/webhooks/passcreator',
		});
		expect(result).toEqual({ success: true });
		expectAuthenticated('/api/hook/unsubscribe', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			target_url: 'https://example.com/webhooks/passcreator',
		});
	});

	it('list GETs the active hooks', async () => {
		respond([webhookSubscription]);
		const result = (await invoke(Webhooks.list, {})) as unknown[]; // unknown: subscription objects are provider-shaped
		expect(result).toHaveLength(1);
		expectAuthenticated('/api/hook/list');
	});

	it('getPublicKey GETs the PEM key', async () => {
		respond(publicKeyResponse);
		const result = (await invoke(Webhooks.getPublicKey, {})) as {
			publicKey: string;
		};
		expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
	});
});
