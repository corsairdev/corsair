import {
	BasinDomain,
	BasinForm,
	BasinFormView,
	BasinFormWebhook,
	BasinProject,
	BasinSchema,
	BasinSubmission,
	safeDate,
} from './schema';

describe('Basin schema', () => {
	it('declares a semver version', () => {
		expect(BasinSchema.version).toBeDefined();
		expect(BasinSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all entities', () => {
		expect(typeof BasinSchema.entities).toBe('object');
		expect(BasinSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(BasinSchema.entities);
		expect(entityKeys).toContain('forms');
		expect(entityKeys).toContain('submissions');
		expect(entityKeys).toContain('projects');
		expect(entityKeys).toContain('webhooks');
		expect(entityKeys).toContain('formViews');
		expect(entityKeys).toContain('domains');

		for (const entity of Object.values(BasinSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	describe('safeDate parsing', () => {
		it('safely parses valid ISO date strings', () => {
			const parsed = safeDate.parse('2026-08-22T10:30:00.000Z');
			expect(parsed).toBeInstanceOf(Date);
			expect(parsed?.toISOString()).toBe('2026-08-22T10:30:00.000Z');
		});

		it('safely parses Date objects', () => {
			const now = new Date();
			const parsed = safeDate.parse(now);
			expect(parsed).toBeInstanceOf(Date);
			expect(parsed?.getTime()).toBe(now.getTime());
		});

		it('safely parses numeric timestamps', () => {
			const ts = 1755850000000;
			const parsed = safeDate.parse(ts);
			expect(parsed).toBeInstanceOf(Date);
			expect(parsed?.getTime()).toBe(ts);
		});

		it('returns undefined for invalid dates without throwing', () => {
			expect(safeDate.parse('not-a-real-date')).toBeUndefined();
			expect(safeDate.parse('NaN')).toBeUndefined();
			expect(safeDate.parse(null)).toBeUndefined();
			expect(safeDate.parse(undefined)).toBeUndefined();
			expect(safeDate.parse('')).toBeUndefined();
		});
	});

	describe('entity schemas', () => {
		it('validates BasinForm entity', () => {
			const form = BasinForm.parse({
				id: 123,
				name: 'Contact Form',
				project_id: 456,
				created_at: '2026-08-22T10:00:00Z',
			});
			expect(form.id).toBe(123);
			expect(form.name).toBe('Contact Form');
			expect(form.created_at).toBeInstanceOf(Date);
		});

		it('validates BasinSubmission entity', () => {
			const sub = BasinSubmission.parse({
				id: 'sub_1',
				form_id: 123,
				email: 'test@example.com',
				spam: false,
				created_at: '2026-08-22T10:00:00Z',
			});
			expect(sub.id).toBe('sub_1');
			expect(sub.email).toBe('test@example.com');
			expect(sub.spam).toBe(false);
		});

		it('validates BasinProject entity', () => {
			const proj = BasinProject.parse({
				id: 1,
				name: 'Marketing Project',
			});
			expect(proj.id).toBe(1);
			expect(proj.name).toBe('Marketing Project');
		});

		it('validates BasinFormWebhook entity', () => {
			const hook = BasinFormWebhook.parse({
				id: 5,
				form_id: 123,
				name: 'Slack Hook',
				url: 'https://hooks.slack.com/services/xxx',
				enabled: true,
			});
			expect(hook.id).toBe(5);
			expect(hook.enabled).toBe(true);
		});

		it('validates BasinFormView entity', () => {
			const view = BasinFormView.parse({
				id: 10,
				form_id: 123,
				name: 'Default View',
				status: 'active',
			});
			expect(view.id).toBe(10);
			expect(view.status).toBe('active');
		});

		it('validates BasinDomain entity', () => {
			const domain = BasinDomain.parse({
				id: 20,
				name: 'example.com',
			});
			expect(domain.name).toBe('example.com');
		});
	});
});
