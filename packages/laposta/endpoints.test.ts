import { campaigns, fields, lists, members, reports } from './endpoints';

describe('Laposta endpoints', () => {
	const originalFetch = globalThis.fetch;
	let capturedMethod = '';
	let capturedUrl = '';
	// `unknown` because payload is arbitrary json in mocked requests.
	let capturedBody: unknown = null;

	beforeEach(() => {
		capturedMethod = '';
		capturedUrl = '';
		capturedBody = null;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	function mockFetchResponse(body: unknown, status = 200) {
		globalThis.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			const req = new Request(input, init);
			capturedMethod = req.method;
			capturedUrl = req.url;
			const text = await req.text();
			capturedBody = text ? JSON.parse(text) : null;
			return new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' },
			});
		});
	}

	describe('lists endpoints', () => {
		it('lists.list calls GET /list', async () => {
			mockFetchResponse({ data: [{ list: { list_id: 'l1', name: 'General' } }] });
			const res = await lists.list({}, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/list');
			expect(res.data.length).toBe(1);
		});

		it('lists.get calls GET /list/:id', async () => {
			mockFetchResponse({ list: { list_id: 'l1', name: 'General' } });
			const res = await lists.get({ list_id: 'l1' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/list/l1');
			expect(res.list.name).toBe('General');
		});

		it('lists.create calls POST /list with body', async () => {
			mockFetchResponse({ list: { list_id: 'l2', name: 'Subscribers' } });
			const res = await lists.create({ name: 'Subscribers' }, 'test-key');
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v2/list');
			expect(capturedBody).toEqual({ name: 'Subscribers' });
			expect(res.list.list_id).toBe('l2');
		});

		it('lists.update calls POST /list/:id with body', async () => {
			mockFetchResponse({ list: { list_id: 'l1', name: 'VIP Subscribers' } });
			const res = await lists.update(
				{ list_id: 'l1', name: 'VIP Subscribers' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v2/list/l1');
			expect(capturedBody).toEqual({ name: 'VIP Subscribers' });
			expect(res.list.name).toBe('VIP Subscribers');
		});

		it('lists.delete calls DELETE /list/:id', async () => {
			mockFetchResponse({ list: { list_id: 'l1', state: 'deleted' } });
			const res = await lists.delete({ list_id: 'l1' }, 'test-key');
			expect(capturedMethod).toBe('DELETE');
			expect(capturedUrl).toContain('/v2/list/l1');
			expect(res.list.state).toBe('deleted');
		});
	});

	describe('members endpoints', () => {
		it('members.list calls GET /member with list_id and state', async () => {
			mockFetchResponse({ data: [{ member: { member_id: 'm1', email: 'a@example.com' } }] });
			const res = await members.list(
				{ list_id: 'l1', state: 'active' },
				'test-key',
			);
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/member');
			expect(capturedUrl).toContain('list_id=l1');
			expect(capturedUrl).toContain('state=active');
			expect(res.data.length).toBe(1);
		});

		it('members.get calls GET /member/:id with list_id', async () => {
			mockFetchResponse({ member: { member_id: 'm1', email: 'a@example.com' } });
			const res = await members.get(
				{ list_id: 'l1', member_id: 'm1' },
				'test-key',
			);
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/member/m1');
			expect(capturedUrl).toContain('list_id=l1');
			expect(res.member.email).toBe('a@example.com');
		});

		it('members.create calls POST /member with payload', async () => {
			mockFetchResponse({ member: { member_id: 'm2', email: 'b@example.com' } });
			const res = await members.create(
				{ list_id: 'l1', email: 'b@example.com' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v2/member');
			expect(capturedBody).toEqual({
				list_id: 'l1',
				email: 'b@example.com',
			});
			expect(res.member.member_id).toBe('m2');
		});

		it('members.update calls POST /member/:id with payload', async () => {
			mockFetchResponse({ member: { member_id: 'm1', state: 'unsubscribed' } });
			const res = await members.update(
				{ list_id: 'l1', member_id: 'm1', state: 'unsubscribed' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v2/member/m1');
			expect(capturedUrl).toContain('list_id=l1');
			expect(capturedBody).toEqual({ state: 'unsubscribed' });
			expect(res.member.state).toBe('unsubscribed');
		});

		it('members.delete calls DELETE /member/:id with list_id', async () => {
			mockFetchResponse({ member: { member_id: 'm1', state: 'deleted' } });
			const res = await members.delete(
				{ list_id: 'l1', member_id: 'm1' },
				'test-key',
			);
			expect(capturedMethod).toBe('DELETE');
			expect(capturedUrl).toContain('/v2/member/m1');
			expect(capturedUrl).toContain('list_id=l1');
			expect(res.member.state).toBe('deleted');
		});
	});

	describe('fields endpoints', () => {
		it('fields.list calls GET /field with list_id', async () => {
			mockFetchResponse({ data: [{ field: { field_id: 'f1', name: 'City' } }] });
			const res = await fields.list({ list_id: 'l1' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/field');
			expect(capturedUrl).toContain('list_id=l1');
			expect(res.data.length).toBe(1);
		});

		it('fields.get calls GET /field/:id with list_id', async () => {
			mockFetchResponse({ field: { field_id: 'f1', name: 'City' } });
			const res = await fields.get(
				{ list_id: 'l1', field_id: 'f1' },
				'test-key',
			);
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/field/f1');
			expect(capturedUrl).toContain('list_id=l1');
			expect(res.field.name).toBe('City');
		});

		it('fields.create calls POST /field with definition', async () => {
			mockFetchResponse({ field: { field_id: 'f2', name: 'Zipcode' } });
			const res = await fields.create(
				{ list_id: 'l1', name: 'Zipcode', datatype: 'text' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v2/field');
			expect(capturedBody).toEqual({
				list_id: 'l1',
				name: 'Zipcode',
				datatype: 'text',
			});
			expect(res.field.field_id).toBe('f2');
		});

		it('fields.delete calls DELETE /field/:id with list_id', async () => {
			mockFetchResponse({ field: { field_id: 'f1', state: 'deleted' } });
			const res = await fields.delete(
				{ list_id: 'l1', field_id: 'f1' },
				'test-key',
			);
			expect(capturedMethod).toBe('DELETE');
			expect(capturedUrl).toContain('/v2/field/f1');
			expect(capturedUrl).toContain('list_id=l1');
			expect(res.field.state).toBe('deleted');
		});
	});

	describe('campaigns and reports endpoints', () => {
		it('campaigns.list calls GET /campaign', async () => {
			mockFetchResponse({ data: [{ campaign: { campaign_id: 'c1', name: 'Weekly Newsletter' } }] });
			const res = await campaigns.list({}, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/campaign');
			expect(res.data.length).toBe(1);
		});

		it('campaigns.get calls GET /campaign/:id', async () => {
			mockFetchResponse({ campaign: { campaign_id: 'c1', name: 'Weekly Newsletter' } });
			const res = await campaigns.get({ campaign_id: 'c1' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/campaign/c1');
			expect(res.campaign.name).toBe('Weekly Newsletter');
		});

		it('reports.get calls GET /report/:id', async () => {
			mockFetchResponse({ report: { campaign_id: 'c1', sent: 1000, opens: 450 } });
			const res = await reports.get({ campaign_id: 'c1' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v2/report/c1');
			expect(res.report.sent).toBe(1000);
		});
	});
});
