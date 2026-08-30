import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';
import {
	FilloutFormsEndpointInputSchemas,
	FilloutFormsEndpointOutputSchemas,
} from './endpoints/types';
import { FilloutFormsSchema } from './schema';
import {
	createFilloutFormSubmissionMatch,
	verifyFilloutWebhookSignature,
} from './webhooks/types';

describe('FilloutForms schema', () => {
	it('declares a semver version', () => {
		expect(FilloutFormsSchema.version).toBeDefined();
		expect(FilloutFormsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities for forms, submissions, and webhooks', () => {
		expect(typeof FilloutFormsSchema.entities).toBe('object');
		expect(FilloutFormsSchema.entities).not.toBeNull();
		expect(Object.keys(FilloutFormsSchema.entities)).toEqual(
			expect.arrayContaining(['forms', 'submissions', 'webhooks']),
		);
	});
});

describe('Endpoint input schemas', () => {
	it('getForms accepts empty object', () => {
		const result = FilloutFormsEndpointInputSchemas.getForms.safeParse({});
		expect(result.success).toBe(true);
	});

	it('getFormMetadata requires formId', () => {
		expect(
			FilloutFormsEndpointInputSchemas.getFormMetadata.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.getFormMetadata.safeParse({
				formId: 'abc',
			}).success,
		).toBe(true);
	});

	it('listSubmissions requires formId', () => {
		expect(
			FilloutFormsEndpointInputSchemas.listSubmissions.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.listSubmissions.safeParse({
				formId: 'abc',
			}).success,
		).toBe(true);
	});

	it('listSubmissions validates limit range', () => {
		const valid = FilloutFormsEndpointInputSchemas.listSubmissions.safeParse({
			formId: 'abc',
			limit: 50,
		});
		expect(valid.success).toBe(true);

		const tooHigh = FilloutFormsEndpointInputSchemas.listSubmissions.safeParse({
			formId: 'abc',
			limit: 200,
		});
		expect(tooHigh.success).toBe(false);
	});

	it('getSubmissionById requires formId and submissionId', () => {
		expect(
			FilloutFormsEndpointInputSchemas.getSubmissionById.safeParse({
				formId: 'f1',
			}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.getSubmissionById.safeParse({
				formId: 'f1',
				submissionId: 's1',
			}).success,
		).toBe(true);
	});

	it('createSubmission requires formId and submissions array', () => {
		expect(
			FilloutFormsEndpointInputSchemas.createSubmission.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.createSubmission.safeParse({
				formId: 'f1',
				submissions: [],
			}).success,
		).toBe(true);
	});

	it('createSubmission validates submission questions', () => {
		const result = FilloutFormsEndpointInputSchemas.createSubmission.safeParse({
			formId: 'f1',
			submissions: [
				{
					questions: [{ id: 'q1', value: 'answer' }],
				},
			],
		});
		expect(result.success).toBe(true);
	});

	it('deleteSubmission requires formId and submissionId', () => {
		expect(
			FilloutFormsEndpointInputSchemas.deleteSubmission.safeParse({
				formId: 'f1',
			}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.deleteSubmission.safeParse({
				formId: 'f1',
				submissionId: 's1',
			}).success,
		).toBe(true);
	});

	it('createDatabaseWebhook requires formId and url', () => {
		expect(
			FilloutFormsEndpointInputSchemas.createDatabaseWebhook.safeParse({})
				.success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.createDatabaseWebhook.safeParse({
				formId: 'f1',
				url: 'https://example.com/hook',
			}).success,
		).toBe(true);
	});

	it('removeFormWebhook requires webhookId', () => {
		expect(
			FilloutFormsEndpointInputSchemas.removeFormWebhook.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.removeFormWebhook.safeParse({
				webhookId: '123',
			}).success,
		).toBe(true);
	});

	it('authorizeOAuth requires clientId and redirectUri', () => {
		expect(
			FilloutFormsEndpointInputSchemas.authorizeOAuth.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.authorizeOAuth.safeParse({
				clientId: 'c1',
				redirectUri: 'https://example.com/callback',
			}).success,
		).toBe(true);
	});

	it('invalidateAccessToken requires accessToken', () => {
		expect(
			FilloutFormsEndpointInputSchemas.invalidateAccessToken.safeParse({})
				.success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.invalidateAccessToken.safeParse({
				accessToken: 'tok123',
			}).success,
		).toBe(true);
	});
});

describe('Endpoint output schemas', () => {
	it('getForms parses array of form summaries', () => {
		const result = FilloutFormsEndpointOutputSchemas.getForms.safeParse([
			{ formId: 'f1', name: 'Test Form' },
		]);
		expect(result.success).toBe(true);
	});

	it('getFormMetadata parses form metadata', () => {
		const result = FilloutFormsEndpointOutputSchemas.getFormMetadata.safeParse({
			id: 'f1',
			name: 'Test',
			questions: [{ id: 'q1', name: 'Question', type: 'ShortAnswer' }],
		});
		expect(result.success).toBe(true);
	});

	it('listSubmissions parses paginated response', () => {
		const result = FilloutFormsEndpointOutputSchemas.listSubmissions.safeParse({
			responses: [],
			totalResponses: 0,
			pageCount: 0,
		});
		expect(result.success).toBe(true);
	});

	it('getSubmissionById parses single submission', () => {
		const result =
			FilloutFormsEndpointOutputSchemas.getSubmissionById.safeParse({
				submission: {
					submissionId: 's1',
					submissionTime: '2024-01-01T00:00:00Z',
					questions: [],
				},
			});
		expect(result.success).toBe(true);
	});

	it('createDatabaseWebhook parses response with id', () => {
		const result =
			FilloutFormsEndpointOutputSchemas.createDatabaseWebhook.safeParse({
				id: 123,
			});
		expect(result.success).toBe(true);
	});

	it('unsupported operations parse correctly', () => {
		const result = FilloutFormsEndpointOutputSchemas.getDatabases.safeParse({
			supported: false,
			message: 'Not supported',
		});
		expect(result.success).toBe(true);
	});
});

describe('Webhook matcher', () => {
	it('matches valid form submission payload', () => {
		const request: RawWebhookRequest = {
			headers: { 'x-fillout-signature': 'sha256=abc' },
			body: JSON.stringify({
				formId: 'f1',
				submissionId: 's1',
				submissionTime: '2024-01-01T00:00:00Z',
			}),
		};
		expect(createFilloutFormSubmissionMatch()(request)).toBe(true);
	});

	it('rejects payload without formId', () => {
		const request: RawWebhookRequest = {
			headers: { 'x-fillout-signature': 'sha256=abc' },
			body: JSON.stringify({ submissionId: 's1' }),
		};
		expect(createFilloutFormSubmissionMatch()(request)).toBe(false);
	});

	it('rejects payload without submissionId', () => {
		const request: RawWebhookRequest = {
			headers: { 'x-fillout-signature': 'sha256=abc' },
			body: JSON.stringify({ formId: 'f1' }),
		};
		expect(createFilloutFormSubmissionMatch()(request)).toBe(false);
	});

	it('rejects null body', () => {
		const request: RawWebhookRequest = {
			headers: { 'x-fillout-signature': 'sha256=abc' },
			body: null,
		};
		expect(createFilloutFormSubmissionMatch()(request)).toBe(false);
	});
});

describe('Webhook signature verification', () => {
	it('returns invalid when secret is missing', () => {
		const request = {
			payload: {},
			headers: {},
			rawBody: '{}',
		} as WebhookRequest;
		expect(verifyFilloutWebhookSignature(request, '').valid).toBe(false);
	});

	it('returns invalid when raw body is missing', () => {
		const request = {
			payload: {},
			headers: { 'x-fillout-signature': 'sha256=abc' },
		} as WebhookRequest;
		expect(verifyFilloutWebhookSignature(request, 'secret').valid).toBe(false);
	});

	it('returns invalid when signature header is missing', () => {
		const request = {
			payload: {},
			headers: {},
			rawBody: '{}',
		} as WebhookRequest;
		expect(verifyFilloutWebhookSignature(request, 'secret').valid).toBe(false);
	});

	it('returns valid for correct HMAC signature', () => {
		const crypto = require('crypto');
		const secret = 'test-secret';
		const body = '{"formId":"f1"}';
		const digest = crypto
			.createHmac('sha256', secret)
			.update(body)
			.digest('hex');
		const signature = `sha256=${digest}`;

		const request = {
			payload: {},
			headers: { 'x-fillout-signature': signature },
			rawBody: body,
		} as WebhookRequest;
		expect(verifyFilloutWebhookSignature(request, secret).valid).toBe(true);
	});

	it('returns invalid for incorrect HMAC signature', () => {
		const request = {
			payload: {},
			headers: { 'x-fillout-signature': 'sha256=wrong' },
			rawBody: '{"formId":"f1"}',
		} as WebhookRequest;
		expect(verifyFilloutWebhookSignature(request, 'test-secret').valid).toBe(
			false,
		);
	});
});

describe('Destructive operations risk metadata', () => {
	it('deleteDatabase has destructive risk level', () => {
		const meta = {
			'databases.deleteDatabase': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['databases.deleteDatabase'].riskLevel).toBe('destructive');
	});

	it('deleteTable has destructive risk level', () => {
		const meta = {
			'tables.deleteTable': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['tables.deleteTable'].riskLevel).toBe('destructive');
	});

	it('deleteField has destructive risk level', () => {
		const meta = {
			'fields.deleteField': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['fields.deleteField'].riskLevel).toBe('destructive');
	});

	it('submissions.delete has destructive risk level', () => {
		const meta = {
			'submissions.delete': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['submissions.delete'].riskLevel).toBe('destructive');
	});

	it('webhooks.removeForm has destructive risk level', () => {
		const meta = {
			'webhooks.removeForm': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['webhooks.removeForm'].riskLevel).toBe('destructive');
	});

	it('token.invalidate has destructive risk level', () => {
		const meta = {
			'token.invalidate': {
				riskLevel: 'destructive',
				description: expect.any(String),
			},
		};
		expect(meta['token.invalidate'].riskLevel).toBe('destructive');
	});
});
