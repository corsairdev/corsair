jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	apiKeyResponse,
	contactPropertiesResponse,
	contactResponse,
	deletedResponse,
	idResponse,
	mailingListsResponse,
	sentResponse,
	suppressionResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Loops request shapes', () => {
	it('verifyConnection calls GET /v1/api-key with the bearer header', async () => {
		mockFetch(ok(apiKeyResponse));

		const result = await endpoints.apikey.verifyConnection(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/v1/api-key`);
		expect(lastCall().init.method).toBe('GET');
		expect(sentHeader('Authorization')).toBe('Bearer test-key');
		expect(result.teamName).toBe('Company name');
	});

	it('contacts.find sends the identifier as a query', async () => {
		mockFetch(ok([contactResponse]));

		await endpoints.contacts.find(makeCtx(), {
			email: 'alex@company.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/v1/contacts/find?email=alex%40company.com`,
		);
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('contacts.create posts the fixed fields and flattens customProperties', async () => {
		mockFetch(ok(idResponse));

		const result = await endpoints.contacts.create(makeCtx(), {
			email: 'alex@company.com',
			firstName: 'Alex',
			subscribed: true,
			userId: 'usr_7f8e9d0c1b2a',
			mailingLists: { clm2k8j4h6g0f8d6s4a2b0z8: true },
			customProperties: { planName: 'Pro', seats: 3 },
		});

		expect(lastCall().url).toBe(`${BASE}/v1/contacts/create`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			email: 'alex@company.com',
			firstName: 'Alex',
			subscribed: true,
			userId: 'usr_7f8e9d0c1b2a',
			mailingLists: { clm2k8j4h6g0f8d6s4a2b0z8: true },
			planName: 'Pro',
			seats: 3,
		});
		expect(result.id).toBe('cll42l54f20i1la0lfooe3z12');
	});

	it('contacts.update puts the body and the identifier fields', async () => {
		mockFetch(ok(idResponse));

		await endpoints.contacts.update(makeCtx(), {
			email: 'alex@company.com',
			lastName: 'Rivera',
			customProperties: { planName: 'Enterprise' },
		});

		expect(lastCall().url).toBe(`${BASE}/v1/contacts/update`);
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({
			email: 'alex@company.com',
			lastName: 'Rivera',
			planName: 'Enterprise',
		});
	});

	it('contacts.delete posts exactly the identifier it was given', async () => {
		mockFetch(ok(deletedResponse));

		const result = await endpoints.contacts.delete(makeCtx(), {
			userId: 'usr_7f8e9d0c1b2a',
		});

		expect(lastCall().url).toBe(`${BASE}/v1/contacts/delete`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ userId: 'usr_7f8e9d0c1b2a' });
		expect(result.message).toBe('Contact deleted.');
	});

	it('contacts.listProperties sends the list filter when given', async () => {
		mockFetch(ok(contactPropertiesResponse));

		await endpoints.contacts.listProperties(makeCtx(), { list: 'custom' });

		expect(lastCall().url).toBe(`${BASE}/v1/contacts/properties?list=custom`);
	});

	it('contacts.getSuppression queries by email', async () => {
		mockFetch(ok(suppressionResponse));

		const result = await endpoints.contacts.getSuppression(makeCtx(), {
			email: 'alex@company.com',
		});

		expect(lastCall().url).toBe(
			`${BASE}/v1/contacts/suppression?email=alex%40company.com`,
		);
		expect(result.isSuppressed).toBe(false);
		expect(result.removalQuota.remaining).toBe(5);
	});

	it('events.send posts the event with the identifier and flattened properties', async () => {
		mockFetch(ok(sentResponse));

		await endpoints.events.send(makeCtx(), {
			eventName: 'signup',
			email: 'alex@company.com',
			eventProperties: { plan: 'pro' },
			customProperties: { favoriteColor: 'blue' },
		});

		expect(lastCall().url).toBe(`${BASE}/v1/events/send`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			eventName: 'signup',
			email: 'alex@company.com',
			eventProperties: { plan: 'pro' },
			favoriteColor: 'blue',
		});
	});

	it('transactional.send posts the message and passes the Idempotency-Key header, not a body field', async () => {
		mockFetch(ok(sentResponse));

		await endpoints.transactional.send(makeCtx(), {
			email: 'alex@company.com',
			transactionalId: 'cll42l54f20i1la0lfooe3z12',
			addToAudience: true,
			dataVariables: { name: 'Alex' },
			idempotencyKey: '0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
		});

		expect(lastCall().url).toBe(`${BASE}/v1/transactional`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('Idempotency-Key')).toBe(
			'0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
		);
		expect(sentBody()).toEqual({
			email: 'alex@company.com',
			transactionalId: 'cll42l54f20i1la0lfooe3z12',
			addToAudience: true,
			dataVariables: { name: 'Alex' },
		});
	});

	it('transactional.send sends no Idempotency-Key header when none was given', async () => {
		mockFetch(ok(sentResponse));

		await endpoints.transactional.send(makeCtx(), {
			email: 'alex@company.com',
			transactionalId: 'cll42l54f20i1la0lfooe3z12',
		});

		expect(sentHeader('Idempotency-Key')).toBeNull();
	});

	it('lists.list calls GET /v1/lists with no query', async () => {
		mockFetch(ok(mailingListsResponse));

		const result = await endpoints.lists.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/v1/lists`);
		expect(lastCall().init.method).toBe('GET');
		expect(result).toHaveLength(2);
	});
});
