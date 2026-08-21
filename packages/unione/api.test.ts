import { logEventFromContext } from 'corsair/core';
import { makeUnioneRequest, UnioneAPIError } from './client';
import { manage as domainManage } from './endpoints/domain';
import {
	cancel,
	eventGet,
	get,
	list,
	resend,
	resume,
	schedule,
	smtp,
	statistics,
	subscribe,
	unsubscribe,
} from './endpoints/email';
import { batch, retry } from './endpoints/email-validation';
import {
	create as eventDumpCreate,
	remove as eventDumpDelete,
	get as eventDumpGet,
	list as eventDumpList,
} from './endpoints/event-dump';
import {
	remove as suppressionDelete,
	get as suppressionGet,
	list as suppressionList,
} from './endpoints/suppression';
import { info } from './endpoints/system';
import { remove as tagDelete, list as tagList } from './endpoints/tag';
import {
	remove as templateDelete,
	get as templateGet,
	list as templateList,
	set as templateSet,
} from './endpoints/template';
import {
	remove as webhookDelete,
	get as webhookGet,
	set as webhookSet,
	types as webhookTypes,
} from './endpoints/webhook';
import type { UnioneContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeUnioneRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeUnioneRequest as jest.MockedFunction<
	typeof makeUnioneRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx(): UnioneContext {
	return {
		key: 'test-key',
		options: {},
		db: {},
	} as unknown as UnioneContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ status: 'success', dump_id: 'd1' });
	mockLogEvent.mockClear();
});

describe('Unione endpoints', () => {
	it('schedules email via email/send.json with send_at', async () => {
		await schedule(makeCtx(), {
			recipients: [{ email: 'user@example.com' }],
			from_email: 'from@example.com',
			subject: 'Hello',
			send_at: '2026-08-22 12:00:00',
			body: { html: '<p>Hi</p>' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'email/send.json',
			'test-key',
			expect.objectContaining({
				body: expect.objectContaining({
					message: expect.objectContaining({
						options: { send_at: '2026-08-22 12:00:00' },
					}),
				}),
			}),
		);
	});

	it('gets a send job by creating an event dump filtered by job_id', async () => {
		await get(makeCtx(), { job_id: '1ZymBc-00041N-9X' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('event-dump/create.json');
		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(
			expect.objectContaining({
				filter: { job_id: '1ZymBc-00041N-9X' },
			}),
		);
	});

	it('gets an email event via event-dump/create.json', async () => {
		await eventGet(makeCtx(), {
			job_id: 'job-1',
			email: 'user@example.com',
			status: 'delivered',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('event-dump/create.json');
		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(
			expect.objectContaining({
				filter: {
					job_id: 'job-1',
					email: 'user@example.com',
					status: 'delivered',
				},
			}),
		);
	});

	it('throws for cancel, resume, and resend', async () => {
		await expect(cancel(makeCtx(), { job_id: 'j1' })).rejects.toBeInstanceOf(
			UnioneAPIError,
		);
		await expect(resume(makeCtx(), { job_id: 'j1' })).rejects.toBeInstanceOf(
			UnioneAPIError,
		);
		await expect(resend(makeCtx(), { job_id: 'j1' })).rejects.toBeInstanceOf(
			UnioneAPIError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('exports events via event-dump/create.json', async () => {
		await list(makeCtx(), { start_time: '2026-01-01 00:00:00' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('event-dump/create.json');
	});

	it('computes statistics with aggregate day_status', async () => {
		await statistics(makeCtx(), { start_time: '2026-01-01 00:00:00' });
		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(
			expect.objectContaining({ aggregate: 'day_status' }),
		);
	});

	it('returns SMTP settings from system/info.json without echoing the API key', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			user_id: 11344,
			email: 'acct@example.com',
		});
		const response = await smtp(makeCtx(), { region: 'us1' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('system/info.json');
		expect(response.hosts).toEqual(['smtp.us1.unione.io']);
		expect(JSON.stringify(response)).not.toContain('test-key');
	});

	it('resubscribes via email/subscribe.json', async () => {
		await subscribe(makeCtx(), {
			from_email: 'from@example.com',
			to_email: 'to@example.com',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('email/subscribe.json');
	});

	it('unsubscribes via suppression/set.json', async () => {
		await unsubscribe(makeCtx(), { email: 'user@example.com' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('suppression/set.json');
		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(
			expect.objectContaining({ cause: 'unsubscribed' }),
		);
	});

	it('validates a batch with at most two concurrent requests', async () => {
		let inflight = 0;
		let maxInflight = 0;
		mockRequest.mockImplementation(async () => {
			inflight += 1;
			maxInflight = Math.max(maxInflight, inflight);
			await Promise.resolve();
			inflight -= 1;
			return { status: 'success', email: 'a@b.c', result: 'valid' };
		});
		await batch(makeCtx(), {
			emails: [
				'a@example.com',
				'b@example.com',
				'c@example.com',
				'd@example.com',
			],
		});
		expect(mockRequest).toHaveBeenCalledTimes(4);
		expect(maxInflight).toBeLessThanOrEqual(2);
		expect(mockRequest.mock.calls[0]?.[0]).toBe('email-validation/single.json');
	});

	it('retries validation via email-validation/single.json', async () => {
		await retry(makeCtx(), { email: 'user@example.com' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('email-validation/single.json');
	});

	it('creates, gets, lists, and deletes event dumps', async () => {
		await eventDumpCreate(makeCtx(), { start_time: '2026-01-01 00:00:00' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('event-dump/create.json');
		await eventDumpGet(makeCtx(), { dump_id: 'd1' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('event-dump/get.json');
		await eventDumpList(makeCtx(), {});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('event-dump/list.json');
		await eventDumpDelete(makeCtx(), { dump_id: 'd1' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('event-dump/delete.json');
	});

	it('lists and deletes tags', async () => {
		await tagList(makeCtx(), {});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('tag/list.json');
		await tagDelete(makeCtx(), { tag_id: 54 });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('tag/delete.json');
	});

	it('sets, gets, lists, and deletes templates', async () => {
		await templateSet(makeCtx(), {
			template: { name: 'Welcome', from_email: 'from@example.com' },
		});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('template/set.json');
		await templateGet(makeCtx(), { id: 'tmpl-1' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('template/get.json');
		await templateList(makeCtx(), { limit: 10, offset: 0 });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('template/list.json');
		await templateDelete(makeCtx(), { id: 'tmpl-1' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('template/delete.json');
	});

	it('sets, gets, deletes webhooks and returns webhook types locally', async () => {
		await webhookSet(makeCtx(), { url: 'https://example.com/hook' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('webhook/set.json');
		await webhookGet(makeCtx(), { url: 'https://example.com/hook' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('webhook/get.json');
		await webhookDelete(makeCtx(), { url: 'https://example.com/hook' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('webhook/delete.json');
		const types = await webhookTypes(makeCtx(), {});
		expect(types.email_status).toContain('delivered');
		expect(types.spam_block).toEqual(['*']);
	});

	it('gets, lists, and deletes suppressions', async () => {
		await suppressionGet(makeCtx(), { email: 'user@example.com' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('suppression/get.json');
		await suppressionList(makeCtx(), { start_time: '2020-01-01 00:00:00' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('suppression/list.json');
		await suppressionDelete(makeCtx(), { email: 'user@example.com' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('suppression/delete.json');
	});

	it('manages domains by action', async () => {
		await domainManage(makeCtx(), {
			action: 'get_dns_records',
			domain: 'example.com',
		});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe(
			'domain/get-dns-records.json',
		);
		await domainManage(makeCtx(), {
			action: 'validate_verification',
			domain: 'example.com',
		});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe(
			'domain/validate-verification-record.json',
		);
		await domainManage(makeCtx(), {
			action: 'validate_dkim',
			domain: 'example.com',
		});
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe(
			'domain/validate-dkim.json',
		);
		await domainManage(makeCtx(), { action: 'list' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('domain/list.json');
		await domainManage(makeCtx(), { action: 'delete', domain: 'example.com' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('domain/delete.json');
	});

	it('loads account balance from system/info.json', async () => {
		await info(makeCtx(), {});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('system/info.json');
		expect(mockLogEvent).toHaveBeenCalled();
	});
});
