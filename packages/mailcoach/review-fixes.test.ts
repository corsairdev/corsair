import { MailcoachOperations } from './endpoints/operations';
import {
	MailcoachEndpointInputSchemas,
	MailcoachEndpointOutputSchemas,
} from './endpoints/types';
import type { MailcoachContext } from './index';

const UUID = '00000000-0000-4000-8000-000000000001';

function context(options: MailcoachContext['options']): MailcoachContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'mailcoach-test-token',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('stored-token'),
			set_api_key: () => Promise.resolve(),
			get_api_url: () => Promise.resolve('https://team-b.mailcoach.app/api'),
			set_api_url: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

describe('Mailcoach review fixes', () => {
	afterEach(() => jest.restoreAllMocks());

	it('sends an options key only to the options apiUrl, never to a stored team URL', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ data: { id: 1, email: 'a@b.co' } }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);
		await MailcoachOperations['user.get'].endpoint(
			context({
				key: 'mailcoach-test-token',
				apiUrl: 'https://team-a.mailcoach.app/api',
			}),
			{},
		);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://team-a.mailcoach.app/api/user',
		);

		// Without an options key, the account's stored token and URL stay paired.
		await MailcoachOperations['user.get'].endpoint(
			context({ apiUrl: 'https://team-a.mailcoach.app/api' }),
			{},
		);
		expect(String(fetchSpy.mock.calls[1]?.[0])).toBe(
			'https://team-b.mailcoach.app/api/user',
		);
	});

	it('accepts the empty-array extra_attributes Laravel returns', () => {
		expect(
			MailcoachEndpointOutputSchemas['subscribers.get'].safeParse({
				data: { uuid: UUID, extra_attributes: [] },
			}).success,
		).toBe(true);
	});

	it('checks every campaign test recipient is an email address', () => {
		const sendTest = MailcoachEndpointInputSchemas['campaigns.sendTest'];
		expect(
			sendTest.safeParse({ campaignUuid: UUID, email: 'not-an-address' })
				.success,
		).toBe(false);
		expect(
			sendTest.safeParse({
				campaignUuid: UUID,
				email: 'one@corsair.dev, two@corsair.dev',
			}).success,
		).toBe(true);
	});

	it('says that schedule_at schedules a send on create and update', () => {
		expect(MailcoachOperations['campaigns.create'].description).toContain(
			'schedule_at',
		);
		expect(MailcoachOperations['campaigns.update'].description).toContain(
			'schedule_at',
		);
	});
});
