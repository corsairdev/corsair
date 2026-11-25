jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { LoopsAPIError } from './client';
import {
	contactResponse,
	contactPropertiesResponse,
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

	it('rejects a property row whose type is not one of the four', async () => {
		mockFetch(ok([{ key: 'x', label: 'X', type: 'datetime' }]));

		await expect(
			endpoints.contacts.listProperties(makeCtx(), {}),
		).rejects.toThrow();
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

		expect(caught).toBeInstanceOf(LoopsAPIError);
		expect((caught as LoopsAPIError).message).toContain(
			'Email already exists',
		);
	});

	it('carries the validation path and transactionalId from a 400 body', async () => {
		mockFetch(fail(validationErrorResponse, 400));

		const caught = await captureError(
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
			}),
		);

		expect((caught as LoopsAPIError).path).toBe('dataVariables');
		expect((caught as LoopsAPIError).transactionalId).toBe(
			'cll42l54f20i1la0lfooe3z12',
		);
	});

	it('carries a 401 message from an invalid key', async () => {
		mockFetch(fail(invalidKeyResponse, 401));

		await expect(
			endpoints.apikey.verifyConnection(makeCtx(), {}),
		).rejects.toThrow('Invalid API key');
	});
});

describe('Loops input validation', () => {
	it('rejects contacts.find with both identifiers', () => {
		expect(() =>
			endpoints.contacts.find(makeCtx(), {
				email: 'alex@company.com',
				userId: 'usr_7f8e9d0c1b2a',
			}),
		).rejects.toThrow();
	});

	it('rejects contacts.find with no identifier', () => {
		expect(() => endpoints.contacts.find(makeCtx(), {})).rejects.toThrow();
	});

	it('rejects contacts.update with no identifier', () => {
		expect(() =>
			endpoints.contacts.update(makeCtx(), { firstName: 'Alex' }),
		).rejects.toThrow();
	});

	it('rejects a custom property named email, which would overwrite the selector', () => {
		expect(() =>
			endpoints.contacts.update(makeCtx(), {
				email: 'right@company.com',
				customProperties: {
					// The body is flat, so this key would land on the selector field.
					email: 'wrong@company.com',
				} as never,
			}),
		).rejects.toThrow(/fixed field/);
	});

	it('rejects a custom property longer than 500 characters', () => {
		expect(() =>
			endpoints.contacts.create(makeCtx(), {
				email: 'alex@company.com',
				customProperties: { note: 'x'.repeat(501) } as never,
			}),
		).rejects.toThrow();
	});

	it('rejects an events.send with neither email nor userId', () => {
		expect(() =>
			endpoints.events.send(makeCtx(), { eventName: 'signup' }),
		).rejects.toThrow();
	});

	it('rejects a transactional idempotency key over 100 characters', () => {
		expect(() =>
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
				idempotencyKey: 'k'.repeat(101),
			}),
		).rejects.toThrow();
	});

	it('rejects a non-base64 attachment payload', () => {
		expect(() =>
			endpoints.transactional.send(makeCtx(), {
				email: 'alex@company.com',
				transactionalId: 'cll42l54f20i1la0lfooe3z12',
				attachments: [
					{ filename: 'a.pdf', contentType: 'application/pdf', data: '!!' },
				],
			}),
		).rejects.toThrow();
	});

	it('rejects a bad email address before any request is sent', async () => {
		const spy = currentFetch();

		await expect(
			endpoints.contacts.create(makeCtx(), { email: 'not-an-email' }),
		).rejects.toThrow();
		expect(spy).not.toHaveBeenCalled();
	});
});
