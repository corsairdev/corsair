import {
	BasinDomain,
	BasinForm,
	BasinFormView,
	BasinFormWebhook,
	BasinProject,
	BasinSchema,
	BasinSubmission,
} from './schema';

describe('Basin schema', () => {
	it('declares a semver version', () => {
		expect(BasinSchema.version).toBeDefined();
		expect(BasinSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares all expected entities in entities map', () => {
		expect(typeof BasinSchema.entities).toBe('object');
		expect(BasinSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(BasinSchema.entities);
		expect(entityKeys).toEqual(
			expect.arrayContaining([
				'forms',
				'submissions',
				'projects',
				'webhooks',
				'domains',
				'formViews',
			]),
		);
		for (const entity of Object.values(BasinSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates BasinForm entity correctly', () => {
		const validForm = {
			id: 'form_123',
			uuid: 'uuid-456',
			name: 'Contact Form',
			timezone: 'UTC',
			redirect_url: 'https://example.com/thanks',
			use_ajax: true,
			notification_emails: 'test@example.com',
			autoreply: true,
			created_at: new Date().toISOString(),
		};
		const parsed = BasinForm.parse(validForm);
		expect(parsed.id).toBe('form_123');
		expect(parsed.name).toBe('Contact Form');
	});

	it('validates BasinSubmission entity correctly', () => {
		const validSubmission = {
			id: 12345,
			form_id: 'form_123',
			email: 'user@example.com',
			spam: false,
			read: true,
			trash: false,
			payload_params: { message: 'Hello' },
			created_at: new Date().toISOString(),
		};
		const parsed = BasinSubmission.parse(validSubmission);
		expect(parsed.id).toBe(12345);
		expect(parsed.email).toBe('user@example.com');
	});

	it('validates BasinProject entity correctly', () => {
		const validProject = {
			id: 'proj_1',
			name: 'Marketing Site',
			created_at: new Date().toISOString(),
		};
		const parsed = BasinProject.parse(validProject);
		expect(parsed.id).toBe('proj_1');
		expect(parsed.name).toBe('Marketing Site');
	});

	it('validates BasinFormWebhook entity correctly', () => {
		const validWebhook = {
			id: 'wh_1',
			form_id: 'form_123',
			name: 'Slack Notification',
			url: 'https://hooks.slack.com/services/xyz',
			format: 'slack',
			trigger_when_spam: false,
			enabled: true,
		};
		const parsed = BasinFormWebhook.parse(validWebhook);
		expect(parsed.id).toBe('wh_1');
		expect(parsed.enabled).toBe(true);
	});

	it('validates BasinDomain entity correctly', () => {
		const validDomain = {
			id: 'dom_1',
			domain: 'example.com',
		};
		const parsed = BasinDomain.parse(validDomain);
		expect(parsed.domain).toBe('example.com');
	});

	it('validates BasinFormView entity correctly', () => {
		const validView = {
			id: 'view_1',
			form_id: 'form_123',
			name: 'Default View',
			status: 'active',
		};
		const parsed = BasinFormView.parse(validView);
		expect(parsed.id).toBe('view_1');
		expect(parsed.status).toBe('active');
	});
});
