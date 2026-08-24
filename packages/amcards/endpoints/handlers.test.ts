import { AuthMissingError } from 'corsair/core';
import { makeAmcardsRequest } from '../client';
import type { AmcardsContext } from '../index';
import { amcards } from '../index';
import {
	getApiSchema,
	getCards,
	getCategory,
	getCategorySchema,
	getContacts,
	getGift,
	getPublicTemplate,
	listCategories,
	listGifts,
	listPublicTemplates,
} from './handlers';
import { AmcardsEndpointOutputSchemas } from './types';

jest.mock('../client', () => ({
	makeAmcardsRequest: jest.fn(),
	encodeAmcardsPathId: jest.requireActual('../client').encodeAmcardsPathId,
	compactQuery: jest.requireActual('../client').compactQuery,
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue('evt'),
}));

const mockRequest = makeAmcardsRequest as jest.MockedFunction<
	typeof makeAmcardsRequest
>;

function ctx(): AmcardsContext {
	return { key: 'k', options: {} } as unknown as AmcardsContext;
}

beforeEach(() => {
	mockRequest.mockReset();
});

const contact = {
	id: 1,
	first_name: 'Ada',
	last_name: 'Lovelace',
	email: 'ada@example.com',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-02T00:00:00Z',
};
const category = { id: 9, title: 'Birthday', priority: 1 };
const gift = {
	id: 3,
	name: 'Mug',
	description: 'Ceramic',
	price: '12.00',
	shipping_cost: '4.00',
	available: true,
};
const template = { id: 4, name: 'Thanks', panels: [] };
const card = { id: 7 };

describe('all AMcards endpoint handlers', () => {
	it('schema.getApi hits the v1 root', async () => {
		mockRequest.mockResolvedValueOnce({
			cards: 'https://amcards.com/api/v1/cards/',
		});
		const result = await getApiSchema(ctx(), {});
		expect(mockRequest).toHaveBeenLastCalledWith('', 'k');
		expect(result).toEqual({ cards: 'https://amcards.com/api/v1/cards/' });
	});

	it('schema.getCategory hits categories/schema/', async () => {
		mockRequest.mockResolvedValueOnce({ fields: { title: {} } });
		const result = await getCategorySchema(ctx(), {});
		expect(mockRequest).toHaveBeenLastCalledWith('categories/schema/', 'k');
		expect(
			AmcardsEndpointOutputSchemas.getCategorySchema.parse(result).fields,
		).toBeDefined();
	});

	it('cards.list maps skip to offset', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [card] });
		await getCards(ctx(), { skip: 20, limit: 10 });
		expect(mockRequest).toHaveBeenLastCalledWith('cards/', 'k', {
			query: { offset: 20, limit: 10 },
		});
	});

	it('contacts.list forwards filters', async () => {
		mockRequest.mockResolvedValueOnce({ results: [contact] });
		const result = await getContacts(ctx(), {
			email: 'ada@example.com',
			first_name: 'Ada',
			last_name: 'Lovelace',
			limit: 5,
		});
		expect(mockRequest).toHaveBeenLastCalledWith('contacts/', 'k', {
			query: {
				offset: undefined,
				limit: 5,
				email: 'ada@example.com',
				first_name: 'Ada',
				last_name: 'Lovelace',
			},
		});
		expect(AmcardsEndpointOutputSchemas.getContacts.parse(result)).toEqual({
			results: [contact],
		});
	});

	it('categories.get encodes the id', async () => {
		mockRequest.mockResolvedValueOnce(category);
		const result = await getCategory(ctx(), { category_id: 9 });
		expect(mockRequest).toHaveBeenLastCalledWith('categories/9/', 'k');
		expect(AmcardsEndpointOutputSchemas.getCategory.parse(result).title).toBe(
			'Birthday',
		);
	});

	it('categories.list forwards django-filter query names', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [category] });
		await listCategories(ctx(), {
			parent__id: 1,
			title__icontains: 'birth',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('categories/', 'k', {
			query: {
				parent__id: 1,
				title__icontains: 'birth',
				parent__title__icontains: undefined,
			},
		});
	});

	it('gifts.list and gifts.get skip the Token header', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [gift] });
		await listGifts(ctx(), {});
		expect(mockRequest).toHaveBeenLastCalledWith('gifts/', 'k', {
			auth: false,
		});

		mockRequest.mockResolvedValueOnce(gift);
		await getGift(ctx(), { id: 3 });
		expect(mockRequest).toHaveBeenLastCalledWith('gifts/3/', 'k', {
			auth: false,
		});
	});

	it('templates.list and templates.get skip the Token header', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [template] });
		await listPublicTemplates(ctx(), { name__icontains: 'thanks' });
		expect(mockRequest).toHaveBeenLastCalledWith('templates/', 'k', {
			auth: false,
			query: { category__id: undefined, name__icontains: 'thanks' },
		});

		mockRequest.mockResolvedValueOnce(template);
		await getPublicTemplate(ctx(), { id: 4 });
		expect(mockRequest).toHaveBeenLastCalledWith('templates/4/', 'k', {
			auth: false,
		});
	});
});

describe('amcards keyBuilder', () => {
	it('returns options.key', async () => {
		const plugin = amcards({ key: 'tok' });
		await expect(
			plugin.keyBuilder!({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('tok');
	});

	it('rejects a missing key with AuthMissingError', async () => {
		const plugin = amcards();
		await expect(
			plugin.keyBuilder!({ authType: 'api_key' } as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('rejects webhook source with AuthMissingError', async () => {
		const plugin = amcards();
		await expect(
			plugin.keyBuilder!({ authType: 'api_key' } as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('uses the account key manager when present', async () => {
		const plugin = amcards();
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'from-account' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('from-account');
	});
});
