import { logEventFromContext } from 'corsair/core';
import {
	Accounts,
	Inquiries,
	InquirySessions,
	InquiryTemplates,
	Webhooks,
} from './endpoints';
import {
	account,
	inquiry,
	inquirySession,
	inquiryTemplate,
	oneTimeLink,
	rotatedWebhook,
	webhookConfig,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'persona-test-key';

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
	// 204 takes no body: constructing Response(null, { status: 204 }) throws.
	const init: ResponseInit =
		status === 204
			? { status }
			: { status, headers: { 'Content-Type': 'application/json' } };
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? undefined : JSON.stringify(body), init),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.withpersona.com');
	expect(sent.path).toBe(`/api/v1${path}`);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('accounts', () => {
	it('list sends page params', async () => {
		respond({ data: [account] });
		await invoke(Accounts.list, { pageAfter: 'cur1', pageSize: 25 });
		const sent = lastRequest();
		expectAuthenticated('/accounts');
		expect(sent.query['page[after]']).toBe('cur1');
		expect(sent.query['page[size]']).toBe('25');
	});

	it('get reads one account', async () => {
		respond({ data: account });
		await invoke(Accounts.get, { accountId: account.id });
		expectAuthenticated(`/accounts/${account.id}`);
	});

	it('create posts the attributes wrapper', async () => {
		respond({ data: account });
		await invoke(Accounts.create, {
			attributes: { name: 'John Doe', email: 'john.doe@example.com' },
		});
		const sent = lastRequest();
		expectAuthenticated('/accounts', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			data: { attributes: { name: 'John Doe', email: 'john.doe@example.com' } },
		});
	});

	it('update PATCHes the attributes wrapper', async () => {
		respond({ data: account });
		await invoke(Accounts.update, {
			accountId: account.id,
			attributes: { name: 'Jane Doe' },
		});
		expectAuthenticated(`/accounts/${account.id}`, 'PATCH');
	});

	it('redact DELETEs and accepts a 204', async () => {
		respond(null, 204);
		const result = (await invoke(Accounts.redact, {
			accountId: account.id,
		})) as { success: boolean };
		expect(result.success).toBe(true);
		expectAuthenticated(`/accounts/${account.id}`, 'DELETE');
	});

	it('search posts the query', async () => {
		respond({ data: [account] });
		await invoke(Accounts.search, { query: 'John' });
		expectAuthenticated('/accounts/search', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({ query: 'John' });
	});

	it('addTag and removeTag post the tag', async () => {
		respond({ success: true });
		await invoke(Accounts.addTag, { accountId: account.id, tag: 'vip' });
		expectAuthenticated(`/accounts/${account.id}/add-tag`, 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			data: { attributes: { tag: 'vip' } },
		});

		respond({ success: true });
		await invoke(Accounts.removeTag, { accountId: account.id, tag: 'vip' });
		expectAuthenticated(`/accounts/${account.id}/remove-tag`, 'POST');
	});
});

describe('inquiries', () => {
	it('list sends status filter', async () => {
		respond({ data: [inquiry] });
		await invoke(Inquiries.list, { status: 'completed' });
		const sent = lastRequest();
		expectAuthenticated('/inquiries');
		expect(sent.query['status']).toBe('completed');
	});

	it('get reads one inquiry', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.get, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}`);
	});

	it('create posts the template id', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.create, {
			attributes: {
				'inquiry-template-id': inquiryTemplate.id,
				fields: { name: 'John' },
			},
		});
		const sent = lastRequest();
		expectAuthenticated('/inquiries', 'POST');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as {
			data: { attributes: Record<string, unknown> };
		};
		expect(body.data.attributes['inquiry-template-id']).toBe(
			inquiryTemplate.id,
		);
		expect(body.data.attributes['fields']).toEqual({ name: 'John' });
	});

	it('update PATCHes the attributes', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.update, {
			inquiryId: inquiry.id,
			attributes: { note: 'Updated' },
		});
		expectAuthenticated(`/inquiries/${inquiry.id}`, 'PATCH');
	});

	it('redact DELETEs and accepts a 204', async () => {
		respond(null, 204);
		const result = (await invoke(Inquiries.redact, {
			inquiryId: inquiry.id,
		})) as { success: boolean };
		expect(result.success).toBe(true);
		expectAuthenticated(`/inquiries/${inquiry.id}`, 'DELETE');
	});

	it('approve and decline post their bodies', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.approve, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}/approve`, 'POST');

		respond({ data: inquiry });
		await invoke(Inquiries.decline, {
			inquiryId: inquiry.id,
			attributes: { declineReasons: ['fraud'] },
		});
		const sent = lastRequest();
		expectAuthenticated(`/inquiries/${inquiry.id}/decline`, 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			data: { attributes: { declineReasons: ['fraud'] } },
		});
	});

	it('markForReview and generateOneTimeLink call their RPCs', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.markForReview, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}/mark-for-review`, 'POST');

		respond({ data: oneTimeLink });
		const link = (await invoke(Inquiries.generateOneTimeLink, {
			inquiryId: inquiry.id,
		})) as { data: { reference?: string } };
		expect(link.data.reference).toContain('withpersona.com');
		expectAuthenticated(
			`/inquiries/${inquiry.id}/generate-one-time-link`,
			'POST',
		);
	});

	it('addTag and removeTag post the tag', async () => {
		respond({ success: true });
		await invoke(Inquiries.addTag, { inquiryId: inquiry.id, tag: 'follow-up' });
		expectAuthenticated(`/inquiries/${inquiry.id}/add-tag`, 'POST');

		respond({ success: true });
		await invoke(Inquiries.removeTag, {
			inquiryId: inquiry.id,
			tag: 'follow-up',
		});
		expectAuthenticated(`/inquiries/${inquiry.id}/remove-tag`, 'POST');
	});
});

describe('inquiry sessions', () => {
	it('create posts an empty attributes object', async () => {
		respond({ data: inquirySession });
		await invoke(InquirySessions.create, {});
		expectAuthenticated('/inquiry-sessions', 'POST');
	});

	it('get reads one session', async () => {
		respond({ data: inquirySession });
		await invoke(InquirySessions.get, { inquirySessionId: inquirySession.id });
		expectAuthenticated(`/inquiry-sessions/${inquirySession.id}`);
	});

	it('expire and expireAll call their RPCs', async () => {
		respond({ data: inquirySession });
		await invoke(InquirySessions.expire, {
			inquirySessionId: inquirySession.id,
		});
		expectAuthenticated(
			`/inquiry-sessions/${inquirySession.id}/expire`,
			'POST',
		);

		respond(null, 204);
		const result = (await invoke(InquirySessions.expireAll, {})) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
		expectAuthenticated('/inquiry-sessions/expire-all', 'POST');
	});

	it('generateOneTimeLink calls its RPC', async () => {
		respond({ data: oneTimeLink });
		await invoke(InquirySessions.generateOneTimeLink, {
			inquirySessionId: inquirySession.id,
		});
		expectAuthenticated(
			`/inquiry-sessions/${inquirySession.id}/generate-one-time-link`,
			'POST',
		);
	});
});

describe('inquiry templates', () => {
	it('list and get call their RPCs', async () => {
		respond({ data: [inquiryTemplate] });
		const page = (await invoke(InquiryTemplates.list, {})) as {
			data: unknown[]; // unknown: template records are provider-shaped
		};
		expect(page.data).toHaveLength(1);
		expectAuthenticated('/inquiry-templates');

		respond({ data: inquiryTemplate });
		await invoke(InquiryTemplates.get, {
			inquiryTemplateId: inquiryTemplate.id,
		});
		expectAuthenticated(`/inquiry-templates/${inquiryTemplate.id}`);
	});

	it('listVersions calls its RPC', async () => {
		respond({ data: [] });
		await invoke(InquiryTemplates.listVersions, {});
		expectAuthenticated('/inquiry-template-versions');
	});
});

describe('webhooks', () => {
	it('list GETs the configurations', async () => {
		respond({ data: [webhookConfig] });
		const page = (await invoke(Webhooks.list, {})) as { data: unknown[] }; // unknown: webhook records are provider-shaped
		expect(page.data).toHaveLength(1);
		expectAuthenticated('/webhooks');
	});

	it('create posts the attributes with enabled events', async () => {
		respond({ data: webhookConfig });
		await invoke(Webhooks.create, {
			attributes: {
				name: 'Main',
				url: 'https://example.com/webhooks/persona',
				'enabled-events': ['inquiry.approved'],
			},
		});
		const sent = lastRequest();
		expectAuthenticated('/webhooks', 'POST');
		// unknown: the request body is parsed JSON whose keys are
		// provider-defined, so the test narrows per assertion.
		const body = JSON.parse(sent.body as string) as {
			data: { attributes: Record<string, unknown> };
		};
		expect(body.data.attributes['enabled-events']).toEqual([
			'inquiry.approved',
		]);
	});

	it('update PATCHes the attributes', async () => {
		respond({ data: webhookConfig });
		await invoke(Webhooks.update, {
			webhookId: webhookConfig.id,
			attributes: { enabled: false },
		});
		expectAuthenticated(`/webhooks/${webhookConfig.id}`, 'PATCH');
	});

	it('enable, disable and archive call their RPCs', async () => {
		respond({ data: webhookConfig });
		await invoke(Webhooks.enable, { webhookId: webhookConfig.id });
		expectAuthenticated(`/webhooks/${webhookConfig.id}/enable`, 'POST');

		respond({ data: webhookConfig });
		await invoke(Webhooks.disable, { webhookId: webhookConfig.id });
		expectAuthenticated(`/webhooks/${webhookConfig.id}/disable`, 'POST');

		respond({ data: webhookConfig });
		await invoke(Webhooks.archive, { webhookId: webhookConfig.id });
		expectAuthenticated(`/webhooks/${webhookConfig.id}/archive`, 'POST');
	});

	it('rotateSecret posts to its RPC', async () => {
		respond({ data: rotatedWebhook });
		const result = (await invoke(Webhooks.rotateSecret, {
			webhookId: webhookConfig.id,
		})) as { data: { attributes?: { secret?: string } } };
		expect(result.data.attributes?.secret).toBe('whsec_new_value');
		expectAuthenticated(`/webhooks/${webhookConfig.id}/rotate-secret`, 'POST');
	});

	it('searchEvents posts the query', async () => {
		respond({ data: [] });
		await invoke(Webhooks.searchEvents, { query: 'inquiry.approved' });
		expectAuthenticated('/webhook-events/search', 'POST');
	});
});
