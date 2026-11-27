import type { Crawl4aiContext } from './index';
import {
	crawl4aiWebhooksNested,
	isCrawl4aiDelivery,
	verifyCrawl4aiWebhook,
} from './webhooks';

const EVENT = {
	task_id: 'crawl_a1b2c3d4',
	task_type: 'crawl',
	status: 'completed',
	timestamp: '2026-11-27T10:30:00+00:00',
	urls: ['https://example.com'],
};
const request = (secret?: string) => ({
	headers: secret ? { 'x-webhook-secret': secret } : {},
	body: JSON.stringify(EVENT),
	rawBody: JSON.stringify(EVENT),
	payload: EVENT,
});
const ctx = {
	key: 'hook-secret',
	$getAccountId: async () => 'a',
} as unknown as Crawl4aiContext;

describe('crawl4ai job webhook', () => {
	it('matches job notifications only', () => {
		expect(isCrawl4aiDelivery(request('x') as never)).toBe(true);
		expect(
			isCrawl4aiDelivery({ headers: {}, body: '{"event":"other"}' } as never),
		).toBe(false);
	});

	it('accepts the shared secret and refuses anything else', async () => {
		await expect(
			crawl4aiWebhooksNested.jobFinished.handler(
				ctx,
				request('hook-secret') as never,
			),
		).resolves.toMatchObject({
			success: true,
			data: { task_id: 'crawl_a1b2c3d4', status: 'completed' },
		});
		await expect(
			crawl4aiWebhooksNested.jobFinished.handler(
				ctx,
				request('wrong') as never,
			),
		).resolves.toMatchObject({
			success: false,
			statusCode: 401,
		});
		expect(verifyCrawl4aiWebhook(request() as never, 'hook-secret')).toEqual({
			valid: false,
			error: 'Missing X-Webhook-Secret header',
		});
	});
});
