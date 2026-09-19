import { logEventFromContext } from 'corsair/core';
import * as clientModule from './client';
import {
	ActionsListResponseSchema,
	InspectionGetResponseSchema,
	InspectionsListResponseSchema,
	TemplatesListResponseSchema,
	UsersListResponseSchema,
} from './endpoints/types';
import { safetyculture } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeSafetyCultureRequest: jest.fn(),
	};
});

const mockMakeSafetyCultureRequest =
	clientModule.makeSafetyCultureRequest as jest.MockedFunction<
		typeof clientModule.makeSafetyCultureRequest
	>;
const mockLog = jest.mocked(logEventFromContext);

const TEST_API_KEY = 'test-safetyculture-key';

function createCtx() {
	return { key: TEST_API_KEY } as never;
}

describe('SafetyCulture plugin endpoints', () => {
	const plugin = safetyculture({ key: TEST_API_KEY });
	const endpoints = plugin.endpoints!;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('inspections.list', () => {
		it('maps filters and sends repeated template query params', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({ audits: [] });

			await endpoints.inspections.list(createCtx(), {
				template: ['template_abc', 'template_def'],
				modified_after: '2024-01-01T00:00:00Z',
				completed: 'true',
				limit: 50,
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'audits/search',
				TEST_API_KEY,
				InspectionsListResponseSchema,
				{
					method: 'GET',
					query: {
						template: ['template_abc', 'template_def'],
						modified_after: '2024-01-01T00:00:00Z',
						completed: 'true',
						limit: 50,
					},
				},
			);
		});

		it('uses modified_after_cursor for pagination', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({ audits: [] });

			await endpoints.inspections.list(createCtx(), {
				modified_after_cursor: '2024-06-01T12:00:00Z',
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'audits/search',
				TEST_API_KEY,
				InspectionsListResponseSchema,
				expect.objectContaining({
					query: { modified_after: '2024-06-01T12:00:00Z' },
				}),
			);
		});

		it('validates provider response before returning', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({
				audits: [{ audit_id: 'audit_123' }],
				total: 1,
			});

			const result = await endpoints.inspections.list(createCtx(), {});

			expect(result.audits[0]?.audit_id).toBe('audit_123');
			expect(mockLog).toHaveBeenCalledWith(
				expect.anything(),
				'safetyculture.inspections.list',
				{ resultCount: 1 },
				'completed',
			);
		});

		it('rejects malformed provider response', async () => {
			mockMakeSafetyCultureRequest.mockRejectedValueOnce(
				new Error('Invalid audits list response'),
			);

			await expect(endpoints.inspections.list(createCtx(), {})).rejects.toThrow(
				'Invalid audits list response',
			);
		});
	});

	describe('inspections.get', () => {
		it('requests the audit by ID and validates the response', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({
				audit_id: 'audit_abc123',
				template_id: 'template_xyz',
			});

			const result = await endpoints.inspections.get(createCtx(), {
				audit_id: 'audit_abc123',
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'audits/audit_abc123',
				TEST_API_KEY,
				InspectionGetResponseSchema,
				{ method: 'GET' },
			);
			expect(result.audit_id).toBe('audit_abc123');
		});
	});

	describe('templates.list', () => {
		it('maps query filters to the templates search endpoint', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({ templates: [] });

			await endpoints.templates.list(createCtx(), {
				archived: 'false',
				owner: 'user_123',
				limit: 25,
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'templates/search',
				TEST_API_KEY,
				TemplatesListResponseSchema,
				{
					method: 'GET',
					query: {
						archived: 'false',
						owner: 'user_123',
						limit: 25,
					},
				},
			);
		});
	});

	describe('actions.list', () => {
		it('maps status, assignee, and pagination filters', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({ actions: [] });

			await endpoints.actions.list(createCtx(), {
				status: 'IN PROGRESS',
				assignee: 'user_456',
				offset: 10,
				limit: 20,
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'actions/search',
				TEST_API_KEY,
				ActionsListResponseSchema,
				{
					method: 'GET',
					query: {
						status: 'IN PROGRESS',
						assignee: 'user_456',
						offset: 10,
						limit: 20,
					},
				},
			);
		});
	});

	describe('users.list', () => {
		it('maps limit and offset to the users endpoint', async () => {
			mockMakeSafetyCultureRequest.mockResolvedValueOnce({
				users: [{ user_id: 'user_789' }],
			});

			const result = await endpoints.users.list(createCtx(), {
				limit: 100,
				offset: 0,
			});

			expect(mockMakeSafetyCultureRequest).toHaveBeenCalledWith(
				'users',
				TEST_API_KEY,
				UsersListResponseSchema,
				{
					method: 'GET',
					query: { limit: 100, offset: 0 },
				},
			);
			expect(result.users[0]?.user_id).toBe('user_789');
		});
	});
});
