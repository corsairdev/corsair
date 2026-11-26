jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import {
	contactPropertiesResponse,
	contactResponse,
	contactWithoutUserGroupResponse,
	duplicateContactResponse,
	invalidKeyResponse,
	mailingListsResponse,
	suppressionResponse,
	validationErrorResponse,
} from './test-fixtures';
import {
	captureError,
	currentFetch,
	endpoints,
	fail,
	installFetchMock,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Loops output parsing', () => {
	it('parses the contact find array and its custom properties', async () => {
		mockFetch(ok([contactResponse]));

		const result = await endpoints.contacts.find(makeCtx(), {
			email: 'alex@company.com',
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe('clh3k9m2p4q6r8s0t2v4x6z8');
		expect(result[0]?.favoriteColor).toBe('blue');
	});

	it('parses a contact that omits userGroup and userId', async () => {
		// The spec requires no Contact fields beyond the identity pair.
		mockFetch(ok([contactWithoutUserGroupResponse]));

		const result = await endpoints.contacts.find(makeCtx(), {
			email: 'alex@company.com',
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.userGroup).toBeUndefined();
	});

	it('parses the bare mailing list array with a null description', async () => {
		mockFetch(ok(mailingListsResponse));

		const result = await endpoints.lists.list(makeCtx(), {});

		expect(result[0]?.isPublic).toBe(true);
		expect(result[1]?.description).toBeNull();
	});

	it('parses contact properties with their types', async () => {
		mockFetch(ok(contactPropertiesResponse));

		const result = await endpoints.contacts.listProperties(makeCtx(), {
			list: 'all',
		});

		expect(result.map((property) => property.type)).toEqual([
			'string',
			'string',
			'number',
			'date',
		]);
	});

	it('parses the suppression status and quota', async () => {
		mockFetch(ok(suppressionResponse));

		const result = await endpoints.contacts.getSuppression(makeCtx(), {
			email: 'alex@company.com',
		});

		expect(result.contact.id).toBe('clh3k9m2p4q6r8s0t2v4x6z8');
		expect(result.removalQuota.limit).toBe(5);
	});

	it('rejects a find answer that is not an array', async () => {
		mockFetch(ok({ oops: true }));

		await expect(
			endpoints.contacts.find(makeCtx(), { email: 'alex@company.com' }),
		).rejects.toThrow();
	});

	it('accepts a property type Loops adds later', async () => {
		mockFetch(ok([{ key: 'x', label: 'X', type: 'datetime' }]));

		await expect(
			endpoints.contacts.listProperties(makeCtx(), {}),
		).resolves.toEqual([{ key: 'x', label: 'X', type: 'datetime' }]);
	});

	it('rejects a contact missing its email', async () => {
		mockFetch(ok([{ ...contactResponse, email: undefined }]));

		await expect(
			endpoints.contacts.find(makeCtx(), { email: 'alex@company.com' }),
		).rejects.toThrow();
	});

	it('rejects a contact delete that answers no message', async () => {
		mockFetch(ok({ success: true }));

		await expect(
			endpoints.contacts.delete(makeCtx(), { userId: 'usr_7f8e9d0c1b2a' }),
		).rejects.toThrow();
	});

	it('treats a 200 success:false body as a failure, not as a created contact', async () => {
		mockFetch(ok(duplicateContactResponse));

		const caught = await captureError(
			endpoints.contacts.create(makeCtx(), { email: 'alex@company.com' }),
		);

		expect(caught).toBeInstanceOf(ApiError);
		expect((caught as ApiError).message).toContain('Email already exists');
	});

	it('carries the validation path and transactionalId from a 400 body', async () => {
		mockFetch(fail(validationErrorResponse, 400));

		const caught = await captureError(
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
			}),
		);

		expect((caught as ApiError).body).toMatchObject({
			error: { path: 'dataVariables' },
			transactionalId: 'cll42l54f20i1la0lfooe3z12',
		});
	});

	it('carries a 401 message from an invalid key', async () => {
		mockFetch(fail(invalidKeyResponse, 401));

		await expect(
			endpoints.apikey.verifyConnection(makeCtx(), {}),
		).rejects.toThrow('Invalid API key');
	});
});

/**
 * Asserts the input schema refused the call: a ZodError, and no request sent.
 * A bare rejects.toThrow() would also pass on the unmocked-fetch error.
 */
async function expectInputRejected(
	// unknown: each endpoint resolves to its own output type; only the
	// rejection matters here.
	call: () => Promise<unknown>,
	message?: RegExp,
): Promise<void> {
	const caught = await captureError(call());
	expect(caught).toBeInstanceOf(ZodError);
	if (message) expect((caught as ZodError).message).toMatch(message);
	expect(currentFetch()).not.toHaveBeenCalled();
}

describe('Loops input validation', () => {
	it('rejects contacts.find with both identifiers', async () => {
		await expectInputRejected(
			() =>
				endpoints.contacts.find(makeCtx(), {
					email: 'alex@company.com',
					userId: 'usr_7f8e9d0c1b2a',
				}),
			/not both/,
		);
	});

	it('rejects contacts.find with no identifier', async () => {
		await expectInputRejected(
			() => endpoints.contacts.find(makeCtx(), {}),
			/exactly one/,
		);
	});

	it('rejects an empty userId next to an email, which would be sent as userId=', async () => {
		await expectInputRejected(
			() =>
				endpoints.contacts.find(makeCtx(), {
					email: 'alex@company.com',
					userId: '',
				}),
			/cannot be empty/,
		);
		await expectInputRejected(
			() =>
				endpoints.contacts.delete(makeCtx(), {
					email: 'alex@company.com',
					userId: '',
				}),
			/cannot be empty/,
		);
	});

	it('rejects contacts.update with no identifier', async () => {
		await expectInputRejected(
			() => endpoints.contacts.update(makeCtx(), { firstName: 'Alex' }),
			/Provide email or userId/,
		);
	});

	it('rejects contacts.create with no email', async () => {
		// Loops answers 400 for an identifier-less create; fail before the call.
		await expectInputRejected(
			() => endpoints.contacts.create(makeCtx(), { firstName: 'Alex' }),
			/Provide an email/,
		);
	});

	it('rejects a custom property named email, which would overwrite the selector', async () => {
		await expectInputRejected(
			() =>
				endpoints.contacts.update(makeCtx(), {
					email: 'right@company.com',
					customProperties: {
						// The body is flat, so this key would land on the selector field.
						email: 'wrong@company.com',
					} as never,
				}),
			/fixed field/,
		);
	});

	it('rejects a custom property longer than 500 characters', async () => {
		await expectInputRejected(() =>
			endpoints.contacts.create(makeCtx(), {
				email: 'alex@company.com',
				customProperties: { note: 'x'.repeat(501) } as never,
			}),
		);
	});

	it('rejects an events.send with neither email nor userId', async () => {
		await expectInputRejected(
			() => endpoints.events.send(makeCtx(), { eventName: 'signup' }),
			/Provide email or userId/,
		);
	});

	it('rejects a transactional idempotency key over 100 characters', async () => {
		await expectInputRejected(() =>
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
				idempotencyKey: 'k'.repeat(101),
			}),
		);
	});

	it('rejects a non-base64 attachment payload', async () => {
		await expectInputRejected(() =>
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
				attachments: [
					{ filename: 'a.pdf', contentType: 'application/pdf', data: '!!' },
				],
			}),
		);
	});

	it('rejects a bad email address before any request is sent', async () => {
		await expectInputRejected(() =>
			endpoints.contacts.create(makeCtx(), { email: 'not-an-email' }),
		);
	});

	it('rejects a custom property that would overwrite an events.send field', async () => {
		for (const key of ['eventName', 'eventProperties', 'idempotencyKey']) {
			await expectInputRejected(
				() =>
					endpoints.events.send(makeCtx(), {
						eventName: 'signup',
						email: 'alex@company.com',
						customProperties: { [key]: 'cancelled' },
					}),
				/fixed field/,
			);
		}
	});

	it('rejects an empty or blank idempotency key, which would go out as no key', async () => {
		// Fetch trims spaces, tabs and line breaks from header values.
		for (const idempotencyKey of ['', ' ', '\t \r\n']) {
			await expectInputRejected(() =>
				endpoints.transactional.send(makeCtx(), {
					email: 'alex@company.com',
					transactionalId: 'cll42l54f20i1la0lfooe3z12',
					idempotencyKey,
				}),
			);
			await expectInputRejected(() =>
				endpoints.events.send(makeCtx(), {
					eventName: 'signup',
					email: 'alex@company.com',
					idempotencyKey,
				}),
			);
		}
	});

	it('checks campaign scheduling per mode', async () => {
		await expectInputRejected(
			() =>
				endpoints.campaigns.update(makeCtx(), {
					campaignId: 'c_1',
					scheduling: { method: 'schedule' },
				}),
			/timestamp is required/,
		);
		await expectInputRejected(
			() =>
				endpoints.campaigns.update(makeCtx(), {
					campaignId: 'c_1',
					scheduling: { method: 'now', timestamp: '2030-01-01T00:00:00Z' },
				}),
			/Leave timestamp out/,
		);
	});

	it('rejects removeSuppression with an empty second selector', async () => {
		await expectInputRejected(
			() =>
				endpoints.contacts.removeSuppression(makeCtx(), {
					email: 'alex@company.com',
					userId: '',
				}),
			/neither empty/,
		);
	});
});
