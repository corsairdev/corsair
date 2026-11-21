import { createHmac } from 'node:crypto';
import { processWebhook } from 'corsair';
import type { WebhookRequest } from 'corsair/core';
import { createCorsair } from 'corsair/core';
import { parallel } from './index';
import { ParallelWebhooks } from './webhooks';
import { matchParallelWebhook, verifyParallelWebhook } from './webhooks/types';

// A Standard Webhooks secret: `whsec_` + Base64 of the raw key.
const RAW_KEY = Buffer.from('parallel-test-signing-key-32byte');
const SECRET = `whsec_${RAW_KEY.toString('base64')}`;

function sign(
	body: string,
	{
		id = 'whevent_1',
		timestamp = Math.floor(Date.now() / 1000),
		key = RAW_KEY,
	}: { id?: string; timestamp?: number; key?: Buffer } = {},
) {
	const signature = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
	return {
		'content-type': 'application/json',
		'webhook-id': id,
		'webhook-timestamp': String(timestamp),
		'webhook-signature': `v1,${signature}`,
	};
}

function request(
	body: string,
	headers: Record<string, string>,
): WebhookRequest<unknown> {
	return { payload: JSON.parse(body), rawBody: body, headers };
}

const taskRunCompleted = {
	timestamp: '2025-04-23T20:21:48.037943Z',
	type: 'task_run.status',
	data: {
		run_id: 'trun_9907962f83aa4d9d98fd7f4bf745d654',
		interaction_id: 'trun_9907962f83aa4d9d98fd7f4bf745d654',
		status: 'completed',
		is_active: false,
		warnings: null,
		error: null,
		processor: 'core',
		metadata: { key: 'value' },
		created_at: '2025-04-23T20:21:48.037943Z',
		modified_at: '2025-04-23T20:21:48.037943Z',
	},
};

describe('verifyParallelWebhook', () => {
	const body = JSON.stringify(taskRunCompleted);

	it('accepts a delivery signed with the account secret', () => {
		expect(verifyParallelWebhook(request(body, sign(body)), SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts the secret without its whsec_ prefix', () => {
		const result = verifyParallelWebhook(
			request(body, sign(body)),
			RAW_KEY.toString('base64'),
		);
		expect(result.valid).toBe(true);
	});

	it('accepts any one of several signatures while a secret rotates', () => {
		const headers = sign(body);
		headers['webhook-signature'] =
			`v1,${Buffer.alloc(32).toString('base64')} ${headers['webhook-signature']}`;
		expect(verifyParallelWebhook(request(body, headers), SECRET).valid).toBe(
			true,
		);
	});

	it('refuses a body changed after signing', () => {
		const headers = sign(body);
		const tampered = body.replace('completed', 'failed');
		expect(verifyParallelWebhook(request(tampered, headers), SECRET)).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('refuses a signature made with another secret', () => {
		const headers = sign(body, { key: Buffer.from('another-key-entirely') });
		expect(verifyParallelWebhook(request(body, headers), SECRET).valid).toBe(
			false,
		);
	});

	it('refuses a delivery older than five minutes (replay)', () => {
		const headers = sign(body, {
			timestamp: Math.floor(Date.now() / 1000) - 301,
		});
		expect(verifyParallelWebhook(request(body, headers), SECRET)).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old or too new',
		});
	});

	it('refuses when no secret is configured, or headers are missing', () => {
		expect(verifyParallelWebhook(request(body, sign(body)), '').valid).toBe(
			false,
		);
		expect(verifyParallelWebhook(request(body, {}), SECRET)).toEqual({
			valid: false,
			error: 'Missing Standard Webhooks headers',
		});
	});

	it('skips the check for a delivery Hub already verified', () => {
		const hubVerified = { ...request(body, {}), hubVerified: true };
		expect(verifyParallelWebhook(hubVerified, undefined).valid).toBe(true);
	});
});

describe('matchParallelWebhook', () => {
	it('matches signed deliveries of Parallel event types only', () => {
		const headers = { 'webhook-signature': 'v1,x' };
		expect(matchParallelWebhook({ headers, body: taskRunCompleted })).toBe(
			true,
		);
		expect(
			matchParallelWebhook({
				headers,
				body: JSON.stringify({ type: 'monitor.event.detected', data: {} }),
			}),
		).toBe(true);
		expect(
			matchParallelWebhook({ headers, body: { type: 'invoice.paid' } }),
		).toBe(false);
		expect(matchParallelWebhook({ headers: {}, body: taskRunCompleted })).toBe(
			false,
		);
	});
});

describe('Parallel webhooks through processWebhook', () => {
	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});
	afterEach(() => jest.restoreAllMocks());

	const corsair = createCorsair({
		plugins: [parallel({ key: 'test-key', webhookSecret: SECRET })],
	});

	async function deliver(payload: object, headers?: Record<string, string>) {
		const body = JSON.stringify(payload);
		return processWebhook(corsair, headers ?? sign(body), body);
	}

	it('routes task_run.status to taskRun.status', async () => {
		const result = await deliver(taskRunCompleted);
		expect(result.plugin).toBe('parallel');
		expect(result.action).toBe('taskRun.status');
		expect(result.response?.success).toBe(true);
	});

	it('returns the parsed run from the handler', async () => {
		const handler = ParallelWebhooks.taskRun.status.handler;
		const body = JSON.stringify(taskRunCompleted);
		// unknown: a bare context for calling the handler outside core.
		const ctx = { key: SECRET } as unknown as Parameters<typeof handler>[0];
		// The handler validates the payload itself; the test hands it raw JSON.
		const delivery = request(body, sign(body)) as Parameters<typeof handler>[1];
		const response = await handler(ctx, delivery);
		expect(response).toEqual({
			success: true,
			data: expect.objectContaining({
				type: 'task_run.status',
				data: expect.objectContaining({
					run_id: taskRunCompleted.data.run_id,
					status: 'completed',
					processor: 'core',
				}),
			}),
		});
	});

	it('routes a matched FindAll candidate with its basis', async () => {
		const result = await deliver({
			type: 'findall.candidate.matched',
			timestamp: '2025-10-27T14:57:15.421087Z',
			data: {
				findall_id: 'findall_40e0ab8c10754be0b7a16477abb38a2f',
				candidate_id: 'candidate_478fb5ca',
				name: 'Vivodyne',
				url: 'https://vivodyne.com/',
				description: 'Vivodyne is a biotechnology company...',
				match_status: 'matched',
				output: {
					founded_after_2020_check: {
						value: '2021',
						type: 'match_condition',
						is_matched: true,
					},
				},
				basis: [
					{
						field: 'founded_after_2020_check',
						citations: [
							{
								title: 'Vivodyne',
								url: 'https://www.crunchbase.com/organization/vivodyne',
								excerpts: ['Founded in 2021'],
							},
						],
						reasoning: 'Founded in 2021.',
						confidence: 'high',
					},
				],
			},
		});
		expect(result.action).toBe('findall.candidateMatched');
		expect(result.response?.success).toBe(true);
	});

	it('routes a completed FindAll run', async () => {
		const result = await deliver({
			type: 'findall.run.completed',
			timestamp: '2025-10-27T14:58:39.421087Z',
			data: {
				findall_id: 'findall_40e0ab8c10754be0b7a16477abb38a2f',
				status: {
					status: 'completed',
					is_active: false,
					metrics: {
						generated_candidates_count: 5,
						matched_candidates_count: 1,
					},
					termination_reason: 'match_limit_met',
				},
				generator: 'core',
				metadata: {},
				created_at: '2025-10-27T14:56:05.619331Z',
				modified_at: '2025-10-27T14:58:39.421087Z',
			},
		});
		expect(result.action).toBe('findall.runCompleted');
		expect(result.response?.success).toBe(true);
	});

	it('routes the three monitor events', async () => {
		const monitor_id = 'monitor_0c9d7f7d5a7841a0b6c269b2b9b1e6aa';
		const detected = await deliver({
			type: 'monitor.event.detected',
			timestamp: '2025-10-27T14:56:05.619331Z',
			data: {
				monitor_id,
				event: { event_group_id: 'mevtgrp_b0079f70195e' },
				metadata: { team: 'research' },
			},
		});
		const completed = await deliver({
			type: 'monitor.execution.completed',
			timestamp: '2025-10-27T14:56:05.619331Z',
			data: {
				monitor_id,
				event: {
					type: 'completion',
					monitor_ts: 'completed_2025-01-15T10:30:00Z',
				},
			},
		});
		const failed = await deliver({
			type: 'monitor.execution.failed',
			timestamp: '2025-10-27T14:57:30.789012Z',
			data: {
				monitor_id,
				event: {
					type: 'error',
					error: 'Error occurred while processing the event',
					id: 'error_2025-01-15T10:30:00Z',
					date: '2025-01-15T10:30:00Z',
				},
			},
		});
		expect(
			[detected, completed, failed].map((r) => [r.action, r.response?.success]),
		).toEqual([
			['monitor.eventDetected', true],
			['monitor.executionCompleted', true],
			['monitor.executionFailed', true],
		]);
	});

	it('routes a failed run in the error form the webhook guide shows', async () => {
		const result = await deliver({
			...taskRunCompleted,
			data: {
				...taskRunCompleted.data,
				status: 'failed',
				error: {
					message: 'Task execution failed',
					details: 'Additional error details',
				},
			},
		});
		expect(result.action).toBe('taskRun.status');
		expect(result.response?.success).toBe(true);
	});

	it('refuses a forged delivery with 401', async () => {
		const body = JSON.stringify(taskRunCompleted);
		const result = await deliver(
			taskRunCompleted,
			sign(body, { key: Buffer.from('forged-key') }),
		);
		expect(result.response).toEqual(
			expect.objectContaining({
				success: false,
				statusCode: 401,
				error: 'Invalid signature',
			}),
		);
	});

	it('refuses a signed delivery whose payload is not a Task Run', async () => {
		const result = await deliver({
			type: 'task_run.status',
			timestamp: '2025-04-23T20:21:48Z',
			data: { run_id: 'trun_1' },
		});
		expect(result.response).toEqual(
			expect.objectContaining({ success: false, statusCode: 400 }),
		);
	});
});
