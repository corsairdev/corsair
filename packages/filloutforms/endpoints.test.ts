import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeFilloutRequest } from './client';
import {
	Auth,
	Databases,
	Fields,
	Forms,
	Records,
	Submissions,
	Tables,
	Token,
	Webhooks,
} from './endpoints';
import { FilloutFormsEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { filloutforms } from './index';
import { FilloutFormsSchema } from './schema';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		...actual,
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

function ctx() {
	return {
		key: 'test-key',
		pluginId: 'filloutforms',
		authType: 'api_key' as const,
		options: {},
		schema: FilloutFormsSchema,
		db: {},
	} as never;
}

const field = {
	id: 'fld1',
	name: 'Name',
	type: 'single_line_text',
	template: {},
	order: 0,
};

const table = {
	id: 'tbl1',
	name: 'Contacts',
	order: 0,
	primaryFieldId: 'fld1',
	fields: [field],
	views: [{ id: 'v1', name: 'Grid', type: 'grid' }],
	url: 'https://app.zite.com/database/db1/tbl1',
};

const database = {
	id: 'db1',
	name: 'Main',
	tables: [table],
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
	url: 'https://app.zite.com/database/db1',
};

const record = {
	id: '11111111-1111-1111-1111-111111111111',
	data: { fld1: 'Ada' },
	fields: { Name: 'Ada' },
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('filloutforms endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockLog.mockResolvedValue(null);
	});

	it('registers every implemented endpoint and no inbound webhooks', () => {
		const plugin = filloutforms();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(plugin.endpointSchemas ?? {}).sort(),
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.endpointMeta?.['databases.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['webhooks.removeForm']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('GET /forms', async () => {
		mockRequest.mockResolvedValue([{ formId: 'f1', name: 'Form' }]);
		await Forms.getForms(ctx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://api.fillout.com/v1/api' }),
			expect.objectContaining({ method: 'GET', url: 'forms' }),
		);
	});

	it('GET /forms/:formId', async () => {
		mockRequest.mockResolvedValue({
			id: 'f1',
			name: 'Form',
			questions: [{ id: 'q1', name: 'Q', type: 'ShortAnswer' }],
		});
		await Forms.getFormMetadata(ctx(), { formId: 'f1' });
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({ method: 'GET', url: 'forms/f1' }),
		);
	});

	it('GET /bases', async () => {
		mockRequest.mockResolvedValue([{ id: 'db1', name: 'Main' }]);
		await Databases.get(ctx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://tables.zite.com/api/v1' }),
			expect.objectContaining({ method: 'GET', url: 'bases' }),
		);
	});

	it('GET /bases/:id', async () => {
		mockRequest.mockResolvedValue(database);
		await Databases.getById(ctx(), { databaseId: 'db1' });
		expect(mockRequest.mock.calls[0][1].url).toBe('bases/db1');
	});

	it('POST /bases', async () => {
		mockRequest.mockResolvedValue(database);
		await Databases.create(ctx(), {
			name: 'Main',
			tables: [
				{
					name: 'Contacts',
					fields: [{ type: 'single_line_text', name: 'Name', template: {} }],
				},
			],
		});
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: 'bases',
				body: expect.objectContaining({ name: 'Main' }),
			}),
		);
	});

	it('DELETE /bases/:id', async () => {
		mockRequest.mockResolvedValue({});
		await Databases.delete(ctx(), { databaseId: 'db1' });
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({ method: 'DELETE', url: 'bases/db1' }),
		);
	});

	it('POST /bases/:id/tables', async () => {
		mockRequest.mockResolvedValue(table);
		await Tables.create(ctx(), {
			databaseId: 'db1',
			name: 'Contacts',
			fields: [{ type: 'single_line_text', name: 'Name', template: {} }],
		});
		expect(mockRequest.mock.calls[0][1].url).toBe('bases/db1/tables');
	});

	it('PATCH /bases/:id/tables/:tableId', async () => {
		mockRequest.mockResolvedValue(table);
		await Tables.update(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			name: 'People',
		});
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'PATCH',
				url: 'bases/db1/tables/tbl1',
				body: { name: 'People' },
			}),
		);
	});

	it('DELETE /bases/:id/tables/:tableId', async () => {
		mockRequest.mockResolvedValue({});
		await Tables.delete(ctx(), { databaseId: 'db1', tableId: 'tbl1' });
		expect(mockRequest.mock.calls[0][1].method).toBe('DELETE');
	});

	it('POST field', async () => {
		mockRequest.mockResolvedValue(field);
		await Fields.create(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			name: 'Email',
			type: 'email',
		});
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'bases/db1/tables/tbl1/fields',
		);
	});

	it('PATCH field', async () => {
		mockRequest.mockResolvedValue(field);
		await Fields.update(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			fieldId: 'fld1',
			name: 'Full name',
		});
		expect(mockRequest.mock.calls[0][1].method).toBe('PATCH');
	});

	it('DELETE field', async () => {
		mockRequest.mockResolvedValue({});
		await Fields.delete(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			fieldId: 'fld1',
		});
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'bases/db1/tables/tbl1/fields/fld1',
		);
	});

	it('GET submissions with integer pagination', async () => {
		mockRequest.mockResolvedValue({
			responses: [],
			totalResponses: 0,
			pageCount: 0,
		});
		await Submissions.list(ctx(), { formId: 'f1', limit: 10, offset: 0 });
		expect(mockRequest.mock.calls[0][1].query).toEqual({
			limit: 10,
			offset: 0,
		});
	});

	it('GET submission by id', async () => {
		mockRequest.mockResolvedValue({
			submission: {
				submissionId: 's1',
				submissionTime: '2024-01-01T00:00:00Z',
				questions: [],
			},
		});
		await Submissions.getById(ctx(), { formId: 'f1', submissionId: 's1' });
		expect(mockRequest.mock.calls[0][1].url).toBe('forms/f1/submissions/s1');
	});

	it('POST submissions without logging answers', async () => {
		mockRequest.mockResolvedValue({ submissions: [] });
		await Submissions.create(ctx(), {
			formId: 'f1',
			submissions: [{ questions: [{ id: 'q1', value: 'secret' }] }],
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'filloutforms.submissions.create',
			{ formId: 'f1', count: 1 },
			'completed',
		);
	});

	it('DELETE submission', async () => {
		mockRequest.mockResolvedValue({});
		const result = await Submissions.delete(ctx(), {
			formId: 'f1',
			submissionId: 's1',
		});
		expect(result.deleted).toBe(true);
	});

	it('POST records/list', async () => {
		mockRequest.mockResolvedValue({ records: [record], total: 1 });
		await Records.list(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			limit: 50,
			offset: 0,
		});
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: 'bases/db1/tables/tbl1/records/list',
				body: { limit: 50, offset: 0 },
			}),
		);
	});

	it('GET record', async () => {
		mockRequest.mockResolvedValue(record);
		await Records.getById(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			recordId: record.id,
		});
		expect(mockRequest.mock.calls[0][1].url).toContain('/records/');
	});

	it('POST record', async () => {
		mockRequest.mockResolvedValue(record);
		await Records.create(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			record: { Name: 'Ada' },
		});
		expect(mockRequest.mock.calls[0][1].body).toEqual({
			record: { Name: 'Ada' },
		});
	});

	it('PATCH record', async () => {
		mockRequest.mockResolvedValue(record);
		await Records.update(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			recordId: record.id,
			record: { Name: 'Grace' },
		});
		expect(mockRequest.mock.calls[0][1].method).toBe('PATCH');
	});

	it('DELETE record', async () => {
		mockRequest.mockResolvedValue({});
		await Records.delete(ctx(), {
			databaseId: 'db1',
			tableId: 'tbl1',
			recordId: record.id,
		});
		expect(mockRequest.mock.calls[0][1].method).toBe('DELETE');
	});

	it('POST webhook/create', async () => {
		mockRequest.mockResolvedValue({ id: 9 });
		await Webhooks.createForm(ctx(), {
			formId: 'f1',
			url: 'https://example.com/hook',
		});
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: 'webhook/create',
				body: { formId: 'f1', url: 'https://example.com/hook' },
			}),
		);
	});

	it('POST webhook/delete', async () => {
		mockRequest.mockResolvedValue({});
		await Webhooks.removeForm(ctx(), { webhookId: 9 });
		expect(mockRequest.mock.calls[0][1].url).toBe('webhook/delete');
	});

	it('POST database webhook', async () => {
		mockRequest.mockResolvedValue({ id: 1, secret: 's' });
		await Webhooks.createDatabase(ctx(), {
			databaseId: 'db1',
			url: 'https://example.com/db',
			events: ['record.created'],
		});
		expect(mockRequest.mock.calls[0][1].url).toBe('bases/db1/webhooks');
	});

	it('GET database webhooks', async () => {
		mockRequest.mockResolvedValue({ webhooks: [] });
		await Webhooks.listDatabase(ctx(), { databaseId: 'db1' });
		expect(mockRequest.mock.calls[0][1].method).toBe('GET');
	});

	it('DELETE database webhook', async () => {
		mockRequest.mockResolvedValue({});
		await Webhooks.deleteDatabase(ctx(), { databaseId: 'db1', webhookId: 1 });
		expect(mockRequest.mock.calls[0][1].url).toBe('bases/db1/webhooks/1');
	});

	it('builds the OAuth authorize URL', async () => {
		const result = await Auth.authorizeOAuth(ctx(), {
			clientId: 'cid',
			redirectUri: 'https://app.example/callback',
			state: 'xyz',
		});
		expect(result.authorizationUrl).toContain('client_id=cid');
		expect(result.authorizationUrl).toContain(
			'https://build.fillout.com/authorize/oauth',
		);
	});

	it('DELETE oauth invalidate', async () => {
		mockRequest.mockResolvedValue({});
		await Token.invalidateAccessToken(ctx(), { token: 'oauth-token' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://server.fillout.com/public/oauth/invalidate',
			}),
			expect.objectContaining({ method: 'DELETE' }),
		);
	});
});

describe('client errors', () => {
	it('rethrows ApiError so 429 handlers see status', async () => {
		const rateLimited = new ApiError(
			{ method: 'GET', url: '/forms' },
			{
				url: 'https://api.fillout.com/v1/api/forms',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 1000 },
		);
		mockRequest.mockRejectedValue(rateLimited);
		await expect(makeFilloutRequest('forms', 'k')).rejects.toBe(rateLimited);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
	});
});

describe('input schemas', () => {
	it('rejects fractional submission pagination', () => {
		expect(
			FilloutFormsEndpointInputSchemas.listSubmissions.safeParse({
				formId: 'f1',
				limit: 1.5,
			}).success,
		).toBe(false);
	});
});
