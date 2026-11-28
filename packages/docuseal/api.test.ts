import { createHmac } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import {
	LIVE_DOCX_BASE64,
	LIVE_PDF_BASE64,
} from './__fixtures__/live-documents';
import { docuseal } from './index';
import {
	docuSealWebhooksNested,
	verifyDocuSealWebhook,
	webhookIdFor,
} from './webhooks';

/**
 * Live suite: every one of the 23 operations against a real DocuSeal.
 *
 *   DOCUSEAL_API_KEY=...                 the API key (Settings > API)
 *   DOCUSEAL_BASE_URL=http://host:3000   optional: EU cloud or a self-hosted site
 *   DOCUSEAL_LIVE_LOG=/path/run.jsonl    optional: one JSON line per step
 *   DOCUSEAL_HOOKS_URL=http://...        optional: a listener that answers GET
 *                                        with the deliveries it received, one
 *                                        JSON line each ({headers, body});
 *                                        DOCUSEAL_WEBHOOK_SECRET checks them
 *   DOCUSEAL_TEMPLATE_ID=1               optional: a template with a "Signer"
 *                                        role, for a community (open-source)
 *                                        self-hosted install
 *
 * The open-source self-hosted build has no routes for the Pro operations
 * (templates from HTML/PDF/DOCX, merge, updateDocuments, one-off
 * submissions from PDF/HTML/DOCX): with DOCUSEAL_TEMPLATE_ID set, a 404 from
 * one of them is recorded as expected and the suite goes on with that
 * template. DocuSeal Cloud (including its free testing environment) serves
 * them all.
 *
 * It creates its own templates and submissions and archives all of them at
 * the end (DocuSeal has no hard delete). Every submission is created with
 * send_email: false and example.com addresses, so no email goes out; one
 * submitter is completed through submitters.update, which counter-signs a
 * throwaway document. Run it on a self-hosted instance or a sandbox account,
 * never on an account with real documents.
 */
const apiKey = process.env.DOCUSEAL_API_KEY;
const baseUrl = process.env.DOCUSEAL_BASE_URL;
const logPath = process.env.DOCUSEAL_LIVE_LOG;
const seededTemplate = process.env.DOCUSEAL_TEMPLATE_ID
	? Number(process.env.DOCUSEAL_TEMPLATE_ID)
	: undefined;
if (!apiKey) {
	console.warn(
		'Skipping DocuSeal live test: DOCUSEAL_API_KEY is not set, so no live request runs.',
	);
}

const live = apiKey ? describe : describe.skip;

// unknown: whatever the step returned or threw, summarised for the log.
function record(
	step: string,
	outcome: 'ok' | 'error' | 'expected_error',
	detail: unknown,
) {
	if (!logPath) return;
	appendFileSync(
		logPath,
		`${JSON.stringify({ step, outcome, detail, at: new Date().toISOString() })}\n`,
	);
}

function resign(body: string, secret: string): string {
	const ts = Math.floor(Date.now() / 1000);
	return `${ts}.${createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;
}

live('DocuSeal live', () => {
	jest.setTimeout(120_000);
	const testDb = createTestDatabase();
	const corsair = createCorsair({
		plugins: [docuseal({ key: apiKey, baseUrl })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	const api = corsair.docuseal.api;
	const templates: number[] = [];
	const submissions: number[] = [];
	const stamp = Date.now();
	const html =
		'<p>Corsair live test</p><p><text-field name="Name" role="Signer"></text-field></p><p><signature-field name="Signature" role="Signer"></signature-field></p>';

	async function step<T>(name: string, run: () => Promise<T>): Promise<T> {
		try {
			const result = await run();
			record(name, 'ok', summarise(result));
			return result;
		} catch (error) {
			record(name, 'error', error instanceof Error ? error.message : error);
			throw error;
		}
	}

	/**
	 * A Pro operation: on a community install (DOCUSEAL_TEMPLATE_ID set) its
	 * route doesn't exist, so a 404 is the expected answer.
	 */
	async function pro<T>(name: string, run: () => Promise<T>) {
		try {
			const result = await run();
			record(name, 'ok', summarise(result));
			return result;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (seededTemplate !== undefined && /DocuSeal 404/.test(message)) {
				record(
					name,
					'expected_error',
					`${message} (community edition: Pro route)`,
				);
				return undefined;
			}
			record(name, 'error', message);
			throw error;
		}
	}

	// unknown: any operation's result; only ids and counts go to the log.
	function summarise(result: unknown): unknown {
		if (Array.isArray(result)) return { items: result.length };
		if (result && typeof result === 'object') {
			const value = result as Record<string, unknown>;
			if (Array.isArray(value.data)) {
				return { items: value.data.length, pagination: value.pagination };
			}
			return { id: value.id, status: value.status, keys: Object.keys(value) };
		}
		return result;
	}

	beforeAll(async () => {
		await createIntegrationAndAccount(testDb.db, 'docuseal', 'default');
	});

	afterAll(async () => {
		for (const id of submissions) {
			await step('cleanup.submissions.archive', () =>
				api.submissions.archive({ id }),
			).catch(() => undefined);
		}
		for (const id of templates) {
			await step('cleanup.templates.archive', () =>
				api.templates.archive({ id }),
			).catch(() => undefined);
		}
		testDb.cleanup();
	});

	let htmlTemplate = 0;
	let pdfTemplate = 0;

	it('templates: create from HTML, PDF, DOCX; clone, merge, read, update', async () => {
		const fromHtml = await pro('templates.createFromHtml', () =>
			api.templates.createFromHtml({
				html,
				name: `corsair-live-html-${stamp}`,
				external_id: `corsair-live-${stamp}`,
			}),
		);
		if (fromHtml) {
			templates.push(fromHtml.id);
			expect(fromHtml.submitters?.[0]?.name).toBe('Signer');
		}
		const base = fromHtml?.id ?? seededTemplate;
		if (base === undefined) throw new Error('no template to work with');

		// The rest works on a clone, so a seeded template stays untouched.
		const clone = await step('templates.clone', () =>
			api.templates.clone({
				id: base,
				name: `corsair-live-clone-${stamp}`,
				external_id: `corsair-live-${stamp}`,
			}),
		);
		templates.push(clone.id);
		expect(clone.id).not.toBe(base);
		htmlTemplate = clone.id;

		const fromPdf = await pro('templates.createFromPdf', () =>
			api.templates.createFromPdf({
				name: `corsair-live-pdf-${stamp}`,
				documents: [
					{
						name: 'live.pdf',
						file: LIVE_PDF_BASE64,
						fields: [
							{
								name: 'Signature',
								type: 'signature',
								role: 'Signer',
								areas: [{ x: 0.1, y: 0.8, w: 0.3, h: 0.05, page: 1 }],
							},
						],
					},
				],
			}),
		);
		if (fromPdf) templates.push(fromPdf.id);
		pdfTemplate = fromPdf?.id ?? base;

		const fromDocx = await pro('templates.createFromDocx', () =>
			api.templates.createFromDocx({
				name: `corsair-live-docx-${stamp}`,
				documents: [{ name: 'live.docx', file: LIVE_DOCX_BASE64 }],
			}),
		);
		if (fromDocx) templates.push(fromDocx.id);

		const merged = await pro('templates.merge', () =>
			api.templates.merge({
				template_ids: [htmlTemplate, pdfTemplate],
				name: `corsair-live-merge-${stamp}`,
			}),
		);
		if (merged) templates.push(merged.id);

		const list = await step('templates.list', () =>
			api.templates.list({ q: `corsair-live`, limit: 100 }),
		);
		expect(list.data.map((t) => t.id)).toContain(htmlTemplate);

		const got = await step('templates.get', () =>
			api.templates.get({ id: htmlTemplate }),
		);
		expect(got.external_id).toBe(`corsair-live-${stamp}`);

		await step('templates.update', () =>
			api.templates.update({
				id: htmlTemplate,
				name: `corsair-live-html-renamed-${stamp}`,
			}),
		);
		const renamed = await api.templates.get({ id: htmlTemplate });
		expect(renamed.name).toBe(`corsair-live-html-renamed-${stamp}`);

		const docs = await pro('templates.updateDocuments', () =>
			api.templates.updateDocuments({
				id: htmlTemplate,
				documents: [{ name: 'second.pdf', file: LIVE_PDF_BASE64 }],
			}),
		);
		if (docs) expect((docs.documents ?? []).length).toBeGreaterThanOrEqual(2);
	});

	let submissionId = 0;
	let submitterId = 0;

	it('submissions: create (all five ways), read, update, documents', async () => {
		const created = await step('submissions.create', () =>
			api.submissions.create({
				template_id: htmlTemplate,
				send_email: false,
				submitters: [
					{
						role: 'Signer',
						email: 'signer@example.com',
						name: 'Live Signer',
						external_id: `corsair-live-${stamp}`,
					},
				],
			}),
		);
		expect(created).toHaveLength(1);
		const first = created[0];
		if (!first) throw new Error('submissions.create returned no submitter');
		submitterId = first.id;
		submissionId = first.submission_id ?? 0;
		submissions.push(submissionId);

		const oneoff = {
			send_email: false,
			submitters: [{ role: 'Signer', email: 'oneoff@example.com' }],
		};
		const fromPdf = await pro('submissions.createFromPdf', () =>
			api.submissions.createFromPdf({
				...oneoff,
				name: `corsair-live-oneoff-pdf-${stamp}`,
				documents: [
					{
						name: 'live.pdf',
						file: LIVE_PDF_BASE64,
						fields: [
							{
								name: 'Signature',
								type: 'signature',
								role: 'Signer',
								areas: [{ x: 0.1, y: 0.8, w: 0.3, h: 0.05, page: 1 }],
							},
						],
					},
				],
			}),
		);
		if (fromPdf) submissions.push(fromPdf.id);

		const fromHtml = await pro('submissions.createFromHtml', () =>
			api.submissions.createFromHtml({
				...oneoff,
				name: `corsair-live-oneoff-html-${stamp}`,
				documents: [{ html, name: 'live' }],
			}),
		);
		if (fromHtml) submissions.push(fromHtml.id);

		const fromDocx = await pro('submissions.createFromDocx', () =>
			api.submissions.createFromDocx({
				...oneoff,
				name: `corsair-live-oneoff-docx-${stamp}`,
				variables: { Name: 'Live Signer' },
				documents: [{ name: 'live.docx', file: LIVE_DOCX_BASE64 }],
			}),
		);
		if (fromDocx) submissions.push(fromDocx.id);

		const fromEmails = await step('submissions.createFromEmails', () =>
			api.submissions.createFromEmails({
				template_id: htmlTemplate,
				emails: 'one@example.com, two@example.com',
				send_email: false,
			}),
		);
		// Self-hosted 3.4.0 makes one per address; Cloud's free plan (test mode
		// too) only the first (bulk send is a Pro feature), live 11-28.
		expect(fromEmails.length).toBeGreaterThanOrEqual(1);
		for (const s of fromEmails) {
			if (s.submission_id) submissions.push(s.submission_id);
		}

		const list = await step('submissions.list', () =>
			api.submissions.list({ template_id: htmlTemplate, limit: 100 }),
		);
		expect(list.data.map((s) => s.id)).toContain(submissionId);

		const got = await step('submissions.get', () =>
			api.submissions.get({ id: submissionId }),
		);
		expect(got.submitters?.[0]?.email).toBe('signer@example.com');

		const updated = await step('submissions.update', () =>
			api.submissions.update({
				id: submissionId,
				name: `corsair-live-submission-${stamp}`,
				expire_at: '2030-01-01 00:00:00 UTC',
			}),
		);
		expect(updated.id).toBe(submissionId);

		const docs = await step('submissions.getDocuments', () =>
			api.submissions.getDocuments({ id: submissionId }),
		);
		expect(docs.id).toBe(submissionId);
	});

	it('submitters: list, get, update and complete one', async () => {
		const list = await step('submitters.list', () =>
			api.submitters.list({ submission_id: submissionId }),
		);
		expect(list.data.map((s) => s.id)).toContain(submitterId);

		const got = await step('submitters.get', () =>
			api.submitters.get({ id: submitterId }),
		);
		expect(got.email).toBe('signer@example.com');

		const done = await step('submitters.update', () =>
			api.submitters.update({
				id: submitterId,
				send_email: false,
				values: { Name: 'Live Signer', Signature: 'Live Signer' },
				completed: true,
			}),
		);
		expect(done.status).toBe('completed');

		const after = await api.submissions.get({ id: submissionId });
		expect(after.status).toBe('completed');
	});

	it('archives, and reads back the archived state', async () => {
		// Ids leave the cleanup lists only once their archive succeeded.
		const extra = submissions.at(-1);
		if (extra === undefined) throw new Error('no submission to archive');
		const archived = await step('submissions.archive', () =>
			api.submissions.archive({ id: extra }),
		);
		submissions.pop();
		expect(archived.archived_at).toBeTruthy();

		const template = templates.at(-1);
		if (template === undefined) throw new Error('no template to archive');
		const archivedTemplate = await step('templates.archive', () =>
			api.templates.archive({ id: template }),
		);
		templates.pop();
		expect(archivedTemplate.archived_at).toBeTruthy();
	});

	it('account, events and tools routes', async () => {
		const me = await step('users.me', () => api.users.me({}));
		expect(me.id).toBeGreaterThan(0);

		const forms = await step('events.listFormCompleted', () =>
			api.events.listFormCompleted({ limit: 10 }),
		);
		expect(forms.data.some((e) => e.data.id === submitterId)).toBe(true);

		const subs = await step('events.listSubmissionCompleted', () =>
			api.events.listSubmissionCompleted({ limit: 10 }),
		);
		expect(
			subs.data.every((e) => e.event_type === 'submission.completed'),
		).toBe(true);

		const merged = await step('tools.mergePdfs', () =>
			api.tools.mergePdfs({ files: [LIVE_PDF_BASE64, LIVE_PDF_BASE64] }),
		);
		expect(Buffer.from(merged.data, 'base64').subarray(0, 5).toString()).toBe(
			'%PDF-',
		);

		const verified = await step('tools.verifyPdf', () =>
			api.tools.verifyPdf({ file: LIVE_PDF_BASE64 }),
		);
		expect(verified.checksum_status).toBe('not_found');
		expect(verified.signatures).toEqual([]);
	});

	const hooksUrl = process.env.DOCUSEAL_HOOKS_URL;
	const hookSecret = process.env.DOCUSEAL_WEBHOOK_SECRET;
	(hooksUrl && hookSecret ? it : it.skip)(
		'real webhook deliveries pass the signature check and payload schemas',
		async () => {
			// Deliveries go out from a background job; give them a moment.
			await new Promise((resolve) => setTimeout(resolve, 8_000));
			const text = await (await fetch(String(hooksUrl))).text();
			const deliveries = text
				.split('\n')
				.filter(Boolean)
				.map(
					(line) =>
						JSON.parse(line) as {
							headers: Record<string, string>;
							body: string;
						},
				);
			const seen = new Set<string>();
			for (const delivery of deliveries) {
				const headers = Object.fromEntries(
					Object.entries(delivery.headers).map(([k, v]) => [
						k.toLowerCase(),
						v,
					]),
				);
				const payload = JSON.parse(delivery.body) as { event_type: string };
				const signature = headers['x-docuseal-signature'] ?? '';
				const sentAt = Number(signature.split('.')[0]);
				const request = { headers, payload, rawBody: delivery.body };
				expect(verifyDocuSealWebhook(request, hookSecret, sentAt)).toEqual({
					valid: true,
				});
				expect(
					verifyDocuSealWebhook(request, 'whsec_wrong', sentAt).valid,
				).toBe(false);
				const id = webhookIdFor(payload.event_type);
				expect(id).toBeDefined();
				const [group, name] = payload.event_type.split('.') as [
					keyof typeof docuSealWebhooksNested,
					string,
				];
				// unknown: each group holds differently typed webhooks; only handler() is called.
				const webhook = (
					docuSealWebhooksNested[group] as unknown as Record<
						string,
						| {
								handler: (
									ctx: never,
									request: never,
								) => Promise<{ success: boolean }>;
						  }
						| undefined
					>
				)[name];
				if (!webhook) throw new Error(`no webhook for ${payload.event_type}`);
				// Re-sign with "now" so the five-minute window doesn't depend on
				// how long the suite ran; the original signature was checked above.
				const result = await webhook.handler(
					{ key: hookSecret, $log: undefined } as never,
					{
						...request,
						headers: {
							...headers,
							'x-docuseal-signature': resign(delivery.body, String(hookSecret)),
						},
					} as never,
				);
				expect(result.success).toBe(true);
				seen.add(payload.event_type);
			}
			record('webhooks', 'ok', {
				deliveries: deliveries.length,
				events: [...seen].sort(),
			});
			expect(seen.has('form.completed')).toBe(true);
			expect(seen.has('submission.created')).toBe(true);
		},
	);

	it('maps a missing record to a 404 ApiError with DocuSeal’s reason', async () => {
		await expect(
			step('error.templates.get.404', () =>
				api.templates.get({ id: 999_999_999 }),
			),
		).rejects.toThrow(/DocuSeal 404/);
	});
});
