import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	AddressBook,
	Auth,
	Basket,
	Bundles,
	Cards,
	CustomCards,
	Fonts,
	GiftCards,
	Inserts,
	Orders,
	Prospecting,
	QrCodes,
	Shipping,
	Signatures,
	Templates,
} from './endpoints';
import type { HandwryttenContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHandwryttenRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHandwryttenRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): HandwryttenContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Cards Endpoints', () => {
	it('cards.list sends GET /cards/list with query', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			cards: [{ id: 10, name: 'Thank You' }],
		});

		const res = await Cards.list(ctx, { category_id: 1, page: 0 });
		expect(mockedRequest).toHaveBeenCalledWith('/cards/list', 'test-api-key', {
			method: 'GET',
			query: { category_id: 1, page: 0 },
		});
		expect(res.cards?.[0]?.name).toBe('Thank You');
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'handwrytten.cards.list',
			{ count: 1 },
			'completed',
		);
	});

	it('cards.get sends GET /cards/view with card_id', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			card: { id: 42, name: 'Birthday Wish' },
		});

		const res = await Cards.get(ctx, { card_id: 42 });
		expect(mockedRequest).toHaveBeenCalledWith('/cards/view', 'test-api-key', {
			method: 'GET',
			query: { card_id: 42 },
		});
		expect(res.card?.id).toBe(42);
	});

	it('cards.sections sends GET /cards/list/sections', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			cards: [],
		});

		await Cards.sections(ctx, { category_id: 3 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/list/sections',
			'test-api-key',
			{
				method: 'GET',
				query: { category_id: 3 },
			},
		);
	});

	it('cards.categories sends GET /categories/list', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			categories: [{ id: 1, name: 'General' }],
		});

		const res = await Cards.categories(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/categories/list',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(res.categories?.[0]?.name).toBe('General');
	});
});

describe('CustomCards Endpoints', () => {
	it('customCards.dimensions sends GET /design/dimensions', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			dimensions: [{ id: 1, orientation: 'P' }],
		});

		await CustomCards.dimensions(ctx, { orientation: 'P' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/design/dimensions',
			'test-api-key',
			{ method: 'GET', query: { orientation: 'P' } },
		);
	});

	it('customCards.presetImages sends GET /design/presetImages', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			images: [{ id: 2, src: 'https://example.com/img.png' }],
		});

		await CustomCards.presetImages(ctx, { dimension_id: 1 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/design/presetImages',
			'test-api-key',
			{ method: 'GET', query: { dimension_id: 1 } },
		);
	});

	it('customCards.listImages sends GET /cards/listCustomUserImages', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			images: [],
		});

		await CustomCards.listImages(ctx, { imageType: 'logo' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/listCustomUserImages',
			'test-api-key',
			{ method: 'GET', query: { imageType: 'logo' } },
		);
	});

	it('customCards.uploadImage sends POST /cards/uploadCustomLogo', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			image_id: 88,
		});

		const res = await CustomCards.uploadImage(ctx, {
			image: 'data:base64...',
			name: 'logo.png',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/uploadCustomLogo',
			'test-api-key',
			{ method: 'POST', body: { image: 'data:base64...', name: 'logo.png' } },
		);
		expect(res.image_id).toBe(88);
	});

	it('customCards.checkImage sends POST /cards/checkUploadedCustomLogo', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			quality: 'good',
			dpi: 300,
		});

		await CustomCards.checkImage(ctx, { image_id: 88 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/checkUploadedCustomLogo',
			'test-api-key',
			{ method: 'POST', body: { image_id: 88 } },
		);
	});

	it('customCards.deleteImage sends POST /cards/deleteCustomLogo', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
		});

		await CustomCards.deleteImage(ctx, { image_id: 88 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/deleteCustomLogo',
			'test-api-key',
			{ method: 'POST', body: { image_id: 88 } },
		);
	});

	it('customCards.create sends POST /cards/createCustomCard', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			card_id: 99,
		});

		await CustomCards.create(ctx, {
			name: 'My Card',
			dimension_id: 2,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/cards/createCustomCard',
			'test-api-key',
			{ method: 'POST', body: { name: 'My Card', dimension_id: 2 } },
		);
	});

	it('customCards.delete sends POST /design/delete', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
		});

		await CustomCards.deleteCustomCard(ctx, { id: 99 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/design/delete',
			'test-api-key',
			{ method: 'POST', body: { id: 99 } },
		);
	});
});

describe('Orders Endpoints', () => {
	it('orders.sendSingle sends POST /orders/singleStepOrder', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			order_id: 12345,
			mail_sent: true,
		});

		const input = {
			card_id: 15,
			message: 'Greetings from test!',
			recipient_address1: '789 Elm St',
			recipient_city: 'Austin',
			recipient_state: 'TX',
			recipient_zip: '78701',
		};

		const res = await Orders.sendSingle(ctx, input);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orders/singleStepOrder',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(res.order_id).toBe(12345);
	});

	it('orders.addToBasket sends POST /orders/placeBasket', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			order_id: 54321,
		});

		await Orders.addToBasket(ctx, { card_id: 15, quantity: 2 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orders/placeBasket',
			'test-api-key',
			{ method: 'POST', body: { card_id: 15, quantity: 2 } },
		);
	});

	it('orders.get sends GET /orders/details', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			order: { id: 12345, status: 'processed' },
		});

		await Orders.get(ctx, { id: 12345 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orders/details',
			'test-api-key',
			{ method: 'GET', query: { id: 12345 } },
		);
	});

	it('orders.cancel sends POST /orders/cancel', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
		});

		await Orders.cancel(ctx, { order_id: 12345 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/orders/cancel',
			'test-api-key',
			{ method: 'POST', body: { order_id: 12345 } },
		);
	});
});

describe('Basket Endpoints', () => {
	it('basket.count sends GET /basket/count', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			count: 3,
		});

		const res = await Basket.count(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/basket/count',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(res.count).toBe(3);
	});

	it('basket.clear sends POST /basket/clear', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
		});

		await Basket.clear(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/basket/clear',
			'test-api-key',
			{ method: 'POST', body: {} },
		);
	});

	it('basket.send sends POST /basket/send', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
		});

		await Basket.send(ctx, { notes: 'Batch send test' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/basket/send',
			'test-api-key',
			{ method: 'POST', body: { notes: 'Batch send test' } },
		);
	});
});

describe('Fonts and Signatures Endpoints', () => {
	it('fonts.list sends GET /fonts/list', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			fonts: [{ id: 'hwCasual', label: 'Casual' }],
		});

		const res = await Fonts.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/fonts/list',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(res.fonts?.[0]?.id).toBe('hwCasual');
	});

	it('signatures.list sends GET /profile/signatures', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			signatures: [{ id: 1, preview: 'https://example.com/sig.png' }],
		});

		const res = await Signatures.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/signatures',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(res.signatures?.[0]?.id).toBe(1);
	});
});

describe('AddressBook Endpoints', () => {
	it('handles countries, states, recipients, and senders', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			countries: [{ id: 1, name: 'United States' }],
		});
		await AddressBook.countries(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/countries/list',
			'test-api-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			states: [{ id: 1, name: 'California' }],
		});
		await AddressBook.states(ctx, { country_code: 'US' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/countries/listStates',
			'test-api-key',
			{ method: 'GET', query: { country_code: 'US' } },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			addresses: [],
		});
		await AddressBook.listRecipients(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/recipientsList',
			'test-api-key',
			{ method: 'GET' },
		);

		const recipient = {
			name: 'Sam Smith',
			address1: '10 Pine St',
			city: 'Portland',
			state: 'OR',
			zip: '97201',
		};
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			address_id: 111,
		});
		await AddressBook.addRecipient(ctx, recipient);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/addRecipient',
			'test-api-key',
			{ method: 'POST', body: recipient },
		);

		await AddressBook.updateRecipient(ctx, {
			address_id: 111,
			city: 'Salem',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/updateRecipient',
			'test-api-key',
			{ method: 'PUT', body: { address_id: 111, city: 'Salem' } },
		);

		await AddressBook.deleteRecipient(ctx, { address_id: 111 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/deleteRecipient',
			'test-api-key',
			{ method: 'POST', body: { address_id: 111 } },
		);

		await AddressBook.listSenders(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/listAddresses',
			'test-api-key',
			{ method: 'GET' },
		);

		await AddressBook.getSender(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/address',
			'test-api-key',
			{ method: 'GET' },
		);

		const sender = {
			address1: '500 Return Rd',
			city: 'Dallas',
			state: 'TX',
			zip: '75201',
		};
		await AddressBook.addSender(ctx, sender);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/createAddress',
			'test-api-key',
			{ method: 'POST', body: sender },
		);

		await AddressBook.updateSender(ctx, sender);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/updateAddress',
			'test-api-key',
			{ method: 'PUT', body: sender },
		);

		await AddressBook.deleteSender(ctx, { id: 22 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/deleteAddress',
			'test-api-key',
			{ method: 'POST', body: { id: 22 } },
		);

		await AddressBook.setDefaultSender(ctx, { id: 22 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/profile/setDefaultAddress',
			'test-api-key',
			{ method: 'POST', body: { id: 22 } },
		);
	});
});

describe('Templates Endpoints', () => {
	it('handles template categories, list, get, create, update, delete', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			categories: [{ id: 1, name: 'Thank You' }],
		});
		await Templates.categories(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templateCategories/list',
			'test-api-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			templates: [{ id: 10, name: 'Thanks' }],
		});
		await Templates.list(ctx, { category_id: 1 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/list',
			'test-api-key',
			{ method: 'GET', query: { category_id: 1 } },
		);

		await Templates.get(ctx, { template_id: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/view',
			'test-api-key',
			{ method: 'GET', query: { template_id: 10 } },
		);

		await Templates.create(ctx, {
			name: 'Follow Up',
			message: 'Great meeting you!',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/create',
			'test-api-key',
			{
				method: 'POST',
				body: { name: 'Follow Up', message: 'Great meeting you!' },
			},
		);

		await Templates.update(ctx, {
			template_id: 10,
			message: 'Updated message',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/update',
			'test-api-key',
			{
				method: 'POST',
				body: { template_id: 10, message: 'Updated message' },
			},
		);

		await Templates.deleteTemplate(ctx, { template_id: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/templates/delete',
			'test-api-key',
			{ method: 'POST', body: { template_id: 10 } },
		);
	});
});

describe('GiftCards, Inserts, Bundles, Shipping', () => {
	it('handles giftCards, inserts, bundles, shipping', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			gcards: [],
		});
		await GiftCards.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/giftCards/list',
			'test-api-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			inserts: [],
		});
		await Inserts.list(ctx, { include_historical: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/inserts/list',
			'test-api-key',
			{ method: 'GET', query: { include_historical: true } },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			bundles: [],
		});
		await Bundles.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/bundles/list',
			'test-api-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			stamp_options: [],
		});
		await Shipping.stampOptions(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shipping/stampOptions',
			'test-api-key',
			{ method: 'GET' },
		);
	});
});

describe('QR Codes and Prospecting', () => {
	it('handles QR code operations', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			list: [],
		});
		await QrCodes.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/qrCode', 'test-api-key', {
			method: 'GET',
		});

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			id: 'qr_abc',
		});
		await QrCodes.create(ctx, {
			name: 'My QR',
			url: 'https://example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/qrCode', 'test-api-key', {
			method: 'POST',
			body: { name: 'My QR', url: 'https://example.com' },
		});

		await QrCodes.deleteQrCode(ctx, { id: 'qr_abc' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/qrCode/qr_abc',
			'test-api-key',
			{ method: 'DELETE' },
		);

		await QrCodes.dashboard(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/qrCode/dashboard',
			'test-api-key',
			{ method: 'GET' },
		);

		await QrCodes.frames(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/qrCode/frames',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('handles Prospecting operations', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			total_records: 500,
		});
		await Prospecting.calculateTargets(ctx, {
			address: '123 Main St',
			city: 'Phoenix',
			zip: '85001',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/outbound/calcTargets',
			'test-api-key',
			{
				method: 'POST',
				body: { address: '123 Main St', city: 'Phoenix', zip: '85001' },
			},
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			quantity: 100,
		});
		await Prospecting.preview(ctx, {
			card_id: 10,
			message: 'Hello!',
			records: 100,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/outbound/process',
			'test-api-key',
			{
				method: 'POST',
				body: { card_id: 10, message: 'Hello!', records: 100 },
			},
		);

		await Prospecting.createOrder(ctx, {
			card_id: 10,
			message: 'Hello!',
			address: '123 Main St',
			city: 'Phoenix',
			zip: '85001',
			records: 100,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/outbound/addToBasket',
			'test-api-key',
			{
				method: 'POST',
				body: {
					card_id: 10,
					message: 'Hello!',
					address: '123 Main St',
					city: 'Phoenix',
					zip: '85001',
					records: 100,
				},
			},
		);
	});
});

describe('Auth Endpoints', () => {
	it('handles getUser, checkAuth, setTestMode, logout', async () => {
		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			id: 1,
			credits: 10,
		});
		await Auth.getUser(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/auth/getUser',
			'test-api-key',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			httpCode: 200,
			status: 'ok',
			test_mode: true,
		});
		await Auth.checkAuth(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/checkauth/auth',
			'test-api-key',
			{ method: 'GET' },
		);

		await Auth.setTestMode(ctx, { test_mode: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/auth/setTestMode',
			'test-api-key',
			{ method: 'POST', body: { test_mode: true } },
		);

		await Auth.logout(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/auth/logout',
			'test-api-key',
			{ method: 'POST', body: {} },
		);
	});
});
