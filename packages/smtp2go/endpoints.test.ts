import { logEventFromContext } from 'corsair/core';
import {
	isSmtp2goAuthError,
	Smtp2goEnvelopeError,
	smtp2goErrorCode,
} from './client';
import {
	activitySearchOk,
	bareError,
	batchOk,
	cancelScheduledOk,
	domainsAddOk,
	domainsListOk,
	domainsRemoveOk,
	domainsVerifyOk,
	fieldValidationError,
	missingKeyError,
	modelValidationError,
	scheduledSearchOk,
	sendMimeOk,
	sendOk,
	sendPartialFailure,
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
	templateSearchOk,
	templateViewOk,
	webhookAddOk,
	webhookEditOk,
	webhookRemoveOk,
	webhookViewOk,
} from './test-fixtures';
import {
	captureError,
	currentFetch,
	endpoints,
	errorResponse,
	installFetchMock,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
} from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// Negative cases pass values no schema accepts; the rejection reason is
// narrowed to an Error here so tests assert on name and message.
async function rejectsWith<T>(promise: Promise<T>): Promise<Error> {
	return (await captureError(promise)) as Error;
}

describe('output parsing per operation', () => {
	it('email.send keeps the per-recipient accounting visible', async () => {
		mockFetch(ok(sendOk));
		const result = await endpoints.email.send(makeCtx(), {
			sender: 'a@example.com',
			to: ['b@example.com'],
			text_body: 'hi',
		});
		expect(result.data.succeeded).toBe(1);
		expect(result.data.failed).toBe(0);
		expect(result.data.email_id).toBe('1u0SwL-B9zBpi9ffUq-JAB2');
	});

	it('email.send reports a partial failure at HTTP 200 instead of success', async () => {
		mockFetch(ok(sendPartialFailure));
		const result = await endpoints.email.send(makeCtx(), {
			sender: 'a@example.com',
			to: ['b@example.com'],
			text_body: 'hi',
		});
		expect(result.data.failed).toBe(1);
		expect(result.data.failures).toEqual(['bad@example.com: rejected']);
	});

	it('email.send keeps template_data as an object in the body', async () => {
		mockFetch(ok(sendPartialFailure));
		await endpoints.email.send(makeCtx(), {
			sender: 'a@example.com',
			to: ['b@example.com'],
			template_id: '1234',
			template_data: { name: 'Ada', items: [1, 2] },
		});
		expect(
			JSON.parse(String(currentFetch().mock.calls[0]?.[1]?.body)).template_data,
		).toEqual({ name: 'Ada', items: [1, 2] });
	});

	it('suppression and webhook events carry no address or URL', async () => {
		// logEventFromContext is mocked in this file: read what it was given.
		const logEvent = jest.mocked(logEventFromContext);
		logEvent.mockClear();
		const ctx = makeCtx();
		mockFetch(ok(suppressionAddOk));
		await endpoints.suppressions.add(ctx, {
			email_address: 'secret@example.com',
		});
		mockFetch(ok(suppressionRemoveOk));
		await endpoints.suppressions.remove(ctx, {
			email_address: 'secret@example.com',
		});
		mockFetch(ok(webhookAddOk));
		await endpoints.webhooks.add(ctx, {
			url: 'https://user:pass@example.com/hook?token=abc',
		});
		expect(logEvent).toHaveBeenCalledTimes(3);
		const text = JSON.stringify(logEvent.mock.calls.map((call) => call[2]));
		expect(text).not.toContain('secret@example.com');
		expect(text).not.toContain('token=abc');
		expect(text).not.toContain('user:pass');
	});

	it('email.sendMime parses the send accounting', async () => {
		mockFetch(ok(sendMimeOk));
		const result = await endpoints.email.sendMime(makeCtx(), {
			mime_email: 'MIME...',
		});
		expect(result.data.succeeded).toBe(1);
	});

	it('email.sendBatch parses one entry per message', async () => {
		mockFetch(ok(batchOk));
		const result = await endpoints.email.sendBatch(makeCtx(), {
			emails: [
				{ sender: 'a@example.com', to: ['b@example.com'], text_body: 'one' },
				{ sender: 'a@example.com', to: ['c@example.com'], text_body: 'two' },
			],
		});
		expect(result.data).toHaveLength(2);
		expect(result.data[0]!.email_id).toBe('123456-1234-12');
		expect(result.data[1]!.schedule_id).toBe(
			'188262b6-f6cc-4c98-bbe6-84c39d1c0ef4',
		);
	});

	it('email.searchSent keeps the page and the next token', async () => {
		mockFetch(ok(sentSearchOk));
		const result = await endpoints.email.searchSent(makeCtx(), { limit: 100 });
		expect(result.data.emails).toHaveLength(1);
		expect(result.data.count).toBe(1);
		expect(result.data.continue_token).toBeNull();
	});

	it('email.searchScheduled parses the bare array answer', async () => {
		mockFetch(ok(scheduledSearchOk));
		const result = await endpoints.email.searchScheduled(makeCtx(), {});
		expect(result.data).toHaveLength(2);
		expect(result.data[0]!.schedule_id).toBe(
			'4d3b03a7-8663-4592-899a-b479ba6fcba9',
		);
	});

	it('email.cancelScheduled parses the undocumented object answer', async () => {
		mockFetch(ok(cancelScheduledOk));
		const result = await endpoints.email.cancelScheduled(makeCtx(), {
			schedule_id: '4d3b03a7-8663-4592-899a-b479ba6fcba9',
		});
		expect(result.data).toMatchObject({ removed: true });
	});

	it('activity.search keeps events and totals', async () => {
		mockFetch(ok(activitySearchOk));
		const result = await endpoints.activity.search(makeCtx(), { limit: 10 });
		expect(result.data.events).toHaveLength(1);
		expect(result.data.events[0]!.event).toBe('delivered');
		expect(result.data.total_events).toBe(1);
	});

	it('suppressions.list keeps rows and paging', async () => {
		mockFetch(ok(suppressionListOk));
		const result = await endpoints.suppressions.list(makeCtx(), {});
		expect(result.data.results).toHaveLength(1);
		expect(result.data.results[0]!.reason).toBe('manual');
		expect(result.data.total_results).toBe(1);
	});

	it('suppressions.add parses the confirmation', async () => {
		mockFetch(ok(suppressionAddOk));
		const result = await endpoints.suppressions.add(makeCtx(), {
			email_address: 'temp@example.com',
		});
		expect(result.data.added).toBe(true);
	});

	it('suppressions.remove parses per-reason outcomes', async () => {
		mockFetch(ok(suppressionRemoveOk));
		const result = await endpoints.suppressions.remove(makeCtx(), {
			email_address: 'temp@test.com',
		});
		expect(result.data.suppressions).toHaveLength(2);
		expect(result.data.suppressions[0]!.removed).toBe(true);
		expect(result.data.suppressions[1]!.removed).toBe(false);
	});

	it('domains.list keeps DKIM and tracker state', async () => {
		mockFetch(ok(domainsListOk));
		const result = await endpoints.domains.list(makeCtx(), {});
		expect(result.data.domains[0]!.domain?.fulldomain).toBe('example.com');
		expect(result.data.domains[0]!.domain?.dkim_verified).toBe(true);
		expect(result.data.domains[0]!.trackers?.[0]!.cname_verified).toBe(true);
	});

	it('domains.add, verify and remove parse the domains array', async () => {
		mockFetch(ok(domainsAddOk));
		const added = await endpoints.domains.add(makeCtx(), {
			domain: 'example.com',
		});
		expect(added.data.domains).toHaveLength(1);

		mockFetch(ok(domainsVerifyOk));
		const verified = await endpoints.domains.verify(makeCtx(), {
			domain: 'example.com',
		});
		expect(verified.data.domains[0]!.domain?.dkim_verified).toBe(true);

		mockFetch(ok(domainsRemoveOk));
		const removed = await endpoints.domains.remove(makeCtx(), {
			domain: 'example.com',
		});
		expect(removed.data?.domains).toEqual([]);
	});

	it('stats.cycle keeps the plan counts', async () => {
		mockFetch(ok(statsCycleOk));
		const result = await endpoints.stats.cycle(makeCtx(), {});
		expect(result.data.cycle_used).toBe(1);
		expect(result.data.cycle_remaining).toBe(9999);
	});

	it('stats.bounces, spam, unsubscribes keep their counts', async () => {
		mockFetch(ok(statsBouncesOk));
		expect((await endpoints.stats.bounces(makeCtx(), {})).data.emails).toBe(1);

		mockFetch(ok(statsSpamOk));
		expect((await endpoints.stats.spam(makeCtx(), {})).data.spams).toBe(0);

		mockFetch(ok(statsUnsubsOk));
		expect(
			(await endpoints.stats.unsubscribes(makeCtx(), {})).data.unsubscribes,
		).toBe(0);
	});

	it('stats.history keeps the rows', async () => {
		mockFetch(ok(statsHistoryOk));
		const result = await endpoints.stats.history(makeCtx(), {
			group_by: 'email_address',
		});
		expect(result.data.history[0]!.email_address).toBe('test3@example.com');
	});

	it('stats.summary keeps the combined report', async () => {
		mockFetch(ok(statsSummaryOk));
		const result = await endpoints.stats.summary(makeCtx(), {});
		expect(result.data.cycle_max).toBe(10000);
		expect(result.data.bounce_percent).toBe('0.00');
	});

	it('templates.list keeps the page and token', async () => {
		mockFetch(ok(templateSearchOk));
		const result = await endpoints.templates.list(makeCtx(), {
			page_size: 100,
		});
		expect(result.data.templates).toHaveLength(1);
		expect(result.data.templates[0]!.name).toBe('Order receipt');
		expect(result.data.total_count).toBe(1);
	});

	it('templates.view keeps the bodies', async () => {
		mockFetch(ok(templateViewOk));
		const result = await endpoints.templates.view(makeCtx(), { id: 'testid' });
		expect(result.data.html_body).toContain('{{ variable }}');
	});

	it('templates.add and edit parse the template', async () => {
		mockFetch(ok(templateAddOk));
		const added = await endpoints.templates.add(makeCtx(), {
			id: 'order-receipt',
			template_name: 'Order receipt',
			subject: 'Receipt',
			html_body: '<p>hi</p>',
			text_body: 'hi',
		});
		expect(added.data.id).toBe('testid');

		mockFetch(ok(templateAddOk));
		const edited = await endpoints.templates.edit(makeCtx(), { id: 'testid' });
		expect(edited.data.template_name).toBe('Shiny new name');
	});

	it('templates.delete parses the confirmation string', async () => {
		mockFetch(ok(templateDeleteOk));
		const result = await endpoints.templates.delete(makeCtx(), {
			id: 'example',
		});
		expect(result.data).toBe("Successfully deleted template 'example'");
	});

	it('webhooks operations parse the registration object', async () => {
		// /webhook/view answers an array of registrations (live, 11-28).
		mockFetch(ok({ ...webhookViewOk, data: [webhookViewOk.data] }));
		const listed = await endpoints.webhooks.list(makeCtx(), {});
		expect(listed.data?.[0]?.id).toBe(4317);
		expect(listed.data?.[0]?.events).toEqual(['spam']);

		mockFetch(ok(webhookAddOk));
		const added = await endpoints.webhooks.add(makeCtx(), {
			url: 'https://example.com/test-webhook',
		});
		expect(added.data.headers).toBe('X-Test-Header');

		mockFetch(ok(webhookEditOk));
		const edited = await endpoints.webhooks.edit(makeCtx(), {
			id: 4320,
			url: 'https://example.com/test-webhook',
		});
		expect(edited.data.output_format).toBe('form');

		mockFetch(ok(webhookRemoveOk));
		const removed = await endpoints.webhooks.remove(makeCtx(), { id: 4317 });
		expect(removed.data.id).toBe(4317);
	});
});

describe('rejections', () => {
	it('rejects a wrong-shaped payload: a list answer missing its array', async () => {
		mockFetch(ok({ request_id: 'req-test', data: { count: 1, emails: {} } }));
		const error = await rejectsWith(endpoints.email.searchSent(makeCtx(), {}));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a malformed known field: a string count', async () => {
		mockFetch(
			ok({
				...statsCycleOk,
				data: { ...statsCycleOk.data, cycle_used: 'many' },
			}),
		);
		const error = await rejectsWith(endpoints.stats.cycle(makeCtx(), {}));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a template delete whose data is not the confirmation string', async () => {
		mockFetch(ok({ request_id: 'x', data: { deleted: true } }));
		const error = await rejectsWith(
			endpoints.templates.delete(makeCtx(), { id: 'x' }),
		);
		expect(error.name).toBe('ZodError');
	});

	it('fails loudly on a 200 that still carries data.error', async () => {
		mockFetch(ok({ request_id: 'req-test', data: modelValidationError.data }));
		const error = await rejectsWith(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: ['b@example.com'],
				text_body: 'hi',
			}),
		);
		expect(error).toBeInstanceOf(Smtp2goEnvelopeError);
		expect((error as Smtp2goEnvelopeError).message).toContain('2xx');
	});

	it('fails loudly on a bare error body', async () => {
		mockFetch(errorResponse(400, bareError));
		const error = await rejectsWith(endpoints.stats.cycle(makeCtx(), {}));
		expect(smtp2goErrorCode(error)).toBe('E_ApiResponseCodes.API_EXCEPTION');
	});

	it('rejects a send with no body at all before spending the call', async () => {
		const error = await rejectsWith(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: ['b@example.com'],
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(error.message).toContain('text_body');
	});

	it('rejects a send with neither text_body, html_body nor template_id', async () => {
		const error = await rejectsWith(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: ['b@example.com'],
				subject: 'no body',
			}),
		);
		expect(error.message).toContain(
			"'text_body', 'html_body' or 'template_id'",
		);
	});

	it('rejects an attachment with neither fileblob nor url', async () => {
		const error = await rejectsWith(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: ['b@example.com'],
				text_body: 'hi',
				attachments: [{ filename: 'report.pdf' }],
			}),
		);
		expect(error.message).toContain("'fileblob' or 'url'");
	});

	it('rejects more than 100 recipients', async () => {
		const error = await rejectsWith(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: Array.from({ length: 101 }, (_, i) => `r${i}@example.com`),
				text_body: 'hi',
			}),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a batch over the 1000-message cap', async () => {
		const error = await rejectsWith(
			endpoints.email.sendBatch(makeCtx(), {
				emails: Array.from({ length: 1001 }, () => ({
					sender: 'a@example.com',
					to: ['r@example.com'],
					text_body: 'hi',
				})),
			}),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a non-uuid schedule_id', async () => {
		const error = await rejectsWith(
			endpoints.email.cancelScheduled(makeCtx(), { schedule_id: 'not-a-uuid' }),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects an unknown activity region', async () => {
		const error = await rejectsWith(
			endpoints.activity.search(
				makeCtx(),
				// The runtime enum check still rejects the cast value.
				{ region: 'apac' as 'us' | 'eu' | 'au' },
			),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a searchSent limit over the documented 5000 cap', async () => {
		const error = await rejectsWith(
			endpoints.email.searchSent(makeCtx(), { limit: 5001 }),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a webhook output_format outside form/json', async () => {
		const error = await rejectsWith(
			endpoints.webhooks.add(makeCtx(), {
				url: 'https://example.com/hook',
				// The runtime enum check still rejects the cast value.
				output_format: 'xml' as 'form' | 'json',
			}),
		);
		expect(error.name).toBe('ZodError');
	});

	it('surfaces field validation errors from the 400 envelope', async () => {
		mockFetch(errorResponse(400, fieldValidationError));
		const error = await rejectsWith(endpoints.stats.cycle(makeCtx(), {}));
		expect(smtp2goErrorCode(error)).toBe(
			'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD',
		);
		expect(isSmtp2goAuthError(error)).toBe(false);
	});

	it('maps the missing-key 403 envelope onto an auth error', async () => {
		mockFetch(errorResponse(403, missingKeyError));
		const error = await rejectsWith(endpoints.stats.cycle(makeCtx(), {}));
		expect(isSmtp2goAuthError(error)).toBe(true);
		expect((error as { status?: number }).status).toBe(403);
	});
});
