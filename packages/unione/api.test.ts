import { logEventFromContext } from 'corsair/core';
import { makeUnioneRequest, UnioneAPIError } from './client';
import {
	remove as domainDelete,
	manage as domainManage,
} from './endpoints/domain';
import {
	list,
	schedule,
	send,
	statistics,
	subscribe,
	unsubscribe,
} from './endpoints/email';
import { batch } from './endpoints/email-validation';
import {
	create as eventDumpCreate,
	createForJob as eventDumpCreateForJob,
	remove as eventDumpDelete,
	get as eventDumpGet,
	list as eventDumpList,
} from './endpoints/event-dump';
import {
	remove as suppressionDelete,
	get as suppressionGet,
	list as suppressionList,
} from './endpoints/suppression';
import { info, ping } from './endpoints/system';
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
	list as webhookList,
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

	it('exports one job by creating an event dump filtered by job_id', async () => {
		await eventDumpCreateForJob(makeCtx(), { job_id: '1ZymBc-00041N-9X' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('event-dump/create.json');
		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(
			expect.objectContaining({
				filter: { job_id: '1ZymBc-00041N-9X' },
			}),
		);
	});

	it('carries email and status into the job dump filter', async () => {
		await eventDumpCreateForJob(makeCtx(), {
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

	it('propagates a UniOne failure instead of reporting it per address', async () => {
		mockRequest
			.mockResolvedValueOnce({ status: 'success', email: 'a@example.com' })
			.mockRejectedValueOnce(new UnioneAPIError('Invalid API key', 401));
		// A 401 applies to the batch, not to one address; reporting it as a
		// per-address verdict would read as "these addresses are invalid".
		await expect(
			batch(makeCtx(), { emails: ['a@example.com', 'b@example.com'] }),
		).rejects.toBeInstanceOf(UnioneAPIError);
	});

	it('anchors the default dump window to end_time, never inverting the range', async () => {
		await eventDumpCreateForJob(makeCtx(), {
			job_id: 'job-1',
			end_time: '2020-06-01 00:00:00',
		});
		const body = mockRequest.mock.calls[0]?.[2]?.body as {
			start_time: string;
			end_time: string;
		};
		expect(body.start_time < body.end_time).toBe(true);
		expect(body.start_time.startsWith('2020-05')).toBe(true);
	});

	it('keys suppressions per project so one email keeps both rows', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			suppressions: [
				{ email: 'user@example.com', project_id: 'p1', cause: 'unsubscribed' },
				{ email: 'user@example.com', project_id: 'p2', cause: 'spam' },
			],
		});
		const ctx = {
			key: 'test-key',
			options: {},
			db: { suppressions: { upsertByEntityId } },
		} as unknown as UnioneContext;

		await suppressionGet(ctx, {
			email: 'user@example.com',
			all_projects: true,
		});
		const keys = upsertByEntityId.mock.calls.map((call) => call[0]);
		expect(keys).toEqual(['user@example.com:p1', 'user@example.com:p2']);
	});

	it('redacts the address in the suppression audit payload', async () => {
		await suppressionGet(makeCtx(), { email: 'user@example.com' });
		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as { email: string };
		expect(payload.email).toBe('u***@example.com');
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
	});

	it('deletes a domain through its own destructive endpoint', async () => {
		await domainDelete(makeCtx(), { domain: 'example.com' });
		expect(mockRequest.mock.calls.at(-1)?.[0]).toBe('domain/delete.json');
		expect(mockRequest.mock.calls.at(-1)?.[2]?.body).toEqual({
			domain: 'example.com',
		});
	});

	it('keeps from_name out of the subscribe audit payload', async () => {
		await subscribe(makeCtx(), {
			from_email: 'sender@example.com',
			to_email: 'user@example.com',
			from_name: 'Jane Doe',
		});
		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as Record<
			string,
			unknown
		>;
		expect(payload).toEqual({
			from_email: 's***@example.com',
			to_email: 'u***@example.com',
		});
		expect(JSON.stringify(payload)).not.toContain('Jane');
	});

	it('loads account balance from system/info.json', async () => {
		await info(makeCtx(), {});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('system/info.json');
		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('pings via system/ping.json', async () => {
		await ping(makeCtx(), {});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('system/ping.json');
	});

	it('sends immediately via email/send.json with no send_at', async () => {
		await send(makeCtx(), {
			recipients: [{ email: 'user@example.com' }],
			from_email: 'from@example.com',
			subject: 'Hello',
			body: { plaintext: 'Hi' },
		});
		const body = mockRequest.mock.calls[0]?.[2]?.body as {
			message: Record<string, unknown>;
		};
		expect(mockRequest.mock.calls[0]?.[0]).toBe('email/send.json');
		expect(body.message).not.toHaveProperty('options');
	});

	it('rejects a message carrying neither body nor template_id', async () => {
		await expect(
			send(makeCtx(), {
				recipients: [{ email: 'user@example.com' }],
				from_email: 'from@example.com',
				subject: 'Hello',
			}),
		).rejects.toBeInstanceOf(UnioneAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lists webhooks and mirrors them keyed by url, not id', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			objects: [{ url: 'https://example.com/hook', status: 'active' }],
		});
		const ctx = {
			key: 'test-key',
			options: {},
			db: { webhooks: { upsertByEntityId } },
		} as unknown as UnioneContext;

		await webhookList(ctx, {});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('webhook/list.json');
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/hook',
			expect.objectContaining({
				url: 'https://example.com/hook',
				status: 'active',
			}),
		);
	});
});
