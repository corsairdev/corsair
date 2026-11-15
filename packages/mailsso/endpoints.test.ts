import { z } from 'zod';
import { MailssoAPIError, MailssoSubscriptionRequiredError } from './client';
import { Validations } from './endpoints';
import {
	MailssoEndpointInputSchemas as Inputs,
	MailssoEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	batchCompletedFixture,
	batchCreatedFixture,
	batchJobId,
	batchProcessingFixture,
	batchTooSmallBody,
	invalidBodyBody,
	invalidJobIdBody,
	jobMissingBody,
	singleInvalidFormatFixture,
	singleRiskyFixture,
	singleUndeliverableFixture,
	subscriptionRequiredBody,
	unauthorizedBody,
} from './test-fixtures';
import { captureError, jsonResponse, makeContext } from './test-helpers';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('validations.single output', () => {
	it.each([
		['undeliverable', singleUndeliverableFixture],
		['risky', singleRiskyFixture],
		['malformed address', singleInvalidFormatFixture],
	])('parses a live %s answer', async (_label, fixture) => {
		fetchMock.mockResolvedValueOnce(jsonResponse(fixture));

		const result = await Validations.single(makeContext(), {
			email: fixture.data.email,
		});

		expect(result).toEqual(fixture.data);
		expect(Outputs.validationsSingle.parse(result)).toEqual(fixture.data);
	});

	it('keeps null fields as null', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleUndeliverableFixture));

		const result = await Validations.single(makeContext(), {
			email: 'test@example.com',
		});

		expect(result.did_you_mean).toBeNull();
		expect(result.mx_record).toBeNull();
		expect(result.provider).toBeNull();
		expect(result.avatar).toBeNull();
		expect(result.is_disposable).toBe(true);
	});

	it('accepts a result and reason value it has not seen', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				data: {
					...singleRiskyFixture.data,
					result: 'a_new_verdict',
					reason: 'a_new_reason',
				},
				error: null,
			}),
		);

		const result = await Validations.single(makeContext(), {
			email: 'hello@mails.so',
		});

		expect(result.result).toBe('a_new_verdict');
		expect(result.reason).toBe('a_new_reason');
	});

	it('keeps a field the schema does not name', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				data: { ...singleRiskyFixture.data, added_later: 'x' },
				error: null,
			}),
		);

		const result = await Validations.single(makeContext(), {
			email: 'hello@mails.so',
		});

		expect(result).toHaveProperty('added_later', 'x');
	});

	it('rejects a body that has no data object', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ error: null }));

		const caught = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('rejects a data object whose score is not a number', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				data: { ...singleRiskyFixture.data, score: 'high' },
				error: null,
			}),
		);

		const caught = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('rejects a data object that has no result', async () => {
		const { result: _omitted, ...withoutResult } = singleRiskyFixture.data;
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ data: withoutResult, error: null }),
		);

		const caught = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('throws the provider message for a 401', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(unauthorizedBody, 401));

		const caught = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({ status: 401, message: 'Unauthorized' });
	});

	it('treats a 200 whose body carries an error as a failure', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ data: null, error: 'Something went wrong.' }),
		);

		const caught = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({
			status: 200,
			message: 'Something went wrong.',
		});
	});
});

describe('validations.batch output', () => {
	it('parses the bare job object a live POST returned', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));

		const result = await Validations.batch(makeContext(), {
			emails: ['probe-a@example.com', 'probe-b@example.com'],
		});

		expect(result).toEqual(batchCreatedFixture);
		expect(result.finished_at).toBeNull();
		// `user` is not in the schema; .loose() keeps it.
		expect(result).toHaveProperty('user', null);
	});

	it('parses the job object the docs show, which has no status', async () => {
		const docsExample = {
			id: 'ddb951fe-643d-4c20-bc2c-525593d86cb6',
			name: null,
			created_at: '2024-07-22T08:15:33.599428539Z',
			updated_at: '2024-07-22T08:15:33.599428539Z',
			deleted_at: null,
			finished_at: null,
			user: null,
			user_id: 'a143de55-5dc6-45c1-abb1-035dc86150b4',
			size: 3,
		};
		fetchMock.mockResolvedValueOnce(jsonResponse(docsExample));

		const result = await Validations.batch(makeContext(), {
			emails: ['a@example.com', 'b@example.com', 'c@example.com'],
		});

		expect(result.size).toBe(3);
		expect(result.name).toBeNull();
		expect(result.status).toBeUndefined();
	});

	it('rejects an enveloped body, which a job never arrives in', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ data: batchCreatedFixture, error: null }),
		);

		const caught = await captureError(
			Validations.batch(makeContext(), {
				emails: ['probe-a@example.com', 'probe-b@example.com'],
			}),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('rejects a job whose size is not a number', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ ...batchCreatedFixture, size: '2' }),
		);

		const caught = await captureError(
			Validations.batch(makeContext(), {
				emails: ['probe-a@example.com', 'probe-b@example.com'],
			}),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('throws a distinct error when the plan has no batch validation', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(subscriptionRequiredBody, 401),
		);

		const caught = await captureError(
			Validations.batch(makeContext(), {
				emails: ['probe-a@example.com', 'probe-b@example.com'],
			}),
		);

		expect(caught).toBeInstanceOf(MailssoSubscriptionRequiredError);
		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({
			status: 401,
			message: 'Paid subscription required to use list validations',
		});
	});

	it('throws the provider code for a batch Mails.so judges too small', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchTooSmallBody, 400));

		const caught = await captureError(
			Validations.batch(makeContext(), {
				emails: ['a@example.com', 'b@example.com'],
			}),
		);

		expect(caught).toMatchObject({ status: 400, code: 'BATCH_TOO_SMALL' });
		expect(caught).not.toBeInstanceOf(MailssoSubscriptionRequiredError);
	});

	it('throws the provider message for a malformed body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invalidBodyBody, 400));

		const caught = await captureError(
			Validations.batch(makeContext(), {
				emails: ['a@example.com', 'b@example.com'],
			}),
		);

		expect(caught).toMatchObject({
			status: 400,
			message: 'The body provided has an invalid format.',
		});
	});
});

describe('validations.getBatch output', () => {
	it('parses a completed job with its stats and per-address results', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCompletedFixture));

		const result = await Validations.getBatch(makeContext(), {
			id: batchJobId,
		});

		expect(result).toEqual(batchCompletedFixture);
		expect(result.stats?.total).toBe(2);
		expect(result.stats?.invalid_domain).toBe(2);
		expect(result.emails?.map((entry) => entry.email)).toEqual([
			'probe-a@example.com',
			'probe-b@example.com',
		]);
	});

	it('parses a pending job that has no stats or emails yet', async () => {
		const {
			stats: _stats,
			emails: _emails,
			...pending
		} = batchCompletedFixture;
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				...pending,
				status: 'pending',
				finished_at: null,
			}),
		);

		const result = await Validations.getBatch(makeContext(), {
			id: batchJobId,
		});

		expect(result.status).toBe('pending');
		expect(result.finished_at).toBeNull();
		expect(result.emails).toBeUndefined();
		expect(result.stats).toBeUndefined();
	});

	it('reads a running job, which Mails.so answers with a 202 and an error note', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchProcessingFixture, 202));

		const result = await Validations.getBatch(makeContext(), {
			id: batchProcessingFixture.data.id,
		});

		expect(result.status).toBe('processing');
		expect(result.id).toBe(batchProcessingFixture.data.id);
		expect(result.created_at).toBe(batchProcessingFixture.data.created_at);
		expect(result.size).toBeUndefined();
		expect(result.finished_at).toBeUndefined();
		expect(result.emails).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('still fails a status read whose error is not the progress note', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{ data: { id: batchJobId, status: 'failed' }, error: 'Job failed' },
				200,
			),
		);

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({ message: 'Job failed' });
	});

	it('does not accept the progress note from a validation or a batch start', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(batchProcessingFixture, 202),
		);

		const single = await captureError(
			Validations.single(makeContext(), { email: 'a@example.com' }),
		);
		const batch = await captureError(
			Validations.batch(makeContext(), {
				emails: ['a@example.com', 'b@example.com'],
			}),
		);

		expect(single).toMatchObject({ message: 'Job is still processing' });
		expect(batch).toMatchObject({ message: 'Job is still processing' });
	});

	it('rejects a job that has no status', async () => {
		const { status: _status, ...withoutStatus } = batchCompletedFixture;
		fetchMock.mockResolvedValueOnce(jsonResponse(withoutStatus));

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('rejects an emails list that is not an array', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ ...batchCompletedFixture, emails: 'none' }),
		);

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('rejects a stats count that is not a number', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				...batchCompletedFixture,
				stats: { ...batchCompletedFixture.stats, total: 'two' },
			}),
		);

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toBeInstanceOf(z.ZodError);
	});

	it('throws the provider message for a job that does not exist', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(jobMissingBody, 404));

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toMatchObject({
			status: 404,
			message: 'the job does not exist',
		});
	});

	it('throws the provider message for an id Mails.so refuses', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invalidJobIdBody, 400));

		const caught = await captureError(
			Validations.getBatch(makeContext(), { id: batchJobId }),
		);

		expect(caught).toMatchObject({ status: 400, message: 'invalid job id' });
	});
});

describe('input schemas', () => {
	it('single requires a non-empty email', () => {
		expect(
			Inputs.validationsSingle.safeParse({ email: 'a@b.co' }).success,
		).toBe(true);
		expect(Inputs.validationsSingle.safeParse({ email: '' }).success).toBe(
			false,
		);
		expect(Inputs.validationsSingle.safeParse({}).success).toBe(false);
		expect(Inputs.validationsSingle.safeParse({ email: 5 }).success).toBe(
			false,
		);
	});

	it('single passes a malformed address through, since Mails.so grades it', () => {
		expect(
			Inputs.validationsSingle.safeParse({ email: 'notanemail' }).success,
		).toBe(true);
	});

	it('batch pins the 2-different-emails boundary', () => {
		const parse = (emails: string[]) =>
			Inputs.validationsBatch.safeParse({ emails }).success;

		expect(parse(['a@x.co', 'b@x.co'])).toBe(true);
		expect(parse(['a@x.co', 'b@x.co', 'a@x.co'])).toBe(true);
		expect(parse(['a@x.co'])).toBe(false);
		expect(parse([])).toBe(false);
		expect(parse(['a@x.co', 'a@x.co'])).toBe(false);
	});

	it('batch rejects a missing, non-array or blank emails value', () => {
		expect(Inputs.validationsBatch.safeParse({}).success).toBe(false);
		expect(
			Inputs.validationsBatch.safeParse({ emails: 'a@x.co' }).success,
		).toBe(false);
		expect(
			Inputs.validationsBatch.safeParse({ emails: ['a@x.co', ''] }).success,
		).toBe(false);
	});

	it('getBatch accepts the id Mails.so issued and refuses anything else', () => {
		expect(
			Inputs.validationsGetBatch.safeParse({ id: batchJobId }).success,
		).toBe(true);
		expect(Inputs.validationsGetBatch.safeParse({ id: 'abc' }).success).toBe(
			false,
		);
		expect(Inputs.validationsGetBatch.safeParse({ id: '' }).success).toBe(
			false,
		);
		expect(Inputs.validationsGetBatch.safeParse({}).success).toBe(false);
	});
});
