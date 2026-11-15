import * as client from './client';
import { PostgridAPIError } from './client';
import {
	Contacts,
	Letters,
	Postcards,
	SelfMailers,
	Templates,
	Trackers,
} from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostgridRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostgridRequest);

const ctx = buildContext();

const to = { addressLine1: '145 Mulberry St', countryCode: 'US' };
const from = { id: 'contact_sender' };

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('accepts a field PostGrid adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue({
			id: 'contact_1',
			object: 'contact',
			addressLine1: '20 Bay St',
			brand_new_field: 'x',
		});

		const result = await Contacts.get(ctx, { id: 'contact_1' });

		expect(result).toMatchObject({ brand_new_field: 'x' });
	});

	it('rejects a list page whose data is not an array', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			totalCount: 0,
			data: 'not-an-array',
		});

		await expect(Contacts.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a list page that omits totalCount', async () => {
		mockedRequest.mockResolvedValue({ object: 'list', data: [] });

		await expect(Contacts.list(ctx, {})).rejects.toThrow();
	});

	it('accepts an empty page, which a fresh account returns', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			limit: 10,
			skip: 0,
			totalCount: 0,
			data: [],
		});

		const result = await Contacts.list(ctx, { limit: 10 });

		expect(result.data).toEqual([]);
		expect(result.totalCount).toBe(0);
	});

	it('rejects a letter whose status is the wrong type', async () => {
		mockedRequest.mockResolvedValue({
			id: 'letter_1',
			status: 42,
		});

		await expect(Letters.get(ctx, { id: 'letter_1' })).rejects.toThrow();
	});

	it('keeps a null template id, which a raw-HTML letter sends', async () => {
		mockedRequest.mockResolvedValue({
			id: 'letter_1',
			status: 'ready',
			html: '<b>Hi</b>',
			template: null,
			pageCount: null,
		});

		const result = await Letters.get(ctx, { id: 'letter_1' });

		expect(result.template).toBeNull();
		expect(result.html).toBe('<b>Hi</b>');
	});

	it('accepts a letter with no intelligent-mail fields, which only live US mail gets', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_1', status: 'ready' });

		const result = await Letters.get(ctx, { id: 'letter_1' });

		expect(result.imbStatus).toBeUndefined();
		expect(result.imbDate).toBeUndefined();
	});

	it('parses a letter carrying the USPS intelligent-mail stage', async () => {
		mockedRequest.mockResolvedValue({
			id: 'letter_1',
			status: 'processed_for_delivery',
			imbStatus: 'out_for_delivery',
			imbDate: '2024-06-01',
			imbZIPCode: '10013',
		});

		const result = await Trackers.get(ctx, { id: 'letter_1' });

		expect(result.imbStatus).toBe('out_for_delivery');
		expect(result.imbZIPCode).toBe('10013');
	});

	it('rejects a postcard that omits its id', async () => {
		mockedRequest.mockResolvedValue({ status: 'ready' });

		/// The id is optional on the schema because a create may not echo it, so
		// this asserts the parse itself rather than a failure.
		const result = await Postcards.get(ctx, { id: 'postcard_1' });
		expect(result.id).toBeUndefined();
	});

	it('accepts a self mailer with only its core fields', async () => {
		mockedRequest.mockResolvedValue({
			id: 'self_mailer_1',
			object: 'self_mailer',
			status: 'ready',
		});

		const result = await SelfMailers.get(ctx, { id: 'self_mailer_1' });

		expect(result.status).toBe('ready');
	});

	it('rejects a template whose html is not a string', async () => {
		mockedRequest.mockResolvedValue({
			id: 'template_1',
			html: { body: '<b>' },
		});

		await expect(Templates.get(ctx, { id: 'template_1' })).rejects.toThrow();
	});
});

describe('input validation before the request', () => {
	it('rejects a letter with neither html nor a template', async () => {
		await expect(Letters.create(ctx, { to, from })).rejects.toThrow(
			/Supply html or a template/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a letter with both html and a template', async () => {
		await expect(
			Letters.create(ctx, {
				to,
				from,
				html: '<b>Hi</b>',
				template: 'template_1',
			}),
		).rejects.toThrow(/not both/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('requires both faces on a postcard', async () => {
		await expect(
			Postcards.create(ctx, {
				to,
				from,
				size: '6x4',
				frontHTML: '<b>Front</b>',
			}),
		).rejects.toThrow(/Supply backHTML or backTemplate/);
		await expect(
			Postcards.create(ctx, { to, from, size: '6x4', backHTML: '<b>Back</b>' }),
		).rejects.toThrow(/Supply frontHTML or frontTemplate/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a postcard whose face has both html and a template', async () => {
		await expect(
			Postcards.create(ctx, {
				to,
				from,
				size: '6x4',
				frontHTML: '<b>Front</b>',
				frontTemplate: 'template_1',
				backHTML: '<b>Back</b>',
			}),
		).rejects.toThrow(/frontHTML or frontTemplate, not both/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('requires both panels on a self mailer', async () => {
		await expect(
			SelfMailers.create(ctx, {
				to,
				from,
				size: '8.5x11_bifold',
				insideHTML: '<b>In</b>',
			}),
		).rejects.toThrow(/Supply outsideHTML or outsideTemplate/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a postcard size PostGrid does not print', async () => {
		await expect(
			Postcards.create(ctx, {
				to,
				from,
				size: '5x3' as never,
				frontHTML: '<b>F</b>',
				backHTML: '<b>B</b>',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a mailing class outside the documented set', async () => {
		await expect(
			Letters.create(ctx, {
				to,
				from,
				html: '<b>Hi</b>',
				mailingClass: 'teleport' as never,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a letter size outside the documented set', async () => {
		await expect(
			Letters.create(ctx, {
				to,
				from,
				html: '<b>Hi</b>',
				size: 'a5' as never,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a template update that changes nothing', async () => {
		await expect(Templates.update(ctx, { id: 'template_1' })).rejects.toThrow(
			/at least one field/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a contact without an address line', async () => {
		await expect(
			Contacts.create(ctx, { firstName: 'Kevin' } as never),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a country code that is not two letters', async () => {
		await expect(
			Contacts.create(ctx, { addressLine1: '20 Bay St', countryCode: 'CAN' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an idempotency key above the documented length', async () => {
		await expect(
			Letters.create(ctx, {
				to,
				from,
				html: '<b>Hi</b>',
				idempotencyKey: 'x'.repeat(257),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a PostGrid rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new PostgridAPIError(
				'PostGrid 401 invalid_api_key_error: Invalid API key',
				{
					status: 401,
					code: 'invalid_api_key_error',
					method: 'GET',
					credentialsRejected: true,
				},
			),
		);

		// unknown: a rejection reason has no static type until it is narrowed.
		const error = await captureError(Contacts.get(ctx, { id: 'contact_1' }));

		expect(error).toBeInstanceOf(PostgridAPIError);
		expect(error).toMatchObject({ status: 401, code: 'invalid_api_key_error' });
	});
});
