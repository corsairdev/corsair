import {
	CallinglyCall,
	CallinglyClient,
	CallinglyLead,
	CallinglySchema,
	CallinglyTeam,
	CallinglyUser,
} from './schema';

describe('Callingly Schema', () => {
	it('has valid semver version', () => {
		expect(CallinglySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('validates CallinglyLead entity schema', () => {
		const leadData = {
			id: 'lead_123',
			name: 'John Doe',
			first_name: 'John',
			last_name: 'Doe',
			phone: '+15551234567',
			phone_number: '+15551234567',
			email: 'john@example.com',
			status: 'new',
			team_id: 'team_1',
			user_id: 'user_1',
			scheduled_at: '2026-09-06T10:00:00Z',
			tags: ['vip', 'inbound'],
			custom_fields: { source: 'google_ads' },
		};
		const parsed = CallinglyLead.parse(leadData);
		expect(parsed.id).toBe('lead_123');
		expect(parsed.phone).toBe('+15551234567');
		expect(parsed.tags).toEqual(['vip', 'inbound']);
	});

	it('validates CallinglyCall entity schema', () => {
		const callData = {
			id: 'call_999',
			lead_id: 'lead_123',
			team_id: 'team_1',
			status: 'completed',
			duration: 120,
			outcome: 'connected',
			recording_url: 'https://recordings.callingly.com/call_999.mp3',
		};
		const parsed = CallinglyCall.parse(callData);
		expect(parsed.id).toBe('call_999');
		expect(parsed.duration).toBe(120);
	});

	it('validates CallinglyUser entity schema', () => {
		const userData = {
			id: 'user_1',
			name: 'Alice Agent',
			email: 'alice@example.com',
			role: 'agent',
			active: true,
		};
		const parsed = CallinglyUser.parse(userData);
		expect(parsed.name).toBe('Alice Agent');
		expect(parsed.active).toBe(true);
	});

	it('validates CallinglyTeam entity schema', () => {
		const teamData = {
			id: 'team_1',
			name: 'Sales Inbound',
			user_ids: ['user_1', 'user_2'],
		};
		const parsed = CallinglyTeam.parse(teamData);
		expect(parsed.name).toBe('Sales Inbound');
		expect(parsed.user_ids).toHaveLength(2);
	});

	it('validates CallinglyClient entity schema', () => {
		const clientData = {
			id: 'client_1',
			name: 'Acme Corp',
			email: 'admin@acme.com',
			company: 'Acme Corp',
			active: true,
		};
		const parsed = CallinglyClient.parse(clientData);
		expect(parsed.company).toBe('Acme Corp');
	});
});
