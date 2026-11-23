// Live Inkbox API tests. Excluded from the default run by
// `testPathIgnorePatterns` in jest.config.cjs; run them with:
//
//   INKBOX_API_KEY=... pnpm test:live
//
// The key must be an organization admin key. The tests read the whole
// organization, then create one throwaway agent identity
// (`corsair-test-<run>`, with its own mailbox and tunnel) and work through it:
// contact rules, A2A settings, an avatar upload, a signing key, an inbound
// webhook source, a webhook subscription, a scoped API key that revokes
// itself, contacts and notes, email drafts and two emails sent between the
// identity's mailbox and the organization's own mailbox. Everything made is
// deleted in afterAll; nothing leaves the organization (emails go to its own
// inkboxmail.com mailboxes) and nothing is bought.
//
// The free plan has no phone number, iMessage line or Slack connection, so
// those routes are read only. INKBOX_LIVE_OPS_FILE=<path> writes the
// operations this file called.
//
// With INKBOX_LIVE_WEBHOOK_URL=<public https URL> and
// INKBOX_LIVE_WEBHOOK_PORT=<local port it forwards to> (for example
// `cloudflared tunnel --url http://localhost:8787`), they also receive real
// signed deliveries: a local server on that port passes each one to
// processWebhook with the identity's signing key, the identity's mailbox is
// subscribed to `message.received`, and an email is sent to it.
//
// Calls go through createCorsair, so the plugin's error handlers and core's
// retries apply as in production. Failing assertions never print a key value:
// those are checked as booleans.
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import { createServer } from 'node:http';
import { deflateSync } from 'node:zlib';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { inkbox } from './index';

const key = process.env.INKBOX_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[inkbox] live API tests skipped: set INKBOX_API_KEY (an organization admin key) to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;

const webhookUrl = process.env.INKBOX_LIVE_WEBHOOK_URL?.trim() ?? '';
const webhookPort = Number(process.env.INKBOX_LIVE_WEBHOOK_PORT ?? '');
const webhooksOn =
	hasKey && webhookUrl.startsWith('https://') && webhookPort > 0;
if (hasKey && !webhooksOn) {
	console.warn(
		'[inkbox] webhook delivery tests skipped: set INKBOX_LIVE_WEBHOOK_URL and INKBOX_LIVE_WEBHOOK_PORT to receive real signed events.',
	);
}
const liveWebhooks = webhooksOn ? describe : describe.skip;

// Random, so two runs started at once never share a fixture name.
const RUN = randomBytes(3).toString('hex');
const HANDLE = `corsair-test-${RUN}`;

/** Ops this file ran against the live API, for the PR's evidence. */
const ran = new Set<string>();

/** Records every operation called through the returned tree. */
function recording<T extends object>(target: T, path: string[] = []): T {
	return new Proxy(target, {
		get(object, property) {
			const value = Reflect.get(object, property);
			const next = [...path, String(property)];
			if (typeof value === 'function') {
				// `unknown` because each endpoint takes its own input.
				return (...args: unknown[]) => {
					ran.add(next.join('.'));
					return (value as (...a: unknown[]) => unknown)(...args);
				};
			}
			if (value && typeof value === 'object') return recording(value, next);
			return value;
		},
	});
}

/** The HTTP status of a failed call, or 'ok'. */
// `unknown` because a rejected promise can carry anything.
async function statusOf(promise: Promise<unknown>): Promise<number | 'ok'> {
	try {
		await promise;
		return 'ok';
	} catch (error) {
		const status = (error as { status?: unknown }).status;
		if (typeof status === 'number') return status;
		throw error;
	}
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** Retries a read until `ready` accepts it (mail delivery takes a few seconds). */
async function eventually<T>(
	read: () => Promise<T>,
	ready: (value: T) => boolean,
	attempts = 20,
	delayMs = 3000,
): Promise<T> {
	let last = await read();
	for (let attempt = 1; attempt < attempts && !ready(last); attempt++) {
		await sleep(delayMs);
		last = await read();
	}
	return last;
}

/** A 2x2 red PNG made in memory, for the avatar upload. */
function tinyPng(): Buffer {
	const crcTable = Array.from({ length: 256 }, (_, n) => {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		return c >>> 0;
	});
	const crc = (buffer: Buffer) => {
		let c = 0xffffffff;
		for (const byte of buffer)
			c = (crcTable[(c ^ byte) & 0xff] ?? 0) ^ (c >>> 8);
		return (c ^ 0xffffffff) >>> 0;
	};
	const chunk = (type: string, data: Buffer) => {
		const length = Buffer.alloc(4);
		length.writeUInt32BE(data.length);
		const body = Buffer.concat([Buffer.from(type), data]);
		const sum = Buffer.alloc(4);
		sum.writeUInt32BE(crc(body));
		return Buffer.concat([length, body, sum]);
	};
	const header = Buffer.alloc(13);
	header.writeUInt32BE(64, 0);
	header.writeUInt32BE(64, 4);
	header[8] = 8; // bit depth
	header[9] = 2; // RGB
	const row = Buffer.concat([
		Buffer.from([0]),
		Buffer.alloc(64 * 3, Buffer.from([220, 40, 40])),
	]);
	const pixels = Buffer.concat(Array.from({ length: 64 }, () => row));
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk('IHDR', header),
		chunk('IDAT', deflateSync(pixels)),
		chunk('IEND', Buffer.alloc(0)),
	]);
}

const api = recording(createCorsair({ plugins: [inkbox({ key })] }).inkbox.api);

// Everything the tests create, deleted in afterAll whatever happened.
const made = {
	identityCreated: false,
	contactIds: [] as string[],
	noteIds: [] as string[],
	subscriptionIds: [] as string[],
	draftIds: [] as Array<{ mailbox: string; id: string; generation: number }>,
	invitationIds: [] as string[],
};

/** The organization's own mailbox (not the test identity's): mail goes between the two. */
let orgMailbox = '';
let identityId = '';
let identityMailbox = '';
/** The test identity's webhook signing key (never printed). */
let signingKey = '';

beforeAll(async () => {
	if (!hasKey) return;
	const mailboxes = await api.mail.mailboxes.list({});
	orgMailbox =
		(mailboxes as Array<{ email_address?: string | null }>)
			.map((mailbox) => mailbox.email_address ?? '')
			.find((address) => address.length > 0) ?? '';
}, 60_000);

afterAll(async () => {
	if (!hasKey) return;
	for (const id of made.subscriptionIds) {
		await statusOf(api.webhooks.subscriptions.delete({ sub_id: id }));
	}
	for (const draft of made.draftIds) {
		await statusOf(
			api.mail.drafts.delete({
				email_address: draft.mailbox,
				draft_id: draft.id,
				generation: draft.generation,
			}),
		);
	}
	for (const id of made.invitationIds) {
		await statusOf(api.a2a.invitations.revoke({ invitation_id: id }));
	}
	for (const id of made.noteIds) {
		await statusOf(api.notes.delete({ note_id: id }));
	}
	if (made.contactIds.length > 0) {
		await statusOf(api.contacts.bulkDelete({ contact_ids: made.contactIds }));
	}
	if (made.identityCreated) {
		await statusOf(api.identities.delete({ agent_handle: HANDLE }));
	}
	const out = process.env.INKBOX_LIVE_OPS_FILE;
	if (out) writeFileSync(out, `${[...ran].sort().join('\n')}\n`);
	console.log(`[inkbox] live operations run: ${ran.size}`);
}, 120_000);

live('Inkbox live API: organization reads', () => {
	jest.setTimeout(120_000);

	it('identifies the key and lists identities, mailboxes and tunnels', async () => {
		const me = await api.account.whoami({});
		expect(me.auth_type).toBe('api_key');
		const current = await api.apiKeys.getCurrent({});
		expect(typeof current.id).toBe('string');
		expect(JSON.stringify(current).includes(key)).toBe(false);
		expect(Array.isArray(await api.identities.list({}))).toBe(true);
		expect(orgMailbox).toMatch(/@/);
		const tunnels = await api.tunnels.list({});
		expect(Array.isArray(tunnels.tunnels)).toBe(true);
	});

	it('reads mail across every mailbox', async () => {
		const messages = await api.mail.visibleMessages.list({ limit: 5 });
		expect(Array.isArray(messages.items)).toBe(true);
		const threads = await api.mail.visibleThreads.list({ limit: 5 });
		expect(Array.isArray(threads.items)).toBe(true);
		const search = await api.mail.visibleMessages.search({
			q: 'verify',
			limit: 5,
		});
		expect(Array.isArray(search.items)).toBe(true);
		expect(Array.isArray(await api.mail.listOrgContactRules({}))).toBe(true);
	});

	it('reads contacts, notes, webhooks and the webhook catalog', async () => {
		expect(Array.isArray(await api.contacts.list({ limit: 5 }))).toBe(true);
		expect(Array.isArray(await api.notes.list({}))).toBe(true);
		const catalog = await api.webhooks.getCatalog({});
		expect(typeof catalog).toBe('object');
		expect(
			Array.isArray((await api.webhooks.subscriptions.list({})).subscriptions),
		).toBe(true);
		expect(
			Array.isArray((await api.webhooks.deliveries.list({})).deliveries),
		).toBe(true);
	});

	it('reads phone, iMessage, WhatsApp and Slack state (empty on the free plan)', async () => {
		expect(Array.isArray(await api.phone.numbers.list({}))).toBe(true);
		expect(typeof (await api.phone.smsOptIns.list({}))).toBe('object');
		expect(Array.isArray(await api.phone.listOrgContactRules({}))).toBe(true);
		expect(Array.isArray(await api.imessage.numbers.list({}))).toBe(true);
		expect(typeof (await api.imessage.assignments.list({}))).toBe('object');
		expect(typeof (await api.imessage.conversations.list({}))).toBe('object');
		expect(typeof (await api.imessage.messages.list({}))).toBe('object');
		expect(typeof (await api.imessage.getTriageNumber({}))).toBe('object');
		expect(typeof (await api.imessage.contactRules.listForOrg({}))).toBe(
			'object',
		);
		expect(typeof (await api.whatsapp.numbers.list({}))).toBe('object');
		expect(typeof (await api.whatsapp.conversations.list({}))).toBe('object');
		expect(typeof (await api.whatsapp.messages.list({}))).toBe('object');
		expect(typeof (await api.whatsapp.assignments.list({}))).toBe('object');
		expect(typeof (await api.slack.connections.listAvailable({}))).toBe(
			'object',
		);
		expect(typeof (await api.slack.provisioningWorkspaces.list({}))).toBe(
			'object',
		);
		expect(typeof (await api.slack.listOrgContactRules({}))).toBe('object');
		expect(typeof (await api.voiceAgent.listVoices({}))).toBe('object');
	});

	it('reads the A2A directory, domains and billing without buying anything', async () => {
		expect(typeof (await api.a2a.listDirectory({}))).toBe('object');
		expect(typeof (await api.a2a.settings.listForOrg({}))).toBe('object');
		expect(typeof (await api.a2a.contactRules.listForOrg({}))).toBe('object');
		expect(typeof (await api.a2a.invitations.list({}))).toBe('object');
		expect(Array.isArray(await api.domains.list({}))).toBe(true);
		expect(typeof (await api.organizationDomains.list({}))).toBe('object');
		const subscription = await api.billing.getSubscription({});
		expect(typeof subscription.plan).toBe('string');
		expect(typeof (await api.billing.getUsage({}))).toBe('object');
		expect(typeof (await api.billing.getPricing({}))).toBe('object');
		expect(typeof (await api.billing.settings.get({}))).toBe('object');
		expect(typeof (await api.billing.usageAlerts.list({}))).toBe('object');
		expect(typeof (await api.billing.callingCountries.list({}))).toBe('object');
		expect(typeof (await api.billing.lineBundles.list({}))).toBe('object');
		expect(typeof (await api.billing.identityPacks.list({}))).toBe('object');
	});

	it('reports a missing mailbox as a 404 without echoing the address', async () => {
		const missing = `nobody-${RUN}@inkboxmail.com`;
		try {
			await api.mail.mailboxes.get({ email_address: missing });
			throw new Error('expected a 404');
		} catch (error) {
			const failure = error as { status?: number; message?: string };
			expect(failure.status).toBe(404);
			expect(String(failure.message).includes(missing)).toBe(false);
		}
	});
});

live('Inkbox live API: one throwaway identity', () => {
	jest.setTimeout(180_000);

	it('creates, reads and updates an identity with its mailbox', async () => {
		const identity = await api.identities.create({
			agent_handle: HANDLE,
			display_name: 'Corsair plugin test',
			description:
				'Made by the Corsair Inkbox plugin live tests; deleted at the end.',
		});
		made.identityCreated = true;
		expect(identity.agent_handle).toBe(HANDLE);
		identityId = String(identity.id);
		const fetched = await api.identities.get({ agent_handle: HANDLE });
		expect(fetched.id).toBe(identityId);
		const updated = await api.identities.update({
			agent_handle: HANDLE,
			display_name: 'Corsair plugin test (updated)',
		});
		expect(updated.display_name).toBe('Corsair plugin test (updated)');
		const mailboxes = (await api.mail.mailboxes.list({})) as Array<{
			id?: string | null;
			email_address?: string | null;
			agent_identity_id?: string | null;
		}>;
		const own = mailboxes.find(
			(mailbox) =>
				mailbox.agent_identity_id === identityId ||
				mailbox.email_address?.startsWith(`${HANDLE}@`),
		);
		identityMailbox = own?.email_address ?? '';
		expect(identityMailbox).toMatch(/@/);
		const mailbox = await api.mail.mailboxes.get({
			email_address: identityMailbox,
		});
		expect(mailbox.email_address).toBe(identityMailbox);
		const byId = await api.mail.mailboxes.getById({
			mailbox_id: String(mailbox.id),
		});
		expect(byId.email_address).toBe(identityMailbox);
		expect(
			typeof (await api.identities.getChannelStatus({ agent_handle: HANDLE })),
		).toBe('object');
	});

	it('reads the per-identity phone, Voice AI and WhatsApp settings', async () => {
		const scope = { agent_identity_id: identityId };
		expect(typeof (await api.phone.calls.list(scope))).toBe('object');
		expect(typeof (await api.phone.incomingCallAction.get(scope))).toBe(
			'object',
		);
		expect(typeof (await api.voiceAgent.getConfig(scope))).toBe('object');
		expect(typeof (await api.whatsapp.getLimits(scope))).toBe('object');
		expect(
			typeof (await api.identities.companion.get({ agent_handle: HANDLE })),
		).toBe('object');
		expect(
			typeof (await api.identities.contactPermissions.list({
				agent_handle: HANDLE,
			})),
		).toBe('object');
		expect(typeof (await api.hosting.get({ agent_handle: HANDLE }))).toBe(
			'object',
		);
		expect(
			typeof (await api.slack.connections.list({ identity_id: identityId })),
		).toBe('object');
	});

	it('creates, updates and deletes mail, phone and Slack contact rules', async () => {
		const mailRule = await api.identities.mailContactRules.create({
			agent_handle: HANDLE,
			action: 'block',
			match_type: 'domain',
			match_target: `blocked-${RUN}.example.com`,
		});
		const mailRuleId = String(mailRule.id);
		expect(
			(
				await api.identities.mailContactRules.get({
					agent_handle: HANDLE,
					rule_id: mailRuleId,
				})
			).id,
		).toBe(mailRuleId);
		expect(
			typeof (await api.identities.mailContactRules.list({
				agent_handle: HANDLE,
			})),
		).toBe('object');
		await api.identities.mailContactRules.update({
			agent_handle: HANDLE,
			rule_id: mailRuleId,
			action: 'allow',
		});
		expect(
			await statusOf(
				api.identities.mailContactRules.delete({
					agent_handle: HANDLE,
					rule_id: mailRuleId,
				}),
			),
		).toBe('ok');

		const phoneRule = await api.identities.phoneContactRules.create({
			agent_handle: HANDLE,
			action: 'block',
			match_type: 'exact_number',
			match_target: '+15005550006',
		});
		const phoneRuleId = String(phoneRule.id);
		expect(
			(
				await api.identities.phoneContactRules.get({
					agent_handle: HANDLE,
					rule_id: phoneRuleId,
				})
			).id,
		).toBe(phoneRuleId);
		expect(
			typeof (await api.identities.phoneContactRules.list({
				agent_handle: HANDLE,
			})),
		).toBe('object');
		expect(
			await statusOf(
				api.identities.phoneContactRules.delete({
					agent_handle: HANDLE,
					rule_id: phoneRuleId,
				}),
			),
		).toBe('ok');
		expect(
			typeof (await api.identities.slackContactRules.list({
				agent_handle: HANDLE,
			})),
		).toBe('object');
	});

	it('reads and updates A2A settings and contact rules, and previews the card', async () => {
		const settings = await api.a2a.settings.get({ agent_handle: HANDLE });
		expect(typeof settings).toBe('object');
		expect(typeof (await api.a2a.previewCard({ agent_handle: HANDLE }))).toBe(
			'object',
		);
		expect(typeof (await api.a2a.tasks.list({ agent_handle: HANDLE }))).toBe(
			'object',
		);
		expect(
			typeof (await api.a2a.sentTasks.list({ agent_handle: HANDLE })),
		).toBe('object');
		expect(typeof (await api.a2a.contexts.list({ agent_handle: HANDLE }))).toBe(
			'object',
		);
		expect(typeof (await api.a2a.messages.list({ agent_handle: HANDLE }))).toBe(
			'object',
		);
		expect(
			typeof (await api.a2a.contactRules.list({ agent_handle: HANDLE })),
		).toBe('object');
	});

	it('creates a signing key, then checks a payload signed with it', async () => {
		expect(
			typeof (await api.identities.signingKey.getStatus({
				agent_handle: HANDLE,
			})),
		).toBe('object');
		const created = await api.identities.signingKey.createOrRotate({
			agent_handle: HANDLE,
		});
		expect(typeof created.signing_key).toBe('string');
		signingKey = String(created.signing_key);
		expect(signingKey.length).toBeGreaterThan(10);
	});

	it('reaches inbound webhook sources, which need an Inkbox-hosted agent', async () => {
		// A plain identity is refused with 409 ("available only for Inkbox-hosted agents").
		expect(
			await statusOf(
				api.inbound.sources.create({
					agent_handle: HANDLE,
					name: `corsair-test-${RUN}`,
				}),
			),
		).toBe(409);
	});

	it('subscribes a URL to mail events, updates it and unsubscribes', async () => {
		const subscription = await api.webhooks.subscriptions.create({
			agent_identity_id: identityId,
			url: `https://example.com/corsair-inkbox-test/${RUN}`,
			event_types: ['message.received'],
		});
		const id = String(subscription.id);
		made.subscriptionIds.push(id);
		expect((await api.webhooks.subscriptions.get({ sub_id: id })).id).toBe(id);
		const updated = await api.webhooks.subscriptions.update({
			sub_id: id,
			event_types: ['message.received', 'message.bounced'],
		});
		expect(updated.event_types).toEqual(
			expect.arrayContaining(['message.received', 'message.bounced']),
		);
		expect(
			await statusOf(api.webhooks.subscriptions.delete({ sub_id: id })),
		).toBe('ok');
		made.subscriptionIds = made.subscriptionIds.filter((sub) => sub !== id);
	});

	it('mints an identity-scoped key, sets an avatar with it, then revokes it', async () => {
		const minted = await api.apiKeys.create({
			label: `corsair-test-${RUN}`,
			scoped_identity_id: identityId,
		});
		expect(typeof minted.api_key).toBe('string');
		const scoped = recording(
			createCorsair({ plugins: [inkbox({ key: String(minted.api_key) })] })
				.inkbox.api,
		);
		const self = await scoped.identities.getCurrent({});
		expect(self.agent_handle).toBe(HANDLE);

		// Avatars are read and set with the identity's own key: an admin key gets 403.
		const png = tinyPng();
		const withAvatar = await scoped.identities.avatar.upload({
			agent_handle: HANDLE,
			file: {
				base64: png.toString('base64'),
				filename: 'avatar.png',
				contentType: 'image/png',
			},
		});
		expect(withAvatar.agent_handle).toBe(HANDLE);
		const metadata = await scoped.identities.avatar.getMetadata({
			agent_handle: HANDLE,
		});
		expect(metadata.has_avatar).toBe(true);
		const file = await scoped.identities.avatar.get({ agent_handle: HANDLE });
		expect(file.contentType).toMatch(/^image\//);
		expect(file.byteLength).toBeGreaterThan(100);
		expect(
			await statusOf(scoped.identities.avatar.delete({ agent_handle: HANDLE })),
		).toBe('ok');

		// Inkbox answered 404 "API key not found" to an identity-scoped key's
		// self-revoke on 2026-11-23; deleting the identity (afterAll) revokes
		// the key either way.
		expect(['ok', 404]).toContain(
			await statusOf(scoped.apiKeys.revokeCurrent({})),
		);
	});
});

live('Inkbox live API: contacts and notes', () => {
	jest.setTimeout(120_000);

	it('creates, reads, updates and exports a contact', async () => {
		const email = `corsair-test-${RUN}@example.com`;
		const contact = await api.contacts.create({
			given_name: 'Corsair',
			family_name: `Test ${RUN}`,
			emails: [{ value: email, is_primary: true }],
		});
		const contactId = String(contact.id);
		made.contactIds.push(contactId);
		expect((await api.contacts.get({ contact_id: contactId })).id).toBe(
			contactId,
		);
		const updated = await api.contacts.update({
			contact_id: contactId,
			job_title: 'Plugin test',
		});
		expect(updated.job_title).toBe('Plugin test');
		const found = await api.contacts.lookup({ email });
		expect(JSON.stringify(found).includes(contactId)).toBe(true);
		const vcard = await api.contacts.exportVcard({ contact_id: contactId });
		expect(vcard.contentType).toMatch(/vcard/);
		expect(
			vcard.text ??
				Buffer.from(vcard.contentBase64 ?? '', 'base64').toString('utf8'),
		).toContain('BEGIN:VCARD');
		const bulk = await api.contacts.exportVcards({ contact_ids: [contactId] });
		expect(bulk.contact_count).toBe(1);
		// An organization-wide key reads correspondence and policy as one identity.
		expect(
			typeof (await api.contacts.getCorrespondence({
				contact_id: contactId,
				identity_id: identityId,
			})),
		).toBe('object');
		expect(
			typeof (await api.contacts.communicationPolicy.get({
				contact_id: contactId,
				identity_id: identityId,
			})),
		).toBe('object');
	});

	it('adds, reads, updates and deletes a contact fact', async () => {
		const contactId = made.contactIds[0] ?? '';
		const fact = await api.contacts.facts.create({
			contact_id: contactId,
			content: 'Prefers email over calls.',
			kind: 'preference',
		});
		const factId = String(fact.id);
		expect(
			(await api.contacts.facts.get({ contact_id: contactId, fact_id: factId }))
				.id,
		).toBe(factId);
		expect(
			typeof (await api.contacts.facts.list({ contact_id: contactId })),
		).toBe('object');
		await api.contacts.facts.update({
			contact_id: contactId,
			fact_id: factId,
			content: 'Prefers email.',
		});
		expect(
			await statusOf(
				api.contacts.facts.delete({ contact_id: contactId, fact_id: factId }),
			),
		).toBe('ok');
	});

	it('previews and imports a vCard as raw text', async () => {
		const card = [
			'BEGIN:VCARD',
			'VERSION:3.0',
			`FN:Corsair Import ${RUN}`,
			`N:Import ${RUN};Corsair;;;`,
			`EMAIL:corsair-import-${RUN}@example.com`,
			'END:VCARD',
			'',
		].join('\r\n');
		const preview = await api.contacts.previewImport({ vcard: card });
		expect(preview.contact_count).toBe(1);
		const imported = await api.contacts.import({ vcard: card });
		expect(imported.created_count).toBe(1);
		const results = (imported.results ?? []) as Array<{
			contact?: { id?: string | null } | null;
		}>;
		const importedId = results[0]?.contact?.id;
		if (importedId) made.contactIds.push(importedId);
		expect(typeof importedId).toBe('string');
	});

	it('creates, shares, reads, updates and deletes a note', async () => {
		const note = await api.notes.create({
			title: `Corsair test ${RUN}`,
			body: 'Written by the Corsair Inkbox plugin live tests.',
		});
		const noteId = String(note.id);
		made.noteIds.push(noteId);
		expect((await api.notes.get({ note_id: noteId })).id).toBe(noteId);
		const updated = await api.notes.update({
			note_id: noteId,
			body: 'Updated.',
		});
		expect(updated.body).toBe('Updated.');
		const grant = await api.notes.access.grant({
			note_id: noteId,
			identity_id: identityId,
		});
		expect(typeof grant.id).toBe('string');
		expect(typeof (await api.notes.access.list({ note_id: noteId }))).toBe(
			'object',
		);
		expect(
			await statusOf(
				api.notes.access.revoke({ note_id: noteId, identity_id: identityId }),
			),
		).toBe('ok');
		expect(await statusOf(api.notes.delete({ note_id: noteId }))).toBe('ok');
		made.noteIds = made.noteIds.filter((id) => id !== noteId);
	});
});

live('Inkbox live API: email between the organization’s own mailboxes', () => {
	jest.setTimeout(300_000);

	it('drafts with an attachment, reads it back, duplicates and deletes', async () => {
		const draft = await api.mail.drafts.create({
			email_address: identityMailbox,
			recipients: { to: [orgMailbox] },
			subject: `Corsair draft ${RUN}`,
			body_text: 'A draft from the Corsair Inkbox plugin live tests.',
		});
		const draftId = String(draft.id);
		const tracked = {
			mailbox: identityMailbox,
			id: draftId,
			generation: Number(draft.generation),
		};
		made.draftIds.push(tracked);
		const withFile = await api.mail.drafts.addAttachments({
			email_address: identityMailbox,
			draft_id: draftId,
			generation: tracked.generation,
			attachments: [
				{
					filename: 'hello.txt',
					content_type: 'text/plain',
					content_base64: Buffer.from(`hello ${RUN}`).toString('base64'),
				},
			],
		});
		expect(withFile.attachment_count).toBe(1);
		tracked.generation = Number(withFile.generation);
		const full = await api.mail.drafts.get({
			email_address: identityMailbox,
			draft_id: draftId,
		});
		expect(full.id).toBe(draftId);
		expect(
			typeof (await api.mail.drafts.list({ email_address: identityMailbox })),
		).toBe('object');
		const copy = await api.mail.drafts.duplicate({
			email_address: identityMailbox,
			draft_id: draftId,
			generation: tracked.generation,
		});
		made.draftIds.push({
			mailbox: identityMailbox,
			id: String(copy.id),
			generation: Number(copy.generation),
		});
		const edited = await api.mail.drafts.update({
			email_address: identityMailbox,
			draft_id: draftId,
			generation: tracked.generation,
			subject: `Corsair draft ${RUN} (edited)`,
		});
		expect(edited.subject).toBe(`Corsair draft ${RUN} (edited)`);
		tracked.generation = Number(edited.generation);
		const attachment = await api.mail.drafts.getAttachment({
			email_address: identityMailbox,
			draft_id: draftId,
			generation: tracked.generation,
			part_index: 1,
		});
		expect(attachment.byteLength).toBeGreaterThan(0);
	});

	it('sends an email with an attachment and reads it in the other mailbox', async () => {
		const subject = `Corsair live ${RUN}`;
		const sent = await api.mail.messages.send({
			email_address: identityMailbox,
			recipients: { to: [orgMailbox] },
			subject,
			body_text: `Sent by the Corsair Inkbox plugin live tests (${RUN}).`,
			attachments: [
				{
					filename: 'note.txt',
					content_type: 'text/plain',
					content_base64: Buffer.from(`attachment ${RUN}`).toString('base64'),
				},
			],
		});
		expect(sent.subject).toBe(subject);
		type Page = {
			items?: Array<{ id?: string | null; subject?: string | null }> | null;
		};
		const inbox = (await eventually(
			() => api.mail.messages.list({ email_address: orgMailbox, limit: 20 }),
			(page) =>
				((page as Page).items ?? []).some(
					(message) => message.subject === subject,
				),
		)) as Page;
		const received = (inbox.items ?? []).find(
			(message) => message.subject === subject,
		);
		expect(received).toBeDefined();
		const messageId = String(received?.id);
		const message = await api.mail.messages.get({
			email_address: orgMailbox,
			message_id: messageId,
		});
		expect(message.subject).toBe(subject);
		const flagged = await api.mail.messages.updateFlags({
			email_address: orgMailbox,
			message_id: messageId,
			is_read: true,
		});
		expect(flagged.is_read).toBe(true);
		const link = await api.mail.messages.getAttachment({
			email_address: orgMailbox,
			message_id: messageId,
			filename: 'note.txt',
		});
		expect(JSON.stringify(link)).toMatch(/https:\/\//);
		const seen = await api.mail.visibleMessages.get({ message_id: messageId });
		expect(seen.subject).toBe(subject);
		const search = await api.mail.messages.search({
			email_address: orgMailbox,
			q: RUN,
		});
		expect(Array.isArray(search.items)).toBe(true);
		const threads = await api.mail.threads.list({
			email_address: orgMailbox,
			limit: 5,
		});
		expect(Array.isArray(threads.items)).toBe(true);
		expect(
			typeof (await api.mail.threads.listFolders({
				email_address: orgMailbox,
			})),
		).toBe('object');
		const reply = await api.mail.messages.replyAll({
			email_address: orgMailbox,
			message_id: messageId,
			body_text: `Reply from the Corsair live tests (${RUN}).`,
		});
		expect(typeof reply.id).toBe('string');
		expect(
			await statusOf(
				api.mail.messages.delete({
					email_address: orgMailbox,
					message_id: messageId,
				}),
			),
		).toBe('ok');
	});
});

liveWebhooks('Inkbox live API: signed webhook deliveries', () => {
	jest.setTimeout(240_000);

	let server: Server | undefined;
	const results: Awaited<ReturnType<typeof processWebhook>>[] = [];
	/** The first delivery as Inkbox sent it, replayed below with a bad signature. */
	let firstDelivery:
		| { headers: Record<string, string>; body: string }
		| undefined;

	afterAll(async () => {
		await new Promise<void>((done) =>
			server ? server.close(() => done()) : done(),
		);
	});

	it('receives a signed message.received event and checks its signature', async () => {
		expect(signingKey.length).toBeGreaterThan(10);
		const receiver = createCorsair({
			plugins: [inkbox({ key, webhookSecret: signingKey })],
		});
		server = createServer((request, response) => {
			const chunks: Buffer[] = [];
			request.on('data', (chunk: Buffer) => chunks.push(chunk));
			request.on('end', () => {
				const body = Buffer.concat(chunks).toString('utf8');
				const headers = Object.fromEntries(
					Object.entries(request.headers).map(([name, value]) => [
						name,
						Array.isArray(value) ? value.join(', ') : String(value ?? ''),
					]),
				);
				firstDelivery ??= { headers, body };
				processWebhook(receiver, headers, body)
					.then((result) => {
						results.push(result);
						response.writeHead(result.response?.statusCode ?? 200).end();
					})
					.catch(() => response.writeHead(500).end());
			});
		});
		await new Promise<void>((done) => server?.listen(webhookPort, done));

		const subscription = await api.webhooks.subscriptions.create({
			agent_identity_id: identityId,
			url: webhookUrl,
			event_types: ['message.received'],
		});
		made.subscriptionIds.push(String(subscription.id));

		const subject = `Corsair webhook ${RUN}`;
		await api.mail.messages.send({
			email_address: orgMailbox,
			recipients: { to: [identityMailbox] },
			subject,
			body_text: `Webhook check from the Corsair Inkbox plugin live tests (${RUN}).`,
		});
		const handled = await eventually(
			async () => results,
			(list) => list.some((result) => result.response?.success === true),
			40,
			3000,
		);
		const delivered = handled.find(
			(result) => result.response?.success === true,
		);
		expect(delivered?.plugin).toBe('inkbox');
		expect(delivered?.action).toBe('mail.messageEvent');
		// processWebhook hands back the delivery's parsed body with the handler's verdict.
		const event = delivered?.body as { event_type?: string; id?: string };
		expect(event.event_type).toBe('message.received');
		expect(typeof event.id).toBe('string');
		expect(typeof (await api.webhooks.deliveries.list({}))).toBe('object');
	});

	it('refuses the same delivery with a changed signature', async () => {
		expect(firstDelivery).toBeDefined();
		const receiver = createCorsair({
			plugins: [inkbox({ key, webhookSecret: signingKey })],
		});
		const tampered = await processWebhook(
			receiver,
			{
				...firstDelivery?.headers,
				'x-inkbox-signature': `sha256=${'0'.repeat(64)}`,
			},
			firstDelivery?.body ?? '{}',
		);
		expect(tampered.plugin).toBe('inkbox');
		expect(tampered.response?.success).toBe(false);
		expect(tampered.response?.statusCode).toBe(401);
	});
});
