import { MailcoachOperations } from './endpoints/operations';
import {
	MailcoachEndpointInputSchemas,
	MailcoachEndpointOutputSchemas,
} from './endpoints/types';
import type { MailcoachContext } from './index';

const UUID = '00000000-0000-4000-8000-000000000001';

function context(
	options: MailcoachContext['options'],
	key = 'mailcoach-test-token',
): MailcoachContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
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
			context(
				{ key: 'team-a-token', apiUrl: 'https://team-a.mailcoach.app/api' },
				'team-a-token',
			),
			{},
		);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://team-a.mailcoach.app/api/user',
		);
		expect(
			new Headers(fetchSpy.mock.calls[0]?.[1]?.headers).get('authorization'),
		).toBe('Bearer team-a-token');

		// Without an options key, the account's stored token and URL stay paired.
		await MailcoachOperations['user.get'].endpoint(
			context({ apiUrl: 'https://team-a.mailcoach.app/api' }, 'stored-token'),
			{},
		);
		expect(String(fetchSpy.mock.calls[1]?.[0])).toBe(
			'https://team-b.mailcoach.app/api/user',
		);
		expect(
			new Headers(fetchSpy.mock.calls[1]?.[1]?.headers).get('authorization'),
		).toBe('Bearer stored-token');
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

	it('keeps scheduling out of draft edits and behind a destructive operation', () => {
		const draft = { name: 'Draft', email_list_uuid: UUID };
		expect(
			MailcoachEndpointInputSchemas['campaigns.create'].safeParse({
				...draft,
				schedule_at: '2027-01-02 03:04:05',
			}).success,
		).toBe(false);
		expect(
			MailcoachEndpointInputSchemas['campaigns.update'].safeParse({
				campaignUuid: UUID,
				body: { ...draft, schedule_at: '2027-01-02 03:04:05' },
			}).success,
		).toBe(false);
		expect(MailcoachOperations['campaigns.create'].riskLevel).toBe('write');
		expect(MailcoachOperations['campaigns.schedule'].riskLevel).toBe(
			'destructive',
		);
	});

	it('accepts a null imported_subscribers_count on draft imports', () => {
		expect(
			MailcoachEndpointOutputSchemas['subscriberImports.create'].safeParse({
				data: { uuid: UUID, status: 'draft', imported_subscribers_count: null },
			}).success,
		).toBe(true);
	});

	it('rejects a transactional send that mixes mail_name with inline content', () => {
		const send = MailcoachEndpointInputSchemas['transactionalMails.send'];
		const base = { from: 'a@corsair.dev', to: 'b@corsair.dev' };
		expect(
			send.safeParse({ ...base, mail_name: 'welcome', subject: 'Hi' }).success,
		).toBe(false);
		expect(send.safeParse({ ...base, mail_name: 'welcome' }).success).toBe(
			true,
		);
		expect(
			send.safeParse({ ...base, subject: 'Hi', text: 'Hello' }).success,
		).toBe(true);
	});
});
