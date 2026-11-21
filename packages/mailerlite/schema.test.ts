import { z } from 'zod';
import {
	MailerLiteEndpointInputSchemas,
	MailerLiteEndpointOutputSchemas,
} from './endpoints/types';
import { mailerLiteEndpointSchemas } from './index';
import { MailerLiteSchema } from './schema';

describe('MailerLite database schema', () => {
	it('uses a semver schema version and declares no persisted entities', () => {
		expect(MailerLiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(MailerLiteSchema.entities).toEqual({});
	});
});

describe('MailerLite endpoint schema registry', () => {
	it('registers input and output Zod schemas for every route operation', () => {
		const schemas = Object.values(mailerLiteEndpointSchemas);
		expect(schemas.length).toBeGreaterThan(150);
		expect(Object.keys(MailerLiteEndpointInputSchemas).sort()).toEqual(
			Object.keys(mailerLiteEndpointSchemas).sort(),
		);
		expect(Object.keys(MailerLiteEndpointOutputSchemas).sort()).toEqual(
			Object.keys(mailerLiteEndpointSchemas).sort(),
		);
		for (const schema of schemas) {
			expect(schema.input).toBeInstanceOf(z.ZodType);
			expect(schema.output).toBeInstanceOf(z.ZodType);
		}
	});

	it('rejects unknown subscriber create and update keys', () => {
		const create = mailerLiteEndpointSchemas['subscribers.create']?.input;
		const update = mailerLiteEndpointSchemas['subscribers.update']?.input;
		expect(
			create?.safeParse({ body: { email: 'person@mailerlite.test' } }).success,
		).toBe(true);
		expect(
			create?.safeParse({
				body: {
					email: 'person@mailerlite.test',
					webhook_url: 'https://mailer.test',
				},
			}).success,
		).toBe(false);
		expect(
			update?.safeParse({
				id: '123',
				body: { status: 'active', resubscribe: true },
			}).success,
		).toBe(false);
	});

	it('keeps subscriber status and resubscription explicit', () => {
		const schema = mailerLiteEndpointSchemas['subscribers.create']?.input;
		expect(
			schema?.safeParse({ body: { email: 'person@mailerlite.test' } }).success,
		).toBe(true);
		expect(
			schema?.safeParse({
				body: { email: 'person@mailerlite.test', resubscribe: true },
			}).success,
		).toBe(true);
		expect(
			schema?.safeParse({ body: { email: 'not-an-email', status: 'active' } })
				.success,
		).toBe(false);
	});

	it('requires campaign messages before scheduling regular campaign drafts', () => {
		const schema = mailerLiteEndpointSchemas['campaigns.create']?.input;
		expect(
			schema?.safeParse({ body: { name: 'Monthly note', type: 'regular' } })
				.success,
		).toBe(false);
		expect(
			schema?.safeParse({
				body: {
					name: 'Monthly note',
					type: 'regular',
					emails: [
						{
							subject: 'News',
							from_name: 'Team',
							from: 'sender@mailerlite.test',
						},
					],
				},
			}).success,
		).toBe(true);
	});

	it('validates automation step data by documented step shape', () => {
		const schema = mailerLiteEndpointSchemas['automationSteps.create']?.input;
		expect(
			schema?.safeParse({
				automationId: 'auto-1',
				body: { type: 'delay', data: { unit: 'days', value: 3 } },
			}).success,
		).toBe(true);
		expect(
			schema?.safeParse({
				automationId: 'auto-1',
				body: {
					type: 'delay',
					data: { unit: 'days', value: 3, arbitrary: true },
				},
			}).success,
		).toBe(false);
	});

	it('bounds the documented email idempotency key and validates editor block data', () => {
		const schema = mailerLiteEndpointSchemas['emails.insertBlock']?.input;
		const body = {
			emailId: 'email-1',
			idempotencyKey: 'request-1',
			body: {
				type: 'paragraph',
				etag: '42',
				editor_content: { content: [{ type: 'text', text: 'Hello' }] },
			},
		};
		expect(schema?.safeParse(body).success).toBe(true);
		expect(
			schema?.safeParse({ ...body, idempotencyKey: 'x'.repeat(256) }).success,
		).toBe(false);
		expect(
			schema?.safeParse({ ...body, body: { ...body.body, undocumented: true } })
				.success,
		).toBe(false);
	});

	it('models 204 results as undefined and rejects malformed documented entities', () => {
		expect(
			mailerLiteEndpointSchemas['groups.delete']?.output.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			mailerLiteEndpointSchemas['groups.delete']?.output.safeParse({}).success,
		).toBe(false);
		expect(
			mailerLiteEndpointSchemas['subscribers.get']?.output.safeParse({
				data: { id: '1' },
			}).success,
		).toBe(true);
		expect(
			mailerLiteEndpointSchemas['subscribers.get']?.output.safeParse({
				data: {},
			}).success,
		).toBe(false);
	});
});
