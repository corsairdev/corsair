import {
	activitySearchOk,
	batchOk,
	cancelScheduledOk,
	domainsAddOk,
	domainsListOk,
	domainsRemoveOk,
	domainsVerifyOk,
	scheduledSearchOk,
	sendMimeOk,
	sendOk,
	sentSearchOk,
	statsBouncesOk,
	statsCycleOk,
	statsHistoryOk,
	statsSpamOk,
	statsSummaryOk,
	statsUnsubsOk,
	suppressionAddOk,
	suppressionListOk,
	suppressionRemoveOk,
	templateAddOk,
	templateDeleteOk,
	templateEditOk,
	templateSearchOk,
	templateViewOk,
	webhookAddOk,
	webhookEditOk,
	webhookRemoveOk,
	webhookViewOk,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// One test per operation: the URL, the method, the auth header and every
// body field the operation sends.
describe('SMTP2GO request shapes', () => {
	it('email.send posts the message fields to /email/send', async () => {
		mockFetch(ok(sendOk));

		await endpoints.email.send(makeCtx(), {
			sender: 'John Smith <john@example.com>',
			to: ['Jane Jones <jane@example.com>'],
			subject: 'My Test Email',
			html_body: '<h1>Test</h1>',
			text_body: 'Test',
			custom_headers: [{ header: 'Reply-To', value: 'reply@example.com' }],
			attachments: [
				{
					filename: 'report.pdf',
					fileblob: 'bm90IGFjdHVhbGx5IGEgcGRm',
					mimetype: 'application/pdf',
				},
			],
		});

		expect(lastCall().url).toBe(`${BASE}/email/send`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('X-Smtp2go-Api-Key')).toBe(
			'api-testkey000000000000000000000001',
		);
		expect(sentBody()).toEqual({
			sender: 'John Smith <john@example.com>',
			to: ['Jane Jones <jane@example.com>'],
			subject: 'My Test Email',
			html_body: '<h1>Test</h1>',
			text_body: 'Test',
			custom_headers: [{ header: 'Reply-To', value: 'reply@example.com' }],
			attachments: [
				{
					filename: 'report.pdf',
					fileblob: 'bm90IGFjdHVhbGx5IGEgcGRm',
					mimetype: 'application/pdf',
				},
			],
		});
	});

	it('email.send omits every unset field', async () => {
		mockFetch(ok(sendOk));

		await endpoints.email.send(makeCtx(), {
			sender: 'John Smith <john@example.com>',
			to: ['jane@example.com'],
			text_body: 'Test',
		});

		expect(sentBody()).toEqual({
			sender: 'John Smith <john@example.com>',
			to: ['jane@example.com'],
			text_body: 'Test',
		});
	});

	it('email.sendMime posts the raw MIME string to /email/mime', async () => {
		mockFetch(ok(sendMimeOk));

		await endpoints.email.sendMime(makeCtx(), {
			mime_email: 'MIME-Version: 1.0\r\nSubject: hi\r\n',
			fastaccept: true,
		});

		expect(lastCall().url).toBe(`${BASE}/email/mime`);
		expect(sentBody()).toEqual({
			mime_email: 'MIME-Version: 1.0\r\nSubject: hi\r\n',
			fastaccept: true,
		});
	});

	it('email.sendBatch posts the messages array to /email/batch', async () => {
		mockFetch(ok(batchOk));

		await endpoints.email.sendBatch(makeCtx(), {
			emails: [
				{ sender: 'a@example.com', to: ['b@example.com'], text_body: 'one' },
				{
					sender: 'a@example.com',
					to: ['c@example.com'],
					html_body: '<p>two</p>',
				},
			],
		});

		expect(lastCall().url).toBe(`${BASE}/email/batch`);
		expect(sentBody()).toEqual({
			emails: [
				{ sender: 'a@example.com', to: ['b@example.com'], text_body: 'one' },
				{
					sender: 'a@example.com',
					to: ['c@example.com'],
					html_body: '<p>two</p>',
				},
			],
		});
	});

	it('email.searchSent posts its filters to /email/search', async () => {
		mockFetch(ok(sentSearchOk));

		await endpoints.email.searchSent(makeCtx(), {
			start_date: '2024-01-01',
			end_date: '2024-02-01',
			email_id: ['1u0SwL-B9zBpi9ffUq-JAB2'],
			limit: 500,
			status_counts: true,
			continue_token: 'tok-1',
		});

		expect(lastCall().url).toBe(`${BASE}/email/search`);
		expect(sentBody()).toEqual({
			start_date: '2024-01-01',
			end_date: '2024-02-01',
			email_id: ['1u0SwL-B9zBpi9ffUq-JAB2'],
			limit: 500,
			status_counts: true,
			continue_token: 'tok-1',
		});
	});

	it('email.searchScheduled posts its filters to /email/scheduled/search', async () => {
		mockFetch(ok(scheduledSearchOk));

		await endpoints.email.searchScheduled(makeCtx(), { limit: 50, page: 2 });

		expect(lastCall().url).toBe(`${BASE}/email/scheduled/search`);
		expect(sentBody()).toEqual({ limit: 50, page: 2 });
	});

	it('email.cancelScheduled posts the schedule_id to /email/scheduled/remove', async () => {
		mockFetch(ok(cancelScheduledOk));

		await endpoints.email.cancelScheduled(makeCtx(), {
			schedule_id: '4d3b03a7-8663-4592-899a-b479ba6fcba9',
		});

		expect(lastCall().url).toBe(`${BASE}/email/scheduled/remove`);
		expect(sentBody()).toEqual({
			schedule_id: '4d3b03a7-8663-4592-899a-b479ba6fcba9',
		});
	});

	it('activity.search posts its filters to /activity/search', async () => {
		mockFetch(ok(activitySearchOk));

		await endpoints.activity.search(makeCtx(), {
			event_types: ['delivered', 'opened'],
			search_subject: 'invoice',
			limit: 100,
			region: 'eu',
		});

		expect(lastCall().url).toBe(`${BASE}/activity/search`);
		expect(sentBody()).toEqual({
			event_types: ['delivered', 'opened'],
			search_subject: 'invoice',
			limit: 100,
			region: 'eu',
		});
	});

	it('suppressions.list posts its filters to /suppression/view', async () => {
		mockFetch(ok(suppressionListOk));

		await endpoints.suppressions.list(makeCtx(), {
			suppression_types: ['spam'],
			limit: 10,
			continue_token: 'tok-2',
		});

		expect(lastCall().url).toBe(`${BASE}/suppression/view`);
		expect(sentBody()).toEqual({
			suppression_types: ['spam'],
			limit: 10,
			continue_token: 'tok-2',
		});
	});

	it('suppressions.add posts the address to /suppression/add', async () => {
		mockFetch(ok(suppressionAddOk));

		await endpoints.suppressions.add(makeCtx(), {
			email_address: 'temp@example.com',
			block_description: 'complained twice',
		});

		expect(lastCall().url).toBe(`${BASE}/suppression/add`);
		expect(sentBody()).toEqual({
			email_address: 'temp@example.com',
			block_description: 'complained twice',
		});
	});

	it('suppressions.remove posts the address and reasons to /suppression/remove', async () => {
		mockFetch(ok(suppressionRemoveOk));

		await endpoints.suppressions.remove(makeCtx(), {
			email_address: 'temp@test.com',
			reasons: ['manual', 'spam'],
		});

		expect(lastCall().url).toBe(`${BASE}/suppression/remove`);
		expect(sentBody()).toEqual({
			email_address: 'temp@test.com',
			reasons: ['manual', 'spam'],
		});
	});

	it('domains.list posts to /domain/view', async () => {
		mockFetch(ok(domainsListOk));

		await endpoints.domains.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/domain/view`);
		expect(sentBody()).toEqual({});
	});

	it('domains.add posts the domain to /domain/add', async () => {
		mockFetch(ok(domainsAddOk));

		await endpoints.domains.add(makeCtx(), {
			domain: 'example.com',
			auto_verify: false,
		});

		expect(lastCall().url).toBe(`${BASE}/domain/add`);
		expect(sentBody()).toEqual({ domain: 'example.com', auto_verify: false });
	});

	it('domains.verify posts the domain to /domain/verify', async () => {
		mockFetch(ok(domainsVerifyOk));

		await endpoints.domains.verify(makeCtx(), { domain: 'example.com' });

		expect(lastCall().url).toBe(`${BASE}/domain/verify`);
		expect(sentBody()).toEqual({ domain: 'example.com' });
	});

	it('domains.remove posts the domain to /domain/remove', async () => {
		mockFetch(ok(domainsRemoveOk));

		await endpoints.domains.remove(makeCtx(), { domain: 'example.com' });

		expect(lastCall().url).toBe(`${BASE}/domain/remove`);
		expect(sentBody()).toEqual({ domain: 'example.com' });
	});

	it('stats.bounces posts to /stats/email_bounces', async () => {
		mockFetch(ok(statsBouncesOk));

		await endpoints.stats.bounces(makeCtx(), {
			username: 'smtpuser@example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/stats/email_bounces`);
		expect(sentBody()).toEqual({ username: 'smtpuser@example.com' });
	});

	it('stats.cycle posts an empty body to /stats/email_cycle', async () => {
		mockFetch(ok(statsCycleOk));

		await endpoints.stats.cycle(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/stats/email_cycle`);
		expect(sentBody()).toEqual({});
	});

	it('stats.spam posts to /stats/email_spam', async () => {
		mockFetch(ok(statsSpamOk));

		await endpoints.stats.spam(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/stats/email_spam`);
		expect(sentBody()).toEqual({});
	});

	it('stats.unsubscribes posts to /stats/email_unsubs', async () => {
		mockFetch(ok(statsUnsubsOk));

		await endpoints.stats.unsubscribes(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/stats/email_unsubs`);
		expect(sentBody()).toEqual({});
	});

	it('stats.history posts its window to /stats/email_history', async () => {
		mockFetch(ok(statsHistoryOk));

		await endpoints.stats.history(makeCtx(), {
			group_by: 'email_address',
			start_date: '2024-01-01',
			end_date: '2024-01-31',
		});

		expect(lastCall().url).toBe(`${BASE}/stats/email_history`);
		expect(sentBody()).toEqual({
			group_by: 'email_address',
			start_date: '2024-01-01',
			end_date: '2024-01-31',
		});
	});

	it('stats.summary posts to /stats/email_summary', async () => {
		mockFetch(ok(statsSummaryOk));

		await endpoints.stats.summary(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/stats/email_summary`);
		expect(sentBody()).toEqual({});
	});

	it('templates.list posts its paging to /template/search', async () => {
		mockFetch(ok(templateSearchOk));

		await endpoints.templates.list(makeCtx(), {
			page_size: 25,
			continue_token: 'tok-3',
		});

		expect(lastCall().url).toBe(`${BASE}/template/search`);
		expect(sentBody()).toEqual({ page_size: 25, continue_token: 'tok-3' });
	});

	it('templates.view posts the id to /template/view', async () => {
		mockFetch(ok(templateViewOk));

		await endpoints.templates.view(makeCtx(), { id: '5355878' });

		expect(lastCall().url).toBe(`${BASE}/template/view`);
		expect(sentBody()).toEqual({ id: '5355878' });
	});

	it('templates.add posts the caller-chosen id to /template/add', async () => {
		mockFetch(ok(templateAddOk));

		await endpoints.templates.add(makeCtx(), {
			id: 'order-receipt',
			template_name: 'Order receipt',
			subject: 'Receipt',
			html_body: '<p>{{ product_name }}</p>',
			text_body: '{{ product_name }}',
			tags: ['receipts'],
		});

		expect(lastCall().url).toBe(`${BASE}/template/add`);
		expect(sentBody()).toEqual({
			id: 'order-receipt',
			template_name: 'Order receipt',
			subject: 'Receipt',
			html_body: '<p>{{ product_name }}</p>',
			text_body: '{{ product_name }}',
			tags: ['receipts'],
		});
	});

	it('templates.edit posts the id and fields to /template/edit', async () => {
		mockFetch(ok(templateEditOk));

		await endpoints.templates.edit(makeCtx(), {
			id: '5355878',
			subject: 'New subject',
		});

		expect(lastCall().url).toBe(`${BASE}/template/edit`);
		expect(sentBody()).toEqual({ id: '5355878', subject: 'New subject' });
	});

	it('templates.delete posts the id to /template/delete', async () => {
		mockFetch(ok(templateDeleteOk));

		await endpoints.templates.delete(makeCtx(), { id: '5355878' });

		expect(lastCall().url).toBe(`${BASE}/template/delete`);
		expect(sentBody()).toEqual({ id: '5355878' });
	});

	it('webhooks.list posts to /webhook/view', async () => {
		mockFetch(ok({ ...webhookViewOk, data: [webhookViewOk.data] }));

		await endpoints.webhooks.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/webhook/view`);
		expect(sentBody()).toEqual({});
	});

	it('webhooks.add posts the registration to /webhook/add', async () => {
		mockFetch(ok(webhookAddOk));

		await endpoints.webhooks.add(makeCtx(), {
			url: 'https://example.com/test-webhook',
			events: ['processed'],
			output_format: 'json',
		});

		expect(lastCall().url).toBe(`${BASE}/webhook/add`);
		expect(sentBody()).toEqual({
			url: 'https://example.com/test-webhook',
			events: ['processed'],
			output_format: 'json',
		});
	});

	it('webhooks.edit posts the id and fields to /webhook/edit', async () => {
		mockFetch(ok(webhookEditOk));

		await endpoints.webhooks.edit(makeCtx(), {
			id: 4320,
			url: 'https://example.com/test-webhook',
			disabled: true,
		});

		expect(lastCall().url).toBe(`${BASE}/webhook/edit`);
		expect(sentBody()).toEqual({
			id: 4320,
			url: 'https://example.com/test-webhook',
			disabled: true,
		});
	});

	it('webhooks.remove posts the id to /webhook/remove', async () => {
		mockFetch(ok(webhookRemoveOk));

		await endpoints.webhooks.remove(makeCtx(), { id: 4317 });

		expect(lastCall().url).toBe(`${BASE}/webhook/remove`);
		expect(sentBody()).toEqual({ id: 4317 });
	});
});
