import { inkboxEndpointSchemas } from './endpoints/catalog';
import {
	InkboxManifestSchema,
	inkboxDefinitions,
	inkboxManifest,
	inkboxOperations,
	inkboxWebhookDefinitions,
} from './endpoints/manifest';
import {
	getInkboxInputSchema,
	getInkboxOutputSchema,
	getInkboxWebhookPayloadSchema,
	inkboxInputFields,
} from './endpoints/openapi-schema';
import { INKBOX_OPERATION_IDS } from './endpoints/operation-types';
import {
	InkboxEndpointInputSchemas,
	InkboxEndpointOutputSchemas,
} from './endpoints/types';
import { InkboxSchema } from './schema';

const ids = inkboxOperations.map((operation) => operation.id);
const routes = new Set(
	inkboxOperations.map((operation) => `${operation.method} ${operation.path}`),
);

function operation(id: string) {
	const found = inkboxOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

// `unknown` because manifest properties are raw JSON Schema documents.
function properties(id: string): Record<string, Record<string, unknown>> {
	return operation(id).input.properties as Record<
		string,
		// `unknown` because manifest properties are raw JSON Schema documents.
		Record<string, unknown>
	>;
}

describe('inkbox-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			InkboxManifestSchema.safeParse(inkboxManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 454 operations: the 496 spec routes less 21 deprecated, 15 console-only, 5 internal and the keyless self-signup, one per id and route', () => {
		expect(ids).toHaveLength(454);
		expect(new Set(ids).size).toBe(454);
		expect([...INKBOX_OPERATION_IDS].sort()).toEqual([...ids].sort());
		expect(routes.size).toBe(454);
	});

	it('resolves every schema reference', () => {
		const missing = new Set<string>();
		// `unknown` because the walk covers raw JSON Schema documents.
		const visit = (value: unknown) => {
			if (Array.isArray(value)) return value.forEach(visit);
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === '$ref' &&
					typeof inner === 'string' &&
					!(inner in inkboxDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(inkboxManifest);
		expect([...missing]).toEqual([]);
	});

	it('declares a response schema for every JSON operation', () => {
		const missing = inkboxOperations
			.filter((o) => o.response === 'json' && o.output === undefined)
			.map((o) => o.id);
		expect(missing).toEqual([]);
	});

	it('leaves out deprecated, console-only and internal routes, keeping their replacements', () => {
		for (const route of [
			// Deprecated: identities.signingKey.* replaces it.
			'GET /api/v1/signing-keys',
			// Deprecated: identities.mailContactRules.* replaces it.
			'GET /api/v1/mail/mailboxes/{email_address}/contact-rules',
			// A console session only: an API key is refused.
			'GET /api/v1/api-keys',
			'DELETE /api/v1/vault/secrets/{secret_id}',
			// A server-sent event stream.
			'GET /api/v1/identities/{agent_handle}/hosting/chat/conversations/{conversation_id}/events',
			'GET /health',
			// Keyless self-signup: it makes a new organization, before any connection exists.
			'POST /api/v1/agent-signup/',
		]) {
			expect(routes.has(route)).toBe(false);
		}
		expect(
			routes.has('GET /api/v1/identities/{agent_handle}/signing-key'),
		).toBe(true);
		expect(
			routes.has('GET /api/v1/identities/{agent_handle}/mail-contact-rules'),
		).toBe(true);
		expect(routes.has('GET /api/whoami')).toBe(true);
	});

	it('generates an idempotency key for sends, and requires one for lookups by key', () => {
		for (const id of [
			'mail.messages.send',
			'phone.texts.send',
			'notes.create',
		]) {
			expect(properties(id).idempotencyKey?.['x-corsair-header']).toBe(
				'Idempotency-Key',
			);
			expect(properties(id).idempotencyKey?.['x-corsair-generate']).toBe(true);
			expect(
				(operation(id).input.required as string[] | undefined) ?? [],
			).not.toContain('idempotencyKey');
		}
		for (const id of ['messageSends.lookup', 'slack.actions.getByKey']) {
			expect(properties(id).idempotencyKey?.['x-corsair-generate']).toBe(
				undefined,
			);
			expect(operation(id).input.required).toContain('idempotencyKey');
		}
	});

	it('answers bytes for the download routes, whatever the spec says', () => {
		for (const id of [
			'identities.avatar.get',
			'contacts.exportVcard',
			'phone.media.getPlayback',
			'slack.files.download',
			'mail.drafts.getAttachment',
		]) {
			expect(operation(id).response).toBe('file');
		}
		// The JSON link, not a 302 the API key would follow to another host.
		expect(operation('mail.messages.getAttachment').response).toBe('json');
		expect(operation('mail.messages.getAttachment').fixedQuery).toEqual({
			redirect: false,
		});
		expect(
			Object.keys(properties('mail.messages.getAttachment')),
		).not.toContain('redirect');
	});

	it('sends uploads as multipart with a file field, and the vCard import as raw text', () => {
		for (const id of [
			'identities.avatar.upload',
			'imessage.uploadMedia',
			'whatsapp.media.upload',
			'compliance.uploadOptInEvidence',
		]) {
			expect(operation(id).request).toBe('multipart');
			expect(properties(id).file?.format).toBe('binary');
		}
		expect(operation('contacts.import').request).toBe('text');
		expect(operation('contacts.import').bodyMediaType).toBe(
			'text/vcard; charset=utf-8',
		);
		expect(operation('contacts.import').input.required).toContain('vcard');
		expect(
			inkboxInputFields('contacts.import').find(
				(f) => f.name === 'vcardPreviewHash',
			)?.header,
		).toBe('X-VCard-Preview-Hash');
	});

	it('lists one webhook per channel with the event types it carries', () => {
		// Checked before the map below, which would keep only the last of two same ids.
		const webhookIds = inkboxWebhookDefinitions.map((webhook) => webhook.id);
		expect(new Set(webhookIds).size).toBe(webhookIds.length);
		const byId = Object.fromEntries(
			inkboxWebhookDefinitions.map((webhook) => [webhook.id, webhook.events]),
		);
		expect(Object.keys(byId).sort()).toEqual([
			'a2a.taskEvent',
			'imessage.messageEvent',
			'mail.messageEvent',
			'phone.callEnded',
			'phone.textEvent',
			'slack.event',
			'transcriptions.finished',
			'whatsapp.messageEvent',
		]);
		expect(byId['mail.messageEvent']).toContain('message.received');
		expect(byId['phone.textEvent']).toContain('text.received');
		expect(byId['phone.callEnded']).toEqual(['call.ended']);
		expect(byId['slack.event']).toHaveLength(23);
		// No event type goes to two webhooks.
		const all = Object.values(byId).flat();
		expect(new Set(all).size).toBe(all.length);
	});
});

describe('zod schemas', () => {
	it.each(ids)('%s builds its input and output schemas', (id) => {
		expect(getInkboxInputSchema(id)).toBeDefined();
		expect(getInkboxOutputSchema(id)).toBeDefined();
		expect(
			inkboxEndpointSchemas[id as keyof typeof inkboxEndpointSchemas].input,
		).toBe(getInkboxInputSchema(id));
	});

	it.each(inkboxWebhookDefinitions.map((webhook) => webhook.id))(
		'%s builds its webhook payload schema',
		(id) => {
			expect(getInkboxWebhookPayloadSchema(id)).toBeDefined();
		},
	);

	it('exposes a schema for every id through the exported records', () => {
		expect(Object.keys(InkboxEndpointInputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(InkboxEndpointOutputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('requires the mailbox, recipients and subject to send an email', () => {
		const send = getInkboxInputSchema('mail.messages.send');
		expect(
			send.safeParse({
				email_address: 'agent@inkboxmail.com',
				recipients: { to: ['ada@example.com'] },
				subject: 'Hello',
				body_text: 'Hi',
			}).success,
		).toBe(true);
		expect(
			send.safeParse({
				email_address: 'agent@inkboxmail.com',
				subject: 'Hello',
			}).success,
		).toBe(false);
	});

	it('takes only the documented actions and match types for a contact rule', () => {
		const create = getInkboxInputSchema('identities.mailContactRules.create');
		expect(
			create.safeParse({
				agent_handle: 'support',
				action: 'block',
				match_type: 'domain',
				match_target: 'example.com',
			}).success,
		).toBe(true);
		expect(
			create.safeParse({
				agent_handle: 'support',
				action: 'quarantine',
				match_type: 'domain',
				match_target: 'example.com',
			}).success,
		).toBe(false);
	});

	it("applies the spec's patterns and limits to what a caller sends", () => {
		const importCards = getInkboxInputSchema('contacts.import');
		expect(
			importCards.safeParse({
				vcard: 'BEGIN:VCARD',
				vcardPreviewHash: 'f'.repeat(64),
			}).success,
		).toBe(true);
		expect(
			importCards.safeParse({
				vcard: 'BEGIN:VCARD',
				vcardPreviewHash: 'not-a-hash',
			}).success,
		).toBe(false);
		expect(importCards.safeParse({ vcard: '' }).success).toBe(false);
	});

	it('takes a file as a URL, base64 or a Blob for an upload', () => {
		const upload = getInkboxInputSchema('identities.avatar.upload');
		expect(
			upload.safeParse({
				agent_handle: 'support',
				file: { url: 'https://example.com/a.png' },
			}).success,
		).toBe(true);
		expect(
			upload.safeParse({
				agent_handle: 'support',
				file: { base64: 'iVBORw0KGgo=', filename: 'a.png' },
			}).success,
		).toBe(true);
		expect(
			upload.safeParse({ agent_handle: 'support', file: new Blob(['x']) })
				.success,
		).toBe(true);
		expect(upload.safeParse({ agent_handle: 'support' }).success).toBe(false);
	});

	it('refuses extra keys in an object the spec closes', () => {
		const quote = getInkboxInputSchema('billing.identityPacks.quote');
		expect(quote.safeParse({}).success).toBe(true);
		expect(quote.safeParse({ seats: 3 }).success).toBe(false);
	});

	it('reads integer response fields as integers, and fails a malformed list', () => {
		const imported = getInkboxOutputSchema('contacts.import');
		expect(
			imported.safeParse({ created_count: 1, error_count: 0, results: [] })
				.success,
		).toBe(true);
		expect(
			imported.safeParse({ created_count: 1.5, error_count: 0, results: [] })
				.success,
		).toBe(false);
		const list = getInkboxOutputSchema('mail.messages.list');
		expect(
			list.safeParse({ items: [], next_cursor: null, has_more: false }).success,
		).toBe(true);
		expect(list.safeParse({ items: 'nope' }).success).toBe(false);
		expect(
			getInkboxOutputSchema('identities.list').safeParse(null).success,
		).toBe(false);
	});

	it('keeps response fields Inkbox adds later, and takes open enums in responses', () => {
		const identity = getInkboxOutputSchema('identities.get');
		const parsed = identity.safeParse({
			id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
			agent_handle: 'support',
			mail_filter_mode: 'some-new-mode',
			brand_new_field: true,
		});
		expect(parsed.success).toBe(true);
		// `unknown` because a parsed response keeps unknown fields of any type.
		expect((parsed.data as Record<string, unknown>).brand_new_field).toBe(true);
	});

	it('refuses unknown keys on routes without a body, and next to a raw text body', () => {
		expect(
			getInkboxInputSchema('identities.get').safeParse({
				agent_handle: 'support',
				handle: 'support',
			}).success,
		).toBe(false);
		// An extra key next to `vcard` could otherwise be sent in its place.
		expect(
			getInkboxInputSchema('contacts.import').safeParse({
				vcard: 'BEGIN:VCARD',
				'0': 'not the card',
			}).success,
		).toBe(false);
	});

	it('takes only its own event types in a webhook payload', () => {
		const mail = getInkboxWebhookPayloadSchema('mail.messageEvent');
		const event = {
			id: 'evt_1',
			event_type: 'message.received',
			timestamp: '2026-11-23T12:00:00Z',
			data: {},
		};
		expect(mail.safeParse(event).success).toBe(true);
		expect(mail.safeParse({ ...event, event_type: 'call.ended' }).success).toBe(
			false,
		);
		expect(
			getInkboxWebhookPayloadSchema('phone.callEnded').safeParse({
				...event,
				event_type: 'call.ended',
			}).success,
		).toBe(true);
	});
});

describe('Inkbox schema', () => {
	it('stores no entities', () => {
		expect(InkboxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(InkboxSchema.entities).toEqual({});
	});
});
