import { ApiError } from 'corsair/http';
import type { MailcheckOperation } from './client';
import { checkSingleEmail, makeMailcheckRequest } from './client';
import {
	MailcheckEndpointInputSchemas,
	MailcheckEndpointOutputSchemas,
} from './endpoints/types';

// Live tests hit the real Mailcheck API and only run when MAILCHECK_API_KEY
// is set. Never hardcode a key here (.github/PLUGIN_PR_RULES.md R6) —
// export it in your shell and run `pnpm test`. Without a key the suite
// skips itself, so the same command safely runs only the unit tests.
const API_KEY = process.env.MAILCHECK_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

// Mailcheck v1 has no synchronous single-email endpoint. The flow is:
//   POST /v1/emails:check           -> creates a long-running operation
//   GET  /v1/emails/operations/{id} -> done:true + response.url (signed)
//   GET  <response.url>             -> JSON results (object for 1 email,
//                                      array for several)
// The plugin's email.verify and domain.validate endpoints run this whole
// flow through checkSingleEmail().
const BATCH_CHECK_PATH = '/v1/emails:check';
const OPERATIONS_PATH = '/v1/emails/operations';

type MailcheckOperationsList = {
	operations?: MailcheckOperation[];
	nextPageToken?: string;
};

// Batch operations take several seconds to complete.
jest.setTimeout(90_000);

describeLive('Mailcheck live API (requires MAILCHECK_API_KEY)', () => {
	const key = API_KEY as string;

	describe('batch check (POST /v1/emails:check)', () => {
		it('creates an operation resource', async () => {
			const result = await makeMailcheckRequest<MailcheckOperation>(
				BATCH_CHECK_PATH,
				key,
				{ method: 'POST', body: { emails: ['live-test@gmail.com'] } },
			);

			expect(typeof result.name).toBe('string');
			expect(result.name).toMatch(/^operations\//);
			expect(typeof result.done).toBe('boolean');
			expect(result.metadata?.totalCount).toBe(1);
		});

		it('created operation completes and exposes a signed results URL', async () => {
			// Mirror the client's busy-retry: only one operation can run at a
			// time per account, so the POST may 400 with "wait for the running
			// operation to finish" until the previous one completes.
			const deadline = Date.now() + 60_000;
			let created: MailcheckOperation | undefined;
			while (!created) {
				if (Date.now() > deadline) {
					throw new Error('operation stayed busy for 60s');
				}
				try {
					created = await makeMailcheckRequest<MailcheckOperation>(
						BATCH_CHECK_PATH,
						key,
						{ method: 'POST', body: { emails: ['poll-test@gmail.com'] } },
					);
				} catch (error) {
					if (
						!(error instanceof ApiError) ||
						error.status !== 400 ||
						!String(error.body ?? '').includes('wait for the running operation')
					) {
						throw error;
					}
					await new Promise((resolve) => setTimeout(resolve, 3000));
				}
			}
			const operationId = created.name.replace(/^operations\//, '');
			expect(operationId).toBeTruthy();

			let current = created;
			for (let i = 0; i < 40 && !current.done; i++) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				current = await makeMailcheckRequest<MailcheckOperation>(
					`${OPERATIONS_PATH}/${operationId}`,
					key,
					{ method: 'GET' },
				);
			}

			expect(current.done).toBe(true);
			expect(typeof current.response?.url).toBe('string');
			expect(current.metadata?.processedCount).toBe(1);
		});
	});

	describe('operations list (GET /v1/emails/operations)', () => {
		it('returns an operations array', async () => {
			const result = await makeMailcheckRequest<MailcheckOperationsList>(
				OPERATIONS_PATH,
				key,
				{ method: 'GET' },
			);

			expect(Array.isArray(result.operations)).toBe(true);
			for (const op of result.operations ?? []) {
				expect(op.name).toMatch(/^operations\//);
				expect(typeof op.done).toBe('boolean');
			}
		});
	});

	describe('email.verify endpoint flow (checkSingleEmail)', () => {
		// One live check verifies schema shape, email echo, and trustRate
		// bounds together — Mailcheck free tier only allows a handful of
		// checks per month, so we must not burn one per assertion.
		it('returns a schema-valid result for a single email', async () => {
			const email = 'hello@gmail.com';
			const result = await checkSingleEmail<{
				email: string;
				trustRate: number;
			}>(email, key);

			expect(() =>
				MailcheckEndpointOutputSchemas.verifyEmail.parse(result),
			).not.toThrow();
			expect(result.email).toBe(email);
			expect(result.trustRate).toBeGreaterThanOrEqual(0);
			expect(result.trustRate).toBeLessThanOrEqual(100);
		});
	});

	describe('domain.validate endpoint flow (admin@{domain})', () => {
		it('returns a result matching the validateDomain output schema', async () => {
			// The plugin validates a domain by checking admin@{domain}.
			const result = await checkSingleEmail('admin@example.com', key);

			expect(() =>
				MailcheckEndpointOutputSchemas.validateDomain.parse(result),
			).not.toThrow();
		});
	});

	describe('authentication', () => {
		it('rejects an invalid API key on batch check with a 401 ApiError', async () => {
			try {
				await makeMailcheckRequest(BATCH_CHECK_PATH, 'invalid-key', {
					method: 'POST',
					body: { emails: ['a@b.com'] },
				});
				throw new Error('expected request to fail');
			} catch (error) {
				expect(error).toBeInstanceOf(ApiError);
				expect((error as ApiError).status).toBe(401);
			}
		});

		it('rejects an invalid API key on operations list', async () => {
			await expect(
				makeMailcheckRequest(OPERATIONS_PATH, 'invalid-key', { method: 'GET' }),
			).rejects.toThrow(ApiError);
		});
	});
});

describe('Mailcheck endpoint contract (offline)', () => {
	describe('input schemas', () => {
		it('verifyEmail accepts a valid email', () => {
			const result = MailcheckEndpointInputSchemas.verifyEmail.safeParse({
				email: 'user@example.com',
			});
			expect(result.success).toBe(true);
		});

		it('verifyEmail rejects a malformed email', () => {
			const result = MailcheckEndpointInputSchemas.verifyEmail.safeParse({
				email: 'not-an-email',
			});
			expect(result.success).toBe(false);
		});

		it('verifyEmail rejects a missing email', () => {
			const result = MailcheckEndpointInputSchemas.verifyEmail.safeParse({});
			expect(result.success).toBe(false);
		});

		it('validateDomain accepts a domain string', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'example.com',
			});
			expect(result.success).toBe(true);
		});

		it('validateDomain rejects a non-string domain', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 42,
			});
			expect(result.success).toBe(false);
		});

		it('validateDomain rejects an email address', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'user@example.com',
			});
			expect(result.success).toBe(false);
		});

		it('validateDomain rejects a URL', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'https://example.com',
			});
			expect(result.success).toBe(false);
		});

		it('validateDomain rejects a value containing a path', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'example.com/docs',
			});
			expect(result.success).toBe(false);
		});

		it('validateDomain accepts a multi-label subdomain', () => {
			const result = MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'mail.example.co.uk',
			});
			expect(result.success).toBe(true);
		});
	});

	describe('output schemas', () => {
		const validVerification = {
			email: 'user@example.com',
			trustRate: 95,
			mxExists: true,
			smtpExists: true,
			isNotDisposable: true,
			isNotSmtpCatchAll: true,
		};

		it('verifyEmail accepts a valid response', () => {
			const result =
				MailcheckEndpointOutputSchemas.verifyEmail.safeParse(validVerification);
			expect(result.success).toBe(true);
		});

		it('verifyEmail accepts a response with gravatar data', () => {
			const result = MailcheckEndpointOutputSchemas.verifyEmail.safeParse({
				...validVerification,
				gravatar: {
					entries: [
						{
							profileUrl: 'https://gravatar.com/example',
							preferredUsername: 'example',
							accounts: [{ domain: 'twitter.com' }],
						},
					],
				},
			});
			expect(result.success).toBe(true);
		});

		it('verifyEmail accepts gravatar: null as the API returns', () => {
			const result = MailcheckEndpointOutputSchemas.verifyEmail.safeParse({
				...validVerification,
				gravatar: null,
			});
			expect(result.success).toBe(true);
		});

		it('verifyEmail passes through extra fields returned by the API', () => {
			const result = MailcheckEndpointOutputSchemas.verifyEmail.safeParse({
				...validVerification,
				gravatar: null,
				githubUsername: '',
				facebook: null,
				microsoftAccountExists: false,
			});
			expect(result.success).toBe(true);
		});

		it('verifyEmail rejects a response with missing fields', () => {
			const result =
				MailcheckEndpointOutputSchemas.verifyEmail.safeParse(undefined);
			expect(result.success).toBe(false);
		});

		it('verifyEmail rejects a negative trustRate', () => {
			const result = MailcheckEndpointOutputSchemas.verifyEmail.safeParse({
				...validVerification,
				trustRate: -5,
			});
			expect(result.success).toBe(false);
		});

		it('verifyEmail rejects a trustRate above 100', () => {
			const result = MailcheckEndpointOutputSchemas.verifyEmail.safeParse({
				...validVerification,
				trustRate: 150,
			});
			expect(result.success).toBe(false);
		});

		it('validateDomain accepts a valid response', () => {
			const result = MailcheckEndpointOutputSchemas.validateDomain.safeParse({
				email: 'admin@example.com',
				trustRate: 80,
				mxExists: true,
				smtpExists: false,
				isNotDisposable: true,
				isNotSmtpCatchAll: false,
			});
			expect(result.success).toBe(true);
		});
	});
});
