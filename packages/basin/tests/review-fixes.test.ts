/**
 * Regression guards for the defects found during review.
 *
 * Each block names the behaviour it protects and why it matters; several of
 * these were verified against the live Basin API before being fixed, and the
 * observed status codes are recorded in the comments.
 */
import { BasinAPIError, makeBasinRequest } from '../client';
import { Submissions, Webhooks } from '../endpoints';
import {
	BasinEndpointInputSchemas as Inputs,
	BasinEndpointOutputSchemas as Outputs,
} from '../endpoints/types';
import { errorHandlers } from '../error-handlers';
import type { BasinContext } from '../index';
import { safeDate } from '../schema/database';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return { ...actual, makeBasinRequest: jest.fn() };
});

/** Captures the payload handed to the event log so it can be asserted on. */
const loggedPayloads: Array<Record<string, unknown>> = [];
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(
			async (
				_ctx: unknown,
				_type: string,
				payload: Record<string, unknown>,
			) => {
				loggedPayloads.push(payload);
				return null;
			},
		),
	};
});

const mockedRequest = makeBasinRequest as jest.MockedFunction<
	typeof makeBasinRequest
>;

function ctx() {
	return {
		key: 'test-key',
		db: {},
		database: undefined,
		$getAccountId: async () => 'account_test',
	} as unknown as BasinContext;
}

describe('review regression guards', () => {
	let warn: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		loggedPayloads.length = 0;
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		warn.mockRestore();
	});

	describe('empty create payloads are rejected locally', () => {
		// Verified live: POST /projects {} and {project:{name:''}} both return 422,
		// and POST /forms {form:{}} returns 422. Accepting them here would spend a
		// request that cannot succeed.
		it.each(['formsCreate', 'projectsCreate', 'webhooksCreate'] as const)(
			'%s rejects {}',
			(schema) => {
				expect(Inputs[schema].safeParse({}).success).toBe(false);
			},
		);

		it('projectsCreate rejects a blank name', () => {
			expect(Inputs.projectsCreate.safeParse({ name: '   ' }).success).toBe(
				false,
			);
			expect(
				Inputs.projectsCreate.safeParse({ project: { name: '' } }).success,
			).toBe(false);
		});

		it('projectsCreate still accepts a real name in either shape', () => {
			expect(Inputs.projectsCreate.safeParse({ name: 'Leads' }).success).toBe(
				true,
			);
			expect(
				Inputs.projectsCreate.safeParse({ project: { name: 'Leads' } }).success,
			).toBe(true);
		});

		it('formsCreate and webhooksCreate accept a populated payload', () => {
			expect(Inputs.formsCreate.safeParse({ name: 'Contact' }).success).toBe(
				true,
			);
			expect(
				Inputs.webhooksCreate.safeParse({
					form_id: 1,
					url: 'https://example.com/hook',
				}).success,
			).toBe(true);
		});
	});

	describe('bulk refire requires targets', () => {
		// The published spec documents 422 "no submission_ids provided" for this
		// endpoint, so an empty array is a guaranteed wasted request.
		it('rejects an empty submission_ids array', () => {
			expect(
				Inputs.submissionsRefireWebhooksBulk.safeParse({ submission_ids: [] })
					.success,
			).toBe(false);
		});

		it('accepts one or more ids', () => {
			expect(
				Inputs.submissionsRefireWebhooksBulk.safeParse({
					submission_ids: [1],
				}).success,
			).toBe(true);
		});
	});

	describe('safeDate preserves the Unix epoch', () => {
		// `0` is falsy, so the guard that drops null/undefined/'' used to discard a
		// legitimate numeric timestamp.
		it('parses 0 as 1970-01-01 rather than dropping it', () => {
			const parsed = safeDate.parse(0);
			expect(parsed).toEqual(new Date(0));
		});

		it('still drops the genuinely empty values', () => {
			expect(safeDate.parse(null)).toBeUndefined();
			expect(safeDate.parse('')).toBeUndefined();
			expect(safeDate.parse(undefined)).toBeUndefined();
		});

		it('still parses ordinary timestamps', () => {
			expect(safeDate.parse('2026-02-01T00:00:00.000Z')).toEqual(
				new Date('2026-02-01T00:00:00.000Z'),
			);
		});
	});

	describe('statusless wrapped errors stay matchable by message', () => {
		// makeBasinRequest wraps every failure in a BasinAPIError, including
		// transport errors that never reached Basin and so carry no status.
		it('matches a rate-limit message on a statusless BasinAPIError', () => {
			const error = new BasinAPIError('rate_limited by gateway');
			expect(error.status).toBeUndefined();
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('still matches by status when one is present', () => {
			const error = new BasinAPIError('Too Many Requests', '429');
			Object.assign(error, { status: 429 });
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});
	});

	describe('submissions.update does not drop or leak fields', () => {
		it('merges top-level flags with an explicit submission object', async () => {
			mockedRequest.mockResolvedValue({ id: 1 });

			await Submissions.update(ctx(), {
				id: 1,
				spam: true,
				submission: { read: true },
			});

			const body = mockedRequest.mock.calls[0]?.[2]?.body as {
				submission: Record<string, unknown>;
			};
			// Without the merge, `spam` was silently discarded.
			expect(body.submission).toEqual({ spam: true, read: true });
		});

		it('never logs the raw submission payload', async () => {
			mockedRequest.mockResolvedValue({ id: 1 });

			await Submissions.update(ctx(), {
				id: 1,
				submission: { email: 'person@example.com', name: 'Real Person' },
			});

			// The payload still reaches Basin…
			const body = mockedRequest.mock.calls[0]?.[2]?.body as {
				submission: Record<string, unknown>;
			};
			expect(body.submission.email).toBe('person@example.com');

			// …but the event log sees only the id and the field names.
			const logged = loggedPayloads[0];
			expect(logged).toEqual({ id: 1, fields: ['email', 'name'] });
			expect(JSON.stringify(logged)).not.toContain('person@example.com');
			expect(JSON.stringify(logged)).not.toContain('Real Person');
		});
	});

	describe('webhook URLs are not written to the event log', () => {
		it('sends the url to Basin but keeps it out of the logged payload', async () => {
			mockedRequest.mockResolvedValue({ id: 5 });

			await Webhooks.create(ctx(), {
				form_id: 1,
				url: 'https://example.com/hook?token=super-secret',
			});

			const body = mockedRequest.mock.calls[0]?.[2]?.body as {
				form_webhook: Record<string, unknown>;
			};
			expect(body.form_webhook.url).toBe(
				'https://example.com/hook?token=super-secret',
			);

			// A webhook URL can carry a token in its query string, so the log gets
			// identifiers and field names only.
			const logged = loggedPayloads[0];
			expect(logged).toEqual({ form_id: 1, fields: ['form_id', 'url'] });
			expect(JSON.stringify(logged)).not.toContain('super-secret');
		});
	});

	describe('list schemas model the real response envelope', () => {
		// Verified live: every list endpoint returns
		// `{ <collection>: [...], meta: { count, page, per_page } }`.
		// The schemas previously declared a bare array, so all six threw ZodError
		// against the real API. The published spec documents these responses only
		// as "Success", so the wire is the only source of truth.
		const cases = [
			['formsList', 'forms'],
			['submissionsList', 'submissions'],
			['projectsList', 'projects'],
			['webhooksList', 'form_webhooks'],
			['formViewsList', 'form_views'],
			['domainsList', 'domains'],
		] as const;

		it.each(cases)(
			'%s accepts the envelope and rejects a bare array',
			(schema, collection) => {
				const envelope = {
					[collection]: [],
					meta: { count: 0, page: 1, per_page: 100 },
				};
				expect(Outputs[schema].safeParse(envelope).success).toBe(true);
				expect(Outputs[schema].safeParse([]).success).toBe(false);
			},
		);

		it('keeps the extra counters the submissions list adds to meta', () => {
			const parsed = Outputs.submissionsList.parse({
				submissions: [],
				meta: { count: 0, page: 1, per_page: 100, spam_count: 3 },
			});
			expect(parsed.meta?.spam_count).toBe(3);
		});
	});

	describe('a bad API key is classified as an auth failure', () => {
		// Basin answers a bad key with 400, not 401, and puts the detail in the
		// body while `message` is only "Bad Request".
		it('matches AUTH_ERROR rather than VALIDATION_ERROR', () => {
			const error = new BasinAPIError('Bad Request');
			Object.assign(error, {
				status: 400,
				body: { error: 'Bad API key or user does not exist.' },
			});

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('leaves a genuine 400 validation error alone', () => {
			const error = new BasinAPIError('Bad Request');
			Object.assign(error, {
				status: 400,
				body: { error: 'param is missing or the value is empty: project' },
			});

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
			expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		});
	});

	describe('retry policy', () => {
		// The transport already retries 429s via BASIN_RATE_LIMIT_CONFIG, and the
		// binder discards a successful retry's value, so no handler may retry.
		it('never asks the binder to retry', async () => {
			type AnyHandler = (
				error: Error,
				context: { operation: string },
			) => Promise<{ maxRetries: number }>;

			for (const [name, entry] of Object.entries(errorHandlers)) {
				const handler = entry.handler as AnyHandler;
				const result = await handler(new Error('boom'), {
					operation: 'forms.list',
				});
				expect([name, result.maxRetries]).toEqual([name, 0]);
			}
		});
	});
});
