import {
	CloseActivityCall,
	CloseActivityEmail,
	CloseActivityNote,
	CloseContact,
	CloseCustomField,
	CloseLead,
	CloseOpportunity,
	CloseSchema,
	CloseTask,
	CloseUser,
} from './schema';

describe('Close schema', () => {
	it('declares a semver version', () => {
		expect(CloseSchema.version).toBeDefined();
		expect(CloseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CloseSchema.entities).toBe('object');
		expect(CloseSchema.entities).not.toBeNull();
		expect(Object.keys(CloseSchema.entities).length).toBeGreaterThan(0);
		for (const entity of Object.values(CloseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('parses CloseLead correctly', () => {
		const mockLead = {
			id: 'lead_123',
			name: 'Acme Corp',
			status_id: 'stat_1',
			status_label: 'Potential',
			organization_id: 'orga_123',
			date_created: '2026-09-07T12:00:00Z',
		};
		const parsed = CloseLead.parse(mockLead);
		expect(parsed.id).toBe('lead_123');
		expect(parsed.name).toBe('Acme Corp');
	});

	it('parses CloseContact correctly', () => {
		const mockContact = {
			id: 'cont_123',
			lead_id: 'lead_123',
			name: 'John Doe',
			title: 'CEO',
			emails: [{ email: 'john@acme.com', type: 'office' }],
			organization_id: 'orga_123',
		};
		const parsed = CloseContact.parse(mockContact);
		expect(parsed.id).toBe('cont_123');
		expect(parsed.emails?.[0]?.email).toBe('john@acme.com');
	});

	it('parses CloseOpportunity correctly', () => {
		const mockOpp = {
			id: 'oppo_123',
			lead_id: 'lead_123',
			status_label: 'Active',
			value: 5000,
			confidence: 80,
			organization_id: 'orga_123',
		};
		const parsed = CloseOpportunity.parse(mockOpp);
		expect(parsed.id).toBe('oppo_123');
		expect(parsed.value).toBe(5000);
	});

	it('parses CloseTask correctly', () => {
		const mockTask = {
			id: 'task_123',
			lead_id: 'lead_123',
			text: 'Follow up via email',
			is_complete: false,
			organization_id: 'orga_123',
		};
		const parsed = CloseTask.parse(mockTask);
		expect(parsed.id).toBe('task_123');
		expect(parsed.is_complete).toBe(false);
	});

	it('parses CloseActivityNote correctly', () => {
		const mockNote = {
			id: 'acti_123',
			lead_id: 'lead_123',
			note: 'Initial meeting notes',
			organization_id: 'orga_123',
		};
		const parsed = CloseActivityNote.parse(mockNote);
		expect(parsed.id).toBe('acti_123');
	});

	it('parses CloseUser correctly', () => {
		const mockUser = {
			id: 'user_123',
			first_name: 'Jane',
			last_name: 'Smith',
			email: 'jane@example.com',
		};
		const parsed = CloseUser.parse(mockUser);
		expect(parsed.first_name).toBe('Jane');
	});
});
