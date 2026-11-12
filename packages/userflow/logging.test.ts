import { logEventFromContext } from 'corsair/core';
import { WebhookSubscriptions } from './endpoints';
import { webhookSubscriptionWithSecret } from './test-fixtures';
import { installFetchMock, invoke, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const fetchMock = installFetchMock();
const logged = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

describe('event logging', () => {
	beforeEach(() => logged.mockClear());

	it('logs a new webhook subscription without its url or secret', async () => {
		respond(fetchMock, webhookSubscriptionWithSecret);
		const url = 'https://acme.example/hooks/userflow?token=tok_private';

		await invoke(WebhookSubscriptions.create, { url, topics: ['user'] });

		expect(logged).toHaveBeenCalledTimes(1);
		const fields = JSON.stringify(logged.mock.calls[0]?.[2]);
		expect(fields).not.toContain('tok_private');
		expect(fields).not.toContain('acme.example');
		expect(fields).not.toContain(String(webhookSubscriptionWithSecret.secret));
	});
});
