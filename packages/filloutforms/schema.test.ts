import {
	FilloutFormsEndpointInputSchemas,
	FilloutFormsEndpointOutputSchemas,
} from './endpoints/types';
import { FilloutFormsSchema } from './schema';

describe('FilloutForms schema', () => {
	it('declares a semver version', () => {
		expect(FilloutFormsSchema.version).toBeDefined();
		expect(FilloutFormsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities for forms, submissions, and webhooks', () => {
		expect(typeof FilloutFormsSchema.entities).toBe('object');
		expect(FilloutFormsSchema.entities).not.toBeNull();
		expect(Object.keys(FilloutFormsSchema.entities)).toEqual(
			expect.arrayContaining([
				'forms',
				'submissions',
				'webhooks',
				'databases',
				'records',
			]),
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

	it('createFormWebhook requires formId and url', () => {
		expect(
			FilloutFormsEndpointInputSchemas.createFormWebhook.safeParse({}).success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.createFormWebhook.safeParse({
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

	it('invalidateAccessToken requires token', () => {
		expect(
			FilloutFormsEndpointInputSchemas.invalidateAccessToken.safeParse({})
				.success,
		).toBe(false);
		expect(
			FilloutFormsEndpointInputSchemas.invalidateAccessToken.safeParse({
				token: 'tok123',
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
			FilloutFormsEndpointOutputSchemas.createFormWebhook.safeParse({
				id: 123,
			});
		expect(result.success).toBe(true);
	});

	it('createDatabase parses official database payload', () => {
		const result = FilloutFormsEndpointOutputSchemas.createDatabase.safeParse({
			id: 'db1',
			name: 'Main',
			tables: [
				{
					id: 'tbl1',
					name: 'Contacts',
					order: 0,
					primaryFieldId: 'fld1',
					fields: [
						{
							id: 'fld1',
							name: 'Name',
							type: 'single_line_text',
							template: {},
							order: 0,
						},
					],
					views: [{ id: 'v1', name: 'Grid', type: 'grid' }],
					url: 'https://app.zite.com/database/db1/tbl1',
				},
			],
			createdAt: '2025-01-01T00:00:00.000Z',
			updatedAt: '2025-01-01T00:00:00.000Z',
			url: 'https://app.zite.com/database/db1',
		});
		expect(result.success).toBe(true);
	});
});
