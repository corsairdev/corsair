import {
	ActionsListInputSchema,
	InspectionGetInputSchema,
	InspectionsListInputSchema,
	SafetyCultureEndpointInputSchemas,
	SafetyCultureEndpointOutputSchemas,
	TemplatesListInputSchema,
	UsersListInputSchema,
} from './endpoints/types';
import { SafetyCultureSchema } from './schema';

describe('SafetyCulture schema', () => {
	it('declares a semver version', () => {
		expect(SafetyCultureSchema.version).toBeDefined();
		expect(SafetyCultureSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SafetyCultureSchema.entities).toBe('object');
		expect(SafetyCultureSchema.entities).not.toBeNull();
	});
});

describe('SafetyCulture endpoint input schemas', () => {
	it('exports input schemas for all endpoints', () => {
		expect(SafetyCultureEndpointInputSchemas.inspectionsList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.inspectionsGet).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.templatesList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.actionsList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.usersList).toBeDefined();
	});

	it('validates valid inspections list input', () => {
		const result = InspectionsListInputSchema.safeParse({
			modified_after: '2024-01-01T00:00:00Z',
			limit: 100,
		});
		expect(result.success).toBe(true);
	});

	it('validates valid inspections list input with template filter', () => {
		const result = InspectionsListInputSchema.safeParse({
			template: ['template_abc123'],
			completed: 'true',
		});
		expect(result.success).toBe(true);
	});

	it('rejects invalid limit (too high) on inspections list', () => {
		const result = InspectionsListInputSchema.safeParse({
			limit: 5000,
		});
		expect(result.success).toBe(false);
	});

	it('validates valid inspection get input', () => {
		const result = InspectionGetInputSchema.safeParse({
			audit_id: 'audit_abc123',
		});
		expect(result.success).toBe(true);
	});

	it('rejects inspection get without audit_id', () => {
		const result = InspectionGetInputSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it('validates valid templates list input', () => {
		const result = TemplatesListInputSchema.safeParse({
			archived: 'false',
			limit: 50,
		});
		expect(result.success).toBe(true);
	});

	it('validates valid actions list input', () => {
		const result = ActionsListInputSchema.safeParse({
			status: 'IN PROGRESS',
			limit: 25,
			offset: 0,
		});
		expect(result.success).toBe(true);
	});

	it('validates valid users list input', () => {
		const result = UsersListInputSchema.safeParse({
			limit: 200,
			offset: 0,
		});
		expect(result.success).toBe(true);
	});

	it('accepts empty input for optional-only schemas', () => {
		expect(InspectionsListInputSchema.safeParse({}).success).toBe(true);
		expect(TemplatesListInputSchema.safeParse({}).success).toBe(true);
		expect(ActionsListInputSchema.safeParse({}).success).toBe(true);
		expect(UsersListInputSchema.safeParse({}).success).toBe(true);
	});
});

describe('SafetyCulture endpoint output schemas', () => {
	it('exports output schemas for all endpoints', () => {
		expect(SafetyCultureEndpointOutputSchemas.inspectionsList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.inspectionsGet).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.templatesList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.actionsList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.usersList).toBeDefined();
	});
});

describe('SafetyCulture plugin factory', () => {
	it('exports safetyculture function', async () => {
		const { safetyculture } = await import('.');
		expect(typeof safetyculture).toBe('function');
	});

	it('creates a plugin with correct id', async () => {
		const { safetyculture } = await import('.');
		const plugin = safetyculture({ key: 'test-key' });
		expect(plugin.id).toBe('safetyculture');
	});

	it('creates a plugin with all endpoint groups', async () => {
		const { safetyculture } = await import('.');
		const plugin = safetyculture({ key: 'test-key' });
		expect(plugin.endpoints!.inspections).toBeDefined();
		expect(plugin.endpoints!.templates).toBeDefined();
		expect(plugin.endpoints!.actions).toBeDefined();
		expect(plugin.endpoints!.users).toBeDefined();
	});

	it('creates a plugin with schema version', async () => {
		const { safetyculture } = await import('.');
		const plugin = safetyculture({ key: 'test-key' });
		expect(plugin.schema!.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('creates a plugin with empty webhooks', async () => {
		const { safetyculture } = await import('.');
		const plugin = safetyculture({ key: 'test-key' });
		expect(plugin.webhooks).toEqual({});
	});

	it('creates a plugin with endpoint meta for all endpoints', async () => {
		const { safetyculture } = await import('.');
		const plugin = safetyculture({ key: 'test-key' });
		const meta = plugin.endpointMeta!;
		expect(meta['inspections.list']!.riskLevel).toBe('read');
		expect(meta['inspections.get']!.riskLevel).toBe('read');
		expect(meta['templates.list']!.riskLevel).toBe('read');
		expect(meta['actions.list']!.riskLevel).toBe('read');
		expect(meta['users.list']!.riskLevel).toBe('read');
	});
});
