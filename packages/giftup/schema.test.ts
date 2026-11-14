import {
	CheckoutSettingsSchema,
	CompanySchema,
	EmailSettingsSchema,
	EmptyResponseSchema,
	GiftCardSchema,
	GiftCardsGetInputSchema,
	GiftCardsListInputSchema,
	GiftCardsReactivateInputSchema,
	GiftCardsRedeemInFullInputSchema,
	GiftCardsRedeemInputSchema,
	GiftCardsTopUpInputSchema,
	GiftCardsTransferBalancesInputSchema,
	GiftCardsUndoRedemptionInputSchema,
	GiftCardsUpdateInputSchema,
	GiftCardsVoidInputSchema,
	GiftUpEndpointInputSchemas,
	GiftUpEndpointOutputSchemas,
	ItemGroupSchema,
	ItemSchema,
	ItemsCreateInputSchema,
	JsonPatchOperationSchema,
	OrderSchema,
	OrdersAddNoteInputSchema,
	OrdersCreateInputSchema,
	OrdersMarkAsPostedInputSchema,
	PartnersCreateAccountInputSchema,
	PingGetInputSchema,
	PingPostInputSchema,
	ReportTransactionSchema,
	StripeConnectionSchema,
	UserSchema,
	UsersInviteInputSchema,
} from './endpoints/types';

describe('Gift Up! schemas', () => {
	describe('Common schemas', () => {
		it('validates JsonPatchOperationSchema RFC 6902 requirements', () => {
			const validReplace = {
				op: 'replace',
				path: '/title',
				value: 'New title',
			};
			expect(JsonPatchOperationSchema.parse(validReplace)).toEqual(
				validReplace,
			);

			const validMove = {
				op: 'move',
				path: '/title',
				from: '/oldTitle',
			};
			expect(JsonPatchOperationSchema.parse(validMove)).toEqual(validMove);

			// replace without value must fail
			expect(() =>
				JsonPatchOperationSchema.parse({ op: 'replace', path: '/title' }),
			).toThrow();

			// move without from must fail
			expect(() =>
				JsonPatchOperationSchema.parse({ op: 'move', path: '/title' }),
			).toThrow();

			// invalid op must fail
			expect(() =>
				JsonPatchOperationSchema.parse({ op: 'invalid_op', path: '/title' }),
			).toThrow();
		});

		it('validates EmptyResponseSchema allows null, undefined, and objects', () => {
			expect(EmptyResponseSchema.parse(null)).toBeNull();
			expect(EmptyResponseSchema.parse(undefined)).toBeUndefined();
			expect(EmptyResponseSchema.parse({})).toEqual({});
			expect(EmptyResponseSchema.parse({ success: true })).toEqual({
				success: true,
			});
		});
	});

	describe('Ping schemas', () => {
		it('validates PingGetInputSchema and PingPostInputSchema', () => {
			expect(PingGetInputSchema.parse({})).toEqual({});
			expect(() => PingGetInputSchema.parse({ extra: true })).toThrow();

			expect(PingPostInputSchema.parse({ payload: { test: 123 } })).toEqual({
				payload: { test: 123 },
			});
		});
	});

	describe('Company schemas', () => {
		it('validates CompanySchema', () => {
			const valid = {
				id: 'cd6228d8-8ed6-4264-b28a-eb5a5736e81e',
				name: 'Juicy Joes Steakhouse',
				currency: 'GBP',
				onboardingCompleted: true,
				canShowCheckout: true,
				isCheckoutLive: true,
			};
			expect(CompanySchema.parse(valid)).toEqual(valid);

			expect(() =>
				CompanySchema.parse({ id: '123', name: 'Incomplete' }),
			).toThrow();
		});
	});

	describe('Gift Card schemas', () => {
		it('validates GiftCardSchema with nullable fields and ledger', () => {
			const valid = {
				canBeRedeemed: true,
				hasExpired: false,
				notYetValid: false,
				isVoided: false,
				code: 'ABC123',
				title: 'Steak dinner',
				subTitle: null,
				message: 'Happy Birthday!',
				fulfilledOn: '2024-01-01T00:00:00Z',
				recipientName: 'Alice',
				recipientEmail: 'alice@example.com',
				backingType: 'Currency',
				remainingValue: 50,
				remainingUnits: null,
				initialValue: 50,
				initialUnits: null,
				terms: 'Valid on weekends',
				ledger: [
					{
						id: 'ledger-1',
						eventType: 'Redeemed',
						eventOccuredOn: '2024-01-02T00:00:00Z',
						value: 10,
						metadata: { note: 'test' },
					},
				],
			};
			const parsed = GiftCardSchema.parse(valid);
			expect(parsed.code).toBe('ABC123');
			expect(parsed.remainingValue).toBe(50);
		});

		it('validates GiftCard operations inputs', () => {
			expect(GiftCardsGetInputSchema.parse({ code: 'ABC' })).toEqual({
				code: 'ABC',
			});
			expect(() => GiftCardsGetInputSchema.parse({ code: '' })).toThrow();

			expect(
				GiftCardsListInputSchema.parse({
					limit: 10,
					offset: 0,
					status: 'active',
				}),
			).toEqual({ limit: 10, offset: 0, status: 'active' });

			expect(
				GiftCardsTopUpInputSchema.parse({
					code: 'ABC',
					amount: 25,
					reason: 'Reward',
				}),
			).toEqual({ code: 'ABC', amount: 25, reason: 'Reward' });

			expect(
				GiftCardsRedeemInputSchema.parse({ code: 'ABC', amount: 15 }),
			).toEqual({ code: 'ABC', amount: 15 });

			expect(
				GiftCardsRedeemInFullInputSchema.parse({ code: 'ABC', reason: 'Full' }),
			).toEqual({ code: 'ABC', reason: 'Full' });

			expect(
				GiftCardsUndoRedemptionInputSchema.parse({
					code: 'ABC',
					transactionId: 'tx-1',
				}),
			).toEqual({ code: 'ABC', transactionId: 'tx-1' });

			expect(
				GiftCardsTransferBalancesInputSchema.parse({
					sourceGiftCards: ['A', 'B'],
					destinationGiftCard: 'C',
				}),
			).toEqual({
				sourceGiftCards: ['A', 'B'],
				destinationGiftCard: 'C',
			});

			expect(GiftCardsVoidInputSchema.parse({ code: 'ABC' })).toEqual({
				code: 'ABC',
			});
			expect(GiftCardsReactivateInputSchema.parse({ code: 'ABC' })).toEqual({
				code: 'ABC',
			});
			expect(
				GiftCardsUpdateInputSchema.parse({
					code: 'ABC',
					patch: [{ op: 'replace', path: '/title', value: 'Updated' }],
				}),
			).toEqual({
				code: 'ABC',
				patch: [{ op: 'replace', path: '/title', value: 'Updated' }],
			});
		});
	});

	describe('Orders schemas', () => {
		it('validates OrderSchema and OrdersCreateInputSchema', () => {
			const validOrder = {
				id: 'order-123',
				orderNumber: '10152',
				createdOn: '2024-01-01T00:00:00Z',
				currency: 'USD',
				revenue: 100,
				purchaserName: 'John Doe',
				purchaserEmail: 'john@example.com',
			};
			expect(OrderSchema.parse(validOrder).orderNumber).toBe('10152');

			const createInput = {
				purchaserEmail: 'customer@example.com',
				purchaserName: 'Jane Smith',
				revenue: 75,
				itemDetails: [
					{
						quantity: 1,
						name: 'Dining voucher',
						price: 75,
						value: 75,
					},
				],
			};
			expect(OrdersCreateInputSchema.parse(createInput).revenue).toBe(75);

			expect(() =>
				OrdersCreateInputSchema.parse({ purchaserEmail: 'invalid' }),
			).toThrow();
		});

		it('validates OrdersAddNoteInputSchema and OrdersMarkAsPostedInputSchema', () => {
			expect(
				OrdersAddNoteInputSchema.parse({ id: '1', content: 'Note' }),
			).toEqual({
				id: '1',
				content: 'Note',
			});
			expect(() =>
				OrdersAddNoteInputSchema.parse({ id: '1', content: '' }),
			).toThrow();

			expect(
				OrdersMarkAsPostedInputSchema.parse({
					id: '1',
					codes: [{ oldCode: 'OLD', newCode: 'NEW' }],
				}),
			).toEqual({
				id: '1',
				codes: [{ oldCode: 'OLD', newCode: 'NEW' }],
			});
		});
	});

	describe('Items and Groups schemas', () => {
		it('validates ItemSchema and ItemsCreateInputSchema', () => {
			const validItem = {
				id: 'item-1',
				name: 'Steak Dinner',
				backingType: 'Currency',
				priceType: 'Specified',
				price: 50,
				value: 50,
			};
			expect(ItemSchema.parse(validItem).name).toBe('Steak Dinner');

			expect(
				ItemsCreateInputSchema.parse({
					name: 'Gift Certificate',
					price: 25,
					value: 25,
				}),
			).toMatchObject({
				name: 'Gift Certificate',
				backingType: 'Currency',
				priceType: 'Specified',
			});
		});

		it('validates ItemGroupSchema', () => {
			const validGroup = {
				id: 'group-1',
				name: 'Fixed Value',
				description: 'Vouchers with set values',
				sortOrder: 1,
				autoExpand: false,
			};
			expect(ItemGroupSchema.parse(validGroup).name).toBe('Fixed Value');
		});
	});

	describe('Reports, Settings, Users, Integrations, Partners', () => {
		it('validates ReportTransactionSchema', () => {
			const validTx = {
				id: 'tx-123',
				eventOccuredOn: '2024-01-01T00:00:00Z',
				eventType: 'Redeemed',
				currency: 'USD',
				giftCard: {
					code: 'ABC123',
					valueChange: 25,
				},
			};
			expect(ReportTransactionSchema.parse(validTx).eventType).toBe('Redeemed');
		});

		it('validates CheckoutSettingsSchema and EmailSettingsSchema', () => {
			const checkout = {
				showBalanceChecker: true,
				tipsEnabled: true,
				themeColor: '#FF0000',
			};
			expect(CheckoutSettingsSchema.parse(checkout).themeColor).toBe('#FF0000');

			const email = {
				fromEmail: 'noreply@example.com',
				fromName: 'Store',
			};
			expect(EmailSettingsSchema.parse(email).fromEmail).toBe(
				'noreply@example.com',
			);
		});

		it('validates UserSchema and UsersInviteInputSchema', () => {
			const user = {
				id: 'u-1',
				name: 'Manager',
				email: 'manager@example.com',
				isAdministrator: true,
			};
			expect(UserSchema.parse(user).email).toBe('manager@example.com');

			expect(
				UsersInviteInputSchema.parse({
					email: 'staff@example.com',
					name: 'Staff',
					isAdministrator: false,
				}),
			).toEqual({
				email: 'staff@example.com',
				name: 'Staff',
				isAdministrator: false,
			});
		});

		it('validates StripeConnectionSchema', () => {
			const stripe = {
				connected: true,
				stripeAccountId: 'acct_123',
			};
			expect(StripeConnectionSchema.parse(stripe).connected).toBe(true);
		});

		it('validates PartnersCreateAccountInputSchema', () => {
			const partnerInput = {
				email: 'partner@example.com',
				name: 'Bob Owner',
				companyName: 'Bobs Burgers',
				currency: 'USD',
				countryCode: 'USA',
			};
			expect(
				PartnersCreateAccountInputSchema.parse(partnerInput).currency,
			).toBe('USD');
			expect(() =>
				PartnersCreateAccountInputSchema.parse({
					email: 'partner@example.com',
					name: 'Bob',
					companyName: 'Bobs',
					currency: 'TOOLONG',
					countryCode: 'USA',
				}),
			).toThrow();
		});
	});

	describe('Registry parity', () => {
		it('has input and output schemas registered for every operation', () => {
			const inputKeys = Object.keys(GiftUpEndpointInputSchemas);
			const outputKeys = Object.keys(GiftUpEndpointOutputSchemas);
			expect(inputKeys.sort()).toEqual(outputKeys.sort());
			expect(inputKeys.length).toBe(51);
		});
	});
});
