import {
	BounceSchema,
	EmailBatchSendInputSchema,
	EmailSendInputSchema,
	POSTMARK_SERVER_COLORS,
	POSTMARK_TRACK_LINKS,
	PostmarkAttachmentSchema,
	ServerSchema,
	TemplateSchema,
	TemplatesCreateInputSchema,
	TemplatesUpdateInputSchema,
} from './endpoints/types';
import { PostmarkSchema } from './schema';

describe('Postmark plugin schema', () => {
	it('declares a semver version', () => {
		expect(PostmarkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PostmarkSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PostmarkSchema.entities)).toBe(false);
	});
});

describe('documented vocabularies', () => {
	it('pins the four link-tracking options', () => {
		expect(POSTMARK_TRACK_LINKS).toEqual([
			'None',
			'HtmlAndText',
			'HtmlOnly',
			'TextOnly',
		]);
	});

	it('pins every server colour the docs list', () => {
		expect(POSTMARK_SERVER_COLORS).toEqual([
			'Purple',
			'Blue',
			'Turquoise',
			'Green',
			'Red',
			'Yellow',
			'Grey',
			'Orange',
		]);
	});
});

describe('send schemas', () => {
	const base = {
		From: 'sender@example.com',
		To: 'receiver@example.com',
		Subject: 'Hello',
	};

	it('accepts a message with a text body, an html body, or both', () => {
		expect(
			EmailSendInputSchema.safeParse({ ...base, TextBody: 'Hi' }).success,
		).toBe(true);
		expect(
			EmailSendInputSchema.safeParse({ ...base, HtmlBody: '<b>Hi</b>' })
				.success,
		).toBe(true);
		expect(
			EmailSendInputSchema.safeParse({
				...base,
				TextBody: 'Hi',
				HtmlBody: '<b>Hi</b>',
			}).success,
		).toBe(true);
	});

	it('rejects a message with no body at all', () => {
		expect(EmailSendInputSchema.safeParse(base).success).toBe(false);
	});

	it('requires From and To', () => {
		expect(EmailSendInputSchema.safeParse({ TextBody: 'Hi' }).success).toBe(
			false,
		);
	});

	it('accepts metadata as an open string map, which the API documents', () => {
		const parsed = EmailSendInputSchema.parse({
			...base,
			TextBody: 'Hi',
			Metadata: { color: 'blue', 'client-id': '12345' },
		});

		expect(parsed.Metadata).toEqual({ color: 'blue', 'client-id': '12345' });
	});

	it('rejects metadata whose value is not a string', () => {
		expect(
			EmailSendInputSchema.safeParse({
				...base,
				TextBody: 'Hi',
				Metadata: { count: 3 },
			}).success,
		).toBe(false);
	});

	it('caps a batch at the documented 500 messages', () => {
		const message = {
			From: 'sender@example.com',
			To: 'receiver@example.com',
			TextBody: 'Hi',
		};

		expect(
			EmailBatchSendInputSchema.safeParse({
				Messages: Array.from({ length: 500 }, () => message),
			}).success,
		).toBe(true);
		expect(
			EmailBatchSendInputSchema.safeParse({
				Messages: Array.from({ length: 501 }, () => message),
			}).success,
		).toBe(false);
	});

	it('rejects an empty batch', () => {
		expect(EmailBatchSendInputSchema.safeParse({ Messages: [] }).success).toBe(
			false,
		);
	});

	it('requires a name, content and type on an attachment', () => {
		expect(
			PostmarkAttachmentSchema.safeParse({
				Name: 'readme.txt',
				Content: 'dGVzdCBjb250ZW50',
				ContentType: 'text/plain',
			}).success,
		).toBe(true);
		expect(
			PostmarkAttachmentSchema.safeParse({
				Name: 'readme.txt',
				Content: 'dGVzdA==',
			}).success,
		).toBe(false);
	});

	it('accepts an inline attachment referenced by ContentID', () => {
		expect(
			PostmarkAttachmentSchema.safeParse({
				Name: 'image.jpg',
				Content: 'dGVzdA==',
				ContentType: 'image/jpeg',
				ContentID: 'cid:image.jpg',
			}).success,
		).toBe(true);
	});
});

describe('template schemas', () => {
	it('parses an active standard template', () => {
		expect(
			TemplateSchema.safeParse({
				TemplateId: 1234,
				Name: 'Welcome Email',
				Subject: 'Hi there',
				HtmlBody: '<b>Hello</b>',
				TextBody: 'Hello',
				AssociatedServerId: 1,
				Active: true,
				Alias: 'onboarding-v1',
				TemplateType: 'Standard',
				LayoutTemplate: null,
			}).success,
		).toBe(true);
	});

	it('requires a name and at least one body to create', () => {
		expect(
			TemplatesCreateInputSchema.safeParse({
				Name: 'Welcome',
				HtmlBody: '<b>Hi</b>',
			}).success,
		).toBe(true);
		expect(
			TemplatesCreateInputSchema.safeParse({ Name: 'Welcome' }).success,
		).toBe(false);
		expect(
			TemplatesCreateInputSchema.safeParse({ HtmlBody: '<b>Hi</b>' }).success,
		).toBe(false);
	});

	it('keeps every field optional on update, so a partial change is valid', () => {
		expect(
			TemplatesUpdateInputSchema.safeParse({ idOrAlias: '1234' }).success,
		).toBe(false);
		expect(
			TemplatesUpdateInputSchema.safeParse({
				idOrAlias: '1234',
				Subject: 'Only the subject',
			}).success,
		).toBe(true);
		// `Name` is required on create but must not be on update.
		expect(
			TemplatesUpdateInputSchema.safeParse({
				idOrAlias: '1234',
				HtmlBody: '<b>New</b>',
			}).success,
		).toBe(true);
	});
});

describe('server and bounce schemas', () => {
	it('parses a server with its delivery type and tracking flags', () => {
		expect(
			ServerSchema.safeParse({
				ID: 1234,
				Name: 'My Server',
				Color: 'Blue',
				SmtpApiActivated: true,
				DeliveryType: 'Live',
				TrackOpens: true,
				TrackLinks: 'HtmlAndText',
				ApiTokens: ['token-1'],
			}).success,
		).toBe(true);
	});

	it('parses a hard bounce with its activation flag', () => {
		expect(
			BounceSchema.safeParse({
				ID: 42,
				Type: 'HardBounce',
				TypeCode: 1,
				Email: 'bounce@example.com',
				BouncedAt: '2024-01-01T00:00:00Z',
				Inactive: true,
				CanActivate: true,
				DumpAvailable: false,
			}).success,
		).toBe(true);
	});

	it('keeps a bounce type a string, so a new one cannot fail a read', () => {
		expect(
			BounceSchema.safeParse({ ID: 1, Type: 'SomeNewBounceType' }).success,
		).toBe(true);
	});
});
