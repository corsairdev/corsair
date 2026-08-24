/**
 * Guards the persisted entity schemas against the two ways they go wrong:
 * dropping a field Mailtrap actually returns, and requiring a field
 * Mailtrap sometimes omits.
 *
 * Every key list below was captured from live responses against a real
 * Mailtrap account on 2026-08-17 (see `MAILTRAP-PLAN.md` and
 * `endpoints/types.ts` for the exact requests).
 */

import { MailtrapSchema } from './schema';
import {
	MailtrapContactEntity,
	MailtrapContactFieldEntity,
	MailtrapContactListEntity,
	MailtrapEmailTemplateEntity,
	MailtrapInboxEntity,
	MailtrapProjectEntity,
	MailtrapSendingDomainEntity,
} from './schema/database';

describe('Mailtrap schema', () => {
	it('declares a semver version', () => {
		expect(MailtrapSchema.version).toBeDefined();
		expect(MailtrapSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MailtrapSchema.entities).toBe('object');
		expect(MailtrapSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MailtrapSchema.entities))).toBe(true);
		for (const entity of Object.values(MailtrapSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers exactly the seven reference-data entities', () => {
		expect(Object.keys(MailtrapSchema.entities).sort()).toEqual([
			'contactFields',
			'contactLists',
			'contacts',
			'emailTemplates',
			'inboxes',
			'projects',
			'sendingDomains',
		]);
	});
});

const LIVE_KEYS = {
	contacts: [
		'id',
		'email',
		'created_at',
		'updated_at',
		'list_ids',
		'status',
		'fields',
	],
	contactLists: ['id', 'name'],
	contactFields: ['id', 'name', 'merge_tag', 'data_type'],
	emailTemplates: [
		'id',
		'uuid',
		'name',
		'subject',
		'category',
		'body_html',
		'body_text',
		'created_at',
		'updated_at',
	],
	sendingDomains: [
		'id',
		'domain_name',
		'demo',
		'inbound_enabled',
		'inbound_verified',
		'open_tracking_enabled',
		'click_tracking_enabled',
	],
	projects: ['id', 'name'],
	inboxes: [
		'id',
		'name',
		'status',
		'email_username',
		'project_id',
		'domain',
		'sent_messages_count',
		'emails_count',
		'emails_unread_count',
	],
} as const;

const ENTITIES = {
	contacts: MailtrapContactEntity,
	contactLists: MailtrapContactListEntity,
	contactFields: MailtrapContactFieldEntity,
	emailTemplates: MailtrapEmailTemplateEntity,
	sendingDomains: MailtrapSendingDomainEntity,
	projects: MailtrapProjectEntity,
	inboxes: MailtrapInboxEntity,
} as const;

describe('entity schemas declare every observed field', () => {
	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} declares all ${LIVE_KEYS[name as keyof typeof LIVE_KEYS].length} keys`, () => {
			const declared = schema.shape;
			for (const key of LIVE_KEYS[name as keyof typeof LIVE_KEYS]) {
				expect(declared).toHaveProperty(key);
			}
		});
	}
});

describe('entity schemas require only what the live API always sends', () => {
	/**
	 * Every field beyond the ones below is optional: Mailtrap omits fields
	 * depending on resource state (a fresh contact field has no
	 * `created_at`/`updated_at`, a domain mid-verification has null DNS
	 * status). A schema that required more than these would reject those
	 * valid rows outright, which is the failure mode that matters: a
	 * rejected row is a lost row.
	 *
	 * `contacts` requires `email` alongside its `id` because the live API
	 * guarantees it is always present, not because this schema chose to
	 * require it beyond what is observed.
	 */
	const minimal = {
		contacts: { id: 'c1', email: 'a@example.com' },
		contactLists: { id: 1, name: 'L' },
		contactFields: { id: 1, name: 'F' },
		emailTemplates: { id: 1, name: 'T' },
		sendingDomains: { id: 1, domain_name: 'example.com' },
		projects: { id: 1, name: 'P' },
		inboxes: { id: 1, name: 'I' },
	} as const;

	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} parses a record carrying only its required fields`, () => {
			const result = schema.safeParse(minimal[name as keyof typeof minimal]);
			expect(result.success).toBe(true);
		});
	}
});

describe('entity schemas coerce both persisted date formats', () => {
	/**
	 * Mailtrap's own timestamp format varies by resource (see
	 * `endpoints/types.ts`): contacts use epoch milliseconds, everything
	 * else uses ISO 8601 strings. `z.coerce.date()` accepts both; `z.date()`
	 * would silently reject the raw values these entities are actually
	 * built from in `persist.ts`. Guards against that substitution.
	 */
	it('coerces a contact epoch-millisecond timestamp to a Date', () => {
		const parsed = MailtrapContactEntity.parse({
			id: 'c1',
			email: 'a@example.com',
			created_at: 1700000000000,
		});

		expect(parsed.created_at).toBeInstanceOf(Date);
		expect(parsed.created_at?.getTime()).toBe(1700000000000);
	});

	it('coerces an email template ISO-string timestamp to a Date', () => {
		const parsed = MailtrapEmailTemplateEntity.parse({
			id: 1,
			name: 'T',
			created_at: '2026-08-17T05:28:36.382Z',
		});

		expect(parsed.created_at).toBeInstanceOf(Date);
		expect(parsed.created_at?.toISOString()).toBe('2026-08-17T05:28:36.382Z');
	});
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field Mailtrap adds later rather than dropping it', () => {
		const parsed = MailtrapContactListEntity.parse({
			id: 1,
			name: 'Example',
			some_future_field: 'kept',
		});

		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects a contact with no id', () => {
		expect(
			MailtrapContactEntity.safeParse({ email: 'a@example.com' }).success,
		).toBe(false);
	});

	it('rejects a contact list with no id', () => {
		expect(
			MailtrapContactListEntity.safeParse({ name: 'Nameless' }).success,
		).toBe(false);
	});

	it('rejects an inbox with no id', () => {
		expect(MailtrapInboxEntity.safeParse({ name: 'Nameless' }).success).toBe(
			false,
		);
	});
});
