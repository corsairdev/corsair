import { makeUploadcareRequest, UploadcareAPIError } from './client';
import {
	UploadcareEndpointInputSchemas,
	UploadcareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { verifyUploadcareWebhookSignature } from './webhooks/types';

const TEST_API_KEY = 'test_public_key:test_secret_key';

describe('Uploadcare Plugin Unit & Schema Tests', () => {
	describe('Schema Validation', () => {
		it('validates filesList input & output schema', () => {
			const validOptions = { limit: 10, stored: true };
			const parsedInput =
				UploadcareEndpointInputSchemas.filesList.parse(validOptions);
			expect(parsedInput.limit).toBe(10);

			const validOutput = {
				next: null,
				previous: null,
				total: 1,
				per_page: 10,
				results: [
					{
						uuid: '123e4567-e89b-12d3-a456-426614174000',
						filename: 'test.jpg',
						size: 1024,
						is_stored: true,
						is_image: true,
					},
				],
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.filesList.parse(validOutput);
			expect(parsedOutput.results).toBeDefined();
			expect(parsedOutput.results[0]!.uuid).toBe(
				'123e4567-e89b-12d3-a456-426614174000',
			);
		});

		it('validates fileGet input & output schema', () => {
			const input = { file_id: '123e4567-e89b-12d3-a456-426614174000' };
			const parsedInput = UploadcareEndpointInputSchemas.fileGet.parse(input);
			expect(parsedInput.file_id).toBe('123e4567-e89b-12d3-a456-426614174000');

			const validFile = {
				uuid: '123e4567-e89b-12d3-a456-426614174000',
				original_filename: 'sample.png',
				size: 2048,
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.fileGet.parse(validFile);
			expect(parsedOutput.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
		});

		it('validates batchStore & batchDelete schemas', () => {
			const batchInput = { file_ids: ['uuid-1', 'uuid-2'] };
			const parsedInput =
				UploadcareEndpointInputSchemas.batchStoreFiles.parse(batchInput);
			expect(parsedInput.file_ids).toHaveLength(2);

			const batchOutput = {
				status: 'ok',
				result: [
					{ uuid: 'uuid-1', is_stored: true },
					{ uuid: 'uuid-2', is_stored: true },
				],
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.batchStoreFiles.parse(batchOutput);
			expect(parsedOutput.status).toBe('ok');
			expect(parsedOutput.result?.length).toBe(2);
		});

		it('validates groupsList & groupGet schemas', () => {
			const input = { group_id: 'group-uuid-123' };
			const parsedInput = UploadcareEndpointInputSchemas.groupGet.parse(input);
			expect(parsedInput.group_id).toBe('group-uuid-123');

			const groupOutput = {
				id: 'group-uuid-123',
				files_count: 2,
				files: [{ uuid: 'f1' }, { uuid: 'f2' }],
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.groupGet.parse(groupOutput);
			expect(parsedOutput.id).toBe('group-uuid-123');
			expect(parsedOutput.files_count).toBe(2);
		});

		it('validates projectGet schemas', () => {
			const parsedInput = UploadcareEndpointInputSchemas.projectGet.parse({});
			expect(parsedInput).toEqual({});

			const projectOutput = {
				name: 'My Uploadcare Project',
				pub_key: 'pub_key_123',
				collaborator_emails: ['dev@example.com'],
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.projectGet.parse(projectOutput);
			expect(parsedOutput.name).toBe('My Uploadcare Project');
		});

		it('validates webhooks schemas', () => {
			const createInput = {
				target_url: 'https://example.com/webhook',
				event: 'file.uploaded',
				is_active: true,
			};
			const parsedInput =
				UploadcareEndpointInputSchemas.webhookCreate.parse(createInput);
			expect(parsedInput.target_url).toBe('https://example.com/webhook');

			const webhookOutput = {
				id: 12345,
				target_url: 'https://example.com/webhook',
				event: 'file.uploaded',
				is_active: true,
			};
			const parsedOutput =
				UploadcareEndpointOutputSchemas.webhookCreate.parse(webhookOutput);
			expect(parsedOutput.id).toBe(12345);
		});
	});

	describe('makeUploadcareRequest Client function', () => {
		it('should format Authorization header with Uploadcare.Simple', async () => {
			const fetchMock = jest.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ 'content-type': 'application/json' }),
				json: async () => ({ name: 'Test Project', pub_key: 'test_pk' }),
				text: async () =>
					JSON.stringify({ name: 'Test Project', pub_key: 'test_pk' }),
			});

			global.fetch = fetchMock as any;

			const result = await makeUploadcareRequest<{ name: string }>(
				'project/',
				TEST_API_KEY,
				{
					method: 'GET',
				},
			);

			expect(result.name).toBe('Test Project');
			expect(fetchMock).toHaveBeenCalled();
			const callArgs = fetchMock.mock.calls[0];
			expect(callArgs[0]).toContain('https://api.uploadcare.com/project/');
			const headers = callArgs[1].headers;
			const authHeader =
				typeof headers.get === 'function'
					? headers.get('Authorization')
					: headers['Authorization'];
			const acceptHeader =
				typeof headers.get === 'function'
					? headers.get('Accept')
					: headers['Accept'];
			expect(authHeader).toBe(
				'Uploadcare.Simple test_public_key:test_secret_key',
			);
			expect(acceptHeader).toBe('application/vnd.uploadcare-v0.7+json');
		});

		it('preserves request body on DELETE requests (e.g. batchDelete)', async () => {
			const fetchMock = jest.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ 'content-type': 'application/json' }),
				json: async () => ({ status: 'ok', result: [] }),
				text: async () => JSON.stringify({ status: 'ok', result: [] }),
			});

			global.fetch = fetchMock as any;

			await makeUploadcareRequest('files/storage/', TEST_API_KEY, {
				method: 'DELETE',
				body: ['uuid-1', 'uuid-2'],
			});

			expect(fetchMock).toHaveBeenCalled();
			const callArgs = fetchMock.mock.calls[0];
			expect(callArgs[1].method).toBe('DELETE');
			expect(callArgs[1].body).toBe(JSON.stringify(['uuid-1', 'uuid-2']));
		});

		it('preserves status and error body on ApiError', async () => {
			const fetchMock = jest.fn().mockResolvedValue({
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				headers: new Headers({
					'content-type': 'application/json',
				}),
				json: async () => ({ detail: 'Invalid parameter' }),
				text: async () => JSON.stringify({ detail: 'Invalid parameter' }),
			});

			global.fetch = fetchMock as any;

			let caughtError: UploadcareAPIError | null = null;
			try {
				await makeUploadcareRequest('project/', TEST_API_KEY, {
					method: 'GET',
				});
			} catch (err: any) {
				caughtError = err;
			}

			expect(caughtError).toBeInstanceOf(UploadcareAPIError);
			expect(caughtError?.status).toBe(400);
			expect(caughtError?.message).toBe('Invalid parameter');
		});
	});

	describe('Error Handlers', () => {
		it('matches 429 status and returns retryAfter', async () => {
			const uploadcareErr = new UploadcareAPIError(
				'Throttled',
				undefined,
				429,
				{},
				30,
			);
			const isMatch = errorHandlers.RATE_LIMIT_ERROR.match(uploadcareErr);
			expect(isMatch).toBe(true);

			const result =
				await errorHandlers.RATE_LIMIT_ERROR.handler(uploadcareErr);
			expect(result.headersRetryAfterMs).toBe(30);
		});

		it('matches 401 status for auth errors', async () => {
			const uploadcareErr = new UploadcareAPIError(
				'Unauthorized',
				undefined,
				401,
			);
			const isMatch = errorHandlers.AUTH_ERROR.match(uploadcareErr);
			expect(isMatch).toBe(true);
		});
	});

	describe('Webhook Signature Verification', () => {
		it('verifies valid HMAC-SHA256 signature', () => {
			const crypto = require('crypto');
			const secret = 'my_secret';
			const rawBody = JSON.stringify({
				event: 'file.uploaded',
				data: { uuid: '123' },
			});
			const signature = crypto
				.createHmac('sha256', secret)
				.update(rawBody)
				.digest('hex');

			const req = {
				headers: { 'x-uc-signature': `v1=${signature}` },
				rawBody,
				body: JSON.parse(rawBody),
			} as any;

			const result = verifyUploadcareWebhookSignature(req, secret);
			expect(result.valid).toBe(true);
		});

		it('rejects invalid signature', () => {
			const req = {
				headers: { 'x-uc-signature': 'v1=invalid_hash' },
				rawBody: '{"event":"file.uploaded"}',
				body: { event: 'file.uploaded' },
			} as any;

			const result = verifyUploadcareWebhookSignature(req, 'my_secret');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid webhook signature');
		});

		it('rejects missing secret or header', () => {
			const req = {
				headers: {},
				rawBody: '{}',
				body: {},
			} as any;

			expect(verifyUploadcareWebhookSignature(req, '').valid).toBe(false);
			expect(verifyUploadcareWebhookSignature(req, 'secret').valid).toBe(false);
		});
	});
});
