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
	LINKS,
	oneTimeLinkMeta,
	templateVersion,
	webhookConfig,
	webhookWithSecret,
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

function sentBody() {
	return JSON.parse(lastRequest().body as string);
}

describe('accounts', () => {
	it('list sends page and filter params and reads links', async () => {
		respond({ data: [account], links: LINKS });
		const page = (await invoke(Accounts.list, {
			pageAfter: 'act_1',
			pageSize: 25,
			referenceId: 'user-42',
		})) as { links?: { next?: string | null } };
		expect(page.links?.next).toBe(LINKS.next);
		const sent = lastRequest();
		expectAuthenticated('/accounts');
		expect(sent.query).toEqual({
			'page[after]': 'act_1',
			'page[size]': '25',
			'filter[reference-id]': 'user-42',
		});
		expect(sent.headers.get('persona-version')).toBe('2023-01-05');
	});

	it('get reads one account', async () => {
		respond({ data: account });
		await invoke(Accounts.get, { accountId: account.id });
		expectAuthenticated(`/accounts/${account.id}`);
	});

	it('create and update send { data: { attributes } } with kebab keys', async () => {
		respond({ data: account }, 201);
		await invoke(Accounts.create, {
			attributes: { 'reference-id': 'user-42', 'name-first': 'Jane' },
		});
		expectAuthenticated('/accounts', 'POST');
		expect(sentBody()).toEqual({
			data: { attributes: { 'reference-id': 'user-42', 'name-first': 'Jane' } },
		});

		respond({ data: account });
		await invoke(Accounts.update, {
			accountId: account.id,
			attributes: { tags: ['vip'] },
		});
		expectAuthenticated(`/accounts/${account.id}`, 'PATCH');
		expect(sentBody()).toEqual({ data: { attributes: { tags: ['vip'] } } });
	});

	it('redact reads the redacted account Persona returns', async () => {
		respond({ data: { ...account, attributes: { 'redacted-at': 'now' } } });
		const result = (await invoke(Accounts.redact, {
			accountId: account.id,
		})) as { data: { id: string } };
		expect(result.data.id).toBe(account.id);
		expectAuthenticated(`/accounts/${account.id}`, 'DELETE');
	});

	it('search posts the predicate query, sort and page', async () => {
		respond({ data: [account], links: LINKS });
		await invoke(Accounts.search, {
			query: { attribute: 'reference-id', operator: 'eq', value: 'user-42' },
			page: { size: 5 },
		});
		expectAuthenticated('/accounts/search', 'POST');
		expect(sentBody()).toEqual({
			query: { attribute: 'reference-id', operator: 'eq', value: 'user-42' },
			page: { size: 5 },
		});
	});

	it('addTag and removeTag send { meta: { tag-name } } and read the account', async () => {
		respond({ data: account });
		const result = (await invoke(Accounts.addTag, {
			accountId: account.id,
			tagName: 'vip',
		})) as { data: { attributes?: { tags?: string[] } } };
		expect(result.data.attributes?.tags).toEqual(['vip']);
		expectAuthenticated(`/accounts/${account.id}/add-tag`, 'POST');
		expect(sentBody()).toEqual({ meta: { 'tag-name': 'vip' } });

		respond({ data: account });
		await invoke(Accounts.removeTag, { accountId: account.id, tagId: 'tag_1' });
		expectAuthenticated(`/accounts/${account.id}/remove-tag`, 'POST');
		expect(sentBody()).toEqual({ meta: { 'tag-id': 'tag_1' } });
	});

	it('addTag needs a tag name or id', async () => {
		await expect(
			invoke(Accounts.addTag, { accountId: account.id }),
		).rejects.toThrow('tagName or tagId');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('inquiries', () => {
	it('list sends the documented filter params', async () => {
		respond({ data: [inquiry], links: LINKS });
		await invoke(Inquiries.list, {
			status: 'completed,needs_review',
			inquiryTemplateId: 'itmpl_1',
			pageSize: 10,
		});
		expectAuthenticated('/inquiries');
		expect(lastRequest().query).toEqual({
			'page[size]': '10',
			'filter[status]': 'completed,needs_review',
			'filter[inquiry-template-id]': 'itmpl_1',
		});
	});

	it('create sends data.attributes and meta', async () => {
		respond({ data: inquiry, meta: {} }, 201);
		await invoke(Inquiries.create, {
			attributes: {
				'inquiry-template-id': 'itmpl_1',
				'reference-id': 'user-42',
			},
			meta: { 'auto-create-account': false },
		});
		expectAuthenticated('/inquiries', 'POST');
		expect(sentBody()).toEqual({
			data: {
				attributes: {
					'inquiry-template-id': 'itmpl_1',
					'reference-id': 'user-42',
				},
			},
			meta: { 'auto-create-account': false },
		});
	});

	it('update PATCHes the attributes', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.update, {
			inquiryId: inquiry.id,
			attributes: { note: 'checked' },
		});
		expectAuthenticated(`/inquiries/${inquiry.id}`, 'PATCH');
		expect(sentBody()).toEqual({ data: { attributes: { note: 'checked' } } });
	});

	it('redact reads the redacted inquiry', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.redact, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}`, 'DELETE');
	});

	it('approve and decline send an optional meta.comment', async () => {
		respond({ data: { ...inquiry, attributes: { status: 'approved' } } });
		await invoke(Inquiries.approve, { inquiryId: inquiry.id, comment: 'ok' });
		expectAuthenticated(`/inquiries/${inquiry.id}/approve`, 'POST');
		expect(sentBody()).toEqual({ meta: { comment: 'ok' } });

		respond({ data: { ...inquiry, attributes: { status: 'declined' } } });
		await invoke(Inquiries.decline, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}/decline`, 'POST');
		expect(lastRequest().body).toBeUndefined();
	});

	it('markForReview posts with no body', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.markForReview, { inquiryId: inquiry.id });
		expectAuthenticated(`/inquiries/${inquiry.id}/mark-for-review`, 'POST');
	});

	it('generateOneTimeLink reads the link from meta', async () => {
		respond({ data: inquiry, meta: oneTimeLinkMeta });
		const result = (await invoke(Inquiries.generateOneTimeLink, {
			inquiryId: inquiry.id,
			expiresInSeconds: 600,
		})) as { meta: { 'one-time-link'?: string } };
		expect(result.meta['one-time-link']).toBe(oneTimeLinkMeta['one-time-link']);
		expectAuthenticated(
			`/inquiries/${inquiry.id}/generate-one-time-link`,
			'POST',
		);
		expect(sentBody()).toEqual({ meta: { 'expires-in-seconds': 600 } });
	});

	it('addTag and removeTag send meta.tag-name', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.addTag, { inquiryId: inquiry.id, tagName: 'vip' });
		expectAuthenticated(`/inquiries/${inquiry.id}/add-tag`, 'POST');
		expect(sentBody()).toEqual({ meta: { 'tag-name': 'vip' } });

		respond({ data: inquiry });
		await invoke(Inquiries.removeTag, {
			inquiryId: inquiry.id,
			tagName: 'vip',
		});
		expectAuthenticated(`/inquiries/${inquiry.id}/remove-tag`, 'POST');
	});
});

describe('inquiry sessions', () => {
	it('create sends the inquiry id', async () => {
		respond({ data: inquirySession }, 201);
		await invoke(InquirySessions.create, { inquiryId: inquiry.id });
		expectAuthenticated('/inquiry-sessions', 'POST');
		expect(sentBody()).toEqual({
			data: { attributes: { 'inquiry-id': inquiry.id } },
		});
	});

	it('get and expire', async () => {
		respond({ data: inquirySession });
		await invoke(InquirySessions.get, { inquirySessionId: inquirySession.id });
		expectAuthenticated(`/inquiry-sessions/${inquirySession.id}`);

		respond({ data: { ...inquirySession, attributes: { status: 'expired' } } });
		await invoke(InquirySessions.expire, {
			inquirySessionId: inquirySession.id,
		});
		expectAuthenticated(
			`/inquiry-sessions/${inquirySession.id}/expire`,
			'POST',
		);
	});

	it('expireAll sends meta.inquiry-ids and reads the expired sessions', async () => {
		respond({ data: [inquirySession] });
		const result = (await invoke(InquirySessions.expireAll, {
			inquiryIds: [inquiry.id],
		})) as { data: unknown[] }; // unknown: session records are provider-shaped
		expect(result.data).toHaveLength(1);
		expectAuthenticated('/inquiry-sessions/expire-all', 'POST');
		expect(sentBody()).toEqual({ meta: { 'inquiry-ids': [inquiry.id] } });
	});

	it('generateOneTimeLink reads the link from meta', async () => {
		respond({ data: inquirySession, meta: oneTimeLinkMeta });
		const result = (await invoke(InquirySessions.generateOneTimeLink, {
			inquirySessionId: inquirySession.id,
		})) as { meta: { 'one-time-link-short'?: string } };
		expect(result.meta['one-time-link-short']).toBe('https://perso.na/abc');
		expectAuthenticated(
			`/inquiry-sessions/${inquirySession.id}/generate-one-time-link`,
			'POST',
		);
	});
});

describe('inquiry templates', () => {
	it('list, get and listVersions', async () => {
		respond({ data: [inquiryTemplate], links: LINKS });
		await invoke(InquiryTemplates.list, {});
		expectAuthenticated('/inquiry-templates');

		respond({ data: inquiryTemplate });
		await invoke(InquiryTemplates.get, { inquiryTemplateId: 'itmpl_1' });
		expectAuthenticated('/inquiry-templates/itmpl_1');

		respond({ data: [templateVersion], links: LINKS });
		await invoke(InquiryTemplates.listVersions, {
			inquiryTemplateId: 'itmpl_1',
		});
		expectAuthenticated('/inquiry-template-versions');
		expect(lastRequest().query).toEqual({
			'filter[inquiry-template-id]': 'itmpl_1',
		});
	});
});

describe('webhooks', () => {
	it('list reads webhooks of type "webhook"', async () => {
		respond({ data: [webhookConfig], links: LINKS });
		const page = (await invoke(Webhooks.list, {})) as {
			data: Array<{ attributes?: { status?: string } }>;
		};
		expect(page.data[0]?.attributes?.status).toBe('enabled');
		expectAuthenticated('/webhooks');
	});

	it('create sends the attributes and reads the secret', async () => {
		respond({ data: webhookWithSecret }, 201);
		const result = (await invoke(Webhooks.create, {
			attributes: {
				url: 'https://example.com/webhooks/persona',
				'enabled-events': ['inquiry.approved'],
			},
		})) as { data: { attributes?: { secret?: string } } };
		expect(result.data.attributes?.secret).toBe('wbhsec_new_value');
		expectAuthenticated('/webhooks', 'POST');
		expect(sentBody()).toEqual({
			data: {
				attributes: {
					url: 'https://example.com/webhooks/persona',
					'enabled-events': ['inquiry.approved'],
				},
			},
		});
	});

	it('get reads one webhook', async () => {
		respond({ data: webhookConfig });
		const result = (await invoke(Webhooks.get, {
			webhookId: webhookConfig.id,
		})) as { data: { id: string; attributes?: { url?: string } } };
		expect(result.data.id).toBe(webhookConfig.id);
		expect(result.data.attributes?.url).toBe(
			'https://example.com/webhooks/persona',
		);
		expectAuthenticated(`/webhooks/${webhookConfig.id}`);
	});

	it('update PATCHes the attributes', async () => {
		respond({ data: webhookConfig });
		await invoke(Webhooks.update, {
			webhookId: webhookConfig.id,
			attributes: { name: 'Renamed' },
		});
		expectAuthenticated(`/webhooks/${webhookConfig.id}`, 'PATCH');
		expect(sentBody()).toEqual({ data: { attributes: { name: 'Renamed' } } });
	});

	it('enable, disable and archive post to their routes', async () => {
		for (const [endpoint, route] of [
			[Webhooks.enable, 'enable'],
			[Webhooks.disable, 'disable'],
			[Webhooks.archive, 'archive'],
		] as const) {
			respond({ data: webhookConfig });
			await invoke(endpoint, { webhookId: webhookConfig.id });
			expectAuthenticated(`/webhooks/${webhookConfig.id}/${route}`, 'POST');
		}
	});

	it('rotateSecret sends meta.expires-in-seconds and keeps the secret out of the log', async () => {
		respond({ data: webhookWithSecret });
		await invoke(Webhooks.rotateSecret, {
			webhookId: webhookConfig.id,
			expiresInSeconds: 3600,
		});
		expectAuthenticated(`/webhooks/${webhookConfig.id}/rotate-secret`, 'POST');
		expect(sentBody()).toEqual({ meta: { 'expires-in-seconds': 3600 } });
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('wbhsec_');
	});

	it('searchEvents posts the search body', async () => {
		respond({ data: [{ type: 'webhook-event', id: 'whev_1' }], links: LINKS });
		await invoke(Webhooks.searchEvents, {
			sort: { attribute: 'updated_at', direction: 'desc' },
		});
		expectAuthenticated('/webhook-events/search', 'POST');
		expect(sentBody()).toEqual({
			sort: { attribute: 'updated_at', direction: 'desc' },
		});
	});
});
