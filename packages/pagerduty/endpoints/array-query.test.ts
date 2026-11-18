import type { PagerdutyContext } from '../index';
import { Incidents, LogEntries, Users } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

describe('PagerDuty array query params', () => {
	const fetchMock = jest.fn();
	const ctx = { key: 'pd_test_key', db: {} } as unknown as PagerdutyContext;

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ incidents: [], log_entries: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
	});

	const requestedUrl = () =>
		decodeURIComponent(String(fetchMock.mock.calls[0]?.[0]));

	it('repeats each incidents filter key per value', async () => {
		await Incidents.list(ctx, {
			statuses: ['triggered', 'acknowledged'],
			urgencies: ['high', 'low'],
			service_ids: ['PSVC1', 'PSVC2'],
			team_ids: ['PTEAM1', 'PTEAM2'],
		});
		expect(requestedUrl()).toBe(
			'https://api.pagerduty.com/incidents?statuses[]=triggered&statuses[]=acknowledged&urgencies[]=high&urgencies[]=low&service_ids[]=PSVC1&service_ids[]=PSVC2&team_ids[]=PTEAM1&team_ids[]=PTEAM2',
		);
	});

	it('repeats include[] on users.get', async () => {
		await Users.get(ctx, {
			id: 'PUSER1',
			include: ['contact_methods', 'notification_rules'],
		});
		expect(requestedUrl()).toBe(
			'https://api.pagerduty.com/users/PUSER1?include[]=contact_methods&include[]=notification_rules',
		);
	});

	it('repeats include[] and team_ids[] on logEntries.list', async () => {
		await LogEntries.list(ctx, {
			include: ['incidents', 'services'],
			team_ids: ['PTEAM1', 'PTEAM2'],
		});
		expect(requestedUrl()).toBe(
			'https://api.pagerduty.com/log_entries?include[]=incidents&include[]=services&team_ids[]=PTEAM1&team_ids[]=PTEAM2',
		);
	});
});
