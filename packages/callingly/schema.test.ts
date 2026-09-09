import {
	CallinglyCall,
	CallinglyClient,
	CallinglyLead,
	CallinglySchema,
	CallinglyTeam,
	CallinglyUser,
	CallinglyWebhookConfig,
} from './schema';

describe('Callingly Schema', () => {
	it('has valid semver version', () => {
		expect(CallinglySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('validates official list-lead fields', () => {
		const parsed = CallinglyLead.parse({
			id: 1,
			account_id: 1,
			lead_owner_id: 4,
			fname: 'Test',
			lname: 'Lead',
			email: 'test@lead.com',
			phone_number: '+14801234567',
			source: 'Webhook',
			source_id: null,
			created_at: '2024-05-21 23:37:54',
			company: 'Callingly',
			category: null,
			status: 'missed',
			result: null,
			team: { id: 1, name: 'Team 1' },
			tags: [],
			stage: null,
			scheduled_call_at: '06/13/24 3:48pm MST',
			is_stopped: 0,
			is_blocked: 0,
		});
		expect(parsed.id).toBe(1);
		expect(parsed.fname).toBe('Test');
		expect(parsed.phone_number).toBe('+14801234567');
	});

	it('validates official get-call fields including duration strings', () => {
		const parsed = CallinglyCall.parse({
			id: 1234,
			started_at: '2020-11-11 12:08:13',
			direction: 'outbound',
			status: 'completed',
			seconds: 5,
			duration: '5s',
			recording_url: 'https://cdn.callingly.com/recordings/example.mp3',
		});
		expect(parsed.duration).toBe('5s');
		expect(parsed.seconds).toBe(5);
	});

	it('validates official list-agent fields with numeric account_id', () => {
		const parsed = CallinglyUser.parse({
			id: 123,
			account_id: 1,
			fname: 'John',
			lname: 'Smith',
			phone_number: '+16024819661',
			ext: '',
			donotdisturb: 0,
			priority: 1,
			timezone: 'America/Phoenix',
			is_available: true,
		});
		expect(parsed.account_id).toBe(1);
		expect(parsed.fname).toBe('John');
	});

	it('validates official get-team fields', () => {
		const parsed = CallinglyTeam.parse({
			id: 123,
			account_id: 1,
			name: 'Main Team',
			is_record: 1,
			call_mode: 'simultaneous',
			language: 'en',
			is_users_available_for_call: true,
		});
		expect(parsed.name).toBe('Main Team');
		expect(parsed.call_mode).toBe('simultaneous');
	});

	it('validates official list-client fields', () => {
		const parsed = CallinglyClient.parse({
			id: 123,
			name: 'Client Name',
			email: 'client@email.com',
			billed_users: 12,
			billed_numbers: 2,
		});
		expect(parsed.billed_users).toBe(12);
	});

	it('validates official webhook config fields', () => {
		const parsed = CallinglyWebhookConfig.parse({
			id: 1123,
			account_id: 1,
			name: 'My Webhook',
			event: 'call_completed',
			target_url: 'http://example.com/',
			call_status: null,
			call_lead_status: null,
			team_id: 1,
			number_id: 1,
			field: null,
			filter: null,
		});
		expect(parsed.target_url).toBe('http://example.com/');
		expect(parsed.event).toBe('call_completed');
	});
});
