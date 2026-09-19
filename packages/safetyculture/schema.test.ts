import { makeSafetyCultureRequest } from './client';
import { Actions, Inspections, Templates, Users } from './endpoints';
import {
	ActionsListInputSchema,
	ActionsListResponseSchema,
	InspectionGetInputSchema,
	InspectionGetResponseSchema,
	InspectionsListInputSchema,
	InspectionsListResponseSchema,
	SafetyCultureEndpointInputSchemas,
	SafetyCultureEndpointOutputSchemas,
	TemplatesListInputSchema,
	TemplatesListResponseSchema,
	UsersListInputSchema,
	UsersListResponseSchema,
} from './endpoints/types';
import { SafetyCultureSchema } from './schema';

jest.mock('./client', () => ({
	makeSafetyCultureRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockMakeSafetyCultureRequest =
	makeSafetyCultureRequest as jest.MockedFunction<
		typeof makeSafetyCultureRequest
	>;

const mockCtx = {
	key: 'test-safetyculture-key',
} as never;

beforeEach(() => {
	mockMakeSafetyCultureRequest.mockReset();
});

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

	it('validates a minimal inspections list response', () => {
		const schema = SafetyCultureEndpointOutputSchemas.inspectionsList;
		const result = schema.safeParse({ audits: [] });
		expect(result.success).toBe(true);
	});

	it('validates a minimal inspection get response', () => {
		const schema = SafetyCultureEndpointOutputSchemas.inspectionsGet;
		const result = schema.safeParse({ audit_id: 'audit_123' });
		expect(result.success).toBe(true);
	});

	it('validates a minimal templates list response', () => {
		const schema = SafetyCultureEndpointOutputSchemas.templatesList;
		const result = schema.safeParse({ templates: [] });
		expect(result.success).toBe(true);
	});

	it('validates a minimal actions list response', () => {
		const schema = SafetyCultureEndpointOutputSchemas.actionsList;
		const result = schema.safeParse({ actions: [] });
		expect(result.success).toBe(true);
	});

	it('validates a minimal users list response', () => {
		const schema = SafetyCultureEndpointOutputSchemas.usersList;
		const result = schema.safeParse({ users: [] });
		expect(result.success).toBe(true);
	});
});

describe('SafetyCulture endpoint behavior', () => {
	it('inspections.list maps template arrays and query params to audits/search', async () => {
		mockMakeSafetyCultureRequest.mockResolvedValueOnce({ audits: [] });

		const input = {
			template: ['template-1', 'template-2'],
			modified_after: '2024-01-01T00:00:00Z',
			completed: 'both' as const,
			limit: 25,
		};

		await expect(Inspections.list(mockCtx, input)).resolves.toEqual({
			audits: [],
		});

		expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
			'audits/search',
			'test-safetyculture-key',
			InspectionsListResponseSchema,
			{
				method: 'GET',
				query: {
					template: ['template-1', 'template-2'],
					modified_after: '2024-01-01T00:00:00Z',
					completed: 'both',
					limit: 25,
				},
			},
		);
	});

	it('inspections.get requests audits/{audit_id}', async () => {
		mockMakeSafetyCultureRequest.mockResolvedValueOnce({
			audit_id: 'audit-123',
		});

		await expect(
			Inspections.get(mockCtx, { audit_id: 'audit-123' }),
		).resolves.toEqual({ audit_id: 'audit-123' });

		expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
			'audits/audit-123',
			'test-safetyculture-key',
			InspectionGetResponseSchema,
			{ method: 'GET' },
		);
	});

	it('templates.list maps filters to templates/search', async () => {
		mockMakeSafetyCultureRequest.mockResolvedValueOnce({ templates: [] });

		await expect(
			Templates.list(mockCtx, {
				archived: 'false',
				owner: 'user-1',
				limit: 50,
			}),
		).resolves.toEqual({ templates: [] });

		expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
			'templates/search',
			'test-safetyculture-key',
			TemplatesListResponseSchema,
			{
				method: 'GET',
				query: {
					archived: 'false',
					owner: 'user-1',
					limit: 50,
				},
			},
		);
	});

	it('actions.list maps filters to actions/search', async () => {
		mockMakeSafetyCultureRequest.mockResolvedValueOnce({ actions: [] });

		await expect(
			Actions.list(mockCtx, {
				status: 'IN PROGRESS',
				assignee: 'user-2',
				offset: 0,
			}),
		).resolves.toEqual({ actions: [] });

		expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
			'actions/search',
			'test-safetyculture-key',
			ActionsListResponseSchema,
			{
				method: 'GET',
				query: {
					status: 'IN PROGRESS',
					assignee: 'user-2',
					offset: 0,
				},
			},
		);
	});

	it('users.list maps pagination to users endpoint', async () => {
		mockMakeSafetyCultureRequest.mockResolvedValueOnce({ users: [] });

		await expect(
			Users.list(mockCtx, { limit: 200, offset: 1 }),
		).resolves.toEqual({ users: [] });

		expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
			'users',
			'test-safetyculture-key',
			UsersListResponseSchema,
			{
				method: 'GET',
				query: {
					limit: 200,
					offset: 1,
				},
			},
		);
	});

	it('bubbles API errors from endpoint handlers', async () => {
		mockMakeSafetyCultureRequest.mockRejectedValueOnce(
			new Error('Unauthorized'),
		);

		await expect(Users.list(mockCtx, {})).rejects.toThrow('Unauthorized');
	});
});
