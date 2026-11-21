import {
	MailcoachEndpointInputSchemas,
	MailcoachEndpointOutputSchemas,
} from './endpoints/types';
import { mailcoachEndpointSchemas } from './index';
import { MailcoachSchema } from './schema';

const UUID = '00000000-0000-4000-8000-000000000001';

describe('Mailcoach schemas', () => {
	it('declares a semver version and no local entities', () => {
		expect(MailcoachSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(MailcoachSchema.entities).toEqual({});
	});

	it('keeps endpoint inputs, outputs, and registered schemas in exact sync', () => {
		const inputKeys = Object.keys(MailcoachEndpointInputSchemas).sort();
		const outputKeys = Object.keys(MailcoachEndpointOutputSchemas).sort();
		const registryKeys = Object.keys(mailcoachEndpointSchemas).sort();

		expect(inputKeys).toHaveLength(69);
		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toEqual(registryKeys);
	});

	it('rejects undocumented fields on strict endpoint input schemas', () => {
		for (const schema of Object.values(MailcoachEndpointInputSchemas)) {
			expect(
				schema.safeParse({ undocumented_callback: 'https://example.invalid' })
					.success,
			).toBe(false);
		}
	});

	it('rejects null as an invalid response for every registered endpoint', () => {
		for (const schema of Object.values(MailcoachEndpointOutputSchemas)) {
			expect(schema.safeParse(null).success).toBe(false);
		}
	});

	it('validates Mailcoach pagination envelopes and permits the final null next link', () => {
		expect(
			MailcoachEndpointOutputSchemas['emailLists.list'].safeParse({
				data: [{ uuid: UUID, name: 'Newsletter' }],
				links: { next: null },
				meta: { total: 1 },
			}).success,
		).toBe(true);
		expect(
			MailcoachEndpointOutputSchemas['emailLists.list'].safeParse({
				data: [],
				links: {},
				meta: {},
			}).success,
		).toBe(false);
		expect(
			MailcoachEndpointInputSchemas['emailLists.list'].safeParse({
				query: { filter: { search: 'newsletter' } },
				next: 'https://team.mailcoach.app/api/email-lists?page=2',
			}).success,
		).toBe(false);
	});

	it('preserves documented nullable send event fields', () => {
		expect(
			MailcoachEndpointOutputSchemas['sends.get'].safeParse({
				data: {
					uuid: UUID,
					campaign_uuid: null,
					automation_mail_uuid: null,
					transactional_mail_log_item_uuid: null,
					subscriber_uuid: UUID,
					sent_at: null,
					failed_at: null,
					failure_reason: null,
					open_count: 0,
					click_count: 0,
					first_opened_at: null,
					last_opened_at: null,
					first_clicked_at: null,
					last_clicked_at: null,
				},
			}).success,
		).toBe(true);
	});

	it('enforces subscriber state filters and campaign UTC schedule shape', () => {
		expect(
			MailcoachEndpointInputSchemas['subscribers.list'].safeParse({
				emailListUuid: UUID,
				query: { filter: { status: 'pending' } },
			}).success,
		).toBe(false);
		expect(
			MailcoachEndpointInputSchemas['campaigns.create'].safeParse({
				name: 'Draft',
				email_list_uuid: UUID,
				schedule_at: '2027-01-02T03:04:05Z',
			}).success,
		).toBe(false);
		expect(
			MailcoachEndpointInputSchemas['campaigns.create'].safeParse({
				name: 'Draft',
				email_list_uuid: UUID,
				schedule_at: '2027-01-02 03:04:05',
			}).success,
		).toBe(true);
	});

	it('accepts quoted CSV headers in import creation and update', () => {
		const csv =
			'"email","first_name","last, first"\nperson@example.com,Sam,Sample';
		expect(
			MailcoachEndpointInputSchemas['subscriberImports.create'].safeParse({
				subscribers_csv: csv,
				email_list_uuid: UUID,
			}).success,
		).toBe(true);
		expect(
			MailcoachEndpointInputSchemas['subscriberImports.update'].safeParse({
				importUuid: UUID,
				body: { subscribers_csv: csv, email_list_uuid: UUID },
			}).success,
		).toBe(true);
	});

	it('requires saved-mail or inline transactional content, not both', () => {
		const schema = MailcoachEndpointInputSchemas['transactionalMails.send'];
		const common = {
			from: 'Team <sender@example.invalid>',
			to: 'recipient@example.invalid',
		};
		expect(schema.safeParse({ ...common, mail_name: 'welcome' }).success).toBe(
			true,
		);
		expect(
			schema.safeParse({ ...common, subject: 'Hello', text: 'Body' }).success,
		).toBe(true);
		expect(schema.safeParse({ ...common, subject: 'Hello' }).success).toBe(
			false,
		);
		expect(
			schema.safeParse({
				...common,
				mail_name: 'welcome',
				subject: 'Hello',
				html: '<p>Body</p>',
			}).success,
		).toBe(false);
	});

	it('enforces documented image formats, base64, count, and byte bounds', () => {
		const schema = MailcoachEndpointInputSchemas['uploads.create'];
		const image = {
			name: 'pixel.png',
			base64:
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/mk0AAAAASUVORK5CYII=',
		};
		expect(schema.safeParse({ images: [image] }).success).toBe(true);
		expect(
			schema.safeParse({ images: [{ name: 'vector.svg', base64: 'PHN2Zy8+' }] })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({ images: [{ ...image, base64: 'not base64!' }] })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({ images: Array.from({ length: 11 }, () => image) })
				.success,
		).toBe(false);
	});

	it('models 204 operations as no-body results and rejects a body there', () => {
		const schema = MailcoachEndpointOutputSchemas['emailLists.delete'];
		expect(schema.safeParse(undefined).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});
});
