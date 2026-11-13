import { request } from 'corsair/http';
import {
	Company,
	GiftCards,
	Groups,
	Integrations,
	Items,
	Locations,
	Orders,
	Partners,
	Ping,
	Promotions,
	Reports,
	Settings,
	Users,
} from './endpoints';
import type { GiftUpContext } from './index';
import { giftup, giftupEndpointMeta, giftupEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const TEST_API_KEY = 'test_api_key_12345';

function buildCtx(): GiftUpContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: TEST_API_KEY,
		options: { key: TEST_API_KEY },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(TEST_API_KEY),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Gift Up! endpoints', () => {
	describe('1. Ping endpoints', () => {
		it('ping.get sends GET /ping and returns pong', async () => {
			mockRequest.mockResolvedValue('pong');
			const result = await Ping.get(ctx, {});
			expect(result).toBe('pong');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://api.giftup.app' }),
				expect.objectContaining({ method: 'GET', url: '/ping' }),
			);
		});

		it('ping.post sends POST /ping with payload', async () => {
			mockRequest.mockResolvedValue({ echoed: 'data' });
			const result = await Ping.post(ctx, { payload: { echoed: 'data' } });
			expect(result).toEqual({ echoed: 'data' });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/ping',
					body: { echoed: 'data' },
				}),
			);
		});
	});

	describe('2. Company endpoints', () => {
		it('company.get sends GET /company', async () => {
			const mockCompany = {
				id: 'comp-1',
				name: 'Test Store',
				currency: 'USD',
				onboardingCompleted: true,
				canShowCheckout: true,
				isCheckoutLive: true,
			};
			mockRequest.mockResolvedValue(mockCompany);
			const result = await Company.get(ctx, {});
			expect(result).toEqual(mockCompany);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/company' }),
			);
		});
	});

	describe('3. Gift Cards endpoints', () => {
		const sampleCard = {
			canBeRedeemed: true,
			hasExpired: false,
			notYetValid: false,
			isVoided: false,
			code: 'GC-123',
			title: 'Test Voucher',
			backingType: 'Currency',
			remainingValue: 50,
			remainingUnits: null,
			initialValue: 50,
			initialUnits: null,
		};

		it('giftCards.list sends GET /gift-cards with query params', async () => {
			mockRequest.mockResolvedValue([sampleCard]);
			const result = await GiftCards.list(ctx, {
				limit: 10,
				offset: 0,
				status: 'active',
			});
			expect(result).toEqual([sampleCard]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/gift-cards',
					query: { limit: 10, offset: 0, status: 'active' },
				}),
			);
		});

		it('giftCards.get sends GET /gift-cards/{code}', async () => {
			mockRequest.mockResolvedValue(sampleCard);
			const result = await GiftCards.get(ctx, { code: 'GC-123' });
			expect(result).toEqual(sampleCard);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/gift-cards/GC-123' }),
			);
		});

		it('giftCards.update sends PATCH /gift-cards/{code}', async () => {
			mockRequest.mockResolvedValue(sampleCard);
			const patch = [
				{ op: 'replace' as const, path: '/title', value: 'Updated' },
			];
			const result = await GiftCards.update(ctx, { code: 'GC-123', patch });
			expect(result).toEqual(sampleCard);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/gift-cards/GC-123',
					body: patch,
				}),
			);
		});

		it('giftCards.reactivate sends POST /gift-cards/{code}/reactivate', async () => {
			mockRequest.mockResolvedValue({
				isRedeemed: false,
				isAlreadyActive: true,
			});
			const result = await GiftCards.reactivate(ctx, {
				code: 'GC-123',
				reason: 'Customer request',
			});
			expect(result).toEqual({ isRedeemed: false, isAlreadyActive: true });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/reactivate',
					body: { reason: 'Customer request' },
				}),
			);
		});

		it('giftCards.void sends POST /gift-cards/{code}/void', async () => {
			mockRequest.mockResolvedValue({
				isRedeemed: false,
				isAlreadyVoided: false,
			});
			const result = await GiftCards.void(ctx, {
				code: 'GC-123',
				reason: 'Lost card',
			});
			expect(result).toEqual({ isRedeemed: false, isAlreadyVoided: false });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/void',
					body: { reason: 'Lost card' },
				}),
			);
		});

		it('giftCards.topUp sends POST /gift-cards/{code}/top-up', async () => {
			const res = {
				transactionId: 'tx-1',
				remainingCredit: 75,
				remainingUnits: null,
			};
			mockRequest.mockResolvedValue(res);
			const result = await GiftCards.topUp(ctx, {
				code: 'GC-123',
				amount: 25,
			});
			expect(result).toEqual(res);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/top-up',
					body: { amount: 25 },
				}),
			);
		});

		it('giftCards.redeem sends POST /gift-cards/{code}/redeem', async () => {
			const res = {
				transactionId: 'tx-2',
				redeemedAmount: 20,
				remainingCredit: 30,
				redeemedUnits: null,
				remainingUnits: null,
			};
			mockRequest.mockResolvedValue(res);
			const result = await GiftCards.redeem(ctx, {
				code: 'GC-123',
				amount: 20,
			});
			expect(result).toEqual(res);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/redeem',
					body: { amount: 20 },
				}),
			);
		});

		it('giftCards.redeemInFull sends POST /gift-cards/{code}/redeem-in-full', async () => {
			const res = {
				transactionId: 'tx-3',
				redeemedAmount: 50,
				remainingCredit: 0,
				redeemedUnits: null,
				remainingUnits: null,
			};
			mockRequest.mockResolvedValue(res);
			const result = await GiftCards.redeemInFull(ctx, {
				code: 'GC-123',
			});
			expect(result).toEqual(res);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/redeem-in-full',
				}),
			);
		});

		it('giftCards.undoRedemption sends POST /gift-cards/{code}/undo-redemption', async () => {
			const res = {
				transactionId: 'tx-4',
				amountReversed: 20,
				unitsReversed: 0,
				alreadyReversed: false,
				remainingCredit: 50,
				remainingUnits: null,
			};
			mockRequest.mockResolvedValue(res);
			const result = await GiftCards.undoRedemption(ctx, {
				code: 'GC-123',
				transactionId: 'tx-2',
			});
			expect(result).toEqual(res);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/GC-123/undo-redemption',
					body: { transactionId: 'tx-2' },
				}),
			);
		});

		it('giftCards.transferBalances sends POST /gift-cards/transfer-balances', async () => {
			const res = { transferredCredit: 100, transferredUnits: null };
			mockRequest.mockResolvedValue(res);
			const result = await GiftCards.transferBalances(ctx, {
				sourceGiftCards: ['GC-1', 'GC-2'],
				destinationGiftCard: 'GC-3',
			});
			expect(result).toEqual(res);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/gift-cards/transfer-balances',
					body: {
						sourceGiftCards: ['GC-1', 'GC-2'],
						destinationGiftCard: 'GC-3',
					},
				}),
			);
		});
	});

	describe('4. Orders endpoints', () => {
		const sampleOrder = {
			id: 'order-1',
			orderNumber: '1001',
			createdOn: '2024-01-01T00:00:00Z',
			currency: 'USD',
			revenue: 100,
		};

		it('orders.list sends GET /orders', async () => {
			mockRequest.mockResolvedValue([sampleOrder]);
			const result = await Orders.list(ctx, { limit: 5 });
			expect(result).toEqual([sampleOrder]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/orders',
					query: { limit: 5 },
				}),
			);
		});

		it('orders.get sends GET /orders/{id}', async () => {
			mockRequest.mockResolvedValue(sampleOrder);
			const result = await Orders.get(ctx, { id: 'order-1' });
			expect(result).toEqual(sampleOrder);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/orders/order-1' }),
			);
		});

		it('orders.create sends POST /orders', async () => {
			mockRequest.mockResolvedValue(sampleOrder);
			const orderInput = {
				purchaserEmail: 'buyer@example.com',
				purchaserName: 'Buyer Bob',
				revenue: 100,
				itemDetails: [
					{ quantity: 1, name: 'Gift Card', price: 100, value: 100 },
				],
			};
			const result = await Orders.create(ctx, orderInput);
			expect(result).toEqual(sampleOrder);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/orders',
					body: orderInput,
				}),
			);
		});

		it('orders.update sends PATCH /orders/{id}', async () => {
			mockRequest.mockResolvedValue(sampleOrder);
			const patch = [
				{ op: 'replace' as const, path: '/purchaserName', value: 'New Name' },
			];
			const result = await Orders.update(ctx, { id: 'order-1', patch });
			expect(result).toEqual(sampleOrder);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/orders/order-1',
					body: patch,
				}),
			);
		});

		it('orders.addNote sends POST /orders/{id}/notes', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const result = await Orders.addNote(ctx, {
				id: 'order-1',
				content: 'Customer called',
			});
			expect(result).toEqual({ success: true });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/orders/order-1/notes',
					body: { content: 'Customer called' },
				}),
			);
		});

		it('orders.markAsPosted sends POST /orders/{id}/post', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const result = await Orders.markAsPosted(ctx, {
				id: 'order-1',
				codes: [{ oldCode: 'OLD', newCode: 'NEW' }],
			});
			expect(result).toEqual({ success: true });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/orders/order-1/post',
					body: { codes: [{ oldCode: 'OLD', newCode: 'NEW' }] },
				}),
			);
		});
	});

	describe('5. Items endpoints', () => {
		const sampleItem = {
			id: 'item-1',
			name: 'Dinner',
			backingType: 'Currency',
			priceType: 'Specified',
			price: 50,
			value: 50,
		};

		it('items.list sends GET /items', async () => {
			mockRequest.mockResolvedValue([sampleItem]);
			const result = await Items.list(ctx, { groupId: 'g-1' });
			expect(result).toEqual([sampleItem]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/items',
					query: { groupId: 'g-1' },
				}),
			);
		});

		it('items.get sends GET /items/{id}', async () => {
			mockRequest.mockResolvedValue(sampleItem);
			const result = await Items.get(ctx, { id: 'item-1' });
			expect(result).toEqual(sampleItem);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/items/item-1' }),
			);
		});

		it('items.create sends POST /items', async () => {
			mockRequest.mockResolvedValue(sampleItem);
			const input = { name: 'Dinner', price: 50, value: 50 };
			const result = await Items.create(ctx, input);
			expect(result).toEqual(sampleItem);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'POST', url: '/items' }),
			);
		});

		it('items.update sends PATCH /items/{id}', async () => {
			mockRequest.mockResolvedValue(sampleItem);
			const patch = [{ op: 'replace' as const, path: '/name', value: 'Lunch' }];
			const result = await Items.update(ctx, { id: 'item-1', patch });
			expect(result).toEqual(sampleItem);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/items/item-1',
					body: patch,
				}),
			);
		});

		it('items.delete sends DELETE /items/{id}', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const result = await Items.delete(ctx, { id: 'item-1' });
			expect(result).toEqual({ success: true });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'DELETE', url: '/items/item-1' }),
			);
		});
	});

	describe('6. Groups endpoints', () => {
		const sampleGroup = {
			id: 'group-1',
			name: 'Dining',
			sortOrder: 1,
		};

		it('groups.list sends GET /groups', async () => {
			mockRequest.mockResolvedValue([sampleGroup]);
			const result = await Groups.list(ctx, {});
			expect(result).toEqual([sampleGroup]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/groups' }),
			);
		});

		it('groups.get sends GET /groups/{id}', async () => {
			mockRequest.mockResolvedValue(sampleGroup);
			const result = await Groups.get(ctx, { id: 'group-1' });
			expect(result).toEqual(sampleGroup);
		});

		it('groups.create sends POST /groups', async () => {
			mockRequest.mockResolvedValue(sampleGroup);
			const result = await Groups.create(ctx, { name: 'Dining' });
			expect(result).toEqual(sampleGroup);
		});

		it('groups.update sends PATCH /groups/{id}', async () => {
			mockRequest.mockResolvedValue(sampleGroup);
			const patch = [
				{ op: 'replace' as const, path: '/name', value: 'Updated' },
			];
			const result = await Groups.update(ctx, { id: 'group-1', patch });
			expect(result).toEqual(sampleGroup);
		});

		it('groups.delete sends DELETE /groups/{id}', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const result = await Groups.delete(ctx, { id: 'group-1' });
			expect(result).toEqual({ success: true });
		});
	});

	describe('7. Locations endpoints', () => {
		it('locations.list sends GET /locations', async () => {
			mockRequest.mockResolvedValue([{ id: 'loc-1', name: 'Downtown' }]);
			const result = await Locations.list(ctx, {});
			expect(result).toEqual([{ id: 'loc-1', name: 'Downtown' }]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/locations' }),
			);
		});
	});

	describe('8. Promotions endpoints', () => {
		it('promotions.list sends GET /promotions', async () => {
			mockRequest.mockResolvedValue([{ id: 'promo-1', name: 'Holiday Sale' }]);
			const result = await Promotions.list(ctx, {});
			expect(result).toEqual([{ id: 'promo-1', name: 'Holiday Sale' }]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method: 'GET', url: '/promotions' }),
			);
		});
	});

	describe('9. Reports endpoints', () => {
		const sampleTx = {
			id: 'tx-1',
			eventOccuredOn: '2024-01-01T00:00:00Z',
			eventType: 'Redeemed',
		};

		it('reports.listTransactions sends GET /reports/transactions', async () => {
			mockRequest.mockResolvedValue([sampleTx]);
			const result = await Reports.listTransactions(ctx, { limit: 10 });
			expect(result).toEqual([sampleTx]);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/reports/transactions',
					query: { limit: 10 },
				}),
			);
		});

		it('reports.getTransaction sends GET /reports/transactions/{id}', async () => {
			mockRequest.mockResolvedValue(sampleTx);
			const result = await Reports.getTransaction(ctx, { id: 'tx-1' });
			expect(result).toEqual(sampleTx);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/reports/transactions/tx-1',
				}),
			);
		});
	});

	describe('10. Settings endpoints', () => {
		it('covers settings operations', async () => {
			mockRequest.mockResolvedValue({ showBalanceChecker: true });
			const checkout = await Settings.getCheckout(ctx, {});
			expect(checkout).toEqual({ showBalanceChecker: true });

			const patch = [
				{ op: 'replace' as const, path: '/tipsEnabled', value: true },
			];
			await Settings.updateCheckout(ctx, { patch });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/settings/checkout',
					body: patch,
				}),
			);

			mockRequest.mockResolvedValue({ fromEmail: 'info@example.com' });
			const email = await Settings.getEmail(ctx, {});
			expect(email).toEqual({ fromEmail: 'info@example.com' });

			await Settings.updateEmail(ctx, { patch });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/settings/email',
					body: patch,
				}),
			);

			mockRequest.mockResolvedValue({ barcodeFormat: 'PDF417' });
			const gcSettings = await Settings.getGiftCard(ctx, {});
			expect(gcSettings).toEqual({ barcodeFormat: 'PDF417' });

			await Settings.updateGiftCard(ctx, { patch });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/settings/gift-card',
					body: patch,
				}),
			);

			mockRequest.mockResolvedValue([
				{ id: 'art-1', url: 'https://example.com/art.png' },
			]);
			const artwork = await Settings.listArtwork(ctx, {});
			expect(artwork).toEqual([
				{ id: 'art-1', url: 'https://example.com/art.png' },
			]);

			mockRequest.mockResolvedValue({
				id: 'art-2',
				url: 'https://example.com/new.png',
			});
			const uploaded = await Settings.uploadArtwork(ctx, {
				url: 'https://example.com/new.png',
			});
			expect(uploaded).toEqual({
				id: 'art-2',
				url: 'https://example.com/new.png',
			});

			mockRequest.mockResolvedValue({ success: true });
			const deletedArt = await Settings.deleteArtwork(ctx, { id: 'art-1' });
			expect(deletedArt).toEqual({ success: true });

			mockRequest.mockResolvedValue({
				enableDigitalFulfilment: true,
				enableSelfFulfilledPostal: false,
			});
			const shipping = await Settings.getShipping(ctx, {});
			expect(shipping).toEqual({
				enableDigitalFulfilment: true,
				enableSelfFulfilledPostal: false,
			});
		});
	});

	describe('11. Users endpoints', () => {
		const sampleUser = { id: 'u-1', name: 'Alice', email: 'alice@example.com' };

		it('covers users operations', async () => {
			mockRequest.mockResolvedValue([sampleUser]);
			const users = await Users.list(ctx, {});
			expect(users).toEqual([sampleUser]);

			mockRequest.mockResolvedValue(sampleUser);
			const user = await Users.get(ctx, { id: 'u-1' });
			expect(user).toEqual(sampleUser);

			const inviteRes = await Users.invite(ctx, { email: 'alice@example.com' });
			expect(inviteRes).toEqual(sampleUser);

			const patch = [
				{ op: 'replace' as const, path: '/name', value: 'Alicia' },
			];
			const updated = await Users.update(ctx, { id: 'u-1', patch });
			expect(updated).toEqual(sampleUser);

			mockRequest.mockResolvedValue({ success: true });
			const deleted = await Users.delete(ctx, { id: 'u-1' });
			expect(deleted).toEqual({ success: true });
		});
	});

	describe('12. Integrations endpoints', () => {
		it('covers integrations operations', async () => {
			mockRequest.mockResolvedValue({ connected: true, enableIdeal: true });
			const stripe = await Integrations.getStripeConnection(ctx, {});
			expect(stripe).toEqual({ connected: true, enableIdeal: true });

			const updatedStripe = await Integrations.updateStripeConnection(ctx, {
				enableIdeal: false,
			});
			expect(updatedStripe).toEqual({ connected: true, enableIdeal: true });
		});
	});

	describe('13. Partners endpoints', () => {
		it('partners.createAccount sends POST /partners/account/create', async () => {
			const mockAccount = { companyId: 'comp-10', apiKey: 'new-key' };
			mockRequest.mockResolvedValue(mockAccount);
			const result = await Partners.createAccount(ctx, {
				email: 'owner@example.com',
				name: 'Owner',
				companyName: 'Company',
				currency: 'USD',
				countryCode: 'USA',
			});
			expect(result).toEqual(mockAccount);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/partners/account/create',
				}),
			);
		});
	});

	describe('Input validation before network I/O', () => {
		it('rejects invalid inputs without invoking network request', async () => {
			await expect(GiftCards.get(ctx, { code: '' })).rejects.toThrow();

			await expect(
				Orders.create(ctx, {
					purchaserEmail: 'not-an-email',
					purchaserName: 'Bob',
					itemDetails: [],
				}),
			).rejects.toThrow();

			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('plugin configuration and shape', () => {
		it('declares api_key auth, empty webhooks, and binds all groups', () => {
			const pluginInstance = giftup({ key: 'test-key' });
			expect(pluginInstance.id).toBe('giftup');
			expect(pluginInstance.authConfig).toEqual({ api_key: {} });
			expect(pluginInstance.webhooks).toEqual({});
			expect(pluginInstance.endpoints?.ping.get).toBeDefined();
			expect(pluginInstance.endpoints?.company.get).toBeDefined();
			expect(pluginInstance.endpoints?.giftCards.get).toBeDefined();
			expect(pluginInstance.endpoints?.orders.create).toBeDefined();
			expect(pluginInstance.endpoints?.items.list).toBeDefined();
			expect(pluginInstance.endpoints?.groups.get).toBeDefined();
			expect(pluginInstance.endpoints?.locations.list).toBeDefined();
			expect(pluginInstance.endpoints?.promotions.list).toBeDefined();
			expect(pluginInstance.endpoints?.reports.getTransaction).toBeDefined();
			expect(pluginInstance.endpoints?.settings.getCheckout).toBeDefined();
			expect(pluginInstance.endpoints?.users.list).toBeDefined();
			expect(
				pluginInstance.endpoints?.integrations.getStripeConnection,
			).toBeDefined();
			expect(pluginInstance.endpoints?.partners.createAccount).toBeDefined();
		});

		it('matches all 51 operation keys across meta and schemas', () => {
			const schemaKeys = Object.keys(giftupEndpointSchemas).sort();
			const metaKeys = Object.keys(giftupEndpointMeta).sort();
			expect(schemaKeys).toEqual(metaKeys);
			expect(schemaKeys.length).toBe(51);
		});
	});
});
