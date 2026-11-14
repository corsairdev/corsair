import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { sevdeskEndpointsNested } from './endpoints';
import { toResponseSchema } from './endpoints/responses';
import type { SevdeskContext } from './index';
import { sevdesk } from './index';

// Responses below are trimmed from a sevDesk trial account (bookkeeping system 2.0) on 2026-11-15.
// Ids are replaced and only test data was used. They show what the OpenAPI document gets wrong:
// string ids and amounts, null fields, "0"/"1" flags and the `objects` envelope on writes.

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
const mockedLogEvent = jest.mocked(logEventFromContext);

const token = '0123456789abcdef0123456789abcdef';
const ctx: SevdeskContext = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: token,
	options: {},
	keys: {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_api_key: () => Promise.resolve(token),
		set_api_key: () => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	},
	db: {},
};

const sevClient = { id: '100001', objectName: 'SevClient' };
const contact = {
	id: '200001',
	objectName: 'Contact',
	additionalInformation: null,
	create: '2026-11-14T22:40:56+01:00',
	update: '2026-11-14T22:40:56+01:00',
	name: 'corsair-plugin-test GmbH',
	status: '100',
	customerNumber: '1000',
	surename: null,
	familyname: null,
	titel: null,
	category: { id: '3', objectName: 'Category' },
	description: null,
	academicTitle: null,
	gender: null,
	sevClient,
	name2: null,
	birthday: null,
	vatNumber: null,
	bankAccount: null,
	bankNumber: null,
	mandateReference: null,
	defaultCashbackTime: null,
	defaultCashbackPercent: null,
	defaultTimeToPay: null,
	taxNumber: null,
	taxOffice: null,
	exemptVat: '0',
	taxType: null,
	defaultDiscountAmount: null,
	defaultDiscountPercentage: '1',
	buyerReference: null,
	governmentAgency: '0',
	defaultShowVat: '1',
};
const part = {
	id: '300001',
	objectName: 'Part',
	additionalInformation: null,
	create: '2026-11-14T22:40:57+01:00',
	update: '2026-11-14T22:40:57+01:00',
	name: 'corsair-plugin-test part',
	partNumber: 'CPT-9',
	text: null,
	stock: '0',
	stockEnabled: '1',
	unity: { id: '1', objectName: 'Unity' },
	pricePartner: null,
	priceCustomer: null,
	price: '10',
	secondUnityFactor: null,
	sevClient,
	pricePurchase: null,
	taxRate: '19',
	image: null,
	status: '100',
	internalComment: null,
	priceNet: '10',
	priceGross: '11.9',
};
const checkAccount = {
	id: '400001',
	objectName: 'CheckAccount',
	additionalInformation: null,
	create: '2026-11-14T22:26:33+01:00',
	update: '2026-11-14T22:26:33+01:00',
	sevClient,
	name: 'Basiskonto',
	type: 'offline',
	importType: null,
	currency: 'EUR',
	defaultAccount: '1',
	status: '100',
	bankServer: null,
	balance: null,
	iban: null,
	bic: null,
	lastSync: null,
};
const contactAddress = {
	id: '500001',
	objectName: 'ContactAddress',
	additionalInformation: null,
	create: '2026-11-15T00:10:00+01:00',
	contact: { id: '200001', objectName: 'Contact' },
	street: 'Teststr. 1',
	zip: '10115',
	city: 'Berlin',
	country: { id: '1', objectName: 'StaticCountry' },
	category: { id: '47', objectName: 'Category' },
	name: 'corsair-plugin-test',
	sevClient,
	name2: null,
	name3: null,
	name4: null,
};
const invoice = {
	id: '600001',
	objectName: 'Invoice',
	invoiceNumber: null,
	contact: { id: '200001', objectName: 'Contact' },
	invoiceDate: '2026-11-15T00:00:00+01:00',
	header: null,
	headText: null,
	footText: null,
	timeToPay: null,
	discountTime: null,
	discount: '0',
	payDate: null,
	status: '100',
	smallSettlement: '0',
	taxRate: '0',
	taxRule: { id: '1', objectName: 'TaxRule' },
	taxText: 'Umsatzsteuer',
	taxType: 'default',
	invoiceType: 'RE',
	currency: 'EUR',
	sumNet: '10',
	sumTax: '1.9',
	sumGross: '11.9',
	showNet: '1',
	sevClient,
};

let fetchSpy: jest.SpyInstance;
// `unknown` because tests feed both valid and deliberately malformed Sevdesk payloads; it is only serialized.
function respond(body: unknown, status = 200): void {
	fetchSpy.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}
beforeEach(() => {
	fetchSpy = jest.spyOn(globalThis, 'fetch');
	mockedLogEvent.mockReset();
});
afterEach(() => {
	fetchSpy.mockRestore();
});

describe('sevDesk live response shapes', () => {
	it('reads contacts with null fields and string ids', async () => {
		respond({ objects: [contact] });
		const out = await sevdeskEndpointsNested.contact.getContactById(ctx, {
			path: { contactId: 200001 },
		});
		expect(out.objects?.[0]?.id).toBe('200001');
		expect(out.objects?.[0]?.surename).toBeNull();
		expect(out.objects?.[0]?.sevClient?.id).toBe('100001');
	});
	it('reads parts and stock with numbers sent as strings', async () => {
		respond({ objects: [part] });
		const parts = await sevdeskEndpointsNested.part.getPartById(ctx, {
			path: { partId: 300001 },
		});
		expect(parts.objects?.[0]?.priceGross).toBe('11.9');
		expect(parts.objects?.[0]?.stockEnabled).toBe('1');
		respond({ objects: '0' });
		const stock = await sevdeskEndpointsNested.part.partGetStock(ctx, {
			path: { partId: 300001 },
		});
		expect(stock.objects).toBe('0');
	});
	it('reads check accounts whose lastSync and importType are null', async () => {
		respond({ objects: [checkAccount] });
		const out = await sevdeskEndpointsNested.checkAccount.getCheckAccounts(
			ctx,
			{},
		);
		expect(out.objects?.[0]?.lastSync).toBeNull();
	});
	it('returns create and update results inside the objects envelope', async () => {
		respond({ objects: contactAddress }, 201);
		const created =
			await sevdeskEndpointsNested.contactAddress.createContactAddress(ctx, {
				body: {
					contact: { id: 200001, objectName: 'Contact' },
					street: 'Teststr. 1',
					zip: '10115',
					city: 'Berlin',
					country: { id: 1, objectName: 'StaticCountry' },
					category: { id: 47, objectName: 'Category' },
				},
			});
		expect(created.objects?.id).toBe('500001');
		respond({ objects: part });
		const updated = await sevdeskEndpointsNested.part.updatePart(ctx, {
			path: { partId: 300001 },
			body: {
				name: 'corsair-plugin-test part',
				partNumber: 'CPT-9',
				stock: 0,
				unity: { id: 1, objectName: 'Unity' },
				taxRate: 19,
			},
		});
		expect(updated.objects?.priceNet).toBe('10');
		respond({
			objects: {
				invoice,
				invoicePos: [{ id: '700001', objectName: 'InvoicePos' }],
				vatdrop: null,
			},
		});
		const saved = await sevdeskEndpointsNested.invoice.createInvoiceByFactory(
			ctx,
			{
				body: {
					invoice: {
						contact: { id: 200001, objectName: 'Contact' },
						contactPerson: { id: 1, objectName: 'SevUser' },
						invoiceDate: '2026-11-15',
						discount: 0,
						addressCountry: { id: 1, objectName: 'StaticCountry' },
						status: '100',
						taxRate: 19,
						taxRule: { id: '1', objectName: 'TaxRule' },
						taxText: 'Umsatzsteuer',
						taxType: 'default',
						invoiceType: 'RE',
						currency: 'EUR',
						mapAll: true,
					},
				},
			},
		);
		expect(saved.objects?.invoice?.id).toBe('600001');
	});
	it('reads draft invoices with null payDate and smallSettlement "0"', async () => {
		respond({ objects: [invoice] });
		const out = await sevdeskEndpointsNested.invoice.getInvoiceById(ctx, {
			path: { invoiceId: 600001 },
		});
		expect(out.objects?.[0]?.smallSettlement).toBe('0');
		expect(out.objects?.[0]?.payDate).toBeNull();
	});
	it('reads the next customer number, sent as a number', async () => {
		respond({ objects: 1000 });
		const out = await sevdeskEndpointsNested.contact.getNextCustomerNumber(
			ctx,
			{},
		);
		expect(out.objects).toBe(1000);
	});
	it('reads one receipt guide object for one account number', async () => {
		respond({
			objects: {
				accountDatevId: 5192,
				accountNumber: '4400',
				accountName: 'Erlöse 19 % USt',
				allowedTaxRules: [
					{ name: 'USTPFL_UMS_EINN', id: 1, taxRates: ['NINETEEN'] },
				],
				allowedReceiptTypes: ['REVENUE'],
			},
		});
		const out = await sevdeskEndpointsNested.voucher.forAccountNumber(ctx, {
			query: { accountNumber: 4400 },
		});
		expect(Array.isArray(out.objects)).toBe(false);
	});
	it('reads placeholder groups with nested entries', async () => {
		respond({
			objects: [
				{
					key: 'CONTACT',
					value: [
						{ key: 'FORENAME', value: 'Vorname' },
						{
							key: 'ADDRESS',
							value: [{ key: 'STREET', value: 'Straße' }],
						},
					],
				},
			],
		});
		const out = await sevdeskEndpointsNested.contactField.getPlaceholder(ctx, {
			query: { objectName: 'Invoice' },
		});
		expect(out.objects?.[0]?.value).toHaveLength(2);
	});
	it('reads ZIP exports whose content is null', async () => {
		respond({
			objects: {
				filename: 'Rechnungen_14.11.26.zip',
				mimetype: 'application/zip',
				base64Encoded: true,
				content: null,
			},
		});
		const out = await sevdeskEndpointsNested.export.exportInvoiceZip(ctx, {
			query: {
				download: false,
				sevQuery: { modelName: 'Invoice', objectName: 'SevQuery' },
			},
		});
		expect(out.objects?.content).toBeNull();
		const url = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(url.searchParams.get('download')).toBe('0');
	});
	it('names the operation and field path, not the value, on a wrong response type', async () => {
		respond({ objects: [{ ...contact, category: 'Private Customer' }] });
		const caught = await sevdeskEndpointsNested.contact
			.getContactById(ctx, { path: { contactId: 200001 } })
			// `unknown` because a rejection can carry any value; the assertions below narrow it to Error.
			.catch((error: unknown) => error);
		expect(caught).toBeInstanceOf(Error);
		if (!(caught instanceof Error)) throw new Error('expected an Error');
		expect(caught.message).toContain('contact.getContactById');
		expect(caught.message).toContain('objects.0.category');
		expect(caught.message).not.toContain('Private Customer');
	});
});

describe('sevDesk live request shapes', () => {
	it('saves an Update 2.0 voucher position with accountDatev and sumGross only', async () => {
		respond({ objects: { voucher: { id: '800001' }, voucherPos: [] } }, 201);
		await expect(
			sevdeskEndpointsNested.voucher.voucherFactorySaveVoucher(ctx, {
				body: {
					voucher: {
						objectName: 'Voucher',
						mapAll: true,
						status: 50,
						taxRule: { id: '1', objectName: 'TaxRule' },
						taxType: 'default',
						creditDebit: 'D',
						voucherType: 'VOU',
					},
					voucherPosSave: [
						{
							objectName: 'VoucherPos',
							mapAll: true,
							accountDatev: { id: 3510, objectName: 'AccountDatev' },
							taxRate: 19,
							net: false,
							sumGross: 11.9,
						},
					],
				},
			}),
		).resolves.toBeDefined();
	});
	it('sends objectName and mapAll on order positions, which saveOrder needs', async () => {
		respond({ objects: { order: { id: '900001' }, orderPos: [] } }, 201);
		await sevdeskEndpointsNested.order.createOrder(ctx, {
			body: {
				order: {
					objectName: 'Order',
					mapAll: true,
					orderNumber: 'CPT-AN-1',
					contact: { id: 200001, objectName: 'Contact' },
					orderDate: '2026-11-15',
					status: 100,
					header: 'corsair-plugin-test order',
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					version: 0,
					contactPerson: { id: 1, objectName: 'SevUser' },
					taxRate: 19,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer',
					taxType: 'default',
					currency: 'EUR',
				},
				orderPosSave: [
					{
						objectName: 'OrderPos',
						mapAll: true,
						quantity: 1,
						unity: { id: 1, objectName: 'Unity' },
						taxRate: 19,
					},
				],
			},
		});
		const sent = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body));
		expect(sent.orderPosSave[0]).toMatchObject({
			objectName: 'OrderPos',
			mapAll: true,
		});
	});
	it('accepts deliveryDate on a credit note, which sevDesk requires', async () => {
		respond({ objects: { creditNote: { id: '910001' } } }, 201);
		await expect(
			sevdeskEndpointsNested.creditNote.createcreditNote(ctx, {
				body: {
					creditNote: {
						objectName: 'CreditNote',
						mapAll: true,
						creditNoteNumber: 'CPT-GU-1',
						contact: { id: 200001, objectName: 'Contact' },
						creditNoteDate: '2026-11-15',
						deliveryDate: '2026-11-15',
						status: '100',
						header: 'corsair-plugin-test credit note',
						addressCountry: { id: 1, objectName: 'StaticCountry' },
						contactPerson: { id: 1, objectName: 'SevUser' },
						taxRule: { id: '1', objectName: 'TaxRule' },
						taxRate: 19,
						taxText: 'Umsatzsteuer',
						taxType: 'default',
						bookingCategory: 'UNDERACHIEVEMENT',
						currency: 'EUR',
					},
				},
			}),
		).resolves.toBeDefined();
	});
	it('requires view on the voucher report, which answers 500 without it', async () => {
		await expect(
			sevdeskEndpointsNested.report.reportVoucher(ctx, {
				query: { sevQuery: { modelName: 'Voucher', objectName: 'SevQuery' } },
			} as never),
		).rejects.toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
		respond({ objects: { filename: 'x.pdf', content: 'JVBERi0=' } });
		await sevdeskEndpointsNested.report.reportVoucher(ctx, {
			query: {
				view: 'all',
				sevQuery: { modelName: 'Voucher', objectName: 'SevQuery' },
			},
		});
		const url = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(url.searchParams.get('view')).toBe('all');
	});
	it('marks DATEV exports that can enshrine documents as destructive', () => {
		const meta = sevdesk().endpointMeta;
		expect(meta?.['export.exportDatevDepricated']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta?.['export.exportDatevCSV']?.riskLevel).toBe('destructive');
		expect(meta?.['export.exportDatevXML']?.riskLevel).toBe('read');
	});
});

describe('sevDesk lenient response copies', () => {
	it('parses reset-to-open answers whose intersection holds nulls and numbers', async () => {
		respond({
			objects: {
				id: 600001,
				objectName: 'Invoice',
				invoiceNumber: 'RE-1000',
				payDate: null,
				status: '100',
				enshrined: null,
				sumNet: '10',
			},
		});
		const out = await sevdeskEndpointsNested.invoice.invoiceResetToOpen(ctx, {
			path: { invoiceId: 600001 },
		});
		expect(out.objects?.id).toBe(600001);
		expect(out.objects?.payDate).toBeNull();
		respond({
			objects: {
				id: '700001',
				objectName: 'CreditNote',
				taxText: null,
				customerInternalNote: null,
				sumNet: 10,
			},
		});
		const draft =
			await sevdeskEndpointsNested.creditNote.creditNoteResetToDraft(ctx, {
				path: { creditNoteId: 700001 },
			});
		expect(draft.objects?.id).toBe('700001');
	});
	it('parses custom fields whose setting carries null fields', async () => {
		respond({
			objects: [
				{
					id: '800001',
					objectName: 'ContactCustomField',
					value: 'x',
					contactCustomFieldSetting: {
						id: 900001,
						objectName: 'ContactCustomFieldSetting',
						description: null,
					},
				},
			],
		});
		const out = await sevdeskEndpointsNested.contactField.getContactFields(
			ctx,
			{},
		);
		expect(out.objects?.[0]?.id).toBe('800001');
	});
	it('keeps booleans out of number-or-string unions', () => {
		const schema = toResponseSchema(z.union([z.number(), z.string()]));
		expect(schema.safeParse('2').success).toBe(true);
		expect(schema.safeParse(2).success).toBe(true);
		expect(schema.safeParse(true).success).toBe(false);
		const flag = toResponseSchema(z.union([z.boolean(), z.string()]));
		expect(flag.safeParse(true).success).toBe(true);
	});
});
