import {
	ContactSchema,
	ContactsCreateInputSchema,
	LettersCreateInputSchema,
	POSTGRID_MAILING_CLASSES,
	POSTGRID_ORDER_STATUSES,
	PostcardsCreateInputSchema,
	SelfMailersCreateInputSchema,
	TemplateSchema,
	TemplatesUpdateInputSchema,
} from './endpoints/types';
import { PostgridSchema } from './schema';

const to = { addressLine1: '145 Mulberry St', countryCode: 'US' };
const from = { id: 'contact_sender' };

describe('PostGrid plugin schema', () => {
	it('declares a semver version', () => {
		expect(PostgridSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PostgridSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PostgridSchema.entities)).toBe(false);
	});
});

describe('documented vocabularies', () => {
	it('pins the order lifecycle in the documented order', () => {
		expect(POSTGRID_ORDER_STATUSES).toEqual([
			'ready',
			'printing',
			'processed_for_delivery',
			'completed',
			'cancelled',
		]);
	});

	it('pins every mailing class the docs list', () => {
		// The docs call their table exhaustive, so the schema must not drop one.
		expect(POSTGRID_MAILING_CLASSES).toHaveLength(26);
		expect(POSTGRID_MAILING_CLASSES).toContain('usps_first_class');
		expect(POSTGRID_MAILING_CLASSES).toContain('ca_post_lettermail');
		expect(POSTGRID_MAILING_CLASSES).toContain('royal_mail_first_class');
		expect(POSTGRID_MAILING_CLASSES).toContain(
			'ups_express_3_day_adult_signature_confirmation',
		);
	});
});

describe('contact schemas', () => {
	it('parses a contact with its verification status', () => {
		expect(
			ContactSchema.safeParse({
				id: 'contact_1',
				object: 'contact',
				addressLine1: '20 Bay St',
				countryCode: 'CA',
				addressStatus: 'verified',
				metadata: { crm: 'Acme' },
			}).success,
		).toBe(true);
	});

	it('accepts the three documented address statuses and keeps an unseen one', () => {
		for (const addressStatus of [
			'verified',
			'corrected',
			'failed',
			'someone-new',
		]) {
			expect(
				ContactSchema.safeParse({ id: 'contact_1', addressStatus }).success,
			).toBe(true);
		}
	});

	it('requires an address line on create, since that is what it mails to', () => {
		expect(
			ContactsCreateInputSchema.safeParse({ addressLine1: '20 Bay St' })
				.success,
		).toBe(true);
		expect(ContactsCreateInputSchema.safeParse({}).success).toBe(false);
	});

	it('rejects a country code that is not two letters', () => {
		expect(
			ContactsCreateInputSchema.safeParse({
				addressLine1: '20 Bay St',
				countryCode: 'CAN',
			}).success,
		).toBe(false);
	});
});

describe('template schemas', () => {
	it('parses a template', () => {
		expect(
			TemplateSchema.safeParse({
				id: 'template_1',
				object: 'template',
				html: '<b>Hello</b> {{to.firstName}}!',
				description: 'Test',
			}).success,
		).toBe(true);
	});

	it('rejects an update that changes nothing', () => {
		expect(
			TemplatesUpdateInputSchema.safeParse({ id: 'template_1' }).success,
		).toBe(false);
	});

	it('accepts an update that changes one field', () => {
		expect(
			TemplatesUpdateInputSchema.safeParse({
				id: 'template_1',
				description: 'New',
			}).success,
		).toBe(true);
	});
});

describe('order schemas', () => {
	it('accepts a letter from html, and one from a template', () => {
		expect(
			LettersCreateInputSchema.safeParse({ to, from, html: '<b>Hi</b>' })
				.success,
		).toBe(true);
		expect(
			LettersCreateInputSchema.safeParse({
				to,
				from,
				template: 'template_1',
			}).success,
		).toBe(true);
	});

	it('rejects a letter with no body and with two bodies', () => {
		expect(LettersCreateInputSchema.safeParse({ to, from }).success).toBe(
			false,
		);
		expect(
			LettersCreateInputSchema.safeParse({
				to,
				from,
				html: '<b>Hi</b>',
				template: 'template_1',
			}).success,
		).toBe(false);
	});

	it('requires a size on a postcard, since the stock is not inferable', () => {
		expect(
			PostcardsCreateInputSchema.safeParse({
				to,
				from,
				frontHTML: '<b>F</b>',
				backHTML: '<b>B</b>',
			}).success,
		).toBe(false);
		expect(
			PostcardsCreateInputSchema.safeParse({
				to,
				from,
				size: '6x4',
				frontHTML: '<b>F</b>',
				backHTML: '<b>B</b>',
			}).success,
		).toBe(true);
	});

	it('accepts a postcard whose faces come from templates', () => {
		expect(
			PostcardsCreateInputSchema.safeParse({
				to,
				from,
				size: '9x6',
				frontTemplate: 'template_f',
				backTemplate: 'template_b',
			}).success,
		).toBe(true);
	});

	it('accepts only the two documented self-mailer folds', () => {
		const base = {
			to,
			from,
			insideHTML: '<b>In</b>',
			outsideHTML: '<b>Out</b>',
		};
		expect(
			SelfMailersCreateInputSchema.safeParse({
				...base,
				size: '8.5x11_bifold',
			}).success,
		).toBe(true);
		expect(
			SelfMailersCreateInputSchema.safeParse({
				...base,
				size: '8.5x11_trifold',
			}).success,
		).toBe(true);
		expect(
			SelfMailersCreateInputSchema.safeParse({ ...base, size: 'a4_fold' })
				.success,
		).toBe(false);
	});

	it('accepts a recipient given only as a contact id', () => {
		expect(
			LettersCreateInputSchema.safeParse({
				to: { id: 'contact_1' },
				from: { id: 'contact_2' },
				html: '<b>Hi</b>',
			}).success,
		).toBe(true);
	});

	it('keeps arbitrary merge variables, which are the caller own data', () => {
		const parsed = LettersCreateInputSchema.parse({
			to,
			from,
			html: '<b>{{name}}</b>',
			mergeVariables: { name: 'Kevin', nested: { code: 4242 } },
		});

		expect(parsed.mergeVariables).toEqual({
			name: 'Kevin',
			nested: { code: 4242 },
		});
	});
});
