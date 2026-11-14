import {
	handwryttenEndpointMeta,
	handwryttenEndpointSchemas,
} from './index';
import {
	AddressBookAddRecipientInputSchema,
	AddressBookAddRecipientResponseSchema,
	AddressBookAddSenderInputSchema,
	AddressBookCountriesInputSchema,
	AddressBookCountriesResponseSchema,
	AddressBookDeleteRecipientInputSchema,
	AddressBookDeleteSenderInputSchema,
	AddressBookGetSenderInputSchema,
	AddressBookListRecipientsInputSchema,
	AddressBookListSendersInputSchema,
	AddressBookSetDefaultSenderInputSchema,
	AddressBookStatesInputSchema,
	AddressBookUpdateRecipientInputSchema,
	AddressBookUpdateSenderInputSchema,
	AuthCheckAuthInputSchema,
	AuthCheckAuthResponseSchema,
	AuthGetUserInputSchema,
	AuthGetUserResponseSchema,
	AuthLogoutInputSchema,
	AuthSetTestModeInputSchema,
	BasketClearInputSchema,
	BasketCountInputSchema,
	BasketSendInputSchema,
	BundlesListInputSchema,
	BundlesListResponseSchema,
	CardsCategoriesInputSchema,
	CardsGetInputSchema,
	CardsGetResponseSchema,
	CardsListInputSchema,
	CardsListResponseSchema,
	CardsSectionsInputSchema,
	CustomCardsCheckImageInputSchema,
	CustomCardsCreateInputSchema,
	CustomCardsDeleteImageInputSchema,
	CustomCardsDeleteInputSchema,
	CustomCardsDimensionsInputSchema,
	CustomCardsListImagesInputSchema,
	CustomCardsPresetImagesInputSchema,
	CustomCardsUploadImageInputSchema,
	FontsListInputSchema,
	FontsListResponseSchema,
	GiftCardsListInputSchema,
	GiftCardsListResponseSchema,
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
	InsertsListInputSchema,
	InsertsListResponseSchema,
	OrdersAddToBasketInputSchema,
	OrdersCancelInputSchema,
	OrdersGetInputSchema,
	OrdersSendSingleInputSchema,
	OrdersSendSingleResponseSchema,
	ProspectingCalculateTargetsInputSchema,
	ProspectingCreateOrderInputSchema,
	ProspectingPreviewInputSchema,
	QrCodesCreateInputSchema,
	QrCodesDashboardInputSchema,
	QrCodesDeleteInputSchema,
	QrCodesFramesInputSchema,
	QrCodesListInputSchema,
	ShippingStampOptionsInputSchema,
	ShippingStampOptionsResponseSchema,
	SignaturesListInputSchema,
	SignaturesListResponseSchema,
	TemplatesCategoriesInputSchema,
	TemplatesCategoriesResponseSchema,
	TemplatesCreateInputSchema,
	TemplatesDeleteInputSchema,
	TemplatesGetInputSchema,
	TemplatesListInputSchema,
	TemplatesUpdateInputSchema,
} from './endpoints/types';

describe('Handwrytten Schemas', () => {
	it('keeps input schema, output schema, and metadata keys in sync', () => {
		const inputKeys = Object.keys(HandwryttenEndpointInputSchemas).sort();
		const outputKeys = Object.keys(HandwryttenEndpointOutputSchemas).sort();
		const metaKeys = Object.keys(handwryttenEndpointMeta).sort();
		const schemaKeys = Object.keys(handwryttenEndpointSchemas).sort();

		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toEqual(metaKeys);
		expect(inputKeys).toEqual(schemaKeys);
		expect(inputKeys.length).toBe(55);
	});

	describe('Cards schemas', () => {
		it('validates CardsList input and output', () => {
			const valid = CardsListInputSchema.parse({
				category_id: 12,
				page: 0,
				with_images: true,
			});
			expect(valid.category_id).toBe(12);

			expect(() =>
				CardsListInputSchema.parse({ page: -1 }),
			).toThrow();

			// Undocumented input field rejected
			expect(() =>
				CardsListInputSchema.parse({ category_id: 1, extraField: 'fail' }),
			).toThrow();

			const parsedOut = CardsListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				cards: [
					{
						id: 101,
						name: 'Thank You Card',
						price: 3.5,
						cover: 'https://example.com/cover.png',
					},
				],
				pagination: { is_last: true, next: null, per_page: 50 },
			});
			expect(parsedOut.cards?.[0]?.name).toBe('Thank You Card');
		});

		it('validates CardsGet requires positive card_id', () => {
			expect(CardsGetInputSchema.parse({ card_id: 42 })).toEqual({
				card_id: 42,
			});
			expect(() => CardsGetInputSchema.parse({ card_id: -5 })).toThrow();
			expect(() => CardsGetInputSchema.parse({})).toThrow();

			const res = CardsGetResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				card: { id: 42, name: 'Birthday Card' },
			});
			expect(res.card?.id).toBe(42);
		});

		it('validates CardsSections and CardsCategories', () => {
			expect(CardsSectionsInputSchema.parse({})).toEqual({});
			expect(CardsCategoriesInputSchema.parse({})).toEqual({});
			expect(() =>
				CardsCategoriesInputSchema.parse({ unexpected: true }),
			).toThrow();
		});
	});

	describe('Orders schemas', () => {
		it('validates OrdersSendSingle requires card_id, message, recipient address', () => {
			const valid = {
				card_id: 200,
				message: 'Happy Birthday!',
				recipient_address1: '123 Main St',
				recipient_city: 'Austin',
				recipient_state: 'TX',
				recipient_zip: '78701',
			};
			expect(OrdersSendSingleInputSchema.parse(valid)).toMatchObject(valid);

			// Missing required recipient_address1
			expect(() =>
				OrdersSendSingleInputSchema.parse({
					card_id: 200,
					message: 'Happy Birthday!',
					recipient_city: 'Austin',
					recipient_state: 'TX',
					recipient_zip: '78701',
				}),
			).toThrow();

			// Negative card_id
			expect(() =>
				OrdersSendSingleInputSchema.parse({
					...valid,
					card_id: -1,
				}),
			).toThrow();

			const response = OrdersSendSingleResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				order_id: 998877,
				mail_sent: true,
			});
			expect(response.order_id).toBe(998877);
		});

		it('validates OrdersAddToBasket, OrdersGet, and OrdersCancel', () => {
			expect(OrdersAddToBasketInputSchema.parse({ card_id: 55 })).toEqual({
				card_id: 55,
			});
			expect(() => OrdersAddToBasketInputSchema.parse({})).toThrow();

			expect(OrdersGetInputSchema.parse({ id: 100 })).toEqual({ id: 100 });
			expect(() => OrdersGetInputSchema.parse({ id: 0 })).toThrow();

			expect(OrdersCancelInputSchema.parse({ order_id: 250 })).toEqual({
				order_id: 250,
			});
			expect(() => OrdersCancelInputSchema.parse({ order_id: -10 })).toThrow();
		});
	});

	describe('Custom Cards schemas', () => {
		it('validates dimensions, presetImages, uploadImage, checkImage, create, delete', () => {
			expect(CustomCardsDimensionsInputSchema.parse({})).toEqual({});
			expect(
				CustomCardsDimensionsInputSchema.parse({ orientation: 'portrait' }),
			).toEqual({ orientation: 'portrait' });

			expect(CustomCardsPresetImagesInputSchema.parse({})).toEqual({});
			expect(CustomCardsListImagesInputSchema.parse({})).toEqual({});

			expect(
				CustomCardsUploadImageInputSchema.parse({
					image: 'data:image/png;base64,iVBOR',
					name: 'logo.png',
				}),
			).toEqual({
				image: 'data:image/png;base64,iVBOR',
				name: 'logo.png',
			});
			expect(() =>
				CustomCardsUploadImageInputSchema.parse({ image: '' }),
			).toThrow();

			expect(
				CustomCardsCheckImageInputSchema.parse({ image_id: 50, card_id: 2 }),
			).toEqual({ image_id: 50, card_id: 2 });
			expect(() =>
				CustomCardsCheckImageInputSchema.parse({ image_id: 0 }),
			).toThrow();

			expect(
				CustomCardsDeleteImageInputSchema.parse({ image_id: 50 }),
			).toEqual({ image_id: 50 });

			expect(
				CustomCardsCreateInputSchema.parse({
					name: 'My Custom Card',
					dimension_id: 4,
				}),
			).toEqual({ name: 'My Custom Card', dimension_id: 4 });
			expect(() => CustomCardsCreateInputSchema.parse({ name: '' })).toThrow();

			expect(CustomCardsDeleteInputSchema.parse({ id: 80 })).toEqual({ id: 80 });
			expect(() => CustomCardsDeleteInputSchema.parse({ id: -1 })).toThrow();
		});
	});

	describe('Address Book schemas', () => {
		it('validates countries, states, recipients, and senders', () => {
			expect(AddressBookCountriesInputSchema.parse({})).toEqual({});
			expect(
				AddressBookStatesInputSchema.parse({ country_code: 'US' }),
			).toEqual({ country_code: 'US' });

			expect(AddressBookListRecipientsInputSchema.parse({})).toEqual({});

			const validRecipient = {
				name: 'Jane Doe',
				address1: '456 Oak Rd',
				city: 'Seattle',
				state: 'WA',
				zip: '98101',
			};
			expect(
				AddressBookAddRecipientInputSchema.parse(validRecipient),
			).toMatchObject(validRecipient);
			expect(() =>
				AddressBookAddRecipientInputSchema.parse({ name: 'Incomplete' }),
			).toThrow();

			expect(
				AddressBookUpdateRecipientInputSchema.parse({
					address_id: 15,
					city: 'Tacoma',
				}),
			).toEqual({ address_id: 15, city: 'Tacoma' });
			expect(() =>
				AddressBookUpdateRecipientInputSchema.parse({ city: 'Tacoma' }),
			).toThrow();

			expect(
				AddressBookDeleteRecipientInputSchema.parse({ address_id: 15 }),
			).toEqual({ address_id: 15 });

			expect(AddressBookListSendersInputSchema.parse({})).toEqual({});
			expect(AddressBookGetSenderInputSchema.parse({})).toEqual({});

			const validSender = {
				address1: '100 Sender Way',
				city: 'Denver',
				state: 'CO',
				zip: '80201',
			};
			expect(AddressBookAddSenderInputSchema.parse(validSender)).toMatchObject(
				validSender,
			);
			expect(
				AddressBookUpdateSenderInputSchema.parse(validSender),
			).toMatchObject(validSender);

			expect(AddressBookDeleteSenderInputSchema.parse({ id: 9 })).toEqual({
				id: 9,
			});
			expect(
				AddressBookSetDefaultSenderInputSchema.parse({ id: 9 }),
			).toEqual({ id: 9 });
		});

		it('parses AddressBook responses', () => {
			const countriesRes = AddressBookCountriesResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				countries: [{ id: 1, name: 'United States', short_name: 'US' }],
			});
			expect(countriesRes.countries?.[0]?.short_name).toBe('US');

			const addRes = AddressBookAddRecipientResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				address_id: 3001,
			});
			expect(addRes.address_id).toBe(3001);
		});
	});

	describe('Templates schemas', () => {
		it('validates template categories, list, get, create, update, delete', () => {
			expect(TemplatesCategoriesInputSchema.parse({})).toEqual({});
			expect(TemplatesListInputSchema.parse({})).toEqual({});
			expect(TemplatesListInputSchema.parse({ category_id: 2 })).toEqual({
				category_id: 2,
			});

			expect(TemplatesGetInputSchema.parse({ template_id: 7 })).toEqual({
				template_id: 7,
			});
			expect(() => TemplatesGetInputSchema.parse({ template_id: 0 })).toThrow();

			const validCreate = {
				name: 'Thank you note',
				message: 'Thanks for attending the event!',
				category_id: 1,
			};
			expect(TemplatesCreateInputSchema.parse(validCreate)).toMatchObject(
				validCreate,
			);
			expect(() =>
				TemplatesCreateInputSchema.parse({ name: 'Missing message' }),
			).toThrow();

			expect(
				TemplatesUpdateInputSchema.parse({
					template_id: 7,
					message: 'Updated message',
				}),
			).toEqual({ template_id: 7, message: 'Updated message' });

			expect(TemplatesDeleteInputSchema.parse({ template_id: 7 })).toEqual({
				template_id: 7,
			});

			const catRes = TemplatesCategoriesResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				categories: [{ id: 1, name: 'Thank You' }],
			});
			expect(catRes.categories?.[0]?.name).toBe('Thank You');
		});
	});

	describe('Fonts, Signatures, Gift Cards, Inserts, Bundles, Shipping', () => {
		it('validates single resources and lists', () => {
			expect(FontsListInputSchema.parse({})).toEqual({});
			const fontsRes = FontsListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				fonts: [{ id: 'hwCasual', label: 'Casual David' }],
			});
			expect(fontsRes.fonts?.[0]?.label).toBe('Casual David');

			expect(SignaturesListInputSchema.parse({})).toEqual({});
			const sigsRes = SignaturesListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				signatures: [{ id: 1, preview: 'https://example.com/sig.png' }],
			});
			expect(sigsRes.signatures?.[0]?.id).toBe(1);

			expect(GiftCardsListInputSchema.parse({})).toEqual({});
			const gcRes = GiftCardsListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				gcards: [{ id: 5, name: 'Amazon', denominations: [{ id: 1, nominal: 25 }] }],
			});
			expect(gcRes.gcards?.[0]?.name).toBe('Amazon');

			expect(InsertsListInputSchema.parse({})).toEqual({});
			expect(
				InsertsListInputSchema.parse({ include_historical: true }),
			).toEqual({ include_historical: true });
			const insRes = InsertsListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				inserts: [{ id: 'ins_1', name: 'Standard Insert' }],
			});
			expect(insRes.inserts?.[0]?.name).toBe('Standard Insert');

			expect(BundlesListInputSchema.parse({})).toEqual({});
			const bunRes = BundlesListResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				bundles: [{ id: 10, name: 'Holiday Bundle' }],
			});
			expect(bunRes.bundles?.[0]?.name).toBe('Holiday Bundle');

			expect(ShippingStampOptionsInputSchema.parse({})).toEqual({});
			const stampRes = ShippingStampOptionsResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				stamp_options: [{ id: 1, name: 'First Class' }],
			});
			expect(stampRes.stamp_options?.[0]?.name).toBe('First Class');
		});
	});

	describe('QR Codes and Prospecting', () => {
		it('validates QR codes endpoints', () => {
			expect(QrCodesListInputSchema.parse({})).toEqual({});
			expect(
				QrCodesCreateInputSchema.parse({
					name: 'Promo Link',
					url: 'https://example.com/promo',
				}),
			).toEqual({ name: 'Promo Link', url: 'https://example.com/promo' });
			expect(() =>
				QrCodesCreateInputSchema.parse({
					name: 'Promo',
					url: 'not-a-valid-url',
				}),
			).toThrow();

			expect(QrCodesDeleteInputSchema.parse({ id: 'qr_123' })).toEqual({
				id: 'qr_123',
			});
			expect(QrCodesDashboardInputSchema.parse({})).toEqual({});
			expect(QrCodesFramesInputSchema.parse({})).toEqual({});
		});

		it('validates Prospecting endpoints', () => {
			const targetInput = {
				address: '100 Main St',
				city: 'Phoenix',
				zip: '85001',
			};
			expect(
				ProspectingCalculateTargetsInputSchema.parse(targetInput),
			).toMatchObject(targetInput);

			const previewInput = {
				card_id: 10,
				message: 'Hello neighbor!',
				records: 50,
			};
			expect(ProspectingPreviewInputSchema.parse(previewInput)).toMatchObject(
				previewInput,
			);

			const createInput = {
				card_id: 10,
				message: 'Hello neighbor!',
				records: 50,
				address: '100 Main St',
				city: 'Phoenix',
				zip: '85001',
			};
			expect(
				ProspectingCreateOrderInputSchema.parse(createInput),
			).toMatchObject(createInput);
		});
	});

	describe('Basket and Auth schemas', () => {
		it('validates Basket endpoints', () => {
			expect(BasketCountInputSchema.parse({})).toEqual({});
			expect(BasketClearInputSchema.parse({})).toEqual({});
			expect(BasketSendInputSchema.parse({})).toEqual({});
			expect(
				BasketSendInputSchema.parse({ couponCode: 'SAVE10', notes: 'Urgent' }),
			).toEqual({ couponCode: 'SAVE10', notes: 'Urgent' });
		});

		it('validates Auth endpoints', () => {
			expect(AuthGetUserInputSchema.parse({})).toEqual({});
			const userRes = AuthGetUserResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				id: 1234,
				email: 'user@example.com',
				credits: 50,
			});
			expect(userRes.credits).toBe(50);

			expect(AuthCheckAuthInputSchema.parse({})).toEqual({});
			const checkRes = AuthCheckAuthResponseSchema.parse({
				httpCode: 200,
				status: 'ok',
				login: 'user@example.com',
				test_mode: true,
			});
			expect(checkRes.test_mode).toBe(true);

			expect(AuthSetTestModeInputSchema.parse({ test_mode: true })).toEqual({
				test_mode: true,
			});
			expect(AuthLogoutInputSchema.parse({})).toEqual({});
		});
	});
});
