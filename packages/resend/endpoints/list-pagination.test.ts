import type { ResendContext } from '../index';
import { Contacts, Domains, Emails } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

describe('Resend list pagination', () => {
	const fetchMock = jest.fn();
	const ctx = { key: 're_test_key', db: {} } as unknown as ResendContext;

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ object: 'list', has_more: false, data: [] }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		global.fetch = fetchMock;
	});

	const requestedUrl = () => String(fetchMock.mock.calls[0]?.[0]);

	it('sends the emails cursor as after', async () => {
		await Emails.list(ctx, { limit: 2, cursor: 'email_last' });
		expect(requestedUrl()).toBe(
			'https://api.resend.com/emails?limit=2&after=email_last',
		);
	});

	it('sends the domains cursor as after', async () => {
		await Domains.list(ctx, { limit: 2, cursor: 'domain_last' });
		expect(requestedUrl()).toBe(
			'https://api.resend.com/domains?limit=2&after=domain_last',
		);
	});

	it('sends the contacts cursor as after', async () => {
		await Contacts.list(ctx, { limit: 2, cursor: 'contact_last' });
		expect(requestedUrl()).toBe(
			'https://api.resend.com/contacts?limit=2&after=contact_last',
		);
	});
});
